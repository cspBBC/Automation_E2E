/**
 * Scheduling Group Context - DTO
 * 
 * Stores test data shared between multiple steps in the same scenario.
 * Created once per test (via fixture), shared by all steps (Given/When/Then).
 * Enables parallel-safe test execution - each test gets its own isolated context.
 * 
 * DESIGN PATTERN:
 * - page: Raw Playwright browser session (required for all steps)
 * - scheduledGroupPage: Page object created once in Given, reused by all steps (efficiency)
 * - groupName, notes: Scenario-specific data (created by steps, used by assertions)
 * - currentUserAlias: Logged-in user role (for role-specific assertions)
 * 
 * IMPORTANT:
 * - Store page object once (Given step), reuse across all steps (avoid recreation overhead)
 * - Only add properties for data that MUST be shared between steps
 * - Do NOT add static data (use JSON files in workflows/ui/schedulingGroup/data/)
 * 
 * @example
 * // In Given step:
 * const page = await loginAs('areaAdmin');
 * const scheduledGroupPage = getPageObject('Scheduled Group', page);
 * ctx.page = page;
 * ctx.scheduledGroupPage = scheduledGroupPage;  // Store for reuse
 * 
 * // In When/Then steps: reuse stored page object
 * const page = ctx.page;
 * const scheduledGroupPage = ctx.scheduledGroupPage;  // Reuse, no recreation
 * await scheduledGroupPage.createGroup(name);
 */

import { Page } from '@playwright/test';

export interface SchedulingGroupContext {
  /** 
   * Playwright Page object (raw browser session).
   * Set once in Given step after login, reused by all subsequent steps.
   * Null until loginAs() is called.
   */
  page: Page | null;

  /**
   * ScheduledGroupPage object (page object for Scheduling Group page).
   * Created once in Given step, cached here, and reused by all steps.
   * This avoids expensive recreation of page objects in every step.
   * Null until getPageObject() is called in Given step.
   */
  scheduledGroupPage: any;

  /**
   * Name of the scheduling group created/edited in this test.
   * Set by Given/When steps that create or modify a group.
   * Used by When/Then steps that operate on the same group.
   */
  groupName: string;

  /**
   * Notes/description assigned to the scheduling group in this test.
   * Set when you update group properties that need to be verified later.
   * Used by Then steps to assert the correct notes were saved.
   */
  notes: string;

  /**
   * Role/alias of the user currently logged in (e.g., 'areaAdmin_News', 'systemAdmin').
   * Set in Given step after loginAs().
   * Used in assertions to verify role-specific behavior.
   */
  currentUserAlias: string;
}





