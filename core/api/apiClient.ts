import type { APIRequestContext, APIResponse } from "@playwright/test";

/**
 * Request configuration options
 */
export interface RequestOptions {
  headers?: Record<string, string>;
  data?: any;
}

/**
 * Enhanced API Client with support for custom headers and options
 */
export class ApiClient {
  constructor(private request: APIRequestContext) {}

  /**
   * GET request
   */
  async get(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.get(url, {
      headers: options?.headers,
    });
  }

  /**
   * POST request
   */
  async post<T>(url: string, payload?: T, options?: RequestOptions): Promise<APIResponse> {
    return this.request.post(url, {
      data: payload || options?.data,
      headers: options?.headers,
    });
  }

  /**
   * PUT request
   */
  async put<T>(url: string, payload?: T, options?: RequestOptions): Promise<APIResponse> {
    return this.request.put(url, {
      data: payload || options?.data,
      headers: options?.headers,
    });
  }

  /**
   * DELETE request
   */
  async delete(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.delete(url, {
      headers: options?.headers,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, payload?: T, options?: RequestOptions): Promise<APIResponse> {
    return this.request.patch(url, {
      data: payload || options?.data,
      headers: options?.headers,
    });
  }
}

/**
 * Legacy API client functions (deprecated - use ApiClient class instead)
 * Kept for backward compatibility
 */

export const apiGet = (
  request: APIRequestContext,
  url: string,
): Promise<APIResponse> => {
  return request.get(url);
};

export const apiPost = <T>(
  request: APIRequestContext,
  url: string,
  payload?: T,
): Promise<APIResponse> => {
  return request.post(url, { data: payload });
};

export const apiPut = <T>(
  request: APIRequestContext,
  url: string,
  payload?: T,
): Promise<APIResponse> => {
  return request.put(url, { data: payload });
};

export const apiDelete = (
  request: APIRequestContext,
  url: string,
): Promise<APIResponse> => {
  return request.delete(url);
};
