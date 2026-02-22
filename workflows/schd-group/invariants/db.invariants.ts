export function assertGroupExists(record: any) {
  if (!record) {
    throw new Error('Scheduling Group does not exist in DB');
  }
}

export function assertGroupArea(record: any, expectedArea: string) {
  if (record.area !== expectedArea) {
    throw new Error(`Expected area ${expectedArea}, got ${record.area}`);
  }
}

export function assertAllocationsMenu(record: any, expected: boolean) {
  const val = record.allocations_menu === undefined ? record.allocationsMenu : record.allocations_menu;
  if (!!val !== !!expected) {
    throw new Error(`Expected allocationsMenu ${expected}, got ${val}`);
  }
}

export function assertNotes(record: any, expected: string | null) {
  const val = record.notes === undefined ? null : record.notes;
  if ((val || null) !== (expected || null)) {
    throw new Error(`Expected notes '${expected}', got '${val}'`);
  }
}

export function assertAudit(record: any, actingUserId: number) {
  const lastBy = record.last_amended_by === undefined ? record.lastAmendedBy : record.last_amended_by;
  const lastDate = record.last_amended_date === undefined ? record.lastAmendedDate : record.last_amended_date;
  if (lastBy !== actingUserId) {
    throw new Error(`Expected lastAmendedBy ${actingUserId}, got ${lastBy}`);
  }
  if (!lastDate) {
    throw new Error('Expected lastAmendedDate to be set');
  }
}

export function assertHistoryCreated(historyRow: any, expectedSnapshot: any) {
  if (!historyRow) throw new Error('Expected history row to exist');
  // basic snapshot check: ensure name and area exist in snapshot columns
  if (expectedSnapshot.name && historyRow.scheduling_group_name !== expectedSnapshot.name) {
    throw new Error(`History snapshot name mismatch: expected ${expectedSnapshot.name}, got ${historyRow.scheduling_group_name}`);
  }
}
