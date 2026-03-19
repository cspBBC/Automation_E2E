import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { scenarioContext } from './schedulinggroup_ui_common.steps';

const { When, Then } = createBdd(test);

When(
  "the user creates a new scheduling group using {string}",
  async ({ }, filename: string) => {
    if (!scenarioContext.scheduledGroupPage) {
      throw new Error('No ScheduledGroupPage instance available. Did you call the Given step first?');
    }
    await scenarioContext.scheduledGroupPage.createScheduledGroup(filename);
    console.log(`Created scheduling group using: ${filename}`);
  },
);

Then(
  "the scheduling group is visible",
  async ({ }) => {
    if (!scenarioContext.scheduledGroupPage) {
      throw new Error('No ScheduledGroupPage instance available.');
    }
    await scenarioContext.scheduledGroupPage.verifyScheduledGroupVisibleForUser();
    console.log('Verified: scheduling group is visible');
  },
);

Then(
  "the scheduling group is visible",
  async ({ }) => {
    if (!scenarioContext.scheduledGroupPage) {
      throw new Error('No ScheduledGroupPage instance available.');
    }
    await scenarioContext.scheduledGroupPage.verifyScheduledGroupVisibleForUser();
    console.log('Verified: scheduling group is visible');
  },
);

