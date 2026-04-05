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
