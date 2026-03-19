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
    
    // Store the group name in scenarioContext for later access (persists across user switches)
    const groupName = (scenarioContext.scheduledGroupPage.constructor as any).lastCreatedGroupName;
    scenarioContext.lastCreatedGroupName = groupName;
    
    console.log(`Created scheduling group using: ${filename}`);
    console.log(`Group name stored in context: "${groupName}"`);
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

