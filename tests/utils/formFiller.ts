import { Page } from '@playwright/test';
import { FormField } from '../types/formField';

// --- Special Widget Handlers ---
async function selectChosenDropdown(page: Page, fieldId: string, value: string) {
  const container = page.locator(`#${fieldId}_chosen`);
  await container.click();
  await container.locator('input').fill(value);
  await page.keyboard.press('Enter');
}

async function selectMultiDropdown(page: Page, fieldId: string, values: string[]) {
  const container = page.locator(`#${fieldId}_chosen`);
  await container.click();
  for (const val of values) {
    await container.locator('input').fill(val);
    await page.keyboard.press('Enter');
  }
}

async function pickDate(page: Page, fieldId: string, value: string) {
  await page.fill(`#${fieldId}`, value); // Can extend to calendar clicks if needed
}

// --- Generic Form Filler ---
export async function fillForm(page: Page, formData: Record<string, FormField>) {
  for (const [fieldId, field] of Object.entries(formData)) {
    const { type, value, optional } = field;

    const elementCount = await page.locator(`#${fieldId}`).count();
    if (!elementCount) {
      if (optional) continue;
      console.warn(`Field ${fieldId} not found in DOM`);
      continue;
    }

    switch (type) {
      case 'text':
      case 'number':
      case 'textarea':
        await page.fill(`#${fieldId}`, value.toString());
        break;

      case 'dropdown':
        await selectChosenDropdown(page, fieldId, value);
        break;

      case 'multiDropdown':
        await selectMultiDropdown(page, fieldId, value);
        break;

      case 'radio':
        await page.check(`input[name='${fieldId}'][value='${value}']`);
        break;

      case 'checkbox':
        const isChecked = await page.isChecked(`#${fieldId}`);
        if (value && !isChecked) await page.check(`#${fieldId}`);
        if (!value && isChecked) await page.uncheck(`#${fieldId}`);
        break;

      case 'date':
        await pickDate(page, fieldId, value);
        break;

      default:
        console.warn(`Unknown type "${type}" for field "${fieldId}"`);
    }
  }
}