import { Page } from '@playwright/test';
import users from '@core/data/users.json' with { type: 'json' };
import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { getPageObject, PageObject } from '@helpers/pageFactory';
import { scenarioContext, initializeScenarioContext } from '@helpers/scenarioContextManager';

const { Given, When } = createBdd(test);

Given(
  'user {string} is on the {string} page',
  async ({ loginAs }, userAlias: string, pageName: string) => {
    // Initialize isolated context for this test
    initializeScenarioContext();
    
    const page = await loginAs(userAlias as keyof typeof users);
    
    const scheduledGroupPage = getPageObject(pageName, page);
    await scheduledGroupPage.open();
    
    scenarioContext.page = page;
    scenarioContext.scheduledGroupPage = scheduledGroupPage;
    scenarioContext.currentUserAlias = userAlias;
    
    console.log(`User '${userAlias}' is on ${pageName} page`);
  },
);

When(
  'user {string} navigates to the {string} page',
  async ({ loginAs }, userAlias: string, pageName: string) => {
    const page = await loginAs(userAlias as keyof typeof users);
    
    const scheduledGroupPage = getPageObject(pageName, page);
    await scheduledGroupPage.open();
    
    scenarioContext.page = page;
    scenarioContext.scheduledGroupPage = scheduledGroupPage;
    scenarioContext.currentUserAlias = userAlias;
    
    console.log(`User '${userAlias}' navigated to ${pageName} page`);
  },
);
