# BBC Automation E2E Framework - Complete Developer Guide

## Table of Contents
1. [Setup & Installation](#setup--installation)
2. [Project Architecture Overview](#project-architecture-overview)
3. [Folder Structure & Purpose](#folder-structure--purpose)
4. [Core Concepts & Components](#core-concepts--components)
5. [Detailed UI Test Walkthrough](#detailed-ui-test-walkthrough)
6. [Detailed Integrated (API) Test Walkthrough](#detailed-integrated-api-test-walkthrough)
7. [End-to-End Test Execution Flow](#end-to-end-test-execution-flow)
8. [Running Tests from Console](#running-tests-from-console)
9. [Key Files Reference](#key-files-reference)
10. [Common Workflows](#common-workflows)

---

## Setup & Installation

### Prerequisites
Before starting, ensure you have:
- **Node.js** (v16 or higher) installed
- **npm** package manager
- **Git** for cloning the repository
- **SQL Server** database access (for integrated tests)
- **Test Environment** credentials (usernames, passwords)

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <repository-url> BBC_Automation

# Navigate to the project directory
cd BBC_Automation/E2E_Framework/Automation_E2E
```

### Step 2: Install Dependencies

```bash
# Install all npm packages defined in package.json
npm install

# This installs:
# - Playwright (@playwright/test) - browser automation
# - Playwright-BDD (playwright-bdd) - BDD test framework
# - TypeScript - for type-safe code
# - MSSQL - database connections
# - dotenv - environment variable management
```

### Step 3: Configure Environment Variables

The framework uses environment-specific `.env` files. Create them in the root directory:

```bash
# Create environment-specific files
# .env.dev          (for development environment)
# .env.systest      (for system testing environment)
# .env.staging      (for staging environment)
```

**Example `.env.systest` file:**
```
# UI Application
UI_BASE_URL=https://systest-app.example.com

# API Endpoint
API_BASE_URL=https://api.systest.example.com

# Database Connection
DB_HOST=systest-db-server.example.com
DB_NAME=TestDatabase
DB_USER=sa_user
DB_PASSWORD=your_database_password

# User Credentials (referenced in core/data/users.json)
SYS_ADMIN_PASSWORD=system_admin_password
AREA_ADMIN_PASSWORD=area_admin_password
AREA_ADMIN_1_PASSWORD=area_admin_1_password
```

**Note:** Never commit `.env` files with real passwords to Git. Use `.env.example` as template.

### Step 4: Verify Installation

```bash
# Check if all dependencies are installed correctly
npm list

# Build TypeScript (optional, happens automatically during test)
npm run build
```

### Step 5: Browser Installation (One-time)

Playwright requires browser binaries. Install them:

```bash
# Install Chromium, Firefox, and WebKit browsers
npx playwright install

# Or install specific browser
npx playwright install chromium
```

---

## Project Architecture Overview

This is a **BDD-based (Behavior Driven Development) Test Automation Framework** with the following characteristics:

```
┌─────────────────────────────────────────────────────────────┐
│                    Test Runner (Playwright)                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────┐              ┌────────────────┐         │
│  │  UI Tests      │              │  API Tests     │         │
│  │ (Browser)      │              │ (HTTP)         │         │
│  └────────┬───────┘              └────────┬───────┘         │
│           │                               │                  │
│           └───────────────┬───────────────┘                  │
│                           │                                  │
│           ┌───────────────▼───────────────┐                 │
│           │   BDD Step Definitions         │                 │
│           │  (Gherkin: Given/When/Then)   │                 │
│           └───────────────┬───────────────┘                 │
│                           │                                  │
│        ┌──────────────────┼──────────────────┐              │
│        │                  │                  │              │
│   ┌────▼───┐       ┌──────▼──────┐    ┌─────▼────┐         │
│   │ Page   │       │   Helpers   │    │Database  │         │
│   │Objects │       │   & Utils   │    │Queries   │         │
│   └────────┘       └─────────────┘    └──────────┘         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Key Technologies

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Test Framework** | Playwright-BDD | Write tests in Gherkin (cucumber-like) language |
| **Language** | TypeScript | Type-safe, maintainable code |
| **Assertions** | Playwright expect() | Verify UI and API behaviors |
| **UI Testing** | Playwright Browser | Automate web application testing |
| **API Testing** | Playwright APIRequestContext | Test REST API endpoints |
| **Database** | MSSQL | Verify data persistence and state |
| **Configuration** | dotenv | Manage environment-specific settings |

---

## Folder Structure & Purpose

### Root Level Files

```
.env.systest                    # Environment variables for systest environment
.env.dev                        # Environment variables for dev environment
package.json                    # NPM dependencies and test scripts
playwright.config.ts            # Playwright & BDD configuration
tsconfig.json                   # TypeScript compiler options
```

---

### `/core` - Core Framework Components

**Purpose:** Reusable infrastructure for database, API, and configuration.

```
core/
├── config/
│   └── envConfig.ts              # Load environment variables using loadEnvironment()
│
├── api/
│   └── apiClient.ts              # Enhanced API client with auth headers support
│                                  # Methods: get(), post(), put(), delete()
│                                  # setAuthHeaders(headers) for Basic Auth
│
├── data/
│   └── users.json                # User credentials for test roles (systemAdmin, areaAdmin_News)
│                                  # Format: { "role": { id, username, envKey, ... } }
│
└── db/
    ├── connection.ts             # Database connection pool management
    │                              # getDbPool() - returns SQL connection pool
    │
    ├── dbseed.ts                 # Database initialization and test data setup
    │                              # verifyUser(userId) - confirms user exists
    │
    ├── executeSp.ts              # Execute stored procedures
    │
    └── queries.ts                # Common database queries
```

**Key Files:**

- **`users.json`**: Defines test users with roles, credentials, and IDs
  ```json
  {
    "systemAdmin": { "id": 10773, "username": "patans01", "envKey": "SYS_ADMIN_PASSWORD" },
    "areaAdmin_News": { "id": 10769, "username": "pandec01", "envKey": "AREA_ADMIN_PASSWORD" }
  }
  ```

- **`envConfig.ts`**: Centralizes environment configuration loading
  ```typescript
  const config = loadEnvironment(); // Reads .env.{ENVIRONMENT} file
  // Returns: { environment, apiBaseUrl, uiBaseUrl, dbHost, dbName, ... }
  ```

- **`apiClient.ts`**: Wrapper around Playwright's requestContext for API testing
  ```typescript
  const client = new ApiClient(requestContext);
  client.setAuthHeaders({ 'Authorization': `Basic ${btoa(credentials)}` });
  const response = await client.post('/api/endpoint', { data: payload });
  ```

---

### `/tests` - Test Suites (UI & Integrated/API)

**Purpose:** Contains all test cases organized by type (UI, API) and feature.

```
tests/
├── fixtures/
│   ├── fixture.ts                # API test fixtures (db, apiClient, authenticateAs)
│   │                              # - request: APIRequestContext
│   │                              # - apiClient: Enhanced API client with auth
│   │                              # - db: SQL connection pool
│   │                              # - authenticateAs(userAlias): Sets up Basic Auth
│   │
│   └── pages.fixture.ts           # UI test fixtures (loginAs, testContext)
│                                   # - loginAs(role): Logs in user, returns Page
│                                   # - testContext: Shared data between steps
│
├── integrated/                    # API/Integrated tests (no browser UI)
│   ├── features/
│   │   └── NP035/
│   │       └── allocations_api_edit.feature    # Gherkin scenarios for API tests
│   │
│   └── steps/
│       └── NP035/
│           ├── allocationApi.config.ts         # API configuration (endpoints, actions)
│           ├── allocationApi.helper.ts         # Helper functions for duty operations
│           ├── allocations_api_common.steps.ts # Shared step definitions
│           └── allocations_api_edit.steps.ts   # Specific edit operation steps
│
└── ui/                            # UI tests (browser-based)
    ├── features/
    │   └── NP035/
    │       ├── schedulinggroup_ui_create.feature
    │       ├── schedulinggroup_ui_edit.feature
    │       ├── schedulinggroup_ui_delete.feature
    │       ├── schedulinggroup_ui_history.feature
    │       └── schedulinggroup_ui_permission_boundary.feature
    │
    ├── page/
    │   └── NP035/
    │       └── ScheduledGroupPage.ts             # Page Object Model for Scheduling Group page
    │                                              # Methods: open(), createScheduledGroup(), delete()
    │
    ├── steps/
    │   └── NP035/
    │       ├── schedulinggroup_ui_common.steps.ts    # Shared steps
    │       ├── schedulinggroup_ui_create.steps.ts    # Create operation steps
    │       ├── schedulinggroup_ui_delete.steps.ts    # Delete operation steps
    │       └── ...
    │
    └── utils/
        ├── pageFactory.ts                   # Factory pattern for creating page objects
        ├── formFiller.ts                    # Fill HTML forms dynamically
        ├── formFilledType.ts                # TypeScript types for form fields
        ├── apiHelper.ts                     # API utilities (request context, parameters)
        └── readJson.ts                      # Read JSON test data files
```

**Important Distinctions:**
- **`/ui`**: Tests that interact with browser UI (Selenium-like)
- **`/integrated`**: API tests that have no UI interaction (pure backend testing)

---

### `/workflows` - Test Data & Business Logic

**Purpose:** Centralized location for test data, context management, and business logic helpers.

```
workflows/
│
├── integrated/                                 # API test workflows
│   └── allocations/                            # Duty Allocation module
│       ├── context/
│       │   └── context.ts                      # AllocationContext DTO
│       │                                        # Stores: dutyId, allocationsDutyId, dutyName, etc.
│       │
│       ├── data/
│       │   ├── db/
│       │   │   └── queries/
│       │   │       └── allocations.queries.ts  # Database queries for allocations
│       │   │
│       │   └── requestPayload/
│       │       └── allocationApi_PostParams.json  # API request payload template
│       │                                           # Format: { "duty": {...}, "action": "..." }
│       │
│       └── helpers/
│           └── dutyBuilder.ts                  # Helper functions for duty creation
│                                                # - parseDataTableToMap()
│                                                # - resolveTemplate()
│                                                # - normalizeParameters()
│
└── ui/                                         # UI test workflows
    ├── facility/
    │   ├── context/
    │   │   └── context.ts                      # FacilityContext DTO
    │   └── data/
    │       └── facilityCreate_AreaAdminNewsUIdata.json
    │
    ├── schedulingGroup/
    │   ├── context/
    │   │   └── context.ts                      # SchedulingGroupContext DTO
    │   │                                        # Stores: page, scheduledGroupPage, groupName
    │   │
    │   └── data/
    │       ├── schdGroupCreate_AreaAdminNews_UIdata.json    # Test data for Area Admin
    │       └── schdGroupCreate_SystemAdmin_UIdata.json      # Test data for System Admin
    │
    └── schedulingTeam/
        ├── context/
        │   └── context.ts                      # SchedulingTeamContext DTO
        └── data/
            └── schdTeamCreate_UIdata.json
```

**Key Folders:**

- **`/workflows/{module}/context`**: Defines TypeScript interfaces (DTOs) for sharing data between steps
  - Example: `SchedulingGroupContext` has `{ page, scheduledGroupPage, groupName, ... }`
  - Each test scenario gets one context instance (per-test isolation)

- **`/workflows/{module}/data`**: JSON files containing test data and API payloads
  - UI data: Form field values, expected results
  - API data: Request body templates with `{{paramName}}` placeholders

- **`/workflows/{module}/helpers`**: Business logic and utility functions
  - Parameter parsing, template variable substitution, request building

---

### `/docs` - Documentation

```
docs/
└── NTLM_AUTHENTICATION_APPROACHES.md    # Authentication strategies documentation
```

---

### `/test-results` & `/playwright-report`

```
test-results/                           # Raw test execution results
│                                        # - api/: API test results
│                                        # - ui/: UI test results
│
└── playwright-report/                  # HTML test report
    └── index.html                      # Open this in browser to view detailed report
```

---

## Core Concepts & Components

### Concept 1: BDD (Behavior Driven Development)

Tests are written in **Gherkin language** (Given-When-Then format):

```gherkin
Scenario: User creates a scheduling group
  Given user 'areaAdmin_News' is on the "Scheduled Group" page      # Setup
  When the user creates a new scheduling group using "testData"     # Action
  Then the scheduling group is visible                              # Assertion
```

**Why BDD?**
- Non-technical stakeholders can read and understand tests
- Clear separation between test data and test logic
- Easy to maintain and scale

---

### Concept 2: Fixtures (Test Setup)

Fixtures are **reusable test setup components** provided to every test. Think of them as "prerequisites" that run before each test.

**For API Tests (`fixture.ts`):**
```typescript
// Automatically provided to every API test
{
  request: APIRequestContext,      // Low-level HTTP client
  apiClient: ApiClient,             // Our enhanced wrapper with auth
  db: SQLConnectionPool,            // Database connection
  authenticateAs: Function,         // Login function
  ensureUserExists: Function        // Verify user exists
}
```

**For UI Tests (`pages.fixture.ts`):**
```typescript
// Automatically provided to every UI test
{
  loginAs: Function,                // Login function (returns Page)
  testContext: Object               // Shared data between steps (empty object initially)
}
```

**Example Usage in Test:**
```typescript
When('the user logs in', async ({ loginAs }, role: string) => {
  const page = await loginAs(role);  // Fixture provides loginAs
  // page is now logged-in Playwright Page object
});
```

---

### Concept 3: Page Object Model (POM)

Page Objects represent HTML pages and encapsulate all interactions with them.

**Example: `ScheduledGroupPage.ts`**
```typescript
export class ScheduledGroupPage {
  constructor(private page: Page) { }

  // Encapsulate page navigation
  async open() {
    await this.page.goto('/mvc-app/admin/scheduling-group');
  }

  // Encapsulate business operations
  async createScheduledGroup(filename: string) {
    await this.page.getByRole('button', { name: 'Add Scheduling Group' }).click();
    // ... fill form, submit, etc.
  }

  // Encapsulate assertions
  async verifyScheduledGroupVisible() {
    const groupRow = this.page.locator('table#scheduling-list-table tbody tr');
    await expect(groupRow).toHaveCount(1);
  }
}
```

**Why POM?**
- Maintainability: Selector changes only need updates in one place
- Reusability: Multiple tests can use same page object
- Readability: Test code focuses on "what" not "how"

---

### Concept 4: Test Context (Per-Test Isolation)

Each test gets its own **context object** to share data between steps.

**Example: `SchedulingGroupContext`**
```typescript
interface SchedulingGroupContext {
  page: Page | null;                  // Current browser page
  scheduledGroupPage: any;            // Page object instance
  groupName: string;                  // Group created in this test
  notes: string;                      // Additional test data
}
```

**Usage in Steps:**
```typescript
// Given step: Initialize context
Given('user is on the page', async ({ loginAs, testContext }) => {
  const page = await loginAs('areaAdmin_News');
  const scheduledGroupPage = new ScheduledGroupPage(page);
  testContext.page = page;
  testContext.scheduledGroupPage = scheduledGroupPage;
});

// Then step: Retrieve from context
Then('verify group is created', async ({ testContext }) => {
  const { scheduledGroupPage, groupName } = testContext as SchedulingGroupContext;
  await scheduledGroupPage.verifyGroupVisibleByName(groupName);
});
```

**Benefits:**
- Data isolation: Each test has separate context (no test pollution)
- Step communication: Steps can pass data through context
- Parallel-safe: Multiple tests can run simultaneously

---

### Concept 5: Context DTOs (Data Transfer Objects)

Each module (facility, schedulingGroup, allocations) has a **Context DTO** defining what data is shared.

**Example: `AllocationContext`** (for API tests)
```typescript
interface AllocationContext {
  allocationsDutyId: number | null;      // Captured from DB after creation
  dutyName: string | null;               // Used in edit operations
  dutyId: string | null;                 // Unique duty identifier
  schedulingPersonId: string | null;     // Person assigned
  schedulingTeamId: string | null;       // Team assigned
  dutyDate: string | null;               // Duty date
}
```

**Purpose:**
- Type safety: TypeScript enforces what data exists
- Documentation: Each field explains its purpose
- Contract: Steps agree on what data they exchange

---

### Concept 6: Test Data Management

Test data is stored in **JSON files** with **template variables**.

**Example: `allocationApi_PostParams.json`**
```json
{
  "duty": {
    "DutyName": "{{dutyName|DefaultName}}",
    "DutyID": "{{DutyID|0}}",
    "SchedulingPersonID": "{{SchedulingPersonID|0}}",
    "SchedulingTeamID": "{{SchedulingTeamID|0}}",
    "DutyDate": "{{dutyDate|2026-01-01}}",
    "action": "EDIT"
  }
}
```

**How It Works:**
1. **Template Load**: Load JSON file
2. **Variable Substitution**: Replace `{{paramName|defaultValue}}` with actual values
3. **API Call**: Send filled payload

**Example in Code:**
```typescript
// Load template
let template = loadTestParameters('allocationApi_PostParams.json', 'duty');
// { DutyName: "{{dutyName|DefaultName}}", ... }

// Substitute variables with values from feature file
let payload = resolveTemplate(template, {
  dutyName: 'Duty_New',
  DutyID: '35386',
  // ... other parameters
});
// { DutyName: "Duty_New", DutyID: "35386", ... }

// Send to API
await makeApiRequest('POST', '/api/duty', payload);
```

---

## Detailed UI Test Walkthrough

### Test Scenario: "areaAdmin_News creates a scheduling group"

Located in: [tests/ui/features/NP035/schedulinggroup_ui_create.feature](tests/ui/features/NP035/schedulinggroup_ui_create.feature)

```gherkin
Scenario Outline: <role> creates a scheduling group
  Given user '<role>' is on the "Scheduled Group" page
  When the user creates a new scheduling group using "<testDataFile>"
  Then the scheduling group is visible
  When the user clicks the Delete button for the scheduling group
  Then the delete confirmation popup appears
  And the user approves the deletion
  Then the scheduling group is no longer visible in the list

Examples:
  | role           | testDataFile                        |
  | areaAdmin_News | schdGroupCreate_AreaAdminNews_UIdata |
```

### Step-by-Step Execution

#### **STEP 1: User Logs In** (Given step)

**Gherkin:**
```gherkin
Given user 'areaAdmin_News' is on the "Scheduled Group" page
```

**File:** [tests/ui/steps/NP035/schedulinggroup_ui_common.steps.ts](tests/ui/steps/NP035/schedulinggroup_ui_common.steps.ts)

```typescript
Given("user {string} is on the {string} page", async ({ loginAs, testContext }, role: string, pageName: string) => {
  // 1. Fixture loginAs() logs in the user
  //    - Reads credentials from core/data/users.json for role 'areaAdmin_News'
  //    - Gets password from environment variable AREA_ADMIN_PASSWORD
  //    - Opens browser to UI_BASE_URL with credentials in URL
  //    - Returns logged-in Playwright Page object
  const page = await loginAs(role);

  // 2. Create page object (from Page Object Model pattern)
  const scheduledGroupPage = new ScheduledGroupPage(page);

  // 3. Navigate to Scheduling Group page using page object
  await scheduledGroupPage.open();
  // Opens: https://username:password@systest-app.example.com/mvc-app/admin/scheduling-group

  // 4. Store in testContext for reuse by When/Then steps
  testContext.page = page;
  testContext.scheduledGroupPage = scheduledGroupPage;
  testContext.currentUserAlias = role;

  console.log(`User 'areaAdmin_News' logged in and navigated to Scheduled Group page`);
});
```

**What Happened:**
- Browser opened to application with user credentials
- User authenticated via URL-based credentials (NTLM/Basic Auth)
- Page loaded and waited for network idle
- Page object created to access page interactions

**Console Output:**
```
Authenticating user: pandec01 (areaAdmin_News)
Logged in as role: areaAdmin_News
User 'areaAdmin_News' logged in and navigated to Scheduled Group page
[Context] Initialized for test: areaAdmin_News creates a scheduling group
```

---

#### **STEP 2: Create Scheduling Group** (When step)

**Gherkin:**
```gherkin
When the user creates a new scheduling group using "schdGroupCreate_AreaAdminNews_UIdata"
```

**File:** [tests/ui/steps/NP035/schedulinggroup_ui_create.steps.ts](tests/ui/steps/NP035/schedulinggroup_ui_create.steps.ts)

```typescript
When("the user creates a new scheduling group using {string}", async ({ testContext }, filename: string) => {
  // 1. Retrieve page object from context
  const ctx = testContext as SchedulingGroupContext;
  const scheduledGroupPage = ctx.scheduledGroupPage;

  // 2. ScheduledGroupPage.createScheduledGroup() does the following:
  await scheduledGroupPage.createScheduledGroup(filename);
  //    a) Click "Add Scheduling Group" button
  //    b) Wait for popup dialog (#facebox) to appear
  //    c) Load form data from workflows/ui/schedulingGroup/data/{filename}.json
  //    d) Generate unique group name (using timestamp + random to avoid duplicates)
  //    e) Fill form with data:
  //       - Group Name: Test_SchdGrp_1680123456_7890
  //       - ... other fields from JSON
  //    f) Submit form
  //    g) Store groupName in static variable for later retrieval

  // 3. Retrieve created group name from page object
  const groupName = (scheduledGroupPage.constructor as any).lastCreatedGroupName;
  ctx.groupName = groupName;  // Store in context for Then steps

  console.log(`Created scheduling group using: ${filename}`);
  console.log(`Group name stored in context: "${groupName}"`);
});
```

**Test Data File:** [workflows/ui/schedulingGroup/data/schdGroupCreate_AreaAdminNews_UIdata.json](workflows/ui/schedulingGroup/data/schdGroupCreate_AreaAdminNews_UIdata.json)

```json
{
  "group_name": {
    "selector": "input[name='groupName']",
    "value": "Default_Group",
    "type": "input"
  },
  "description": {
    "selector": "textarea[name='description']",
    "value": "Test scheduling group for Area Admin",
    "type": "textarea"
  },
  "status": {
    "selector": "select[name='status']",
    "value": "Active",
    "type": "select"
  }
}
```

**Form Filling Process** ([tests/utils/formFiller.ts](tests/utils/formFiller.ts)):
```typescript
// For each field in JSON:
// 1. Find HTML element using selector
// 2. Determine field type (input, textarea, select, checkbox, etc.)
// 3. Fill with value using appropriate Playwright method:
//    - input: playgrightPage.fill(selector, value)
//    - select: playgrightPage.selectOption(selector, value)
//    - checkbox: playgrightPage.check(selector)
// 4. Move to next field
// 5. Submit form
```

**What Happened:**
- Dialog popup appeared with form
- Form fields filled with test data
- Unique group name generated and stored
- Form submitted
- Page refreshed showing created group in table

**Console Output:**
```
Generated unique group name: "Test_SchdGrp_1680123456_7890"
Created scheduling group using: schdGroupCreate_AreaAdminNews_UIdata
Group name stored in context: "Test_SchdGrp_1680123456_7890"
```

---

#### **STEP 3: Verify Group Created** (Then step)

**Gherkin:**
```gherkin
Then the scheduling group is visible
```

**File:** [tests/ui/steps/NP035/schedulinggroup_ui_create.steps.ts](tests/ui/steps/NP035/schedulinggroup_ui_create.steps.ts)

```typescript
Then("the scheduling group is visible", async ({ testContext }) => {
  // 1. Retrieve page object and group name from context
  const ctx = testContext as SchedulingGroupContext;
  const scheduledGroupPage = ctx.scheduledGroupPage;
  const groupName = ctx.groupName;

  // 2. Call page object verification method
  await scheduledGroupPage.verifyScheduledGroupVisibleForUser();
  //    a) Refresh table data (click refresh button / reload)
  //    b) Find row in table with group name
  //    c) Assert exactly 1 row found:
  //       const groupRow = page.locator('table#scheduling-list-table tbody tr').filter({
  //         has: page.locator(`td.scheduling-group-name:has-text("${groupName}")`)
  //       });
  //       await expect(groupRow).toHaveCount(1);

  console.log('[VERIFY] ✓ Group found and visible');
});
```

**What Happened:**
- Table refreshed to get latest data
- Searched for group name in table rows
- Assertion passed: group is visible to logged-in user
- Test continues to deletion steps

**Console Output:**
```
[VERIFY] Checking if scheduling group is visible in table...
[VERIFY] Searching for group: "Test_SchdGrp_1680123456_7890"...
[VERIFY] ✓ Group found and visible
```

---

#### **STEP 4: Delete Scheduling Group** (When step)

**Gherkin:**
```gherkin
When the user clicks the Delete button for the scheduling group
```

```typescript
When("the user clicks the Delete button for the scheduling group", async ({ testContext }) => {
  const ctx = testContext as SchedulingGroupContext;
  const scheduledGroupPage = ctx.scheduledGroupPage;

  // Find the row with group name and click delete button
  const groupRow = page.locator('table#scheduling-list-table tbody tr').filter({
    has: page.locator(`td:has-text("${ctx.groupName}")`)
  });

  // Click delete button in that row
  await groupRow.locator('button[aria-label="Delete"]').click();

  console.log(`Clicked Delete for group: "${ctx.groupName}"`);
});
```

---

#### **STEP 5: Confirm Deletion** (Then + And steps)

**Gherkin:**
```gherkin
Then the delete confirmation popup appears with title "Delete Scheduling Group"
And the user approves the deletion
```

```typescript
Then("the delete confirmation popup appears with title {string}", async ({ testContext }, title: string) => {
  const page = testContext.page;

  // Wait for confirmation dialog and verify title
  const dialog = page.locator('.modal-dialog, .dialog');
  await expect(dialog).toBeVisible();

  const titleElement = dialog.locator('h2, .modal-title');
  await expect(titleElement).toContainText(title);

  console.log(`✓ Confirmation popup appeared with title: "${title}"`);
});

And("the user approves the deletion", async ({ testContext }) => {
  const page = testContext.page;

  // Click "Confirm" or "Yes" button in dialog
  const confirmButton = page.locator('button:has-text("Delete"), button:has-text("Confirm")');
  await confirmButton.click();

  console.log('✓ User approved deletion');
});
```

---

#### **STEP 6: Verify Deletion** (Then step)

**Gherkin:**
```gherkin
Then the scheduling group is no longer visible in the list
```

```typescript
Then("the scheduling group is no longer visible in the list", async ({ testContext }) => {
  const ctx = testContext as SchedulingGroupContext;
  const scheduledGroupPage = ctx.scheduledGroupPage;

  // Verify group is removed from table
  await scheduledGroupPage.verifyScheduledGroupNotVisibleForUser();
  //    a) Refresh table
  //    b) Search for group name
  //    c) Assert 0 rows found (deleted)

  console.log('[VERIFY] ✓ Group successfully deleted');
});
```

---

### Complete UI Test Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   Feature File (Gherkin)                         │
├─────────────────────────────────────────────────────────────────┤
│  Scenario: areaAdmin_News creates scheduling group              │
└─────────────────┬───────────────────────────────────────────────┘
                  │
        ┌─────────▼──────────────────────────┐
        │  Playwright-BDD Generator (bddgen) │
        │  Converts .feature to .ts test     │
        └─────────┬──────────────────────────┘
                  │
        ┌─────────▼──────────────────────────────────────────┐
        │  Playwright Test Runner                             │
        │  1. Setup fixtures (loginAs, testContext)           │
        │  2. Execute Given step                              │
        └─────────┬──────────────────────────────────────────┘
                  │
        ┌─────────▼──────────────────────────────────────────┐
        │  GIVEN: User logs in (fixture: loginAs)             │
        │  ✓ Load credentials from core/data/users.json       │
        │  ✓ Open browser with credentials                    │
        │  ✓ Returns logged-in Page object                    │
        │  ✓ Create ScheduledGroupPage object                 │
        │  ✓ Navigate to page                                 │
        │  ✓ Store in testContext                             │
        └─────────┬──────────────────────────────────────────┘
                  │
        ┌─────────▼──────────────────────────────────────────┐
        │  WHEN: Create scheduling group                       │
        │  ✓ Load form data from JSON                          │
        │  ✓ Generate unique group name                        │
        │  ✓ Fill form fields                                  │
        │  ✓ Submit form                                       │
        │  ✓ Store group name in context                       │
        └─────────┬──────────────────────────────────────────┘
                  │
        ┌─────────▼──────────────────────────────────────────┐
        │  THEN: Verify group created                          │
        │  ✓ Refresh table data                                │
        │  ✓ Search for group in table rows                    │
        │  ✓ Assert 1 row found                                │
        └─────────┬──────────────────────────────────────────┘
                  │
        ┌─────────▼──────────────────────────────────────────┐
        │  WHEN: Click Delete button                           │
        │  ✓ Find row with group name                          │
        │  ✓ Click delete button                               │
        └─────────┬──────────────────────────────────────────┘
                  │
        ┌─────────▼──────────────────────────────────────────┐
        │  THEN: Verify confirmation popup                     │
        │  ✓ Wait for dialog visible                           │
        │  ✓ Verify title text                                 │
        └─────────┬──────────────────────────────────────────┘
                  │
        ┌─────────▼──────────────────────────────────────────┐
        │  AND: Approve deletion                               │
        │  ✓ Click Confirm button                              │
        └─────────┬──────────────────────────────────────────┘
                  │
        ┌─────────▼──────────────────────────────────────────┐
        │  THEN: Verify deletion complete                      │
        │  ✓ Refresh table                                     │
        │  ✓ Assert group not found (0 rows)                   │
        └─────────┬──────────────────────────────────────────┘
                  │
        ┌─────────▼──────────────────────────────────────────┐
        │  Teardown                                            │
        │  ✓ Close browser context                             │
        │  ✓ Generate report                                   │
        └─────────────────────────────────────────────────────┘
```

---

## Detailed Integrated (API) Test Walkthrough

### Test Scenario: "systemAdmin creates and edits a duty"

Located in: [tests/integrated/features/NP035/allocations_api_edit.feature](tests/integrated/features/NP035/allocations_api_edit.feature)

```gherkin
@allocation-api
Feature: Duty Allocation API Operations

Scenario Outline: Create and Edit duty with different parameters for <user>
  Given user '<user>' is authenticated
  
  When the user creates a duty from testDataFile "<testDataFile>" with parameters:
    | dutyName           | <dutyName>          |
    | DutyID             | <DutyID>            |
    | SchedulingPersonID | <SchedulingPersonID>|
    | SchedulingTeamID   | <SchedulingTeamID>  |
    | dutyDate           | <dutyDate>          |
  
  And verify duty operation completed in database
  
  When the user edits the duty from testDataFile "<testDataFile>" with parameters:
    | editDutyName       | <editDutyName>      |
    | editStartTime      | <editStartTime>     |
  
  And verify duty operation completed in database
  Then verify the edit operation is recorded in duty history
  And verify the edit field changes are reflected in database

Examples:
  | user        | testDataFile                  | dutyName        | DutyID | SchedulingPersonID | ... |
  | systemAdmin | allocationApi_PostParams.json | U_API_Create_P1 | 35386  | 9350               | ... |
```

### Step-by-Step Execution

#### **STEP 1: User Authenticates** (Given step)

**Gherkin:**
```gherkin
Given user 'systemAdmin' is authenticated
```

**File:** [tests/integrated/steps/NP035/allocations_api_common.steps.ts](tests/integrated/steps/NP035/allocations_api_common.steps.ts)

```typescript
Given("user {string} is authenticated", async ({ authenticateAs }, userAlias: string) => {
  // 1. Fixture authenticateAs() sets up API authentication:
  //    - Load credentials from core/data/users.json for role 'systemAdmin'
  //    - Get password from environment variable SYS_ADMIN_PASSWORD
  //    - Create Basic Auth header: "Basic " + base64(username:password)
  //    - Set on apiClient for all subsequent requests
  
  await authenticateAs(userAlias);
  // Now all API requests include: Authorization: Basic base64(patans01:password)

  console.log(`Authenticated as user: ${userAlias}`);
  // Output: Authenticated as user: systemAdmin
  //         Using Basic Auth for user: systemAdmin
  //         Authenticated as user 10773 (patans01)
});
```

**What Happened:**
- Credentials loaded from `core/data/users.json`:
  ```json
  { "systemAdmin": { "username": "patans01", "envKey": "SYS_ADMIN_PASSWORD" } }
  ```
- Password retrieved from `.env.systest`: `SYS_ADMIN_PASSWORD=actual_password`
- Basic Auth header created: `Authorization: Basic cGF0YW5zMDE6YWN0dWFsX3Bhc3N3b3Jk`
- No network call yet (just setup)

---

#### **STEP 2: Create Duty (API POST)** (When step)

**Gherkin:**
```gherkin
When the user creates a duty from testDataFile "allocationApi_PostParams.json" with parameters:
  | dutyName           | U_API_Create_P1  |
  | DutyID             | 35386            |
  | SchedulingPersonID | 9350             |
  | SchedulingTeamID   | 275              |
  | dutyDate           | 2026-04-04       |
```

**File:** [tests/integrated/steps/NP035/allocations_api_edit.steps.ts](tests/integrated/steps/NP035/allocations_api_edit.steps.ts)

```typescript
When("the user creates a duty from testDataFile {string} with parameters:", 
  async ({}, testDataFile: string, dataTable: DataTable) => {
    
    // 1. Get request context (from fixture)
    const requestContext = getSharedContext();

    // 2. Parse feature file parameters into map
    //    Input: DataTable with rows | key | value |
    //    Output: { dutyName: 'U_API_Create_P1', DutyID: '35386', ... }
    const params = normalizeParameters(parseDataTableToMap(dataTable));

    // 3. Load request payload template from JSON file
    let template = loadTestParameters(
      `allocationApi_PostParams.json`,
      'duty'  // Use "duty" key in JSON
    );
    // Result: { DutyName: "{{dutyName|DefaultName}}", ... }

    // 4. Substitute template variables with actual test parameters
    //    Replaces {{dutyName|DefaultName}} with 'U_API_Create_P1', etc.
    let payload = resolveTemplate(template, params);
    // Result: { DutyName: 'U_API_Create_P1', DutyID: 35386, ... }

    // 5. Set action to EDIT (backend uses this to determine create vs edit)
    payload.action = API_CONFIG.actions.EDIT;

    // 6. Store in scenario context for later steps (edit, verification)
    scenarioContext.dutyName = payload.DutyName;
    scenarioContext.schedulingPersonId = payload.SchedulingPersonID;
    scenarioContext.schedulingTeamId = payload.SchedulingTeamID;
    scenarioContext.dutyDate = payload.DutyDate;
    scenarioContext.dutyId = payload.DutyID;

    // 7. Send POST request to API
    //    Method: makeApiRequest(context, 'POST', '/api/endpoint', payload, description)
    await makeApiRequest(
      requestContext,
      'POST',
      API_CONFIG.endpoints.markAction,  // /api/duty/markAction or similar
      payload,
      'API Operation - Create Duty'
    );

    console.log(`[CREATE-PAYLOAD] Request payload:\n${JSON.stringify(payload, null, 2)}`);
  }
);
```

**Request Payload Template:** [workflows/integrated/allocations/data/requestPayload/allocationApi_PostParams.json](workflows/integrated/allocations/data/requestPayload/allocationApi_PostParams.json)

```json
{
  "duty": {
    "DutyName": "{{dutyName|U_Default}}",
    "DutyID": "{{DutyID|0}}",
    "ID": "{{ID|0}}",
    "SchedulingPersonID": "{{SchedulingPersonID|0}}",
    "SchedulingTeamID": "{{SchedulingTeamID|0}}",
    "DutyDate": "{{dutyDate|2026-01-01}}",
    "allocationsSchPer": "{{allocationsSchPer|0}}",
    "action": "EDIT"
  }
}
```

**Template Variable Substitution:**
```
Template: { DutyName: "{{dutyName|DEFAULT}}", DutyID: "{{DutyID|0}}" }
Params:   { dutyName: "U_API_Create_P1", DutyID: "35386" }
Result:   { DutyName: "U_API_Create_P1", DutyID: "35386" }

// If parameter not provided, uses default:
Template: { EndTime: "{{endTime|09:00}}" }
Params:   { /* endTime not provided */ }
Result:   { EndTime: "09:00" }
```

**API Request Made:**
```
POST https://api.systest.example.com/api/duty/markAction
Headers:
  Authorization: Basic cGF0YW5zMDE6YWN0dWFsX3Bhc3N3b3Jk
  Content-Type: application/json

Body:
{
  "DutyName": "U_API_Create_P1",
  "DutyID": "35386",
  "ID": "35386",
  "SchedulingPersonID": "9350",
  "SchedulingTeamID": "275",
  "DutyDate": "2026-04-04",
  "allocationsSchPer": "9350",
  "action": "EDIT"
}

Response (200 OK):
{
  "success": true,
  "message": "Duty created successfully",
  "data": { "AllocationsDutyID": 999888 }
}
```

**What Happened:**
- Test parameters extracted from feature file
- Payload template loaded and filled
- POST request sent to backend API with Basic Auth
- Response captured for verification
- Key IDs extracted and stored in scenario context

**Console Output:**
```
Authenticated as user: systemAdmin
Using Basic Auth for user: systemAdmin

[CREATE-PAYLOAD] Request payload:
{
  "DutyName": "U_API_Create_P1",
  "DutyID": "35386",
  "SchedulingPersonID": "9350",
  "SchedulingTeamID": "275",
  "DutyDate": "2026-04-04",
  "action": "EDIT"
}
```

---

#### **STEP 3: Verify Creation in Database** (And step)

**Gherkin:**
```gherkin
And verify duty operation completed in database
```

**File:** [tests/integrated/steps/NP035/allocations_api_edit.steps.ts](tests/integrated/steps/NP035/allocations_api_edit.steps.ts)

```typescript
Then("verify duty operation completed in database", async ({ db }) => {
  // 1. Get request context (contains API response)
  const requestContext = getSharedContext();

  // 2. Verify API response was successful
  const responseData = requestContext.body ? JSON.parse(requestContext.body) : {};
  expect(requestContext.status).toBeGreaterThanOrEqual(200);
  expect(requestContext.status).toBeLessThan(500);
  expect(responseData.success).toBe(true);
  // Assertion fails if API didn't return success

  // 3. For CREATE operation: Query database to capture AllocationsDutyID
  if (!scenarioContext.allocationsDutyId) {
    // First time: extract ID from API response or query database
    const result = await db.request()
      .input('dutyName', sql.VarChar, scenarioContext.dutyName)
      .input('dutyDate', sql.Date, scenarioContext.dutyDate)
      .query(`
        SELECT TOP 1 AD_AllocationsDutyID, AD_DutyName, AD_DutyDate
        FROM AllocationsDuty
        WHERE AD_DutyName = @dutyName AND AD_DutyDate = @dutyDate
        ORDER BY AD_CreatedDate DESC
      `);

    if (result.recordset.length === 0) {
      throw new Error('Duty not found in database after creation');
    }

    // Store ID for use in edit operation
    scenarioContext.allocationsDutyId = result.recordset[0].AD_AllocationsDutyID;
    console.log(`✓ Duty created in DB. AllocationsDutyID: ${scenarioContext.allocationsDutyId}`);
  }
  else {
    // For EDIT operation: Verify changes were applied
    const result = await db.request()
      .input('allocationsDutyId', sql.Int, scenarioContext.allocationsDutyId)
      .query(`
        SELECT AD_DutyName, AD_StartTime, AD_EndTime, AD_ModifiedDate
        FROM AllocationsDuty
        WHERE AD_AllocationsDutyID = @allocationsDutyId
      `);

    if (result.recordset.length === 0) {
      throw new Error(`Duty ${scenarioContext.allocationsDutyId} not found in database`);
    }

    const duty = result.recordset[0];
    console.log(`✓ Duty verified in DB. Name: ${duty.AD_DutyName}`);
  }
});
```

**Database Query Execution:**
```sql
-- Query executed against MSSQL database
SELECT TOP 1 AD_AllocationsDutyID, AD_DutyName, AD_DutyDate
FROM AllocationsDuty
WHERE AD_DutyName = 'U_API_Create_P1' AND AD_DutyDate = '2026-04-04'
ORDER BY AD_CreatedDate DESC

-- Result:
AD_AllocationsDutyID | AD_DutyName       | AD_DutyDate
==========================================
999888               | U_API_Create_P1   | 2026-04-04
```

**What Happened:**
- API response verified (status 200, success: true)
- Duty queried from database using name and date
- AllocationsDutyID captured: 999888
- Stored in scenario context for edit step

**Console Output:**
```
✓ Duty created in DB. AllocationsDutyID: 999888
```

---

#### **STEP 4: Edit Duty (API POST with ID)** (When step)

**Gherkin:**
```gherkin
When the user edits the duty from testDataFile "allocationApi_PostParams.json" with parameters:
  | editDutyName     | U_API_Edit_P1_v2 |
  | editStartTime    | 10:00            |
  | editEndTime      | 11:30            |
  | editDutyColorId  | 2                |
```

**File:** [tests/integrated/steps/NP035/allocations_api_edit.steps.ts](tests/integrated/steps/NP035/allocations_api_edit.steps.ts)

```typescript
When("the user edits the duty from testDataFile {string} with parameters:", 
  async ({}, testDataFile: string, dataTable: DataTable) => {
    
    // 1. Verify duty was created in previous step
    const requestContext = getSharedContext();
    if (!scenarioContext.allocationsDutyId) {
      throw new Error('Cannot edit duty: allocationsDutyId not captured from creation step');
    }

    // 2. Parse edit parameters from feature file
    const editParams = normalizeParameters(parseDataTableToMap(dataTable));
    // { editDutyName: 'U_API_Edit_P1_v2', editStartTime: '10:00', ... }

    // 3. Merge edit parameters with creation context (have full duty info)
    const merged = { ...editParams };
    // Add IDs from creation for reference
    merged.allocationsDutyId = String(scenarioContext.allocationsDutyId);
    merged.DutyID = scenarioContext.dutyId;
    merged.SchedulingPersonID = scenarioContext.schedulingPersonId;
    // ... etc

    // 4. Load and fill template (same as create)
    let template = loadTestParameters(`allocationApi_PostParams.json`, 'duty');
    let payload = resolveTemplate(template, merged);

    // 5. Mark as edited (backend uses this flag)
    payload.isEdited = '1';
    payload.AllocationsDutyID = scenarioContext.allocationsDutyId;
    payload.action = API_CONFIG.actions.EDIT;

    // 6. Send POST request (same endpoint, backend determines create vs edit by ID)
    await makeApiRequest(
      requestContext,
      'POST',
      API_CONFIG.endpoints.markAction,
      payload,
      `API Operation - Edit Duty (AllocationsDutyID: ${scenarioContext.allocationsDutyId})`
    );

    console.log(`[EDIT-PAYLOAD] Request payload:\n${JSON.stringify(payload, null, 2)}`);
  }
);
```

**API Request Made for Edit:**
```
POST https://api.systest.example.com/api/duty/markAction
Headers:
  Authorization: Basic cGF0YW5zMDE6YWN0dWFsX3Bhc3N3b3Jk
  Content-Type: application/json

Body:
{
  "AllocationsDutyID": 999888,          // Key difference: includes ID (triggers edit)
  "DutyName": "U_API_Edit_P1_v2",       // Changed value
  "StartTime": "10:00",                 // Changed value
  "EndTime": "11:30",                   // Changed value
  "DutyColorId": "2",                   // Changed value
  "isEdited": "1",
  "action": "EDIT"
}

Response (200 OK):
{
  "success": true,
  "message": "Duty updated successfully"
}
```

**What Happened:**
- Edit parameters from feature file parsed
- Payload template filled with edit values
- AllocationsDutyID included in payload (signals backend to UPDATE instead of INSERT)
- POST request sent
- Stored in scenario context for verification

---

#### **STEP 5: Verify Edit in Database** (And step)

**Gherkin:**
```gherkin
And verify duty operation completed in database
Then verify the edit operation is recorded in duty history with change details
And verify the edit field changes are reflected in database
```

**Verification Code:**
```typescript
Then("verify the edit operation is recorded in duty history with change details", async ({ db }) => {
  // 1. Query audit/history table for edit record
  const historyResult = await db.request()
    .input('allocationsDutyId', sql.Int, scenarioContext.allocationsDutyId)
    .query(`
      SELECT TOP 1 * FROM AllocationsDutyHistory
      WHERE ADH_AllocationsDutyID = @allocationsDutyId
      ORDER BY ADH_CreatedDate DESC
    `);

  if (historyResult.recordset.length === 0) {
    throw new Error('Edit not recorded in duty history');
  }

  const history = historyResult.recordset[0];
  console.log(`✓ Edit recorded in history:`);
  console.log(`  - Field Changed: ${history.ADH_FieldName}`);
  console.log(`  - Old Value: ${history.ADH_OldValue}`);
  console.log(`  - New Value: ${history.ADH_NewValue}`);
  console.log(`  - Changed By: ${history.ADH_ChangedBy}`);
});

Then("verify the edit field changes are reflected in database", async ({ db }) => {
  // 2. Query duty table to verify changes were applied
  const dutyResult = await db.request()
    .input('allocationsDutyId', sql.Int, scenarioContext.allocationsDutyId)
    .query(`
      SELECT AD_DutyName, AD_StartTime, AD_EndTime, AD_DutyColorId
      FROM AllocationsDuty
      WHERE AD_AllocationsDutyID = @allocationsDutyId
    `);

  const duty = dutyResult.recordset[0];
  
  // Assert edited values match what we sent
  expect(duty.AD_DutyName).toBe('U_API_Edit_P1_v2');
  expect(duty.AD_StartTime).toBe('10:00');
  expect(duty.AD_EndTime).toBe('11:30');
  expect(duty.AD_DutyColorId).toBe(2);

  console.log('✓ All edit changes verified in database');
});
```

**Database Queries Executed:**
```sql
-- Query 1: Verify history record
SELECT TOP 1 * FROM AllocationsDutyHistory
WHERE ADH_AllocationsDutyID = 999888
ORDER BY ADH_CreatedDate DESC

-- Result:
ADH_FieldName | ADH_OldValue       | ADH_NewValue         | ADH_ChangedBy
============================================================================
DutyName      | U_API_Create_P1    | U_API_Edit_P1_v2     | patans01
StartTime     | 09:00              | 10:00                | patans01
EndTime       | 10:00              | 11:30                | patans01


-- Query 2: Verify duty record updated
SELECT AD_DutyName, AD_StartTime, AD_EndTime from AllocationsDuty
WHERE AD_AllocationsDutyID = 999888

-- Result:
AD_DutyName       | AD_StartTime | AD_EndTime
===============================================
U_API_Edit_P1_v2  | 10:00        | 11:30
```

**What Happened:**
- History table queried to confirm edit was logged
- Duty table queried to verify changes applied
- All assertions passed
- Test complete

**Console Output:**
```
✓ Duty verified in DB. Name: U_API_Edit_P1_v2
✓ Edit recorded in history:
  - Field Changed: DutyName
  - Old Value: U_API_Create_P1
  - New Value: U_API_Edit_P1_v2
  - Changed By: patans01
✓ All edit changes verified in database
```

---

### Complete API Test Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│              Feature File (Gherkin - Allocation)              │
├──────────────────────────────────────────────────────────────┤
│  Scenario: systemAdmin creates and edits duty                 │
│  Examples: | dutyName | DutyID | SchedulingPersonID | ...    │
└──────────────────┬───────────────────────────────────────────┘
                   │
         ┌─────────▼──────────────────┐
         │  Playwright-BDD Generator   │
         │  (bddgen command)           │
         │  Converts .feature to .ts   │
         └─────────┬──────────────────┘
                   │
         ┌─────────▼──────────────────────────────────────────┐
         │  Playwright Test Runner                             │
         │  1. Setup fixtures (db, apiClient, authenticateAs)  │
         │  2. No browser opened (pure API test)               │
         └─────────┬──────────────────────────────────────────┘
                   │
         ┌─────────▼──────────────────────────────────────────┐
         │  GIVEN: User authenticated (fixture: authenticateAs)│
         │  ✓ Load credentials from core/data/users.json       │
         │  ✓ Get password from .env.systest                   │
         │  ✓ Create Basic Auth header                         │
         │  ✓ Set on apiClient for all requests                │
         │  ✗ No actual network call yet                       │
         └─────────┬──────────────────────────────────────────┘
                   │
         ┌─────────▼──────────────────────────────────────────┐
         │  WHEN: Create duty (API POST)                        │
         │  ✓ Parse parameters from feature file               │
         │  ✓ Load payload template from JSON                  │
         │  ✓ Substitute {{variables}} with test values        │
         │  ✓ Send POST to /api/duty/markAction                │
         │  ✓ With Authorization header (Basic Auth)           │
         │  ✓ Store response and captured IDs in context       │
         └─────────┬──────────────────────────────────────────┘
                   │
         ┌─────────▼──────────────────────────────────────────┐
         │  AND: Verify in database                             │
         │  ✓ Connect to database (fixture: db)                │
         │  ✓ Query AllocationsDuty table                       │
         │  ✓ Verify duty record exists                        │
         │  ✓ Extract AllocationsDutyID (needed for edit)       │
         │  ✓ Store ID in scenario context                     │
         └─────────┬──────────────────────────────────────────┘
                   │
         ┌─────────▼──────────────────────────────────────────┐
         │  WHEN: Edit duty (API POST with ID)                  │
         │  ✓ Parse edit parameters from feature file          │
         │  ✓ Merge with creation context (have duty info)     │
         │  ✓ Load payload template (same file)                │
         │  ✓ Include AllocationsDutyID in payload             │
         │  ✓ Backend sees ID → UPDATE instead of INSERT       │
         │  ✓ Send POST to /api/duty/markAction                │
         │  ✓ With Authorization header                        │
         └─────────┬──────────────────────────────────────────┘
                   │
         ┌─────────▼──────────────────────────────────────────┐
         │  AND: Verify edit in database                        │
         │  ✓ Query AllocationsDutyHistory table               │
         │  ✓ Verify edit was logged with field changes        │
         │  ✓ Query AllocationsDuty table                       │
         │  ✓ Verify all fields updated correctly              │
         │  ✓ Assert old → new value changes                   │
         └─────────┬──────────────────────────────────────────┘
                   │
         ┌─────────▼──────────────────────────────────────────┐
         │  Teardown                                            │
         │  ✓ Close database connection                        │
         │  ✓ Rollback any transactions (test cleanup)         │
         │  ✓ Generate HTML report                             │
         └────────────────────────────────────────────────────┘
```

---

## End-to-End Test Execution Flow

### Complete Flow from Console Command to Results

#### **Phase 1: Command Execution in Console**

```bash
# User types in console:
npm run uisystesttest

# This resolves to package.json script:
"uisystesttest": "cross-env ENVIRONMENT=systest TEST_TYPE=ui npm run _ui:run"

# Which executes:
"_ui:run": "npx bddgen && npx playwright test --project=uitest"
```

**Environment Variables Set:**
```
ENVIRONMENT=systest    → loads .env.systest (UI_BASE_URL, credentials)
TEST_TYPE=ui           → tells playwright to run UI tests only
LOADED_ENVIRONMENT=systest → cached to avoid reloading
```

---

#### **Phase 2: BDD Generator (bddgen)**

```bash
npx bddgen
```

This command:
1. **Reads:** `tests/ui/features/NP035/*.feature` (Gherkin files)
2. **Reads:** `tests/ui/steps/NP035/*.steps.ts` (Step definitions)
3. **Generates:** `.features-gen/ui/` folder with compiled test files (TypeScript)
4. **Output:** For each feature file, creates a .spec.ts file

**Example Generated File: `.features-gen/ui/schedulinggroup_ui_create.spec.ts`**

```typescript
// THIS FILE IS AUTO-GENERATED by bddgen
import { test, BDD } from 'playwright-bdd';

test.describe('Feature: Scheduling Group CRUD - Create', () => {
  
  test('Scenario: areaAdmin_News creates a scheduling group', async () => {
    // Scenario name from feature file
    // Maps to step definitions in schedulinggroup_ui_create.steps.ts

    // GIVEN: user 'areaAdmin_News' is on the "Scheduled Group" page
    await Given('user \'areaAdmin_News\' is on the "Scheduled Group" page');

    // WHEN: the user creates a new scheduling group using "schdGroupCreate_AreaAdminNews_UIdata"
    await When('the user creates a new scheduling group using "schdGroupCreate_AreaAdminNews_UIdata"');

    // THEN: the scheduling group is visible
    await Then('the scheduling group is visible');

    // ... more steps for delete ...
  });

  test('Scenario: systemAdmin creates a scheduling group', async () => {
    // Similar for second example
  });
});
```

---

#### **Phase 3: Playwright Test Execution**

```bash
npx playwright test --project=uitest
```

**Playwright config (`playwright.config.ts`) specifies:**
- Which browsers to run on: Chrome, Firefox, WebKit
- Test output directory: `test-results/`
- Report location: `playwright-report/`
- Timeout: 60 seconds per test
- Retry logic: 0 retries (unless CI=true)

**Execution Flow Per Test:**

```
┌─────────────────────────────────────────────────────────┐
│  Playwright finds test files (.spec.ts)                 │
└────────────────┬────────────────────────────────────────┘
                 │
       ┌─────────▼──────────────────────┐
       │  For each scenario (test case)  │
       └────────────┬────────────────────┘
                    │
       ┌────────────▼──────────────────────────┐
       │  1. Initialize Fixtures               │
       │  ✓ Request context (HTTP)             │
       │  ✓ API client with auth              │
       │  ✓ Database connection               │
       │  ✓ loginAs function                  │
       │  ✓ testContext (empty object)        │
       └────────────┬──────────────────────────┘
                    │
       ┌────────────▼──────────────────────────┐
       │  2. Execute GIVEN steps               │
       │  ✓ Match "user 'areaAdmin_News'..."  │
       │  ✓ Call matching step function       │
       │  ✓ Step uses fixtures (loginAs, ctx)│
       │  ✓ Sets up test preconditions       │
       └────────────┬──────────────────────────┘
                    │
       ┌────────────▼──────────────────────────┐
       │  3. Execute WHEN steps                │
       │  ✓ Match "user creates group..."     │
       │  ✓ Call matching step function       │
       │  ✓ Performs test actions             │
       │  ✓ Stores results in testContext    │
       └────────────┬──────────────────────────┘
                    │
       ┌────────────▼──────────────────────────┐
       │  4. Execute THEN steps                │
       │  ✓ Match "scheduling group visible..."│
       │  ✓ Call matching step function       │
       │  ✓ Retrieves from testContext        │
       │  ✓ Verifies expected outcomes        │
       │  ✓ expect(condition).toBeTruthy()   │
       └────────────┬──────────────────────────┘
                    │
       ┌────────────▼──────────────────────────┐
       │  5. Test Result Determination         │
       │  ✓ PASSED: All steps succeeded        │
       │  ✓ FAILED: Any assertion failed      │
       │  ✓ SKIPPED: Tagged with @skip       │
       └────────────┬──────────────────────────┘
                    │
       ┌────────────▼──────────────────────────┐
       │  6. Capture Artifacts                 │
       │  ✓ Screenshots (on failure)           │
       │  ✓ Video recording                    │
       │  ✓ Traces (browser timeline)         │
       │  ✓ Test logs and console output      │
       └────────────┬──────────────────────────┘
                    │
       ┌────────────▼──────────────────────────┐
       │  7. Cleanup                           │
       │  ✓ Close browser context              │
       │  ✓ Rollback database transactions    │
       │  ✓ Close database connection         │
       │  ✓ Release resources                 │
       └────────────┬──────────────────────────┘
                    │
       ┌────────────▼──────────────────────────┐
       │  Next Scenario...                     │
       └────────────────────────────────────────┘
```

---

#### **Phase 4: Report Generation**

After all tests execute:

```bash
# Reports generated at:
# 1. HTML Report (interactive)
playwright-report/index.html         # Open in browser to view tests with videos/screenshots

# 2. Test Results (raw data)
test-results/
├── api/                             # API test results
├── ui/                              # UI test results
└── - /trace1.zip, /video.webm      # Video and trace files
```

**View Results:**

```bash
npm run report
# Opens: https://localhost:9223 (http-server)
# Shows: ✓ PASSED/✗ FAILED tests, screenshots, videos, timeline
```

---

### Complete Command-to-Result Timeline

```
Time: 0s
└─ npm run uisystesttest
   ├─ Set ENVIRONMENT=systest
   │  └─ Load .env.systest (UI_BASE_URL, DB credentials, etc.)
   │
   ├─ Set TEST_TYPE=ui
   │  └─ Configure to run UI tests only (skip API tests)
   │
   ├─ Time: 0.5s - npx bddgen
   │  ├─ Compile .feature files to .spec.ts
   │  ├─ Parse step definitions
   │  └─ Generate: .features-gen/ui/schedulinggroup_ui_create.spec.ts
   │
   └─ Time: 2s - npx playwright test --project=uitest
      ├─ Load playwright.config.ts
      ├─ Find all .spec.ts files in .features-gen/ui/
      │
      ├─ Time: 3s - Scenario 1: areaAdmin_News creates group
      │  ├─ Time: 3.2s - Initialize browser
      │  ├─ Time: 3.5s - GIVEN: Login as areaAdmin_News
      │  │  ├─ Read credentials from core/data/users.json
      │  │  ├─ Get password from .env: AREA_ADMIN_PASSWORD
      │  │  ├─ Navigate to UI_BASE_URL with credentials
      │  │  └─ Wait for page loaded
      │  ├─ Time: 5s - WHEN: Create scheduling group
      │  │  ├─ Click "Add Scheduling Group"
      │  │  ├─ Load form data from JSON
      │  │  ├─ Generate unique name: Test_SchdGrp_1680123456_7890
      │  │  ├─ Fill form fields
      │  │  └─ Submit
      │  ├─ Time: 6s - THEN: Verify group visible
      │  │  ├─ Query table
      │  │  ├─ Assert group found
      │  │  └─ ✓ PASSED
      │  ├─ Time: 7s - WHEN: Delete group
      │  ├─ Time: 8s - THEN: Verify deleted
      │  │  └─ ✓ PASSED
      │  └─ Time: 9s - Cleanup (close browser)
      │
      ├─ Time: 10s - Scenario 2: systemAdmin creates group
      │  ├─ Time: 11s - ... (similar execution)
      │  └─ Time: 15s - ✓ PASSED
      │
      └─ Time: 16s - All tests complete
         ├─ Generate HTML report: playwright-report/index.html
         ├─ Save videos: test-results/ui/video1.webm
         ├─ Save traces: test-results/ui/trace1.zip
         └─ Console output:
            ✓ 2 passed (16.2s)
```

---

## Running Tests from Console

### Available Commands

**Package.json defines these commands:**

```json
{
  "scripts": {
    "uidevtest": "cross-env ENVIRONMENT=dev TEST_TYPE=ui npm run _ui:run",
    "uisystesttest": "cross-env ENVIRONMENT=systest TEST_TYPE=ui npm run _ui:run",
    "apitest": "cross-env ENVIRONMENT=dev TEST_TYPE=api npm run _api:run",
    "apitest:systest": "cross-env ENVIRONMENT=systest TEST_TYPE=api npm run _api:run",
    "test": "npm run test:systest",
    "test:systest": "npm run apitest:systest && npm run uisystesttest",
    "test:dev": "npm run apitest && npm run uidevtest",
    "report": "npx playwright show-report"
  }
}
```

---

### Command Reference

#### **1. Run UI Tests on Dev Environment**
```bash
npm run uidevtest

# Execution:
# - Loads .env.dev
# - Runs only UI tests in tests/ui/
# - Browsers: Chrome, Firefox, WebKit
# - Environment: Dev
```

#### **2. Run UI Tests on System Test Environment**
```bash
npm run uisystesttest

# Execution:
# - Loads .env.systest
# - Runs only UI tests
# - Environment: System Test
```

#### **3. Run API Tests on Dev Environment**
```bash
npm run apitest

# Execution:
# - Loads .env.dev
# - Runs only API tests in tests/integrated/
# - No browser needed
# - Makes direct HTTP requests
```

#### **4. Run API Tests on Systest Environment**
```bash
npm run apitest:systest

# Execution:
# - Loads .env.systest
# - Runs API tests against systest backend
```

#### **5. Run All Tests (API + UI) on Systest**
```bash
npm run test:systest
# OR
npm run test

# Execution:
# - apitest:systest (runs all API tests)
# - uisystesttest (runs all UI tests)
# - Sequential: API first, then UI
```

#### **6. Run All Tests (API + UI) on Dev**
```bash
npm run test:dev

# Execution:
# - apitest (API tests on dev)
# - uidevtest (UI tests on dev)
```

#### **7. Run Specific Feature File**
```bash
npm run _ui:run -- --grep "Scheduling Group CRUD - Create"

# Runs only scenarios matching the pattern
```

#### **8. Run Tests in Headed Mode (Visible Browser)**
```bash
npm run _ui:run -- --headed

# Browser window opens showing test execution
# Useful for debugging
```

#### **9. Run Tests in Debug Mode**
```bash
npm run _ui:run -- --debug

# Opens Playwright Inspector
# Step through test line-by-line
# Inspect DOM, evaluate expressions
```

#### **10. Run Single Test File**
```bash
npm run _ui:run -- tests/ui/features/NP035/schedulinggroup_ui_create.feature

# Runs only scenarios in this feature file
```

#### **11. View Test Report**
```bash
npm run report

# Opens playwright-report/index.html in browser
# Shows: Passed/Failed tests, videos, screenshots, timeline
```

#### **12. CI/CD Pipeline (Recommended for CI)**
```bash
npm run test:ci

# Execution:
# - ENVIRONMENT=systest
# - Runs API tests: bddgen + playwright test --project=apitest
# - Runs UI tests: bddgen + playwright test --project=uitest
# - Used in CI/CD pipelines
```

---

### Command Examples with Explanations

**Scenario 1: Quick smoke test during development**
```bash
npm run uidevtest -- --headed
# - Runs UI tests on dev environment
# - Browser visible (can see what's happening)
# - Quick sanity check before committing
```

**Scenario 2: Full regression on systest before release**
```bash
npm run test:systest
# - Runs all API tests on systest
# - Runs all UI tests on systest
# - Takes ~5-10 minutes (depending on number of tests)
# - Ensures everything works on actual test environment
```

**Scenario 3: Debug failing test**
```bash
npm run _ui:run -- --debug --grep "creates a scheduling group"
# - Opens Playwright Inspector
# - Only runs tests matching pattern
# - Can step through, inspect elements, see console
```

**Scenario 4: Verify specific feature works**
```bash
npm run _ui:run -- tests/ui/features/NP035/schedulinggroup_ui_edit.feature --headed
# - Runs only edit scenarios
# - Browser visible
# - Verify edit functionality works
```

---

## Key Files Reference

### Core Files You'll Frequently Edit/Reference

| File | Purpose | When to Edit |
|------|---------|-------------|
| [tests/ui/features/**/*.feature](tests/ui/features/) | Gherkin test scenarios (behavior specs) | Add new test cases, update existing cases |
| [tests/ui/steps/**/*.steps.ts](tests/ui/steps/) | Step implementations (what each step does) | Implement new steps, modify step logic |
| [tests/ui/page/**/*Page.ts](tests/ui/page/) | Page Object Models (encapsulate page interactions) | Add new page objects, update selectors |
| [tests/utils/*.ts](tests/utils/) | UI helper functions (reusable utilities) | Add helpers for form filling, data reading |
| [tests/integrated/features/**/*.feature](tests/integrated/features/) | API test scenarios (behavior specs) | Add new API test cases |
| [tests/integrated/steps/**/*.steps.ts](tests/integrated/steps/) | API step implementations | Implement API steps, add validations |
| [workflows/{module}/context/context.ts](workflows/) | Define what data is shared between steps | Add new context properties when needed |
| [workflows/{module}/data/*.json](workflows/) | Test data (forms, payloads, expectations) | Update/add test data for scenarios |
| [core/data/users.json](core/data/users.json) | User credentials and roles | Add new test users, update IDs/usernames |
| [core/db/queries.ts](core/db/queries.ts) | Database queries used in tests | Add new DB queries for verification |
| [.env.systest](.env.systest) | Environment configuration (secrets) | Update passwords, URLs for different environments |

---

### Architecture Files (Reference Only)

| File | Purpose | Typical Usage |
|------|---------|---------------|
| [playwright.config.ts](playwright.config.ts) | Playwright configuration | Usually doesn't need changes after setup |
| [tests/fixtures/fixture.ts](tests/fixtures/fixture.ts) | API test fixtures (db, apiClient) | Reference to understand available fixtures |
| [tests/fixtures/pages.fixture.ts](tests/fixtures/pages.fixture.ts) | UI test fixtures (loginAs, testContext) | Reference to understand available fixtures |
| [core/config/envConfig.ts](core/config/envConfig.ts) | Environment loading | Reference to understand config management |
| [core/api/apiClient.ts](core/api/apiClient.ts) | API client wrapper | Reference to understand API structure |
| [core/db/connection.ts](core/db/connection.ts) | Database connection pooling | Reference to understand DB setup |
| [tsconfig.json](tsconfig.json) | TypeScript configuration | Rarely needs changes |
| [package.json](package.json) | Dependencies and scripts | Update when adding new npm packages |

---

## Common Workflows

### Workflow 1: Writing a New UI Test Scenario

1. **Create Feature File**
```gherkin
# File: tests/ui/features/NP035/my_new_feature.feature
@my-feature @ui @smoke
Feature: My New Feature

  Scenario: New functionality works
    Given user 'systemAdmin' is on the "Dashboard" page
    When user performs action
    Then system shows confirmation
```

2. **Create Step Definitions**
```typescript
// File: tests/ui/steps/NP035/my_new_feature.steps.ts
import { createBdd } from 'playwright-bdd';
import { test } from '@fixtures/pages.fixture';

const { Given, When, Then } = createBdd(test);

Given('user {string} is on the "Dashboard" page', async ({ loginAs, testContext }, role: string) => {
  const page = await loginAs(role);
  // ... step implementation
});

When('user performs action', async ({ testContext }) => {
  // ... step implementation
});

Then('system shows confirmation', async ({ testContext }) => {
  // ... step implementation
});
```

3. **Create Test Data (if needed)**
```json
// File: workflows/ui/myFeature/data/myData.json
{
  "field1": { "selector": "input[name='field1']", "value": "test", "type": "input" }
}
```

4. **Run the Test**
```bash
npm run uidevtest -- --grep "New functionality works" --headed
```

---

### Workflow 2: Writing a New API Test Scenario

1. **Create Feature File**
```gherkin
# File: tests/integrated/features/NP035/my_api_feature.feature
@my-api @api @smoke
Feature: My API Feature

  Scenario: API creates resource
    Given user 'systemAdmin' is authenticated
    When user creates resource with parameters:
      | resourceName | Test_Resource |
      | status       | Active        |
    And verify operation completed in database
    Then verify resource exists in database
```

2. **Create Step Definitions**
```typescript
// File: tests/integrated/steps/NP035/my_api_feature.steps.ts
import { createBdd, DataTable } from 'playwright-bdd';
import { createAPIFixture, expect } from '@fixtures/api.fixture';
import { MyModuleContext } from '@workflows/integrated/mymodule/context/context';

// Create extended test with module-specific context (once per module)
const test = createAPIFixture<MyModuleContext>(() => ({
  resourceId: null,
  resourceName: null,
  // ... other context properties
}));

// Export for bddgen
export { test };

const { When, Then } = createBdd(test);

When('user creates resource with parameters:', async ({ scenarioContext, requestContext }, dataTable: DataTable) => {
  const params = parseDataTableToMap(dataTable);
  
  // Get payload template and resolve variables
  const payload = buildPayload(resourceTemplate, params);
  
  // Make API call
  const response = await fetch('https://api.example.com/resource', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: { 'Authorization': 'Bearer token' }
  });
  
  requestContext.response = response;
});

Then('verify resource exists in database', async ({ db }) => {
  const result = await db.request().query('SELECT * FROM Resources');
  expect(result.recordset.length).toBeGreaterThan(0);
});
```

3. **Run the Test**
```bash
npm run apitest -- --grep "API creates resource" --headed
```

---

### Workflow 3: Debugging a Failed Test

1. **Run the test in debug mode**
```bash
npm run _ui:run -- --debug --grep "Test scenario name"
```

2. **In Playwright Inspector:**
   - Step through code line-by-line
   - Inspect DOM elements
   - Check console logs
   - View network requests

3. **Common Debugging Techniques**
```typescript
// Add a pause to manually inspect state
await page.pause();

// Log values
console.log('Current URL:', page.url());
console.log('Element text:', await page.locator('selector').textContent());

// Take screenshot to see what's displayed
await page.screenshot({ path: 'debug.png' });

// Check if element exists
const element = await page.$(selector);
console.log('Element exists:', !!element);
```

---

### Workflow 4: Adding a New User Role

1. **Update users.json**
```json
{
  "myNewRole": {
    "id": 10999,
    "username": "mynewuser01",
    "envKey": "MY_NEW_ROLE_PASSWORD"
  }
}
```

2. **Add password to .env files**
```bash
# .env.systest
MY_NEW_ROLE_PASSWORD=actual_password_here
```

3. **Use in test**
```gherkin
Given user 'myNewRole' is on the page
```

---

### Workflow 5: Updating Database Queries

1. **Check AllocationQueries**
```typescript
// workflows/integrated/allocations/data/db/queries/allocations.queries.ts
export class AllocationQueries {
  static async getLatestDuty(db: sql.ConnectionPool, dutyName: string) {
    const result = await db.request()
      .input('dutyName', sql.VarChar, dutyName)
      .query(`
        SELECT TOP 1 * FROM AllocationsDuty
        WHERE DutyName = @dutyName
        ORDER BY CreatedDate DESC
      `);
    return result.recordset[0];
  }
}
```

2. **Use in step**
```typescript
Then('verify duty created', async ({ db }) => {
  const duty = await AllocationQueries.getLatestDuty(db, 'MyDuty');
  expect(duty).toBeTruthy();
});
```

---

## Tips & Best Practices

### Performance Tips

1. **Run specific tests, not all**
   ```bash
   npm run _ui:run -- --grep "your-tag" # Faster than running all
   ```

2. **Use headed mode sparingly**
   ```bash
   npm run _ui:run # Headless (faster, less resource)
   npm run _ui:run -- --headed # Visible (slower, for debugging)
   ```

3. **Parallelize tests in CI**
   ```bash
   npm run test:ci # Already parallelizes across browsers
   ```

### Maintainability Tips

1. **Use Page Objects** - Don't repeat selectors in steps
2. **Use Context DTOs** - Define what data each module shares
3. **Use Test Data JSON** - Don't hardcode values in steps
4. **Use Meaningful Tags** - `@smoke`, `@regression`, `@critical`
5. **Keep Steps Simple** - One concern per step

### Debugging Tips

1. **View HTML Report**
   ```bash
   npm run report # See videos, screenshots, timeline
   ```

2. **Check Console Logs**
   - Every step prints what it's doing
   - Monitor for errors/warnings

3. **Use Playwright Inspector**
   ```bash
   npm run _ui:run -- --debug
   ```

---

## Troubleshooting

### Problem: Test can't find element

**Solution:**
```typescript
// Add explicit wait
await page.waitForSelector('selector', { timeout: 5000 });

// Or use retry
await expect(page.locator('selector')).toBeVisible({ timeout: 10000 });
```

### Problem: Environment variables not loading

**Solution:**
```bash
# Verify .env file exists
ls .env.systest

# Check file is readable
cat .env.systest | grep "UI_BASE_URL"

# Reload shell
source ~/.bashrc  (macOS/Linux)
# or
exit and reopen terminal (Windows)
```

### Problem: Database connection fails

**Solution:**
```bash
# Check DB credentials in .env
cat .env.systest | grep "DB_"

# Test connection
sqlcmd -S server_name -U sa_user -P password -d TestDatabase -Q "SELECT 1"
```

### Problem: Authentication fails

**Solution:**
```typescript
// Verify user exists in users.json
console.log(JSON.stringify(users, null, 2));

// Verify password in .env
echo $SYS_ADMIN_PASSWORD

// Check auth header generation
const creds = btoa('username:password');
console.log('Auth header:', `Basic ${creds}`);
```

---

## Next Steps for New Developers

1. ✅ **Run a existing UI test** → `npm run uidevtest`
2. ✅ **View the report** → `npm run report`
3. ✅ **Read a feature file** → Open [schedulinggroup_ui_create.feature](tests/ui/features/NP035/schedulinggroup_ui_create.feature)
4. ✅ **Read the corresponding steps** → Open [schedulinggroup_ui_create.steps.ts](tests/ui/steps/NP035/schedulinggroup_ui_create.steps.ts)
5. ✅  **Read a Page Object** → Open [ScheduledGroupPage.ts](tests/ui/page/NP035/ScheduledGroupPage.ts)
6. ✅ **Run an API test** → `npm run apitest`
7. ✅ **Write a simple test** → Follow Workflow 1 above
8. ✅ **Ask questions** → Check this guide first

---

## Quick Reference Cheat Sheet

```bash
# Setup
npm install                          # Install dependencies
npx playwright install               # Install browsers

# Run Tests
npm run test                         # Run all tests on systest
npm run test:dev                     # Run all tests on dev
npm run uidevtest                    # UI tests on dev
npm run uisystesttest                # UI tests on systest
npm run apitest                      # API tests on dev
npm run apitest:systest              # API tests on systest

# Debug
npm run _ui:run -- --headed          # Show browser
npm run _ui:run -- --debug           # Playwright Inspector
npm run report                       # View HTML report

# Filter Tests
npm run _ui:run -- --grep "pattern"  # Run matching tests
npm run _ui:run -- tests/ui/features/...feature  # Run specific file
```

---

## Document Version & Maintenance

- **Version:** 1.0
- **Last Updated:** 2026-04-05
- **Maintained By:** QA Automation Team
- **Next Review:** 2026-06-05

---

