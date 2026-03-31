import * as fs from 'fs';
import * as path from 'path';

import type { ApiRequestContext } from '@helpers/apiHelper';
import {
  getSharedContext,
  makeApiRequest as genericMakeApiRequest
} from '@helpers/apiHelper';

const BASE_URL = process.env.API_BASE_URL || 'https://allocate-systest-dbr.national.core.bbc.co.uk';

// [ALLOCATION-SPECIFIC] API configuration for mark-action endpoint
export const API_CONFIG = {
  endpoints: {
    markAction: '/page-includes/allocations/weekly/actions/mark-action.php'
  },
  actions: {
    EDIT: 'edit',
    VIEW: 'view'
  }
};

// [REUSABLE] Load test parameters from workflows folder
export function loadTestParameters(filePath: string, scenario: string): Record<string, string> {
  const fullPath = path.join(process.cwd(), 'workflows', filePath);
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  return data[scenario] || {};
}

// [RE-EXPORTED] Shared request context from generic helper
export type { ApiRequestContext };
export { getSharedContext };

// [ALLOCATION-SPECIFIC] Wrapper for makeApiRequest with allocation base URL
export async function makeApiRequest(
  requestContext: ApiRequestContext,
  method: string,
  endpoint: string,
  params: Record<string, string>,
  note?: string
): Promise<void> {
  await genericMakeApiRequest(
    requestContext,
    method,
    BASE_URL,
    endpoint,
    params,
    note
  );
}