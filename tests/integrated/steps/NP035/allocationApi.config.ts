/**
 * ALLOCATION API - Module-Specific Configuration
 * Centralized configuration for allocation API tests
 * 
 * Design Pattern:
 * - endpoints: Maps operations to their respective API endpoints
 * - actions: Maps business operations to API action parameters
 * - dataPath: Base path for test data files
 * 
 * Future-Proof: Easy to add new endpoints without changing step code
 */

export const ALLOCATION_API_CONFIG = {
  baseUrl: process.env.API_BASE_URL || 'https://allocate-systest-dbr.national.core.bbc.co.uk',
  dataPath: 'integrated/allocations/data/requestPayload',
  
  // API Endpoints - Update here if endpoints change
  endpoints: {
    // Allocation Operations
    markAction: '/page-includes/allocations/weekly/actions/mark-action.php',
    // create: '/api/allocations/create',        // Future: separate create endpoint
    // edit: '/api/allocations/edit',            // Future: separate edit endpoint
    // delete: '/api/allocations/delete',        // Future: separate delete endpoint
    // view: '/api/allocations/view'             // Future: separate view endpoint
  },
  
  // Business Actions - Map to API parameters or endpoints
  // Can be extended for future operations
  actions: {
    EDIT: 'edit',
    // VIEW: 'view',
    // CREATE: 'create',
    // DELETE: 'delete'
  }
};
