import { test, expect } from '../../tests/fixtures/test.fixture';
import { listTables } from '../../core/db/queries';

test('Tables exist', async ({ db }) => {
  const tables = await listTables(db);
  expect(tables.length).toBeGreaterThan(0);
});
