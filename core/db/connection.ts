/**
 * DATABASE CONNECTION: MSSQL Server Pool Manager
 * Establishes connection to test database. Provides methods for executing queries and managing transactions.
 */

import sql from 'mssql';

const config: sql.config = {
  server: process.env.DB_HOST!,
  database: process.env.DB_NAME!,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    trustServerCertificate: true,
  },
};

export async function getDbPool(): Promise<sql.ConnectionPool> {
  return sql.connect(config);
}
