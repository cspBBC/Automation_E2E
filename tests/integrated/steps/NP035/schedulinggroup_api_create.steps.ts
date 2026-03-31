
import { createBdd } from 'playwright-bdd';
import { test, expect } from '@fixtures/fixture';
import { Response } from '@playwright/test';

const { Given, When, Then } = createBdd(test);

let lastResponse: Response | null = null;
let apiPage: any = null;

Given('user {string} is authenticated', async ({ authenticateWithNtlm }, userAlias: string) => {
  const { apiPage: page } = await authenticateWithNtlm(userAlias);
  apiPage = page;
});

When('the system admin requests to view all Scheduling Groups', async () => {
  if (!apiPage) {
    throw new Error('Not authenticated. Run "Given user is authenticated" first.');
  }

  console.log(`Requesting Scheduling Groups endpoint`);

  //const apiUrl = 'https://allocate-systest-wp.national.core.bbc.co.uk/mvc-app/admin/scheduling-group';
  const apiUrl = `${process.env.API_BASE_URL}/mvc-app/admin/scheduling-group`;
  console.log(`GET ${apiUrl}`);
  console.log(`Using page.goto() which handles NTLM natively`);

  // Use page.goto() for NTLM auth (not page.request which loses NTLM negotiation)
  lastResponse = await apiPage.goto(apiUrl);

  console.log(`Response Status: ${lastResponse?.status()}`);
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
