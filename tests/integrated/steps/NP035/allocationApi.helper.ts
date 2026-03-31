import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = process.env.API_BASE_URL || 'https://allocate-systest-dbr.national.core.bbc.co.uk';

// [SCALABLE] Centralized API configuration
export const API_CONFIG = {
  endpoints: {
    markAction: '/page-includes/allocations/weekly/actions/mark-action.php'
  },
  actions: {
    EDIT: 'edit',
    VIEW: 'view'
  }
};

// [SCALABLE] Load test parameters from workflows folder
export function loadTestParameters(filePath: string, scenario: string): Record<string, string> {
  const fullPath = path.join(process.cwd(), 'workflows', filePath);
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  return data[scenario] || {};
}

// [SCALABLE] Per-test request context - isolated per test execution
export interface ApiRequestContext {
  authenticatedPage: any;
  method: string;
  url: string;
  params: Record<string, string>;
  response: any;
  status: number;
  body: string;
}

// [SCALABLE] Singleton: Shared request context across all step files
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

// [SCALABLE] Utility: Build query string
export function buildQueryString(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
}

// [SCALABLE] Utility: Build endpoint URL
export function buildEndpointUrl(endpoint: string, params: Record<string, string>): string {
  const queryString = buildQueryString(params);
  return `${BASE_URL}${endpoint}?${queryString}`;
}

// [SCALABLE] Utility: Capture response body
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

// [SCALABLE] Utility: Log API call details
export function logApiCall(method: string, url: string, note?: string): void {
  console.log(`\n[REQUEST] [${method}] Endpoint Call${note ? ` (${note})` : ''}`);
  console.log(`URL: ${url}\n`);
}

// [SCALABLE] Utility: Log response details
export function logResponse(method: string, status: number, bodySize: number, body: string): void {
  console.log(`[RESPONSE] [${method}] Response Status: ${status}`);
  console.log(`[RESPONSE] Response Size: ${bodySize} bytes`);
  console.log(`[RESPONSE] Response Body (full):\n${body}`);
}

// [SCALABLE] Utility: Make API request (reusable across all endpoint tests)
export async function makeApiRequest(
  requestContext: ApiRequestContext,
  method: string,
  endpoint: string,
  params: Record<string, string>,
  note?: string
): Promise<void> {
  const url = buildEndpointUrl(endpoint, params);
  logApiCall(method, url, note);
  
  requestContext.method = method;
  requestContext.url = url;
  requestContext.params = params;
  
  const response = await requestContext.authenticatedPage.goto(url, { method });
  const { status, body } = await captureResponse(response);
  
  requestContext.response = response;
  requestContext.status = status;
  requestContext.body = body;
  
  logResponse(method, status, body.length, body);
}
