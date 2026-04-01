/**
 * ALLOCATION API - Module-Specific Configuration
 * Centralized configuration for allocation API tests
 */

export const ALLOCATION_API_CONFIG = {
  baseUrl: process.env.API_BASE_URL || 'https://allocate-systest-dbr.national.core.bbc.co.uk',
  dataPath: 'allocations/data',
  endpoints: {
    markAction: '/page-includes/allocations/weekly/actions/mark-action.php'
  },
  actions: {
    EDIT: 'edit',
    VIEW: 'view'
  }
};
