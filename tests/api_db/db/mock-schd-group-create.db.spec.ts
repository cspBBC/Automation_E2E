/**
 * DB-DRIVEN TEST EXAMPLE
 * 
 * For detailed explanation of how this test works, see:
 * README.md → "Writing a Database Test - Step by Step"
 * 
 * TEST PURPOSE:
 * - Verify that a Scheduling Group can be read from database
 * - Validate all database fields have correct values
 * - Ensure business rules (invariants) are satisfied
 */

import { test, expect } from '@fixtures/test.fixture';
import { SchedulingGroupQueries } from '@workflows/schd-group/db/queries/schedulingGroup.queries';
import { assertNotes } from '@workflows/schd-group/invariants/db.invariants';

test.describe('DB-driven Create Scheduling Group', () => {
    test('validate created scheduling group in DB', async ({ db, ensureUserExists }) => {

        // Verify system admin exists and get ID
        const user = await ensureUserExists('systemAdmin');
        const systemAdminId = user.id;
        
        console.log('Using system admin ID:', systemAdminId);

        // TODO: Replace hardcoded ID with API call to create scheduling group
        const schdGrpCreatedID = 19;
        const name = 'Test_Ankur_Group';

        // Query database for the record
        const row = await SchedulingGroupQueries.getById(db, schdGrpCreatedID);

        // Assert record exists
        expect(row).toBeTruthy();
        expect(row.SchedulingGroupsID).toBe(schdGrpCreatedID);
        expect(row.SchedulingGroupsName).toBe(name);

        // Validate business logic
        assertNotes(row, 'Created for POC, Editing');
    });
});
