import users from '@core/data/users.json' with { type: 'json' };
import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { getPageObject, PageObject } from '@helpers/pageFactory';
import { scenarioContext } from '@helpers/contextVariables';

const { Given, When } = createBdd(test);

// Shared logic for page setup used by both Given and When steps
async function setupPageContext(loginAs: any, userAlias: string, pageName: string, stepType: string) {
  const page = await loginAs(userAlias as keyof typeof users);
  
  const scheduledGroupPage = getPageObject(pageName, page);
  await scheduledGroupPage.open();
  
  scenarioContext.page = page;
  scenarioContext.scheduledGroupPage = scheduledGroupPage;
  scenarioContext.currentUserAlias = userAlias;
  
  console.log(`User '${userAlias}' ${stepType === 'given' ? 'is on' : 'navigated to'} ${pageName} page`);
}

Given(
  'user {string} is on the {string} page',
  async ({ loginAs, contextManager }, userAlias: string, pageName: string) => {
    await setupPageContext(loginAs, userAlias, pageName, 'given');
  },
);

When(
  'user {string} navigates to the {string} page',
  async ({ loginAs }, userAlias: string, pageName: string) => {
    await setupPageContext(loginAs, userAlias, pageName, 'when');
  },
);
