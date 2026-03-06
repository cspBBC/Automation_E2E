# UI Test Execution Flow

This document explains how a UI test executes from start to end using the **Scheduling Group Create** test as an example.

---

## Step 1: Run the Test Command

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
