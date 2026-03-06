
import { test as bddTest } from 'playwright-bdd';
import { expect, BrowserContext, Page } from '@playwright/test';
// import { FacilityPage } from '../ui/page/NP001/FacilityPage';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ScheduledGroupPage } from '@pages/NP035/ScheduledGroupPage';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let currentTestContext: BrowserContext | undefined;
let currentTestPage: Page | undefined;

export type PageFixtures = {
  // facilityPage: FacilityPage;
  scheduledGroupPage: ScheduledGroupPage;
  loginAs: (userAlias: string) => Promise<void>;
  page: Page;
};

function loadUsers() {
  const usersPath = path.join(__dirname, '../../core/data/users.json');
  return JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
}

function getPassword(envKey: string): string {
  const password = process.env[envKey];
  if (!password) {
    throw new Error(`Password not found in .env for key: ${envKey}`);
  }
  return password;
}

export const test = bddTest.extend<PageFixtures>({
  loginAs: async ({ browser }, use) => {
    await use(async (userAlias: string) => {
      const users = loadUsers();
      const user = users[userAlias];
      if (!user) throw new Error(`User '${userAlias}' not found in users.json`);
      const password = getPassword(user.envKey);

      // Close previous context if exists
      if (currentTestContext) {
        await currentTestContext.close();
      }

      // Create new browser context and page
      currentTestContext = await browser.newContext();
      currentTestPage = await currentTestContext.newPage();
      global.currentTestPage = currentTestPage;

      const baseURL = process.env.UI_BASE_URL || 'https://allocate-systest-wp.national.core.bbc.co.uk';
      const url = new URL(baseURL);
      const urlWithAuth = `${url.protocol}//${user.username}:${password}@${url.host}${url.pathname}`;

      console.log(`Authenticating user: ${user.username}`);
      await currentTestPage.goto(urlWithAuth);
  
      const cookies = await currentTestContext.cookies();
      const phpSessionId = cookies.find(c => c.name === 'PHPSESSID');
      console.log(`PHPSESSID for ${userAlias}: ${phpSessionId?.value}`);
    });
  },

  // facilityPage: async ({}, use) => {
  //   if (!currentTestPage) throw new Error('No page instance available. Did you call loginAs?');
  //   const facilityPage = new FacilityPage(currentTestPage);
  //   await use(facilityPage);
  // },

  // scheduledGroupPage: async ({}, use) => {
  //   if (!currentTestPage) throw new Error('No page instance available. Did you call loginAs?');
  //   const scheduledGroupPage = new ScheduledGroupPage(currentTestPage);
  //   await use(scheduledGroupPage);
  // }
});

export { expect };