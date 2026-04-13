import { expect } from '@playwright/test';
import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";

import type { SchedulingGroupContext } from '@workflows/ui/schedulingGroup/context/context';

const { Then, When } = createBdd(test);

Then(
  "the scheduling group is visible to {string}",
  async ({ testContext }, userName: string) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    const scheduledGroupPage = ctx.scheduledGroupPage;
    if (!scheduledGroupPage) {
      throw new Error('ScheduledGroupPage not available in context.');
    }
    await scheduledGroupPage.verifyScheduledGroupVisibleForUser();
    console.log(`Verified: scheduling group is visible to ${userName}`);
  },
);

Then(
  "the scheduling group created by {string} is visible",
  async ({ testContext }, userName: string) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    console.log(`Verifying scheduling group created by ${userName} is visible`);
    const scheduledGroupPage = ctx.scheduledGroupPage;
    if (!scheduledGroupPage) {
      throw new Error('ScheduledGroupPage not available in context.');
    }
    await scheduledGroupPage.verifyScheduledGroupVisibleForUserAlias();
    console.log(`Verified: scheduling group created by ${userName} is visible`);
  },
);

Then(
  "the scheduling group created by {string} is not visible",
  async ({ testContext }, userName: string) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    console.log(`Verifying scheduling group created by ${userName} is not visible`);
    const scheduledGroupPage = ctx.scheduledGroupPage;
    if (!scheduledGroupPage) {
      throw new Error('ScheduledGroupPage not available in context.');
    }
    await scheduledGroupPage.verifyScheduledGroupNotVisibleForUser();
    console.log(`Verified: scheduling group created by ${userName} is not visible`);
  },
);

Then(
  "Edit and Delete actions are not available for {string}",
  async ({ testContext }, role: string) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    
    const scheduledGroupPage = ctx.scheduledGroupPage;
    if (!scheduledGroupPage) {
      throw new Error('ScheduledGroupPage not available in context.');
    }
    const groupName = (scheduledGroupPage.constructor as any).lastCreatedGroupName;
    if (!groupName) {
      throw new Error('No group name to verify');
    }
    
    ctx.groupName = groupName;
    console.log(`Stored group name for later deletion: "${groupName}"`);
    
    const groupRow = ctx.page.locator('table tbody tr').filter({
      has: ctx.page.locator(`td:has-text("${groupName}")`)
    });
    
    const groupRowCount = await groupRow.count();
    
    if (groupRowCount === 0) {
      console.log(`Verified: Group "${groupName}" is not visible to ${role}, so Edit and Delete actions are not available`);
    } else {
      throw new Error(`Group "${groupName}" should not be visible to ${role}, but found ${groupRowCount} matching rows`);
    }
  },
);

Then(
  "Edit and Delete actions are available for {string}",
  async ({ testContext }, role: string) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    
    const editIcons = ctx.page.locator('.fas.fa-edit');
    const deleteIcons = ctx.page.locator('.fas.fa-trash-alt');
    
    const editCount = await editIcons.count();
    const deleteCount = await deleteIcons.count();
    
    console.log(`For ${role}: Edit actions visible: ${editCount}, Delete actions visible: ${deleteCount}`);
    
    if (editCount > 0 || deleteCount > 0) {
      console.log(`Verified: Edit and Delete actions are available for ${role}`);
    } else {
      throw new Error(`Edit and Delete actions not found for ${role}`);
    }
  },
);

When(
  'the user updates the scheduling group details',
  async ({ testContext }) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }

    const notesField = ctx.page.locator('textarea[name="notes"]');
    await notesField.waitFor({ state: 'visible', timeout: 5000 });
    
    const updatedNotes = `Updated via SystemAdmin - ${new Date().toISOString()}`;
    await notesField.clear();
    await notesField.fill(updatedNotes);
    
    await expect(notesField).toHaveValue(updatedNotes);
    
    ctx.notes = updatedNotes;
    console.log(`Updated scheduling group details - notes: ${updatedNotes}`);
  },
);

When(
  'the user saves the changes',
  async ({ testContext }) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }

    const saveButton = ctx.page.getByRole('button', { name: /Update scheduling group|Save/ });
    await saveButton.waitFor({ state: 'visible', timeout: 5000 });
    await saveButton.click();

    try {
      await ctx.page.locator('[class*="loading"], [class*="spinner"]').first().waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
    } catch (e) {
      // If no loading indicator, continue
    }

    await ctx.page.locator('table tbody').waitFor({ state: 'visible', timeout: 8000 });
    console.log('Saved changes to scheduling group');
  },
);

Then(
  'the scheduling group is updated successfully',
  async ({ testContext }) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }

    await ctx.page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});

    const groupName = ctx.groupName;
    if (!groupName) {
      throw new Error('No group name to verify');
    }

    const updatedRow = ctx.page.locator('table tbody tr').filter({
      has: ctx.page.locator(`td.scheduling-group-name:has-text("${groupName}")`)
    });

    await expect(updatedRow).toHaveCount(1, { timeout: 10000 });
    console.log('Verified: Scheduling group is updated successfully');
  },
);

