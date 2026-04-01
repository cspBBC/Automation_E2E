import { createBdd } from 'playwright-bdd';
import { test, expect } from '@fixtures/fixture';
import { getSharedContext, loadTestParameters } from '@helpers/apiHelper';
import {
  API_CONFIG,
  makeApiRequest
} from './allocationApi.helper';

const { When, Then } = createBdd(test);

When('the user hits mark-action.php to edit allocation with {string} and {string} parameters', async ({}, testDataFile: string, scenario: string) => {
  const requestContext = getSharedContext();
  
  const params = {
    ...loadTestParameters(`${API_CONFIG.dataPath}/${testDataFile}`, scenario),
    action: API_CONFIG.actions.EDIT
  };
  
  await makeApiRequest(
    requestContext,
    'POST',
    API_CONFIG.endpoints.markAction,
    params,
    `EDIT - Modify allocation (scenario: ${scenario})`
  );
});

Then('verify the edit endpoint returned expected response', async ({}) => {
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
