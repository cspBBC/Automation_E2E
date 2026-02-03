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
