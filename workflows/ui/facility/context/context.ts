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
