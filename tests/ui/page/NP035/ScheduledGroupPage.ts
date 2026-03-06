import { expect, Page } from '@playwright/test';
import { FormField } from '@feildtypes/formField';
import { fillForm } from '@helpers/formFiller';
import { readJSON } from '@helpers/readJson';
import { assert } from 'node:console';

export class ScheduledGroupPage {
  private formData?: Record<string, FormField>; // store JSON once

  constructor(private page: Page) { }

  // Open Scheduling Group page
  async open() {
    await this.page.goto('/mvc-app/admin/scheduling-group');
  }

  // Store formData and fill form
  async fill(formData: Record<string, FormField>) {
    this.formData = formData;
    await fillForm(this.page, formData);
  }

  // Create Scheduling Group using JSON data
  async createScheduledGroup(filename: string = 'schdGroupData') {

    // Click Add New
    await this.page.getByRole('button', { name: 'Add Scheduling Group' }).click();

    // Wait for modal/dialog
    await this.page.locator('#facebox').waitFor({ state: 'visible' });

    // Load JSON
    const jsonPath = `workflows/schedulingGroup/data/${filename}.json`;
    const jsonData = await readJSON(jsonPath);

    // Generate unique group name for each execution (01-99)
    const randomNum = Math.floor(Math.random() * 99) + 1;
    const formattedNum = String(randomNum).padStart(2, '0');
    jsonData['group_name'].value = `Test Scheduling Group_${formattedNum}`;

    // Fill form
    await this.fill(jsonData);

  }

  /**
   * Verify that a scheduling group created by a specific user is visible in the list
   * @param userAlias The user alias who created the scheduling group
   */
  async verifyScheduledGroupVisibleForUser(userAlias: string) {

    if (!this.formData) throw new Error('Form data not loaded');
    const groupName = this.formData['group_name'].value as string;

    assert(groupName, 'Group name is required for verification');
    
    // Look for the group in the table and verify it's visible
    const groupRow = this.page.locator('table#scheduling-list-table tbody tr').filter({
      has: this.page.locator(`td.scheduling-group-name:has-text("${groupName}")`)
    });

    await expect(groupRow).toHaveCount(1);
    console.log(`Verified that scheduling group '${groupName}' created by '${userAlias}' is visible in the list`);
  }


}