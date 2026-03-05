import { APIRequestContext } from '@playwright/test';
import { apiGet } from '../../../core/api/apiClient';

/**
 * View/List API Endpoints for Scheduling Groups
 */
const viewEndpoints = {
  list: '/api/scheduling-groups',
  getById: (id: number | string) => `/api/scheduling-groups/${id}`,
  listByArea: (areaId: number) => `/api/scheduling-groups?area=${areaId}`,
  getHistory: (id: number | string) => `/api/scheduling-groups/${id}/history`,
} as const;

/**
 * View/List API Operations for Scheduling Groups
 * 
 * Pattern: Each operation separated by concern
 * Usage in steps: import { viewAPI } from '@workflows/schd-group/api/view.api'
 */
export const viewAPI = {
  /**
   * List all Scheduling Groups (optionally filtered by area)
   * @param api - Playwright APIRequestContext
   * @param areaId - Optional area filter
   */
  list: (api: APIRequestContext, areaId?: number) => {
    const endpoint = areaId 
      ? viewEndpoints.listByArea(areaId)
      : viewEndpoints.list;
    return apiGet(api, endpoint);
  },

  /**
   * Get single Scheduling Group by ID
   * @param api - Playwright APIRequestContext
   * @param id - Group ID
   */
  getById: (api: APIRequestContext, id: number) => {
    return apiGet(api, viewEndpoints.getById(id));
  },

  /**
   * Get Scheduling Group history/audit trail
   * @param api - Playwright APIRequestContext
   * @param id - Group ID
   */
  getHistory: (api: APIRequestContext, id: number) => {
    return apiGet(api, viewEndpoints.getHistory(id));
  },
} as const;

// Legacy exports for backward compatibility
export function listSchedulingGroups(api: APIRequestContext) {
  return viewAPI.list(api);
}

export function getSchedulingGroupById(api: APIRequestContext, id: number) {
  return viewAPI.getById(api, id);
}
