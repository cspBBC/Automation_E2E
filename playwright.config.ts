import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// BDD config for UI tests
const bddConfig = defineBddConfig({
  features: ['tests/ui/features/**/*.feature'],  // fixed glob
  steps: ['tests/ui/steps/**/*.steps.ts'],       // fixed glob
});

export default defineConfig({
  testDir: './tests',
  timeout: 120 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.API_BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
    actionTimeout: 60 * 1000,      // max time per action like click, fill
    navigationTimeout: 60 * 2000,  // max time for page.goto
  },

  projects: [
    // =======================
    // UI BDD TESTS
    // =======================
    {
      name: 'ui',
      testDir: bddConfig, // ← Playwright runs .steps.ts files
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },

    // =======================
    // API TESTS
    // =======================
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        browserName: undefined,
      },
    },

    // =======================
    // DB TESTS (NO BROWSER)
    // =======================
    {
      name: 'db',
      testMatch: /.*\.db\.spec\.ts/,
      use: {
        browserName: undefined,
      },
    },
  ],
});
