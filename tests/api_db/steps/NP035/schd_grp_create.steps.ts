
import { createBdd, DataTable } from 'playwright-bdd';
import { test, expect } from '@fixtures/test.fixture';
import { applySeed, getSeedTestData, startTransaction} from '@workflows/schd-group/db/seed/db.seed';
import { SchedulingGroupQueries } from '@workflows/schd-group/db/queries/schedulingGroup.queries';
import { schedulingGroupEndpoints } from '@workflows/schd-group/api/endpoints';

const { Given, When, Then } = createBdd(test);

let currentUserId: number;
let apiResponse: any;
let lastSchedulingGroupId: number;

Given('the test database is seeded with areas, users, and teams', async ({ db }) => {
  await applySeed(db);
  await startTransaction(db);
  console.log('✅ Database seeded and transaction started');
});

Given('the following test users are available:', async ({ db }, dataTable: DataTable) => {
  const seedData = await getSeedTestData(db);
  const users = dataTable.hashes();
  
  // Verify test users from the data table are available in seed data
  users.forEach(user => {
    const userId = parseInt(user.UserId);
    const role = user.Role;
    if (role === 'SystemAdmin') {
      expect(seedData.systemAdmin).toBeTruthy();
    } else if (role === 'AreaAdmin') {
      expect(seedData.areaAdmin_Area10).toBeTruthy();
    }
  });
  
  console.log('📋 Test users available:', users);
});

Given('user {int} \\(System Admin) is authenticated', async ({ authenticateAs }, userId: number) => {
  currentUserId = userId;
  await authenticateAs(userId);
  console.log(`✅ System Admin user ${userId} authenticated`);
});

When('the user submits a POST request to create a Scheduling Group with:', async ({ apiClient }, dataTable: DataTable) => {   
  const payload = dataTable.rowsHash();
  const response = await apiClient.post(
    schedulingGroupEndpoints.create,
    payload
  );
  apiResponse = response;
  console.log('📤 POST request submitted to create Scheduling Group');
});

Then('the response status code should be {int}', async ({}, expectedStatus: number) => {
  expect(apiResponse.status()).toBe(expectedStatus);
  console.log(`✅ Response status code is ${expectedStatus}`);
});

Then('the response should contain the created Scheduling Group ID', async ({}) => {
  const body = await apiResponse.json();
  lastSchedulingGroupId = body.id;
  expect(lastSchedulingGroupId).toBeTruthy();
  console.log(`✅ Scheduling Group created with ID: ${lastSchedulingGroupId}`);
});

Then('the Scheduling Group should be created in the database with:', async ({ db }, dataTable: DataTable) => {
  const expectedData = dataTable.rowsHash();
  const dbRecord = await SchedulingGroupQueries.getById(db, lastSchedulingGroupId);
  expect(dbRecord).toBeTruthy();
  Object.entries(expectedData).forEach(([key, value]) => {
    expect(dbRecord[key]).toBe(value);
  });
  console.log(`✅ Scheduling Group verified in database with expected data`);
});