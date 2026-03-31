import { createBdd } from 'playwright-bdd';
import { test, expect } from '@fixtures/fixture';
import {
  API_CONFIG,
  loadTestParameters,
  makeApiRequest,
  getSharedContext
} from './allocationApi.helper';

const { Given, When, Then } = createBdd(test);

// Shared Given step: 'user {string} is authenticated' (defined in allocations_api_view.steps.ts)

When('the system admin hits mark-action.php to edit allocation with {string} parameters', async ({}, scenario: string) => {
  const requestContext = getSharedContext();
  const params = {
    ...loadTestParameters('allocations/data/allocationApi_PostParams.json', scenario),
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
