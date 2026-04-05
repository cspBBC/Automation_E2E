/**
 * ALLOCATION DUTY BUILDER & TEMPLATE RESOLVER
 * 
 * Centralized logic for:
 * - Building unified context from parameters + scenario context
 * - Resolving template placeholders with fallback defaults
 * - Parsing test data into parameter maps
 * 
 * Part of the workflow layer - reusable across all allocation tests
 * Follows OpenAPI Generator pattern for parameter substitution
 */

import { DataTable } from 'playwright-bdd';
import type { AllocationContext } from '../context/context';

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
 * TEMPLATE RESOLVER - OpenAPI Generator Pattern
 * 
 * Resolves {{paramName|defaultValue}} syntax with context values
 * 
 * Syntax:
 * - {{paramName|defaultValue}} - uses context[paramName] or falls back to defaultValue
 * - {{paramName}} - uses context[paramName] or empty string
 * 
 * @example
 * template: { DutyName: "{{DutyName|U_CreatedBy_API}}" }
 * context: { DutyName: "TestDuty" }
 * result: { DutyName: "TestDuty" }
 * 
 * @example
 * template: { DutyName: "{{DutyName|U_CreatedBy_API}}" }
 * context: {} // DutyName missing
 * result: { DutyName: "U_CreatedBy_API" }
 */
export function resolveTemplate(template: Record<string, any>, context: Record<string, any>): Record<string, any> {
  const resolved: Record<string, any> = {};
  
  Object.entries(template).forEach(([key, value]) => {
    if (typeof value === 'string' && value.includes('{{')) {
      // Match all {{paramName|defaultValue}} or {{paramName}} placeholders
      const matches = value.match(/{{(\w+)(?:\|([^}]*))?}}/g);
      
      if (matches) {
        let result = value;
        
        matches.forEach(placeholder => {
          const parsed = placeholder.match(/{{(\w+)(?:\|([^}]*))?}}/);
          if (parsed) {
            const [, paramName, defaultValue] = parsed;
            const contextValue = context[paramName];
            
            // Use context value, or default, or empty string
            let replacementValue: string;
            if (contextValue === null || contextValue === undefined || contextValue === 'null') {
              replacementValue = defaultValue !== undefined ? defaultValue : '';
            } else {
              replacementValue = String(contextValue);
            }
            
            result = result.replace(placeholder, replacementValue);
          }
        });
        
        resolved[key] = result;
      } else {
        resolved[key] = value;
      }
    } else {
      resolved[key] = value;
    }
  });
  
  return resolved;
}

/**
 * DUTY CONTEXT BUILDER
 * 
 * Merges user parameters with scenario context to create resolution context
 * Single builder for create, edit, and all operations
 * 
 * Context priority:
 * 1. Scenario context (from previous operations)
 * 2. User parameters (from test step)
 * 3. Template defaults (in template via {{param|default}})
 */
export class DutyContextBuilder {
  private parameters: Record<string, string>;
  private scenarioCtx?: AllocationContext;

  constructor(parameters: Record<string, string>, scenarioCtx?: AllocationContext) {
    this.parameters = parameters;
    this.scenarioCtx = scenarioCtx;
  }

  /**
   * Normalize parameter keys to match template field names
   * Handles both create and edit parameter naming conventions
   * Examples:
   * - dutyName (from feature) → DutyName (template)
   * - editDutyName → DutyName
   * - editStartTime → StartTime
   */
  private normalizeKeys(params: Record<string, string>): Record<string, any> {
    const normalized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(params)) {
      // Map edit parameters to base field names
      if (key === 'editDutyName') normalized['DutyName'] = value;
      else if (key === 'editStartTime') normalized['StartTime'] = value;
      else if (key === 'editEndTime') normalized['EndTime'] = value;
      else if (key === 'editDutyColorId') normalized['dutyColorId'] = value;
      else if (key === 'editBreakTimeHour') normalized['breakTimeHour'] = value;
      else if (key === 'editBreakTimeMinute') normalized['breakTimeMinute'] = value;
      else if (key === 'editCurrDurationVal') normalized['currDurationVal'] = value;
      
      // Map create parameters with lowercase first letter to match template
      else if (key === 'dutyName') normalized['DutyName'] = value;
      else if (key === 'DutyName') normalized['DutyName'] = value;
      else if (key === 'dutyDate') normalized['DutyDate'] = value;
      else if (key === 'DutyDate') normalized['DutyDate'] = value;
      else if (key === 'allocationsDate') normalized['allocationsDate'] = value;
      else if (key === 'allocationsSchPer') normalized['allocationsSchPer'] = value;
      else if (key === 'SchedulingPersonID') normalized['SchedulingPersonID'] = value;
      else if (key === 'schedulingPersonId') normalized['SchedulingPersonID'] = value;
      else if (key === 'SchedulingTeamID') normalized['SchedulingTeamID'] = value;
      else if (key === 'schedulingTeamId') normalized['SchedulingTeamID'] = value;
      
      // Keep other keys as-is
      else normalized[key] = value;
    }
    
    return normalized;
  }

  /**
   * Build unified context for template resolution
   * Merges scenario context with user parameters
   * 
   * Order of precedence:
   * 1. User-provided parameters (highest priority)
   * 2. Scenario context (from previous steps)
   * 3. Template defaults (lowest priority, handled in resolveTemplate)
   */
  buildContext(): Record<string, any> {
    // Normalize parameter keys first (map feature file keys to template keys)
    const normalizedParams = this.normalizeKeys(this.parameters);
    const context: Record<string, any> = { ...normalizedParams };
    
    // Merge scenario context (captured from previous operations)
    // This makes duty ID automatically available for edit operations
    if (this.scenarioCtx) {
      // Only override if user hasn't already provided these values
      if (!context.DutyName && this.scenarioCtx.dutyName) {
        context.DutyName = this.scenarioCtx.dutyName;
      }
      if (!context.allocationsDutyId && this.scenarioCtx.allocationsDutyId) {
        context.allocationsDutyId = String(this.scenarioCtx.allocationsDutyId);
      }
      if (!context.allocationsSpId && this.scenarioCtx.allocationsSpId) {
        context.allocationsSpId = String(this.scenarioCtx.allocationsSpId);
      }
      // Preserve team/person from creation during edit (don't override with defaults)
      if (!context.schedulingPersonId && this.scenarioCtx.schedulingPersonId) {
        context.schedulingPersonId = this.scenarioCtx.schedulingPersonId;
      }
      if (!context.SchedulingPersonID && this.scenarioCtx.schedulingPersonId) {
        context.SchedulingPersonID = this.scenarioCtx.schedulingPersonId;
      }
      if (!context.allocationsSchPer && this.scenarioCtx.schedulingPersonId) {
        context.allocationsSchPer = this.scenarioCtx.schedulingPersonId;
      }
      if (!context.schedulingTeamId && this.scenarioCtx.schedulingTeamId) {
        context.schedulingTeamId = this.scenarioCtx.schedulingTeamId;
      }
      if (!context.SchedulingTeamID && this.scenarioCtx.schedulingTeamId) {
        context.SchedulingTeamID = this.scenarioCtx.schedulingTeamId;
      }
      if (!context.DutyDate && this.scenarioCtx.dutyDate) {
        context.DutyDate = this.scenarioCtx.dutyDate;
      }
      if (!context.allocationsDate && this.scenarioCtx.dutyDate) {
        context.allocationsDate = this.scenarioCtx.dutyDate;
      }
      // Preserve DutyID and ID from creation (feature file values)
      if (!context.DutyID && this.scenarioCtx.dutyId) {
        context.DutyID = this.scenarioCtx.dutyId;
      }
      if (!context.ID && this.scenarioCtx.dutyId) {
        context.ID = this.scenarioCtx.dutyId;
      }
    }
    
    // Mark as edited if this is an edit operation (has allocationsDutyId)
    if (context.allocationsDutyId) {
      context.isEdited = '1';
    }
    
    return context;
  }
}
