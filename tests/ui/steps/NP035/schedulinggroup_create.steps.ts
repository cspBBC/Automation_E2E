import { createBdd } from 'playwright-bdd';
import { test } from '@fixtures/pages.fixture';

const { Given, When, Then } = createBdd(test);

// ============================================
// GIVEN: User Login & Navigation
// ============================================

/**
 * Login as a specific user and navigate to Scheduling Group page
 * Step: Given user 'systemAdmin' is on Show Scheduled Group page
 */
Given('user {string} is on Show Scheduled Group page', async ({ loginAs, scheduledGroupPage }, userAlias: string) => {
  // Login as the specified user
  await loginAs(userAlias);
  // Navigate to Scheduling Group page
  await scheduledGroupPage.open();
  console.log(`User '${userAlias}' navigated to Show Scheduled Group page`);
});

// ============================================
// WHEN: Create Scheduling Team
// ============================================

When('user creates a new scheduling group using test data from {string}', async ({ scheduledGroupPage }, filename: string) => {
  await scheduledGroupPage.createScheduledGroup(filename);
  console.log(`Scheduling Group creation initiated with test data from: ${filename}.json`);
});

Then('the scheduling group should be visible in the list', async ({ scheduledGroupPage }) => {
  await scheduledGroupPage.verifyScheduledGroupVisibleForUser('areaAdmin_News');
  console.log('Scheduling Group verified in the list');
});

/**
 * Verify that a scheduling group created by a specific user is visible in the list
 * Step: Then the scheduling group created by 'areaAdmin_News' should be visible in the list
 */
Then('the scheduling group created by {string} should be visible in the list', async ({ scheduledGroupPage }, userAlias: string) => {
  await scheduledGroupPage.verifyScheduledGroupVisibleForUser(userAlias);
  console.log(`Scheduling Group created by '${userAlias}' verified in the list`);
});
