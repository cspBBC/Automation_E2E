import { APIResponse } from '@playwright/test';

/**
 * Rule: successful creation
 */
export function assertGroupCreated(response: APIResponse) {
  if (response.status() !== 201) {
    throw new Error(
      `Expected 201 Created, got ${response.status()}`
    );
  }
}

/**
 * Rule: unauthorized access
 */
export function assertForbidden(response: APIResponse) {
  if (response.status() !== 403) {
    throw new Error(
      `Expected 403 Forbidden, got ${response.status()}`
    );
  }
}

/**
 * Rule: validation failure
 */
export function assertValidationError(response: APIResponse) {
  if (response.status() !== 400) {
    throw new Error(
      `Expected 400 Validation Error, got ${response.status()}`
    );
  }
}
