# Allocations API Test Data Files

## Purpose
Test data and SQL queries for Allocations API scenarios. Includes request payloads and database query builders.

## Subdirectories

### `requestPayload/`
API request body templates for allocation operations.

#### `allocationApi_PostParams.json`
Master template for POST requests (create allocations).
- Uses template syntax: `{{paramName|defaultValue}}`
- Step definitions substitute template variables with actual values
- Example: `"DutyName": "{{DutyName|U_CreatedBy_API}}"` → uses DutyName or defaults to "U_CreatedBy_API"
- Used by: `allocations_api_create_edit.steps.ts` when building POST payloads

### `db/queries/`
SQL query builders for test data setup and verification.

#### `allocations.queries.ts`
Collection of SQL queries for allocation testing.
- Query methods: `getRecentAllocation()`, `updateAllocationStatus()`, etc.
- Used by: API test steps for database setup, cleanup, and assertion verification
- Pattern: Each query method returns SQL string for execution via `getDbPool().request()`

## How It Works

### Create Flow
1. Step loads `allocationApi_PostParams.json` template
2. Step provides values: `{ DutyName: "TestDuty_123", StartTime: "09:00" }`
3. Payload builder substitutes: `{{DutyName|...}}` → `"TestDuty_123"`
4. Step POSTs substituted payload to API
5. Step queries database using `AllocationQueries` to verify creation

### Edit Flow
1. Create step stores `allocationDutyId` in testContext
2. Edit step retrieves `allocationDutyId` from testContext
3. Edit payload uses: `"allocationsDutyId": "{{allocationsDutyId|null}}"` → substituted with stored ID
4. Step PUTs payload with existing allocation ID
5. Step queries database to verify updates

## Adding New Test Data
1. New test variant? Add to `allocationApi_PostParams.json` under new role/scenario section
2. New query? Add method to `allocations.queries.ts` with SELECT/UPDATE statements
3. Document template variables and their purpose at top of payload file
