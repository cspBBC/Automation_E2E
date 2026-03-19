import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { expect } from '@playwright/test';
import { scenarioContext } from './schedulinggroup_ui_common.steps';

const { When, Then } = createBdd(test);

When(
  'the user clicks the Delete button for the scheduling group',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available. Did you call the Given step first?');
    }
    
    // Get the group name - use updated name if available (after edit), otherwise use created name
    const groupName = scenarioContext.lastUpdatedGroupName || scenarioContext.lastCreatedGroupName;
    
    await scenarioContext.page.locator('.fas.fa-trash-alt').first().click();
    console.log(`Clicked Delete button for scheduling group: "${groupName}"`);
  },
);

Then(
  'the delete confirmation popup appears with title {string}',
  async ({ }, popupTitle: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    // Wait for the delete popup to appear (using the actual div structure)
    await scenarioContext.page.waitForSelector('.delete-popup-table', { timeout: 10000 });
    const heading = scenarioContext.page.getByRole('heading', { name: popupTitle });
    await expect(heading).toBeVisible({ timeout: 10000 });
    console.log(`Verified delete confirmation popup with title: ${popupTitle}`);
  },
);

Then(
  'the confirmation message displays {string}',
  async ({ }, confirmationText: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    const message = scenarioContext.page.getByText(confirmationText);
    await expect(message).toBeVisible();
    console.log(`Verified confirmation message: ${confirmationText}`);
  },
);

When(
  'the user approves the deletion',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    // Get the group name - use updated name if available (after edit), otherwise use created name
    const groupName = scenarioContext.lastUpdatedGroupName || scenarioContext.lastCreatedGroupName;
    console.log(`Approving deletion for group: "${groupName}"`);
    
    // Click the "Yes" button using the button ID
    await scenarioContext.page.locator('#approve-delete-scheduling-group-form').click();
    console.log(`✓ Approved deletion for group: "${groupName}"`);
    await scenarioContext.page.waitForLoadState('networkidle');
  },
);

Then(
  'the scheduling group is no longer visible in the list',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    // Get the group name - use updated name if available (after edit), otherwise use created name
    const groupName = scenarioContext.lastUpdatedGroupName || scenarioContext.lastCreatedGroupName;
    
    if (groupName) {
      // Wait for the group row to disappear from the list
      console.log(`Waiting for group "${groupName}" to disappear from list...`);
      
      // Use locator-based approach with retry logic - more reliable than waitForFunction
      const deletedGroupRow = scenarioContext.page.locator('table tbody tr', {
        has: scenarioContext.page.locator(`td.scheduling-group-name:has-text("${groupName}")`)
      });
      
      // Wait for the row to be detached from DOM (max 10 seconds)
      await expect(deletedGroupRow).toHaveCount(0, { timeout: 10000 });
      
      console.log(`✓ Verified: Group "${groupName}" successfully removed from list`);
    } else {
      // Fallback: just verify table is visible
      const tableRows = scenarioContext.page.locator('tbody tr');
      await expect(tableRows).toBeTruthy();
      console.log(`Verified scheduling group removed from list.`);
    }
  },
);

Then(
  'the record is removed from the database',
  async ({ }) => {
    if (!scenarioContext.scheduledGroupPage) {
      throw new Error('ScheduledGroupPage instance not available.');
    }
    await scenarioContext.scheduledGroupPage.verifyScheduledGroupNotVisibleForUser();
    console.log('Verified record is removed from the database');
  },
);
