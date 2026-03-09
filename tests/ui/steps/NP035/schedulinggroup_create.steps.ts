import { Page } from '@playwright/test';
import { ScheduledGroupPage } from '@pages/NP035/ScheduledGroupPage';
import users from '@core/data/users.json' with { type: 'json' };
import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";

const { Given, When, Then } = createBdd(test);

// Local context to store page and scheduledGroupPage within a scenario
let scenarioContext: { page: Page | null; scheduledGroupPage: ScheduledGroupPage | null } = {
  page: null,
  scheduledGroupPage: null,
};

Given(
  "user {string} is on Show Scheduled Group page",
  async ({ loginAs }, userAlias: string) => {
    const page = await loginAs(userAlias as keyof typeof users);
    const scheduledGroupPage = new ScheduledGroupPage(page);
    await scheduledGroupPage.open();

    // Store in local scenario context
    scenarioContext.page = page;
    scenarioContext.scheduledGroupPage = scheduledGroupPage;

    console.log(`User '${userAlias}' navigated to Scheduling Group page`);
  },
);

When(
  "user creates a new scheduling group using test data from {string}",
  async ({ }, filename: string) => {
    if (!scenarioContext.scheduledGroupPage) {
      throw new Error('No ScheduledGroupPage instance available. Did you call the Given step first?');
    }
    await scenarioContext.scheduledGroupPage.createScheduledGroup(filename);
  },
);

Then(
  "the scheduling group should be visible in the list",
  async ({ }) => {
    if (!scenarioContext.scheduledGroupPage) {
      throw new Error('No ScheduledGroupPage instance available.');
    }
    await scenarioContext.scheduledGroupPage.verifyScheduledGroupVisibleForUser();
  },
);

Then(
  "the scheduling group created by {string} should not be visible in the list",
  async ({ }) => {
    if (!scenarioContext.scheduledGroupPage) {
      throw new Error('No ScheduledGroupPage instance available.');
    }
    await scenarioContext.scheduledGroupPage.verifyScheduledGroupNotVisibleForUser();
  },
);

Then(
  "the scheduling group created by {string} should be visible in the list",
  async ({} )=> {
    if (!scenarioContext.scheduledGroupPage) {
      throw new Error('No ScheduledGroupPage instance available.');
    }
    await scenarioContext.scheduledGroupPage.verifyScheduledGroupVisibleForUserAlias();
  },
);
