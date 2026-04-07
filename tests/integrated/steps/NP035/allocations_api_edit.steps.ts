import { createBdd, DataTable } from 'playwright-bdd';
import sql from 'mssql';
import { createAPIFixture, expect } from '@fixtures/api.fixture';
import { AllocationContext } from '@workflows/integrated/allocations/context/context';
import { loadTestParameters } from '@helpers/apiHelper';
import { AllocationQueries } from '@workflows/integrated/allocations/data/db/queries/allocations.queries';
import { API_CONFIG, makeApiRequest } from './allocationApi.helper';
import { parseDataTableToMap, resolveTemplate } from '@helpers/payloadBuilder';

// ONE LINE - inline fixture creation (no separate file needed!)
const test = createAPIFixture<AllocationContext>(() => ({
  allocationsDutyId: null,
  dutyName: null,
  dutyId: null,
  schedulingPersonId: null,
  schedulingTeamId: null,
  dutyDate: null,
  allocationsDate: null,
  allocationsSchPer: null,
}));

// Export test so bddgen can find it
export { test };

// BDD step definitions
const { When, Then } = createBdd(test);

When('the user creates a duty from testDataFile {string} with parameters:', async ({ scenarioContext, requestContext }, testDataFile: string, dataTable: DataTable) => {
  // parse parameters from DataTable, supports both key-value and direct formats
  const params = parseDataTableToMap(dataTable);
  
  if (scenarioContext.allocationsDutyId) throw new Error('Context validation failed: AllocationsDutyID is not null');
  //load the request payload template and resolve variables using the parsed parameters and scenario context
  let template = loadTestParameters(`${API_CONFIG.dataPath}/${testDataFile}`, 'duty');
  //resolveTemplate will substitute {{paramName|defaultValue}} in the template with values from params or scenarioContext
  let payload = resolveTemplate(template, params);
  // Set action to EDIT for both create and edit operations - backend uses this to determine if it's a create or edit based on presence of AllocationsDutyID
  payload.action = API_CONFIG.actions.EDIT;
  
  // Make duty name unique per test run by appending timestamp to avoid DB query conflicts
  const timestamp = Date.now();
  payload.DutyName = `${payload.DutyName}_${timestamp}`;
  
  console.log(`\n[CREATE-PAYLOAD] Request payload:\n${JSON.stringify(payload, null, 2)}\n`);
  
  // Store key parameters in scenario context for use in edit step and assertions
  scenarioContext.dutyName = payload.DutyName;
  scenarioContext.schedulingPersonId = payload.SchedulingPersonID;
  scenarioContext.schedulingTeamId = payload.SchedulingTeamID;
  scenarioContext.dutyDate = payload.DutyDate; // Use actual payload DutyDate for DB query
  scenarioContext.allocationsDate = payload.allocationsDate; // Preserve original allocationsDate for edit
  scenarioContext.allocationsSchPer = payload.allocationsSchPer; // Preserve allocationsSchPer for edit
  scenarioContext.dutyId = payload.DutyID;
  
  // Make the API request to create the duty - backend will determine if it's a create or edit based on presence of AllocationsDutyID
  await makeApiRequest(requestContext, 'POST', API_CONFIG.endpoints.markAction, payload, 'API Operation - Create Duty');
});

When('the user edits the duty from testDataFile {string} with parameters:', async ({ scenarioContext, requestContext }, testDataFile: string, dataTable: DataTable) => {
  if (!scenarioContext.allocationsDutyId) throw new Error('Cannot edit duty: allocationsDutyId not captured from creation step');
  
  const editParams = parseDataTableToMap(dataTable);
  
  const normalized: Record<string, any> = {};
  for (const [key, value] of Object.entries(editParams)) {
    const fieldName = key.startsWith('edit') ? key.substring(4) : key;
    normalized[fieldName] = value;
  }
  
  // Merge normalized parameters with scenario context values, giving precedence to parameters from the edit step
  const merged: Record<string, any> = {
    ...normalized,
    // ?? If a parameter is provided in the edit step, use it; otherwise, fall back to the value from scenario context
    allocationsDutyId: normalized.allocationsDutyId ?? String(scenarioContext.allocationsDutyId),
    DutyID: normalized.DutyID ?? scenarioContext.dutyId,
    ID: normalized.ID ?? scenarioContext.dutyId,
    SchedulingPersonID: normalized.SchedulingPersonID ?? scenarioContext.schedulingPersonId,
    SchedulingTeamID: normalized.SchedulingTeamID ?? scenarioContext.schedulingTeamId,
    DutyDate: normalized.DutyDate ?? scenarioContext.dutyDate,
    allocationsDate: normalized.allocationsDate ?? scenarioContext.allocationsDate,
    allocationsSchPer: normalized.allocationsSchPer ?? scenarioContext.allocationsSchPer,
  };
  
  let template = loadTestParameters(`${API_CONFIG.dataPath}/${testDataFile}`, 'duty');
  // resolveTemplate will substitute {{paramName|defaultValue}} in the template with values from merged parameters, which includes both edit step parameters and scenario context values
  let payload = resolveTemplate(template, merged);
  payload.isEdited = '1';
  payload.action = API_CONFIG.actions.EDIT;
  
  console.log(`\n[EDIT-PAYLOAD] Request payload:\n${JSON.stringify(payload, null, 2)}\n`);
  
  scenarioContext.dutyName = payload.DutyName;
  await makeApiRequest(requestContext, 'POST', API_CONFIG.endpoints.markAction, payload, `API Operation - Edit Duty (AllocationsDutyID: ${scenarioContext.allocationsDutyId})`);
});

Then('verify duty operation completed in database', async ({ scenarioContext, requestContext, db }) => {
  // Verify API success
  const responseData = requestContext.body ? JSON.parse(requestContext.body) : {};
  expect(requestContext.status).toBeGreaterThanOrEqual(200);
  expect(responseData.success).toBe(true);

  // Wait for DB transaction
  await new Promise(resolve => setTimeout(resolve, scenarioContext.allocationsDutyId ? 500 : 2000));

  // Query by duty name to verify operation completed
  const result = await db
    .request()
    .input('DutyName', sql.NVarChar(255), scenarioContext.dutyName)
    .query(AllocationQueries.verifyDutyCreated);

  expect(result.recordset.length).toBe(1); // Should return exactly one unique record
  const duty = result.recordset[0];

  // Capture AllocationsDutyID if not already set (for CREATE operations)
  if (!scenarioContext.allocationsDutyId) {
    scenarioContext.allocationsDutyId = duty.AD_AllocationsDutyID;
  }

  console.log(`✓ Duty verified: ${duty.AD_DutyName} (ID: ${duty.AD_AllocationsDutyID})`);
});

Then('verify the edit operation is recorded in duty history with change details', async ({ scenarioContext, db }) => {
  if (!scenarioContext.allocationsDutyId) {
    throw new Error('AllocationsDutyID was not captured in previous steps');
  }

  await new Promise(resolve => setTimeout(resolve, 500));

  const result = await db
    .request()
    .input('AttributeID', sql.Int, parseInt(String(scenarioContext.allocationsDutyId)))
    .query(AllocationQueries.getDutyHistory);

  expect(result.recordset.length).toBeGreaterThan(0);

  console.log(`✓ Edit operation recorded in history (${result.recordset.length} record(s)) for AllocationsDutyID ${scenarioContext.allocationsDutyId}`);
  result.recordset.forEach((record, index) => {
    console.log(`\nHistory record ${index + 1}:`);
    console.log(`  HistoryID: ${record.HistoryID}`);
    console.log(`  ChangeDateTime: ${record.ChangeDateTime}`);
    console.log(`  HistoryType: ${record.HistoryType}`);
    console.log(`  ChangedByUser: ${record.ChangedByUser || 'System'}`);
    console.log(`  ChangeDetails: ${record.ChangeDetails}`);
  });
});

