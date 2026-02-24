import sql from 'mssql';
import { getDbPool } from '../../core/db/connection';

/**
 * Execute function within a transaction that is rolled back after execution
 * Useful for tests that need to verify database state without persisting changes
 * @param fn Function to execute with database pool
 */
export async function withTransactionPool(
  fn: (pool: sql.ConnectionPool) => Promise<void>
): Promise<void> {
  const pool = await getDbPool();
  try {
    // Start transaction for test isolation
    await pool.request().query('BEGIN TRANSACTION');
    await fn(pool);
    // Auto-rollback at cleanup
  } finally {
    // Rollback any open transactions to clean up after test
    try {
      await pool.request().query('IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION');
      console.log('🔙 Transaction rolled back');
    } catch (err) {
      // Transaction may not exist, that's okay
    }
    await pool.close();
  }
}

/**
 * Get database pool for suite setup
 * @param pool Optional existing pool to use
 */
export async function seedSuite(pool?: sql.ConnectionPool): Promise<sql.ConnectionPool> {
  const p = pool || (await getDbPool());
  return p;
}
