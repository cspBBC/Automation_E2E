import sql from 'mssql';
import { getDbPool } from '../../core/db/connection';
import { applySeed, cleanupSeed, startTransaction, rollbackTransaction } from '../../workflows/schd-group/db/seed/db.seed';

export async function withTransactionPool(fn: (pool: sql.ConnectionPool) => Promise<void>) {
  const pool = await getDbPool();
  try {
    await applySeed(pool);
    await startTransaction(pool);
    await fn(pool);
    await rollbackTransaction(pool);
  } finally {
    await cleanupSeed(pool);
    await pool.close();
  }
}

export async function seedSuite(pool?: sql.ConnectionPool) {
  const p = pool || (await getDbPool());
  await applySeed(p);
  if (!pool) await p.close();
}
