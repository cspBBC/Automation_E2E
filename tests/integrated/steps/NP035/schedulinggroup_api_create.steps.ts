
import { createBdd } from 'playwright-bdd';
import { test, expect } from '@fixtures/fixture';
import { APIResponse } from '@playwright/test';

const { Given, When, Then } = createBdd(test);

let lastResponse: APIResponse | null = null;
let apiPage: any = null;

Given('user {string} is authenticated', async ({ authenticateWithNtlm }, userAlias: string) => {
  // Get the authenticated page (NTLM context established via browser)
  apiPage = await authenticateWithNtlm(userAlias);
  console.log(`🔒 Ready to make authenticated requests as ${userAlias}`);
});

When('the system admin requests to view all Scheduling Groups', async () => {
  if (!apiPage) {
    throw new Error('Not authenticated. Run "Given user is authenticated" first.');
  }

  console.log(`📞 Requesting Scheduling Groups endpoint`);

  const apiUrl = `${process.env.API_BASE_URL}/mvc-app/admin/scheduling-group`;
  console.log(`📤 GET ${apiUrl}`);

  // Use page.goto() via authenticated NTLM session (maintains socket/session)
  lastResponse = await apiPage.goto(apiUrl);

  console.log(`📥 Response Status: ${lastResponse?.status()}`);
});

Then('the response status code should be {int}', async ({ }, expectedStatus: number) => {
  if (!lastResponse) {
    throw new Error('No response available. Run "When" step first.');
  }

  const actualStatus = lastResponse.status();
  console.log(`Response Status: ${actualStatus}`);

  // Capture response body for debugging
  try {
    const contentType = lastResponse.headers()['content-type'] || '';
    const responseBody = contentType.includes('application/json') 
      ? await lastResponse.json() 
      : await lastResponse.text();
    console.log(`Response Body (first 500 chars):`);
    console.log(JSON.stringify(responseBody).substring(0, 500));
  } catch (e) {
    console.log('Could not parse response body');
  }

  expect(actualStatus).toBe(expectedStatus);
});
