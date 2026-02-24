# POC BBC - Automated Testing Framework

## 📋 Overview

**POC BBC** is a **Proof of Concept** test automation framework built with **Playwright BDD (Behavior-Driven Development)**. It provides comprehensive testing capabilities across:
- **UI Testing** - Browser-based UI automation with visual validation
- **API Testing** - REST API endpoint validation and integration testing
- **Database Testing** - Direct database query validation and data integrity checks

The framework is designed to test a **scheduling and facility management system** with role-based access control (System Admin, Area Admin, Users).

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **Playwright** | Cross-browser test automation |
| **Playwright-BDD** | Gherkin feature file support (Given-When-Then) |
| **TypeScript** | Type-safe test development |
| **MSSQL** | SQL Server database connectivity |
| **Dotenv** | Environment variable management |

---

## 📁 Project Structure

```
poc_bbc/
├── README.md                               # This file - Documentation & learning guide
├── package.json                            # NPM dependencies and npm scripts
├── playwright.config.ts                    # Playwright & BDD configuration
├── tsconfig.json                           # TypeScript compilation settings
│
├── core/                                   # Core infrastructure & utilities
│   ├── api/
│   │   └── apiClient.ts                   # HTTP client wrapper for REST API requests
│   ├── data/
│   │   └── users.json                     # Test user definitions (credentials, IDs, roles)
│   └── db/
│       ├── connection.ts                  # MSSQL database connection pool
│       ├── dbseed.ts                      # User verification utilities for database tests
│       └── queries.ts                     # Common database query helpers
│
├── tests/                                  # All test files organized by type
│   ├── api_db/                            # API & Database integration tests
│   │   ├── db/                            # Pure database tests (no browser/API)
│   │   │   ├── mock-schd-group-create.db.spec.ts     # Example: scheduling group DB verification
│   │   │   └── smoke-connection.db.spec.ts           # Database connectivity check
│   │   ├── features/                      # Gherkin feature files for API_DB tests
│   │   │   ├── NP001/
│   │   │   └── NP035/
│   │   │       └── NP035.01_create.feature           # Scheduling group creation scenario
│   │   └── steps/                         # Step implementations for API_DB tests
│   │       ├── NP001/
│   │       └── NP035/
│   │           └── schd_grp_create.steps.ts          # Given-When-Then implementations
│   │
│   ├── ui/                                # UI (Browser) tests
│   │   ├── features/                      # Gherkin feature files for UI tests
│   │   │   ├── NP001/
│   │   │   │   └── facility_booking.feature          # Facility CRUD scenarios
│   │   │   └── NP035/
│   │   │       └── scheduling-groups.feature         # Scheduling groups UI scenarios
│   │   ├── page/                          # Page Object Model (POM) - UI selectors & actions
│   │   │   ├── NP001/
│   │   │   │   └── FacilityPage.ts                   # Facility page interactions
│   │   │   └── NP035/
│   │   └── steps/                         # Step implementations for UI tests
│   │       ├── NP001/
│   │       │   └── facility_booking.steps.ts
│   │       └── NP035/
│   │           └── scheduling-groups.steps.ts
│   │
│   ├── fixtures/                          # Shared test dependencies & fixtures
│   │   ├── test.fixture.ts               # Extends Playwright: db, ensureUserExists, authenticateAs
│   │   ├── pages.fixture.ts              # UI page objects fixture for UI tests
│   │   ├── db.fixture.ts                 # Database helpers (connection, transaction mgmt)
│   │   └── correlation.fixture.ts        # Request correlation ID management
│   │
│   ├── types/                             # TypeScript interfaces & types
│   │   └── formField.ts                  # Form field type definitions
│   │
│   └── utils/                             # Utility functions for tests
│       ├── formFiller.ts                 # Dynamic form filling logic
│       └── readJson.ts                   # JSON file reading helpers
│
├── workflows/                              # Modular business logic & test data (by feature)
│   ├── facilities/                        # Facility management feature workflow
│   │   ├── api/                           # API endpoints & request builders
│   │   ├── data/                          # Test data JSON files
│   │   │   ├── facilityFormData.json
│   │   │   ├── facilityFormData_area_admin.json
│   │   │   └── facilityFormData_system_admin.json
│   │   ├── db/                            # Database operations & queries
│   │   └── invariants/                    # Business rule validations
│   │
│   └── schd-group/                        # Scheduling group feature workflow
│       ├── api/
│       │   ├── endpoints.ts               # API endpoint URL definitions
│       │   └── schd-group.api.ts          # API request builders & client methods
│       ├── data/
│       │   └── payloads.json              # Request payload templates & builders
│       ├── db/
│       │   ├── queries/
│       │   │   └── schedulingGroup.queries.ts        # Reusable database query methods
│       │   └── seed/
│       │       └── db.seed.ts             # Database seeding & transaction management
│       └── invariants/
│           ├── api.invariants.ts          # API response validations & assertions
│           ├── db.invariants.ts           # Database record validations & assertions
│           └── permission.invariants.ts   # Permission/access control validations
│
├── playwright-report/                     # Test execution reports (auto-generated)
│   └── index.html                         # HTML test results dashboard
│
├── screenshots/                           # Screenshot artifacts from test runs
│
└── test-results/                          # Test artifacts (auto-generated)
    ├── videos/                            # Test execution videos (if enabled)
    ├── traces/                            # Playwright trace files for debugging
    └── test-results.json                  # Test results in JSON format
```

---

## 📚 Key Directories Explained

### **1. `core/` - Core Infrastructure**

**Purpose**: Foundational utilities that the entire test suite depends on.

```typescript
core/api/apiClient.ts
├── Purpose: Wrapper around Playwright's APIRequestContext
├── Handles: HTTP requests (GET, POST, PUT, DELETE, PATCH)
├── Features: 
│  ├── Custom headers support
│  ├── Base URL management
│  └── Response handling

core/db/connection.ts
├── Purpose: Database connection pooling
├── Handles: MSSQL Server connectivity
├── Features:
│  ├── Connection pool reuse
│  ├── Error handling
│  └── Pool cleanup
```

### **2. `tests/fixtures/` - Test Setup & Teardown**

**Purpose**: Reusable test fixtures that provide dependencies to test steps.

```typescript
pages.fixture.ts
├── Extends: Playwright BDD test
├── Provides: UI page objects (FacilityPage, etc.)
├── Scope: Used by UI tests

test.fixture.ts
├── Extends: Playwright BDD test with API & DB support
├── Provides:
│  ├── apiClient - Authenticated HTTP client
│  ├── authenticateAs - Login/authentication helper
│  └── db - Database connection pool
├── Scope: Used by API_DB tests
├── Cleanup: Auto-rollbacks DB transactions after each test
```

### **3. `tests/ui/` - User Interface Tests**

**Purpose**: Browser automation and UI interaction testing.

```
features/
├── Contains: Gherkin scenario descriptions in plain English
├── Format: Given-When-Then steps
├── Example: "User creates a new facility"

page/
├── Pattern: Page Object Model (POM)
├── Contains: UI selectors and element interactions
├── Benefit: Centralizes UI changes in one place

steps/
├── Contains: Step implementations linking features to actions
├── Links: feature file sentences → TypeScript code
├── Example: "Given user is on facility catalogue page" → await page.goto()
```

### **4. `tests/api_db/` - API & Database Tests**

**Purpose**: Integration testing combining API calls and database verification.

```
features/
├── Contains: API test scenarios in Gherkin
├── Example: "System Admin creates a Scheduling Group"

steps/
├── Contains: API request & database assertion steps
├── Flow: 
│  ├── Given: Setup (seed DB, authenticate)
│  ├── When: API call (POST, PUT, etc.)
│  └── Then: Verify (status code, database state)

db/
├── Contains: Pure database tests
├── Scope: No API or UI - direct SQL execution
├── Purpose: Verify database integrity and connectivity
```

### **5. `workflows/` - Business Logic & Test Data**

**Purpose**: Modular, reusable test workflows organized by feature.

```
workflows/schd-group/
├── api/
│   ├── endpoints.ts → URL paths
│   └── schd-group.api.ts → Request builders
│
├── data/
│   ├── payloads.ts → Request payload templates
│   ├── users.json → Test user credentials
│   └── schedulingGroupData.json → Test data
│
├── db/
│   ├── queries/ → Database read/verify operations
│   └── seed/ → Database setup & transactions
│
└── invariants/
    ├── api.invariants.ts → API response rules
    ├── db.invariants.ts → Database record rules
    └── permission.invariants.ts → Access control rules
```

---

## � Architecture & Key Concepts

### **1. Fixtures - Test Dependencies**

**What are Fixtures?** Fixtures are test dependencies automatically provided by the framework before each test runs.

#### **Core Fixtures** (`tests/fixtures/test.fixture.ts`)

```typescript
test('example', async ({ db, ensureUserExists, authenticateAs, apiClient }) => {
  // These are provided automatically by Playwright-BDD
});
```

| Fixture | Purpose | Type | Scope |
|---------|---------|------|-------|
| `db` | Database connection pool | Pool | Auto-rollback transaction |
| `ensureUserExists(alias)` | Verify test user exists in DB | Function | Returns user data |
| `authenticateAs(userId)` | Set authentication headers | Function | Adds auth to requests |
| `apiClient` | Authenticated HTTP client | Object | Ready for API calls |

#### **UI Fixtures** (`tests/fixtures/pages.fixture.ts`)

```typescript
test('ui example', async ({ pages }) => {
  // Page objects provided for UI tests
});
```

---

### **2. Database User Verification System**

The framework automatically verifies test users exist in the database before tests run.

#### **Files Involved**

| File | Purpose |
|------|---------|
| [core/data/users.json](core/data/users.json) | Test user definitions |
| [core/db/dbseed.ts](core/db/dbseed.ts) | Verification functions (`userExists()`, `verifyUser()`) |
| [tests/fixtures/test.fixture.ts](tests/fixtures/test.fixture.ts) | `ensureUserExists` fixture uses dbseed |

#### **How It Works**

```
Feature Step: "Given user 'systemAdmin' is authenticated"
  ↓
Step Implementation calls: ensureUserExists('systemAdmin')
  ↓
Fixture loads user from core/data/users.json: { id: 10752, username: "sys_admin_test" }
  ↓
dbseed.verifyUser() queries: SELECT 1 FROM users WHERE id = 10752
  ↓
If found: ✅ Return user data, continue test
If NOT found: ❌ Throw error, fail test immediately
```

#### **User Configuration** (`core/data/users.json`)

```json
{
  "systemAdmin": { "id": 10752, "username": "sys_admin_test", "envKey": "SYS_ADMIN" },
  "areaAdminCandidate": { "id": 1002, "username": "area_admin_10", "envKey": "AREA_ADMIN" },
  "areaAdmin11": { "id": 1003, "username": "area_admin_11", "envKey": "AREA_ADMIN1" },
  "regularUser": { "id": 1004, "username": "regular_user", "envKey": "REGULAR_USER" }
}
```

---

### **3. Workflow Organization Pattern**

All feature-specific code lives in `workflows/` organized consistently:

```
workflows/schd-group/
├── api/                          # API layer
│   ├── endpoints.ts              # URL constants
│   └── schd-group.api.ts         # Request builders
│
├── data/                          # Test data
│   └── payloads.json             # Request payload templates
│
├── db/                            # Data layer
│   ├── queries/
│   │   └── schedulingGroup.queries.ts    # Reusable SQL query methods
│   └── seed/
│       └── db.seed.ts            # Setup/teardown, transactions
│
└── invariants/                    # Business rules
    ├── api.invariants.ts         # API response assertions
    ├── db.invariants.ts          # Database assertions
    └── permission.invariants.ts  # Access control assertions
```

**Benefits:**
- ✅ All code for a feature in one place
- ✅ Easy to reuse across tests
- ✅ Clear separation of concerns
- ✅ Scales with new features

---

## 🧪 Test Organization

### **Database Tests** (`tests/api_db/db/*.db.spec.ts`)

**Purpose:** Verify database directly without browser or API

**Key Characteristics:**
- No HTTP calls
- No browser
- Direct SQL queries
- Fast execution
- Transaction isolation (auto-rollback)
- Permission model validation

#### **Test 1: Permission-Based Access Control** 

**File:** [tests/api_db/db/mock-schd-group-create.db.spec.ts](tests/api_db/db/mock-schd-group-create.db.spec.ts)

**Scenarios Tested:**

1. **System Admin Creates Group (ID: 19)**
   - ✅ System Admin can access the group
   - ✅ Area Admin from different division CANNOT access the group

2. **Area Admin Creates Group (ID: 24)**
   - ✅ System Admin can access the group (always)
   - ✅ Area Admin (creator, ID: 10769) can access their own group
   - ✅ Area Admin from different division CANNOT access the group

**Permission Rules Validated:**
- System Admin (UR_RoleID = 1): Can access ALL groups (area = NULL)
- Area Admin (UR_RoleID = 2+): Can access only groups in their division
- Creator Rule: User who created the group can always access it

```typescript
test('area admin from News (creator) can access the group', async ({ db, ensureUserExists }) => {
  // 1. Verify area admin exists in database
  const areaAdmin = await ensureUserExists('areaAdmin_News');
  
  // 2. Query scheduling group (ID: 24 created by this area admin)
  const row = await SchedulingGroupQueries.getByIdForUser(db, 24, areaAdmin.id);
  
  // 3. Verify group exists and is accessible
  expect(row).toBeTruthy();
  expect(row.SchedulingGroupsID).toBe(24);
  expect(row.SchedulingGroupsName).toBe('Area_Shekhar_POC');
  
  // 4. Verify creator ID matches
  expect(row.CreatedBy).toBe(10769); // areaAdmin_News ID
});
```

#### **Test 2: Direct Database Query with User Validation**

**File:** [tests/api_db/db/smoke-connection.db.spec.ts](tests/api_db/db/smoke-connection.db.spec.ts)

**Purpose:** Verify direct SQL queries and user role-based data retrieval

**Scenario:** Get scheduling groups created by areaAdmin_News (ID: 10769, Role: 2)

```typescript
test('Get scheduling groups created by areaAdmin_News', async ({ db, ensureUserExists }) => {
  // 1. Verify user exists
  const areaAdmin = await ensureUserExists('areaAdmin_News');
  
  // 2. Query using JOINs across UserRoles, SchedulingGroups, Divisions, UserDetails
  const result = await db.request()
    .input('userId', 10769)
    .input('roleId', 2)
    .input('divisionName', 'News')
    .query(`
      SELECT 
        g.SchedulingGroupsID, g.SchedulingGroupsName, r.UR_UserID, 
        r.UR_SchedulingTeamID, r.UR_DivisionId, r.UR_RoleID,
        u.UD_DisplayName, d.DivisionName, u.UD_NetLogin, d.DivisionID
      FROM UserRoles r 
      INNER JOIN SchedulingGroups g ON r.UR_UserID = g.CreatedBy 
      INNER JOIN Divisions d ON d.DivisionID = g.DivisionID
      INNER JOIN UserDetails u ON r.UR_UserID = u.UD_UserID
      WHERE r.UR_UserID = @userId AND r.UR_RoleID = @roleId 
        AND d.DivisionName = @divisionName
        AND r.UR_EndDate >= CAST(GETDATE() AS DATE)
    `);
  
  // 3. Verify results
  expect(result.recordset.length).toBeGreaterThan(0);
  expect(result.recordset[0]).toHaveProperty('SchedulingGroupsID');
  expect(result.recordset[0]).toHaveProperty('UD_NetLogin', 'pandec01');
});
```

**Key Validations:**
- User exists in database
- Role-based filtering (Area Admin = Role 2)
- Division-based filtering (News division)
- Active role verification (UR_EndDate >= TODAY)
- Username confirmation (pandec01 = areaAdmin_News)

### **API/Integration Tests** (`tests/api_db/features/*.feature` + `.steps.ts`)

**Purpose:** End-to-end testing with API calls and database verification

**Flow:**
```
Feature (Gherkin) → Steps (Given-When-Then) → Fixtures → API Calls → DB Verification
```

**Key Characteristics:**
- HTTP API calls (authenticated)
- Database verification
- Business logic validation
- Transaction isolation
- Clear Given-When-Then structure

**Example:** [tests/api_db/features/NP035/NP035.01_create.feature](tests/api_db/features/NP035/NP035.01_create.feature)

### **UI Tests** (`tests/ui/features/*.feature` + `tests/ui/page/` + `.steps.ts`)

**Purpose:** Browser-based UI automation and interaction testing

**Pattern:**
```
Feature File → Page Object Model (selectors) → Step Implementations → Browser Actions
```

**Key Characteristics:**
- Page Object Model for maintainability
- Browser automation (Chromium)
- Visual validation
- User workflow testing

---

## 🔐 Authentication

Tests need to authenticate with the application. The `authenticateAs` fixture handles this:

```typescript
test('authenticated api call', async ({ apiClient, authenticateAs, ensureUserExists }) => {
  // 1. Verify user exists
  const user = await ensureUserExists('systemAdmin');
  
  // 2. Authenticate (adds auth headers automatically)
  await authenticateAs(user.id);
  
  // 3. All subsequent API calls include auth
  const response = await apiClient.post('/scheduling-groups', payload);
});
```

---

## 🧪 Writing a Database Test

### **Anatomy of a Database Test**

```typescript
test('database test example', async ({ db, ensureUserExists }) => {
  // Step 1: Verify prerequisite user exists
  const user = await ensureUserExists('systemAdmin');
  
  // Step 2: Query the database
  const row = await SchedulingGroupQueries.getById(db, 19);
  
  // Step 3: Assert record exists
  expect(row).toBeTruthy();
  
  // Step 4: Assert field values
  expect(row.SchedulingGroupsName).toBe('Test_Ankur_Group');
  expect(row.SchedulingGroupsID).toBe(19);
  
  // Step 5: Validate business logic
  assertNotes(row, 'Created for POC, Editing');
});

// Auto-cleanup: Transaction rolls back after test completes
```

### **Key Concepts**

| Concept | What It Does | Why |
|---------|-------------|-----|
| **Transaction** | Groups all DB changes; rolls back after test | Prevents tests from interfering |
| **ensureUserExists** | Verifies test user in database | Catches missing prerequisites early |
| **Query Helpers** | Reusable database methods | Avoid duplicating SQL |
| **Invariants** | Business rule validations | Centralize business logic |

### **Test Execution Timing**

```
Before Test:
  ✅ Database connection established
  ✅ START TRANSACTION (isolation begins)

During Test:
  ✅ Run query → Get data → Assert values

After Test (auto-cleanup):
  ✅ ROLLBACK TRANSACTION (undo all changes)
  ✅ Close connection
  ✅ Report result (PASS/FAIL)
```

---

## 🏗️ Patterns & Best Practices

### **1. Query Helpers with Permission Logic** (Reusable Database Methods)

**Location:** `workflows/schd-group/db/queries/schedulingGroup.queries.ts`

#### **Permission-Based Query Example**

The `getByIdForUser()` method demonstrates how to implement role-based access control in database queries:

```typescript
static async getByIdForUser(
  db: sql.ConnectionPool,
  groupId: number,
  userId: number
) {
  // Step 1: Fetch group with division information
  const group = await db.request()
    .input('groupId', sql.Int, groupId)
    .query(`
      SELECT g.*, d.DivisionName
      FROM SchedulingGroups g
      LEFT JOIN Divisions d ON d.DivisionID = g.DivisionID
      WHERE g.SchedulingGroupsID = @groupId
    `);
  
  if (!group) return undefined;
  
  // Step 2: Creator always has access
  if (group.CreatedBy === userId) {
    return group;
  }
  
  // Step 3: Check user's division against group's division
  const userArea = await this.getUserArea(db, userId);
  
  // System Admin: userArea is NULL (can access all)
  // Area Admin: userArea is DivisionName (must match)
  if (userArea === null || group.DivisionName === userArea) {
    return group;
  }
  
  // No permission
  return undefined;
}

static async getUserArea(
  db: sql.ConnectionPool,
  userId: number
): Promise<string | null> {
  const result = await db.request()
    .input('userId', sql.Int, userId)
    .query(`
      SELECT TOP 1 d.DivisionName, r.UR_RoleID
      FROM UserRoles r
      INNER JOIN Divisions d ON d.DivisionID = r.UR_DivisionId
      WHERE r.UR_UserID = @userId
      AND r.UR_EndDate >= CAST(GETDATE() AS DATE)
      ORDER BY r.UR_EndDate DESC
    `);
  
  if (result.recordset.length === 0) return null;
  
  const record = result.recordset[0];
  
  // System Admin (UR_RoleID = 1): Returns NULL for universal access
  if (record.UR_RoleID === 1) return null;
  
  // Area Admin: Returns their division name
  return record.DivisionName;
}
```

#### **Permission Algorithm**

```
getByIdForUser(groupId, userId)
  |
  ├─ Fetch group with division
  │
  ├─ If group not found → Return undefined
  │
  ├─ If user is creator (CreatedBy === userId)
  │   └─ ✅ Return group (creator always has access)
  │
  ├─ Get user's area/division
  │
  ├─ If user is System Admin (area = NULL)
  │   └─ ✅ Return group (system admin can see all)
  │
  ├─ If user's division matches group's division
  │   └─ ✅ Return group (area admin can see their area)
  │
  └─ Else
      └─ ❌ Return undefined (no permission)
```

**Instead of:**
```typescript
// Raw SQL in every test (❌ Don't do this)
const result = await db.request()
  .input('id', 19)
  .query('SELECT * FROM SchedulingGroups WHERE SchedulingGroupsID = @id');
```

**Do This:**
```typescript
// Reusable query method with permission checks (✅ Better)
const row = await SchedulingGroupQueries.getByIdForUser(db, 19, userId);
```

**Benefits:**
- Single source of truth for queries
- Permission logic centralized and testable
- Easy to update if schema changes
- Readable, self-documenting code
- Prevents unauthorized data access

### **2. Invariants** (Business Logic Assertions)

**Location:** `workflows/schd-group/invariants/`

**Instead of:**
```typescript
// Repeated assertions (❌ Don't do this)
expect(row.notes).toContain('Created for POC');
expect(row.status).not.toBe('Deleted');
expect(row.createdBy).toBe('systemAdmin');
```

**Do This:**
```typescript
// Centralized business rules (✅ Better)
assertNotes(row, 'Created for POC');
assertNotDeleted(row);
assertCreatedBy(row, 'systemAdmin');
```

**Benefits:**
- Business logic in one place
- Easy to understand intent
- Consistency across tests
- Single update point

### **3. Test Data Organization**

**Location:** `workflows/schd-group/data/`

```typescript
// payloads.json - Reusable request templates
export const schedulingGroupPayloads = {
  createBySystemAdmin: () => ({
    name: 'Test_Ankur_Group',
    notes: 'Created for POC, Editing'
  }),
  minimal: (areaId) => ({
    name: `Group_${areaId}`
  })
};

// Use in tests:
const payload = schedulingGroupPayloads.createBySystemAdmin();
await apiClient.post('/scheduling-groups', payload);
```

---

## 📝 Running Tests

### **Development Commands**

```bash
# Run UI tests in headed mode (see browser)
npm run uitest

# Run API/DB integration tests
npm run integratedtest

# Run database tests only
npm run dbtest

# Run all tests
npm run all
```

### **Manual Playwright Commands**

```bash
# Run all tests with default settings
npx bddgen && npx playwright test

# Run specific project
npx playwright test --project=ui
npx playwright test --project=api_db

# Run with filtered tags
npx playwright test --grep @smoke
npx playwright test --grep @api_db

# Run tests with headed browser
npx playwright test --headed

# Run in specific browser
npx playwright test --project=chromium

# Generate feature-spec files
npx bddgen

# Show test report
npx playwright show-report

# Debug mode (interactive)
npx playwright test --debug
```

---

## 🔄 Complete API/DB Test Flow

### **Database Permission Test Flow**

```
Test: "Area Admin from News (creator) can access the group"
    ↓
Step 1: Verify Prerequisite
    ├─ Call: ensureUserExists('areaAdmin_News')
    ├─ Query: SELECT * FROM users WHERE username = 'pandec01'
    ├─ Result: { id: 10769, role: 2, division: 'News' }
    └─ Continue if found, else fail
    ↓
Step 2: Query Group with Permission Check
    ├─ Call: SchedulingGroupQueries.getByIdForUser(db, 24, 10769)
    ├─ Query 1: Fetch group
    │   └─ SELECT g.*, d.DivisionName 
    │       FROM SchedulingGroups g LEFT JOIN Divisions d 
    │       WHERE g.SchedulingGroupsID = 24
    │  
    ├─ Query 2: Check creator rule
    │   └─ if (group.CreatedBy === 10769) → ✅ Access granted (return group)
    │
    └─ Result: Group object returned with division info
    ↓
Step 3: Assertions
    ├─ expect(row).toBeTruthy() → ✅ Group exists
    ├─ expect(row.SchedulingGroupsID).toBe(24)
    ├─ expect(row.SchedulingGroupsName).toBe('Area_Shekhar_POC')
    └─ expect(row.CreatedBy).toBe(10769)
    ↓
Cleanup (automatic):
    ├─ ROLLBACK transaction
    ├─ Close database connection
    └─ Report test result: ✅ PASSED
```

### **API/Integration Test Flow**

```
Feature File (.feature)
    ↓
Scenario: "System Admin creates a Scheduling Group"
    ↓
Step 1 (Given): User is authenticated
    ├─ Call: ensureUserExists('systemAdmin')
    ├─ DB Query: SELECT * FROM users WHERE id = 10752
    ├─ Result: ✅ User found → Continue
    └─ Result: ❌ User NOT found → Test fails
    ↓
Step 2 (When): POST request to create scheduling group
    ├─ Build payload from test data
    ├─ Call API with auth headers
    ├─ Capture response & created ID
    └─ Return to test
    ↓
Step 3 (Then): Verify record in database
    ├─ Query database using ID from response
    ├─ Assert record exists (not null)
    ├─ Assert all field values
    └─ Run business logic invariants
    ↓
Cleanup (automatic):
    ├─ ROLLBACK transaction
    ├─ Close database connection
    └─ Report test result
```

---

## 🚀 Environment Setup

### **.env File**

Create a `.env` file in the root directory:

```properties
# Database Configuration
DB_SERVER=localhost
DB_DATABASE=testdb
DB_USER=sa
DB_PASSWORD=YourPassword

# API Configuration
API_BASE_URL=http://localhost:3000

# UI Configuration
UI_BASE_URL=http://localhost:3000
```

---

## 📋 Configuration Files

| File | Purpose | Status |
|------|---------|--------|
| [playwright.config.ts](playwright.config.ts) | Playwright projects, timeouts, reporters (HTML only) | ✅ Active |
| [tsconfig.json](tsconfig.json) | TypeScript compilation settings | ✅ Active |
| [package.json](package.json) | NPM dependencies and scripts | ✅ Updated - Allure removed |
| `.env` | Environment variables (create this, don't commit) | 📝 Required |

**Recent Changes (Feb 24, 2026):**
- ✅ Removed `allure-playwright` dependency
- ✅ Removed Allure reporter from `playwright.config.ts`
- ✅ Test reports now use Playwright's HTML reporter only
- ✅ Run `npm run report` to view HTML reports

---

## 🧪 Test Data & User Scenarios

### **Test Users**

| Alias | User ID | Role | Division | Username | Purpose |
|-------|---------|------|----------|----------|---------|
| `systemAdmin` | 10752 | System Admin (1) | - (NULL) | sys_admin_test | Full access to all groups |
| `areaAdmin_News` | 10769 | Area Admin (2) | News | pandec01 | Access to News division groups |
| `areaAdmin_Sports` | - | Area Admin (2) | Sports | - | Different division - cannot access News |

### **Test Scenarios**

#### **Scenario 1: Scheduling Group Created by System Admin**
- **Group ID:** 19
- **Group Name:** Test_Ankur_Group
- **Created By:** systemAdmin (10752)
- **Tests:**
  - ✅ System Admin can access
  - ✅ Area Admin from News cannot access (different creator)

#### **Scenario 2: Scheduling Group Created by Area Admin**
- **Group ID:** 24
- **Group Name:** Area_Shekhar_POC
- **Created By:** areaAdmin_News (10769)
- **Division:** News
- **Tests:**
  - ✅ System Admin can access (system admin can see all)
  - ✅ areaAdmin_News can access (creator and same division)
  - ✅ areaAdmin_Sports cannot access (different division)

#### **Scenario 3: Direct SQL Query Validation**
- **Query:** Get groups created by areaAdmin_News with role & division filters
- **Joins:** UserRoles → SchedulingGroups → Divisions → UserDetails
- **Validations:**
  - User exists and has active role
  - Role is Area Admin (ID: 2)
  - Division is News
  - Role has not expired (UR_EndDate >= TODAY)

---

## 🎓 Learning Path

**New to this framework?** Follow these steps:

1. **Understand the structure** → Read this README
2. **See a simple test** → Look at [tests/api_db/db/mock-schd-group-create.db.spec.ts](tests/api_db/db/mock-schd-group-create.db.spec.ts)
3. **See a feature test** → Look at [tests/api_db/features/NP035/NP035.01_create.feature](tests/api_db/features/NP035/NP035.01_create.feature)
4. **See step implementations** → Check [tests/api_db/steps/NP035/schd_grp_create.steps.ts](tests/api_db/steps/NP035/schd_grp_create.steps.ts)
5. **See workflow structure** → Review [workflows/schd-group/](workflows/schd-group/) for API/DB/Invariants organization
6. **Write a test** → Create feature + steps using existing patterns as guides

---

## ✅ Best Practices Summary

### **DO** ✅

- ✅ Use fixtures for all test dependencies
- ✅ Verify prerequisites with `ensureUserExists`
- ✅ Use reusable query helpers from workflows
- ✅ Centralize business logic in invariants
- ✅ Store test data in workflows for reuse
- ✅ Use Page Object Model for UI selectors
- ✅ Write clear, descriptive test names
- ✅ Test permission logic explicitly (who can access what)
- ✅ Use parameterized queries to prevent SQL injection
- ✅ Validate user roles and divisions in tests

### **DON'T** ❌

- ❌ Write raw SQL directly in tests
- ❌ Hardcode test data in step files
- ❌ Mix UI selectors into step definitions
- ❌ Skip prerequisite verification
- ❌ Duplicate assertions across tests
- ❌ Run tests with `--workers > 1` if DB tests exist
- ❌ Commit `.env` files or secrets to repository
- ❌ Test with hardcoded user IDs; use fixtures instead
- ❌ Assume database state; always verify prerequisites

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "User X not found in database" | Ensure test user exists in database before running tests |
| "Expected null to be truthy" | Check query parameters; verify record actually exists |
| "Expected 'X' but got 'Y'" | Verify test data and database state before assertion |
| "Cannot find module '@workflows/..'" | Check path aliases in `tsconfig.json` |
| Transaction timeout | Increase timeout in `playwright.config.ts` or optimize queries |
| Tests fail in parallel | Use `--workers=1` for sequential execution |
| API auth failing | Verify `authenticateAs` implementation in fixtures |
| Port already in use | Check if another test instance is running |

### **Recent Fixes (Feb 24, 2026)**

#### **Permission Query Fix**

**Issue:** `getByIdForUser()` was using incorrect column names

**Original (Broken):**
```typescript
// ❌ Wrong column names
if (group.CreatedByUserId === userId) { ... }  // Should be: CreatedBy
if (group.area === userArea) { ... }            // Should be: DivisionName
```

**Fixed:**
```typescript
// ✅ Correct column names
if (group.CreatedBy === userId) { ... }
if (group.DivisionName === userArea) { ... }
```

**Impact:** Permission-based group access tests now pass correctly

---

## 📚 Resources

- [Playwright Official Docs](https://playwright.dev/)
- [Playwright BDD GitHub](https://github.com/vitalets/playwright-bdd)
- [Gherkin Syntax Guide](https://cucumber.io/docs/gherkin/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MSSQL Node.js Driver](https://github.com/tediousjs/node-mssql)

---

## 👤 Contributing

When adding new tests:

1. Create feature file in appropriate folder:
   - UI tests: `tests/ui/features/NPxxx/`
   - API/DB tests: `tests/api_db/features/NPxxx/`

2. Add BDD tag: `@ui` or `@api_db`

3. Implement step definitions in corresponding `steps/NPxxx/` folder

4. For UI: Use Page Object Model in `tests/ui/page/NPxxx/`

5. Store reusable code in `workflows/feature-name/`:
   - API endpoints in `api/`
   - Test data in `data/`
   - DB queries in `db/queries/`
   - Assertions in `invariants/`

6. Import and use reusable components in tests

---

**Last Updated**: February 24, 2026  
**Framework**: Playwright BDD  
**Node Version Required**: 18+ (verify with `node --version`)

---

## 📝 Changelog

### **February 24, 2026**

#### **New Tests Added**

1. **smoke-connection.db.spec.ts** - Direct SQL Query Validation
   - Tests multi-table JOIN queries (UserRoles → SchedulingGroups → Divisions → UserDetails)
   - Validates role-based data filtering (Area Admin from News division)
   - Confirms active role validation (UR_EndDate >= TODAY)
   - User: areaAdmin_News (ID: 10769, Role: 2, Username: pandec01)

2. **mock-schd-group-create.db.spec.ts** - Permission Model Validation
   - Scenario 1: System Admin creates group (ID: 19) - Area Admin cannot access
   - Scenario 2: Area Admin creates group (ID: 24) - Tests creator access and division-based access control
   - Validates System Admin has universal access (NULL division)
   - Validates Area Admin has division-scoped access

#### **Fixes & Improvements**

1. **SchedulingGroupQueries.getByIdForUser() - Column Name Corrections**
   - Fixed: `CreatedByUserId` → `CreatedBy` (matches actual table column)
   - Fixed: `group.area` → `group.DivisionName` (division info from JOIN)
   - Added Division JOIN to fetch DivisionName for access control checks
   - Permission logic now works correctly for all roles

2. **Package & Configuration Cleanup**
   - Removed: `allure-playwright` dependency (npm package)
   - Removed: Allure reporter from `playwright.config.ts`
   - Updated: `all:report` script to use Playwright HTML reporter
   - Benefit: Simplified dependency tree, faster npm installations

#### **Documentation Updates**

- Added detailed permission algorithm in Query Helpers section
- Documented test data and user scenarios (System Admin vs Area Admin vs Sports Admin)
- Created permission-based test flow diagram
- Added changelog section (this file)
- Enhanced best practices with permission testing guidance

#### **Test Statistics**

- **Active Tests**: 3 (2 scenarios in mock-schd-group-create + 1 in smoke-connection)
- **Database Tests**: 2 test files
- **Permission Rules Tested**: 4 (System Admin universal, Area Admin division-scoped, Creator access, Negative permissions)
- **Users Involved**: systemAdmin, areaAdmin_News, areaAdmin_Sports

#### **Files Modified**

```
✅ tests/api_db/db/smoke-connection.db.spec.ts (new test added)
✅ tests/api_db/db/mock-schd-group-create.db.spec.ts (updated test IDs & activated tests)
✅ workflows/schd-group/db/queries/schedulingGroup.queries.ts (fixed column names)
✅ package.json (removed allure-playwright)
✅ playwright.config.ts (removed allure-playwright reporter)
✅ README.md (this file - documentation updates)
```

