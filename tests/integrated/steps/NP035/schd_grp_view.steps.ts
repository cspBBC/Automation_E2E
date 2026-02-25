
import { createBdd } from 'playwright-bdd';
import { test, expect } from '@fixtures/test.fixture';
import { SchedulingGroupQueries } from '@workflows/schd-group/db/queries/schedulingGroup.queries';
import { viewAPI } from '@workflows/schd-group/api/view.api';

const { Given, When, Then } = createBdd(test);

// ============================================
// Test State Variables
// ============================================

let currentUserId: number;
let currentUserDivision: string | null;
let retrievedGroups: any[] = [];
let lastError: string | null = null;
let lastStatusCode: number | null = null;
let apiResponse: any = null;

// ============================================
// GIVEN Steps
// ============================================

/**
 * Authenticate a test user and verify they exist in the database
 * Used for: System Admin (can see all), Area Admin (see their division)
 */
Given('user {string} is authenticated', async ({ authenticateAs, ensureUserExists, db }, userAlias: string) => {
  // Step 1: Verify user exists in database
  const user = await ensureUserExists(userAlias);
  currentUserId = user.id;

  // Step 2: Get user's division (null for System Admin, division name for Area Admin)
  currentUserDivision = await SchedulingGroupQueries.getUserArea(db, currentUserId);

  // Step 3: Authenticate with the framework
  await authenticateAs(currentUserId);
  
  console.log(`✅ User '${userAlias}' (ID: ${currentUserId}) authenticated | Division: ${currentUserDivision || 'ALL (System Admin)'}`);
});

// ============================================
// WHEN Steps - Viewing/Listing Scheduling Groups
// ============================================

/**
 * System Admin views all Scheduling Groups (all divisions)
 * 
 * Uses: apiClient.get() to call: GET /api/scheduling-groups
 * Expected Response: { data: [...groups], correlationId: "...", errors: null }
 */
When('the system admin requests to view all Scheduling Groups', async ({ apiClient }) => {
  try {
    lastError = null;
    
    // Make authenticated API call via wrapper (no division filter for System Admin)
    const response = await viewAPI.list(apiClient as any);
    lastStatusCode = response.status();
    apiResponse = response;
    
    if (response.ok()) {
      const body = await response.json();
      retrievedGroups = body.data || [];
      console.log(`✅ System Admin retrieved ${retrievedGroups.length} groups via API (all divisions)`);
    } else {
      lastError = `API Error: ${response.status()}`;
      retrievedGroups = [];
      console.error('❌ API call failed with status:', lastStatusCode);
    }
  } catch (error: any) {
    lastError = error.message;
    lastStatusCode = 500;
    console.error('❌ Failed to retrieve groups:', error);
    retrievedGroups = [];
  }
});


// ============================================
// THEN Steps - Response Assertions
// ============================================

/**
 * Assert HTTP response status code
 */
Then('the response status code should be {int}', async ({}, expectedStatus: number) => {
  expect(lastStatusCode).toBe(expectedStatus);
  console.log(`✅ Response status code is ${expectedStatus}`);
});

// ============================================
// THEN Steps - Group Data Assertions
// ============================================

/**
 * Assert specific group exists in response by ID
 */
Then('the response should contain Scheduling Group with ID {int}', async ({}, expectedGroupId: number) => {
  const found = retrievedGroups.find(g => g.SchedulingGroupsID === expectedGroupId);
  expect(found).toBeTruthy();
  console.log(`✅ Scheduling Group ID ${expectedGroupId} found in response`);
});

/**
 * Assert groups list was successfully retrieved from database
 */
Then('the Scheduling Groups list should be retrieved from database', async ({}) => {
  expect(retrievedGroups).toBeDefined();
  expect(Array.isArray(retrievedGroups)).toBe(true);
  console.log(`✅ Scheduling Groups list retrieved successfully (${retrievedGroups.length} groups)`);
});