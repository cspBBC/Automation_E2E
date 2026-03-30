
import { createBdd } from 'playwright-bdd';
import { test, expect } from '@fixtures/fixture';
import { APIResponse, Page, BrowserContext } from '@playwright/test';
import { SessionManager } from '@core/auth/sessionManager';
import users from '@core/data/users.json' with { type: 'json' };

const { Given, When, Then } = createBdd(test);

let lastResponse: APIResponse;
let authContext: BrowserContext | null = null;
let authData: {
  cookies: string;
  storageState: any;
  headers: Record<string, string>;
  username: string;
  password: string;
} | null = null;

Given('user {string} is authenticated', async ({ browser }, userAlias: string) => {
  const user = (users as any)[userAlias];
  if (!user) {
    throw new Error(`User '${userAlias}' not found in users.json`);
  }

  const password = process.env[user.envKey];
  if (!password) {
    throw new Error(`Password not found in .env for key: ${user.envKey}`);
  }

  console.log(`🔐 Authenticating user: ${user.username}`);

  // Create browser context and keep it alive for API calls
  authContext = await browser.newContext({
    ignoreHTTPSErrors: true,
  });
  const page = await authContext.newPage();

  // Login URL with embedded credentials
  const loginUrl = `https://${user.username}:${password}@allocate-systest-wp.national.core.bbc.co.uk/`;

  console.log(`🌐 Navigating to: ${loginUrl}`);
  await page.goto(loginUrl);
  await page.waitForLoadState('networkidle');

  console.log(`✅ Login successful`);

  // Capture all authentication data
  const storageState = await authContext.storageState();
  const cookies = storageState.cookies.map(c => `${c.name}=${c.value}`).join('; ');

  authData = {
    cookies,
    storageState,
    headers: {
      'Cookie': cookies,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    username: user.username,
    password,
  };

  console.log(`📦 Captured authentication data:`);
  console.log(`   - Cookies: ${cookies.substring(0, 100)}...`);
  console.log(`   - Storage State: ${Object.keys(storageState).join(', ')}`);
  console.log(`   - Headers: ${Object.keys(authData.headers).join(', ')}`);

  // Save session for reuse
  const sessionManager = new SessionManager(userAlias);
  await sessionManager.saveSession(authContext, user.username, user.id);
  console.log(`💾 Session saved to .auth/${userAlias}.json`);

  // Close the page but keep context alive for API calls
  await page.close();
});

When('the system admin requests to view all Scheduling Groups', async ({ browser }) => {
  if (!authContext || !authData) {
    throw new Error('Not authenticated. Run "Given user is authenticated" first.');
  }

  console.log(`📞 Making API request with authenticated context`);

  const apiUrl = 'https://allocate-systest-wp.national.core.bbc.co.uk/mvc-app/admin/scheduling-group';
  
  console.log(`📤 GET ${apiUrl}`);
  console.log(`📋 Using same authenticated browser context`);

  // Use the SAME authenticated context to make API request
  lastResponse = await authContext.request.get(apiUrl);

  console.log(`📥 Response Status: ${lastResponse.status()}`);
});

Then('the response status code should be {int}', async ({}, expectedStatus: number) => {
  const actualStatus = lastResponse.status();
  console.log(`Response Status: ${actualStatus}`);
  expect(actualStatus).toBe(expectedStatus);

  // Cleanup after test
  if (authContext) {
    await authContext.close();
    authContext = null;
    authData = null;
  }
});
