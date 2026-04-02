import { createBdd } from 'playwright-bdd';
import sql from 'mssql';
import { test, expect } from '@fixtures/fixture';
import { getSharedContext, loadTestParameters } from '@helpers/apiHelper';
import { AllocationQueries } from '@workflows/integrated/allocations/data/db/queries/allocations.queries';
import {
  API_CONFIG,
  makeApiRequest
} from './allocationApi.helper';

// Shared context for storing captured allocation IDs between steps
const scenarioContext: { allocationsDutyId?: number } = {};

// Helper function to substitute template variables in parameters
function substituteTemplateVariables(params: any, context: any): any {
  const substituted = { ...params };
  
  Object.keys(substituted).forEach(key => {
    if (typeof substituted[key] === 'string' && substituted[key].includes('{{')) {
      // Replace template variables like {{allocationsDutyId}}
      substituted[key] = substituted[key].replace(/{{(\w+)}}/g, (_match, varName) => {
        return context[varName] || _match;
      });
    }
  });
  
  return substituted;
}

// Merge fixtures for both API and DB access
const { When, Then } = createBdd(test);

When('the user hits mark-action.php with {string} and {string} parameters', async ({}, testDataFile: string, operation: string) => {
  const requestContext = getSharedContext();
  
  const params = {
    ...loadTestParameters(`${API_CONFIG.dataPath}/${testDataFile}`, operation),
    action: API_CONFIG.actions.EDIT
  };
  
  await makeApiRequest(
    requestContext,
    'POST',
    API_CONFIG.endpoints.markAction,
    params,
    `API Operation - ${operation}`
  );
});

When('the user edits the duty with {string} and {string} parameters using captured AllocationsDutyID', async ({}, testDataFile: string, operation: string) => {
  const requestContext = getSharedContext();
  
  // Load test parameters for edit operation
  let params = loadTestParameters(`${API_CONFIG.dataPath}/${testDataFile}`, operation);
  
  // Substitute template variables with captured values from previous steps
  params = substituteTemplateVariables(params, scenarioContext);
  
  console.log(`\n[EDIT-STEP] Editing duty with captured AllocationsDutyID: ${scenarioContext.allocationsDutyId}`);
  console.log(`            New DutyName: ${params.DutyName}`);
  console.log(`            StartTime: ${params.StartTime} -> EndTime: ${params.EndTime}`);
  
  // Add action parameter
  params.action = API_CONFIG.actions.EDIT;
  
  await makeApiRequest(
    requestContext,
    'POST',
    API_CONFIG.endpoints.markAction,
    params,
    `API Operation - ${operation} (Update AllocationsDutyID: ${scenarioContext.allocationsDutyId})`
  );
});

Then('verify the API endpoint returned expected response', async ({}) => {
  const requestContext = getSharedContext();
  console.log(`\n[VERIFY] Verification: [${requestContext.method}] Status ${requestContext.status}`);
  
  expect(requestContext.status).toBeGreaterThanOrEqual(200);
  expect(requestContext.status).toBeLessThan(500);
  
  const responseData = requestContext.body ? JSON.parse(requestContext.body) : {};
  expect(responseData).toHaveProperty('success');
  expect(responseData.success).toBe(true);
  console.log(`[RESPONSE] Operation completed with result:`, responseData);
  console.log(`[OK] Endpoint processed successfully.\n`);
});

Then('verify duty operation completed with {string} and {string} parameters in database', async ({ db }, testDataFile: string, operation: string) => {
  const requestContext = getSharedContext();
  
  // Load test parameters
  const testParams = loadTestParameters(`${API_CONFIG.dataPath}/${testDataFile}`, operation);
  console.log(`\n[STEP-1] Test Parameters loaded for operation: '${operation}'`);
  console.log(`         DutyName: ${testParams.DutyName}`);
  console.log(`         DutyDate: ${testParams.DutyDate}`);
  console.log(`         SchedulingTeamID: ${testParams.SchedulingTeamID}`);
  
  // Capture API response
  const responseData = requestContext.body ? JSON.parse(requestContext.body) : {};
  console.log(`\n[STEP-2] API Response Status: ${requestContext.status}`);
  console.log(`         Response Success: ${responseData.success || 'N/A'}`);
  
  // Verify API call was successful
  expect(requestContext.status).toBeGreaterThanOrEqual(200);
  expect(requestContext.status).toBeLessThan(500);
  expect(responseData.success).toBe(true);
  
  // Query database to get allocationsDutyId confirmation
  console.log(`\n[STEP-3] Querying database for allocationsDutyId confirmation...`);
  console.log(`         Using DutyName and DutyDate to find duty record...`);
  
  try {
    // Query by DutyName and DutyDate - most reliable way to verify duty operation was completed
    const result = await db
      .request()
      .input('DutyName', sql.NVarChar(255), testParams.DutyName)
      .input('DutyDate', sql.Date, testParams.DutyDate)
      .query(AllocationQueries.verifyDutyCreated);
    
    console.log(`[STEP-3] Database query executed successfully`);
    console.log(`         Records returned: ${result.recordset.length}`);
    
    // Verify records exist
    expect(result.recordset.length).toBeGreaterThan(0);
    
    // Extract allocationsDutyId (AD_AllocationsDutyID from first record)
    const dutyRecord = result.recordset[0];
    const allocationsDutyId = dutyRecord.AD_AllocationsDutyID;
    
    console.log(`\n[CONFIRMATION] ✓ Duty operation confirmed in database`);
    console.log(`════════════════════════════════════════════════════`);
    console.log(`✓ AllocationsDutyID: ${allocationsDutyId}`);
    console.log(`  AllocationsID: ${dutyRecord.AD_AllocationsID}`);
    console.log(`  DutyName: ${dutyRecord.AD_DutyName}`);
    console.log(`  DutyDate: ${dutyRecord.AD_DutyDate}`);
    console.log(`════════════════════════════════════════════════════\n`);
    
    // Store the captured ID for use in subsequent steps (e.g., edit operation)
    scenarioContext.allocationsDutyId = allocationsDutyId;
    console.log(`[CONTEXT] AllocationsDutyID stored for reuse: ${allocationsDutyId}\n`);
    
  } catch (error) {
    console.log(`\n[ERROR] Database verification failed`);
    console.log(`        Error: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
});

Then('verify the edit captured AllocationsDutyID successfully', async ({}) => {
  console.log(`\n[TEMPLATE-VERIFY] Verifying AllocationsDutyID template substitution...`);
  
  if (!scenarioContext.allocationsDutyId) {
    throw new Error('AllocationsDutyID was not captured in previous steps');
  }
  
  console.log(`✓ AllocationsDutyID successfully captured and stored: ${scenarioContext.allocationsDutyId}`);
  console.log(`✓ Template substitution would replace {{allocationsDutyId}} with: ${scenarioContext.allocationsDutyId}`);
  console.log(`✓ Template-based edit parameters prepared successfully\n`);
  
  expect(scenarioContext.allocationsDutyId).toBeDefined();
  expect(typeof scenarioContext.allocationsDutyId).toBe('number');
});
