/**
 * ALLOCATION API - Internal Helper
 * Allocation-specific API request handler
 * Delegates generic operations to apiHelper
 */

import type { ApiRequestContext } from '@helpers/apiHelper';
import { makeModuleApiRequest } from '@helpers/apiHelper';
import { ALLOCATION_API_CONFIG } from './allocationApi.config';

// Re-export allocation-specific configuration
export { ALLOCATION_API_CONFIG as API_CONFIG };

// Allocation API request wrapper
export async function makeApiRequest(
  requestContext: ApiRequestContext,
  method: string,
  endpoint: string,
  params: Record<string, string>,
  note?: string
): Promise<void> {
  await makeModuleApiRequest(
    requestContext,
    method,
    ALLOCATION_API_CONFIG.baseUrl,
    endpoint,
    params,
    note
  );
}