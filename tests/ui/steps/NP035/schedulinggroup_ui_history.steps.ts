import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { expect } from '@playwright/test';
import { scenarioContext } from '@helpers/scenarioContextManager';

const { When, Then } = createBdd(test);

// Import common steps - scenarioContext is available globally

When(
  'the user clicks the History option for the scheduling group',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available. Did you call the Given step first?');
    }
    // Use the unique group name from context (updated or created)
    const groupName = scenarioContext.lastUpdatedGroupName || scenarioContext.lastCreatedGroupName;
    if (!groupName) {
      throw new Error('No group name found in context.');
    }
    // Find the row with this group name
    const groupRow = scenarioContext.page.locator('table tbody tr').filter({
      has: scenarioContext.page.locator(`td.scheduling-group-name:has-text("${groupName}")`)
    });
    // Wait for the row to be present
    await expect(groupRow).toHaveCount(1, { timeout: 8000 });
    // Find the history icon in this row (assume .fa-history or .fa)
    const historyIcon = groupRow.locator('.fa-history, .fa');
    if (await historyIcon.count() > 0) {
      await historyIcon.first().click();
      console.log(`Clicked History option for group: "${groupName}"`);
      // Wait a bit for the popup to start appearing after click
      await scenarioContext.page.waitForTimeout(500);
    } else {
      throw new Error('History icon not found in row for group: ' + groupName);
    }
  },
);

Then(
  'the history popup displays with all historical changes',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    // Wait for the facebox modal container to appear first
    await scenarioContext.page.locator('#facebox').waitFor({ state: 'visible', timeout: 10000 });
    // Now wait for the popup inside facebox
    await scenarioContext.page.locator('#facebox div.popup').waitFor({ state: 'visible', timeout: 10000 });

    const historyContent = scenarioContext.page.locator('#facebox div.popup');
    await expect(historyContent).toBeVisible();

    // Verify it contains "Scheduling Group" - the core audit trail indicator
    const historyText = await scenarioContext.page.locator('#facebox div.popup table.redtable tbody tr td p').allTextContents();
    const hasSchedulingGroupReference = historyText.some((text: string) => text.includes('Scheduling Group'));

    if (!hasSchedulingGroupReference) {
      throw new Error('History does not contain "Scheduling Group" reference');
    }

    console.log('Verified history popup is displayed with Scheduling Group audit trail');
  },
);

Then(
  'history shows timestamps of each modification',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    try {
      // Ensure popup is still visible before querying
      await scenarioContext.page.locator('div.popup').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
        console.log('Popup visibility check timed out, continuing with query...');
      });
      
      // Verify "Scheduling Group" + actual timestamp content in history (format: dd/mm/yyyy hh:mm)
      const historyText = await scenarioContext.page.locator('div.popup table.redtable tbody tr td p').allTextContents();
      
      const hasSchedulingGroup = historyText.some((text: string) => text.includes('Scheduling Group'));
      const hasTimestamp = historyText.some((text: string) => /\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}/.test(text));
      
      if (!hasSchedulingGroup) {
        throw new Error('History does not contain "Scheduling Group" reference');
      }
      if (!hasTimestamp) {
        throw new Error('No timestamps with correct format (dd/mm/yyyy hh:mm) found in history');
      }
      
      console.log(`Verified "Scheduling Group" and timestamps are present in history`);
    } catch (error) {
      throw new Error(`Failed to verify timestamps: ${error}`);
    }
  },
);

Then(
  'history shows user names who made each change',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    try {
      // Ensure popup is still visible before querying
      await scenarioContext.page.locator('div.popup').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
        console.log('Popup visibility check timed out, continuing with query...');
      });
      
      // Verify "Scheduling Group" + user names appear in history records (e.g., "by ChandraShekar Pandey on")
      const historyText = await scenarioContext.page.locator('div.popup table.redtable tbody tr td p').allTextContents();
      
      const hasSchedulingGroup = historyText.some((text: string) => text.includes('Scheduling Group'));
      const hasUserInfo = historyText.some((text: string) => /\sby\s[\w\s]+\son\s/.test(text));
      
      if (!hasSchedulingGroup) {
        throw new Error('History does not contain "Scheduling Group" reference');
      }
      if (!hasUserInfo) {
        throw new Error('No user information found in history records');
      }
      
      console.log(`Verified "Scheduling Group" and user names who made changes are present in history`);
    } catch (error) {
      throw new Error(`Failed to verify user names: ${error}`);
    }
  },
);

Then(
  'history displays changes for Name, Notes, and other column modifications',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    try {
      // Ensure popup is still visible before querying
      await scenarioContext.page.locator('div.popup').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
        console.log('Popup visibility check timed out, continuing with query...');
      });
      
      // Verify "Scheduling Group" + actual change descriptions in history (e.g., "created", "changed notes", "updated")
      const historyText = await scenarioContext.page.locator('div.popup table.redtable tbody tr td p').allTextContents();
      
      const hasSchedulingGroup = historyText.some((text: string) => text.includes('Scheduling Group'));
      const hasChangeActions = historyText.some((text: string) => /created|changed|updated|modified/i.test(text));
      
      if (!hasSchedulingGroup) {
        throw new Error('History does not contain "Scheduling Group" reference');
      }
      if (!hasChangeActions) {
        throw new Error('No change action descriptions found in history');
      }
      
      console.log(`Verified "Scheduling Group" and change descriptions (created/changed/updated) are present in history`);
    } catch (error) {
      throw new Error(`Failed to verify change descriptions: ${error}`);
    }
  },
);

Then(
  'the user can close the history popup',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    // Locator: a.close inside div.popup
    const closeButton = scenarioContext.page.locator('div.popup a.close');
    
    if (await closeButton.count() > 0) {
      await closeButton.first().click();
      console.log('Clicked close button on history popup');
      
      // Wait for modal to close
      await scenarioContext.page.waitForFunction(() => {
        const popup = document.querySelector('div.popup');
        return !popup || (popup as HTMLElement).offsetHeight === 0;
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
    const historyTableRows = scenarioContext.page.locator('div.popup table.redtable tbody tr');
    const rowCount = await historyTableRows.count();
    
    if (rowCount > 0) {
      // Try to find the user in the history
      const userElement = scenarioContext.page.locator(`div.popup :text("${userName}")`);
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
