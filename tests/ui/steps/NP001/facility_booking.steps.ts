import { createBdd } from 'playwright-bdd';
import { test } from '@fixtures/pages.fixture';


const { Given, When, Then } = createBdd(test);

// ============================================
// GIVEN: User Login & Navigation
// ============================================

/**
 * Login as a specific user and navigate to facility catalogue
 * Step: Given user 'systemAdmin' is on facility catalogue page
 */
Given('user {string} is on facility catalogue page', async ({  loginAs, facilityPage }, userAlias: string) => {
  // Login as the specified user
  await loginAs(userAlias);
  // Navigate to facility catalogue page
  await facilityPage.open();
  console.log(`User '${userAlias}' navigated to facility catalogue page`);
});


When('user creates a new facility using test data from {string}', async ({ facilityPage }, filename: string) => {
  await facilityPage.createFacility(filename);
  console.log(`Facility creation initiated with test data from: ${filename}.json`);
});

// ============================================
// THEN: Verify & Cleanup
// ============================================

Then('the facility should be created successfully', async ({ facilityPage }) => {
  await facilityPage.verifyFacilityAdded();
  console.log('Facility created and verified successfully');
});

Then('delete the created facility to clean up', async ({ facilityPage }) => {
  await facilityPage.deleteCreatedFacility();
  console.log('Created facility deleted successfully');
});