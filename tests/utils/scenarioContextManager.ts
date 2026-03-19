/**
 * Centralized Context Manager for all UI tests
 * Provides isolated context per test to prevent state contamination in parallel execution
 * Includes automatic cleanup for scalability
 */

export interface ScenarioContext {
  page: any | null;
  [key: string]: any;
}

// Store context per test using a unique counter
const contextStore = new Map<number, ScenarioContext>();
let contextCounter = 0;
const MAX_CONTEXTS = 100; // Keep only last 100 contexts in memory

/**
 * Initialize a new context for current test
 * Each test gets a unique ID that persists within that test
 */
export function initializeScenarioContext(): { id: number } {
  const testId = ++contextCounter;
  const ctx: ScenarioContext = { page: null };
  contextStore.set(testId, ctx);
  
  // Auto-cleanup: remove oldest contexts if exceeding max
  if (contextStore.size > MAX_CONTEXTS) {
    const oldestId = contextStore.keys().next().value as number | undefined;
    if (oldestId !== undefined) {
      contextStore.delete(oldestId);
    }
  }
  
  // Store testId on the proxy target
  currentContextProxy.__testId = testId;
  
  return { id: testId };
}

/**
 * Get the context for the current test execution
 */
function getContextForTest(): ScenarioContext {
  const testId = currentContextProxy.__testId as number;
  if (!testId) {
    // Fallback: initialize if not set
    initializeScenarioContext();
    return getContextForTest();
  }
  
  if (!contextStore.has(testId)) {
    contextStore.set(testId, { page: null });
  }
  
  return contextStore.get(testId)!;
}

/**
 * Create a Proxy for context that auto-routes to correct test context
 */
const currentContextProxy = new Proxy(
  { __testId: 0 } as ScenarioContext & { __testId: number },
  {
    get(target, prop) {
      if (prop === '__testId') return target.__testId;
      const ctx = getContextForTest();
      return ctx[prop as keyof ScenarioContext];
    },
    set(target, prop, value) {
      if (prop === '__testId') {
        target.__testId = value;
        return true;
      }
      const ctx = getContextForTest();
      ctx[prop as keyof ScenarioContext] = value;
      return true;
    },
  }
);

export const scenarioContext = currentContextProxy as ScenarioContext;

/**
 * Manual cleanup (call if needed in After hooks)
 */
export function cleanupContext(testId?: number): void {
  if (testId) {
    contextStore.delete(testId);
  }
}

/**
 * Get context stats (for monitoring)
 */
export function getContextStats() {
  return {
    totalContexts: contextStore.size,
    maxContexts: MAX_CONTEXTS,
    currentTestId: (currentContextProxy as any).__testId,
  };
}
