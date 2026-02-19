import { createBdd } from 'playwright-bdd';
import {test} from '@fixtures/pages.fixture'


const { Given, When, Then } = createBdd(test);

Given('user is on facility catalogue page', async ({ facilityPage }) => {
  await facilityPage.open();
  

});
When('user create new facility', async ({facilityPage}) => {

  await facilityPage.createFacility()

  await facilityPage.verifyFacilityAdded()

  await facilityPage.assertViewFacility()

  await facilityPage.deleteFacility()
  
});