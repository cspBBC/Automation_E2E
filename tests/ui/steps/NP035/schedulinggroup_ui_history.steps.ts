import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { expect } from '@playwright/test';
import { scenarioContext, getSchdGrpName } from '@helpers/contextVariables';

const { When, Then } = createBdd(test);



When(
  'the user clicks the History option for the scheduling group',
  async ({ contextManager }) => {
    if (!scenarioContext.page || !scenarioContext.scheduledGroupPage) {
      throw new Error('Page not available. Did you call the Given step first?');
    }
    
    const groupName = getSchdGrpName();
    if (!groupName) {
      throw new Error('No scheduling group name found in context.');
    }
    
    // Click the history button for the specific group by name (not by position)
    await scenarioContext.scheduledGroupPage.clickHistoryForGroup(groupName);
    
    // Wait for history wrapper to appear
    await scenarioContext.page.locator('#historyWapper').waitFor({ state: 'visible', timeout: 10000 });
    
    // Wait for page to settle
    await scenarioContext.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await scenarioContext.page.waitForTimeout(500);
    
    console.log(`✓ Clicked History option for group: "${groupName}"`);
  },
);

Then(
  'the history popup displays with all historical changes',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    // Wait for the history wrapper to appear
    const historyContent = scenarioContext.page.locator('#historyWapper');
    await expect(historyContent).toBeVisible({ timeout: 10000 });

    // Wait for content to fully load and render
    await scenarioContext.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await scenarioContext.page.waitForTimeout(500);

    console.log('Verified history popup is displayed with Scheduling Group audit trail');
  },
);

Then(
  'history shows timestamps of each modification',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    // Verify that history contains timestamp in format dd/mm/yyyy hh:mm
    const historyContent = scenarioContext.page.locator('#historyWapper');
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
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    // Verify that history contains 'by' followed by user name
    const historyContent = scenarioContext.page.locator('#historyWapper');
    const historyText = await historyContent.textContent();
    
    if (!historyText || !/\sby\s/.test(historyText)) {
      throw new Error('No user information found in history records');
    }
    
    console.log('Verified user names in history');
  },
);

Then(
  'history displays changes for Name, Notes, and other column modifications',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    // Verify that history contains change action keywords
    const historyContent = scenarioContext.page.locator('#historyWapper');
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
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    // Click the close button using accessible selector
    await scenarioContext.page.getByRole('link', { name: 'close' }).click();
    
    // Wait for history wrapper to disappear
    await scenarioContext.page.locator('#historyWapper').waitFor({ state: 'hidden', timeout: 5000 });
    
    // Wait for page to settle after closing
    await scenarioContext.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await scenarioContext.page.waitForTimeout(500);
    
    console.log('Verified history popup is closed');
  },
);

Then(
  /^history shows user '(.+)' who made the changes$/,
  async ({ }, userName: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    // Verify the specified user appears in history
    const historyContent = scenarioContext.page.locator('#historyWapper');
    await expect(historyContent).toContainText(userName, { timeout: 10000 });
    
    console.log(`Verified user "${userName}" found in history`);
  },
);
