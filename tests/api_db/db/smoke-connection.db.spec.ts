import { test, expect } from '@fixtures/test.fixture';
import { listAllTables, listTables, listTableCountsByPattern, listTableByName, listTableByKey } from '@db/queries';


// test('Tables exist', async ({ db }) => {
//   const tables = await listTableByKey(db,"UserDetails","UD_UserID","10752");
//     console.log('Tables with pattern "User%":', tables);
//   // expect(tables.length).toBeGreaterThan(0);
// });

//test for getting recoed from scheduling group table by procideing created by id which is foreign key in scheduling group table
// test('Get record details by providing created by id', async ({ db }) => {
//   const tables = await listTableByKey(db,"SchedulingGroups","CreatedBy","10752");
//     console.log('Tables with pattern "User%":', tables);
//   // expect(tables.length).toBeGreaterThan(0);
// });




// test('Get record details by table name and key column', async ({ db }) => {
//   const tableName = 'SchedulingGroups';
//   const keyColumn = 'CreatedBy';
//   const keyValue = '10752'; // example value, adjust as needed  
//   const result = await db.request()
//     .input('keyValue', keyValue)
//     .query(`  
//       SELECT *
//       FROM [${tableName}]
//       WHERE [${keyColumn}] = @keyValue
//     `);   
//   console.log(`Record details from ${tableName} where ${keyColumn} = ${keyValue}:`, result.recordset);
//   expect(result.recordset.length).toBeGreaterThan(0);
// });



// test('Get counts for scheduling group related tables', async ({ db }) => {
//   const schedulingGroupTables = await listTableCountsByPattern(db, 'User%');
//   // const schedulingTeamTables = await listTableCountsByPattern(db, 'UserDetails%');
  
//   const allRelatedTables = [...schedulingGroupTables];
  
//   console.log('Scheduling Group Related Tables:', allRelatedTables);

  
//   // // Verify we found the expected tables
//   const tableNames = allRelatedTables.map(t => t.tableName);
//   expect(tableNames.some(name => name.includes('User'))).toBeTruthy();
// });




