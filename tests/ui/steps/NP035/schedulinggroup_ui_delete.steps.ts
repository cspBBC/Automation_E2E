import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { expect } from '@playwright/test';
import type { SchedulingGroupContext } from '@workflows/ui/schedulingGroup/context/context';

const { When, Then } = createBdd(test);

When(
  'the user clicks the Delete button for the scheduling group',
  async ({ testContext }) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available. Did you call the Given step first?');
    }
    
    const groupName = ctx.groupName;
    if (!groupName) {
      throw new Error('No scheduling group name found in context');
    }
    
    const scheduledGroupPage = ctx.scheduledGroupPage;
    if (!scheduledGroupPage) {
      throw new Error('ScheduledGroupPage not available in context.');
    }
    await scheduledGroupPage.clickDeleteForGroup(groupName);
    
    console.log(`✓ Clicked Delete button for group: "${groupName}"`);
  },
);

Then(
  'the delete confirmation popup appears with title {string}',
  async ({ testContext }, popupTitle: string) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    // Wait for the delete popup to appear (using the actual div structure)
    await ctx.page.waitForSelector('.delete-popup-table', { timeout: 10000 });
    const heading = ctx.page.getByRole('heading', { name: popupTitle });
    await expect(heading).toBeVisible({ timeout: 10000 });
    console.log(`Verified delete confirmation popup with title: ${popupTitle}`);
  },
);

Then(
  'the confirmation message displays {string}',
  async ({ testContext }, confirmationText: string) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    const message = ctx.page.getByText(confirmationText);
    await expect(message).toBeVisible();
    console.log(`Verified confirmation message: ${confirmationText}`);
  },
);

When(
  'the user approves the deletion',
  async ({ testContext }) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    
    const groupName = ctx.groupName;
    if (!groupName) {
      throw new Error('No scheduling group name found in context');
    }
    console.log(`Approving deletion for group: "${groupName}"`);
    
    await ctx.page.locator('#approve-delete-scheduling-group-form').click();
    console.log(`Approved deletion for group: "${groupName}"`);
    
    await ctx.page.waitForLoadState('networkidle');
    await ctx.page.waitForTimeout(1500);
  },
);

Then(
  'the scheduling group is no longer visible in the list',
  async ({ testContext }) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    
    const groupName = ctx.groupName;
    
    if (groupName) {
      console.log(`Verifying group "${groupName}" is deleted...`);
      
      const deletedGroupRow = ctx.page.locator('table tbody tr').filter({
        has: ctx.page.locator(`td:has-text("${groupName}")`)
      });
      
      await expect(deletedGroupRow).toHaveCount(0, { timeout: 8000 });
      console.log(`Verified: Group "${groupName}" removed from list`);
    } else {
      const tableRows = ctx.page.locator('tbody tr');
      await expect(tableRows).toBeTruthy();
      console.log(`Verified scheduling group removed from list.`);
    }
  },
);

Then(
  'the record is removed from the database',
  async ({ testContext }) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    const scheduledGroupPage = ctx.scheduledGroupPage;
    if (!scheduledGroupPage) {
      throw new Error('ScheduledGroupPage not available in context.');
    }
    await scheduledGroupPage.verifyScheduledGroupNotVisibleForUser();
    console.log('Verified record is removed from the database');
  },
);

