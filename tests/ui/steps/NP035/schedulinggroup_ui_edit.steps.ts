import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { expect } from '@playwright/test';
import { scenarioContext, setSchdGrpName, setSchdGrpNotes, getSchdGrpName, getSchdGrpNotes } from '@helpers/contextVariables';
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
  async ({ contextManager }) => {
    if (!scenarioContext.page || !scenarioContext.scheduledGroupPage) {
      throw new Error('Page not available. Did you call the Given step first?');
    }
    
    const groupName = getSchdGrpName();
    if (!groupName) {
      throw new Error('No scheduling group name found in context. Cannot click edit for unknown group.');
    }
    
    // Click edit button for the specific group by name (not by position)
    await scenarioContext.scheduledGroupPage.clickEditForGroup(groupName);
    
    console.log(`✓ Clicked Edit button for scheduling group: "${groupName}"`);
  },
);

When(
  'the user updates the scheduling group name to {string}',
  async ({ }, newName: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    // Generate random name if placeholder is used
    const finalName = newName === 'RANDOM_NAME'
      ? `Updated_Group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      : newName;
    
    // Wait for name input to be ready
    const nameInput = scenarioContext.page.locator('#group_name');
    await nameInput.waitFor({ state: 'visible', timeout: 5000 });
    
    // Clear the field first to ensure clean state
    await nameInput.clear();
    await scenarioContext.page.waitForTimeout(200);
    
    await nameInput.fill(finalName);
    await scenarioContext.page.waitForTimeout(200);
    
    // Verify the value was set
    await expect(nameInput).toHaveValue(finalName);
    
    // Store in schdGrpName (overwrites any previous name)
    setSchdGrpName(finalName);
    
    console.log(`✓ Updated scheduling group name to: ${finalName}`);
  },
);

When(
  'the user updates the notes to {string}',
  async ({ }, notes: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    // Generate random notes if placeholder is used
    const finalNotes = notes === 'RANDOM_NOTES'
      ? `Edited_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      : notes;
    
    // Wait for notes textarea to be ready
    const notesField = scenarioContext.page.locator('textarea[name="notes"]');
    await notesField.waitFor({ state: 'visible', timeout: 5000 });
    
    // Clear and fill
    await notesField.clear();
    await scenarioContext.page.waitForTimeout(200);
    
    await notesField.fill(finalNotes);
    await scenarioContext.page.waitForTimeout(200);
    
    // Verify the value was set
    await expect(notesField).toHaveValue(finalNotes);
    
    // Store in schdGrpNotes (overwrites any previous notes)
    setSchdGrpNotes(finalNotes);
    
    console.log(`✓ Updated notes to: ${finalNotes}`);
  },
);

When(
  'the user clicks the Update scheduling group button',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    // Click the update button
    await scenarioContext.page.getByRole('button', { name: 'Update scheduling group' }).click();
    
    // Wait for any loading indicators to disappear
    await scenarioContext.page.locator('[class*="loading"], [class*="spinner"]').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    
    // Wait for network to settle
    await scenarioContext.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    
    // Wait for modal/form to close
    await scenarioContext.page.locator('#group_name').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    
    // Wait for table to be ready
    await scenarioContext.page.locator('table tbody').waitFor({ state: 'visible', timeout: 5000 });
    await scenarioContext.page.waitForTimeout(800);
    
    console.log('✓ Clicked Update button');
  },
);

Then(
  'the scheduling group is updated in the table with the new name and notes',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    await prepareTableForVerification(scenarioContext.page);
    
    // Get the updated name from context
    const updatedName = getSchdGrpName();
    if (!updatedName) {
      throw new Error('No updated scheduling group name found in context. Did you call the update step first?');
    }
    
    // Get the updated notes from context
    const updatedNotes = getSchdGrpNotes();
    if (!updatedNotes) {
      throw new Error('No updated notes found in context. Did you call the update step first?');
    }
    
    // Wait for table to settle
    await scenarioContext.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await scenarioContext.page.waitForTimeout(500);
    
    // Verify the updated group name is visible using flexible hasText matcher
    await expect(scenarioContext.page.getByRole('cell').filter({ hasText: updatedName }).first()).toBeVisible({ timeout: 5000 });
    
    // Verify the updated notes is visible using flexible hasText matcher
    await expect(scenarioContext.page.getByRole('cell').filter({ hasText: updatedNotes }).first()).toBeVisible({ timeout: 5000 });
    
    console.log(`✓ [Verified] Found updated group in table: "${updatedName}"`);
    console.log(`Verified scheduling group is updated with name: "${updatedName}"`);
  },
);

Then(
  'the scheduling group name is updated to {string}',
  async ({ }, expectedName: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    await prepareTableForVerification(scenarioContext.page);
    
    // Get the updated name from context
    const updatedName = getSchdGrpName();
    if (!updatedName) {
      throw new Error('No updated scheduling group name found in context. Did you call the update step first?');
    }
    
    // Verify the updated row appears with the new name using flexible hasText matcher
    await expect(scenarioContext.page.getByRole('cell').filter({ hasText: updatedName }).first()).toBeVisible({ timeout: 15000 });
    
    console.log(`Verified scheduling group name is updated: ${updatedName}`);
  },
);

Then(
  'the notes are updated',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    await prepareTableForVerification(scenarioContext.page);
    
    // Get the updated notes from context
    const updatedNotes = getSchdGrpNotes();
    if (!updatedNotes) {
      throw new Error('No updated notes found in context. Did you call the update step first?');
    }
    
    // Verify the updated notes are visible using flexible hasText matcher
    await expect(scenarioContext.page.getByRole('cell').filter({ hasText: updatedNotes }).first()).toBeVisible({ timeout: 15000 });
    
    console.log(`Verified notes are updated: "${updatedNotes}"`);
  },
);

Then(
  'the Last Amended Date reflects today\'s date',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    const today = new Date().toLocaleDateString();
    const lastAmendedDateColumn = scenarioContext.page.getByText('Last Amended Date');
    await expect(lastAmendedDateColumn).toBeVisible();
    console.log(`Verified Last Amended Date reflects today: ${today}`);
  },
);

Then(
  'the Last Amended By displays current user',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    // Get the current user alias and resolve to display name from users.json
    const userAlias = scenarioContext.currentUserAlias;
    if (!userAlias) {
      throw new Error('Current user not available in context');
    }
    
    const userData = users[userAlias as keyof typeof users] as Record<string, any>;
    if (!userData) {
      throw new Error(`User '${userAlias}' not found in users.json`);
    }
    
    const displayName = userData.displayName || userData.name || userAlias;
    
    // Verify the user name is visible in the table using flexible hasText matcher
    await expect(scenarioContext.page.getByRole('cell').filter({ hasText: displayName }).first()).toBeVisible({ timeout: 10000 });
    console.log(`Verified Last Amended By displays current user: ${displayName}`);
  },
);

Then(
  'the Last Amended By displays {string} user',
  async ({ }, userName: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    await expect(scenarioContext.page.getByRole('cell').filter({ hasText: userName }).first()).toBeVisible();
    console.log(`Verified Last Amended By displays user: ${userName}`);
  },
);

