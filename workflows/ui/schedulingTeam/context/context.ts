/**
 * TEST CONTEXT: Scheduling Team Feature
 * Stores team-specific test data shared between steps (page, page object, created team name, current user).
 */

/**
 * Scheduling Team Context - DTO
 * Only includes variables ACTUALLY USED in test scenarios
 */

import { Page } from '@playwright/test';

export interface SchedulingTeamContext {
  page: Page | null;
  schedulingTeamPage: any;
  teamName: string;
  currentUserAlias: string;
}
