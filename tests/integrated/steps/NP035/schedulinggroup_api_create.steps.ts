
import { createBdd } from 'playwright-bdd';
import { test, expect } from '@fixtures/fixture';
import { APIResponse, Page, BrowserContext } from '@playwright/test';
import { SessionManager } from '@core/auth/sessionManager';
import users from '@core/data/users.json' with { type: 'json' };

const { Given, When, Then } = createBdd(test);

let lastResponse: APIResponse;
let apiPage: Page | null = null;
let authContext: BrowserContext | null = null;

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

  // Create browser context
  authContext = await browser.newContext({
    ignoreHTTPSErrors: true,
  });
  apiPage = await authContext.newPage();

  // Login URL with embedded credentials - this establishes NTLM session
  const loginUrl = `https://${user.username}:${password}@allocate-systest-wp.national.core.bbc.co.uk/`;

  console.log(`🌐 Navigating to: ${loginUrl}`);
  await apiPage.goto(loginUrl);
  await apiPage.waitForLoadState('networkidle');

  console.log(`✅ Login successful - NTLM session established`);

  // Capture auth data for logging
  const storageState = await authContext.storageState();
  const cookies = storageState.cookies.map(c => `${c.name}=${c.value}`).join('; ');

  console.log(`📦 Captured authentication data:`);
  console.log(`   - Cookies count: ${storageState.cookies.length}`);
  console.log(`   - Storage: ${Object.keys(storageState).join(', ')}`);

  // Save session for reuse
  const sessionManager = new SessionManager(userAlias);
  await sessionManager.saveSession(authContext, user.username, user.id);
  console.log(`💾 Session saved to .auth/${userAlias}.json`);
});

When('the system admin requests to view all Scheduling Groups', async ({ browser }) => {
  if (!apiPage) {
    throw new Error('Not authenticated. Run "Given user is authenticated" first.');
  }

  console.log(`📞 Making API request using authenticated page session`);

  const apiUrl = 'https://allocate-systest-wp.national.core.bbc.co.uk/mvc-app/admin/scheduling-group';
  
  console.log(`📤 First navigating page to: ${apiUrl}`);
  // Navigate page to the endpoint first to establish full auth context
  await apiPage.goto(apiUrl);
  await apiPage.waitForLoadState('networkidle');
  
  console.log(`📤 Now making GET request with page.request`);
  console.log(`📋 Using page.request (inherits full NTLM session from browser)`);

  // Now make the API call - should have full auth context
  lastResponse = await apiPage.request.get(apiUrl);

  console.log(`📥 Response Status: ${lastResponse.status()}`);
});

Then('the response status code should be {int}', async ({}, expectedStatus: number) => {
  const actualStatus = lastResponse.status();
  console.log(`Response Status: ${actualStatus}`);
  
  // Capture response body for debugging
  let responseBody = '';
  try {
    const contentType = lastResponse.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      responseBody = await lastResponse.json();
    } else {
      responseBody = await lastResponse.text();
    }
    console.log(`Response Body (first 500 chars):`);
    console.log(JSON.stringify(responseBody).substring(0, 500));
  } catch (e) {
    console.log('Could not parse response body');
  }
  
  expect(actualStatus).toBe(expectedStatus);

  // Cleanup after test
  if (apiPage) {
    await apiPage.close();
    apiPage = null;
  }
  if (authContext) {
    await authContext.close();
    authContext = null;
  }
});
