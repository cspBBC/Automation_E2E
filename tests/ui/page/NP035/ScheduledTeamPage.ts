import { expect, Page } from '@playwright/test';
import { FormField } from '@feildtypes/formField';
import { fillForm } from '@helpers/formFiller';
import { readJSON } from '@helpers/readJson';

export class ScheduledteamPage {
  private formData?: Record<string, FormField>; // store JSON once

  constructor(private page: Page) { }

  // Open Scheduling Team page
  async open() {
    await this.page.goto('?menuRedirect=showscheduledteam');
  }

  // Store formData and fill form
  async fill(formData: Record<string, FormField>) {
    this.formData = formData;
    await fillForm(this.page, formData);
  }

  // Create Scheduling Team using JSON data
  async createScheduledTeam(filename: string = 'schedTeamFormData') {

    // Click Add New
    await this.page.getByRole('button', { name: 'Add New' }).click();

    // Wait for modal/dialog
    await this.page.locator('#myModalSchedTeam').waitFor({ state: 'visible' });

    // Load JSON
    const jsonPath = `workflows/schedulingTeam/data/${filename}.json`;
    const jsonData = await readJSON(jsonPath);

    // Fill form
    await this.fill(jsonData);

    // Wait for success message dialog
    await this.page.locator('#customAlert').waitFor({ state: 'visible', timeout: 10000 });

    // Verify success message
    const messageText = await this.page.locator('#customAlert td').first().textContent();
    expect(messageText).toContain('Scheduling Team record inserted successfully.');

    // Click OK button
    await this.page.locator('#customAlert input[type="submit"]').click();

    // Wait for dialog to close
    await this.page.locator('#customAlert').waitFor({ state: 'hidden' });
  }


}