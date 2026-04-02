/**
 * Scenario Context Variables - Per-Test Isolation using Map
 * Each test gets its own isolated context using a unique test ID
 * This enables parallel test execution without state interference
 */

export interface ContextVariables {
  // Page reference
  page: any | null;
  
  // Page Object
  scheduledGroupPage: any | null;
  
  // Scheduling Group variables
  schdGrpName: string;  // Current scheduling group name (created or updated)
  schdGrpNotes: string;  // Current scheduling group notes (updated)
  
  // User tracking
  currentUserAlias: string;
  
  // Add new variables above this line
}

/**
 * Variable definitions for reference
 */
export const CONTEXT_VARIABLES = {
  page: 'Playwright page instance',
  scheduledGroupPage: 'ScheduledGroupPage page object instance',
  schdGrpName: 'Current scheduling group name (created or updated) - used throughout test flow',
  schdGrpNotes: 'Current scheduling group notes (updated) - used throughout test flow',
  currentUserAlias: 'Current logged-in user alias from users.json',
};

// ============================================
// Per-Test Context Storage (Supports Parallel)
// ============================================

// Map to store context for each test by testId
const contextStore = new Map<string, ContextVariables>();

// Global variable to track current test ID (set by test fixture)
let currentTestId = 'default';

/**
 * Set the current test ID (called by fixture for each test)
 */
export function setCurrentTestId(testId: string): void {
  currentTestId = testId;
  // Initialize context for this test if it doesn't exist
  if (!contextStore.has(testId)) {
    contextStore.set(testId, {
      page: null,
      scheduledGroupPage: null,
      schdGrpName: '',
      schdGrpNotes: '',
      currentUserAlias: '',
    });
  }
}

/**
 * Get the context for the current test
 */
function getContext(): ContextVariables {
  if (!contextStore.has(currentTestId)) {
    contextStore.set(currentTestId, {
      page: null,
      scheduledGroupPage: null,
      schdGrpName: '',
      schdGrpNotes: '',
      currentUserAlias: '',
    });
  }
  return contextStore.get(currentTestId)!;
}

/**
 * Set page instance for current test
 */
export function setPage(page: any): void {
  getContext().page = page;
}

export function getPage(): any {
  return getContext().page;
}

/**
 * Page Object: ScheduledGroupPage
 */
export function setScheduledGroupPage(pageObject: any): void {
  getContext().scheduledGroupPage = pageObject;
}

export function getScheduledGroupPage(): any {
  return getContext().scheduledGroupPage;
}

/**
 * Current Scheduling Group Name (created or updated)
 * This variable holds the group name throughout the test flow
 */
export function setSchdGrpName(name: string): void {
  getContext().schdGrpName = name;
}

export function getSchdGrpName(): string {
  return getContext().schdGrpName;
}

/**
 * Current Scheduling Group Notes (updated)
 * This variable holds the notes throughout the test flow
 */
export function setSchdGrpNotes(notes: string): void {
  getContext().schdGrpNotes = notes;
}

export function getSchdGrpNotes(): string {
  return getContext().schdGrpNotes;
}

/**
 * User: Current User Alias
 */
export function setCurrentUserAlias(alias: string): void {
  getContext().currentUserAlias = alias;
}

export function getCurrentUserAlias(): string {
  return getContext().currentUserAlias;
}

/**
 * Get the entire context object (for debugging/testing only)
 */
export function getFullContext(): ContextVariables {
  return { ...getContext() };
}

/**
 * Clean up context for test (call in After hooks)
 */
export function cleanupTestContext(testId: string): void {
  contextStore.delete(testId);
}

/**
 * For backward compatibility: proxy object that uses getters/setters
 * This allows using: scenarioContext.page, scenarioContext.schdGrpName, etc.
 * Now with per-test isolation support
 */
export const scenarioContext = new Proxy({} as ContextVariables, {
  get(target, prop: string | symbol) {
    const key = prop as keyof ContextVariables;
    switch (key) {
      case 'page':
        return getPage();
      case 'scheduledGroupPage':
        return getScheduledGroupPage();
      case 'schdGrpName':
        return getSchdGrpName();
      case 'schdGrpNotes':
        return getSchdGrpNotes();
      case 'currentUserAlias':
        return getCurrentUserAlias();
      default:
        return undefined;
    }
  },
  set(target, prop: string | symbol, value: any) {
    const key = prop as keyof ContextVariables;
    switch (key) {
      case 'page':
        setPage(value);
        return true;
      case 'scheduledGroupPage':
        setScheduledGroupPage(value);
        return true;
      case 'schdGrpName':
        setSchdGrpName(value);
        return true;
      case 'schdGrpNotes':
        setSchdGrpNotes(value);
        return true;
      case 'currentUserAlias':
        setCurrentUserAlias(value);
        return true;
      default:
        return false;
    }
  },
});
