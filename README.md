# 🚀 E2E Test Automation Framework - Complete Guide for New Users

Welcome! This guide will help you understand and use this comprehensive test automation framework.

## 📖 Quick Navigation

- [What is this framework?](#what-is-this-framework) ← Start here!
- [5-Minute Quick Start](#5-minute-quick-start)
- [Project Structure Overview](#project-structure-overview)
- [How the Framework Works](#how-the-framework-works)
- [Complete Test Execution Flow](#complete-test-execution-flow)
- [Understanding the Utils Folder](#understanding-the-utils-folder)
- [Test Data Guide](#test-data-structure--form-filling-guide)
- [Common Workflows](#common-workflows)
- [Troubleshooting](#troubleshooting)

---

# What is this framework?

This is a **BDD (Behavior-Driven Development) Test Automation Framework** using:

- **Playwright** - Modern browser automation
- **Cucumber/BDD** - Plain English test scenarios
- **TypeScript** - Type-safe automation code
- **Parallel Execution** - Run 100s of tests simultaneously
- **Database Testing** - Direct DB & API testing
- **Page Objects** - Maintainable, reusable code

### **What can you test?**

✅ **UI Tests** - Click buttons, fill forms, verify text  
✅ **API Tests** - HTTP requests, responses, status codes  
✅ **Database Tests** - Stored procedures, queries, data validation  
✅ **E2E Tests** - Complete user workflows across all layers  

### **Key Benefits**

| Feature | Benefit |
|---------|---------|
| **BDD Format** | Non-technical people can write tests in plain English |
| **Page Objects** | Update selectors in one place, tests still pass |
| **Reusable Utilities** | Form filling, JSON reading, context management built-in |
| **Parallel Execution** | Run 100 tests in 2 minutes instead of 30 minutes |
| **CI/CD Ready** | Automatic GitHub Actions integration |

---

# 5-Minute Quick Start

## Step 1: Install & Setup (2 minutes)

```bash
# Clone and navigate
git clone <repository-url>
cd Automation_E2E

# Install dependencies
npm install

# Create environment configs
# Create .env.dev and .env.systest with your URLs and credentials

# Required .env variables (example):
# UI_BASE_URL=https://your-dev-url.com
# API_BASE_URL=https://your-api-dev-url.com
# DB_HOST=localhost
# DB_USER=your_user
# DB_PASSWORD=your_password
# SYS_ADMIN_PASSWORD=your_password
# AREA_ADMIN_PASSWORD=your_password
```

## Step 2: Run Your First Test (2 minutes)

```bash
# Run UI tests with DEV environment (you'll see browser)
npm run uidevtest

# Or run API tests
npm run apitest

# Or run both
npm run test:dev
```

## Step 3: View Results (1 minute)

```bash
# Open HTML report
npm run report
```

That's it! You've run your first tests! 🎉

---

# Project Structure Overview

## What is in each folder?

```
📦 Automation_E2E
├── 📁 tests/                          ← All test code lives here
│   ├── 📁 ui/                         ← Browser/UI tests
│   │   ├── 📁 features/               ← What to test (English scenarios)
│   │   ├── 📁 steps/                  ← How to test (code)
│   │   ├── 📁 page/                   ← Page objects (UI elements)
│   │   └── 📁 fixtures/               ← Reusable test setup (login, db, etc)
│   │
│   ├── 📁 integrated/                 ← API & Database tests
│   │   ├── 📁 features/               ← What to test (API scenarios)
│   │   └── 📁 steps/                  ← How to test (API code)
│   │
│   └── 📁 utils/                      ← Helper functions everyone uses
│       ├── formFiller.ts              ← Auto-fill HTML forms
│       ├── readJson.ts                ← Load test data from files
│       ├── pageFactory.ts             ← Get page objects
│       ├── formFilledType.ts          ← Type definitions
│       └── scenarioContextManager.ts  ← Parallel test isolation
│
├── 📁 core/                           ← Framework core utilities
│   ├── 📁 api/                        ← HTTP client for API tests
│   ├── 📁 db/                         ← Database connection
│   ├── 📁 config/                     ← Environment configuration
│   └── 📁 data/
│       └── users.json                 ← User credentials and roles
│
├── 📁 workflows/                      ← Test data organized by feature
│   ├── 📁 schedulingGroup/
│   │   ├── 📁 data/                   ← JSON test data files
│   │   ├── 📁 api/                    ← API endpoints for this feature
│   │   └── 📁 db/                     ← Database queries/procedures
│   └── 📁 facility/
│       └── 📁data/
│
├── 📁 playwright-report/              ← Generated test reports
├── 📁 test-results/                   ← Test results/screenshots
│
├── 📄 package.json                    ← Dependencies & test commands
├── 📄 playwright.config.ts            ← Playwright configuration
├── 📄 tsconfig.json                   ← TypeScript configuration
└── 📄 .env.dev, .env.systest         ← Environment variables (you create)
```

### **Understanding Each Folder's Purpose**

| Folder | Purpose | What's Inside |
|--------|---------|---------------|
| `tests/ui/features/` | **What to test** (scenarios in English) | `.feature` files |
| `tests/ui/steps/` | **How to implement** those scenarios | `.steps.ts` files |
| `tests/ui/page/` | **User interface elements** (buttons, inputs, etc) | Page objects |
| `tests/utils/` | **Reusable helper functions** used by all tests | Form filler, JSON reader, etc |
| `core/` | **Framework services** (login, database, HTTP requests) | Login, DB, API clients |
| `workflows/` | **Test data organized by feature** | Scheduling group data, facility data, etc |
| `core/data/users.json` | **User credentials** (who can log in) | usernames, passwords, roles |

---

# How the Framework Works

## The 5-Step Flow

```
1. You write a test scenario in English (.feature file)
                  ↓
2. Framework matches steps to TypeScript code (.steps.ts)
                  ↓
3. Code interacts with UI/API/Database
                  ↓
4. Framework collects results (pass/fail)
                  ↓
5. You view HTML report
```

## Real Example: Creating a Scheduling Group

### **Step 1: Write Test Scenario (Plain English)**
```gherkin
# File: tests/ui/features/NP035/schedulinggroup_ui_create.feature

Feature: Scheduling Group CRUD

  Scenario: Create a new Scheduling Group
    Given user 'areaAdmin_News' is on the "Scheduled Group" page
    When the user creates a new scheduling group using "schdGroupCreate_AreaAdminNews_UIdata"
    Then the scheduling group is visible
```

### **Step 2: Map Steps to Code**
```typescript
// File: tests/ui/steps/NP035/schedulinggroup_ui_create.steps.ts

Given('user {string} is on the "Scheduled Group" page', async ({ loginAs }, userAlias: string) => {
  // loginAs = fixture that logs user in
  // getPageObject = utility to get page object
  const page = await loginAs(userAlias);
  const pageObject = getPageObject('Scheduled Group', page);
  await pageObject.open();
});

When('the user creates a new scheduling group using {string}', async ({ }, dataFile: string) => {
  // Read test data from JSON file
  const testData = await readJSON(`workflows/schedulingGroup/data/${dataFile}.json`);
  
  // Use formFiller utility to fill all form fields automatically
  await fillForm(page, testData);
});

Then('the scheduling group is visible', async ({ }) => {
  // Verify group appears in list
  await expect(page.locator(`text=${groupName}`)).toBeVisible();
});
```

### **Step 3: Access Page Elements**
```typescript
// File: tests/ui/page/NP035/ScheduledGroupPage.ts

export class ScheduledGroupPage {
  constructor(private page: Page) {}
  
  async open() {
    await this.page.goto('/mvc-app/admin/scheduling-group');
  }
  
  async createGroup() {
    await this.page.click('button:has-text("Add Group")');
  }
}
```

### **Step 4: Use Test Data**
```json
// File: workflows/schedulingGroup/data/schdGroupCreate_AreaAdminNews_UIdata.json

{
  "group_name": {
    "type": "text",
    "value": "Test Group"
  },
  "department": {
    "type": "dropdown",
    "value": "1"
  },
  "submit": {
    "type": "button"
  }
}
```

### **Step 5: View Results**
```
✅ PASSED: user 'areaAdmin_News' is on the "Scheduled Group" page
✅ PASSED: the user creates a new scheduling group
✅ PASSED: the scheduling group is visible

HTML Report → npm run report
```

---

# Complete Test Execution Flow

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
    ├── formFilledType.ts
    ├── formFiller.ts
    └── readJson.ts

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

# �️ Understanding the Utils Folder

This section explains all utility modules in `tests/utils/` to help new developers use them effectively.

---

## Overview - Utils Folder Structure

```
tests/utils/
├── formFilledType.ts              ← Type definitions for form fields
├── formFiller.ts                  ← Utility to fill HTML forms with test data
├── pageFactory.ts                 ← Page object factory pattern
├── readJson.ts                    ← Utility to read JSON test data files
└── scenarioContextManager.ts      ← Centralized context manager for parallel tests
```

---

## 1. `formFilledType.ts` - Form Field Type Definitions

### **Purpose**
Defines TypeScript interfaces for form fields so the framework knows what types of inputs exist and how to handle them.

### **What It Contains**

```typescript
export type FieldType =
  | 'text'                // Text input
  | 'number'              // Number input
  | 'textarea'            // Multi-line text
  | 'dropdown'            // Select dropdown
  | 'multiDropdown'       // Multi-select dropdown
  | 'radio'               // Radio button
  | 'checkbox'            // Checkbox
  | 'date'                // Date picker
  | 'facilityModal'       // Modal with facility selection
  | 'dualListboxModal'    // Modal with dual listbox
  | 'weeklyAvailability'  // Week availability picker
  | 'button';             // Button (for actions)

export interface FormField {
  type: FieldType;                    // Field input type
  value: string | number | string[];  // Value to fill
  optional?: boolean;                 // Is field optional?
  subValues?: string[];               // Additional values
}

export interface WeekDayAvailability {
  from: string;      // e.g., "09:00"
  to: string;        // e.g., "17:00"
  unavailable: boolean;
}
```

### **When to Use**
- When creating test data JSON files
- When defining new form field types
- For TypeScript type checking

### **Example**

```typescript
// In your test data JSON file
const formData: Record<string, FormField> = {
  "group_name": {
    type: "text",
    value: "My Group",
    optional: false
  },
  "department": {
    type: "dropdown",
    value: "1"
  },
  "services": {
    type: "multiDropdown",
    value: ["1", "2", "3"]
  }
};
```

---

## 2. `formFiller.ts` - Programmatic Form Filling

### **Purpose**
Automatically fills HTML forms with values from test data, handling all field types (text, dropdowns, checkboxes, date pickers, etc.).

### **Key Functions**

| Function | Purpose | Input | Output |
|----------|---------|-------|--------|
| `fillForm()` | Fills all fields in a form | Page object + form data | Boolean (success/fail) |
| `selectStandardDropdown()` | Selects value in HTML select | Page + fieldId + value | void |
| `selectChosenDropdown()` | Selects in Chosen library dropdown | Page + fieldId + value | void |
| `selectMultiDropdown()` | Selects multiple options | Page + fieldId + values[] | void |
| `pickDate()` | Fills date picker | Page + fieldId + dateStr | void |

### **When to Use**
- Filling out forms in UI tests
- Instead of manually clicking each field
- When you want reusable form-filling logic

### **Example**

```typescript
import { fillForm } from '@helpers/formFiller';
import { readJSON } from '@helpers/readJson';

async createSchedulingGroup(filename: string) {
  // Load test data
  const testData = await readJSON(`workflows/schedulingGroup/data/${filename}.json`);
  
  // Open form modal
  await this.page.click('button:has-text("Add Group")');
  await this.page.waitForSelector('#facebox');
  
  // Fill all form fields automatically!
  await fillForm(this.page, testData);
  
  // Submit
  await this.page.click('button[type="submit"]');
}
```

### **Supported Field Types**

| Type | Example | How It Fills |
|------|---------|------------|
| `text` | Name, Email | Types value into input |
| `textarea` | Description | Types multi-line text |
| `dropdown` | Status | Selects option by value |
| `multiDropdown` | Tags | Selects multiple options |
| `checkbox` | Agree | Checks/unchecks based on value |
| `radio` | Gender | Clicks associated label |
| `date` | Start Date | Opens picker and selects date |
| `button` | Submit | Clicks button |

---

## 3. `readJson.ts` - JSON Data File Reader

### **Purpose**
Reads JSON test data files from disk so you can use test data in your tests.

### **Key Function**

```typescript
export async function readJSON(filePath: string): Promise<Record<string, any>>
```

### **When to Use**
- Loading test data for form filling
- Reading test configuration
- Loading user data or test fixtures

### **Examples**

```typescript
import { readJSON } from '@helpers/readJson';

// Example 1: Load form data
const formData = await readJSON('workflows/schedulingGroup/data/schdGroupCreate_AreaAdminNews_UIdata.json');

// Example 2: Load users
const users = await readJSON('core/data/users.json');

// Example 3: Using relative paths
const data = await readJSON('path/to/data.json');
```

### **How It Works**

```typescript
// Accepts absolute or relative paths
const formData = await readJSON('workflows/schedulingGroup/data/mydata.json');

// Automatically resolves from workspace root:
// → C:\BBC_Automation\E2E_Framework\Automation_E2E\workflows\...
```

### **Return Value**

```typescript
// Returns parsed JSON as object
{
  "field1": { type: "text", value: "data1" },
  "field2": { type: "dropdown", value: "0" }
}
```

---

## 4. `pageFactory.ts` - Page Object Factory

### **Purpose**
Creates and provides page objects using the Factory pattern. Centralizes all page object mappings.

### **Key Functions**

| Function | Purpose | Example |
|----------|---------|---------|
| `getPageObject()` | Get page instance by name | `getPageObject('Scheduled Group', page)` |
| `getSupportedPages()` | List all available pages | `['Scheduled Group', 'Scheduling Team']` |
| `registerPage()` | Register new page dynamically | `registerPage('New Page', NewPageClass)` |

### **When to Use**
- Getting a page object in step definitions
- Adding new pages to the framework
- When you need type-safe page access

### **Example**

```typescript
import { getPageObject, getSupportedPages } from '@helpers/pageFactory';

// Step Definition
Given('user is on the {string} page', async ({ page }, pageName: string) => {
  // Get page object by name
  const pageObject = getPageObject(pageName, page);
  
  // Use the page object
  await pageObject.open();
  console.log(`Opened page: ${pageName}`);
});
```

### **Adding New Pages**

**Step 1: Create your page object**
```typescript
// tests/ui/page/NP035/NewPage.ts
export class NewPage {
  constructor(private page: Page) {}
  async open() {
    await this.page.goto('/new-page');
  }
}
```

**Step 2: Register it in pageFactory.ts**
```typescript
import { NewPage } from '@pages/NP035/NewPage';

const pageFactory: Record<string, (page: Page) => PageObject> = {
  "Scheduled Group": (page: Page) => new ScheduledGroupPage(page),
  "New Page": (page: Page) => new NewPage(page),  // ← Add here
};
```

**Step 3: Use in your feature file**
```gherkin
Given user is on the "New Page" page
```

---

## 5. `scenarioContextManager.ts` - Parallel Test Context Management

### **Why It's Needed (The Problem It Solves)**

Imagine running 10 scheduling group tests in **parallel** (at the same time):

❌ **Without Context Manager:**
```
Test 1: Creates group "Team A"
Test 2: Creates group "Team B"
Test 3: Creates group "Team C"

All store groupName in same variable → 💥 COLLISION!
Test 1 reads groupName → Gets "Team C" instead of "Team A"
Test fails randomly ❌
```

✅ **With Context Manager (Our Solution):**
```
Test 1: contextStore[ID=1] → groupName = "Team A" ✓
Test 2: contextStore[ID=2] → groupName = "Team B" ✓
Test 3: contextStore[ID=3] → groupName = "Team C" ✓

Each test has its OWN isolated storage → No collision!
Tests run fast without interfering with each other ✅
```

### **Purpose**
Provides **isolated context per test** to prevent state contamination when running tests in parallel. Each test automatically gets its own storage for page, fixtures, user data, and custom values. Uses a **Proxy pattern** to route all context reads/writes to the correct test's storage.

### **How It Works - The Proxy Pattern**

```typescript
// The magic: scenarioContext proxy automatically routes to correct test's context

When Test 1 runs:
scenarioContext.page = page1
  ↓
Proxy detects: context for Test ID 1
  ↓
Stores in contextStore[1].page = page1  ✓

When Test 2 runs (same time):
scenarioContext.page = page2
  ↓
Proxy detects: context for Test ID 2
  ↓
Stores in contextStore[2].page = page2  ✓

When Test 1 later reads:
const myPage = scenarioContext.page
  ↓
Proxy detects: current test is 1
  ↓
Returns contextStore[1].page = page1  ✓ (Gets correct page!)
```

### **Real-World E2E Workflow - With Multiple Tests Running Parallel**

**Setup:** Running 3 scheduling group tests simultaneously

```typescript
// File: tests/ui/steps/NP035/schedulinggroup_ui_create.steps.ts

// ─────────────────────────────────────────────────────────────
// TEST 1: SystemAdmin creates group
// ─────────────────────────────────────────────────────────────
Given('user "systemAdmin" is on the Scheduled Group page', async ({ }) => {
  const page = await loginAs('systemAdmin');
  
  // Each test automatically gets own ID from proxy
  // Test 1 → ID: 1
  scenarioContext.page = page;  // Stored in contextStore[1]
  scenarioContext.currentUserAlias = 'systemAdmin';  // Stored in contextStore[1]
});

When('creates scheduling group using "TestData1"', async ({ }) => {
  const groupName = `Team-SystemAdmin-${Date.now()}`;
  
  // This is Test 1's data
  scenarioContext.lastCreatedGroupName = groupName;  // contextStore[1]
  scenarioContext.scheduledGroupPage = pageObject1;  // contextStore[1]
});

Then('scheduling group is visible to creator', async ({ }) => {
  // Test 1 retrieves ITS OWN data (not Test 2's or Test 3's)
  const groupName = scenarioContext.lastCreatedGroupName;  // contextStore[1]
  const page = scenarioContext.page;  // contextStore[1]
  
  await expect(page.locator(`text=${groupName}`)).toBeVisible();  // ✅ Correct data!
});

// ─────────────────────────────────────────────────────────────
// TEST 2: AreaAdmin creates group (runs AT SAME TIME as Test 1)
// ─────────────────────────────────────────────────────────────
Given('user "areaAdmin_News" is on the Scheduled Group page', async ({ }) => {
  const page = await loginAs('areaAdmin_News');
  
  // Automatically: Test 2 → ID: 2
  scenarioContext.page = page;  // Stored in contextStore[2]
  scenarioContext.currentUserAlias = 'areaAdmin_News';  // Stored in contextStore[2]
});

When('creates scheduling group using "TestData2"', async ({ }) => {
  const groupName = `Team-AreaAdmin-${Date.now()}`;
  
  // This is Test 2's data - separate from Test 1!
  scenarioContext.lastCreatedGroupName = groupName;  // contextStore[2]
  scenarioContext.scheduledGroupPage = pageObject2;  // contextStore[2]
});

Then('scheduling group is visible to creator', async ({ }) => {
  // Test 2 retrieves ITS OWN data
  const groupName = scenarioContext.lastCreatedGroupName;  // contextStore[2]
  const page = scenarioContext.page;  // contextStore[2]
  
  await expect(page.locator(`text=${groupName}`)).toBeVisible();  // ✅ Correct data!
});
```

**Result:** Both tests run at same time, each with their own isolated storage. No cross-contamination!

```
┌─ Test 1 (Parallel Worker 1) ──────┐
│ contextStore[1]:                  │
│  - page: Test1Browser             │
│  - lastCreatedGroupName: TeamA     │
│  - currentUserAlias: systemAdmin   │
└───────────────────────────────────┘

┌─ Test 2 (Parallel Worker 2) ──────┐
│ contextStore[2]:                  │
│  - page: Test2Browser             │
│  - lastCreatedGroupName: TeamB     │
│  - currentUserAlias: areaAdmin     │
└───────────────────────────────────┘

✓ No conflicts - tests pass!
✓ Memory efficient - auto-cleanup after 100 tests
```

### **Key Functions**

| Function | Purpose | Returns | Use Case |
|----------|---------|---------|----------|
| `initializeScenarioContext()` | Create new context for test | `{ id: number }` | Called once per test in fixture |
| `scenarioContext` | Access current test's context (all properties) | Context object | Store/retrieve page, group names, data |
| `cleanupContext(testId)` | Manual cleanup of specific test context | void | In AfterAll hooks if needed |
| `getContextStats()` | Monitor context usage/memory | Stats object | Debugging parallel test issues |

### **ScenarioContext Interface - What You Can Store**

```typescript
export interface ScenarioContext {
  page: any | null;                        // Playwright page object
  scheduledGroupPage?: ScheduledGroupPage;  // Page object for scheduling group
  lastCreatedGroupName?: string;            // Group name from Create step
  lastUpdatedGroupName?: string;            // Group name from Edit step
  currentUserAlias?: string;                // Current logged-in user (systemAdmin, areaAdmin_News)
  lastUpdatedNotes?: string;                // Updated notes from Edit step
  [key: string]: any;                       // Store ANY custom data you need
}
```

### **When to Use Context Manager**

| Scenario | Solution | Example |
|----------|----------|---------|
| Store page object created in Given step | `scenarioContext.page = page` | "Had no page object in When/Then" → Solved! |
| Pass group name from When to Then step | `scenarioContext.lastCreatedGroupName = name` | "Need name created in When step in Then step" → Solved! |
| Track current user across steps | `scenarioContext.currentUserAlias = 'systemAdmin'` | "Need to know who is logged in later" → Solved! |
| Store data from API response | `scenarioContext.apiResponse = response` | "Need to verify API response in UI later" → Solved! |
| Parallel tests colliding | Context isolation | "Tests fail when run parallel" → Solved! |

### **Auto-Cleanup & Memory Management**

```typescript
// Automatic memory optimization
const MAX_CONTEXTS = 100;

// How it works:
// Test 1 runs → contextStore[1] created
// Test 2 runs → contextStore[2] created
// ...
// Test 101 runs → contextStore[101] created
//                → contextStore[1] auto-deleted (oldest)
//                → Memory stays low ✓

// Result: Only last 100 test contexts in memory
// Prevents "Out of Memory" errors in long test runs
```

### **Monitoring Context Health**

```typescript
import { getContextStats } from '@helpers/scenarioContextManager';

afterEach(() => {
  const stats = getContextStats();
  console.log(`📊 Contexts in memory: ${stats.totalContexts}/${stats.maxContexts}`);
  console.log(`📍 Current test ID: ${stats.currentTestId}`);
  
  // Example output:
  // 📊 Contexts in memory: 47/100
  // 📍 Current test ID: 47
});
```

### **Using Context for Future Stories - Best Practices**

**When adding NEW test steps, follow this pattern:**

```typescript
// 🟢 GOOD - Use context to pass data between steps
Given('user is on page', async ({ page }) => {
  scenarioContext.page = page;  // Store for later steps
});

When('user creates item', async ({ }) => {
  const itemId = await createItem(scenarioContext.page);
  scenarioContext.lastCreatedItemId = itemId;  // Store for verification later
});

Then('item appears in list', async ({ }) => {
  // Use stored data
  const itemId = scenarioContext.lastCreatedItemId;  // ✓ Isolated per test
  await verifyItemExists(scenarioContext.page, itemId);
});

// 🔴 DON'T - Don't use global variables
let globalPage;  // ❌ Cross-test contamination!
let globalItemId;  // ❌ Shared between parallel tests!

Given('user is on page', async ({ page }) => {
  globalPage = page;  // ❌ Test 1 and Test 2 fight over this
});
```

### **Usage in Tests - Complete Example**

```typescript
import { scenarioContext } from '@helpers/scenarioContextManager';

// Step 1: Store page object
When('user navigates to scheduling group page', async ({ loginAs }) => {
  const page = await loginAs('systemAdmin');
  scenarioContext.page = page;
});

// Step 2: Store created item details
When('creates a scheduling group named {string}', async ({ }, groupName: string) => {
  scenarioContext.lastCreatedGroupName = groupName;
  scenarioContext.pageObject = new ScheduledGroupPage(scenarioContext.page);
});

// Step 3: Use stored values in verification
Then('the group {string} is visible in the list', async ({ }, groupName: string) => {
  const page = scenarioContext.page;  // ← Retrieved automatically from correct test
  const storedName = scenarioContext.lastCreatedGroupName;  // ← Test-isolated data
  
  if (groupName === storedName) {
    await expect(page.locator(`text=${groupName}`)).toBeVisible();
  }
});

// Step 4: Delete created item (cleanup)
Then('clean up by deleting the group', async ({ }) => {
  const groupName = scenarioContext.lastCreatedGroupName;  // ← Still have the data
  const pageObject = scenarioContext.pageObject;
  
  await pageObject.deleteGroup(groupName);
  // Context auto-cleans after test ends
});
```

---

## Utils Quick Reference Guide

### **How to Use Each Utility**

| Task | Utility | Example |
|------|---------|---------|
| Fill a form | `formFiller.ts` | `await fillForm(page, testData)` |
| Load test data | `readJson.ts` | `await readJSON('path/data.json')` |
| Get page object | `pageFactory.ts` | `getPageObject('Scheduled Group', page)` |
| Store test context | `scenarioContextManager.ts` | `scenarioContext.page = page` |
| Define field types | `formFilledType.ts` | Use in test data JSON |

---

## Complete Utils Execution Example

```typescript
// Step 1: Import utilities
import { fillForm } from '@helpers/formFiller';
import { readJSON } from '@helpers/readJson';
import { getPageObject } from '@helpers/pageFactory';
import { scenarioContext } from '@helpers/scenarioContextManager';

// Step 2: Use utilities in your step
When('user creates scheduling group with {string}', async ({ loginAs }, userAlias: string, dataFile: string) => {
  // Get page object
  const page = await loginAs(userAlias);
  const pageObject = getPageObject('Scheduled Group', page);
  
  // Read test data
  const testData = await readJSON(`workflows/schedulingGroup/data/${dataFile}.json`);
  
  // Open form
  await pageObject.openCreateForm();
  
  // Fill form using formFiller
  await fillForm(page, testData);
  
  // Store context for next steps
  scenarioContext.page = page;
  scenarioContext.lastGroupName = testData.group_name.value;
  scenarioContext.scheduledGroupPage = pageObject;
  
  console.log('✅ Scheduling group created successfully!');
});
```

---

# �📋 Test Data Structure & Form Filling Guide

This section explains how test data JSON files work with `formFiller.ts` and how to create your own test data files.

## Understanding Test Data Files

### **What is a Test Data File?**

A test data file is a **JSON file** that contains all the form field values needed to fill a specific form during UI testing.

**Example:** `workflows/schedulingGroup/data/schdGroupCreate_AreaAdminNews_UIdata.json`

```json
{
  "group_name": {
    "type": "text",
    "value": "Test Scheduling Group_0015",
    "required": true
  },
  "allocations_menu": {
    "type": "dropdown",
    "value": "0",
    "label": "No",
    "required": true
  },
  "notes": {
    "type": "textarea",
    "value": "This is a test scheduling group created for UI automation testing purposes.",
    "required": true
  },
  "submit-create-scheduling-form": {
    "type": "button",
    "value": "Submit"
  }
}
```

---

## JSON Structure Explained

### **Field Properties**

| Property | Required | Description | Example |
|----------|----------|-------------|---------|
| `type` | ✅ Yes | The HTML input type or control type | `"text"`, `"dropdown"`, `"button"` |
| `value` | ✅ Yes | The actual value to enter/select | `"Test Group"`, `"0"`, `"Submit"` |
| `label` | ❌ No | Display label (for documentation only) | `"No"`, `"Yes"` |
| `required` | ❌ No | Whether field is mandatory | `true`, `false` |

---

## How Field IDs Map to DOM Elements

### **Field ID = HTML Element Locator**

The **key name** (e.g., `"group_name"`) is the **field ID** that maps to the HTML element in the browser:

```
JSON:        "group_name": { ... }
                ↓
HTML:        <input id="group_name" type="text" />
                ↓
Locator:     #group_name
```

**How `formFiller.ts` finds elements:**

```typescript
// formFiller.ts - Line 220-227
const selectors = [`#${fieldId}`, `[name="${fieldId}"]`];
// Tries to find: #group_name OR [name="group_name"]
```

**The framework tries multiple locators:**
1. **ID selector:** `#group_name` (most common)
2. **Name selector:** `[name="group_name"]` (fallback)

---

## Mapping Fields in Your Application

### **Step 1: Inspect the HTML Form**

Open your application and inspect the form you want to test:

```html
<!-- In the browser, right-click → Inspect Element -->
<input id="group_name" type="text" placeholder="Group Name" />
<select id="allocations_menu">
  <option value="0">No</option>
  <option value="1">Yes</option>
</select>
<textarea id="notes"></textarea>
<button id="submit-create-scheduling-form">Submit</button>
```

### **Step 2: Create Test Data File**

For each form element, create a JSON entry using the HTML `id` attribute:

```json
{
  "group_name": {
    "type": "text",
    "value": "My Test Group"
  },
  "allocations_menu": {
    "type": "dropdown",
    "value": "0"
  },
  "notes": {
    "type": "textarea",
    "value": "Test notes"
  },
  "submit-create-scheduling-form": {
    "type": "button"
  }
}
```

---

## Field Types & How formFiller.ts Handles Them

### **Text Input**

**HTML:**
```html
<input id="group_name" type="text" />
```

**JSON:**
```json
{
  "group_name": {
    "type": "text",
    "value": "Test Scheduling Group",
    "required": true
  }
}
```

**How it's filled (formFiller.ts):**
```typescript
case "text":
case "number":
case "textarea":
  await fillTextField(page, fieldId, String(value));  // ← Types the value
  break;
```

---

### **Dropdown (Standard HTML Select)**

**HTML:**
```html
<select id="allocations_menu">
  <option value="0">No</option>
  <option value="1">Yes</option>
</select>
```

**JSON:**
```json
{
  "allocations_menu": {
    "type": "dropdown",
    "value": "0",
    "label": "No"
  }
}
```

**How it's filled (formFiller.ts):**
```typescript
case "dropdown":
  const isChosenDropdown = await page.locator(`#${fieldId}_chosen`).count() > 0;
  if (isChosenDropdown) {
    await selectChosenDropdown(page, fieldId, value as string);  // ← Chosen library
  } else if (isStandardSelect) {
    await selectStandardDropdown(page, fieldId, value as string);  // ← Standard select
  }
  break;
```

**Note:** Test data should use the **option value**, not the displayed text:
- ✅ `"value": "0"` (correct - matches `<option value="0">`)
- ❌ `"value": "No"` (incorrect - this is the display text)

---

### **Multi-Select Dropdown**

**HTML:**
```html
<select id="services" multiple>
  <option value="1">Service A</option>
  <option value="2">Service B</option>
  <option value="3">Service C</option>
</select>
```

**JSON:**
```json
{
  "services": {
    "type": "multiDropdown",
    "value": ["1", "2"]
  }
}
```

**How it's filled (formFiller.ts):**
```typescript
case "multiDropdown":
  await selectMultiDropdown(page, fieldId, value as string[]);  // ← Array of values
  break;
```

---

### **Button**

**HTML:**
```html
<button id="submit-create-scheduling-form">Submit</button>
```

**JSON:**
```json
{
  "submit-create-scheduling-form": {
    "type": "button",
    "value": "Submit"
  }
}
```

**How it's filled (formFiller.ts):**
```typescript
case "button":
  const button = page.locator(`#${fieldId}`).first();
  if (await button.isVisible()) {
    await button.click();  // ← Clicks the button
  }
  break;
```

---

### **Checkbox**

**HTML:**
```html
<input id="accept_terms" type="checkbox" />
<label for="accept_terms">I accept the terms</label>
```

**JSON:**
```json
{
  "accept_terms": {
    "type": "checkbox",
    "value": true
  }
}
```

**How it's filled (formFiller.ts):**
```typescript
case "checkbox":
  const checked = await page.isChecked(`#${fieldId}`);
  if (value && !checked) await page.check(`#${fieldId}`);  // ← Check
  if (!value && checked) await page.uncheck(`#${fieldId}`);  // ← Uncheck
  break;
```

---

### **Radio Button**

**HTML:**
```html
<input id="type_standard" type="radio" name="group_type" />
<label for="type_standard">Standard</label>
<input id="type_advanced" type="radio" name="group_type" />
<label for="type_advanced">Advanced</label>
```

**JSON:**
```json
{
  "type_standard": {
    "type": "radio",
    "value": "Standard"
  }
}
```

**How it's filled (formFiller.ts):**
```typescript
case "radio":
  await page.locator(`label[for="${fieldId}"]`).click();  // ← Clicks associated label
  break;
```

---

### **Date Picker**

**HTML:**
```html
<input id="start_date" type="text" />
```

**JSON:**
```json
{
  "start_date": {
    "type": "date",
    "value": "2024-03-15"
  }
}
```

**Format:** `YYYY-MM-DD`

**How it's filled (formFiller.ts):**
```typescript
case "date":
  await pickDate(page, fieldId, value as string);  // ← String format: "2024-03-15"
  break;
```

---

### **Textarea**

**HTML:**
```html
<textarea id="notes"></textarea>
```

**JSON:**
```json
{
  "notes": {
    "type": "textarea",
    "value": "This is a test scheduling group created for UI automation testing purposes."
  }
}
```

**How it's filled (formFiller.ts):**
```typescript
case "textarea":
  await fillTextField(page, fieldId, String(value));  // ← Same as text input
  break;
```

---

## Creating Your Own Test Data File

### **Step-by-Step Guide**

#### **1. Identify All Form Fields**

Inspect your form in the browser and note the HTML `id` attributes:

```html
<form>
  <input id="user_email" type="email" />
  <select id="department">
    <option value="sales">Sales</option>
    <option value="it">IT</option>
  </select>
  <textarea id="feedback"></textarea>
  <button id="save-user">Save</button>
</form>
```

#### **2. Create JSON File**

Create a new JSON file in `workflows/[feature]/data/`:

```json
{
  "user_email": {
    "type": "text",
    "value": "testuser@example.com",
    "required": true
  },
  "department": {
    "type": "dropdown",
    "value": "sales",
    "label": "Sales",
    "required": true
  },
  "feedback": {
    "type": "textarea",
    "value": "Great product!",
    "required": false
  },
  "save-user": {
    "type": "button"
  }
}
```

#### **3. Use in Your Test**

```typescript
async createUser(filename: string = 'schdGroupData') {
  const jsonData = await readJSON(`workflows/user/data/${filename}.json`);
  await fillForm(this.page, jsonData);  // ← Automatically fills all fields!
}
```

---

## Best Practices

| Practice | ✅ Do | ❌ Don't |
|----------|-------|---------|
| **Field IDs** | Use exact HTML `id` attribute | Invent IDs that don't exist |
| **Dropdown values** | Use option `value` attribute | Use display text |
| **Dates** | Use `"YYYY-MM-DD"` format | Use other date formats |
| **Optional fields** | Add `"required": false` | Assume all fields are required |
| **Large values** | Split into multiple lines | Put everything on one line |
| **Field naming** | Use snake_case matching HTML | Use camelCase in JSON |

**Example of good formatting:**

```json
{
  "field_id": {
    "type": "text",
    "value": "Value can span multiple lines if needed",
    "required": true
  }
}
```

---

## Troubleshooting

### **"Field not found" Error**

```
Error filling field "group_name": Field "group_name" not found
```

**Solution:** Check that the HTML `id` matches exactly:
- Inspect element: Right-click → Inspect
- Copy the exact `id` attribute: `<input id="group_name" />`
- Use in JSON: `"group_name": { ... }`

### **Dropdown won't select**

```
Error: Option with text "No" not found in select
```

**Solution:** Use dropdown option **value**, not display text:
- ✅ `"value": "0"` (matches `<option value="0">No</option>`)
- ❌ `"value": "No"` (use only option's displayed text)

### **Button won't click**

```
Error: Button "submit-button" not visible
```

**Solution:** Ensure button ID is correct and button is visible:
- Check `<button id="submit-button">Submit</button>`
- Make sure button is not hidden by modal overlay
- Check if `optional: true` is needed

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
