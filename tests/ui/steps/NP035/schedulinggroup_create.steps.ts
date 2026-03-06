import { Page } from '@playwright/test';
import { ScheduledGroupPage } from '@pages/NP035/ScheduledGroupPage';

declare global {
  var scheduledGroupPage: ScheduledGroupPage;
  var currentTestPage: Page;
}
import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";

const { Given, When, Then } = createBdd(test);

Given(
  "user {string} is on Show Scheduled Group page",
  async ({ loginAs }, userAlias: string) => {
    await loginAs(userAlias);
    const scheduledGroupPage = new ScheduledGroupPage(global.currentTestPage);
    await scheduledGroupPage.open();
    global.scheduledGroupPage = scheduledGroupPage;
    console.log(`User '${userAlias}' navigated to Scheduling Group page`);
  },
);

When(
  "user creates a new scheduling group using test data from {string}",
  async ({}, filename: string) => {
    await global.scheduledGroupPage.createScheduledGroup(filename);
  },
);

Then(
  "the scheduling group should be visible in the list",
  async ({}) => {
    await global.scheduledGroupPage.verifyScheduledGroupVisibleForUser();
    
  },
);

Then(
  "the scheduling group created by {string} should not be visible in the list",
  async ({}) => {
    await global.scheduledGroupPage.verifyScheduledGroupNotVisibleForUser();
 

   
  },
);
