import { test, expect } from "../fixtures/test.fixtures";
import { createSchedulingGroup } from "../../workflows/schd-group/api/schd-group.api";
import { SchedulingGroupQueries } from "../../workflows/schd-group/db/schd-group.queries";
import { assertGroupExists } from "../../workflows/schd-group/invariants/db.invariants";

test("System Admin can create Scheduling Group in any Area", async ({apiAsSystemAdmin,db}) => {
  const payload = {
    area: "Manchester",
    groupName: `Auto_${Date.now()}`,
  };


  //api
  const res = await createSchedulingGroup(apiAsSystemAdmin, payload);
  expect(res.status()).toBe(201);

  const record = await SchedulingGroupQueries.getByName(db, payload.groupName);

  //db
  assertGroupExists(record);
});

test("Scheduling Group Name is mandatory", async ({ apiAsSystemAdmin }) => {
  const res = await apiAsSystemAdmin.post("/scheduling-groups", {
    data: { area: "London" },
  });

  expect(res.status()).toBe(400);
});
