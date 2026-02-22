import { test, expect } from '@fixtures/test.fixture';
import sql from 'mssql';
import { SchedulingGroupQueries } from '@workflows/schd-group/db/queries/schedulingGroup.queries';
import { applySeed, startTransaction, rollbackTransaction } from '@workflows/schd-group/db/seed/db.seed';
import { generateCorrelationId } from '@fixtures/correlation.fixture';
import fs from 'fs';
import path from 'path';

test.describe('DB-driven Create Scheduling Group', () => {
    test('creates scheduling group and validates DB state', async ({ db }) => {
        // seed and begin transaction
        await applySeed(db);
        await startTransaction(db);

        const correlationId = generateCorrelationId();
        
        const rawData = fs.readFileSync(path.resolve(__dirname, '../data/users.json'), 'utf-8');
        const data = JSON.parse(rawData);
        const systemAdminId = data.systemAdmin.id;

        const actingUser = systemAdminId;
        const createdId = 6001;
        const name = `AUTO_SG_DB_${Date.now()}`;
        const area = 10;

        // Simulate create by inserting directly into scheduling_groups
        await db.request()
            .input('id', sql.Int, createdId)
            .input('name', sql.VarChar, name)
            .input('area', sql.Int, area)
            .input('alloc', sql.Bit, 1)
            .input('notes', sql.VarChar, 'created by db-driven test')
            .input('lastBy', sql.Int, actingUser)
            .query(`
        INSERT INTO scheduling_groups (id, scheduling_group_name, area, allocations_menu, notes, last_amended_by, last_amended_date)
        VALUES (@id, @name, @area, @alloc, @notes, @lastBy, GETUTCDATE())
      `);

        // Read back via existing query helper
        const row = await SchedulingGroupQueries.getById(db, createdId);
        expect(row).toBeTruthy();
        expect(row.scheduling_group_name).toBe(name);

        // additional invariants
        const { assertAllocationsMenu, assertNotes, assertAudit } = await import('@workflows/schd-group/invariants/db.invariants');
        assertAllocationsMenu(row, true);
        assertNotes(row, 'created by db-driven test');
        assertAudit(row, actingUser);

        // history check (best effort)
        const history = await SchedulingGroupQueries.getHistory(db, createdId);
        if (history && history.length > 0) {
            const { assertHistoryCreated } = await import('@workflows/schd-group/invariants/db.invariants');
            assertHistoryCreated(history[0], { name });
        }

        // rollback
        await rollbackTransaction(db);
    });
});
