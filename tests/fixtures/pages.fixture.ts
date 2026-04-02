import { test as base} from 'playwright-bdd';
import { expect, BrowserContext, Page } from '@playwright/test';
import users from '@core/data/users.json' with { type: "json" };
import { setCurrentTestId, cleanupTestContext } from '@helpers/contextVariables';

function getPassword(envKey: string): string {
  const password = process.env[envKey];
  if (!password) {
    throw new Error(`Password not found in environment for key: ${envKey}`);
  }
  return password;
}

// Extend the base test with loginAs and contextManager fixtures
export const test = base.extend<{ 
  loginAs: (role: keyof typeof users) => Promise<Page>,
  contextManager: string
}>({

  loginAs: async ({ browser }, use) => {
    let currentContext: BrowserContext | undefined;

    const loginWithRole = async (role: keyof typeof users) => {
      // Close previous context for different user
      if (currentContext) {
        await currentContext.close();
      }

      const user = users[role];
      const password = getPassword(user.envKey);

      // Create new context for each role
      currentContext = await browser.newContext();
      const currentPage = await currentContext.newPage();

      const baseURL = process.env.UI_BASE_URL;
      if (!baseURL) {
        throw new Error('UI_BASE_URL not found in environment. Check .env file');
      }
      const url = new URL(baseURL);
      
      // Properly encode username and password for URL authentication
      const encodedUsername = encodeURIComponent(user.username);
      const encodedPassword = encodeURIComponent(password);
      const urlWithAuth = `${url.protocol}//${encodedUsername}:${encodedPassword}@${url.host}${url.pathname}`;

      console.log(`Authenticating user: ${user.username}`);
      
      // Navigate with URL credentials
      await currentPage.goto(urlWithAuth);
      await currentPage.waitForLoadState('networkidle');

      console.log("Logged in as role:", role);

      return currentPage;
    };

    // Provide the fixture to the test
    await use(loginWithRole);

    // Cleanup context after test - add small delay to ensure all async operations complete
    if (currentContext) {
      // Wait a bit for any pending operations before closing
      await new Promise(resolve => setTimeout(resolve, 500));
      try {
        await currentContext.close();
      } catch (error) {
        console.warn('Error closing context:', error);
      }
    }
  },

  // Context manager to isolate context per test (supports parallel execution)
  contextManager: async ({ }, use, testInfo) => {
    // Set unique test ID based on test title and worker index
    const testId = `${testInfo.title}_${testInfo.workerIndex}`;
    setCurrentTestId(testId);
    
    console.log(`[Context] Initialized for test: ${testId}`);
    
    // Provide fixture to test
    await use(testId);
    
    // Cleanup after test
    cleanupTestContext(testId);
    console.log(`[Context] Cleaned up for test: ${testId}`);
  },

});

export { expect };