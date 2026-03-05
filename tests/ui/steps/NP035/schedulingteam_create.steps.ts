import { createBdd } from 'playwright-bdd';
import { test } from '@fixtures/pages.fixture';

const { Given, When, Then } = createBdd(test);

// ============================================
// GIVEN: User Login & Navigation
// ============================================

/**
 * Login as a specific user and navigate to Scheduling Team page
 * Step: Given user 'areaAdmin_News' is on Show Scheduled Team page
 */
Given('user {string} is on Show Scheduled Team page', async ({ loginAs, scheduledteamPage }, userAlias: string) => {
  // Login as the specified user
  await loginAs(userAlias);
  // Navigate to Scheduling Team page
  await scheduledteamPage.open();
  console.log(`User '${userAlias}' navigated to Show Scheduled Team page`);
});

// ============================================
// WHEN: Create Scheduling Team
// ============================================

When('user creates a new scheduling team using test data from {string}', async ({ scheduledteamPage }, filename: string) => {
  await scheduledteamPage.createScheduledTeam(filename);
  console.log(`Scheduling Team creation initiated with test data from: ${filename}.json`);
});
