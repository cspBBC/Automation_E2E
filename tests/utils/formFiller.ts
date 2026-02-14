import { Page } from '@playwright/test';
import { FormField, WeekDayAvailability } from '../types/formField';

// ---------- Chosen Dropdown ----------
async function selectChosenDropdown(page: Page, fieldId: string, value: string) {
  const container = page.locator(`#${fieldId}_chosen`);
  await container.click();

  const searchInput = container.locator('.chosen-search input');
  if (await searchInput.count()) {
    await searchInput.fill(value);
  }

  const option = container
    .locator('.chosen-results li.active-result')
    .filter({ hasText: value })
    .first();

  await option.waitFor({ state: 'visible' });
  await option.click();
}

// ---------- Multi Dropdown ----------
async function selectMultiDropdown(page: Page, fieldId: string, values: string[]) {
  const container = page.locator(`#${fieldId}_chosen`);
  await container.click();

  const input = container.locator('input');

  for (const val of values) {
    await input.fill(val);
    await page.keyboard.press('Enter');
  }
}

// ---------- Date Picker ----------
async function pickDate(page: Page, fieldId: string, dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);

  await page.click(`#${fieldId}`);
  await page.selectOption('.ui-datepicker-year', `${year}`);
  await page.selectOption('.ui-datepicker-month', `${month - 1}`);

  const dayLocator = page
    .locator('.ui-datepicker-calendar td:not(.ui-datepicker-other-month)')
    .getByText(String(day), { exact: true });

  await dayLocator.click();
}

// ---------- Facility Modal ----------
async function handleFacilityModal(
  page: Page,
  fieldId: string,
  value: string,
  subValues: string[] = []
) {
  await page.click(`#${fieldId}`);
  await page.waitForSelector('#facility-type-modal', { state: 'visible' });

  const mainLabel = page.locator('#facility-type-modal label', { hasText: value });
  const mainId = await mainLabel.getAttribute('for');
  if (!mainId) throw new Error(`Facility type "${value}" not found`);
  await page.check(`#${mainId}`);

  for (const sub of subValues) {
    const subLabel = page.locator('#facility-type-modal label', { hasText: sub });
    const subId = await subLabel.getAttribute('for');
    if (!subId) throw new Error(`Subtype "${sub}" not found`);
    await page.check(`#${subId}`);
  }

  await page.click('#facility-type-save-btn');
  await page.waitForSelector('#facility-type-modal', { state: 'hidden' });
}

// ---------- Weekly Availability ----------
async function handleWeeklyAvailability(
  page: Page,
  fieldId: string,
  weekData: Record<string, WeekDayAvailability>
) {
  await page.click(`#${fieldId}`);

  const prefix = 'facility_availability';

  for (const [day, config] of Object.entries(weekData)) {
    const row = page.locator(`.plain-table__row:has-text("${day}")`);

    const fromChosen = row.locator(`#${prefix}_${day}_from_frm_chosen`);
    const toChosen = row.locator(`#${prefix}_${day}_to_frm_chosen`);
    const checkbox = row.locator(`#${prefix}_${day}_unavailability_frm`);

    if (config.unavailable) {
      if (!(await checkbox.isChecked())) await checkbox.check();
      continue;
    }

    // FROM
    await fromChosen.click();
    await fromChosen
      .locator('.chosen-results li')
      .filter({ hasText: config.from })
      .first()
      .click();

    // TO
    await toChosen.click();
    await toChosen
      .locator('.chosen-results li')
      .filter({ hasText: config.to })
      .first()
      .click();

    if (await checkbox.isChecked()) await checkbox.uncheck();
  }

  // single Done click
  const doneBtn = page.locator('#facility-availability-save-btn');
  await doneBtn.waitFor({ state: 'visible' });
  await doneBtn.click();
}

async function handleDualListbox(
  page: Page,
  fieldId: string,  // e.g., 'technical_setup_open_frm'
  dualListboxes: { sourceId: string; targetId: string; selectedValues: string[] }[]
) {
  // 1. Click to open the modal dynamically
  await page.click(`#${fieldId}`);

  // 2. Wait for modal/section to appear
  await page.waitForSelector('#service_list_select', { state: 'visible' });

  // 3. Loop through each dual listbox
  for (const box of dualListboxes) {
    for (const val of box.selectedValues) {
      const option = page.locator(`#${box.sourceId} option`, { hasText: val }).first();
      await option.scrollIntoViewIfNeeded();
      await option.click();
      await page.click(`#${box.sourceId}_rightSelected`);
    }
  }

  // next button
  const nextBtn = page.locator('#facility-technical-setup-selection-next-page-quantity');
  await nextBtn.waitFor({ state: 'visible' });
  await nextBtn.click();
  //done

  const doneBtn = page.locator('#facility-technical-setup-complete');
  await doneBtn.waitFor({ state: 'visible' });
  await doneBtn.click();
}

// ---------- MAIN GENERIC FORM FILLER ----------
export async function fillForm(page: Page, formData: Record<string, FormField>) {
  for (const [fieldId, field] of Object.entries(formData)) {
    const { type, value, optional, subValues } = field;

    const exists = await page.locator(`#${fieldId}`).count();
    if (!exists) {
      if (!optional) console.warn(`Field "${fieldId}" not found`);
      continue;
    }

    switch (type) {
      case 'text':
      case 'number':
      case 'textarea':
        await page.fill(`#${fieldId}`, String(value));
        break;

      case 'dropdown':
        await selectChosenDropdown(page, fieldId, value as string);
        break;

      case 'multiDropdown':
        await selectMultiDropdown(page, fieldId, value as string[]);
        break;

      case 'radio':

        await page.locator(`label[for="${fieldId}"]`).click();
        break;


      case 'checkbox': {
        const checked = await page.isChecked(`#${fieldId}`);
        if (value && !checked) await page.check(`#${fieldId}`);
        if (!value && checked) await page.uncheck(`#${fieldId}`);
        break;
      }

      case 'date':
        await pickDate(page, fieldId, value as string);
        break;

      case 'facilityModal':
        await handleFacilityModal(page, fieldId, value as string, subValues);
        break;

      case 'weeklyAvailability':
        await handleWeeklyAvailability(
          page,
          fieldId,
          value as Record<string, WeekDayAvailability>
        );
        break;
      case 'dualListboxModal': {
        const dualListboxes = value as {
          sourceId: string;
          targetId: string;
          selectedValues: string[];
        }[];

        await handleDualListbox(page, fieldId, dualListboxes);
        break;
      }

      default:
        console.warn(`Unknown field type: ${type}`);
    }
  }
}