import sql from 'mssql';
import { getDbPool } from './connection';

export async function executeSP<T>(
  spName: string,
  params: Record<string, any>
): Promise<T> {
  const pool = await getDbPool();
  const request = pool.request();

  Object.entries(params).forEach(([key, value]) => {
    request.input(key, value);
  });

  const result = await request.execute(spName);
  return result.recordset as T;
}