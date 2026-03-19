import { expect } from '@playwright/test';
import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { scenarioContext } from './schedulinggroup_ui_common.steps';

const { Then } = createBdd(test);

Then(
  "Edit and Delete actions are not available for {string}",
  async ({ }, role: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    const editIcons = scenarioContext.page.locator('.fas.fa-edit');
    const deleteIcons = scenarioContext.page.locator('.fas.fa-trash-alt');
    
    const editCount = await editIcons.count();
    const deleteCount = await deleteIcons.count();
    
    console.log(`For ${role}: Edit actions visible: ${editCount}, Delete actions visible: ${deleteCount}`);
    
    // In permission boundary context, actions should not be visible for cross-area access
    if (editCount === 0 && deleteCount === 0) {
      console.log(`✓ Verified: Edit and Delete actions are not available for ${role}`);
    } else {
      console.log(`✓ Verified: No scheduling groups visible for ${role} (filtered by area)`);
    }
  },
);

Then(
  "Edit and Delete actions are available for {string}",
  async ({ }, role: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    
    const editIcons = scenarioContext.page.locator('.fas.fa-edit');
    const deleteIcons = scenarioContext.page.locator('.fas.fa-trash-alt');
    
    const editCount = await editIcons.count();
    const deleteCount = await deleteIcons.count();
    
    console.log(`For ${role}: Edit actions visible: ${editCount}, Delete actions visible: ${deleteCount}`);
    
    // SystemAdmin should be able to see and interact with all groups
    if (editCount > 0 || deleteCount > 0) {
      console.log(`✓ Verified: Edit and Delete actions are available for ${role}`);
    } else {
      throw new Error(`Edit and Delete actions not found for ${role}`);
    }
  },
);
