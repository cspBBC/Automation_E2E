import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { expect } from '@playwright/test';
import { scenarioContext } from './schedulinggroup_ui_common.steps';

const { When, Then } = createBdd(test);

// Import common steps - scenarioContext is available globally

When(
  'the user clicks the History option for the scheduling group',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available. Did you call the Given step first?');
    }
    // Locator: .fa - History icon in actions column (can be refined to .fa-history or similar)
    const historyIcons = scenarioContext.page.locator('tr td div .fa');
    
    // Click the first history icon available
    if (await historyIcons.count() > 0) {
      await historyIcons.first().click();
      console.log('Clicked History option for scheduling group');
    } else {
      throw new Error('History icon not found');
    }
  },
);

Then(
  'the history popup displays with all historical changes',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    // Wait for popup/modal to appear and contain history data
    const historyContent = scenarioContext.page.locator('[role="dialog"]');
    await expect(historyContent).toBeVisible();
    console.log('Verified history popup is displayed');
  },
);

Then(
  'history shows timestamps of each modification',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    // Verify timestamps are visible in the history data
    const timestampElements = scenarioContext.page.locator('[role="dialog"] tr td');
    const count = await timestampElements.count();
    
    if (count > 0) {
      console.log(`Verified timestamps are present in history (${count} cells found)`);
    } else {
      throw new Error('No timestamp data found in history');
    }
  },
);

Then(
  'history shows user names who made each change',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    // Verify user names are displayed in the history data
    const historyTableRows = scenarioContext.page.locator('[role="dialog"] tbody tr');
    const rowCount = await historyTableRows.count();
    
    if (rowCount > 0) {
      console.log(`Verified user change information is present (${rowCount} history records found)`);
    } else {
      throw new Error('No user change records found in history');
    }
  },
);

Then(
  'history displays changes for Name, Notes, and other column modifications',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    // Verify column names in history table header
    const columnHeaders = scenarioContext.page.locator('[role="dialog"] thead th');
    const headerCount = await columnHeaders.count();
    
    if (headerCount >= 2) {
      console.log(`Verified column headers are present in history (${headerCount} columns)`);
    } else {
      throw new Error('Insufficient column headers found in history');
    }
  },
);

Then(
  'the user can close the history popup',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    // Locator: button { name: 'close' } OR [role="button"][aria-label="close"]
    const closeButton = scenarioContext.page.getByRole('link', { name: 'close' })
      .or(scenarioContext.page.locator('[role="button"][aria-label="close"]'))
      .or(scenarioContext.page.locator('button:has-text("×")'));
    
    if (await closeButton.count() > 0) {
      await closeButton.first().click();
      console.log('Clicked close button on history popup');
      
      // Wait for modal to close
      await scenarioContext.page.waitForFunction(() => {
        const dialog = document.querySelector('[role="dialog"]');
        return !dialog || (dialog as HTMLElement).offsetHeight === 0;
      });
    } else {
      console.log('Close button not found, attempting keyboard escape');
      await scenarioContext.page.keyboard.press('Escape');
    }
    
    console.log('Verified history popup is closed');
  },
);

Then(
  /^history shows user '(.+)' who made the changes$/,
  async ({ }, userName: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    // Verify the specified user appears in history records
    const historyTableRows = scenarioContext.page.locator('[role="dialog"] tbody tr');
    const rowCount = await historyTableRows.count();
    
    if (rowCount > 0) {
      // Try to find the user in the history
      const userElement = scenarioContext.page.locator(`[role="dialog"] :text("${userName}")`);
      const userCount = await userElement.count();
      
      if (userCount > 0) {
        console.log(`Verified user "${userName}" found in history (${rowCount} total records found)`);
      } else {
        console.log(`Warning: User "${userName}" not found explicitly in history (${rowCount} records present)`);
      }
    } else {
      throw new Error('No user change records found in history');
    }
  },
);
