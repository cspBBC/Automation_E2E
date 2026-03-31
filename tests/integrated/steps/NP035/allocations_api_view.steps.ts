import { createBdd } from 'playwright-bdd';
import { test, expect } from '@fixtures/fixture';
import {
  API_CONFIG,
  loadTestParameters,
  makeApiRequest,
  getSharedContext
} from './allocationApi.helper';

const { Given, When, Then } = createBdd(test);

// ============ BDD STEPS - VIEW/GET OPERATIONS ============

Given('user {string} is authenticated', async ({ authenticateWithNtlm }, userName: string) => {
  const requestContext = getSharedContext();
  console.log(`[AUTH] Authenticating as: ${userName}`);
  requestContext.authenticatedPage = await authenticateWithNtlm(userName);
  console.log(`[OK] NTLM session ready for API requests`);
});

When('the system admin hits mark-action.php to view allocation with {string} parameters', async ({}, scenario: string) => {
  const requestContext = getSharedContext();
  const params = {
    ...loadTestParameters('allocations/data/allocationApi_GetParams.json', scenario),
    action: API_CONFIG.actions.VIEW
  };
  
  await makeApiRequest(
    requestContext,
    'GET',
    API_CONFIG.endpoints.markAction,
    params,
    `VIEW - Read-only access (scenario: ${scenario})`
  );
});

Then('verify the view endpoint returned success', async ({}) => {
  const requestContext = getSharedContext();
  console.log(`\n[VERIFY] Verification: [${requestContext.method}] Status ${requestContext.status}`);
  
  expect(requestContext.status).toBeGreaterThanOrEqual(200);
  expect(requestContext.status).toBeLessThan(400);
  
  const responseData = requestContext.body ? JSON.parse(requestContext.body) : {};
  expect(responseData).toHaveProperty('success');
  expect(responseData.success).toBe(true);
  
  console.log(`[OK] Endpoint working! Response received successfully.\n`);
});
