/**
 * Scheduling Group API Payloads
 * Centralized payload configurations for different test scenarios
 */

export interface CreateSchedulingGroupPayload {
  name: string;
  area: number;
  allocations_menu?: boolean;
  notes?: string;
}

export interface UpdateSchedulingGroupPayload {
  name?: string;
  allocations_menu?: boolean;
  notes?: string;
}

/**
 * Payload builders for different test scenarios
 */
export const schedulingGroupPayloads = {
  /**
   * Create payloads
   */
  create: {
    /**
     * System Admin creating SG - all fields
     */
    systemAdminFull: (): CreateSchedulingGroupPayload => ({
      name: `SG_SystemAdmin_Test_${Date.now()}`,
      area: 10,
      allocations_menu: true,
      notes: 'Created by System Admin test'
    }),

    /**
     * Area Admin creating SG - with disabled allocations menu
     */
    areaAdminArea10: (): CreateSchedulingGroupPayload => ({
      name: `SG_AreaAdmin_Area10_${Date.now()}`,
      area: 10,
      allocations_menu: false,
      notes: 'Created by Area Admin test'
    }),

    /**
     * Minimal payload - only required fields
     */
    minimal: (areaId: number = 10): CreateSchedulingGroupPayload => ({
      name: `SG_Minimal_${Date.now()}`,
      area: areaId
    }),

    /**
     * With notes only
     */
    withNotes: (areaId: number = 10, notes: string = 'Test notes'): CreateSchedulingGroupPayload => ({
      name: `SG_WithNotes_${Date.now()}`,
      area: areaId,
      notes
    }),

    /**
     * Custom builder
     */
    custom: (overrides: Partial<CreateSchedulingGroupPayload>): CreateSchedulingGroupPayload => ({
      name: `SG_Custom_${Date.now()}`,
      area: 10,
      allocations_menu: true,
      ...overrides
    })
  },

  /**
   * Update payloads
   */
  update: {
    /**
     * Update name and notes
     */
    nameAndNotes: (newName?: string, newNotes?: string): UpdateSchedulingGroupPayload => ({
      name: newName || `SG_Updated_${Date.now()}`,
      notes: newNotes || 'Updated notes'
    }),

    /**
     * Toggle allocations menu
     */
    toggleAllocationsMenu: (enabled: boolean): UpdateSchedulingGroupPayload => ({
      allocations_menu: enabled
    }),

    /**
     * Update notes only
     */
    notesOnly: (notes: string): UpdateSchedulingGroupPayload => ({
      notes
    }),

    /**
     * Custom update
     */
    custom: (overrides: UpdateSchedulingGroupPayload): UpdateSchedulingGroupPayload => ({
      ...overrides
    })
  }
};

/**
 * Request headers builders
 */
export const requestHeaders = {
  /**
   * Add user ID header for header-based authentication
   */
  withUserId: (userId: number | string): Record<string, string> => ({
    'X-User-Id': typeof userId === 'number' ? userId.toString() : userId
  }),

  /**
   * Add multiple headers
   */
  withCustomHeaders: (headers: Record<string, string>): Record<string, string> => ({
    ...headers
  })
};

/**
 * Test data factory
 */
export const testDataFactory = {
  /**
   * Generate unique name with timestamp
   */
  generateName: (prefix: string = 'SG'): string => {
    return `${prefix}_${Date.now()}`;
  },

  /**
   * Generate payload with user-specific details
   */
  generatePayloadForUser: (userName: string, areaId: number): CreateSchedulingGroupPayload => ({
    name: `SG_${userName}_Area${areaId}_${Date.now()}`,
    area: areaId,
    allocations_menu: true,
    notes: `Created by ${userName} test`
  })
};
