import { test as bddTest } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { FacilityPage } from '../ui/page/NP001/FacilityPage'; 

export type PageFixtures = {
  facilityPage: FacilityPage;
};


export const test = bddTest.extend<PageFixtures>({
  facilityPage: async ({ page }, use) => {
    const facilityPage = new FacilityPage(page);
    await use(facilityPage);
  },
});

export { expect };
