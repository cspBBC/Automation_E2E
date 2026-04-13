import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import type { SchedulingGroupContext } from '@workflows/ui/schedulingGroup/context/context';

const { When, Then } = createBdd(test);

// Helper: validate context has required properties
const validateContext = (ctx: SchedulingGroupContext) => {
  if (!ctx.page || !ctx.scheduledGroupPage) {
    throw new Error('Context incomplete. Did you call the Given step first?');
  }
  return ctx.scheduledGroupPage;
};

When(
  "the user creates a new scheduling group using {string}",
  async ({ testContext }, filename: string) => {
    const ctx = testContext as SchedulingGroupContext;
    const scheduledGroupPage = validateContext(ctx);
    
    await scheduledGroupPage.createScheduledGroup(filename);
    
    // Store the group name in context for later access (persists across user switches)
    const groupName = (scheduledGroupPage.constructor as any).lastCreatedGroupName;
    ctx.groupName = groupName;
    
    console.log(`Created scheduling group using: ${filename}`);
    console.log(`Group name stored in context: "${groupName}"`);
  },
);

Then(
  "the scheduling group is visible",
  async ({ testContext }) => {
    const ctx = testContext as SchedulingGroupContext;
    const scheduledGroupPage = validateContext(ctx);
    
    await scheduledGroupPage.verifyScheduledGroupVisibleForUser();
    console.log('Verified: scheduling group is visible');
  },
);

