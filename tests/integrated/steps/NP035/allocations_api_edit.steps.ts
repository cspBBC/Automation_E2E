import { createBdd } from 'playwright-bdd';
import { expect, APIResponse } from '@playwright/test';
import { readJSON } from '../../../utils/readJson';
import path from 'path';

const { Given, When, Then } = createBdd();

let lastResponse: APIResponse;
let lastResponseStatus: number;
let authenticatedPage: any;

Given('user {string} is authenticated', async ({ browser }, userName: string) => {
  // Step: Given user 'systemAdmin' is authenticated
  // From: tests\integrated\features\NP035\allocations_api_edit.feature:5:5
  
  console.log(`Setting up NTLM authentication for user: '${userName}'`);
  
  try {
    // Read user credentials from users.json
    const usersData = await readJSON(path.resolve(process.cwd(), 'core/data/users.json'));
    const user = (usersData as any)[userName];

    if (!user) {
      throw new Error(`User '${userName}' not found in core/data/users.json`);
    }

    // Get password from environment variable
    const password = process.env[user.envKey];

    if (!password) {
      throw new Error(`Password not found in .env. Expected env variable: ${user.envKey}`);
    }

    // Create new context for NTLM auth
    const authContext = await browser.newContext({
      ignoreHTTPSErrors: true,
    });

    authenticatedPage = await authContext.newPage();
    const baseUrl = new URL(process.env.API_BASE_URL || 'https://allocate-systest-wp.national.core.bbc.co.uk');
    const encodedPassword = encodeURIComponent(password);
    
    // Use UPN format if available, fallback to username
    const authUsername = user.upn || user.username;
    const loginUrl = `https://${authUsername}:${encodedPassword}@${baseUrl.hostname}/`;

    console.log(`Using NTLM credentials: ${authUsername}:****`);

    // Use page.goto() with embedded credentials to trigger NTLM handshake
    const response = await authenticatedPage.goto(loginUrl);

    if (response.status() !== 200) {
      throw new Error(`Failed to authenticate user '${userName}'. Status: ${response.status()}`);
    }

    console.log(`NTLM session established for ${user.username}`);
  } catch (error) {
    console.error(`Authentication failed: ${error}`);
    throw error;
  }
});

When('the system admin hits the mark-action.php endpoint with duty allocation parameters', async ({}) => {
  const baseUrl = process.env.API_BASE_URL || 'https://allocate-systest-wp.national.core.bbc.co.uk';

  // Exact URL from PHP developer (originally a GET request)
  const url = `${baseUrl}/page-includes/allocations/weekly/actions/mark-action.php?DutyName=Test POC test&StartTime=00:15&EndTime=00:45&breakTimeHour=0&breakTimeMinute=0&dutyColorId=1&isNeedCovering=on&DutyDate=2026-03-23&DutyID=34432&ID=34432&allocationsDutyId=6752148&allocationsSpId=5822036&allocationsDate=2026-03-23&allocationsSchPer=9441&oldDutyComments&oldPersonComments&breakTimeHour=2&breakTimeMinute=0&SchedulingPersonID=9441&SchedulingTeamID=14&isPublished=0&isEdited=0&currDurationVal=00:30&miscDuty=No&action=edit`;

  console.log(`Hitting: ${url}`);
  console.log(`Using NTLM authenticated page`);
  
  // Navigate authenticated page to the endpoint URL
  // NTLM session is maintained via the page socket
  const response = await authenticatedPage.goto(url);
  lastResponseStatus = response.status();
  
  console.log(`Response received with status: ${lastResponseStatus}`);
});

Then('verify the endpoint is working', async ({}) => {
  console.log(`Response Status: ${lastResponseStatus}`);
  expect(lastResponseStatus).toBeLessThan(500);
  console.log(`Endpoint is working! (Status: ${lastResponseStatus})`);
});
