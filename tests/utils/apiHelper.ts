// [GENERIC API HELPER] Reusable across all API endpoints and modules

import * as fs from 'fs';
import * as path from 'path';

// ---------- TYPES ----------
export interface ApiRequestContext {
  authenticatedPage: any;
  method: string;
  url: string;
  params: Record<string, string>;
  response: any;
  status: number;
  body: string;
}

// ---------- SHARED CONTEXT ----------
const sharedRequestContext: ApiRequestContext = {
  authenticatedPage: null,
  method: '',
  url: '',
  params: {},
  response: null,
  status: 0,
  body: ''
};

export function getSharedContext(): ApiRequestContext {
  return sharedRequestContext;
}

// ---------- TEST PARAMETERS ----------
/**
 * Load test parameters from a JSON file
 * Supports any module structure (workflows/{module}/data/{filename})
 */
export function loadTestParameters(filePath: string, scenario: string): Record<string, string> {
  const fullPath = path.join(process.cwd(), 'workflows', filePath);
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  return data[scenario] || {};
}

// ---------- QUERY STRING ----------
export function buildQueryString(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, value]) => {
      // For empty values, return just the key without '='
      if (value === '' || value === null || value === undefined) {
        return key;
      }
      return `${key}=${encodeURIComponent(value)}`;
    })
    .join('&');
}

// ---------- URL BUILDER ----------
export function buildEndpointUrl(
  baseUrl: string,
  endpoint: string,
  params: Record<string, string>
): string {
  const queryString = buildQueryString(params);
  return `${baseUrl}${endpoint}?${queryString}`;
}

// ---------- RESPONSE CAPTURE ----------
export async function captureResponse(response: any): Promise<{ status: number; body: string }> {
  const status = response.status();
  let body = '';

  try {
    const contentType = response.headers()['content-type'] || '';
    body = contentType.includes('application/json')
      ? JSON.stringify(await response.json(), null, 2)
      : await response.text();
  } catch (e) {
    body = '[Unable to parse response body]';
  }

  return { status, body };
}

// ---------- LOGGING ----------
export function logApiCall(method: string, url: string, note?: string): void {
  console.log(`\n[REQUEST] [${method}] Endpoint Call${note ? ` (${note})` : ''}`);
  console.log(`URL: ${url}\n`);
}

export function logResponse(method: string, status: number, bodySize: number, body: string): void {
  console.log(`[RESPONSE] [${method}] Response Status: ${status}`);
  console.log(`[RESPONSE] Response Size: ${bodySize} bytes`);
  console.log(`[RESPONSE] Response Body (full):\n${body}`);
}

// ---------- MAIN API CALLS ----------
export async function makeApiRequest(
  requestContext: ApiRequestContext,
  method: string,
  baseUrl: string,
  endpoint: string,
  params: Record<string, string>,
  note?: string
): Promise<void> {
  const url = buildEndpointUrl(baseUrl, endpoint, params);
  logApiCall(method, url, note);

  requestContext.method = method;
  requestContext.url = url;
  requestContext.params = params;

  const response = await requestContext.authenticatedPage.goto(url); // unchanged (GET-based)
  const { status, body } = await captureResponse(response);

  requestContext.response = response;
  requestContext.status = status;
  requestContext.body = body;

  logResponse(method, status, body.length, body);
}

/**
 * Generic API request wrapper
 * Allows any module to make API requests with its own baseUrl and configuration
 */
export async function makeModuleApiRequest(
  requestContext: ApiRequestContext,
  method: string,
  baseUrl: string,
  endpoint: string,
  params: Record<string, string>,
  note?: string
): Promise<void> {
  await makeApiRequest(
    requestContext,
    method,
    baseUrl,
    endpoint,
    params,
    note
  );
}