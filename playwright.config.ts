import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// BDD config for UI tests
export const bddConfig = defineBddConfig({
  features: [
    'tests/ui/features/**/*.feature',
    'tests/api_db/features/**/*.feature',
  ],
  steps: [
    'tests/ui/steps/**/*.steps.ts',
    'tests/api_db/steps/**/*.steps.ts',
    'tests/fixtures/pages.fixture.ts',
    'tests/fixtures/test.fixture.ts',
  ],
});

export default defineConfig({
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    // =======================
    // UI BDD TESTS
    // =======================
    {
      name: 'uitest',
      testDir: './.features-gen',
      testMatch: '**/*.feature.spec.*',
      grep: /@ui/,
      workers: process.env.CI ? 2 : 2,  // Fewer workers for UI (heavier)
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.UI_BASE_URL,
      },
    },

    // =======================
    // API TESTS
    // =======================
    {
      name: 'api_db_test',
      testDir: './.features-gen',
      testMatch: '**/*.feature.spec.*',
      grep: /@api_db/,
      workers: process.env.CI ? 4 : 2,  // More workers for API/DB (lighter)
      use: {
        baseURL: process.env.API_BASE_URL,
      },
    },

    // =======================
    // DB TESTS (NO BROWSER)
    // =======================
    {
      name: 'db',
      testDir: './tests',
      testMatch: /.*\.db\.spec\.ts/,
      workers: process.env.CI ? 6 : 2,  // Most workers for DB-only tests
      use: {
        browserName: undefined,
      },
    },
  ],
});
