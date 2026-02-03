import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  timeout: 60 * 1000,

  expect: {
    timeout: 10 * 1000,
  },

  retries: process.env.CI ? 1 : 0,

  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],

  use: {
    baseURL: process.env.API_BASE_URL,

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    extraHTTPHeaders: {
      'Content-Type': 'application/json'
    }
  },

  projects: [
    // =======================
    // UI TESTS
    // =======================
    {
      name: 'ui',
      testMatch: /.*\.ui\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
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
    }
  ],
});
