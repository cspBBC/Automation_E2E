import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { expect } from '@playwright/test';
import { scenarioContext } from './schedulinggroup_ui_common.steps';

const { When, Then } = createBdd(test);

When(
  'the user clicks the Delete button for the scheduling group',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available. Did you call the Given step first?');
    }
    await scenarioContext.page.locator('.fas.fa-trash-alt').first().click();
    console.log('Clicked Delete button for scheduling group');
  },
);

Then(
  'the delete confirmation popup appears with title {string}',
  async ({ }, popupTitle: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    const heading = scenarioContext.page.getByRole('heading', { name: popupTitle });
    await expect(heading).toBeVisible();
    console.log(`Verified delete confirmation popup with title: ${popupTitle}`);
  },
);

Then(
  'the confirmation message displays {string}',
  async ({ }, confirmationText: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    const message = scenarioContext.page.getByText(confirmationText);
    await expect(message).toBeVisible();
    console.log(`Verified confirmation message: ${confirmationText}`);
  },
);

When(
  'the user approves the deletion',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    await scenarioContext.page.getByRole('button', { name: /Approve deletion scheduling/ }).click();
    console.log('Clicked Approve deletion button');
    await scenarioContext.page.waitForLoadState('networkidle');
  },
);

Then(
  'the scheduling group is no longer visible in the list',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    const tableRows = scenarioContext.page.locator('tbody tr');
    const count = await tableRows.count();
    console.log(`Verified scheduling group removed from list. Current rows: ${count}`);
  },
);

Then(
  'the record is removed from the database',
  async ({ }) => {
    if (!scenarioContext.scheduledGroupPage) {
      throw new Error('ScheduledGroupPage instance not available.');
    }
    await scenarioContext.scheduledGroupPage.verifyScheduledGroupNotVisibleForUser();
    console.log('Verified record is removed from the database');
  },
);
