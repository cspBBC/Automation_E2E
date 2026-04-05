import path from 'path';
import { fileURLToPath } from 'url';
import { config as dotenvConfig } from 'dotenv';
import { defineConfig, devices } from '@playwright/test';
import bddModule from 'playwright-bdd';

const { defineBddConfig } = bddModule;
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

// Determine which test type based on env variable or command-line args
let testType = process.env.TEST_TYPE || 'ui';

// If argv contains project filter, infer test type from that
if (process.argv.includes('--project=apitest')) {
  testType = 'api';
} else if (process.argv.includes('--project=uitest')) {
  testType = 'ui';
}

// Log configuration ONLY ONCE per process (prevents double logging from bddgen + playwright)
if (!process.env.CONFIG_LOGGED) {
  console.log(`Loading environment: ${environment} from ${envPath}`);
  
  if (testType === 'ui') {
    console.log(`STARTING UI TESTS`);
    console.log(`Environment: ${environment.toUpperCase()}`);
    console.log(`Base URL: ${process.env.UI_BASE_URL}\n`);
  } else if (testType === 'api') {
    console.log(`STARTING API TESTS`);
    console.log(`Environment: ${environment.toUpperCase()}`);
    console.log(`Base URL: ${process.env.API_BASE_URL}\n`);
  }
  
  process.env.CONFIG_LOGGED = 'true';
}

// BDD configs for both API and UI - define both and let projects use what they need
const bddConfigApi = defineBddConfig({
  features: [
    'tests/integrated/features/**/*.feature',
  ],
  steps: [
    'tests/integrated/steps/**/*.steps.ts',
    'tests/fixtures/api.fixture.ts',
  ],
  outputDir: '.features-gen/api',
  disableWarnings: { importTestFrom: true },
});

const bddConfigUi = defineBddConfig({
  features: [
    'tests/ui/features/**/*.feature',
  ],
  steps: [
    'tests/ui/steps/**/*.steps.ts',
    'tests/fixtures/pages.fixture.ts',
  ],
  outputDir: '.features-gen/ui',
});

// Export the appropriate config for bddgen based on test type
const bddConfig = testType === 'api' ? bddConfigApi : bddConfigUi;

export { bddConfig };

export default defineConfig({
 
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['html', { 
      open: 'never',
      outputFolder: 'playwright-report',
    }],
    ['list'],
  ],
  outputDir: 'test-results',
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
      workers: process.env.CI ? 8 : 4,  // 4 workers locally, 8 in CI for parallel execution
      outputDir: 'test-results/ui',
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
      workers: process.env.CI ? 8 : 4,  // 4 workers locally, 8 in CI for parallel execution
      outputDir: 'test-results/api',
      use: {
        baseURL: process.env.API_BASE_URL,
        browserName: undefined,  // No browser for API tests
        ignoreHTTPSErrors: true, // Ignore SSL certificate errors for test environment
      },
    },

  ],
});
