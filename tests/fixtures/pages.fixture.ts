import { test as bddTest } from 'playwright-bdd';
import { expect, Page } from '@playwright/test';
import { FacilityPage } from '../ui/page/NP001/FacilityPage';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ScheduledteamPage } from '@pages/NP035/ScheduledTeamPage';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type PageFixtures = {
  facilityPage: FacilityPage;
  scheduledteamPage: ScheduledteamPage;
  loginAs: (userAlias: string) => Promise<void>;
  page: Page;
};

// ============================================
// Helper Functions
// ============================================

/**
 * Load users data from core/data/users.json
 */
function loadUsers() {
  const usersPath = path.join(__dirname, '../../core/data/users.json');
  const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
  return usersData;
}

/**
 * Get password from environment variables
 */
function getPassword(envKey: string): string {
  const password = process.env[envKey];
  if (!password) {
    throw new Error(`Password not found in .env for key: ${envKey}`);
  }
  return password;
}

export const test = bddTest.extend<PageFixtures>({
  // ========================================
  // LOGIN FIXTURE
  // ========================================
  /**
   * Login as specified user with credentials from users.json and .env
   * Usage: await loginAs('systemAdmin')
   */
  loginAs: async ({ page }, use) => {
    await use(async (userAlias: string) => {
      // Load users from users.json
      const users = loadUsers();
      const user = users[userAlias];

      if (!user) {
        throw new Error(`User '${userAlias}' not found in core/data/users.json`);
      }

      // Get password from .env using envKey
      const password = getPassword(user.envKey);

      // Authenticate to base URL with embedded credentials
      const baseURL = process.env.UI_BASE_URL || 'https://allocate-systest-dbr.national.core.bbc.co.uk';
      const url = new URL(baseURL);
      const urlWithAuth = `${url.protocol}//${user.username}:${password}@${url.host}${url.pathname}`;
    
      console.log(`Authenticating user: ${user.username}`);
      
      // Navigate to base URL with embedded credentials for authentication
      await page.goto(urlWithAuth);
      
      console.log(`Authentication successful`);
    });
  },

  facilityPage: async ({ page }, use) => {
    const facilityPage = new FacilityPage(page);
    await use(facilityPage);
  },

  //craete Schd Team page ficture
  scheduledteamPage: async ({ page }, use) => {
    const scheduledteamPage = new ScheduledteamPage(page);
    await use(scheduledteamPage);
  }

});

export { expect };
