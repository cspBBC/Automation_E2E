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
├── README.md                           # This file - Documentation
├── package.json                        # NPM dependencies and scripts
├── playwright.config.ts                # Playwright & BDD configuration
├── tsconfig.json                       # TypeScript configuration
│
├── core/                               # Core utilities and infrastructure
│   ├── api/
│   │   └── apiClient.ts               # HTTP client wrapper for API requests
│   └── db/
│       ├── connection.ts              # MSSQL database connection pool
│       └── queries.ts                 # Common database query helpers
│
├── tests/                              # All test files organized by type
│   ├── api_db/                        # API & Database integration tests
│   │   ├── db/                        # Pure database tests (no browser)
│   │   │   ├── mock-schd-group-create.db.spec.ts
│   │   │   └── smoke-connection.db.spec.ts
│   │   ├── features/                  # Gherkin feature files for API tests
│   │   │   └── NP035/
│   │   │       └── NP035.01_create.feature  # Scheduling group creation scenario
│   │   └── steps/                     # Step implementations for API_DB tests
│   │       └── NP035/
│   │           └── schd_grp_create.steps.ts
│   │
│   ├── ui/                            # UI (Browser) tests
│   │   ├── features/                  # Gherkin feature files for UI tests
│   │   │   ├── NP001/
│   │   │   │   └── facility_booking.feature   # Facility CRUD scenarios
│   │   │   └── NP035/
│   │   │       └── scheduling-groups.feature  # Scheduling groups UI scenarios
│   │   ├── page/                      # Page Object Model - UI element interactions
│   │   │   ├── NP001/
│   │   │   │   └── FacilityPage.ts   # Facility page UI actions & assertions
│   │   │   └── NP035/
│   │   ├── steps/                     # Step implementations for UI tests
│   │   │   ├── NP001/
│   │   │   │   └── facility_booking.steps.ts
│   │   │   └── NP035/
│   │   │       └── scheduling-groups.steps.ts
│   │
│   ├── fixtures/                      # Shared test setup & fixtures
│   │   ├── pages.fixture.ts          # UI page objects fixture for UI tests
│   │   ├── test.fixture.ts           # API client + DB fixtures for API_DB tests
│   │   ├── correlation.fixture.ts    # Request correlation IDs
│   │   └── db.fixture.ts             # Database connection fixture
│   │
│   ├── types/                         # TypeScript interfaces and types
│   │   └── formField.ts              # Form field type definitions
│   └── utils/                         # Utility functions for tests
│       ├── formFiller.ts             # Dynamic form filling logic
│       └── readJson.ts               # JSON file reading helpers
│
├── workflows/                          # Business logic and test data
│   ├── facilities/                    # Facility management workflows
│   │   ├── api/                       # API endpoints for facilities
│   │   ├── data/                      # Test data JSON files
│   │   │   ├── facilityFormData.json
│   │   │   ├── facilityFormData_area_admin.json
│   │   │   └── facilityFormData_system_admin.json
│   │   ├── db/                        # Database operations for facilities
│   │   └── invariants/                # Business rule validations
│   │
│   └── schd-group/                    # Scheduling group workflows
│       ├── api/
│       │   ├── endpoints.ts           # API endpoint definitions
│       │   └── schd-group.api.ts      # API request builders
│       ├── data/
│       │   ├── payloads.ts            # Request payload builders
│       │   ├── schedulingGroupData.json
│       │   └── users.json             # Test user credentials
│       ├── db/
│       │   ├── queries/
│       │   │   └── schedulingGroup.queries.ts  # Database query methods
│       │   └── seed/
│       │       └── db.seed.ts         # Database seeding & transaction management
│       └── invariants/
│           ├── api.invariants.ts      # API response validations
│           ├── db.invariants.ts       # Database record validations
│           └── permission.invariants.ts # Permission/access control validations
│
├── playwright-report/                 # Test execution reports
│   └── index.html                     # HTML test results
└── test-results/                      # Test artifacts
    └── screenshots/, videos, traces/  # Failed test recordings
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

## 🔄 How Tests Work Together

### **UI Test Flow**
```
Feature File (.feature)
    ↓
BDD Scenario: "User creates a facility"
    ↓
Step 1 (Given): fixture provides page object → navigate to page
Step 2 (When): page object fills form → submit
Step 3 (Then): page object verifies success
    ↓
Screenshot/Video on failure → test-results/
```

### **API/DB Test Flow**
```
Feature File (.feature)
    ↓
BDD Scenario: "System Admin creates Scheduling Group"
    ↓
Step 1 (Given):
    ├── Fixture provides DB connection
    ├── Seed test data (areas, users)
    └── Start transaction
Step 2 (Given):
    ├── Fixture provides apiClient
    └── Authenticate user with X-User-Id header
Step 3 (When):
    ├── Build request payload from step data table
    └── POST to API endpoint
Step 4 (Then):
    ├── Verify HTTP status == 201
    ├── Extract created ID from response
    └── Query database to verify record created
    ↓
Cleanup: Auto-rollback DB transaction
    ↓
Report: Pass/Fail
```

---

## 🎯 Test Categories

### **1. DB Tests** (`*.db.spec.ts`)
- **No browser** - Direct database access
- **No API** - SQL queries only
- **Purpose**: Verify database connectivity, table structure, data integrity
- **Command**: `npm run dbtest`

### **2. UI Tests** (`@ui` tag)
- **Browser required** - Chromium automation
- **Page Object Model** - Reusable selectors
- **Purpose**: Test user workflows, form interactions, visual validation
- **Command**: `npm run uitest`
- **Mode**: `--headed` for development (see browser), headless in CI

### **3. API/DB Tests** (`@api_db` tag)
- **API calls** - REST endpoint testing
- **Database verification** - Verify data persistence
- **User verification** - Automated user validation before test runs
- **Test isolation** - Transaction rollback cleanup
- **Purpose**: E2E integration testing
- **Command**: `npm run integratedtest`

---

## 🧪 Database User Verification

The framework automatically verifies test users exist in the database before tests run.

### **Core Files**
- `core/db/dbseed.ts` - User verification utilities
- `core/data/users.json` - Test user definitions
- `tests/fixtures/test.fixture.ts` - Fixture that uses verification

### **User Configuration** (`core/data/users.json`)

```json
{
  "systemAdmin": { "id": 10752, "username": "sys_admin_test", "envKey": "SYS_ADMIN" },
  "areaAdminCandidate": { "id": 1002, "username": "area_admin_10", "envKey": "AREA_ADMIN" },
  "areaAdmin11": { "id": 1003, "username": "area_admin_11", "envKey": "AREA_ADMIN1" },
  "regularUser": { "id": 1004, "username": "regular_user", "envKey": "REGULAR_USER" }
}
```

### **How User Verification Works**

**Step 1: Feature File**
```gherkin
Given user 'systemAdmin' is authenticated
```

**Step 2: Step Definition** (`tests/api_db/steps/NP035/schd_grp_create.steps.ts`)
```typescript
Given('user {string} is authenticated', async ({ authenticateAs, ensureUserExists }, userAlias: string) => {
  // Verify user exists in database first
  const user = await ensureUserExists(userAlias);
  
  // Then authenticate
  await authenticateAs(user.id);
});
```

**Step 3: Fixture** (`tests/fixtures/test.fixture.ts`)
```typescript
ensureUserExists: async ({ db }, use) => {
  await use(async (userAlias: string) => {
    // Load user from users.json
    const user = usersData[userAlias];
    
    // Verify user exists in database using dbseed utility
    await verifyUser(db, user);
    return user;
  });
}
```

**Step 4: Database Verification** (`core/db/dbseed.ts`)
```typescript
// Verifies user exists in database
export async function verifyUser(pool: sql.ConnectionPool, user: UserData): Promise<void> {
  const exists = await userExists(pool, user.id);
  
  if (!exists) {
    throw new Error(`User ${user.id} (${user.username}) not found in database`);
  }
}
```

### **Test Execution Flow**

```
BDD Scenario: "System Admin creates Scheduling Group"
    ↓
Given user 'systemAdmin' is authenticated
    ├── Load: systemAdmin from users.json (ID: 10752)
    ├── Verify: Query database SELECT * FROM users WHERE id = 10752
    ├── If found: ✅ Proceed to authentication
    └── If NOT found: ❌ Throw error "User 10752 not found in database"
    ↓
Authenticate: Set Authorization header with user credentials
    ↓
When/Then: Execute API calls and database assertions
```

### **Before Each Test Runs**

```
✅ Database connection established
  ↓
✅ User alias resolved from users.json
  ↓
✅ Database query verifies user exists
  ↓
❌ If user missing → Test fails immediately with clear error
  ✓ If user found → Test proceeds with authentication
```

### **API Test Example**

```typescript
test('creates scheduling group and validates DB state', async ({ db, ensureUserExists }) => {
  // Verify system admin exists and get ID
  const user = await ensureUserExists('systemAdmin');
  const systemAdminId = user.id;
  
  // Now safe to proceed knowing user exists in database
  console.log('Using system admin ID:', systemAdminId);
  
  // ... rest of test
});
```

---

## 🧪 Writing a Database Test - Step by Step

This section explains how to write database tests using the framework. Perfect for beginners!

### **Test File Example: `mock-schd-group-create.db.spec.ts`**

```typescript
/**
 * DB-DRIVEN TEST EXAMPLE
 * 
 * TEST PURPOSE:
 * - Verify that a Scheduling Group can be read from database
 * - Validate all database fields have correct values
 * - Ensure business rules (invariants) are satisfied
 */
```

### **What is a Database Test?**

A database test is a **test that verifies data directly in the database** without using a browser or API.

| Test Type | Purpose | Access |
|-----------|---------|--------|
| **DB Test** | Verify data integrity | Direct SQL queries |
| **API Test** | Verify API logic | HTTP requests |
| **UI Test** | Verify user workflows | Browser automation |

---

### **Step 1: Understand Fixtures**

**What are Fixtures?**

Fixtures are **dependencies automatically provided by the test framework** before each test runs.

```typescript
test('my test', async ({ db, ensureUserExists }) => {
  //                        ↓ ↓ These are FIXTURES
  // ...
});
```

**Fixtures Used in DB Tests:**

```
1. "db" fixture
   └─ What: Database connection pool
   └─ Created: Automatically before test starts
   └─ Special: Runs in TRANSACTION (changes auto-rollback)
   └─ Cleanup: Automatically after test ends

2. "ensureUserExists" fixture
   └─ What: Function to verify user exists in database
   └─ How it works:
      ├─ Takes user alias: 'systemAdmin'
      ├─ Loads from: core/data/users.json → ID: 10752
      ├─ Queries: SELECT * FROM users WHERE id=10752
      ├─ If found: ✅ Returns {id, username}
      └─ If NOT: ❌ Throws error
   └─ Why: Ensure test prerequisites are met
```

---

### **Step 2: Verify User Exists**

```typescript
const user = await ensureUserExists('systemAdmin');
const systemAdminId = user.id;

console.log('Using system admin ID:', systemAdminId);
```

**What Happens:**

1. **Load User Definition**
   ```json
   // core/data/users.json
   {
     "systemAdmin": { "id": 10752, "username": "sys_admin_test", "envKey": "SYS_ADMIN" }
   }
   ```

2. **Query Database**
   ```sql
   SELECT 1 FROM users WHERE id = 10752
   ```

3. **Result**
   - ✅ If found: test continues with user data
   - ❌ If NOT found: test fails immediately with error

**Why?** Database might not have test users set up yet. This catches missing prerequisite data early.

---

### **Step 3: Query Database**

```typescript
const schdGrpCreatedID = 19;  // ID to search for
const row = await SchedulingGroupQueries.getById(db, schdGrpCreatedID);
```

**What This Does:**

1. **Calls Query Helper**
   - Location: `workflows/schd-group/db/queries/schedulingGroup.queries.ts`
   - Why: Reusable, maintainable, avoids raw SQL

2. **Executes SQL Behind the Scenes**
   ```sql
   SELECT * FROM SchedulingGroups WHERE SchedulingGroupsID = 19
   ```

3. **Returns Object or Null**
   ```typescript
   // If found:
   {
     SchedulingGroupsID: 19,
     SchedulingGroupsName: 'Test_Ankur_Group',
     SchedulingGroupsNotes: 'Created for POC, Editing',
     ...
   }
   
   // If NOT found:
   null
   ```

**Why Use Query Helper Instead of Raw SQL?**
- ✅ Reusable: Use same query in many tests
- ✅ Maintainable: If columns change, update one place
- ✅ Readable: `getById()` clearer than SELECT statement
- ✅ Error handling: Handles null/errors automatically

---

### **Step 4: Assert Record Exists**

```typescript
expect(row).toBeTruthy();
```

**What This Checks:**

| Check | Meaning | If Fails |
|-------|---------|----------|
| `row !== null` | Record was found | "Expected null to be truthy" |
| `row !== undefined` | Record is defined | "Expected undefined to be truthy" |
| Record has data | Row is not empty | "Expected [] to be truthy" |

**Error Message if Fails:**
```
Expected null to be truthy
→ Means: Database query returned no results
→ Debug: Check if record ID is correct
```

---

### **Step 5: Assert Field Values**

```typescript
expect(row.SchedulingGroupsID).toBe(schdGrpCreatedID);
expect(row.SchedulingGroupsName).toBe(name);
```

**Check 1: ID Matches**
```typescript
expect(row.SchedulingGroupsID).toBe(19)
// If fails: "Expected 20 but got 19"
// Means: Wrong record was returned
```

**Check 2: Name Matches**
```typescript
expect(row.SchedulingGroupsName).toBe('Test_Ankur_Group')
// If fails: "Expected 'Old_Name' but got 'Test_Ankur_Group'"
// Means: Database has wrong value (data corruption)
```

**Pattern to Remember:**
```typescript
expect(actual_from_database).toBe(expected_value)
```

---

### **Step 6: Business Logic Validation (Invariants)**

```typescript
assertNotes(row, 'Created for POC, Editing');
```

**What is an Invariant?**

An **invariant** is a **business rule that MUST ALWAYS be true**.

| Rule | Example | Validates |
|------|---------|-----------|
| Database field | "Notes field must exist" | Schema/format |
| Business rule | "Notes must contain 'Created for POC'" | Business logic |

**How assertNotes Works:**

1. **Locate Function**
   - File: `workflows/schd-group/invariants/db.invariants.ts`

2. **Execute Check**
   ```typescript
   // Inside assertNotes():
   expect(row.SchedulingGroupsNotes).toContain('Created for POC, Editing')
   ```

3. **Result**
   - ✅ If contains text: test passes
   - ❌ If missing: test fails

**Why Separate Function?**

```typescript
// Instead of repeating in every test:
expect(row.notes).toContain('Created for POC');  // Test 1
expect(row.notes).toContain('Created for POC');  // Test 2
expect(row.notes).toContain('Created for POC');  // Test 3

// Use imported function:
assertNotes(row, 'Created for POC');  // All tests

// Benefits:
// ✅ Reusable across tests
// ✅ Centralized business logic
// ✅ Easy to update all tests at once
// ✅ Self-documenting (clear intent)
```

---

### **Complete Test Execution Flow**

```
═══════════════════════════════════════════════════
  STEP 1: BEFORE TEST RUNS
═══════════════════════════════════════════════════
  ✅ Framework creates database connection pool ('db' fixture)
  ✅ Framework starts database TRANSACTION
     └─ Any changes will automatically rollback after test
  ✅ Framework prepares other fixtures (apiClient, etc.)

═══════════════════════════════════════════════════
  STEP 2: DURING TEST EXECUTION
═══════════════════════════════════════════════════
  ✅ Verify user 'systemAdmin' exists in database
     └─ Query: SELECT 1 FROM users WHERE id=10752
     
  ✅ Query scheduling group record
     └─ Query: SELECT * FROM SchedulingGroups WHERE id=19
     
  ✅ Assert record exists (not null)
  ✅ Assert ID matches expected value
  ✅ Assert name matches expected value
  ✅ Run business logic validation (invariants)

═══════════════════════════════════════════════════
  STEP 3: IF ASSERTION FAILS
═══════════════════════════════════════════════════
  ❌ Test stops immediately at failed assertion
  ❌ Shows error message: "Expected X but got Y"
  ❌ Records screenshot/video (if enabled)
  ❌ Marks test as FAILED

═══════════════════════════════════════════════════
  STEP 4: IF ALL PASS OR AFTER FAILURE
═══════════════════════════════════════════════════
  ✅ Framework rolls back database transaction
     └─ All test changes are UNDONE
     └─ Database returns to clean state
     └─ Prevents tests from interfering
     
  ✅ Framework closes database connection
  
  ✅ Test result reported: PASS or FAIL
  ✅ Results saved to: playwright-report/

═══════════════════════════════════════════════════
```

**Why Transaction & Rollback?**

```
Test 1 inserts 5 records
  ↓
Transaction rolls back
  ↓
Test 2 starts with clean database ✅
  └─ No leftover data from Test 1

✅ Tests don't interfere with each other
✅ Database stays clean for next test
✅ Test order doesn't matter
```

---

### **Typical Issues and Solutions**

| Error | Cause | Solution |
|-------|-------|----------|
| "Expected null to be truthy" | Record not found | Check ID/query parameters |
| "Expected 'X' but got 'Y'" | Wrong field value | Verify data was created correctly |
| "User 10752 not found in database" | User missing | Seed user in database first |
| "Cannot find module" | Import path wrong | Check path aliases in tsconfig.json |
| Transaction timeout | Test takes too long | Increase timeout, optimize queries |

---

### **Next Steps: Add API Call**

Current flow only **reads** from database (data already exists).

**To test full flow** (create + verify):

```typescript
test('create and verify scheduling group', 
  async ({ db, ensureUserExists, apiClient, authenticateAs }) => {
    
    // 1️⃣ Verify user exists
    const user = await ensureUserExists('systemAdmin');
    
    // 2️⃣ Authenticate
    await authenticateAs(user.id);
    
    // 3️⃣ CALL API TO CREATE (new step)
    const payload = {
      name: 'Test_Ankur_Group',
      notes: 'Created for POC, Editing'
    };
    const response = await apiClient.post('/scheduling-groups', payload);
    const createdId = response.id;
    
    // 4️⃣ Verify via database (read)
    const row = await SchedulingGroupQueries.getById(db, createdId);
    expect(row).toBeTruthy();
    assertNotes(row, 'Created for POC, Editing');
});
```

**Benefits of Full Flow:**
- ✅ Tests API → Database integration
- ✅ Catches bugs in API data handling
- ✅ Ensures database persistence
- ✅ Real-world test scenario

---

## 🔐 Authentication Flow

Located in `tests/fixtures/test.fixture.ts`:

```typescript
// AuthenticatedApiClient wrapper
├── Purpose: Automatically include auth headers with every API request
├── Implementation: Header-based (currently X-User-Id)
│
└── Supported methods (uncomment as needed):
    ├── Bearer Token (JWT)
    ├── Basic Auth (username:password)
    └── API Key headers
```

---

## 📝 Running Tests

### **Development** (Local machine)
```bash
# Run UI tests in headed mode (see browser)
npm run uitest

# Run API/DB integration tests
npm run integratedtest

# Run database tests only
npm run dbtest
```

### **CI/CD Environment** (Headless)
```bash
# Run all tests sequentially, headless, with extended timeout
npm run all
```

### **Manual Command Examples**
```bash
# Run all tests with default settings
npx bddgen && npx playwright test

# Run specific project
npx playwright test --project=ui

# Run with filtered tags
npx playwright test --grep @smoke

# Generate feature-spec files
npx bddgen

# Show test report
npx playwright show-report
```

---
    ├── Login endpoint (get token first)
    └── Custom headers (X-User-Id, etc.)
```

---

## 🗄️ Database Transaction Management

Tests that modify data use **transactions** for isolation:

```typescript
Given: applySeed(db) + startTransaction(db)
├── Seed test data (areas, users, teams)
└── START TRANSACTION - begin isolation

Then: Verify data created
└── Assertions pass

Cleanup (auto in fixture):
├── ROLLBACK TRANSACTION - undo all changes
└── Database returns to clean state
```

**Benefit**: Tests don't interfere with each other. Each test starts fresh.

---

## 📊 Test Data Organization

### **Static Test Data** (`workflows/*/data/`)
```json
// users.json - Test user credentials
{
  "systemAdmin": { "id": 1001, "role": "SystemAdmin" },
  "areaAdmin": { "id": 1002, "role": "AreaAdmin", "area": "10" }
}

// payloads.ts - Request builders
export const schedulingGroupPayloads = {
  create: {
    systemAdminFull: () => ({ /* full payload */ }),
    minimal: (areaId) => ({ /* minimal payload */ })
  }
}
```

### **Dynamic Test Data** (Inside step)
```typescript
// Feature file data table becomes step parameter
When the user submits a POST request with:
  | name | area | allocations_menu |
  | SG_Test | 10 | true |

// Step receives DataTable
async ({ apiClient }, dataTable: DataTable) => {
  const payload = dataTable.rowsHash(); // Convert to object
  await apiClient.post(endpoint, payload);
}
```

---

## ✅ Page Object Model (POM) Pattern

**Location**: `tests/ui/page/NP001/FacilityPage.ts`

**Purpose**: Centralize UI selectors and element interactions.

**Benefits**:
- ✅ Easy maintenance - change selector in one place
- ✅ Reusable - methods called from multiple tests
- ✅ Readable - descriptive method names like `createFacility()`

**Example**:
```typescript
class FacilityPage {
  async open() { /* navigate */ }
  async createFacility(filename) { /* fill form & submit */ }
  async verifyFacilityAdded() { /* check table */ }
}
```

---

## 🏷️ BDD Tags

Used to organize and filter tests:

```gherkin
@ui @smoke
Feature: Facility CRUD
  # Runs with: npm run uitest

@api_db
Feature: Scheduling Group Creation
  # Runs with: npm run integratedtest
```

**Tag meanings**:
- `@ui` - Run in UI project (browser)
- `@api_db` - Run in API/DB project (headless)
- `@smoke` - Critical smoke test
- `@slow` - May take longer

---

## 🚀 Environment Variables

**File**: `.env` (create this)

```properties
# API Configuration
API_BASE_URL=http://localhost:3000

# UI Configuration
UI_BASE_URL=http://localhost:3000

# Database Configuration
DB_SERVER=localhost
DB_DATABASE=testdb
DB_USER=sa
DB_PASSWORD=YourPassword
```

---

## 📋 Configuration Files

| File | Purpose |
|------|---------|
| `playwright.config.ts` | Playwright projects, timeouts, reporters |
| `tsconfig.json` | TypeScript compilation settings |
| `package.json` | Dependencies, scripts, metadata |
| `.env` | Secret credentials (not in repo) |
| `.gitignore` | Ignore node_modules, test artifacts |

---

## 🎓 Learning Path

**New to this framework?** Learn in this order:

1. **Understand the structure** → Read this README
2. **See a simple test** → Look at `tests/api_db/features/NP035/NP035.01_create.feature`
3. **Find the implementation** → Check `tests/api_db/steps/NP035/schd_grp_create.steps.ts`
4. **Understand helper code** → Review `workflows/schd-group/api/endpoints.ts`
5. **Write a new test** → Create feature + steps using existing patterns

---

## 🤔 Common Questions

**Q: Why separate UI, API, and DB tests?**  
A: Different concerns. UI tests verify user workflows, API tests verify business logic, DB tests verify data integrity.

**Q: Why Page Object Model?**  
A: When UI changes, update selectors in one place instead of all tests.

**Q: Why transactions?**  
A: Prevent tests from interfering. Each test gets clean database state.

**Q: Why separate steps and pages?**  
A: Steps match feature file language (business), pages handle technical UI details.

**Q: What's playwright-bdd?**  
A: Allows writing tests in Gherkin (Given-When-Then) instead of pure code. More readable for stakeholders.

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| UI test timeout in headless | Increase timeout in `playwright.config.ts` |
| DB transaction error | Check fixture cleanup in `test.fixture.ts` |
| API auth failing | Update `authenticateAs` in `test.fixture.ts` |
| Tests running in parallel fail | Use `--workers=1` for sequential execution |
| Cannot find module | Check path aliases in `tsconfig.json` |

---

## 📚 Resources

- [Playwright Docs](https://playwright.dev/)
- [Playwright BDD](https://github.com/vitalets/playwright-bdd)
- [Gherkin Syntax](https://cucumber.io/docs/gherkin/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 👤 Contribution Guidelines

When adding new tests:

1. Create feature file in appropriate folder (`tests/ui/features/` or `tests/api_db/features/`)
2. Add BDD tag (`@ui` or `@api_db`)
3. Implement steps matching feature sentences
4. Use Page Object Model for UI tests
5. Store test data in `workflows/` for reuse
6. Add documentation in step comments

---

**Last Updated**: February 22, 2026  
**Framework**: Playwright BDD v8.4.2  
**Node Version Required**: 18+ (check with `node --version`)

