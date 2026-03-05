# BBC Allocate - Playwright BDD UI Testing Framework

Complete guide to understanding, setting up, and running the entire testing framework.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Project Structure](#project-structure)
4. [Initial Setup](#initial-setup)
5. [Environment Configuration](#environment-configuration)
6. [Form Filling System](#form-filling-system)
7. [Page Objects & Fixtures](#page-objects--fixtures)
8. [Test Execution](#test-execution)
9. [Writing Tests](#writing-tests)
10. [CI/CD Pipeline](#cicd-pipeline)
11. [Troubleshooting](#troubleshooting)

---

## Project Overview

This is a **Playwright-based BDD (Behavior-Driven Development)** framework for testing the BBC Allocate application. It combines:

- **Playwright** - Modern browser automation library
- **Playwright-BDD** - Gherkin feature files (.feature)
- **TypeScript** - Type-safe test code
- **Page Object Model** - Organized, maintainable test code
- **Fixtures** - Reusable test setup (database, pages, authentication)
- **Environment-Wise Execution** - Run tests against different environments (dev, systest, staging, etc.)

### Tech Stack

```
Node.js (v18+)
├── Playwright (Browser automation)
├── Playwright-BDD (Gherkin support)
├── TypeScript (Type safety)
├── MSSQL (Database testing)
├── Dotenv (Configuration management)
└── Cross-env (Windows compatibility)
```

---

## Prerequisites

### System Requirements

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **NPM** v9 or higher (comes with Node.js)
- **Git** for version control
- **Windows PowerShell** or **Bash terminal**
- **Browsers** (Playwright installs Chromium, Firefox, WebKit automatically)

### Check Installation

```bash
node --version   # Should show v18.0.0 or higher
npm --version    # Should show v9.0.0 or higher
git --version    # Should show git version info
```

---

## Project Structure

```
poc_bbc/
├── core/                              # Core application code
│   ├── api/
│   │   └── apiClient.ts              # API client for making requests
│   ├── config/
│   │   └── envConfig.ts              # Environment configuration loader
│   ├── data/
│   │   └── users.json                # Test user data
│   └── db/
│       ├── connection.ts             # Database connection setup
│       ├── dbseed.ts                 # Seed test data
│       ├── executeSp.ts              # Execute stored procedures
│       └── queries.ts                # Database queries
│
├── tests/                             # All test files
│   ├── fixtures/                      # Reusable test setup
│   │   ├── correlation.fixture.ts    # Correlation ID fixture
│   │   ├── db.fixture.ts             # Database fixture
│   │   ├── pages.fixture.ts          # Page objects fixture
│   │   └── test.fixture.ts           # Main test fixture
│   │
│   ├── integrated/                    # Integration tests
│   │   ├── db/                        # Database tests
│   │   └── features/
│   │
│   ├── ui/                            # UI tests
│   │   ├── features/                  # Feature files (.feature - human-readable tests)
│   │   │   ├── NP001/
│   │   │   │   └── facility_booking.feature
│   │   │   └── NP035/
│   │   │       └── schedulingteam_create.feature
│   │   │
│   │   ├── page/                      # Page Object Model classes
│   │   │   ├── NP001/
│   │   │   │   └── FacilityPage.ts
│   │   │   └── NP035/
│   │   │       └── ScheduledTeamPage.ts
│   │   │
│   │   ├── steps/                     # Step definitions (Gherkin → Code mapping)
│   │   │   ├── NP001/
│   │   │   │   └── facility_booking.steps.ts
│   │   │   └── NP035/
│   │   │       └── schedulingteam_create.steps.ts
│   │   │
│   │   └── utils/                     # Utility functions
│   │       ├── formFiller.ts          # Generic form filling utility
│   │       └── readJson.ts            # JSON data reading
│   │
│   └── types/
│       └── formField.ts               # TypeScript interfaces for form fields
│
├── workflows/                         # Test data organized by feature
│   ├── facilities/
│   │   ├── data/
│   │   │   └── facilityFormData.json  # Facility test data
│   │   └── db/
│   │       └── queries/
│   │
│   └── schedulingTeam/
│       ├── api/
│       │   └── view.api.ts
│       ├── data/
│       │   ├── payloads.json
│       │   └── schdTeamData.json
│       └── db/
│
├── .env                               # Local environment config (gitignored)
├── .env.dev                           # DEV environment config (gitignored)
├── .env.systest                       # SYSTEST environment config (gitignored)
├── .env.example                       # Template for new environments
│
├── playwright.config.ts               # Playwright configuration
├── package.json                       # NPM dependencies and scripts
├── tsconfig.json                      # TypeScript configuration
│
├── .gitignore                         # Git ignore rules
├── README.md                          # This file
├── ENVIRONMENT_SETUP.md               # Environment setup guide
└── GITIGNORE_SETUP.md                 # .gitignore explanation
```

---

## Initial Setup

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd poc_bbc
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- Playwright (browser automation)
- Playwright-BDD (Gherkin support)
- TypeScript (type checking)
- MSSQL (database driver)
- Dotenv (env config)
- Cross-env (Windows env support)

### Step 3: Install Browsers

```bash
npx playwright install
```

Downloads Chromium, Firefox, and WebKit browsers.

### Step 4: Verify Installation

```bash
npm run facilitytest:systest
```

If successful, a test should run and pass (or show appropriate test failures).

---

## Environment Configuration

### Understanding Environments

Different environments = different servers and credentials:

| Environment | API URL | UI URL | Database | When to Use |
|-------------|---------|--------|----------|------------|
| **dev** | https://allocate-**dev**-wp... | https://allocate-**dev**-wp... | dev-clus15 | Development testing |
| **systest** | https://allocate-**systest**-dbr... | https://allocate-**systest**-dbr... | dev-clus15 | System testing |
| **staging** | https://allocate-**staging**... | https://allocate-**staging**... | staging-db | Pre-production testing |
| **prod** | https://allocate-**prod**... | https://allocate-**prod**... | prod-db | Production validation |

### Configuration Files

#### `.env.example` (Template - Safe to Commit)
```env
# Template showing all required variables
DB_AUTH_TYPE=sql
DB_HOST=your-db-host.national.core.bbc.co.uk
API_BASE_URL=https://your-api-url.national.core.bbc.co.uk/api
UI_BASE_URL=https://your-ui-url.national.core.bbc.co.uk
SYS_ADMIN_PASSWORD=your-system-admin-password
AREA_ADMIN_PASSWORD=your-area-admin-password
ENVIRONMENT=dev
```

#### `.env.dev` (DEV Config - Gitignored)
```env
DB_AUTH_TYPE=sql
DB_HOST=dev-clus15-lsn1.national.core.bbc.co.uk
DB_NAME=BBCSchedules_WP
DB_USER=ALLOCATE-D
DB_PASSWORD=ALLOCATE-D1
API_BASE_URL=https://allocate-dev-wp.national.core.bbc.co.uk/api
UI_BASE_URL=https://allocate-dev-wp.national.core.bbc.co.uk
SYS_ADMIN_PASSWORD=Jr.
AREA_ADMIN_PASSWORD=BBC@2025@
ENVIRONMENT=dev
```

#### `.env.systest` (SYSTEST Config - Gitignored)
Similar to `.env.dev` but pointing to systest URLs.

### How It Works

1. **Load Config**: When you run a test, `playwright.config.ts` reads the `ENVIRONMENT` variable
2. **Select File**: Loads `.env.{ENVIRONMENT}` (e.g., `.env.dev`, `.env.systest`)
3. **Apply Config**: Sets URLs, database connection, credentials for tests
4. **Run Tests**: Tests use these values to connect to the correct environment

```
You type: npm run facilitytest:dev
     ↓
cross-env sets ENVIRONMENT=dev
     ↓
playwright.config.ts loads .env.dev
     ↓
Tests read UI_BASE_URL from .env.dev
     ↓
Tests run against https://allocate-dev-wp.national.core.bbc.co.uk
```

### Adding a New Environment

**Step 1:** Create `.env.staging`

```env
DB_AUTH_TYPE=sql
DB_HOST=staging-db.national.core.bbc.co.uk
DB_NAME=BBCSchedules_WP
DB_USER=staging-user
DB_PASSWORD=staging-password
API_BASE_URL=https://allocate-staging.national.core.bbc.co.uk/api
UI_BASE_URL=https://allocate-staging.national.core.bbc.co.uk
SYS_ADMIN_PASSWORD=staging-password
AREA_ADMIN_PASSWORD=staging-password
ENVIRONMENT=staging
```

**Step 2:** Add npm scripts to `package.json`

```json
"scripts": {
  "facilitytest:staging": "cross-env ENVIRONMENT=staging npm run facilitytest",
  "uitest:staging": "cross-env ENVIRONMENT=staging npm run uitest",
  "schdtest:staging": "cross-env ENVIRONMENT=staging npm run schdtest"
}
```

**Step 3:** Run tests

```bash
npm run facilitytest:staging
```

---

## Form Filling System

### Overview

The form filler is a **generic utility** that fills any form based on JSON configuration. It handles:
- Text inputs
- Dropdowns (standard HTML and Chosen dropdowns)
- Multi-select dropdowns
- Radio buttons
- Checkboxes
- Date pickers
- Modals
- Weekly availability schedules
- Dual listboxes

### Form Field Types

Each form field has a `type` that determines how it's filled.

#### FormField Interface

`tests/types/formField.ts`:

```typescript
export interface FormField {
  type: 'text' | 'number' | 'textarea' | 'dropdown' | 'multiDropdown' |
        'radio' | 'checkbox' | 'date' | 'facilityModal' | 
        'weeklyAvailability' | 'dualListboxModal' | 'button';
  value: string | string[] | Record<string, any> | boolean;
  optional?: boolean;        // If true, doesn't warn if field not found
  subValues?: string[];      // For modals with sub-options
}
```

### Form Data Example

`workflows/facilities/data/facilityFormData.json`:

```json
{
  "facility_frm": {
    "type": "text",
    "value": "Test Facility_19"
  },
  "active_from_frm": {
    "type": "date",
    "value": "2026-03-14"
  },
  "restrict_bookers_frm": {
    "type": "multiDropdown",
    "value": ["5 Live Auto", "Automation"]
  },
  "provider_type_frm": {
    "type": "dropdown",
    "value": "Internal"
  },
  "facility_availability": {
    "type": "weeklyAvailability",
    "value": {
      "monday": {"from": "09:00", "to": "13:00", "unavailable": true},
      "tuesday": {"from": "09:00", "to": "17:00", "unavailable": true}
    }
  }
}
```

### Form Filler Functions

`tests/utils/formFiller.ts`:

#### Main Function: `fillForm()`

```typescript
export async function fillForm(
  page: Page,
  formData: Record<string, FormField>
) {
  for (const [fieldId, field] of Object.entries(formData)) {
    // Detects field type and calls appropriate handler
    // Handles errors gracefully for optional fields
  }
}
```

#### Type-Specific Handlers

**Text/Number/Textarea:**
```typescript
await page.fill(`#${fieldId}`, String(value));
```

**Standard Dropdown:**
```typescript
const select = page.locator(`#${fieldId}`);
await select.selectOption(value);
```

**Chosen Dropdown (Single-Select):**
```typescript
const container = page.locator(`#${fieldId}_chosen`);
await container.click();
const searchInput = container.locator(".chosen-search input");
await searchInput.fill(value);
// Click the matching option
await container
  .locator(".chosen-results li.active-result")
  .filter({ hasText: value })
  .first()
  .click();
```

**Multi-Dropdown (Chosen Multi-Select):**
```typescript
const container = page.locator(`#${fieldId}_chosen`);
await container.click();
const searchInput = container.locator(".chosen-search input");

for (const val of values) {
  await searchInput.fill(val);
  // Click and clear for next iteration
  await container
    .locator(".chosen-results li.active-result")
    .filter({ hasText: val })
    .first()
    .click();
  await searchInput.clear();
}
```

**Date Picker:**
```typescript
const [year, month, day] = dateStr.split("-").map(Number);
await page.click(`#${fieldId}`);
await page.selectOption(".ui-datepicker-year", `${year}`);
await page.selectOption(".ui-datepicker-month", `${month - 1}`);
// Click the day
```

**Weekly Availability:**
```typescript
// Opens modal, fills availability for each day of week
// Handles from/to times and unavailable checkbox
```

**Radio Button:**
```typescript
await page.locator(`label[for="${fieldId}"]`).click();
```

**Checkbox:**
```typescript
const checked = await page.isChecked(`#${fieldId}`);
if (value && !checked) await page.check(`#${fieldId}`);
if (!value && checked) await page.uncheck(`#${fieldId}`);
```

### Usage Example in Page Object

`tests/ui/page/NP001/FacilityPage.ts`:

```typescript
import { fillForm } from '@helpers/formFiller';
import { readJSON } from '@helpers/readJson';

export class FacilityPage {
  async createFacility(filename: string = 'facilityFormData') {
    // Open dialog
    await this.page.locator('#create-facility-button').click();
    await this.page.locator('div[aria-describedby="facility-form-dialog"]')
      .waitFor({ state: 'visible' });

    // Load JSON data
    const jsonPath = `workflows/facilities/data/${filename}.json`;
    const jsonData = await readJSON(jsonPath);

    // Fill all fields using form filler
    await fillForm(this.page, jsonData);

    // Submit
    await this.page.locator('#submit-create-facility-form-button').click();
  }
}
```

### Detecting Dropdown Types

Form filler **automatically detects** which dropdown type to use:

```typescript
case "dropdown": {
  // Check if it's a Chosen dropdown FIRST (since it also has the hidden select)
  const isChosenDropdown = await page.locator(`#${fieldId}_chosen`).count() > 0;
  const isStandardSelect = await page.locator(`#${fieldId}`).count() > 0 && 
                          !isChosenDropdown;
  
  if (isChosenDropdown) {
    await selectChosenDropdown(page, fieldId, value as string);
  } else if (isStandardSelect) {
    await selectStandardDropdown(page, fieldId, value as string);
  }
  break;
}
```

**Key:** Check for Chosen **first**, then standard select, to avoid treating all Chosen dropdowns as standard.

---

## Page Objects & Fixtures

### What Are Page Objects?

Page Objects represent UI pages as reusable classes. They:
- **Encapsulate** HTML selectors
- **Provide methods** for common actions
- **Make tests readable** and maintainable
- **Reduce duplication** across test files

### Example: FacilityPage

`tests/ui/page/NP001/FacilityPage.ts`:

```typescript
import { Page, expect } from '@playwright/test';
import { fillForm } from '@helpers/formFiller';
import { readJSON } from '@helpers/readJson';

export class FacilityPage {
  private formData?: Record<string, FormField>;

  constructor(private page: Page) {}

  // Navigation
  async open() {
    await this.page.goto('mvc-app/facility');
  }

  // Form filling
  async fill(formData: Record<string, FormField>) {
    this.formData = formData;
    await fillForm(this.page, formData);
  }

  // Facility creation workflow
  async createFacility(filename: string = 'facilityFormData') {
    // Verify tab exists
    const facilityCatalogueTab = this.page
      .locator("ul[role='tablist'] li a")
      .filter({ hasText: "Facility Catalogue" });
    expect(facilityCatalogueTab).toBeVisible();

    // Click Add Facility button
    await this.page.locator('#create-facility-button').click();
    
    // Wait for dialog
    await this.page
      .locator('div[aria-describedby="facility-form-dialog"]')
      .waitFor({ state: 'visible' });

    // Load and fill form
    const jsonPath = `workflows/facilities/data/${filename}.json`;
    const jsonData = await readJSON(jsonPath);
    await this.fill(jsonData);

    // Submit form
    await this.page.locator('#submit-create-facility-form-button').click();

    // Wait for dialog to close (indicates success)
    await this.page.waitForSelector(
      'div[aria-describedby="facility-form-dialog"]',
      { state: 'hidden', timeout: 30000 }
    );
  }

  // Verification
  async verifyFacilityAdded() {
    if (!this.formData) throw new Error('Form data not loaded');

    const facilityName = this.formData['facility_frm'].value as string;

    // Wait for data table
    await this.page.locator('.dt-scroll-head').waitFor({ state: 'visible' });

    // Find facility row
    const facilityRow = this.page
      .locator('#facility-list-table tbody tr')
      .filter({
        has: this.page.locator('th', {
          hasText: new RegExp(`^${facilityName}$`)
        })
      });

    // Verify exactly one match
    await expect(facilityRow).toHaveCount(1, { timeout: 10000 });
    console.log(`✅ Facility "${facilityName}" verified`);
  }

  // Cleanup
  async deleteCreatedFacility() {
    if (!this.formData) throw new Error('Form data not loaded');

    const facilityName = this.formData['facility_frm'].value as string;

    // Find facility row
    const facilityRow = this.page.locator('#facility-list-table tbody tr', {
      has: this.page.locator('th', { hasText: new RegExp(`^${facilityName}$`) })
    });

    // Check if found
    const rowCount = await facilityRow.count();
    if (rowCount === 0) throw new Error(`Facility not found`);

    // Click delete icon
    const deleteIcon = facilityRow
      .locator('td div i.delete-facility-icon')
      .first();
    await deleteIcon.click();

    // Confirm deletion
    const confirmButton = this.page.locator('button.delete-popup:visible').first();
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();

    // Verify deletion
    await expect(facilityRow).toHaveCount(0);
    console.log(`🗑️ Facility deleted successfully`);
  }
}
```

### Fixtures

Fixtures are reusable test setup. They're like "before each test" setup.

#### Main Test Fixture

`tests/fixtures/test.fixture.ts`:

```typescript
import { test as base, expect } from '@playwright/test';
import config from '@config/envConfig';

type TestFixtures = {
  loginAs: (userAlias: string) => Promise<void>;
};

export const test = base.extend<TestFixtures>({
  // Custom fixture that logs in a user
  loginAs: async ({ page }, use) => {
    await use(async (userAlias: string) => {
      // Navigate to login
      await page.goto(`${config.uiBaseUrl}/`);
      
      // Enter credentials based on userAlias
      const password = config.credentials[userAlias];
      await page.fill('#username', userAlias);
      await page.fill('#password', password);
      await page.click('#login-button');
      
      // Verify logged in
      await page.waitForURL(`**/mvc-app/**`);
    });
  },
});

export { expect };
```

#### Pages Fixture

`tests/fixtures/pages.fixture.ts`:

```typescript
import { test as base } from './test.fixture';
import { FacilityPage } from '@pages/NP001/FacilityPage';
import { ScheduledTeamPage } from '@pages/NP035/ScheduledTeamPage';

type PagesFixtures = {
  facilityPage: FacilityPage;
  scheduledTeamPage: ScheduledTeamPage;
};

export const test = base.extend<PagesFixtures>({
  facilityPage: async ({ page }, use) => {
    await use(new FacilityPage(page));
  },
  scheduledTeamPage: async ({ page }, use) => {
    await use(new ScheduledTeamPage(page));
  },
});

export { expect };
```

#### Using Fixtures in Tests

`tests/fixtures/test.fixture.ts`:

```typescript
Given('user {string} is on facility catalogue page', 
  async ({ loginAs, facilityPage }, userAlias: string) => {
    // loginAs and facilityPage are injected automatically
    await loginAs(userAlias);
    await facilityPage.open();
  }
);
```

---

## Test Execution

### Local Machine Execution

#### Run All Tests

```bash
npm run uitest
```

- Runs all UI tests with `@ui` tag
- Opens browser window
- Generates HTML report

#### Run Tests by Environment

**DEV:**
```bash
npm run facilitytest:dev
npm run schdtest:dev
npm run uitest:dev
```

**SYSTEST (default):**
```bash
npm run facilitytest:systest
npm run schdtest:systest
npm run uitest:systest
```

#### Run Database Tests

```bash
npm run dbtest
```

Tests database connections, stored procedures, queries.

#### Run Specific Tests by Tag

```bash
# By feature tag
npm run uitest -- --grep @facility
npm run uitest -- --grep @schdTeamUI

# By smoke tests
npm run uitest -- --grep @smoke

# By both tags
npm run uitest -- --grep "@facility and @smoke"
```

#### View Test Reports

```bash
npm run report
```

Opens HTML report with:
- Test results (passed/failed)
- Screenshots on failure
- Videos of test execution
- Trace files for debugging

### Test Execution Flow

```
npm run facilitytest:dev
    ↓
package.json: "cross-env ENVIRONMENT=dev npm run facilitytest"
    ↓
playwright.config.ts loads .env.dev
    ↓
npx bddgen generates test files from .feature files
    ↓
npx playwright test runs generated tests
    ↓
Tests use UI_BASE_URL from .env.dev
    ↓
Browser opens to https://allocate-dev-wp.national.core.bbc.co.uk
    ↓
Test executes → Report generated
```

---

## Writing Tests

### Feature Files (Gherkin Syntax)

Feature files are **human-readable test scenarios** written in Gherkin language.

Location: `tests/ui/features/NP001/facility_booking.feature`

```gherkin
@facility @smoke @ui
Feature: Facility CRUD

  Scenario: Area Admin creates and manages a facility
    Given user 'areaAdmin_News' is on facility catalogue page
    When user creates a new facility using test data from "facilityFormData"
    Then the facility should be created successfully
    And delete the created facility to clean up
```

### Gherkin Keywords

| Keyword | Purpose | Example |
|---------|---------|---------|
| `Feature:` | Test suite name | `Feature: Facility CRUD` |
| `Scenario:` | Single test case | `Scenario: Create facility` |
| `Given` | Initial state/setup | `Given user is logged in` |
| `When` | Action | `When user clicks save` |
| `Then` | Expected outcome | `Then facility is created` |
| `And` | Additional step | `And facility is visible` |
| `@tag` | Test label | `@facility @smoke` |

### Step Definitions (Code)

Step definitions **map Gherkin to code**.

Location: `tests/ui/steps/NP001/facility_booking.steps.ts`

```typescript
import { createBdd } from 'playwright-bdd';
import { test } from '@fixtures/pages.fixture';

const { Given, When, Then } = createBdd(test);

// ============================================
// GIVEN: Setup Steps
// ============================================

Given('user {string} is on facility catalogue page',
  async ({ loginAs, facilityPage }, userAlias: string) => {
    // loginAs: custom fixture for login
    // facilityPage: page object for facility page
    
    await loginAs(userAlias);           // Login as specified user
    await facilityPage.open();           // Navigate to facility page
    console.log(`User '${userAlias}' navigated to facility catalogue page`);
  }
);

// ============================================
// WHEN: Action Steps
// ============================================

When('user creates a new facility using test data from {string}',
  async ({ facilityPage }, filename: string) => {
    // Load test data and create facility
    await facilityPage.createFacility(filename);
    console.log(`Facility creation initiated with: ${filename}.json`);
  }
);

// ============================================
// THEN: Assertion Steps
// ============================================

Then('the facility should be created successfully',
  async ({ facilityPage }) => {
    // Verify facility was created
    await facilityPage.verifyFacilityAdded();
    console.log('Facility created and verified successfully');
  }
);

Then('delete the created facility to clean up',
  async ({ facilityPage }) => {
    // Delete facility for cleanup
    await facilityPage.deleteCreatedFacility();
    console.log('Created facility deleted successfully');
  }
);
```

### Creating New Tests

**Step 1:** Create feature file

`tests/ui/features/NP001/my_new_test.feature`:

```gherkin
@myfeature @ui
Feature: My New Feature

  Scenario: Do something amazing
    Given user 'areaAdmin_News' is logged in
    When user performs action X
    Then result Y appears
```

**Step 2:** Create step definitions

`tests/ui/steps/NP001/my_new_test.steps.ts`:

```typescript
import { createBdd } from 'playwright-bdd';
import { test } from '@fixtures/pages.fixture';

const { Given, When, Then } = createBdd(test);

Given('user {string} is logged in',
  async ({ loginAs }, userAlias: string) => {
    await loginAs(userAlias);
  }
);

When('user performs action X',
  async ({ page }) => {
    await page.click('#action-button');
  }
);

Then('result Y appears',
  async ({ page, expect }) => {
    const result = page.locator('#result');
    await expect(result).toBeVisible();
  }
);
```

**Step 3:** Create page object (if needed)

`tests/ui/page/NP001/MyNewPage.ts`:

```typescript
import { Page, expect } from '@playwright/test';

export class MyNewPage {
  constructor(private page: Page) {}

  async doAction() {
    await this.page.click('#action-button');
  }

  async verifyResult() {
    const result = this.page.locator('#result');
    await expect(result).toBeVisible();
  }
}
```

**Step 4:** Run test

```bash
npm run uitest -- --grep @myfeature
```

---

## CI/CD Pipeline

### GitHub Actions Setup

GitHub Actions runs tests automatically on code push/PR.

#### Step 1: Create Workflow File

Create `.github/workflows/test.yml`:

```yaml
name: Tests - Matrix Approach

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        environment: [dev, systest, staging]
    
    steps:
      # 1. Check out code
      - uses: actions/checkout@v3
      
      # 2. Setup Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      # 3. Install dependencies
      - name: Install dependencies
        run: npm ci
      
      # 4. Create environment-specific .env file
      - name: Create .env.${{ matrix.environment }}
        run: |
          cat > .env.${{ matrix.environment }} << EOF
          DB_AUTH_TYPE=sql
          DB_HOST=${{ secrets[format('DB_HOST_{0}', matrix.environment)] }}
          DB_NAME=BBCSchedules_WP
          DB_USER=${{ secrets[format('DB_USER_{0}', matrix.environment)] }}
          DB_PASSWORD=${{ secrets[format('DB_PASSWORD_{0}', matrix.environment)] }}
          API_BASE_URL=${{ secrets[format('URL_BASE_{0}', matrix.environment)] }}/api
          UI_BASE_URL=${{ secrets[format('URL_BASE_{0}', matrix.environment)] }}
          SYS_ADMIN_PASSWORD=${{ secrets.SYS_ADMIN_PASSWORD }}
          AREA_ADMIN_PASSWORD=${{ secrets.AREA_ADMIN_PASSWORD }}
          ENVIRONMENT=${{ matrix.environment }}
          EOF
      
      # 5. Run facility tests
      - name: Run Facility Tests (${{ matrix.environment }})
        run: npm run facilitytest:ci
        env:
          ENVIRONMENT: ${{ matrix.environment }}
      
      # 6. Run scheduling team tests
      - name: Run Scheduling Team Tests (${{ matrix.environment }})
        run: npm run schdtest:ci
        env:
          ENVIRONMENT: ${{ matrix.environment }}
      
      # 7. Upload report
      - name: Upload Test Report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report-${{ matrix.environment }}
          path: playwright-report/
```

#### Step 2: Configure GitHub Secrets

Go to: **Settings → Secrets and variables → Actions**

Create these secrets for each environment:

```
For DEV:
- DB_HOST_dev
- DB_USER_dev
- DB_PASSWORD_dev
- URL_BASE_dev

For SYSTEST:
- DB_HOST_systest
- DB_USER_systest
- DB_PASSWORD_systest
- URL_BASE_systest

Shared:
- SYS_ADMIN_PASSWORD
- AREA_ADMIN_PASSWORD
```

#### Step 3: Update package.json

Add `:ci` commands that work in Linux CI environments:

```json
{
  "scripts": {
    "facilitytest:ci": "npx bddgen && ENVIRONMENT=$ENVIRONMENT npx playwright test --project=uitest --grep @facility",
    "schdtest:ci": "npx bddgen && ENVIRONMENT=$ENVIRONMENT npx playwright test --project=uitest --grep @schdTeamUI",
    "uitest:ci": "npx bddgen && ENVIRONMENT=$ENVIRONMENT npx playwright test --project=uitest"
  }
}
```

### Pipeline Execution Flow

```
1. You push code to GitHub
        ↓
2. GitHub Actions detects push (on: push)
        ↓
3. Runs 3 parallel jobs (one per environment)
        ↓
4. Each job:
   a) Checks out code
   b) Installs dependencies
   c) Creates .env file from secrets
   d) Runs tests against that environment
   e) Uploads report
        ↓
5. Reports show results for all 3 environments
```

### Viewing Results

- **GitHub UI**: Actions tab → Click workflow → View results
- **Artifacts**: Download test reports from "Artifacts" section
- **Logs**: View detailed test output in job logs

---

## Troubleshooting

### Common Issues & Solutions

#### Issue: "Cannot find module '@helpers/formFiller'"

**Cause:** TypeScript path aliases not resolved

**Solution:**
1. Check `tsconfig.json` has correct paths:
```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@helpers/*": ["tests/utils/*"],
      "@pages/*": ["tests/ui/page/*"],
      "@fixtures/*": ["tests/fixtures/*"]
    }
  }
}
```

#### Issue: Tests run against wrong environment

**Cause:** ENVIRONMENT variable not set

**Solution:**
```bash
# Check current environment
echo $env:ENVIRONMENT  # PowerShell
echo $ENVIRONMENT      # Bash

# Explicitly set before running
$env:ENVIRONMENT='dev'; npm run facilitytest:ci  # PowerShell
ENVIRONMENT=dev npm run facilitytest:ci          # Bash/Linux
```

#### Issue: "locator.getAttribute: Target page, context or browser has been closed"

**Cause:** Form filler detecting wrong dropdown type

**Solution:** Ensure form filler checks for Chosen first:
```typescript
const isChosenDropdown = page.locator(`#${fieldId}_chosen`).count() > 0;
const isStandardSelect = page.locator(`#${fieldId}`).count() > 0 && !isChosenDropdown;
```

#### Issue: Tests timeout or fail intermittently

**Cause:** Slow UI responses or timing issues

**Solution:**
1. Increase timeouts in `playwright.config.ts`:
```typescript
timeout: 120 * 1000,  // 2 minutes
expect: { timeout: 15 * 1000 },  // 15 seconds
```

2. Add explicit waits in page objects:
```typescript
await this.page.locator('#element').waitFor({ state: 'visible', timeout: 10000 });
```

#### Issue: ".env.{environment} file not found"

**Cause:** Environment file missing

**Solution:**
1. Check file exists:
```bash
ls .env.*  # Linux/Mac
dir .env.* # Windows
```

2. Create missing file:
```bash
cp .env.example .env.missing-env
# Edit with correct values
```

#### Issue: "cross-env: command not found"

**Cause:** cross-env not installed

**Solution:**
```bash
npm install --save-dev cross-env
```

### Debug Mode

#### Run Tests with Debugging

```bash
# Show browser with detailed logs
npm run facilitytest:dev -- --headed
npm run facilitytest:dev -- --debug
```

#### Generate Trace for Debugging

Enabled by default in `playwright.config.ts`:
```typescript
use: {
  trace: 'retain-on-failure',  // Keep trace on failure
  screenshot: 'only-on-failure',
  video: 'retain-on-failure'
}
```

View trace:
```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

#### View Video Recordings

Videos saved in `test-results/` when tests fail.

---

## Best Practices

### 1. Form Data Organization

✅ Keep test data in JSON files in `workflows/`  
❌ Don't hardcode test data in step definitions

### 2. Page Objects

✅ Create specific page objects for each page  
❌ Don't use generic "BasePage" for everything

### 3. Selectors

✅ Use stable IDs and roles: `#facility_frm`, `role="dialog"`  
❌ Don't use text-based selectors that change frequently

### 4. Waits

✅ Wait for elements explicitly: `await element.waitFor({ state: 'visible' })`  
❌ Don't use `page.waitForTimeout()` (sleeps)

### 5. Environment Variables

✅ Use environment-specific secrets in CI/CD  
❌ Don't commit credentials to repo

### 6. Test Data

✅ Use fixtures for common setup  
❌ Don't duplicate setup across tests

---

## Summary

### Quick Reference

| Task | Command |
|------|---------|
| Install | `npm install && npx playwright install` |
| Run tests (DEV) | `npm run facilitytest:dev` |
| Run tests (SYSTEST) | `npm run facilitytest:systest` |
| View report | `npm run report` |
| Add new environment | Create `.env.newenv`, add npm scripts |
| Run specific tests | `npm run uitest -- --grep @tag` |
| Debug tests | `npm run facilitytest:dev -- --debug` |

### File Guide

| File | Purpose |
|------|---------|
| `.feature` | Human-readable test scenarios |
| `.steps.ts` | Maps Gherkin to code |
| `Page.ts` | Page object with page methods |
| `formData.json` | Test data configuration |
| `.env.{env}` | Environment configuration |
| `playwright.config.ts` | Playwright settings |

### Workflow

```
1. Write feature file (.feature)
2. Create step definitions (.steps.ts)
3. Create page object (Page.ts)
4. Create form data (formData.json)
5. Run: npm run facilitytest:dev
6. View report: npm run report
```

---

## Support & Next Steps

### Further Reading

- [Playwright Documentation](https://playwright.dev)
- [Playwright-BDD](https://vitalets.github.io/playwright-bdd/)
- [BDD & Gherkin](https://cucumber.io/docs/gherkin/)
- [Page Object Model](https://playwright.dev/docs/pom)

### Getting Help

1. **Check logs**: `test-results/` has videos and traces
2. **Check reports**: `npm run report`
3. **Review code**: Similar test in codebase
4. **Debug mode**: `npm run facilitytest:dev -- --debug`

---

**Created:** March 5, 2026  
**Framework Version:** 1.0.0  
**Last Updated:** March 5, 2026
