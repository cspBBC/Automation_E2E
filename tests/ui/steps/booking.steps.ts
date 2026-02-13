import { createBdd } from 'playwright-bdd'

const { Given, When, Then } = createBdd();

Given('user opens the Allocate application', async ({ page }) => {

  page.goto('https://allocate-systest-dbr.national.core.bbc.co.uk/', { waitUntil: 'domcontentloaded' });

  // await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
});

