import { test, expect } from '@fixtures/test.fixture';
import { listAllTables, listTables, listTableCountsByPattern, listTableByName } from '@db/queries';


test('Tables exist', async ({ db }) => {
  const tables = await listTableByName(db,'SummerLeave');
  console.log(tables);
  expect(tables.length).toBeGreaterThan(0);
});

// test('Get counts for scheduling group related tables', async ({ db }) => {
//   const schedulingGroupTables = await listTableCountsByPattern(db, 'scheduling_group%');
//   const schedulingTeamTables = await listTableCountsByPattern(db, 'scheduling_team%');
  
//   const allRelatedTables = [...schedulingGroupTables, ...schedulingTeamTables];
  
//   console.log('Scheduling Group Related Tables:', allRelatedTables);
  
//   expect(allRelatedTables.length).toBeGreaterThan(0);
  
//   // Verify we found the expected tables
//   const tableNames = allRelatedTables.map(t => t.tableName);
//   expect(tableNames.some(name => name.includes('scheduling_group'))).toBeTruthy();
// });




