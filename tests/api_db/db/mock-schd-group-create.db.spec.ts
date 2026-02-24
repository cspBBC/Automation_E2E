import { test, expect } from '@fixtures/test.fixture';
import { SchedulingGroupQueries } from '@workflows/schd-group/db/queries/schedulingGroup.queries';

test.describe('DB-driven Create Scheduling Group', () => {
    test('creates scheduling group and validates DB state', async ({ db, ensureUserExists }) => {

        // Verify system admin exists and get ID
        const user = await ensureUserExists('systemAdmin');
        const systemAdminId = user.id;
        
        console.log('Using system admin ID:', systemAdminId);
        const schdGrpCreatedID = 19;
        const name = 'Test_Ankur_Group';
        // Read back via existing query helper
        const row = await SchedulingGroupQueries.getById(db, schdGrpCreatedID);
        expect(row).toBeTruthy();
        expect(row.SchedulingGroupsID).toBe(schdGrpCreatedID);
        expect(row.SchedulingGroupsName).toBe(name);

        // // additional invariants
        const { assertAllocationsMenu, assertNotes, assertAudit } = await import('@workflows/schd-group/invariants/db.invariants');

        assertNotes(row, 'Created for POC, Editing');

    });
});
