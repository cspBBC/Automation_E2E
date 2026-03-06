/**
 * DB INVARIANTS: SchedulingGroups
 * 
 * Validates business rules against database schema
 * Based on actual schema discovered (BBCSchedules_WP):
 * 
 * SchedulingGroups table columns:
 * ├── SchedulingGroupsID (PK, int, NOT NULL)
 * ├── SchedulingGroupsName (nvarchar, NOT NULL)
 * ├── DivisionID (FK, int, NOT NULL)
 * ├── IsIncludeINMenu (bit, NOT NULL) - Allocations Menu flag
 * ├── Notes (nvarchar, NULL)
 * ├── CreatedBy (int, NOT NULL)
 * ├── CreatedDate (datetime, NOT NULL)
 * ├── UpdatedBy (int, NULL)
 * ├── UpdatedDate (datetime, NULL)
 * └── DeletedAt (datetime, NULL) - Soft delete
 * 
 * SchedulingGroupsTeamsLinks junction table:
 * ├── SchedulingGroupsTeamsLinkID (PK, int)
 * ├── SchedulingGroupsID (FK, int, NOT NULL)
 * ├── SchedulingTeamID (FK, int, NOT NULL)
 * ├── StartDate (date, NULL)
 * ├── EndDate (date, NULL)
 * ├── CreatedBy, CreatedDate, UpdatedBy, UpdatedDate
 */

// ============================================
// CORE EXISTENCE CHECKS
// ============================================

/**
 * Validates record exists in database
 */
export function assertGroupExists(record: any) {
  if (!record) {
    throw new Error('Scheduling Group record does not exist in DB');
  }
}

/**
 * Validates record has not been soft-deleted
 */
export function assertGroupNotDeleted(record: any) {
  if (record.DeletedAt !== null && record.DeletedAt !== undefined) {
    throw new Error(
      `Scheduling Group was deleted at: ${new Date(record.DeletedAt).toISOString()}`
    );
  }
}

// ============================================
// COLUMN-LEVEL INVARIANTS
// ============================================

/**
 * Validates group's assigned area (Division)
 */
export function assertGroupArea(
  record: any,
  expectedArea: string
): void {
  const actual = record.DivisionName;
  if (actual !== expectedArea) {
    throw new Error(
      `Area mismatch: expected '${expectedArea}', got '${actual}'`
    );
  }
}

/**
 * Validates group's name
 */
export function assertGroupName(
  record: any,
  expectedName: string
): void {
  const actual = record.SchedulingGroupsName;
  if (actual !== expectedName) {
    throw new Error(
      `Group name mismatch: expected '${expectedName}', got '${actual}'`
    );
  }
}

/**
 * Validates Allocations Menu flag (IsIncludeINMenu column)
 * 
 * @param record SchedulingGroups record
 * @param expected Boolean value (bit type converts to 0/1)
 */
export function assertAllocationsMenu(
  record: any,
  expected: boolean
): void {
  const actual = record.IsIncludeINMenu;
  if (!!actual !== !!expected) {
    throw new Error(
      `Allocations Menu mismatch: expected ${expected}, got ${actual}`
    );
  }
}

/**
 * Validates optional Notes field
 * 
 * @param record SchedulingGroups record
 * @param expected String value or null
 */
export function assertNotes(
  record: any,
  expected: string | null
): void {
  const actual = record.Notes ?? null;
  const expectedNorm = expected ?? null;

  if (actual !== expectedNorm) {
    throw new Error(
      `Notes mismatch: expected '${expectedNorm}', got '${actual}'`
    );
  }
}

// ============================================
// AUDIT TRAIL INVARIANTS
// ============================================

/**
 * Validates audit trail (creation or last update)
 * 
 * Priority logic:
 * 1. If UpdatedBy is set → validates most recent modification
 * 2. Otherwise → validates initial creation
 * 
 * @param record SchedulingGroups record
 * @param expectedUserId Expected user ID
 */
export function assertAudit(
  record: any,
  expectedUserId: number
): void {
  const auditUserId = record.UpdatedBy ?? record.CreatedBy;
  const auditDate = record.UpdatedDate ?? record.CreatedDate;
  const auditType = 
    record.UpdatedBy !== null && record.UpdatedBy !== undefined
      ? 'Updated'
      : 'Created';

  if (auditUserId !== expectedUserId) {
    throw new Error(
      `${auditType}By mismatch: expected user ${expectedUserId}, got ${auditUserId}`
    );
  }
  if (!auditDate) {
    throw new Error(`${auditType}Date is missing or null`);
  }
}

/**
 * Validates creation audit trail specifically
 * 
 * @param record SchedulingGroups record
 * @param expectedUserId Expected creator user ID
 */
export function assertCreatedBy(
  record: any,
  expectedUserId: number
): void {
  const actual = record.CreatedBy;
  if (actual !== expectedUserId) {
    throw new Error(
      `CreatedBy mismatch: expected ${expectedUserId}, got ${actual}`
    );
  }
  if (!record.CreatedDate) {
    throw new Error('CreatedDate is null or missing');
  }
}

/**
 * Validates last modification audit trail (only if record was modified)
 * 
 * @param record SchedulingGroups record
 * @param expectedUserId Expected last modifier user ID
 */
export function assertUpdatedBy(
  record: any,
  expectedUserId: number
): void {
  const actual = record.UpdatedBy;
  if (actual !== expectedUserId) {
    throw new Error(
      `UpdatedBy mismatch: expected ${expectedUserId}, got ${actual}`
    );
  }
  if (!record.UpdatedDate) {
    throw new Error('UpdatedDate is null or missing');
  }
}

/**
 * Validates creation date is set
 */
export function assertCreatedDate(record: any): void {
  if (!record.CreatedDate) {
    throw new Error('CreatedDate is null or missing');
  }
}

/**
 * Validates last update date is set (if record was modified)
 */
export function assertUpdatedDate(record: any): void {
  if (!record.UpdatedDate) {
    throw new Error('UpdatedDate is null or missing');
  }
}

// ============================================
// TEAM ASSOCIATION INVARIANTS
// ============================================

/**
 * Validates associated scheduling teams match expected list
 * 
 * Uses AssociatedTeamIds array populated by getAssociatedTeamIds()
 * 
 * @param record SchedulingGroups record with AssociatedTeamIds array
 * @param expectedTeamIds Array of SchedulingTeamID values
 */
export function assertTeamsAssociated(
  record: any,
  expectedTeamIds: number[]
): void {
  if (!Array.isArray(expectedTeamIds)) {
    throw new Error('Expected team IDs must be an array');
  }

  const actual = record.AssociatedTeamIds ?? [];
  if (!Array.isArray(actual)) {
    throw new Error(
      `AssociatedTeamIds is not an array, got: ${typeof actual}`
    );
  }

  // Sort both arrays for comparison (order independent)
  const actualSorted = [...actual].sort((a, b) => a - b);
  const expectedSorted = [...expectedTeamIds].sort((a, b) => a - b);

  if (JSON.stringify(actualSorted) !== JSON.stringify(expectedSorted)) {
    throw new Error(
      `Associated teams mismatch: expected [${expectedSorted}], got [${actualSorted}]`
    );
  }
}

/**
 * Validates group has NO associated teams
 */
export function assertNoTeamsAssociated(record: any): void {
  const actual = record.AssociatedTeamIds ?? [];
  if (actual.length > 0) {
    throw new Error(
      `Expected no associated teams but found: [${actual.join(', ')}]`
    );
  }
}

/**
 * Validates group has AT LEAST one associated team
 */
export function assertHasTeamsAssociated(record: any): void {
  const actual = record.AssociatedTeamIds ?? [];
  if (actual.length === 0) {
    throw new Error('Expected at least one associated team but found none');
  }
}

/**
 * Validates group has exactly N associated teams
 */
export function assertTeamCountIs(
  record: any,
  expectedCount: number
): void {
  const actual = record.AssociatedTeamIds ?? [];
  if (actual.length !== expectedCount) {
    throw new Error(
      `Team count mismatch: expected ${expectedCount}, got ${actual.length}`
    );
  }
}

// ============================================
// HISTORY & AUDIT LOG
// ============================================

/**
 * Validates history/audit log snapshot
 * 
 * @param historyRow Row from SchedulingGroupsTeamsLinks or audit table
 * @param expectedSnapshot Object with expected field values
 */
export function assertHistoryCreated(
  historyRow: any,
  expectedSnapshot: any
): void {
  if (!historyRow) {
    throw new Error('Expected history/audit row to exist in DB');
  }

  if (expectedSnapshot.name) {
    const actual = historyRow.scheduling_group_name;
    if (actual !== expectedSnapshot.name) {
      throw new Error(
        `History name mismatch: expected '${expectedSnapshot.name}', got '${actual}'`
      );
    }
  }

  if (expectedSnapshot.area) {
    const actual = historyRow.division_name;
    if (actual !== expectedSnapshot.area) {
      throw new Error(
        `History area mismatch: expected '${expectedSnapshot.area}', got '${actual}'`
      );
    }
  }
}

// ============================================
// COMPOSITE INVARIANTS (Multiple checks)
// ============================================

/**
 * Complete validation for view operations (NP035.01)
 * 
 * Validates:
 * ✓ Record exists and not soft-deleted
 * ✓ Area is correct
 * ✓ All view columns present
 * ✓ Audit trail is valid
 * 
 * @param record SchedulingGroups record
 * @param expectedArea Division name
 * @param creatorUserId User who created or last modified
 */
export function assertValidViewRecord(
  record: any,
  expectedArea: string,
  creatorUserId: number
): void {
  // Basic checks
  assertGroupExists(record);
  assertGroupNotDeleted(record);
  
  // Business logic checks
  assertGroupArea(record, expectedArea);
  assertAudit(record, creatorUserId);

  // Verify all required columns for view are hydrated
  const requiredColumns = [
    'SchedulingGroupsID',
    'SchedulingGroupsName',
    'DivisionName',
    'IsIncludeINMenu',
    'Notes',
    'CreatedBy',
    'CreatedDate',
    'AssociatedTeamIds',
  ];

  for (const col of requiredColumns) {
    if (record[col] === undefined) {
      throw new Error(`Required view column missing: ${col}`);
    }
  }
}

/**
 * Validates record is in consistent state for listing
 */
export function assertValidListRecord(
  record: any,
  requiredColumns: string[] = [
    'SchedulingGroupsID',
    'SchedulingGroupsName',
    'DivisionName',
    'IsIncludeINMenu',
    'CreatedBy',
  ]
): void {
  assertGroupExists(record);
  assertGroupNotDeleted(record);

  for (const col of requiredColumns) {
    if (record[col] === undefined) {
      throw new Error(`Required list column missing: ${col}`);
    }
  }
}
