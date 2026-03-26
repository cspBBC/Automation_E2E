import type { ConnectionPool } from 'mssql';

export async function listTables(db: ConnectionPool) {
  const result = await db.request().query(`
    SELECT TABLE_SCHEMA, TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_TYPE = 'BASE TABLE'
  `);

  return result.recordset;
}

//list all tables in the database

export async function listAllTables(db: ConnectionPool) {
  const result = await db.request().query(`
    SELECT TABLE_SCHEMA, TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
  `);

  return result.recordset;
}


// list a table by name and console top 2 records
export async function listTableByName(db: ConnectionPool, tableName: string) {
  const result = await db.request().query(`
    SeLECT TOP 1 *
    FROM [${tableName}]
  `);

  console.log(`Top 1 record(s) from ${tableName}:`, result.recordset);
  return result.recordset;
}

//same as listTableByName but with a where clause for a key column and value
export async function listTableByKey(db: ConnectionPool, tableName: string, keyColumn: string, keyValue: string) {
  const result = await db.request()

    .input('keyValue', keyValue)
    .query(`
      SELECT *    
      FROM [${tableName}]
      WHERE [${keyColumn}] = @keyValue
    `);
    return result.recordset;
}
// List tables matching a pattern with record counts
export async function listTableCountsByPattern(db: ConnectionPool, pattern: string) {
  const result = await db.request().query(`
    SELECT 
      TABLE_NAME,
      (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES t2 WHERE t2.TABLE_NAME = t1.TABLE_NAME) as TableExists
    FROM INFORMATION_SCHEMA.TABLES t1
    WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME LIKE '${pattern}'
  `);

  // Get row counts for each table
  const tablesWithCounts = [];
  for (const tableRecord of result.recordset) {
    const countResult = await db.request().query(`SELECT COUNT(*) as RecordCount FROM [${tableRecord.TABLE_NAME}]`);
    tablesWithCounts.push({
      tableName: tableRecord.TABLE_NAME,
      recordCount: countResult.recordset[0]?.RecordCount || 0
    });
  }

  return tablesWithCounts;
}