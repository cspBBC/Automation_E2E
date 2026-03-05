
import { test, expect } from '@fixtures/test.fixture';
import { SchedulingGroupSP } from '@workflows/schd-group/db/sp/schedulingGroup.sp';
import { SchedulingGroupQueries } from '@workflows/schd-group/db/queries/schedulingGroup.queries';
test('create scheduling group via SP', async ({ db }) => {
  const inputParamsForSP = {
    AreaId: 12,
    GroupName: 'SP Test Group',
    AllocationsMenu: 1,
    Notes: 'created via sp',
    UserId: 10752
  };

  const result = await SchedulingGroupSP.create(inputParamsForSP);

  expect(result).toBeDefined();// Check if the result contains the expected properties

  const dbRow = await SchedulingGroupQueries.getByName(db, inputParamsForSP.GroupName);
  expect(dbRow).toBeTruthy();
});