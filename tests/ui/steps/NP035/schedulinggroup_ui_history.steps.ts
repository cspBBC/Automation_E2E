import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { expect } from '@playwright/test';
import type { SchedulingGroupContext } from '@workflows/ui/schedulingGroup/context/context';

const { When, Then } = createBdd(test);



When(
  'the user clicks the History option for the scheduling group',
  async ({ testContext }) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available. Did you call the Given step first?');
    }
    
    const groupName = ctx.groupName;
    if (!groupName) {
      throw new Error('No scheduling group name found in context.');
    }
    
    const scheduledGroupPage = ctx.scheduledGroupPage;
    if (!scheduledGroupPage) {
      throw new Error('ScheduledGroupPage not available in context.');
    }
    await scheduledGroupPage.clickHistoryForGroup(groupName);
    
    await ctx.page.locator('#historyWapper').waitFor({ state: 'visible', timeout: 10000 });
    await ctx.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await ctx.page.waitForTimeout(500);
    
    console.log(`✓ Clicked History option for group: "${groupName}"`);
  },
);

Then(
  'the history popup displays with all historical changes',
  async ({ testContext }) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    
    const historyContent = ctx.page.locator('#historyWapper');
    await expect(historyContent).toBeVisible({ timeout: 10000 });
    await ctx.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await ctx.page.waitForTimeout(500);

    console.log('Verified history popup is displayed with Scheduling Group audit trail');
  },
);

Then(
  'history shows timestamps of each modification',
  async ({ testContext }) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    
    const historyContent = ctx.page.locator('#historyWapper');
    const historyText = await historyContent.textContent();
    
    const timestampPattern = /\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}/;
    if (!timestampPattern.test(historyText || '')) {
      throw new Error('No timestamps with correct format (dd/mm/yyyy hh:mm) found in history');
    }
    
    console.log('Verified timestamps in history');
  },
);

Then(
  'history shows user names who made each change',
  async ({ testContext }) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    
    const historyContent = ctx.page.locator('#historyWapper');
    const historyText = await historyContent.textContent();
    
    if (!historyText || !/\sby\s/.test(historyText)) {
      throw new Error('No user information found in history records');
    }
    
    console.log('Verified user names in history');
  },
);

Then(
  'history displays changes for Name, Notes, and other column modifications',
  async ({ testContext }) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    
    const historyContent = ctx.page.locator('#historyWapper');
    const historyText = await historyContent.textContent();
    
    const changePattern = /created|changed|updated|modified/i;
    if (!changePattern.test(historyText || '')) {
      throw new Error('No change action descriptions found in history');
    }
    
    console.log('Verified change descriptions in history');
  },
);

Then(
  'the user can close the history popup',
  async ({ testContext }) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    
    await ctx.page.getByRole('link', { name: 'close' }).click();
    await ctx.page.locator('#historyWapper').waitFor({ state: 'hidden', timeout: 5000 });
    await ctx.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await ctx.page.waitForTimeout(500);
    
    console.log('Verified history popup is closed');
  },
);

Then(
  /^history shows user '(.+)' who made the changes$/,
  async ({ testContext }, userName: string) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    
    const historyContent = ctx.page.locator('#historyWapper');
    await expect(historyContent).toContainText(userName, { timeout: 10000 });
    
    console.log(`Verified user "${userName}" found in history`);
  },
);
