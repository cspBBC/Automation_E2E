import { createBdd } from 'playwright-bdd';
import { test } from '@fixtures/fixture';
import { getSharedContext } from '@helpers/apiHelper';

const { Given } = createBdd(test);

Given('user {string} is authenticated', async ({ authenticateWithNtlm }, userName: string) => {
  const requestContext = getSharedContext();
  console.log(`\n[AUTH] Authenticating as: ${userName}`);
  requestContext.authenticatedPage = await authenticateWithNtlm(userName);
  console.log(`[OK] NTLM session ready for API requests\n`);
});
