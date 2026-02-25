import { expect, Page } from '@playwright/test';
import { FormField } from '@feildtypes/formField'
import { fillForm } from '@helpers/formFiller';
import { readJSON } from '@helpers/readJson';

export class FacilityPage {
  private formData?: Record<string, FormField>; // store JSON once

  constructor(private page: Page) { }

  // Open home page
  async open() {
    await this.page.goto('mvc-app/facility');
  }


  // Store formData and fill form
  async fill(formData: Record<string, FormField>) {
    this.formData = formData;
    await fillForm(this.page, formData);
  }

  // Navigate to Facility Catalogue and create facility
  async createFacility(filename: string = 'facilityFormData') {
  
    // 2. Verify tab
    const facilityCatalogueTab = this.page.locator("ul[role='tablist'] li a").filter({ hasText: "Facility Catalogue" });
    expect(facilityCatalogueTab).toBeVisible();

    // 3. Click Add Facility
    await this.page.locator('#create-facility-button').click();
    await this.page.locator('div[aria-describedby="facility-form-dialog"]').waitFor({ state: 'visible' });

    // 4. Fill form
    const jsonPath = `workflows/facilities/data/${filename}.json`;
    const jsonData = await readJSON(jsonPath);
    await this.fill(jsonData);

    // 5. Submit
    await this.page.locator('#submit-create-facility-form-button').click();

    // 6. Wait for modal to disappear (indicating submission success)
    // Increased timeout for form submission and modal closure
    await this.page.waitForSelector('div[aria-describedby="facility-form-dialog"]', { 
      state: 'hidden',
      timeout: 30000 
    });

  }
  async verifyFacilityAdded() {
    if (!this.formData) throw new Error('Form data not loaded');

    const facilityName = this.formData['facility_frm'].value as string;

    // Wait for DataTable to render
    await this.page.locator('.dt-scroll-head').waitFor({ state: 'visible' });

    // Click the visible (cloned) header inside scroll container
    await this.page
      .locator('.dt-scroll-head th', { hasText: 'Facility Name' })
      .click();

    // Wait for sorting redraw
    await this.page.waitForTimeout(500);

    // Locate exact row match
    const facilityRow = this.page.locator('#facility-list-table tbody tr').filter({
      has: this.page.locator('th', {
        hasText: new RegExp(`^${facilityName}$`)
      })
    });

    await expect(facilityRow).toHaveCount(1, { timeout: 10000 });

    console.log(`✅ Facility "${facilityName}" verified with exact match`);
  }




  // Delete the facility that was just created
  async deleteCreatedFacility() {
    if (!this.formData) throw new Error('Form data not loaded');

    const facilityName = this.formData['facility_frm'].value as string;

    // 1️Locate the exact row by facility name
    const facilityRow = this.page.locator('#facility-list-table tbody tr', {
      has: this.page.locator('th', { hasText: new RegExp(`^${facilityName}$`) })
    });

    const rowCount = await facilityRow.count();
    if (rowCount === 0) {
      throw new Error(`Facility "${facilityName}" not found for deletion`);
    }
    if (rowCount > 1) {
      throw new Error(`Multiple rows found for facility "${facilityName}"`);
    }

    // 2️Locate the delete icon inside that row and click
    const deleteIcon = facilityRow.locator('td div i.delete-facility-icon').first();
    await deleteIcon.click();

    // 3️Wait for the delete confirmation modal to appear
    // The confirmation button is in a separate modal, not inside the row
    const confirmButton = this.page.locator('button.delete-popup:visible').first();
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();

    // 4️Wait until the facility row is removed
    await expect(facilityRow).toHaveCount(0);

    console.log(`🗑️ Facility "${facilityName}" successfully deleted`);
  }
  async assertViewFacility() {
    if (!this.formData) throw new Error('Form data not loaded');

    const facilityName = this.formData['facility_frm'].value as string;

    // 1️Locate the exact row
    const facilityRow = this.page.locator('#facility-list-table tbody tr', {
      has: this.page.locator('th', { hasText: new RegExp(`^${facilityName}$`) })
    });
    const count = await facilityRow.count();
    if (count === 0) throw new Error(`Facility "${facilityName}" not found`);

    // 2️Click the view icon
    const viewIcon = facilityRow.locator('td div i.view-facility-icon').first();
    await viewIcon.click();

    // 3️Locate the specific modal by title
    const modal = this.page.locator('div[role="dialog"][aria-modal="true"]', {
      has: this.page.locator('h1', { hasText: 'View Facility' })
    });
    await expect(modal).toBeVisible();

    // 4️Assert facility name in modal
    const modalFacilityName = modal.locator('table.facility-form tbody tr td', { hasText: facilityName });
    await expect(modalFacilityName).toHaveCount(1);

    console.log(`✅ View Facility modal for "${facilityName}" displayed correctly`);

    // 5️Close the modal using footer button only
    const closeButton = modal.locator('#facility-form-dialog button:has-text("Close")').first();
    await closeButton.click();

    // 6️ Wait until modal is hidden instead of removed
    await expect(modal).toBeHidden();
  }
}