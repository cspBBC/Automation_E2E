
import { createBdd } from 'playwright-bdd';
import { test, expect } from '@fixtures/fixture';
import { APIResponse, BrowserContext, Page } from '@playwright/test';
import users from '@core/data/users.json' with { type: 'json' };

const { Given, When, Then } = createBdd(test);

let lastResponse: APIResponse | null = null;
let authContext: BrowserContext | null = null;
let apiPage: Page | null = null;

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

  // Create browser context for authentication
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
});

When('the system admin requests to view all Scheduling Groups', async () => {
  if (!apiPage) {
    throw new Error('Not authenticated. Run "Given user is authenticated" first.');
  }

  console.log(`📞 Requesting Scheduling Groups endpoint`);

  const apiUrl = 'https://allocate-systest-wp.national.core.bbc.co.uk/mvc-app/admin/scheduling-group';
  
  console.log(`📤 GET ${apiUrl}`);
  console.log(`📋 Using page.goto() which handles NTLM natively`);

  // Use page.goto() for NTLM auth (not page.request which loses NTLM negotiation)
  lastResponse = await apiPage.goto(apiUrl);

  console.log(`📥 Response Status: ${lastResponse?.status()}`);
});

Then('the response status code should be {int}', async ({}, expectedStatus: number) => {
  if (!lastResponse) {
    throw new Error('No response available. Run "When" step first.');
  }

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
