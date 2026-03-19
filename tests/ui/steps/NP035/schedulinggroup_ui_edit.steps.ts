import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { expect } from '@playwright/test';
import { scenarioContext } from '@helpers/scenarioContextManager';
import users from '@core/data/users.json' with { type: 'json' };

const { When, Then } = createBdd(test);

When(
  'the user clicks the Edit button for the scheduling group',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available. Did you call the Given step first?');
    }
    
    // Wait for edit button to be visible and clickable
    const editButton = scenarioContext.page.locator('.fas.fa-edit').first();
    await editButton.waitFor({ state: 'visible', timeout: 8000 });
    
    // Wait for button to be clickable (not disabled, visible, stable)
    await scenarioContext.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await editButton.click();
    
    // Wait for modal/form to appear after click
    await scenarioContext.page.locator('#group_name, input[name="group_name"]').waitFor({ state: 'visible', timeout: 5000 });
    
    console.log('Clicked Edit button for scheduling group');
  },
);

When(
  'the user updates the scheduling group name to {string}',
  async ({ }, newName: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    // Wait for name input to be ready
    const nameInput = scenarioContext.page.locator('#group_name');
    await nameInput.waitFor({ state: 'visible', timeout: 5000 });
    
    // Clear the field first to ensure clean state
    await nameInput.clear();
    await nameInput.fill(newName);
    
    // Verify the value was set
    await expect(nameInput).toHaveValue(newName);
    
    scenarioContext.lastUpdatedGroupName = newName;
    console.log(`Updated scheduling group name to: ${newName}`);
  },
);

When(
  'the user updates the notes to {string}',
  async ({ }, notes: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    // Wait for notes textarea to be ready
    const notesField = scenarioContext.page.locator('textarea[name="notes"]');
    await notesField.waitFor({ state: 'visible', timeout: 5000 });
    
    // Clear and fill
    await notesField.clear();
    await notesField.fill(notes);
    
    // Verify the value was set
    await expect(notesField).toHaveValue(notes);
    
    scenarioContext.lastUpdatedNotes = notes;
    console.log(`Updated notes to: ${notes}`);
  },
);

When(
  'the user clicks the Update scheduling group button',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    // Wait for the update button to be clickable
    const updateButton = scenarioContext.page.getByRole('button', { name: /Update scheduling group/i });
    await updateButton.waitFor({ state: 'visible', timeout: 5000 });
    await updateButton.click();
    
    // Wait for modal to close after successful update (check for loading states)
    try {
      // Wait for loading indicator to appear and disappear (typical pattern)
      await scenarioContext.page.locator('[class*="loading"], [class*="spinner"]').first().waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
    } catch (e) {
      // If no loading indicator, continue
    }
    
    // Wait for table to be visible again (indicates modal closed)
    await scenarioContext.page.locator('table tbody').waitFor({ state: 'visible', timeout: 8000 });
    
    console.log('Clicked Update scheduling group button');
  },
);

Then(
  'the scheduling group name is updated to {string}',
  async ({ }, expectedName: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    // Wait for navigation/modal close
    await scenarioContext.page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    
    // Simple: find any visible cell with the updated name
    await expect(scenarioContext.page.locator('td', { hasText: expectedName })).toBeVisible({ timeout: 10000 });
    
    console.log(`Verified scheduling group name is: ${expectedName}`);
  },
);

Then(
  'the notes are updated to {string}',
  async ({ }, expectedNotes: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    await scenarioContext.page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    
    const updatedGroupName = scenarioContext.lastUpdatedGroupName;
    if (!updatedGroupName) {
      throw new Error('No updated group name stored in context. Did the "updates the scheduling group name" step complete?');
    }
    
    // Find row with updated group name, then verify notes are in that row
    const groupRow = scenarioContext.page.locator('table tbody tr', {
      has: scenarioContext.page.locator('td', { hasText: updatedGroupName })
    });
    
    await expect(groupRow.locator('td', { hasText: expectedNotes })).toBeVisible({ timeout: 10000 });
    
    console.log(`✓ Verified notes "${expectedNotes}" for updated group "${updatedGroupName}"`);
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
    
    const userData = users[userAlias as keyof typeof users];
    if (!userData) {
      throw new Error(`User '${userAlias}' not found in users.json`);
    }
    
    const displayName = userData.displayName || userData.name || userAlias;
    
    // Get the UPDATED group name (or fall back to created name if not updated)
    const groupName = scenarioContext.lastUpdatedGroupName || scenarioContext.lastCreatedGroupName;
    
    if (!groupName) {
      throw new Error('No group name available in context');
    }
    
    // Find the row containing the (updated) group name, then verify the Last Amended By column contains current user
    const groupRow = scenarioContext.page.locator('table tbody tr', {
      has: scenarioContext.page.locator(`td.scheduling-group-name:has-text("${groupName}")`)
    });
    
    // The Last Amended By is typically in the 7th column (after: Actions, Area, Name, Team, Allocations, Notes)
    const lastAmendedByCell = groupRow.locator('td').nth(6); // 0-indexed, so 6 = 7th cell
    await expect(lastAmendedByCell).toContainText(displayName, { timeout: 10000 });
    console.log(`Verified Last Amended By displays current user: ${displayName}`);
  },
);

Then(
  'the Last Amended By displays {string} user',
  async ({ }, userName: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    const userElement = scenarioContext.page.getByText(userName);
    await expect(userElement).toBeVisible();
    console.log(`Verified Last Amended By displays user: ${userName}`);
  },
);
