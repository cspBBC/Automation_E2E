# Scheduling Team Test Data Files

## Purpose
Test data files for Scheduling Team UI scenarios. Each JSON file contains form field definitions for different user roles.

## Files

### `schdTeamCreate_UIdata.json`
Generic test data for creating a scheduling team.
- Contains form fields for team creation
- Used by: Scheduling Team UI step definitions

### Additional Role-Specific Files
Expected pattern for new roles:
- `schdTeamCreate_AreaAdminNews_UIdata.json` → Area Admin variant
- `schdTeamCreate_SystemAdmin_UIdata.json` → System Admin variant

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
- Files follow pattern: `schdTeamCreate_[RoleName]_UIdata.json` or `schdTeamCreate_UIdata.json`
- Role names match users in `core/data/users.json`

## Adding New Test Data
1. Create new JSON file: `schdTeamCreate_NewRole_UIdata.json`
2. Copy structure from existing file
3. Update field values for the new role
4. Register in feature file examples with role name
