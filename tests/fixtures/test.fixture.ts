import {
  test as base,
  expect,
  request,
  APIRequestContext,
} from '@playwright/test';
import sql from 'mssql';
import { getDbPool } from '@core/db/connection'
import { ApiClient } from '@core/api/apiClient';

type TestFixtures = {
  request: APIRequestContext;
  apiClient: ApiClient;
  db: sql.ConnectionPool;
};

export const test = base.extend<TestFixtures>({
  // Base API client - use with X-User-Id header for authentication
  apiClient: async ({}, use) => {
    const ctx = await request.newContext({
      baseURL: process.env.API_BASE_URL,
    });

    const client = new ApiClient(ctx);
    await use(client);
    await ctx.dispose();
  },

  db: async ({}, use) => {
    const pool = await getDbPool();
    await use(pool);
    await pool.close();
  },
});

export { expect };
export { ApiClient };
