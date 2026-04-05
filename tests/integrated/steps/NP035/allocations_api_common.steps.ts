import { createBdd } from 'playwright-bdd';
import { createAPIFixture } from '@fixtures/api.fixture';
import { AllocationContext } from '@workflows/integrated/allocations/context/context';

// Create the same extended test as in edit steps so they can share fixtures
const test = createAPIFixture<AllocationContext>(() => ({
  allocationsDutyId: null,
  dutyName: null,
  dutyId: null,
  schedulingPersonId: null,
  schedulingTeamId: null,
  dutyDate: null,
  allocationsDate: null,
  allocationsSchPer: null,
}));

// Export test so bddgen can find it
export { test };

const { Given } = createBdd(test);

Given('user {string} is authenticated', async ({ authenticateWithNtlm, requestContext }, userName: string) => {
  console.log(`\n[AUTH] Authenticating as: ${userName}`);
  requestContext.authenticatedPage = await authenticateWithNtlm(userName);
  console.log(`[OK] NTLM session ready for API requests\n`);
});
