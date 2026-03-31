import { createBdd } from 'playwright-bdd';
import { test, expect } from '@fixtures/fixture';

const { Given, When, Then } = createBdd(test);

let lastResponseStatus: number;
let authenticatedPage: any;

Given('user {string} is authenticated', async ({ authenticateWithNtlm }, userName: string) => {
  // Step: Given user 'systemAdmin' is authenticated
  // From: tests\integrated\features\NP035\allocations_api_edit.feature:5:5
  
  console.log(`Setting up NTLM authentication for user: '${userName}'`);
  
  // Use the existing authenticateWithNtlm fixture from fixture.ts
  authenticatedPage = await authenticateWithNtlm(userName);
  
  console.log(`NTLM session ready for API requests`);
});

When('the system admin hits the mark-action.php endpoint with duty allocation parameters', async ({}) => {
  const baseUrl = process.env.API_BASE_URL || 'https://allocate-systest-wp.national.core.bbc.co.uk';

  // Exact URL from PHP developer
  const url = `${baseUrl}/page-includes/allocations/weekly/actions/mark-action.php?DutyName=Test POC test&StartTime=00:15&EndTime=00:45&breakTimeHour=0&breakTimeMinute=0&dutyColorId=1&isNeedCovering=on&DutyDate=2026-03-23&DutyID=34432&ID=34432&allocationsDutyId=6752148&allocationsSpId=5822036&allocationsDate=2026-03-23&allocationsSchPer=9441&oldDutyComments&oldPersonComments&breakTimeHour=2&breakTimeMinute=0&SchedulingPersonID=9441&SchedulingTeamID=14&isPublished=0&isEdited=0&currDurationVal=00:30&miscDuty=No&action=edit`;

  console.log(`Hitting: ${url}`);
  console.log(`Using NTLM authenticated page`);
  
  // Navigate authenticated page to the endpoint URL using POST method
  // NTLM session is maintained via the page socket
  const response = await authenticatedPage.goto(url, {
    method: 'POST'
  });
  lastResponseStatus = response.status();
  
  console.log(`Response received with status: ${lastResponseStatus}`);
});

Then('verify the endpoint is working', async ({}) => {
  console.log(`Response Status: ${lastResponseStatus}`);
  expect(lastResponseStatus).toBeLessThan(500);
  console.log(`Endpoint is working! (Status: ${lastResponseStatus})`);
});
