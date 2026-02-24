
import { createBdd } from 'playwright-bdd';
import { test, expect } from '@fixtures/test.fixture';
import { SchedulingGroupQueries } from '@workflows/schd-group/db/queries/schedulingGroup.queries';
import { schedulingGroupEndpoints } from '@workflows/schd-group/api/endpoints';
import { readJSON } from '@helpers/readJson';
import path from 'path';

const { Given, When, Then } = createBdd(test);

let currentUserId: number;
let apiResponse: any;
let lastSchedulingGroupId: number;

Given('user {string} is authenticated', async ({ authenticateAs, ensureUserExists }, userAlias: string) => {
  // Verify user exists in database first
  const user = await ensureUserExists(userAlias);
  
  currentUserId = user.id;
  await authenticateAs(user.id);
});

// When('the user submits a POST request to create a Scheduling Group with default payload', async ({ apiClient }) => {   
//   const payloads = await readJSON(path.resolve(process.cwd(), 'workflows/schd-group/data/payloads.json'));
//   const payload = payloads['schd-group-create'];
//   const response = await apiClient.post(
//     schedulingGroupEndpoints.create,
//     payload
//   );
//   apiResponse = response;
//   console.log('📤 POST request submitted');
// });

// Then('the response status code should be {int}', async ({}, expectedStatus: number) => {
//   expect(apiResponse.status()).toBe(expectedStatus);
//   console.log(`✅ Response status: ${expectedStatus}`);
// });

// Then('the response should contain the created Scheduling Group ID', async ({}) => {
//   const body = await apiResponse.json();
//   lastSchedulingGroupId = body.id;
//   expect(lastSchedulingGroupId).toBeTruthy();
//   console.log(`✅ Scheduling Group ID: ${lastSchedulingGroupId}`);
// });

// Then('the Scheduling Group should be created in the database', async ({ db }) => {
//   const dbRecord = await SchedulingGroupQueries.getById(db, lastSchedulingGroupId);
//   expect(dbRecord).toBeTruthy();
//   console.log(`✅ Scheduling Group verified in database`);
// });