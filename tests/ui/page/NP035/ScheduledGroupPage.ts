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

    const jsonPath = `workflows/schedulingGroup/data/${filename}.json`;
    const jsonData = await readJSON(jsonPath);

    const randomNum = Math.floor(Math.random() * 99) + 1;
    const formattedNum = String(randomNum).padStart(2, '0');

    jsonData['group_name'].value = `Test Scheduling Group11_${formattedNum}`;
    ScheduledGroupPage.lastCreatedGroupName = jsonData['group_name'].value;
    await this.fill(jsonData);
  }

  async verifyScheduledGroupVisibleForUser() {
    const groupName = ScheduledGroupPage.lastCreatedGroupName;
    if (!groupName) throw new Error('No group name to verify');
    const groupRow = this.page.locator('table#scheduling-list-table tbody tr').filter({
      has: this.page.locator(`td.scheduling-group-name:has-text("${groupName}")`)
    });
    await expect(groupRow).toHaveCount(1);

  
  }

  async verifyScheduledGroupNotVisibleForUser() {
    const groupName = ScheduledGroupPage.lastCreatedGroupName;
    if (!groupName) throw new Error('No group name to verify');
    const groupRow = this.page.locator('table#scheduling-list-table tbody tr').filter({
      has: this.page.locator(`td.scheduling-group-name:has-text("${groupName}")`)
    });
    await expect(groupRow).toHaveCount(0);
    //await this.page.screenshot({ path: 'scheduled_group_not_visible.png' });
   
  }

  /**
   * Verifies that the scheduling group created by a specific user is visible in the list.
   * @param userAlias The alias of the user who created the group (used to load the correct test data)
   */
  async verifyScheduledGroupVisibleForUserAlias() {
    // Load the group name from the test data file for the given user
    const groupName = ScheduledGroupPage.lastCreatedGroupName;
    if (!groupName) throw new Error('No group name to verify');
    const groupRow = this.page.locator('table#scheduling-list-table tbody tr').filter({
      has: this.page.locator(`td.scheduling-group-name:has-text("${groupName}")`)
    });
    await expect(groupRow).toHaveCount(1);
    //await this.page.screenshot({ path: 'scheduled_group_visible.png' });
  }

}