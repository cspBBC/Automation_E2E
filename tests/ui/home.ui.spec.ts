// filename: openUrl.spec.js
import { test, expect } from '@playwright/test';

test('open a URL', async ({ page }) => {
  // Navigate to the URL
  await page.goto('https://allocate-systest-dbr.national.core.bbc.co.uk/');

  // 1️⃣ Locate the Booking menu <a>
  const bookingMenu = page.locator('li.drop > a.main.down.has-submenu:has(b:text("Booking"))');

  // 2️⃣ Click the main menu to open submenu
  await bookingMenu.scrollIntoViewIfNeeded();
  await bookingMenu.click();

  // 3️⃣ Locate the Facility Catalogue submenu link inside this <li>
  const bookingLi = bookingMenu.locator('xpath=ancestor::li'); // get the parent <li>
  const facilityCatalogue = bookingLi.locator('a:has(b:text("Facility Catalogue"))')

  // 4️⃣ Wait until visible
  await expect(facilityCatalogue).toBeVisible({ timeout: 5000 });

  // 5️⃣ Click the submenu item
  await facilityCatalogue.click();

});
