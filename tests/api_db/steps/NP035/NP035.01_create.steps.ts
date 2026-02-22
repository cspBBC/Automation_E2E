
import { createBdd } from 'playwright-bdd';
import { test, expect } from '@fixtures/test.fixture';
import { applySeed, getSeedTestData, startTransaction} from '@workflows/schd-group/db/seed/db.seed';
import { SchedulingGroupQueries } from '@workflows/schd-group/db/queries/schedulingGroup.queries';
import { schedulingGroupEndpoints } from '@workflows/schd-group/api/endpoints';
import { requestHeaders } from '@workflows/schd-group/data/payloads';

const { Given, When, Then } = createBdd(test);

/**
 * ============================================
 * BACKGROUND & SETUP STEPS
 * ============================================
 */

Given('the test database is seeded with areas, users, and teams', async ({ db }) => {
  await applySeed(db);
  await startTransaction(db);
  console.log('✅ Database seeded and transaction started');
});

Given('the following test users are available:', async ({ db }, table: any) => {
  const seedData = await getSeedTestData(db);
  console.log('📋 Test users available:', seedData);
  expect(seedData.systemAdmin).toBeTruthy();
  expect(seedData.areaAdmin_Area10).toBeTruthy();
});

/**
 * ============================================
 * AUTHENTICATION STEPS
 * ============================================
 */

Given('user {int} ({}) is authenticated', async ({ request }, userId: number, role: string) => {
  (request as any).authenticatedUserId = userId;
  (request as any).authenticatedRole = role;
  console.log(`🔐 Authenticated as user ${userId} (${role})`);
});

/**
 * ============================================
 * REQUEST SETUP STEPS
 * ============================================
 */

When('the user submits a POST request to create a Scheduling Group with:', async ({ request }, table: any) => {
  const rows = table.hashes();
  const payload: any = {};

  // Parse table data
  for (const row of rows) {
    const field = row.Field;
    let value = row.Value;

    // Handle dynamic timestamps
    if (value?.includes('<timestamp>')) {
      value = value.replace('<timestamp>', Date.now().toString());
    }

    // Parse boolean values
    if (value === 'true') value = true;
    if (value === 'false') value = false;

    // Parse numeric values
    if (field === 'area' && !isNaN(value)) {
      value = parseInt(value);
    }

    payload[field] = value;
  }

  (request as any).lastPayload = payload;

  // Make API call with authentication header
  const headers = (request as any).authenticatedUserId 
    ? requestHeaders.withUserId((request as any).authenticatedUserId)
    : {};

  const response = await request.post(schedulingGroupEndpoints.create, {
    data: payload,
    headers
  });

  (request as any).lastResponse = response;
  (request as any).lastResponseBody = await response.json().catch(() => null);

  console.log(`📤 POST ${schedulingGroupEndpoints.create}`);
  console.log(`   Payload:`, JSON.stringify(payload));
  console.log(`   Status: ${response.status()}`);
});

/**
 * ============================================
 * RESPONSE ASSERTION STEPS
 * ============================================
 */

Then('the response status code should be {int}', async ({ request }, expectedStatus: number) => {
  const response = (request as any).lastResponse;
  expect(response.status()).toBe(expectedStatus);
  console.log(`✅ Response status: ${response.status()}`);
});

Then('the response should contain the created Scheduling Group ID', async ({ request }) => {
  const body = (request as any).lastResponseBody;
  expect(body).toBeDefined();
  expect(body.id).toBeDefined();
  (request as any).createdId = body.id;
  console.log(`✅ Created Scheduling Group ID: ${body.id}`);
});

/**
 * ============================================
 * DATABASE ASSERTION STEPS
 * ============================================
 */

Then('the Scheduling Group should be created in the database with:', async ({ db, request }, table: any) => {
  const rows = table.hashes();
  const createdId = (request as any).createdId;

  const record = await SchedulingGroupQueries.getById(db, createdId);
  expect(record).toBeTruthy();

  for (const row of rows) {
    const field = row.Field;
    let expectedValue: any = row['Expected Value'];

    // Map feature file field names to DB column names
    const fieldMap: any = {
      'scheduling_group_name': 'scheduling_group_name',
      'area': 'area',
      'allocations_menu': 'allocations_menu',
      'notes': 'notes',
      'last_amended_by': 'last_amended_by'
    };

    const dbField = fieldMap[field] || field;

    // Parse expected values
    if (expectedValue?.includes('(true)')) {
      expectedValue = 1;
    } else if (expectedValue?.includes('(false)')) {
      expectedValue = 0;
    } else if (!isNaN(expectedValue)) {
      expectedValue = parseInt(expectedValue);
    }

    expect(record[dbField]).toBe(expectedValue);
    console.log(`✅ DB field "${field}" = "${expectedValue}"`);
  }
});

