import { test as bddTest} from 'playwright-bdd';
import { expect } from '@playwright/test';
import {
  request,
  APIRequestContext,
  APIResponse,
} from '@playwright/test';
import sql from 'mssql';
import { getDbPool } from '@core/db/connection'
import { ApiClient, RequestOptions } from '@core/api/apiClient';
import { readJSON } from '@helpers/readJson';
import { verifyUser } from '@core/db/dbseed';
import path from 'path';

// Wrapper to maintain authentication headers across requests
class AuthenticatedApiClient {
  private authHeaders: Record<string, string> = {};

  constructor(private client: ApiClient) {}

  setAuthHeaders(headers: Record<string, string>) {
    this.authHeaders = headers;
  }

  get(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.client.get(url, {
      ...options,
      headers: { ...this.authHeaders, ...options?.headers },
    });
  }

  post<T>(url: string, payload?: T, options?: RequestOptions): Promise<APIResponse> {
    return this.client.post(url, payload, {
      ...options,
      headers: { ...this.authHeaders, ...options?.headers },
    });
  }

  put<T>(url: string, payload?: T, options?: RequestOptions): Promise<APIResponse> {
    return this.client.put(url, payload, {
      ...options,
      headers: { ...this.authHeaders, ...options?.headers },
    });
  }

  delete(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.client.delete(url, {
      ...options,
      headers: { ...this.authHeaders, ...options?.headers },
    });
  }

  patch<T>(url: string, payload?: T, options?: RequestOptions): Promise<APIResponse> {
    return this.client.patch(url, payload, {
      ...options,
      headers: { ...this.authHeaders, ...options?.headers },
    });
  }
}

type TestFixtures = {
  request: APIRequestContext;
  apiClient: AuthenticatedApiClient;
  db: sql.ConnectionPool;
  authenticateAs: (userId: number) => Promise<void>;
  ensureUserExists: (userAlias: string) => Promise<{ id: number; username: string }>;
};

export const test = bddTest.extend<TestFixtures>({
  // Base API client - use with X-User-Id header for authentication
  apiClient: async ({}, use) => {
    const ctx = await request.newContext({
      baseURL: process.env.API_BASE_URL,
    });

    const baseClient = new ApiClient(ctx);
    const authenticatedClient = new AuthenticatedApiClient(baseClient);
    await use(authenticatedClient);
    await ctx.dispose();
  },

  // Authentication method - Basic Auth using credentials from .env
  authenticateAs: async ({ apiClient }, use) => {
    await use(async (userId: number) => {
      // Load users data
      const usersData = await readJSON(path.resolve(process.cwd(), 'core/data/users.json'));
      
      // Find user by ID
      let user = Object.values(usersData).find((u: any) => u.id === userId);
      
      if (!user) {
        throw new Error(`User with ID ${userId} not found in core/data/users.json`);
      }

      // Get password from .env using envKey (e.g., SYS_ADMIN_PASSWORD)
      const passwordEnvKey = `${user.envKey}_PASSWORD`;
      const password = process.env[passwordEnvKey];
      
      if (!password) {
        throw new Error(`Password not found in .env. Expected env variable: ${passwordEnvKey}`);
      }

      // Basic Auth: encode username:password in Base64
      const credentials = btoa(`${user.username}:${password}`);
      apiClient.setAuthHeaders({ 'Authorization': `Basic ${credentials}` });
      console.log(`🔐 Authenticated as user ${userId} (${user.username})`);
    });
  },

  db: async ({}, use) => {
    const pool = await getDbPool();
    try {
      await use(pool);
    } finally {
      // Rollback any open transactions to clean up after test
      try {
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
});

export { expect };
export { ApiClient };
