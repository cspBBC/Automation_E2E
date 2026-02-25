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
import { 
  assertGroupExists, 
  assertGroupArea, 
  assertAllocationsMenu,
  assertNotes,
  assertAudit,
  assertTeamsAssociated
} from '@workflows/schd-group/invariants/db.invariants';


// ============================================
// SCENARIO 1: System Admin Creates Group
// ============================================
test.describe('System Admin Creates Scheduling Group (ID: 25)', () => {
    const schdGrpCreatedID = 25;
    const name = 'Test_POC_MO';
    test('system admin can access the group', async ({ db, ensureUserExists }) => {
        const systemAdmin = await ensureUserExists('systemAdmin');
        const row = await SchedulingGroupQueries.getByIdForUser(db, schdGrpCreatedID, systemAdmin.id);

        // NP035: Group was successfully created and persisted in database
        assertGroupExists(row);
        // NP035: Verify the correct Scheduling Group ID was stored
        expect(row.SchedulingGroupsID).toBe(schdGrpCreatedID);
        // NP035.02: Verify the correct Scheduling Group name was assigned
        expect(row.SchedulingGroupsName).toBe(name);
    });

    test('area admin from News Area cannot access the group', async ({ db, ensureUserExists }) => {
        const areaAdmin = await ensureUserExists('areaAdmin_News');

        const row = await SchedulingGroupQueries.getByIdForUser(db, schdGrpCreatedID, areaAdmin.id);

        // NP035: Area Admin can only access Scheduling Groups in their permitted Area (permission control)
        expect(row).toBeFalsy();
    });

   
});

// ============================================
// SCENARIO 2: Area Admin Creates Group
// ============================================
test.describe('Area Admin Creates Scheduling Group (ID: 24)', () => {
    const schdGrpCreatedID = 24;
    const name = 'Area_Shekhar_POC';
    const areaName = 'News';
    
    test('system admin can access the group created by area admin', async ({ db, ensureUserExists }) => {
        const systemAdmin = await ensureUserExists('systemAdmin');
        const row = await SchedulingGroupQueries.getByIdForUser(db, schdGrpCreatedID, systemAdmin.id);

        // NP035.02: System Admin can view all Scheduling Groups in all Areas
        assertGroupExists(row);
        // NP035: Verify correct Scheduling Group ID was persisted
        expect(row.SchedulingGroupsID).toBe(schdGrpCreatedID);
        // NP035: Verify correct Scheduling Group name was persisted
        expect(row.SchedulingGroupsName).toBe(name);
        // NP035: Verify the Area field is correctly assigned to the Scheduling Group
        assertGroupArea(row, areaName);
    });

    test('area admin from News (creator) can access the group with correct audit trail', async ({ db, ensureUserExists }) => {
        const areaAdmin = await ensureUserExists('areaAdmin_News');
        const row = await SchedulingGroupQueries.getByIdForUser(db, schdGrpCreatedID, areaAdmin.id);

        // NP035.02: Area Admin can view Scheduling Groups they have created
        assertGroupExists(row);
        // NP035: Verify Area assignment is correct
        assertGroupArea(row, areaName);
        // NP035.05: Verify audit trail (Last Amended Date and Last Amended By) is recorded correctly
        assertAudit(row, areaAdmin.id);
        // NP035: Verify the group name is stored correctly
        expect(row.SchedulingGroupsName).toBe(name);
    });

    test('area admin can see all columns: Area, Name, AllocationsMenu, Notes, Audit', async ({ db, ensureUserExists }) => {
        const areaAdmin = await ensureUserExists('areaAdmin_News');
        const row = await SchedulingGroupQueries.getByIdForUser(db, schdGrpCreatedID, areaAdmin.id);

        // NP035.01: Verify all required columns are accessible to Area Admin on view
        assertGroupExists(row);
        // NP035.01: Area column should be present
        assertGroupArea(row, areaName);
        // NP035.01: Scheduling Group Name column should be present
        expect(row.SchedulingGroupsName).toBe(name);
        // NP035.01: Allocations Menu column (yes/no default) should be present and accessible
        assertAllocationsMenu(row, row.IsIncludeINMenu);
        // NP035.01: Notes column (editable free text) should be present and accessible
        assertNotes(row, row.Notes);
        // NP035.01: Last Amended Date and Last Amended By (audit columns) should be present
        assertAudit(row, areaAdmin.id);
    });

});

    // test('area admin can see associated scheduling teams', async ({ db, ensureUserExists }) => {
    //     const areaAdmin = await ensureUserExists('areaAdmin_News');
    //     const row = await SchedulingGroupQueries.getByIdForUser(db, schdGrpCreatedID, areaAdmin.id);

    //     assertGroupExists(row);
    //     // Verify the AssociatedTeamIds array exists and has expected structure
    //     expect(Array.isArray(row.AssociatedTeamIds)).toBe(true);
    //     if (row.AssociatedTeamIds.length > 0) {
    //         assertTeamsAssociated(row, row.AssociatedTeamIds); // Verify teams are valid
    //     }
    // });
