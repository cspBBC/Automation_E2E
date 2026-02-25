/**
 * DB-DRIVEN TEST SUITE
 * 
 * TEST PURPOSE:
 * - Verify Scheduling Group creation and database persistence
 * - Validate all database fields have correct values
 * - Test permission model: who can see what based on user role
 * - Ensure business rules (invariants) are satisfied
 */

import { test, expect } from '@fixtures/test.fixture';
import { SchedulingGroupQueries } from '@workflows/schd-group/db/queries/schedulingGroup.queries';


// ============================================
// SCENARIO 1: System Admin Creates Group
// ============================================
test.describe('System Admin Creates Scheduling Group (ID: 19)', () => {
    const schdGrpCreatedID = 19;
    const name = 'Test_Ankur_Group';
    test('system admin can access the group', async ({ db, ensureUserExists }) => {
        const systemAdmin = await ensureUserExists('systemAdmin');

        const row = await SchedulingGroupQueries.getByIdForUser(db, schdGrpCreatedID, systemAdmin.id);

        expect(row).toBeTruthy();
        expect(row.SchedulingGroupsID).toBe(schdGrpCreatedID);
        expect(row.SchedulingGroupsName).toBe(name);
    });

    test('area admin from News Area cannot access the group', async ({ db, ensureUserExists }) => {
        const areaAdmin = await ensureUserExists('areaAdmin_News');

        const row = await SchedulingGroupQueries.getByIdForUser(db, schdGrpCreatedID, areaAdmin.id);

        expect(row).toBeFalsy();
    });

   
});

// // ============================================
// // SCENARIO 2: Area Admin Creates Group
// // ============================================
test.describe('Area Admin Creates Scheduling Group (ID: 24)', () => {
    const schdGrpCreatedID = 24;
    const name = 'Area_Shekhar_POC';
    
    test('system admin can access the group craeted by area admin', async ({ db, ensureUserExists }) => {
        const systemAdmin = await ensureUserExists('systemAdmin');

        const row = await SchedulingGroupQueries.getByIdForUser(db, schdGrpCreatedID, systemAdmin.id);

        expect(row).toBeTruthy();
        expect(row.SchedulingGroupsID).toBe(schdGrpCreatedID);
        expect(row.SchedulingGroupsName).toBe(name);
    });

    test('area admin from News (creator) can access the group', async ({ db, ensureUserExists }) => {
        const areaAdmin = await ensureUserExists('areaAdmin_News');

        const row = await SchedulingGroupQueries.getByIdForUser(db, schdGrpCreatedID, areaAdmin.id);

        expect(row).toBeTruthy();
        expect(row.SchedulingGroupsID).toBe(schdGrpCreatedID);
        expect(row.SchedulingGroupsName).toBe(name);
        expect(row.CreatedBy).toBe(areaAdmin.id);
    });

    
});
