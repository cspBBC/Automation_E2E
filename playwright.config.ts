import path from 'path';
import { fileURLToPath } from 'url';
import { config as dotenvConfig } from 'dotenv';
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment-specific .env file
// If already loaded in this session, reuse that environment
const loadedEnv = process.env.LOADED_ENVIRONMENT;
const environment = loadedEnv || process.env.ENVIRONMENT || 'systest';
const envPath = path.resolve(__dirname, `.env.${environment}`);

// Only load dotenv if not already loaded in this session
if (!loadedEnv) {
  dotenvConfig({ path: envPath });
  process.env.LOADED_ENVIRONMENT = environment;  // Mark as loaded
}

// Determine which test type based on env variable
const testType = process.env.TEST_TYPE || 'ui';

// Log configuration ONLY ONCE per process (prevents double logging from bddgen + playwright)
if (!process.env.CONFIG_LOGGED) {
  console.log(`Loading environment: ${environment} from ${envPath}`);
  
  if (testType === 'ui') {
    console.log(`✅ STARTING UI TESTS`);
    console.log(`📍 Environment: ${environment.toUpperCase()}`);
    console.log(`🌐 Base URL: ${process.env.UI_BASE_URL}\n`);
  } else if (testType === 'api') {
    console.log(`✅ STARTING API TESTS`);
    console.log(`📍 Environment: ${environment.toUpperCase()}`);
    console.log(`🌐 Base URL: ${process.env.API_BASE_URL}\n`);
  }
  
  process.env.CONFIG_LOGGED = 'true';
}

// BDD config - ONLY define the one we need to avoid processing both
let bddConfig;

if (testType === 'api') {
  bddConfig = defineBddConfig({
    features: [
      'tests/integrated/features/**/*.feature',
    ],
    steps: [
      'tests/integrated/steps/**/*.steps.ts',
      'tests/fixtures/test.fixture.ts',
    ],
    outputDir: '.features-gen/api',
  });
} else {
  bddConfig = defineBddConfig({
    features: [
      'tests/ui/features/**/*.feature',
    ],
    steps: [
      'tests/ui/steps/**/*.steps.ts',
      'tests/fixtures/pages.fixture.ts',
    ],
    outputDir: '.features-gen/ui',
  });
}

export { bddConfig };

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
      testDir: './.features-gen/ui',
      testMatch: '**/*.feature.spec.*',
      workers: process.env.CI ? 4 : 1,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.UI_BASE_URL,
      },
    },

    // =======================
    // API TESTS (Integrated)
    // =======================
    {
      name: 'apitest',
      testDir: './.features-gen/api',
      testMatch: '**/*.feature.spec.*',
      workers: process.env.CI ? 4 : 1,
      use: {
        baseURL: process.env.API_BASE_URL,
        browserName: undefined,  // No browser for API tests
      },
    },

  ],
});
