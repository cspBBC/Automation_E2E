import { test, expect } from '../fixtures/test.fixtures';
import { listTables } from '../../core/db/queries';

test('Tables exist', async ({ db }) => {
  const tables = await listTables(db);
  expect(tables.length).toBeGreaterThan(0);
});
