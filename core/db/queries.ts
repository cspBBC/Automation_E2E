import type { ConnectionPool } from 'mssql';

export async function listTables(db: ConnectionPool) {
  const result = await db.request().query(`
    SELECT TABLE_SCHEMA, TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_TYPE = 'BASE TABLE'
  `);

  return result.recordset;
}
