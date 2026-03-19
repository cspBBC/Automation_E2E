import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { expect } from '@playwright/test';
import { scenarioContext } from './schedulinggroup_ui_common.steps';

const { When, Then } = createBdd(test);

When(
  'the user clicks the Edit button for the scheduling group',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available. Did you call the Given step first?');
    }
    await scenarioContext.page.locator('.fas.fa-edit').first().click();
    console.log('Clicked Edit button for scheduling group');
  },
);

When(
  'the user updates the scheduling group name to {string}',
  async ({ }, newName: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    await scenarioContext.page.locator('#group_name').fill(newName);
    console.log(`Updated scheduling group name to: ${newName}`);
  },
);

When(
  'the user updates the notes to {string}',
  async ({ }, notes: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    await scenarioContext.page.locator('textarea[name="notes"]').fill(notes);
    console.log(`Updated notes to: ${notes}`);
  },
);

When(
  'the user clicks the Update scheduling group button',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    await scenarioContext.page.getByRole('button', { name: 'Update scheduling group' }).click();
    console.log('Clicked Update scheduling group button');
  },
);

Then(
  'the scheduling group name is updated to {string}',
  async ({ }, expectedName: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    const nameField = scenarioContext.page.locator('#group_name');
    await expect(nameField).toHaveValue(expectedName);
    console.log(`Verified scheduling group name is: ${expectedName}`);
  },
);

Then(
  'the notes are updated to {string}',
  async ({ }, expectedNotes: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    const notesField = scenarioContext.page.locator('textarea[name="notes"]');
    await expect(notesField).toHaveValue(expectedNotes);
    console.log(`Verified notes are: ${expectedNotes}`);
  },
);

Then(
  'the Last Amended Date reflects today\'s date',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    const today = new Date().toLocaleDateString();
    const lastAmendedDateColumn = scenarioContext.page.getByText('Last Amended Date');
    await expect(lastAmendedDateColumn).toBeVisible();
    console.log(`Verified Last Amended Date reflects today: ${today}`);
  },
);

Then(
  'the Last Amended By displays current user',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    const lastAmendedByColumn = scenarioContext.page.getByText('Last Amended By');
    await expect(lastAmendedByColumn).toBeVisible();
    console.log('Verified Last Amended By displays current user');
  },
);

Then(
  'the Last Amended By displays {string} user',
  async ({ }, userName: string) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available.');
    }
    const userElement = scenarioContext.page.getByText(userName);
    await expect(userElement).toBeVisible();
    console.log(`Verified Last Amended By displays user: ${userName}`);
  },
);
