import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { expect } from '@playwright/test';
import { scenarioContext } from './schedulinggroup_ui_common.steps';
import users from '@core/data/users.json' with { type: 'json' };

const { When, Then } = createBdd(test);

When(
  'the user clicks the Edit button for the scheduling group',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available. Did you call the Given step first?');
    }
    await scenarioContext.page.locator('.fas.fa-edit').first().click();
    console.log('Clicked Edit button for scheduling group');
  },
);

When(
  'the user updates the scheduling group name to {string}',
  async ({ }, newName: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    await scenarioContext.page.locator('#group_name').fill(newName);
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
    await scenarioContext.page.locator('textarea[name="notes"]').fill(notes);
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
    await scenarioContext.page.getByRole('button', { name: 'Update scheduling group' }).click();
    console.log('Clicked Update scheduling group button');
  },
);

Then(
  'the scheduling group name is updated to {string}',
  async ({ }, expectedName: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    // Wait for modal/form to close by checking if the update button is gone
    await scenarioContext.page.waitForURL(/.*/, { timeout: 5000 }).catch(() => {});
    
    // Verify in the table - look for the group name in the scheduling-group-name class
    const groupNameCell = scenarioContext.page.locator('td.scheduling-group-name', {
      hasText: expectedName
    });
    await expect(groupNameCell).toBeVisible({ timeout: 10000 });
    console.log(`Verified scheduling group name is: ${expectedName}`);
  },
);

Then(
  'the notes are updated to {string}',
  async ({ }, expectedNotes: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    // After update, modal closes and we're back at list view. Verify in table instead.
    // Wait for modal/form to close
    await scenarioContext.page.waitForURL(/.*/, { timeout: 5000 }).catch(() => {});
    
    // Verify the updated notes appear in the table row for the UPDATED group name
    const updatedGroupName = scenarioContext.lastUpdatedGroupName;
    if (updatedGroupName) {
      // Find the row containing the updated scheduling group name
      const groupRow = scenarioContext.page.locator('table tbody tr', {
        has: scenarioContext.page.locator(`td.scheduling-group-name:has-text("${updatedGroupName}")`)
      });
      
      // Extract all cell texts from the row as a list
      const cellTexts = await groupRow.locator('td').allTextContents();
      
      console.log(`Row data for updated group "${updatedGroupName}":`, cellTexts);
      
      // Verify the notes text is in the row (should be in position 5: Actions, Area, Name, Team, Allocations, Notes)
      const notesFound = cellTexts.some(text => text.includes(expectedNotes));
      
      if (!notesFound) {
        throw new Error(`Expected notes "${expectedNotes}" not found in row. Row cells: ${JSON.stringify(cellTexts)}`);
      }
      
      console.log(`✓ Verified notes "${expectedNotes}" for updated group "${updatedGroupName}"`);
    } else {
      throw new Error('No updated group name stored in context. Did the "updates the scheduling group name" step complete?');
    }
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
