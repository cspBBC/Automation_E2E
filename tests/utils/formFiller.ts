import { Page } from "@playwright/test";
import { FormField, WeekDayAvailability } from "@feildtypes/formField";

// ---------- Standard HTML Select Dropdown ----------
async function selectStandardDropdown(
  page: Page,
  fieldId: string,
  value: string,
) {
  // Select by value attribute (numeric) or by label text
  const select = page.locator(`#${fieldId}`);
  
  // Try to select by value first (if value is numeric like "1", "2")
  try {
    await select.selectOption(value);
  } catch {
    // If value is text, find the option with matching text and select by its value
    const option = select.locator(`option:has-text("${value}")`).first();
    const optionValue = await option.getAttribute("value");
    if (optionValue) {
      await select.selectOption(optionValue);
    } else {
      throw new Error(`Option with text "${value}" not found in select #${fieldId}`);
    }
  }
}

// ---------- Chosen Dropdown ----------
async function selectChosenDropdown(
  page: Page,
  fieldId: string,
  value: string,
) {
  const container = page.locator(`#${fieldId}_chosen`);
  await container.click();

  const searchInput = container.locator(".chosen-search input");
  if (await searchInput.count()) {
    await searchInput.fill(value);
  }

  const option = container
    .locator(".chosen-results li.active-result")
    .filter({ hasText: value })
    .first();

  await option.waitFor({ state: "visible" });
  await option.click();
}

// ---------- Multi Dropdown ----------
async function selectMultiDropdown(
  page: Page,
  fieldId: string,
  values: string[],
) {
  const container = page.locator(`#${fieldId}_chosen`);
  await container.click();

  const input = container.locator("input");

  for (const val of values) {
    await input.fill(val);
    await page.keyboard.press("Enter");
  }
}

// ---------- Date Picker ----------
async function pickDate(page: Page, fieldId: string, dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);

  await page.click(`#${fieldId}`);
  await page.selectOption(".ui-datepicker-year", `${year}`);
  await page.selectOption(".ui-datepicker-month", `${month - 1}`);

  const dayLocator = page
    .locator(".ui-datepicker-calendar td:not(.ui-datepicker-other-month)")
    .getByText(String(day), { exact: true });

  await dayLocator.click();
}

// ---------- GENERIC MODAL HANDLER ----------
async function handleGenericModal(
  page: Page,
  fieldId: string,
  data: { value: string; subValues?: string[] },
) {
  const { value, subValues = [] } = data;

  // Open modal dynamically
  await page.click(`#${fieldId}, #${fieldId}_open_frm`);

  // Wait for any visible modal ending with '-modal'
  const modal = page.locator(`[id$="-modal"]:visible`).first();
  await modal.waitFor({ state: "visible" });

  // Select main option by label
  const mainLabel = modal.locator("label", { hasText: value });
  const mainId = await mainLabel.getAttribute("for");
  if (!mainId) throw new Error(`Option "${value}" not found in modal`);
  await page.check(`#${mainId}`);

  // Select sub-options if any
  for (const sub of subValues) {
    const subLabel = modal.locator("label", { hasText: sub });
    const subId = await subLabel.getAttribute("for");
    if (!subId) throw new Error(`Sub-option "${sub}" not found in modal`);
    await page.check(`#${subId}`);
  }

  // Click visible save/done button inside modal
  const doneBtn = modal
    .locator("button:visible")
    .filter({ hasText: /save|done/i })
    .first();
  await doneBtn.click();

  // Wait for modal to disappear
  await modal.waitFor({ state: "hidden" });
}

// ---------- Weekly Availability ----------

async function handleWeeklyAvailability(
  page: Page,
  fieldId: string,
  weekData: Record<string, WeekDayAvailability>
) {
  // Open modal dynamically
  const openSelector = page.locator(`#${fieldId}_open_frm, #${fieldId}_frm`).first();
  if (!(await openSelector.count())) throw new Error(`Weekly availability element not found for "${fieldId}"`);
  await openSelector.click();

  const prefix = fieldId;

  // Fill each day's availability
  for (const [day, config] of Object.entries(weekData)) {
    const row = page.locator(`.plain-table__row:has-text("${day}")`);

    const fromChosen = row.locator(`#${prefix}_${day}_from_frm_chosen`);
    const toChosen = row.locator(`#${prefix}_${day}_to_frm_chosen`);
    const checkbox = row.locator(`#${prefix}_${day}_unavailability_frm`);

    if (config.unavailable) {
      if (!(await checkbox.isChecked())) await checkbox.check();
      continue;
    }

    // FROM time
    await fromChosen.click();
    await fromChosen.locator('.chosen-results li').filter({ hasText: config.from }).first().click();

    // TO time
    await toChosen.click();
    await toChosen.locator('.chosen-results li').filter({ hasText: config.to }).first().click();

    // Uncheck unavailable if previously checked
    if (await checkbox.isChecked()) await checkbox.uncheck();
  }

  // ---------------- Click the Done button ----------------
  // Prefer ID first, fallback to any visible Save/Done button
  const doneBtn = page.locator(`#${fieldId}-save-btn, button:visible`).filter({ hasText: /save|done/i }).first();
  if (!(await doneBtn.count())) throw new Error(`Done/Save button not found for "${fieldId}"`);

  await doneBtn.click();}

// list box from > to list
async function handleDualListbox(
  page: Page,
  fieldId: string, // e.g., 'technical_setup_open_frm'
  dualListboxes: {
    sourceId: string;
    targetId: string;
    selectedValues: string[];
  }[],
) {
  // 1. Click to open the modal dynamically
  await page.click(`#${fieldId}`);

  // 2. Wait for modal/section to appear
  await page.waitForSelector("#service_list_select", { state: "visible" });

  // 3. Loop through each dual listbox
  for (const box of dualListboxes) {
    for (const val of box.selectedValues) {
      const option = page
        .locator(`#${box.sourceId} option`, { hasText: val })
        .first();
      await option.scrollIntoViewIfNeeded();
      await option.click();
      await page.click(`#${box.sourceId}_rightSelected`);
    }
  }

  // next button
  const nextBtn = page.locator(
    "#facility-technical-setup-selection-next-page-quantity",
  );
  await nextBtn.waitFor({ state: "visible" });
  await nextBtn.click();
  //done

  const doneBtn = page.locator("#facility-technical-setup-complete");
  await doneBtn.waitFor({ state: "visible" });
  await doneBtn.click();
}

// ---------- MAIN GENERIC FORM FILLER ----------
export async function fillForm(
  page: Page,
  formData: Record<string, FormField>,
) {
  for (const [fieldId, field] of Object.entries(formData)) {
    const { type, value, optional, subValues } = field;

    const exists = await page
      .locator(`#${fieldId}, #${fieldId}_frm, #${fieldId}_open_frm`)
      .count();

    if (!exists) {
      if (!optional) console.warn(`Field "${fieldId}" not found`);
      continue;
    }

    switch (type) {
      case "text":
      case "number":
      case "textarea":
        await page.fill(`#${fieldId}`, String(value));
        break;

      case "dropdown": {
        // Check if it's a standard HTML select or a Chosen dropdown
        const isStandardSelect = await page.locator(`#${fieldId}`).count() > 0;
        const isChosenDropdown = await page.locator(`#${fieldId}_chosen`).count() > 0;
        
        if (isStandardSelect) {
          await selectStandardDropdown(page, fieldId, value as string);
        } else if (isChosenDropdown) {
          await selectChosenDropdown(page, fieldId, value as string);
        } else {
          throw new Error(`No dropdown found for field "${fieldId}"`);
        }
        break;
      }

      case "multiDropdown":
        await selectMultiDropdown(page, fieldId, value as string[]);
        break;

      case "radio":
        await page.locator(`label[for="${fieldId}"]`).click();
        break;

      case "checkbox": {
        const checked = await page.isChecked(`#${fieldId}`);
        if (value && !checked) await page.check(`#${fieldId}`);
        if (!value && checked) await page.uncheck(`#${fieldId}`);
        break;
      }

      case "date":
        await pickDate(page, fieldId, value as string);
        break;

      case "facilityModal":
        await handleGenericModal(page, fieldId, {
          value: value as string,
          subValues,
        });
        break;

      case "weeklyAvailability":
        await handleWeeklyAvailability(
          page,
          fieldId,
          value as Record<string, WeekDayAvailability>,
        );
        break;
      case "dualListboxModal": {
        const dualListboxes = value as {
          sourceId: string;
          targetId: string;
          selectedValues: string[];
        }[];

        await handleDualListbox(page, fieldId, dualListboxes);
        break;
      }

      case "button": {
        const button = page.locator(`#${fieldId}`).first();
        await button.waitFor({ state: "visible", timeout: 5000 }).catch(() => {
          if (!optional) console.warn(`Button "${fieldId}" not visible`);
        });
        if (await button.isVisible()) {
          await button.click();
        }
        break;
      }

      default:
        console.warn(`Unknown field type: ${type}`);
    }
  }
}
