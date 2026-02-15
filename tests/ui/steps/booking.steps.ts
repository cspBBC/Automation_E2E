import { createBdd } from 'playwright-bdd';
import {test} from '@fixtures/pages.fixture'


const { Given, When, Then } = createBdd(test);

Given('user opens the Allocate application', async ({ homePage }) => {
  await homePage.open();
  await homePage.isBbcMenuLoaded();

});
When('user create new facility', async ({homePage}) => {

  await homePage.createFacility()

  await homePage.verifyFacilityAdded()

  await homePage.assertViewFacility()

  await homePage.deleteFacility()
  
});