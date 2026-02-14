import { expect, Page } from '@playwright/test';
import { FormField } from '../../types/formField'
import { fillForm } from '../../utils/formFiller';
import { readJSON } from '../../utils/readJson';

export class HomePage {
  constructor(private page: Page) { }

  async open() {
    await this.page.goto('/');
  }


  async isBbcMenuLoaded() {
    const menuItems = this.page.locator("ul.sm.sm-clean.nav.bbcMenu > li.drop");
    const count = await menuItems.count();
    for (let i = 0; i < count; i++) {
      if (!(await menuItems.nth(i).isVisible())) return false;
    }
    return true;
  }


  // Fill form using JSON data
  async fill(formData: Record<string, FormField>) {
    await fillForm(this.page, formData);
   
  }

  async createFacility() {
    // 1. Locate the parent menu item and hover to open the submenu
    const parentText = "Booking";
    const parentItem = this.page.locator(`ul.sm.sm-clean.nav.bbcMenu > li.drop:has-text("${parentText}")`);
    await parentItem.click();

    // 2. Wait for the submenu item to appear
    const childText = "Facility Catalogue";
    const childItem = parentItem.locator(`ul > li:has-text("${childText}")`);
    await childItem.waitFor({ state: 'visible' });

    // 3. Click the submenu item
    await childItem.click();

    //clicking  Add Facility button +

    //verify tab first

    const facilityCatalogueTab = this.page.locator("ul[role='tablist'] li a").filter({ hasText: "Facility Catalogue" })

    expect(facilityCatalogueTab).toBeVisible()

    await this.page.locator('#create-facility-button').click();
    await this.page.locator('div[aria-describedby="facility-form-dialog"]').waitFor({ state: 'visible' });

    const formData = await readJSON('facilityFormData.json');
    await this.fill(formData)


  }
}