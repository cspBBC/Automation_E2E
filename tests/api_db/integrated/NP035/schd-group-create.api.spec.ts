import { test, expect } from "@fixtures/test.fixture";
import { withTransactionPool } from "@fixtures/db.fixture";
import { getSeedTestData } from "@workflows/schd-group/db/seed/db.seed";
import { SchedulingGroupQueries } from "@workflows/schd-group/db/queries/schedulingGroup.queries";
import { schedulingGroupEndpoints } from "@workflows/schd-group/api/endpoints";
import { schedulingGroupPayloads, requestHeaders } from "@workflows/schd-group/data/payloads";

/**
 * NP035.02 - Create Scheduling Group Tests
 * Positive test scenarios for Scheduling Group creation
 */

test.describe('NP035.02 - Create Scheduling Group', () => {

  // ============================================
  // POSITIVE TEST SCENARIOS
  // ============================================

  test('System Admin creates a new Scheduling Group in any area', async ({ request }) => {
    await withTransactionPool(async (db) => {
      const seedData = await getSeedTestData(db);
      const payload = schedulingGroupPayloads.create.systemAdminFull();

      const response = await request.post(schedulingGroupEndpoints.create, {
        data: payload,
        headers: requestHeaders.withUserId(seedData.systemAdmin.user_id)
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.id).toBeDefined();

      // Verify in database
      const record = await SchedulingGroupQueries.getById(db, body.id);
      expect(record).toBeTruthy();
      expect(record.scheduling_group_name).toBe(payload.name);
      expect(record.area).toBe(10);
      expect(record.allocations_menu).toBe(1);
      expect(record.notes).toBe(payload.notes);
      expect(record.last_amended_by).toBe(seedData.systemAdmin.user_id);
    });
  });

  test('Area Admin creates a Scheduling Group in their assigned area', async ({ request }) => {
    await withTransactionPool(async (db) => {
      const seedData = await getSeedTestData(db);
      const payload = schedulingGroupPayloads.create.areaAdminArea10();

      const response = await request.post(schedulingGroupEndpoints.create, {
        data: payload,
        headers: requestHeaders.withUserId(seedData.areaAdmin_Area10.user_id)
      });

      expect(response.status()).toBe(201);
      const body = await response.json();

      const record = await SchedulingGroupQueries.getById(db, body.id);
      expect(record.scheduling_group_name).toBe(payload.name);
      expect(record.area).toBe(10);
      expect(record.allocations_menu).toBe(0);
      expect(record.last_amended_by).toBe(seedData.areaAdmin_Area10.user_id);
    });
  });
});
