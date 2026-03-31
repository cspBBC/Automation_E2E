import { createBdd } from 'playwright-bdd';
import { test } from '@fixtures/fixture';
import { ApiRequestContext } from './allocationApi.helper';

const { Given } = createBdd(test);

export function setupAuthenticationStep(requestContext: ApiRequestContext): void {
  Given('user {string} is authenticated', async ({ authenticateWithNtlm }, userName: string) => {
    console.log(`\n[AUTH] Authenticating as: ${userName}`);
    requestContext.authenticatedPage = await authenticateWithNtlm(userName);
    console.log(`[OK] NTLM session ready for API requests\n`);
  });
}
