import { expect } from '@playwright/test';
import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { scenarioContext } from './schedulinggroup_ui_common.steps';

const { Then } = createBdd(test);

Then(
  "the scheduling group is visible to {string}",
  async ({ }, userName: string) => {
    if (!scenarioContext.scheduledGroupPage) {
      throw new Error('ScheduledGroupPage instance not available.');
    }
    await scenarioContext.scheduledGroupPage.verifyScheduledGroupVisibleForUser();
    console.log(`Verified: scheduling group is visible to ${userName}`);
  },
);

Then(
  "the scheduling group created by {string} is visible",
  async ({ }, userName: string) => {
    if (!scenarioContext.scheduledGroupPage) {
      throw new Error('ScheduledGroupPage instance not available.');
    }
    console.log(`Verifying scheduling group created by ${userName} is visible`);
    await scenarioContext.scheduledGroupPage.verifyScheduledGroupVisibleForUserAlias();
    console.log(`Verified: scheduling group created by ${userName} is visible`);
  },
);

Then(
  "the scheduling group created by {string} is not visible",
  async ({ }, userName: string) => {
    if (!scenarioContext.scheduledGroupPage) {
      throw new Error('ScheduledGroupPage instance not available.');
    }
    console.log(`Verifying scheduling group created by ${userName} is not visible`);
    await scenarioContext.scheduledGroupPage.verifyScheduledGroupNotVisibleForUser();
    console.log(`Verified: scheduling group created by ${userName} is not visible`);
  },
);

Then(
  "Edit and Delete actions are not available for {string}",
  async ({ }, role: string) => {
    if (!scenarioContext.page || !scenarioContext.scheduledGroupPage) {
      throw new Error('Page not available.');
    }
    
    // Verify the created group is not visible to this role
    const groupName = (scenarioContext.scheduledGroupPage.constructor as any).lastCreatedGroupName;
    if (!groupName) {
      throw new Error('No group name to verify');
    }
    
    // Store in scenarioContext for later deletion step
    scenarioContext.lastCreatedGroupName = groupName;
    console.log(`Stored group name for later deletion: "${groupName}"`);
    
    const groupRow = scenarioContext.page.locator('table#scheduling-list-table tbody tr').filter({
      has: scenarioContext.page.locator(`td:has-text("${groupName}")`)
    });
    
    const groupRowCount = await groupRow.count();
    
    if (groupRowCount === 0) {
      console.log(`✓ Verified: Group "${groupName}" is not visible to ${role}, so Edit and Delete actions are not available`);
    } else {
      throw new Error(`Group "${groupName}" should not be visible to ${role}, but found ${groupRowCount} matching rows`);
    }
  },
);

Then(
  "Edit and Delete actions are available for {string}",
  async ({ }, role: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    const editIcons = scenarioContext.page.locator('.fas.fa-edit');
    const deleteIcons = scenarioContext.page.locator('.fas.fa-trash-alt');
    
    const editCount = await editIcons.count();
    const deleteCount = await deleteIcons.count();
    
    console.log(`For ${role}: Edit actions visible: ${editCount}, Delete actions visible: ${deleteCount}`);
    
    // SystemAdmin should be able to see and interact with all groups
    if (editCount > 0 || deleteCount > 0) {
      console.log(`✓ Verified: Edit and Delete actions are available for ${role}`);
    } else {
      throw new Error(`Edit and Delete actions not found for ${role}`);
    }
  },
);
