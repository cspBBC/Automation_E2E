import sql from 'mssql';
import { test as base } from 'playwright-bdd';
import { getDbPool } from '../../core/db/connection';

/**
 * Database fixture utilities
 */
type DbFixtures = {
  db: sql.ConnectionPool;
  withTransaction: <T>(fn: (pool: sql.ConnectionPool) => Promise<T>) => Promise<T>;
  seedDb: (pool?: sql.ConnectionPool) => Promise<sql.ConnectionPool>;
};

export const test = base.extend<DbFixtures>({
  /**
   * Provides a database connection pool
   * Automatically closes connection after test
   */
  db: async ({}, use) => {
    const pool = await getDbPool();
    try {
      await use(pool);
    } finally {
      await pool.close();
    }
  },

  /**
   * Execute function within a transaction that is rolled back after execution
   * Useful for tests that need to verify database state without persisting changes
   */
  withTransaction: async ({}, use) => {
    await use(async <T>(fn: (pool: sql.ConnectionPool) => Promise<T>): Promise<T> => {
      const pool = await getDbPool();
      try {
        // Start transaction for test isolation
        await pool.request().query('BEGIN TRANSACTION');
        const result = await fn(pool);
        // Auto-rollback at cleanup
        return result;
      } finally {
        // Rollback any open transactions to clean up after test
        try {
          await pool.request().query('IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION');
          console.log('Transaction rolled back');
        } catch (err) {
          // Transaction may not exist, that's okay
        }
        await pool.close();
      }
    });
  },

  /**
   * Get database pool for suite setup
   */
  seedDb: async ({}, use) => {
    await use(async (pool?: sql.ConnectionPool): Promise<sql.ConnectionPool> => {
      return pool || (await getDbPool());
    });
  },
});

export { expect } from '@playwright/test';

