# Facility Test Data Files

## Purpose
Test data files for Facility UI scenarios. Each JSON file contains form field definitions for different user roles.

## Files

### `facilityCreate_AreaAdminNewsUIdata.json`
Test data for Area Admin user creating a facility.
- Contains form fields specific to facility creation
- Used by: Facility UI step definitions for Area Admin test scenarios

### `facilityCreate_SystemAdminUIdata.json`
Test data for System Admin user creating a facility.
- Contains form fields with System Admin permissions/capabilities
- Used by: Facility UI step definitions for System Admin test scenarios

## Structure
Each file follows this JSON structure:
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

## Variable Naming Convention
- Files follow pattern: `facilityCreate_[RoleName]_UIdata.json`
- Role names match users in `core/data/users.json`
- Keep role names consistent across all feature workflows

## Adding New Test Data
1. Create new JSON file: `facilityCreate_NewRole_UIdata.json`
2. Copy structure from existing file
3. Update field values for the new role
4. Register in feature file examples with role name
