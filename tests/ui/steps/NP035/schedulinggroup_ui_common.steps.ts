/**
 * SCHEDULING GROUP COMMON STEPS
 * 
 * PURPOSE:
 * --------
 * This step logs in a user and navigates to a page, preparing the test environment.
 * It populates testContext (per-test isolated object) that is shared with all subsequent steps.
 * 
 * FEATURE FILE INPUT:
 * -------------------
 * Given user 'areaAdmin_News' is on the "Scheduled Group" page
 * Extracts: userAlias='areaAdmin_News', pageName="Scheduled Group"
 * 
 * EXECUTION FLOW:
 * ---------------
 * 1. loginAs(userAlias) → returns authenticated Page object (browser session)
 * 2. getPageObject(pageName, page) → returns ScheduledGroupPage instance (domain object)
 * 3. scheduledGroupPage.open() → loads the page (waits for network idle)
 * 4. Stores in testContext:
 *    - testContext.page = authenticated Page object (for browser interactions)
 *    - testContext.scheduledGroupPage = ScheduledGroupPage instance (for domain methods)
 *    - testContext.currentUserAlias = user role (for user-specific assertions)
 * 
 * WHAT BECOMES INPUT FOR NEXT STEPS:
 * ----------------------------------
 * testContext (per-test isolated) → shared with When/Then steps in same test
 * Next steps READ from:
 *   - testContext.page = browser session (to interact: click, type, assert)
 *   - testContext.scheduledGroupPage = page object (reuse instead of recreating)
 *   - testContext.currentUserAlias = logged-in user role
 * Next steps WRITE to:
 *   - testContext.groupName = When step stores created group name
 *   - testContext.notes = When step stores entered notes
 * 
 * PARALLEL EXECUTION SAFETY:
 * -------------------------
 * ✓ Each test gets ONE testContext instance (created by fixture)
 * ✓ testContext is SHARED between all steps WITHIN same test (data persistence)
 * ✓ Different tests have different testContext instances (data isolation)
 * ✓ Result: Tests can run in parallel without interfering with each other
 */

import users from '@core/data/users.json' with { type: 'json' };
import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { getPageObject } from '@helpers/pageFactory';


const { Given } = createBdd(test);

Given(
  'user {string} is on the {string} page',
  async ({ loginAs, testContext }, userAlias: string, pageName: string) => {
    const page = await loginAs(userAlias as keyof typeof users);
    const scheduledGroupPage = getPageObject(pageName, page);
    await scheduledGroupPage.open();
    
    testContext.page = page;
    testContext.scheduledGroupPage = scheduledGroupPage;
    testContext.currentUserAlias = userAlias;
    
    console.log(`User '${userAlias}' is on ${pageName} page`);
  },
);
