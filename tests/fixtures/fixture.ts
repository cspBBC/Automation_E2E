import { test as bddTest} from 'playwright-bdd';
import { expect } from '@playwright/test';
import {
  request,
  APIRequestContext,
  APIResponse,
  Browser,
} from '@playwright/test';
import sql from 'mssql';
import { getDbPool } from '@core/db/connection'
import { ApiClient } from '@core/api/apiClient';
import { readJSON } from '@helpers/readJson';
import { verifyUser } from '@core/db/dbseed';
import path from 'path';

type TestFixtures = {
  request: APIRequestContext;
  apiClient: ApiClient;
  db: sql.ConnectionPool;
  authenticateAs: (userAlias: string) => Promise<void>;
  ensureUserExists: (userAlias: string) => Promise<{ id: number; username: string }>;
  authenticateWithNtlm: (userAlias: string) => Promise<any>;
};

export const test = bddTest.extend<TestFixtures>({
  // Base API client with auth header support
  apiClient: async ({}, use) => {
    const ctx = await request.newContext({
      baseURL: process.env.API_BASE_URL,
      ignoreHTTPSErrors: true,
    });

    const client = new ApiClient(ctx);
    await use(client);
    await ctx.dispose();
  },

  // Authentication method - uses Basic Auth for API requests
  authenticateAs: async ({ apiClient }, use) => {
    await use(async (userAlias: string) => {
      const usersData = await readJSON(path.resolve(process.cwd(), 'core/data/users.json'));
      const user = (usersData as any)[userAlias];

      if (!user) {
        throw new Error(`User '${userAlias}' not found in core/data/users.json`);
      }

      console.log(`Using Basic Auth for user: ${userAlias}`);
      const password = process.env[user.envKey];

      if (!password) {
        throw new Error(`Password not found in .env. Expected env variable: ${user.envKey}`);
      }

      const credentials = btoa(`${user.username}:${password}`);
      apiClient.setAuthHeaders({ 'Authorization': `Basic ${credentials}` });

      console.log(`Authenticated as user ${user.id} (${user.username})`);
    });
  },

  db: async ({}, use) => {
    const pool = await getDbPool();
    try {
      await use(pool);
    } finally {
      // Rollback any open transactions to clean up after test
      try {
        //only works if test inserted any data into the database, otherwise it will throw an error that there is no transaction to rollback
        await pool.request().query('IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION');
        console.log('🔙 Transaction cleaned up after test');
      } catch (err) {
        // Transaction may not exist, that's okay
      }
      await pool.close();
    }
  },

  // Verify specific user exists by alias from users.json
  ensureUserExists: async ({ db }, use) => {
    await use(async (userAlias: string) => {
      const usersData = await readJSON(path.resolve(process.cwd(), 'core/data/users.json'));
      const user = usersData[userAlias];
      
      if (!user) {
        throw new Error(`User '${userAlias}' not found in core/data/users.json`);
      }

      // Verify user exists in database using dbseed utility
      await verifyUser(db, user);
      return user;
    });
  },

  // NTLM authentication via browser context and page.goto()
  // Supports NTLM protocol negotiation at browser level
  authenticateWithNtlm: async ({ browser }, use) => {
    let authContext: any = null;
    let apiPage: any = null;

    await use(async (userAlias: string) => {
      const usersData = await readJSON(path.resolve(process.cwd(), 'core/data/users.json'));
      const user = (usersData as any)[userAlias];

      if (!user) {
        throw new Error(`User '${userAlias}' not found in users.json`);
      }

      const password = process.env[user.envKey];
      if (!password) {
        throw new Error(`Password not found in .env for key: ${user.envKey}`);
      }

      console.log(`🔐 Authenticating NTLM user: ${user.username}`);

      authContext = await browser.newContext({
        ignoreHTTPSErrors: true,
      });

      apiPage = await authContext.newPage();
      const baseUrl = new URL(process.env.API_BASE_URL || 'https://allocate-systest-wp.national.core.bbc.co.uk');
      const encodedPassword = encodeURIComponent(password);
      
      // Try UPN format first (sameer.patan.ext@bbc.co.uk), fallback to username
      const authUsername = user.upn || user.username;
      const loginUrl = `https://${authUsername}:${encodedPassword}@${baseUrl.hostname}/`;

      console.log(`📝 Using credentials: ${authUsername}:****`);

      // Use page.goto() with embedded credentials to trigger NTLM handshake
      const response = await apiPage.goto(loginUrl);

      if (response.status() !== 200) {
        throw new Error(`Failed to authenticate user '${userAlias}'. Status: ${response.status()}`);
      }

      console.log(`✅ NTLM session established for ${user.username}`);
      
      // Return the authenticated page for making requests
      return apiPage;
    });

    // Cleanup after test
    if (apiPage) {
      await apiPage.close();
    }
    if (authContext) {
      await authContext.close();
    }
  },
});

export { expect };
export { ApiClient };
