
import { createBdd } from 'playwright-bdd';
import { test, expect } from '@fixtures/fixture';
import { APIResponse, Page, BrowserContext } from '@playwright/test';
import { SessionManager } from '@core/auth/sessionManager';
import users from '@core/data/users.json' with { type: 'json' };
import path from 'path';

const { Given, When, Then } = createBdd(test);

let lastResponse: APIResponse;
let browserContext: BrowserContext | null = null;
let browserPage: Page | null = null;

async function loginAndCapture(browser: any, userAlias: string) {
  const user = (users as any)[userAlias];
  if (!user) {
    throw new Error(`User '${userAlias}' not found in users.json`);
  }

  const password = process.env[user.envKey];
  if (!password) {
    throw new Error(`Password not found in .env for key: ${user.envKey}`);
  }

  const baseURL = process.env.UI_BASE_URL!;
  const url = new URL(baseURL);
  const encodedUsername = encodeURIComponent(user.username);
  const encodedPassword = encodeURIComponent(password);
  const urlWithAuth = `${url.protocol}//${encodedUsername}:${encodedPassword}@${url.host}${url.pathname}`;

  // Create and keep browser context alive with HTTPS error handling
  browserContext = await browser.newContext({
    ignoreHTTPSErrors: true,
  });
  browserPage = await browserContext.newPage();

  console.log(`🌐 Logging in via browser: ${user.username}`);
  await browserPage.goto(urlWithAuth);
  await browserPage.waitForLoadState('networkidle');

  // Save the session for reuse in other tests
  const sessionManager = new SessionManager(userAlias);
  await sessionManager.saveSession(browserContext, user.username, user.id);
  console.log(`✅ Session captured and saved`);

  return browserContext;
}

Given('user {string} is authenticated', async ({ browser }, userAlias: string) => {
  const sessionManager = new SessionManager(userAlias);
  
  if (sessionManager.isSessionValid()) {
    console.log(`📦 Reusing existing session, but opening new browser context for API calls`);
  } else {
    console.log(`🔓 No session found, capturing from browser login`);
  }

  // Always login via browser to get authenticated context for API
  browserContext = await loginAndCapture(browser, userAlias);
  console.log(`✅ Authenticated as: ${userAlias} (via browser context)`);
});

When('the system admin requests to view all Scheduling Groups', async ({ browser }) => {
  if (!browserContext || !browserPage) {
    throw new Error('Browser context not initialized. Must authenticate first.');
  }

  console.log(`📞 GET /mvc-app/admin/scheduling-group (using embedded credentials)`);
  
  // Get user credentials from users.json
  const user = (users as any)['systemAdmin'];
  const password = process.env[user.envKey];
  
  // Build URL with embedded credentials
  const baseURL = process.env.UI_BASE_URL!;
  const url = new URL(baseURL);
  const encodedUsername = encodeURIComponent(user.username);
  const encodedPassword = encodeURIComponent(password);
  const urlWithAuth = `${url.protocol}//${encodedUsername}:${encodedPassword}@${url.host}/mvc-app/admin/scheduling-group`;
  
  // Make API request with embedded credentials
  lastResponse = await browserContext.request.get(urlWithAuth);
});

Then('the response status code should be {int}', async ({}, expectedStatus: number) => {
  const actualStatus = lastResponse.status();
  console.log(`Response Status: ${actualStatus}`);
  expect(actualStatus).toBe(expectedStatus);
});
