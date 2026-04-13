import type { APIRequestContext, APIResponse } from "@playwright/test";

/**
 * Request configuration options
 */
export interface RequestOptions {
  headers?: Record<string, string>;
  data?: any;
}

/**
 * Enhanced API Client with support for custom headers, authentication, and options
 */
export class ApiClient {
  private authHeaders: Record<string, string> = {};

  constructor(private request: APIRequestContext) {}

  /**
   * Set authentication headers for all subsequent requests
   */
  setAuthHeaders(headers: Record<string, string>): void {
    this.authHeaders = headers;
  }

  /**
   * Merge auth headers with request-specific headers
   */
  private mergeHeaders(options?: RequestOptions): Record<string, string> | undefined {
    if (!this.authHeaders && !options?.headers) {
      return undefined;
    }
    return { ...this.authHeaders, ...options?.headers };
  }

  /**
   * GET request
   */
  async get(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.get(url, {
      headers: this.mergeHeaders(options),
    });
  }

  /**
   * POST request
   */
  async post<T>(url: string, payload?: T, options?: RequestOptions): Promise<APIResponse> {
    return this.request.post(url, {
      data: payload || options?.data,
      headers: this.mergeHeaders(options),
    });
  }

  /**
   * PUT request
   */
  async put<T>(url: string, payload?: T, options?: RequestOptions): Promise<APIResponse> {
    return this.request.put(url, {
      data: payload || options?.data,
      headers: this.mergeHeaders(options),
    });
  }

  /**
   * DELETE request
   */
  async delete(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.delete(url, {
      headers: this.mergeHeaders(options),
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, payload?: T, options?: RequestOptions): Promise<APIResponse> {
    return this.request.patch(url, {
      data: payload || options?.data,
      headers: this.mergeHeaders(options),
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
