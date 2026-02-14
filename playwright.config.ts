import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// BDD config for UI tests
export const bddConfig = defineBddConfig({
  features: ['tests/ui/features/**/*.feature'],
  steps: [
    'tests/ui/steps/**/*.steps.ts',
    'tests/fixtures/pages.fixture.ts',
  ],
});

export default defineConfig({
  testDir: './tests',
  timeout: 20 * 1000,
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
      name: 'ui',
      testDir: './.features-gen',       // folder where Playwright-BDD generates .feature.spec.ts
      testMatch: '**/*.feature.spec.*', // match .ts or .js files
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
        baseURL: process.env.UI_BASE_URL,
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
        baseURL: process.env.API_BASE_URL,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
        },
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
