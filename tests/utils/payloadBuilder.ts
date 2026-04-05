/**
 * GENERIC PAYLOAD BUILDER - Universal Utility
 * Works for ANY module without custom code
 * Core: Parse → Resolve Template → Merge → Build
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
 * Supports nested objects and arrays
 */
export function resolveTemplate(template: Record<string, any>, params: Record<string, any>): Record<string, any> {
  const resolved: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(template)) {
    resolved[key] = resolveValue(value, params);
  }
  
  return resolved;
}

/**
 * Recursively resolve template values
 */
function resolveValue(value: any, params: Record<string, any>): any {
  if (typeof value === 'string' && value.includes('{{')) {
    return value.replace(/{{(\w+)(?:\|([^}]*))?}}/g, (_, paramName, defaultValue) => {
      const val = params[paramName];
      if (val === null || val === undefined || val === 'null') {
        return defaultValue || '';
      }
      return String(val);
    });
  }
  
  if (Array.isArray(value)) {
    return value.map(item => resolveValue(item, params));
  }
  
  if (typeof value === 'object' && value !== null) {
    const resolved: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      resolved[k] = resolveValue(v, params);
    }
    return resolved;
  }
  
  return value;
}

/**
 * GENERIC: Merge payload with default template values
 * Only overrides if params value is provided
 */
export function mergePayloadWithDefaults(
  defaultTemplate: Record<string, any>,
  params: Record<string, any>
): Record<string, any> {
  return { ...defaultTemplate, ...Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== null && v !== undefined && v !== '')
  )};
}

/**
 * BUILD PAYLOAD - Main orchestrator
 * 1. Parse input parameters
 * 2. Resolve template variables
 * 3. Merge with defaults
 * 4. Return final payload
 */
export function buildPayload(
  template: Record<string, any>,
  params: Record<string, any>
): Record<string, any> {
  // Resolve template variables first
  const resolved = resolveTemplate(template, params);
  
  // Merge with params to override any resolved values
  return mergePayloadWithDefaults(resolved, params);
}
