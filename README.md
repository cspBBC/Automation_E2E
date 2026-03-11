# E2E Test Automation Framework

---

## 🔧 Getting Started

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd Automation_E2E
```

### **2. Install Dependencies**
```bash
npm install
```

This will install all required packages including:
- **Playwright** - Browser automation framework
- **Cucumber/BDD** - Behavior-driven development testing
- **TypeScript** - Type-safe JavaScript
- **dotenv** - Environment configuration management
- Other dependencies listed in `package.json`

### **3. Configure Environment Variables**
Create `.env` files in the root directory for your environments:

```
.env.dev        ← DEV environment configuration
.env.systest    ← SYSTEST/STAGING environment configuration
```

**Required variables in each `.env` file:**
```
UI_BASE_URL=https://your-dev-url.com
API_BASE_URL=https://your-api-dev-url.com
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
SYS_ADMIN_PASSWORD=your_password
AREA_ADMIN_PASSWORD=your_password
```

### **4. Execute Tests**

#### Quick Start
```bash
npm run test              # Run UI + API tests (SYSTEST environment)
npm run test:dev         # Run UI + API tests (DEV environment)
```

#### Run Specific Test Types
```bash
npm run uidevtest        # UI tests only (DEV)
npm run uisystesttest    # UI tests only (SYSTEST)
npm run apitest          # API tests only (DEV)
npm run apitest:systest  # API tests only (SYSTEST)
```

#### CI/CD Pipeline
```bash
npm run test:ci          # Full automated test suite for CI/CD
```

#### View Test Reports
```bash
npm run report           # Open HTML test report in browser
```

---

# UI Test Execution Flow

---

## 🚀 Test Execution Commands

This framework supports **UI tests** and **API tests** running independently or together. Use the commands below based on your needs.

### **Local Testing**

#### UI Tests Only
```bash
npm run uidevtest        # Run UI tests with DEV environment (headed browser)
npm run uisystesttest    # Run UI tests with SYSTEST environment (headed browser)
```

#### API Tests Only
```bash
npm run apitest          # Run API tests with DEV environment (headless)
npm run apitest:systest  # Run API tests with SYSTEST environment (headless)
```

#### Both UI + API Tests
```bash
npm run test:dev         # Run UI + API tests with DEV environment
npm run test:systest     # Run UI + API tests with SYSTEST environment (default)
npm run test             # Same as test:systest
```

### **Continuous Integration (CI)**
```bash
npm run test:ci          # Full automated test suite (GitHub Actions)
                         # Runs both API + UI tests in SYSTEST environment
                         # No headed browser, parallel workers
```

### **View Test Reports**
```bash
npm run report           # Open HTML test report in browser
```

---

## 📋 Command Reference Table

| Command | Test Type | Environment | Mode | Use Case |
|---------|-----------|-------------|------|----------|
| `npm run uidevtest` | UI only | DEV | Headed | Quick UI testing locally |
| `npm run uisystesttest` | UI only | SYSTEST | Headed | Pre-release UI validation |
| `npm run apitest` | API only | DEV | Headless | API development & testing |
| `npm run apitest:systest` | API only | SYSTEST | Headless | API pre-release validation |
| `npm run test:dev` | UI + API | DEV | Headed (UI) | Full suite with dev config |
| `npm run test:systest` | UI + API | SYSTEST | Headed (UI) | Full suite with staging config |
| `npm run test` | UI + API | SYSTEST | Headed (UI) | Default full test run |
| `npm run test:ci` | UI + API | SYSTEST | Headless | GitHub Actions automation |

---

## 🔧 How It Works - Environment & Test Type

### **Environment Selection**
The framework loads environment-specific configuration from `.env` files:

```
.env.dev        ← Used by `*:dev` commands (DEV environment)
.env.systest    ← Used by default/`:systest` commands (STAGING environment)
```

**Environment files contain:**
- `UI_BASE_URL` - Website URL
- `API_BASE_URL` - API endpoint
- `DB_HOST`, `DB_USER`, `DB_PASSWORD` - Database credentials
- User credentials - `SYS_ADMIN_PASSWORD`, `AREA_ADMIN_PASSWORD`, etc.

### **Test Type Selection**
Environment variable `TEST_TYPE` controls which tests are processed:

```
TEST_TYPE=ui    ← Processes ONLY tests/ui/ folder
TEST_TYPE=api   ← Processes ONLY tests/integrated/ folder
```

This prevents cross-contamination: UI tests don't load API fixtures and vice versa.

### **Execution Flow**

```
1. npm run uidevtest
   ↓
2. package.json script sets: ENVIRONMENT=dev TEST_TYPE=ui
   ↓
3. playwright.config.ts:
   - Loads .env.dev (DEV configuration)
   - Displays: "✅ STARTING UI TESTS | 📍 Environment: DEV | 🌐 Base URL: <dev-url>"
   - Processes ONLY tests/ui/features & tests/ui/steps
   ↓
4. bddgen generates test files
   ↓
5. Playwright runs tests with dev configuration
   - Browser: Chrome (headed - visible)
   - URL: From .env.dev
   - Credentials: From .env.dev
```

---

## 📊 Local vs CI Differences

### **Local Testing** (`npm run test:dev` / `npm run test:systest`)
```
✅ Headed browser (you see the tests running)
✅ Single worker (easier to debug)
✅ Screenshots & videos on failure
✅ Manual environment selection
❌ Slower execution
❌ Requires UI interaction
```

### **CI Testing** (`npm run test:ci` in GitHub Actions)
```
✅ Fully automated (no user interaction needed)
✅ Multiple workers (faster execution)
✅ Runs on every push/PR automatically
✅ Test reports uploaded as artifacts
✅ No headed browser (headless = faster)
❌ Environment fixed to SYSTEST
❌ Requires repo secrets for credentials
```

---

## 🔐 CI/CD Setup

### **GitHub Actions Workflow**
File: `.github/workflows/ci.yml`

Triggers on:
- ✅ Push to `main` or `develop` branch
- ✅ Pull requests to `main` or `develop`

What it does:
1. Checks out code
2. Installs Node.js & dependencies
3. Runs `npm run test:ci` (both API + UI tests)
4. Uploads HTML report as artifact
5. Publishes test report

### **Required GitHub Secrets**
Add these to your GitHub repo Settings → Secrets & variables:

```
DB_HOST              # Database server
DB_PASSWORD          # Database password
SYS_ADMIN_PASSWORD   # Admin user password
AREA_ADMIN_PASSWORD  # Area admin password
API_BASE_URL         # API endpoint URL
UI_BASE_URL          # Website URL
```

Then update `.github/workflows/ci.yml` to use them (see comments in file).

---

## 💡 Which Command Should I Use?

### **I'm developing UI tests locally:**
```bash
npm run uidevtest     # Quick feedback with DEV environment
```

### **I'm developing API tests locally:**
```bash
npm run apitest       # Headless API testing with DEV
```

### **I'm testing the full feature locally before committing:**
```bash
npm run test:dev      # Run both UI + API with DEV
```

### **I want to verify on staging environment before merge:**
```bash
npm run test:systest  # Full suite with SYSTEST configuration
```

### **The CI/CD pipeline will run automatically:**
```bash
# No manual command needed
# Triggered on: git push / PR
# Command runs: npm run test:ci
```

---

## 📝 Detailed Test Execution Flow

```powershell
npm run schdtest:systest
```

**File involved:** `package.json`

```json
"schdtest:systest": "cross-env ENVIRONMENT=systest npm run schdtest",
"schdtest": "npx bddgen && npx playwright test --project=uitest --grep @schdTeamUI --headed"
```

**What happens:**
- Sets environment to `systest`
- Runs `bddgen` to generate test files from feature files
- Runs Playwright test with chrome browser

---

## Step 2: Feature File - Define What to Test

**File:** `tests/ui/features/NP035/schedulinggroup_create.feature`

```gherkin
@schdTeamUI @smoke @ui
Feature: Scheduling Group CRUD

  Scenario: Sys Admin creates and manages a scheduling group
    Given user 'systemAdmin' is on Show Scheduled Group page
    When user creates a new scheduling group using test data from "schdGroupData"
    Then the scheduling group should be visible in the list
```

**What happens:**
- Feature file defines test scenario in plain English
- Playwright-BDD matches each step to corresponding step definition function

---

## Step 3: Step Definition - Implement Test Logic

**File:** `tests/ui/steps/NP035/schedulinggroup_create.steps.ts`

```typescript
Given('user {string} is on Show Scheduled Group page', async ({ loginAs, scheduledGroupPage }, userAlias: string) => {
  await loginAs(userAlias);  // ← Login as systemAdmin
  await scheduledGroupPage.open();  // ← Navigate to page
  console.log(`User '${userAlias}' navigated to Show Scheduled Group page`);
});

When('user creates a new scheduling group using test data from {string}', async ({ scheduledGroupPage }, filename: string) => {
  await scheduledGroupPage.createScheduledGroup(filename);  // ← Create group
  console.log(`Scheduling Group creation initiated with test data from: ${filename}.json`);
});

Then('the scheduling group should be visible in the list', async ({ scheduledGroupPage }) => {
  await scheduledGroupPage.verifyScheduledGroupExists();  // ← Verify
  console.log('Scheduling Group verified in the list');
});
```

**What happens:**
- Step 1 (`Given`): Calls fixture function `loginAs('systemAdmin')`
- Step 2 (`When`): Calls page object method `createScheduledGroup('schdGroupData')`
- Step 3 (`Then`): Calls page object method `verifyScheduledGroupExists()`

---

## Step 4: Login with Fixture

**File:** `tests/fixtures/pages.fixture.ts`

```typescript
loginAs: async ({ page }, use) => {
  await use(async (userAlias: string) => {
    const users = loadUsers();  // ← Load from core/data/users.json
    const user = users[userAlias];  // ← Get systemAdmin object
    
    const envUsername = getCredentialFromEnv(`SYSTEST_${userAlias.toUpperCase()}_USERNAME`);
    const password = getCredentialFromEnv(`SYSTEST_${userAlias.toUpperCase()}_PASSWORD`) 
                  || getPassword(user.envKey);  // ← Get from .env.systest
    
    const urlWithAuth = `${url.protocol}//${username}:${password}@${url.host}${url.pathname}`;
    
    await page.goto(urlWithAuth);  // ← Navigate with embedded credentials
    console.log(`Authenticating user: ${username}`);
  });
}
```

**What happens:**
- Loads user details: `systemAdmin` → `patans01` (username)
- Gets password from environment or `.env.systest`
- Creates URL with embedded credentials
- Navigates to base URL with authentication

**Data source:** `core/data/users.json`
```json
{
  "systemAdmin": {
    "id": 10773,
    "roleid": 1,
    "username": "patans01",
    "area": null,
    "envKey": "SYS_ADMIN_PASSWORD"
  }
}
```

---

## Step 5: Open Scheduling Group Page

**File:** `tests/ui/page/NP035/ScheduledGroupPage.ts`

```typescript
export class ScheduledGroupPage {
  constructor(private page: Page) { }

  async open() {
    await this.page.goto('/mvc-app/admin/scheduling-group');  // ← Navigate to page
  }
}
```

**What happens:**
- Navigates to `/mvc-app/admin/scheduling-group`
- Page object encapsulates all scheduling group interactions

---

## Step 6: Create Scheduling Group - Load Test Data

**File:** `workflows/schedulingGroup/data/schdGroupData.json`

```json
{
  "divisionid": {
    "type": "dropdown",
    "value": "5",
    "label": "Media Operations"
  },
  "group_name": {
    "type": "text",
    "value": "Test Scheduling Group_0015"
  },
  "allocations_menu": {
    "type": "dropdown",
    "value": "0",
    "label": "No"
  },
  "notes": {
    "type": "textarea",
    "value": "This is a test scheduling group created for UI automation testing purposes."
  },
  "submit-create-scheduling-form": {
    "type": "button",
    "value": "Submit"
  }
}
```

**Used by:** `ScheduledGroupPage.createScheduledGroup(filename)`

---

## Step 7: Create Scheduling Group - Fill Form

**File:** `tests/ui/page/NP035/ScheduledGroupPage.ts`

```typescript
async createScheduledGroup(filename: string = 'schdGroupData') {
  await this.page.getByRole('button', { name: 'Add Scheduling Group' }).click();  // ← Click button
  await this.page.locator('#facebox').waitFor({ state: 'visible' });  // ← Wait for modal
  
  const jsonData = await readJSON(`workflows/schedulingGroup/data/${filename}.json`);  // ← Load data
  
  // Generate unique group name
  const randomNum = Math.floor(Math.random() * 99) + 1;
  jsonData['group_name'].value = `Test Scheduling Group_${randomNum}`;
  
  await this.fill(jsonData);  // ← Fill form with data
}

async fill(formData: Record<string, FormField>) {
  this.formData = formData;
  await fillForm(this.page, formData);  // ← Call form filler utility
}
```

**What happens:**
- Clicks "Add Scheduling Group" button
- Waits for modal dialog
- Loads test data from JSON
- Generates unique group name
- Calls `fillForm()` utility to fill all fields

---

## Step 8: Fill Form Fields - Use Utility

**File:** `tests/utils/formFiller.ts`

```typescript
export async function fillForm(page: Page, formData: Record<string, FormField>) {
  for (const [fieldId, field] of Object.entries(formData)) {
    const { type, value } = field;
    
    console.log(`Filling field: ${fieldId} (type: ${type})`);
    
    switch (type) {
      case "text":
      case "number":
      case "textarea":
        await fillTextField(page, fieldId, String(value));  // ← Fill: group_name, notes
        break;
      case "dropdown":
        const isChosenDropdown = await page.locator(`#${fieldId}_chosen`).count() > 0;
        if (isChosenDropdown) {
          await selectChosenDropdown(page, fieldId, value as string);  // ← Select: divisionid, allocations_menu
        }
        break;
      case "button":
        await page.locator(`#${fieldId}`).click();  // ← Click: submit-create-scheduling-form
        break;
    }
  }
}
```

**What happens:**
- Iterates through all fields in `schdGroupData.json`
- Each field type (dropdown, text, textarea, button) is handled differently
- For dropdowns: finds and selects option by value
- For text: fills field with data
- For button: clicks to submit

---

## Step 9: Verify Scheduling Group Exists

**File:** `tests/ui/page/NP035/ScheduledGroupPage.ts`

```typescript
async verifyScheduledGroupExists() {
  if (!this.formData) throw new Error('Form data not loaded');
  const groupName = this.formData['group_name'].value as string;
  
  // Check if group name appears in table
  const groupRow = this.page.locator(`text=${groupName}`);
  await expect(groupRow).toBeVisible();  // ← Assert group is visible
  
  console.log(`Verified presence of scheduling group: ${groupName}`);
}
```

**What happens:**
- Uses stored form data to get created group name
- Searches for group name in page
- Asserts element is visible
- Test passes if group found, fails if not

---

## Complete Execution Summary

| Step | File | Function | Action |
|------|------|----------|--------|
| 1 | `package.json` | `schdtest:systest` | Run test command |
| 2 | `.feature` | Scenario | Define test steps |
| 3 | `.steps.ts` | `Given/When/Then` | Map steps to code |
| 4 | `pages.fixture.ts` | `loginAs()` | Login user |
| 5 | `ScheduledGroupPage.ts` | `open()` | Navigate to page |
| 6 | `schdGroupData.json` | - | Load test data |
| 7 | `ScheduledGroupPage.ts` | `createScheduledGroup()` | Open modal, fill form |
| 8 | `formFiller.ts` | `fillForm()` | Fill all fields |
| 9 | `ScheduledGroupPage.ts` | `verifyScheduledGroupExists()` | Verify creation |

---

## Files Directory Structure

```
tests/
├── ui/
│   ├── features/
│   │   └── NP035/
│   │       └── schedulinggroup_create.feature
│   ├── page/
│   │   └── NP035/
│   │       └── ScheduledGroupPage.ts
│   └── steps/
│       └── NP035/
│           └── schedulinggroup_create.steps.ts
├── fixtures/
│   └── pages.fixture.ts
└── utils/
    └── formFiller.ts

workflows/
└── schedulingGroup/
    └── data/
        └── schdGroupData.json

core/
└── data/
    └── users.json
```

---

## Key Concepts

- **Feature File**: Describes what to test in plain English
- **Step Definition**: Implements each step (Given/When/Then)
- **Page Object**: Encapsulates interactions with a page
- **Fixture**: Provides reusable test setup (login, pages)
- **Form Filler**: Generic utility to fill different field types
- **Test Data**: JSON file with all form values to fill
- **Users File**: Stores user credentials and role information

---

# API Test Execution Flow

This section explains how API tests execute using the **Scheduling Group View** API as an example.

---

## API Test Setup

**Run Command:**
```powershell
npm run dbtest
```

**File:** `package.json`
```json
"dbtest": "npx playwright test --project=db"
```

---

## API Test Structure

**File:** `tests/integrated/db/schedulingGroupSP.db.spec.ts`

```typescript
import { test, expect } from '@fixtures/test.fixture';
import { SchedulingGroupSP } from '@workflows/schd-group/db/sp/schedulingGroup.sp';
import { SchedulingGroupQueries } from '@workflows/schd-group/db/queries/schedulingGroup.queries';

test('create scheduling group via SP', async ({ db }) => {
  // Test input parameters
  const inputParamsForSP = {
    AreaId: 12,
    GroupName: 'SP Test Group',
    AllocationsMenu: 1,
    Notes: 'created via sp',
    UserId: 10752
  };

  // Step 1: Call Stored Procedure
  const result = await SchedulingGroupSP.create(inputParamsForSP);
  expect(result).toBeDefined();

  // Step 2: Verify in Database
  const dbRow = await SchedulingGroupQueries.getByName(db, inputParamsForSP.GroupName);
  expect(dbRow).toBeTruthy();
});
```

**What happens:**
1. Import fixture with `db` connection
2. Define test input parameters
3. Call stored procedure via `SchedulingGroupSP.create()`
4. Verify result exists
5. Query database to confirm creation
6. Assert 200 response + data in DB

---

## API File Structure

**File:** `workflows/schedulingGroup/api/view.api.ts`

```typescript
import { APIRequestContext } from '@playwright/test';
import { apiGet } from '../../../core/api/apiClient';

const viewEndpoints = {
  list: '/api/scheduling-groups',
  getById: (id: number | string) => `/api/scheduling-groups/${id}`,
  listByArea: (areaId: number) => `/api/scheduling-groups?area=${areaId}`,
  getHistory: (id: number | string) => `/api/scheduling-groups/${id}/history`,
} as const;

export const viewAPI = {
  // List all Scheduling Groups
  list: (api: APIRequestContext, areaId?: number) => {
    const endpoint = areaId 
      ? viewEndpoints.listByArea(areaId)
      : viewEndpoints.list;
    return apiGet(api, endpoint);
  },

  // Get single Scheduling Group by ID
  getById: (api: APIRequestContext, id: number) => {
    return apiGet(api, viewEndpoints.getById(id));
  },

  // Get Scheduling Group history/audit trail
  getHistory: (api: APIRequestContext, id: number) => {
    return apiGet(api, viewEndpoints.getHistory(id));
  },
} as const;
```

**What it provides:**
- Centralized API endpoints
- Reusable functions for each operation
- Type-safe API calls via Playwright

---

## Stored Procedure Wrapper

**File:** `workflows/schedulingGroup/db/sp/schedulingGroup.sp.ts`

```typescript
export class SchedulingGroupSP {
  static async create(params: {
    AreaId: number;
    GroupName: string;
    AllocationsMenu: number;
    Notes: string;
    UserId: number;
  }) {
    // Call stored procedure: sp_CreateSchedulingGroup
    return executeSp('sp_CreateSchedulingGroup', params);
  }
}
```

**What it does:**
- Wraps database stored procedures
- Type-safe parameter passing
- Returns proc execution result

---

## Database Query Wrapper

**File:** `workflows/schedulingGroup/db/queries/schedulingGroup.queries.ts`

```typescript
export class SchedulingGroupQueries {
  static async getByName(db: Connection, groupName: string) {
    return db.request()
      .input('GroupName', groupName)
      .query(`SELECT * FROM SchedulingGroups WHERE GroupName = @GroupName`);
  }

  static async getUserArea(db: Connection, userId: number) {
    return db.request()
      .input('UserId', userId)
      .query(`SELECT DivisionId FROM Users WHERE UserId = @UserId`);
  }
}
```

**What it does:**
- Encapsulates SQL queries
- Type-safe result assertions
- Reusable across tests

---

## API Test Execution Summary

| Step | File | Function | Action |
|------|------|----------|--------|
| 1 | `package.json` | `dbtest` | Run test command |
| 2 | `.spec.ts` | `test()` | Define test |
| 3 | `.sp.ts` | `create()` | Call stored procedure |
| 4 | `.queries.ts` | `getByName()` | Verify in database |
| 5 | `test.fixture.ts` | `db` | Provide DB connection |

---

## API vs DB vs UI Tests Comparison

| Aspect | UI Tests | API Tests | DB Tests |
|--------|----------|-----------|----------|
| **File** | `.feature` + `.steps.ts` | `.spec.ts` | `.spec.ts` |
| **What tests** | User interface | API endpoints | Database queries |
| **Framework** | Playwright-BDD + Playwright | Playwright | Playwright |
| **Runtime** | 11 seconds | 2 seconds | 1 second |
| **Command** | `npm run schdtest:systest` | `npm run dbtest` | `npm run dbtest` |
| **Data** | JSON files | Direct API calls | Direct DB exec |
| **Assertion** | Page visibility | Status code + response | DB rows |

---

## Test Fixture - Database Connection

**File:** `tests/fixtures/test.fixture.ts`

```typescript
export const test = baseTest.extend<{
  db: Connection;
}>({
  db: async ({}, use) => {
    // Connect to database
    const connection = await createConnection({
      server: process.env.DB_SERVER,
      database: process.env.DB_NAME,
      authentication: {
        type: 'default',
        options: {
          userName: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
        },
      },
    });

    await use(connection);

    // Close connection after test
    await connection.close();
  },
});
```

**What it provides:**
- Database connection for all tests
- Auto-close after test completes
- Env-based configuration

---

## Running All Tests

```powershell
# UI tests only
npm run schdtest:systest

# DB/API tests only
npm run dbtest

# All tests
npx playwright test
```

---

## Project Files Structure - API & DB

```
tests/
├── integrated/
│   ├── db/
│   │   ├── schedulingGroupSP.db.spec.ts      ← DB tests
│   │   └── mock-schd-group-create.db.spec.ts
│   ├── features/
│   │   └── NP035/
│   │       └── NP035.01_view.feature         ← API scenarios (commented)
│   └── steps/
│       └── NP035/
│           └── schd_grp_view.steps.ts        ← API step definitions (commented)
└── fixtures/
    └── test.fixture.ts                       ← DB connection provider

workflows/
└── schedulingGroup/
    ├── api/
    │   └── view.api.ts                       ← API endpoint wrappers
    └── db/
        ├── sp/
        │   └── schedulingGroup.sp.ts        ← Stored proc wrappers
        └── queries/
            └── schedulingGroup.queries.ts   ← SQL query wrappers

core/
├── api/
│   └── apiClient.ts                         ← HTTP client
└── db/
    └── connection.ts                        ← DB connection setup
```
