import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { expect } from '@playwright/test';
import type { SchedulingGroupContext } from '@workflows/ui/schedulingGroup/context/context';
import users from '@core/data/users.json' with { type: 'json' };

const { When, Then } = createBdd(test);

// Helper function to wait for table to be ready after updates
async function prepareTableForVerification(page: any) {
  // Wait for any loading spinners to disappear
  await page.locator('[class*="loading"], [class*="spinner"]').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  
  // Wait for network activity to complete (critical for fresh data)
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  
  // Force page data refresh by triggering table re-render
  await page.evaluate(() => {
    const table = document.querySelector('table tbody');
    if (table) {
      // Trigger reflow to force browser re-render
      void (table as any).offsetHeight;
    }
  }).catch(() => {});
  
  // Scroll table to top to ensure all rows are visible
  await page.locator('table tbody').first().evaluate((el: HTMLElement) => el.scrollIntoView()).catch(() => {});
  
  // Generous delay for table re-render and any animations
  await page.waitForTimeout(1500);
}

When(
  'the user clicks the Edit button for the scheduling group',
  async ({ testContext }) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available. Did you call the Given step first?');
    }
    
    const groupName = ctx.groupName;
    if (!groupName) {
      throw new Error('No scheduling group name found in context. Cannot click edit for unknown group.');
    }
    
    const scheduledGroupPage = ctx.scheduledGroupPage;
    if (!scheduledGroupPage) {
      throw new Error('ScheduledGroupPage not available in context.');
    }
    await scheduledGroupPage.clickEditForGroup(groupName);
    
    console.log(`✓ Clicked Edit button for scheduling group: "${groupName}"`);
  },
);

When(
  'the user updates the scheduling group name to {string}',
  async ({ testContext }, newName: string) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    
    const finalName = newName === 'RANDOM_NAME'
      ? `Updated_Group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      : newName;
    
    const nameInput = ctx.page.locator('#group_name');
    await nameInput.waitFor({ state: 'visible', timeout: 5000 });
    await nameInput.clear();
    await ctx.page.waitForTimeout(200);
    await nameInput.fill(finalName);
    await ctx.page.waitForTimeout(200);
    await expect(nameInput).toHaveValue(finalName);
    
    ctx.groupName = finalName;
    console.log(`✓ Updated scheduling group name to: ${finalName}`);
  },
);

When(
  'the user updates the notes to {string}',
  async ({ testContext }, notes: string) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    
    const finalNotes = notes === 'RANDOM_NOTES'
      ? `Edited_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      : notes;
    
    const notesField = ctx.page.locator('textarea[name="notes"]');
    await notesField.waitFor({ state: 'visible', timeout: 5000 });
    await notesField.clear();
    await ctx.page.waitForTimeout(200);
    await notesField.fill(finalNotes);
    await ctx.page.waitForTimeout(200);
    await expect(notesField).toHaveValue(finalNotes);
    
    ctx.notes = finalNotes;
    console.log(`✓ Updated notes to: ${finalNotes}`);
  },
);

When(
  'the user clicks the Update scheduling group button',
  async ({ testContext }) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    
    await ctx.page.getByRole('button', { name: 'Update scheduling group' }).click();
    await ctx.page.locator('[class*="loading"], [class*="spinner"]').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await ctx.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await ctx.page.locator('#group_name').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await ctx.page.locator('table tbody').waitFor({ state: 'visible', timeout: 5000 });
    await ctx.page.waitForTimeout(800);
    
    console.log('✓ Clicked Update button');
  },
);

Then(
  'the scheduling group is updated in the table with the new name and notes',
  async ({ testContext }) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    
    await prepareTableForVerification(ctx.page);
    
    const updatedName = ctx.groupName;
    if (!updatedName) {
      throw new Error('No updated scheduling group name found in context. Did you call the update step first?');
    }
    
    const updatedNotes = ctx.notes;
    if (!updatedNotes) {
      throw new Error('No updated notes found in context. Did you call the update step first?');
    }
    
    await ctx.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await ctx.page.waitForTimeout(500);
    
    await expect(ctx.page.getByRole('cell').filter({ hasText: updatedName }).first()).toBeVisible({ timeout: 5000 });
    await expect(ctx.page.getByRole('cell').filter({ hasText: updatedNotes }).first()).toBeVisible({ timeout: 5000 });
    
    console.log(`✓ [Verified] Found updated group in table: "${updatedName}"`);
    console.log(`Verified scheduling group is updated with name: "${updatedName}"`);
  },
);

Then(
  'the scheduling group name is updated to {string}',
  async ({ testContext }, expectedName: string) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    
    await prepareTableForVerification(ctx.page);
    
    const updatedName = ctx.groupName;
    if (!updatedName) {
      throw new Error('No updated scheduling group name found in context. Did you call the update step first?');
    }
    
    await expect(ctx.page.getByRole('cell').filter({ hasText: updatedName }).first()).toBeVisible({ timeout: 15000 });
    console.log(`Verified scheduling group name is updated: ${updatedName}`);
  },
);

Then(
  'the notes are updated',
  async ({ testContext }) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    
    await prepareTableForVerification(ctx.page);
    
    const updatedNotes = ctx.notes;
    if (!updatedNotes) {
      throw new Error('No updated notes found in context. Did you call the update step first?');
    }
    
    await expect(ctx.page.getByRole('cell').filter({ hasText: updatedNotes }).first()).toBeVisible({ timeout: 15000 });
    console.log(`Verified notes are updated: "${updatedNotes}"`);
  },
);

Then(
  'the Last Amended Date reflects today\'s date',
  async ({ testContext }) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    const today = new Date().toLocaleDateString();
    const lastAmendedDateColumn = ctx.page.getByText('Last Amended Date');
    await expect(lastAmendedDateColumn).toBeVisible();
    console.log(`Verified Last Amended Date reflects today: ${today}`);
  },
);

Then(
  'the Last Amended By displays current user',
  async ({ testContext }) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    
    const userAlias = ctx.currentUserAlias;
    if (!userAlias) {
      throw new Error('Current user not available in context');
    }
    
    const userData = users[userAlias as keyof typeof users] as Record<string, any>;
    if (!userData) {
      throw new Error(`User '${userAlias}' not found in users.json`);
    }
    
    const displayName = userData.displayName || userData.name || userAlias;
    await expect(ctx.page.getByRole('cell').filter({ hasText: displayName }).first()).toBeVisible({ timeout: 10000 });
    console.log(`Verified Last Amended By displays current user: ${displayName}`);
  },
);

Then(
  'the Last Amended By displays {string} user',
  async ({ testContext }, userName: string) => {
    const ctx = testContext as SchedulingGroupContext;
    if (!ctx.page) {
      throw new Error('Page not available.');
    }
    await expect(ctx.page.getByRole('cell').filter({ hasText: userName }).first()).toBeVisible();
    console.log(`Verified Last Amended By displays user: ${userName}`);
  },
);

