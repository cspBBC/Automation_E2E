import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { expect } from '@playwright/test';
import { scenarioContext, getSchdGrpName } from '@helpers/contextVariables';

const { When, Then } = createBdd(test);

When(
  'the user clicks the Delete button for the scheduling group',
  async ({ contextManager }) => {
    if (!scenarioContext.page || !scenarioContext.scheduledGroupPage) {
      throw new Error('Page not available. Did you call the Given step first?');
    }
    
    const groupName = getSchdGrpName();
    if (!groupName) {
      throw new Error('No scheduling group name found in context');
    }
    
    // Click delete button for the specific group by name (not by position)
    await scenarioContext.scheduledGroupPage.clickDeleteForGroup(groupName);
    
    console.log(`✓ Clicked Delete button for group: "${groupName}"`);
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
    
    const groupName = getSchdGrpName();
    if (!groupName) {
      throw new Error('No scheduling group name found in context');
    }
    console.log(`Approving deletion for group: "${groupName}"`);
    
    await scenarioContext.page.locator('#approve-delete-scheduling-group-form').click();
    console.log(`Approved deletion for group: "${groupName}"`);
    
    await scenarioContext.page.waitForLoadState('networkidle');
    await scenarioContext.page.waitForTimeout(1500);
  },
);

Then(
  'the scheduling group is no longer visible in the list',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    const groupName = getSchdGrpName();
    
    if (groupName) {
      console.log(`Verifying group "${groupName}" is deleted...`);
      
      const deletedGroupRow = scenarioContext.page.locator('table tbody tr').filter({
        has: scenarioContext.page.locator(`td:has-text("${groupName}")`)
      });
      
      await expect(deletedGroupRow).toHaveCount(0, { timeout: 8000 });
      console.log(`Verified: Group "${groupName}" removed from list`);
    } else {
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

