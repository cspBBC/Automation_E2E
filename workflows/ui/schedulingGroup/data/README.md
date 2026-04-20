# Scheduling Group Test Data Files

## Purpose
Test data files for Scheduling Group UI scenarios. Each JSON file contains form field definitions and values for different user roles.

## Files

### `schdGroupCreate_AreaAdminNews_UIdata.json`
Test data for Area Admin user creating a scheduling group.
- Contains form fields: group_name, allocations_menu, notes, etc.
- Used by: `schedulinggroup_ui_create.steps.ts` → "areaAdmin_News" test variant

### `schdGroupCreate_SystemAdmin_UIdata.json`
Test data for System Admin user creating a scheduling group.
- Contains form fields specific to System Admin permissions/capabilities
- Used by: `schedulinggroup_ui_create.steps.ts` → "systemAdmin" test variant

### `schdGroupCreate_ApiRequestPayload.json`
API request payload template for creating scheduling groups (if using API approach).
- May include template variables for dynamic substitution
- Used by: Integrated/API test scenarios for group creation

## Structure
Each UI data file follows this JSON structure:
```json
{
  "fieldName": {
    "type": "text|dropdown|checkbox|etc",
    "value": "actual_value",
    "required": true|false,
    "label": "optional_display_label"
  }
}
```

## Adding New Test Data
1. Create new JSON file: `schdGroupCreate_NewRole_UIdata.json`
2. Copy structure from existing file
3. Update field values for the new role's test scenario
4. Register in feature file examples with role name and filename
