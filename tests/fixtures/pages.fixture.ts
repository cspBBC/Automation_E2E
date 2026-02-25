import { test as bddTest } from 'playwright-bdd';
import { expect, Page } from '@playwright/test';
import { FacilityPage } from '../ui/page/NP001/FacilityPage';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type PageFixtures = {
  facilityPage: FacilityPage;
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

      console.log(`\n${'='.repeat(60)}`);
      console.log(`🔐 HTTP BASIC AUTH SETUP`);
      console.log(`${'='.repeat(60)}`);
      console.log(`User Alias: ${userAlias}`);
      console.log(`Username: ${user.username}`);
      console.log(`Password: ${password}`);
      console.log(`${'='.repeat(60)}\n`);

      // Set HTTP credentials on browser context BEFORE page navigation
      // This handles the HTTP Basic Auth popup automatically
      await page.context().setHTTPCredentials({
        username: user.username,
        password: password,
      });

      console.log(`✅ HTTP credentials set for ${userAlias} (${user.username})`);
      console.log(`📍 Ready for page navigation - auth popup will be auto-filled\n`);
    });
  },

  facilityPage: async ({ page }, use) => {
    const facilityPage = new FacilityPage(page);
    await use(facilityPage);
  },
});

export { expect };
