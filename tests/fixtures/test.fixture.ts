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

  // Authentication method - update based on PHP implementation
  authenticateAs: async ({ apiClient }, use) => {
    await use(async (userId: number) => {
      // Option 1: Bearer Token (JWT or similar)
      // const token = await getTokenForUser(userId);
      // apiClient.setAuthHeaders({ 'Authorization': `Bearer ${token}` });

      // Option 2: Basic Auth (username/password)
      // const credentials = btoa(`${username}:${password}`);
      // apiClient.setAuthHeaders({ 'Authorization': `Basic ${credentials}` });

      // Option 3: Login via endpoint
      // const loginResponse = await apiClient.post('/auth/login', { userId, password });
      // const token = loginResponse.token;
      // apiClient.setAuthHeaders({ 'Authorization': `Bearer ${token}` });

      // Fallback: X-User-Id header (update when PHP authentication is confirmed)
      apiClient.setAuthHeaders({ 'X-User-Id': userId.toString() });
      console.log(`🔐 Authenticated as user ${userId}`);
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
});

export { expect };
export { ApiClient };
