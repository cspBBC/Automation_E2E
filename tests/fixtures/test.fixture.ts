import {
  test as base,
  expect,
  request,
  APIRequestContext,
} from '@playwright/test';
import sql from 'mssql';
import { getDbPool } from '../../core/db/connection';

type TestFixtures = {
  apiAsSystemAdmin: APIRequestContext;
  apiAsAreaAdmin: APIRequestContext;
  db: sql.ConnectionPool;
};

export const test = base.extend<TestFixtures>({
  apiAsSystemAdmin: async ({}, use) => {
    const api = await request.newContext({
      baseURL: process.env.API_BASE_URL,
      storageState: 'storage/system-admin.json',
    });

    await use(api);
    await api.dispose();
  },

  apiAsAreaAdmin: async ({}, use) => {
    const api = await request.newContext({
      baseURL: process.env.API_BASE_URL,
      storageState: 'storage/area-admin.json',
    });

    await use(api);
    await api.dispose();
  },

  db: async ({}, use) => {
    const pool = await getDbPool();
    await use(pool);
    await pool.close();
  },
});

export { expect };
