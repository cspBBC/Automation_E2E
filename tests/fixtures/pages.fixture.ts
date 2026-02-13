import { test as bddTest } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { HomePage } from '../ui/page/HomePage'; 

export type PageFixtures = {
  homePage: HomePage;
};


export const test = bddTest.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
});

export { expect };
