/**
 * ALLOCATION DUTY BUILDER - SIMPLIFIED
 * Core: Parse → Normalize → Resolve
 * Just 3 pure functions, no classes
 */

import { DataTable } from 'playwright-bdd';

/**
 * Parse DataTable rows to key-value object
 * Handles two formats:
 * 1. Key-Value: | key | value | - recommended
 * 2. Direct: | paramName | paramValue |
 */
export function parseDataTableToMap(dataTable: DataTable): Record<string, string> {
  const rows = dataTable.hashes();
  if (rows.length === 0) return {};
  
  // Check if first row has 'key' and 'value' columns
  if ('key' in rows[0] && 'value' in rows[0]) {
    const result: Record<string, string> = {};
    rows.forEach(row => {
      result[row.key] = row.value;
    });
    return result;
  }
  
  // Otherwise, assume first row is the parameter object
  return rows[0] as Record<string, string>;
}

/**
 * CORE: Resolve {{paramName|defaultValue}} in template
 */
export function resolveTemplate(template: Record<string, any>, params: Record<string, any>): Record<string, any> {
  const resolved: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(template)) {
    if (typeof value !== 'string' || !value.includes('{{')) {
      resolved[key] = value;
      continue;
    }

    resolved[key] = value.replace(/{{(\w+)(?:\|([^}]*))?}}/g, (_, paramName, defaultValue) => {
      const val = params[paramName];
      if (val === null || val === undefined || val === 'null') {
        return defaultValue || '';
      }
      return String(val);
    });
  }
  
  return resolved;
}

/**
 * UTILITY: Normalize parameter names (dutyName → DutyName, editStartTime → StartTime)
 */
export function normalizeParameters(params: Record<string, string>): Record<string, string> {
  const map: Record<string, string> = {
    dutyName: 'DutyName', dutyDate: 'DutyDate',
    allocationsDate: 'allocationsDate', allocationsSchPer: 'allocationsSchPer',
    schedulingPersonId: 'SchedulingPersonID', schedulingTeamId: 'SchedulingTeamID',
    editDutyName: 'DutyName', editStartTime: 'StartTime', editEndTime: 'EndTime',
    editDutyColorId: 'dutyColorId', editBreakTimeHour: 'breakTimeHour', editBreakTimeMinute: 'breakTimeMinute',
    editCurrDurationVal: 'currDurationVal',
  };
  
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    normalized[map[key] || key] = value;
  }
  return normalized;
}
