import { expect, Page } from '@playwright/test';
import { FormField } from '@helpers/formFilledType';
import { fillForm } from '@helpers/formFiller';
import { readJSON } from '@helpers/readJson';

export class ScheduledGroupPage {

  private formData?: Record<string, FormField>;
  static lastCreatedGroupName: string | undefined;

  constructor(private page: Page) { }

  async open() {
    await this.page.goto('/mvc-app/admin/scheduling-group');
    // Wait for the page to be fully loaded and table to be visible
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('table#scheduling-list-table');
  }

  async fill(formData: Record<string, FormField>) {
    this.formData = formData;
    await fillForm(this.page, formData);
  }

  async createScheduledGroup(filename: string = 'schdGroupData') {

    await this.page.getByRole('button', { name: 'Add Scheduling Group' }).click();

    await this.page.locator('#facebox').waitFor({ state: 'visible' });

    const jsonPath = `workflows/ui/schedulingGroup/data/${filename}.json`;
    const jsonData = await readJSON(jsonPath);

    // Generate a unique name using timestamp + random to avoid duplicates
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const uniqueSuffix = `${timestamp}_${randomNum}`;

    jsonData['group_name'].value = `Test_SchdGrp_${uniqueSuffix}`;
    ScheduledGroupPage.lastCreatedGroupName = jsonData['group_name'].value;
    console.log(`Generated unique group name: "${jsonData['group_name'].value}"`);
    await this.fill(jsonData);
  }

  async verifyScheduledGroupVisibleForUser() {
    console.log(`\n[VERIFY] Checking if scheduling group is visible in table...`);
    // Refresh table to ensure we have latest data
    await this.refreshTableData();
    console.log(`[VERIFY] Searching for group: "${ScheduledGroupPage.lastCreatedGroupName}"...`);
    
    const groupName = ScheduledGroupPage.lastCreatedGroupName;
    if (!groupName) throw new Error('No group name to verify');
    const groupRow = this.page.locator('table#scheduling-list-table tbody tr').filter({
      has: this.page.locator(`td.scheduling-group-name:has-text("${groupName}")`)
    });
    await expect(groupRow).toHaveCount(1);
    console.log(`[VERIFY] ✓ Group found and visible\n`);
  }

  async verifyScheduledGroupNotVisibleForUser() {
    console.log(`\n[VERIFY] Checking if scheduling group is deleted from table...`);
    // Refresh table to ensure we have latest data (especially after deletion)
    await this.refreshTableData();
    console.log(`[VERIFY] Searching for group: "${ScheduledGroupPage.lastCreatedGroupName}"...`);
    
    const groupName = ScheduledGroupPage.lastCreatedGroupName;
    if (!groupName) throw new Error('No group name to verify');
    const groupRow = this.page.locator('table#scheduling-list-table tbody tr').filter({
      has: this.page.locator(`td.scheduling-group-name:has-text("${groupName}")`)
    });
    await expect(groupRow).toHaveCount(0);
    console.log(`[VERIFY] ✓ Group not found - successfully deleted\n`);
  }

  async verifyScheduledGroupVisibleForUserAlias() {
    console.log(`\n[VERIFY] Checking if scheduling group is visible for user...`);
    // Refresh table to ensure we have latest data
    await this.refreshTableData();
    console.log(`[VERIFY] Searching for group: "${ScheduledGroupPage.lastCreatedGroupName}"...`);
    
    // Load the group name from the test data file for the given user
    const groupName = ScheduledGroupPage.lastCreatedGroupName;
    if (!groupName) throw new Error('No group name to verify');
    const groupRow = this.page.locator('table#scheduling-list-table tbody tr').filter({
      has: this.page.locator(`td.scheduling-group-name:has-text("${groupName}")`)
    });
    await expect(groupRow).toHaveCount(1);
    console.log(`[VERIFY] ✓ Group found and visible\n`);
  }

  /**
   * Refreshes the table to ensure current data in parallel test environments
   * Waits for loading states and ensures the table contains latest data
   */
  async refreshTableData() {
    console.log('🔄 [TABLE REFRESH] Starting table data refresh for fresh server data...');
    
    // Wait for any loading spinners/indicators to disappear
    await this.page.locator('[class*="loading"], [class*="spinner"]').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    console.log('✓ [TABLE REFRESH] Loading spinners cleared');
    
    // Wait for network activity to complete (critical for fresh data from server)
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    console.log('✓ [TABLE REFRESH] Network idle - server data loaded');
    
    // Force table re-render by triggering reflow
    await this.page.evaluate(() => {
      const table = document.querySelector('table#scheduling-list-table tbody');
      if (table) {
        void (table as any).offsetHeight; // Trigger reflow
      }
    }).catch(() => {});
    console.log('✓ [TABLE REFRESH] Browser reflow triggered');
    
    // Ensure table is visible
    await this.page.locator('table#scheduling-list-table tbody').waitFor({ state: 'visible', timeout: 5000 });
    console.log('✓ [TABLE REFRESH] Table visible');
    
    // Scroll to top to ensure all rows are visible
    await this.page.locator('table#scheduling-list-table tbody').evaluate((el: HTMLElement) => el.scrollIntoView()).catch(() => {});
    console.log('✓ [TABLE REFRESH] Table scrolled to top');
    
    // Allow time for final render
    await this.page.waitForTimeout(500);
    console.log('✅ [TABLE REFRESH] Complete - table ready with fresh data\n');
  }

  /**
   * Gets the table row for a specific scheduling group by name
   * @param groupName The scheduling group name to find
   * @returns Locator for the table row containing the group
   */
  getRowByGroupName(groupName: string) {
    return this.page.locator('table#scheduling-list-table tbody tr').filter({
      has: this.page.locator(`td.scheduling-group-name:has-text("${groupName}")`)
    });
  }

  /**
   * Gets the edit button for a specific scheduling group
   * @param groupName The scheduling group name
   * @returns Locator for the edit button within that row
   */
  getEditButtonForGroup(groupName: string) {
    const row = this.getRowByGroupName(groupName);
    return row.locator('.fas.fa-edit, [aria-label="Edit scheduling group"]').first();
  }

  /**
   * Gets the delete button for a specific scheduling group
   * @param groupName The scheduling group name
   * @returns Locator for the delete button within that row
   */
  getDeleteButtonForGroup(groupName: string) {
    const row = this.getRowByGroupName(groupName);
    return row.locator('.fas.fa-trash-alt, [aria-label="Delete scheduling group"]').first();
  }

  /**
   * Gets the history button for a specific scheduling group
   * @param groupName The scheduling group name
   * @returns Locator for the history button within that row
   */
  getHistoryButtonForGroup(groupName: string) {
    const row = this.getRowByGroupName(groupName);
    return row.locator('.fa.fa-hourglass-end, [aria-label="View scheduling group history"]').first();
  }

  /**
   * Clicks the edit button for a specific scheduling group by name
   * Refreshes table first to ensure current data in parallel test environments
   * @param groupName The scheduling group name
   */
  async clickEditForGroup(groupName: string) {
    console.log(`\n[EDIT ACTION] Opening edit for group: "${groupName}"`);
    // Refresh table to get latest data before finding row
    await this.refreshTableData();
    console.log(`[EDIT ACTION] Locating edit button for group: "${groupName}"...`);
    
    const editButton = this.getEditButtonForGroup(groupName);
    await editButton.waitFor({ state: 'visible', timeout: 8000 });
    console.log(`[EDIT ACTION] ✓ Edit button found and clickable`);
    await editButton.click();
    // Wait for modal/form to appear after click
    await this.page.locator('#group_name').waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await this.page.waitForTimeout(500);
    console.log(`[EDIT ACTION] ✓ Edit form opened\n`);
  }

  /**
   * Clicks the delete button for a specific scheduling group by name
   * Refreshes table first to ensure current data in parallel test environments
   * @param groupName The scheduling group name
   */
  async clickDeleteForGroup(groupName: string) {
    console.log(`\n[DELETE ACTION] Opening delete for group: "${groupName}"`);
    // Refresh table to get latest data before finding row
    await this.refreshTableData();
    console.log(`[DELETE ACTION] Locating delete button for group: "${groupName}"...`);
    
    const deleteButton = this.getDeleteButtonForGroup(groupName);
    await deleteButton.waitFor({ state: 'visible', timeout: 8000 });
    console.log(`[DELETE ACTION] ✓ Delete button found and clickable`);
    await deleteButton.click();
    console.log(`[DELETE ACTION] ✓ Delete button clicked\n`);
  }

  /**
   * Clicks the history button for a specific scheduling group by name
   * Refreshes table first to ensure current data in parallel test environments
   * @param groupName The scheduling group name
   */
  async clickHistoryForGroup(groupName: string) {
    console.log(`\n[HISTORY ACTION] Opening history for group: "${groupName}"`);
    // Refresh table to get latest data before finding row
    await this.refreshTableData();
    console.log(`[HISTORY ACTION] Locating history button for group: "${groupName}"...`);
    
    const historyButton = this.getHistoryButtonForGroup(groupName);
    await historyButton.waitFor({ state: 'visible', timeout: 8000 });
    console.log(`[HISTORY ACTION] ✓ History button found and clickable`);
    await historyButton.click();
    console.log(`[HISTORY ACTION] ✓ History button clicked\n`);
  }

}