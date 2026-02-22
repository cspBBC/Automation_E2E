/**
 * Scheduling Group API Endpoints Configuration
 * Centralized endpoint definitions for the Scheduling Group workflow
 */

export const schedulingGroupEndpoints = {
  // CRUD Operations
  create: '/api/scheduling-groups',
  list: '/api/scheduling-groups',
  getById: (id: number | string) => `/api/scheduling-groups/${id}`,
  update: (id: number | string) => `/api/scheduling-groups/${id}`,
  delete: (id: number | string) => `/api/scheduling-groups/${id}`,

  // Additional operations
  getHistory: (id: number | string) => `/api/scheduling-groups/${id}/history`,
  listByArea: (areaId: number) => `/api/scheduling-groups?area=${areaId}`,
  
  // Bulk operations
  bulkDelete: '/api/scheduling-groups/bulk/delete',
} as const;

/**
 * Type-safe endpoint builder
 */
export type SchedulingGroupEndpoint = typeof schedulingGroupEndpoints[keyof typeof schedulingGroupEndpoints];
