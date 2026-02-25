// // import { test, expect } from '@fixtures/test.fixture';
// // import { listAllTables, listTables, listTableCountsByPattern, listTableByName, listTableByKey } from '@db/queries';

// // // Test: Get scheduling groups created by areaAdmin_News user
// // test.skip('Get scheduling groups created by areaAdmin_News', async ({ db }) => {
// //   const areaAdminUserId = 10769; // areaAdmin_News user ID
// //   const roleId = 2;
// //   const divisionName = 'News';
  
// //   const result = await db.request()
// //     .input('userId', areaAdminUserId)
// //     .input('roleId', roleId)
// //     .input('divisionName', divisionName)
// //     .query(`
// //       SELECT 
// //         g.SchedulingGroupsID, 
// //         g.SchedulingGroupsName, 
// //         r.UR_UserID, 
// //         r.UR_SchedulingTeamID, 
// //         r.UR_DivisionId, 
// //         r.UR_RoleID,
// //         u.UD_DisplayName, 
// //         d.DivisionName, 
// //         u.UD_NetLogin, 
// //         d.DivisionID
// //       FROM UserRoles r 
// //       INNER JOIN SchedulingGroups g ON r.UR_UserID = g.CreatedBy 
// //       INNER JOIN Divisions d ON d.DivisionID = g.DivisionID
// //       INNER JOIN UserDetails u ON r.UR_UserID = u.UD_UserID
// //       WHERE r.UR_UserID = @userId 
// //         AND r.UR_RoleID = @roleId 
// //         AND d.DivisionName = @divisionName
// //         AND r.UR_EndDate >= CAST(GETDATE() AS DATE)
// //     `);
  
// //   console.log('Scheduling Groups created by areaAdmin_News (pandec01):', result.recordset);
// //   expect(result.recordset.length).toBeGreaterThan(0);
// //   expect(result.recordset[0]).toHaveProperty('SchedulingGroupsID');
// //   expect(result.recordset[0]).toHaveProperty('UD_NetLogin', 'pandec01');
// // });




// // // test('Tables exist', async ({ db }) => {
// // //   const tables = await listTableByKey(db,"UserDetails","UD_UserID","10752");
// // //     console.log('Tables with pattern "User%":', tables);
// // //   // expect(tables.length).toBeGreaterThan(0);
// // // });



// // //test for getting recoed from scheduling group table by procideing created by id which is foreign key in scheduling group table
// // // test('Get record details by providing created by id', async ({ db }) => {
// // //   const tables = await listTableByKey(db,"SchedulingGroups","CreatedBy","10752");
// // //     console.log('Tables with pattern "User%":', tables);
// // //   // expect(tables.length).toBeGreaterThan(0);
// // // });




// // // test('Get record details by table name and key column', async ({ db }) => {
// // //   const tableName = 'SchedulingGroups';
// // //   const keyColumn = 'CreatedBy';
// // //   const keyValue = '10752'; // example value, adjust as needed  
// // //   const result = await db.request()
// // //     .input('keyValue', keyValue)
// // //     .query(`  
// // //       SELECT *
// // //       FROM [${tableName}]
// // //       WHERE [${keyColumn}] = @keyValue
// // //     `);   
// // //   console.log(`Record details from ${tableName} where ${keyColumn} = ${keyValue}:`, result.recordset);
// // //   expect(result.recordset.length).toBeGreaterThan(0);
// // // });



// // // test('Get counts for scheduling group related tables', async ({ db }) => {
// // //   const schedulingGroupTables = await listTableCountsByPattern(db, 'User%');
// // //   // const schedulingTeamTables = await listTableCountsByPattern(db, 'UserDetails%');
  
// // //   const allRelatedTables = [...schedulingGroupTables];
  
// // //   console.log('Scheduling Group Related Tables:', allRelatedTables);

  
// // //   // // Verify we found the expected tables
// // //   const tableNames = allRelatedTables.map(t => t.tableName);
// // //   expect(tableNames.some(name => name.includes('User'))).toBeTruthy();
// // // });


// //just add a test to retreive schd grp by system admin and areaadmin and conslole it
// //  whaterber id craeetd by "id": 10752, "id": 10769 in db 
// //no valdation just want see all data avaiable in db for those id

// //==================================================================================================
// import { test } from '@fixtures/test.fixture';

// test('Get scheduling groups created by system admin and area admin', async ({ db }) => {
//   const systemAdminUserId = 10752; // Example System Admin user ID
//   const areaAdminUserId = 10769; // Example Area Admin user ID  
    
//     const result = await db.request()

//     .input('systemAdminUserId', systemAdminUserId)
//     .input('areaAdminUserId', areaAdminUserId)
//     .query(`        
//         SELECT  
//             g.SchedulingGroupsID,
//             g.SchedulingGroupsName,
//             g.CreatedBy,
//             u.UD_DisplayName,

//             u.UD_NetLogin
//         FROM SchedulingGroups g
//         INNER JOIN UserDetails u ON g.CreatedBy = u.UD_UserID
//         WHERE g.CreatedBy IN (@systemAdminUserId, @areaAdminUserId)
//     `); 

//     console.log('Scheduling Groups created by System Admin and Area Admin:', result.recordset);

// });
// //==================================================================================================
// //get userdetails m prciding netgoin
// // import { test } from '@fixtures/test.fixture';

// test('Get user details by net login', async ({ db }) => {
//   const netLogin = 'Aijazw01'; // Example net login
  
//   const result = await db.request()
//     .input('netLogin', netLogin)
//     .query(`  
//       SELECT *  
//         FROM UserDetails    
//         WHERE UD_NetLogin = @netLogin
//     `);

//   console.log(`User details for net login '${netLogin}':`, result.recordset);
// });






