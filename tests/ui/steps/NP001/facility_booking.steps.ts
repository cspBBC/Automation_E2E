import { createBdd } from 'playwright-bdd';
import { test } from '@fixtures/pages.fixture';

const { Given, When, Then } = createBdd(test);

Given('user is on facility catalogue page', async ({ facilityPage }) => {
  await facilityPage.open();
  console.log('✅ User navigated to facility catalogue page');
});

When('user creates a new facility using test data from {string}', async ({ facilityPage }, filename: string) => {
  await facilityPage.createFacility(filename);
  console.log(`✅ Facility creation initiated with test data from: ${filename}.json`);
});

Then('the facility should be created successfully', async ({ facilityPage }) => {
  await facilityPage.verifyFacilityAdded();
});