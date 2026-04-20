/**
 * TEST CONTEXT: Facility Feature
 * Stores facility-specific test data shared between steps (page, page object, created facility name, current user).
 */

/**
 * Facility Context - DTO
 * Only includes variables ACTUALLY USED in test scenarios
 */

import { Page } from '@playwright/test';

export interface FacilityContext {
  page: Page | null;
  facilityPage: any;
  facilityName: string;
  currentUserAlias: string;
}
