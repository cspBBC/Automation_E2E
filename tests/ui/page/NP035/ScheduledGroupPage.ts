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