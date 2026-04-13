# BBC Automation E2E Framework - Coding Standards & Commit Instructions

> **Team-Wide Guidelines for Code Quality, Consistency & Framework Integrity**  
> All team members, contributors, and LLMs must follow these standards.

---

## **TABLE OF CONTENTS**

1. [Overview & Purpose](#overview--purpose)
2. [General Coding Standards](#general-coding-standards)
3. [File Structure & Organization](#file-structure--organization)
4. [Comment & Documentation Requirements](#comment--documentation-requirements)
5. [Naming Conventions](#naming-conventions)
6. [Test File Standards](#test-file-standards)
7. [Step Implementation Standards](#step-implementation-standards)
8. [Git Workflow & Commit Standards](#git-workflow--commit-standards)
9. [Pre-Commit Verification Checklist](#pre-commit-verification-checklist)
10. [Code Review Checklist](#code-review-checklist)
11. [LLM Usage Guidelines](#llm-usage-guidelines)
12. [Troubleshooting & Common Issues](#troubleshooting--common-issues)

---

## **OVERVIEW & PURPOSE**

### **Mission**
Maintain consistent, maintainable, and high-quality test automation code across the entire BBC Automation E2E Framework through standardized practices and clear guidelines.

### **Scope**
-  Feature files (Gherkin/.feature)
-  Step implementations (TypeScript/.steps.ts)
-  Page objects (TypeScript/.ts)
-  Configuration files
-  Test data files
-  Documentation files

### **Who Should Follow**
-  All team members
-  External contributors
-  LLM assistants (Claude, ChatGPT, etc.)
-  CI/CD pipelines
-  Code review processes

---

## **GENERAL CODING STANDARDS**

### **1. Code Quality**

typescript
//  DO: Clear, readable code with meaningful names
Given(
  'user {string} is on Show {string} page',
  async ({ loginAs }, userAlias: string, pageName: string) => {
    const page = await loginAs(userAlias as keyof typeof users);
    const pageObject = getPageObject(pageName, page);
    await pageObject.open();
    console.log(User '{userAlias}' navigated to {pageName} page);
  },
);

//  DON'T: Cryptic or abbreviated code
Given('user is on page', async ({ loginAs }, u, p) => {
  const p = await loginAs(u);
  await p.o();
});


### **2. Error Handling**

typescript
//  DO: Validate prerequisites and throw meaningful errors
When('user clicks the Edit button', async ({ }) => {
  if (!scenarioContext.page) {
    throw new Error('Page not available. Did you call the Given step first?');
  }
  await scenarioContext.page.locator('.fas.fa-edit').first().click();
});

//  DON'T: Silent failures or vague error messages
When('user clicks the Edit button', async ({ }) => {
  await page.locator('.fas.fa-edit').click(); // page may be undefined
});


### **3. Async/Await**

typescript
//  DO: Always use async/await with proper waits
await scenarioContext.page.waitForLoadState('networkidle');
await expect(element).toBeVisible({ timeout: 5000 });

//  DON'T: Hardcoded delays or missing waits
await page.waitForTimeout(3000);
// element might not be ready


### **4. DRY Principle**

typescript
//  DO: Extract common logic into reusable functions
export function setPageContext(page: Page) {
  scenarioContext.page = page;
}

//  DON'T: Duplicate the same code in multiple steps
// (scenario context setup repeated in every .steps.ts file)


### **5. TypeScript Best Practices**

typescript
//  DO: Use strict typing
let scenarioContext: { page: Page | null; scheduledGroupPage: PageObject | null } = {
  page: null,
  scheduledGroupPage: null,
};

//  DON'T: Use 'any' or loose typing
let scenarioContext: any = {};


---

## **FILE STRUCTURE & ORGANIZATION**

### **Approved Directory Structure**


Automation_E2E/
 .github/
    INSTRUCTIONS.md                  This file
    PULL_REQUEST_TEMPLATE.md
    workflows/
       pre-commit-validation.yml    Automated checks
    ISSUE_TEMPLATE/
 core/
    api/
    config/
    data/
    db/
 tests/
    ui/
       features/
          [REQUIREMENT]/
              [feature]_create.feature
              [feature]_edit.feature
              [feature]_delete.feature
       steps/
          [REQUIREMENT]/
              [feature]_create.steps.ts
              [feature]_edit.steps.ts
              [feature]_delete.steps.ts
       page/
          [REQUIREMENT]/
              [PageName]Page.ts
       fixtures/
    integrated/                      API tests
    utils/
 workflows/
    [FEATURE_AREA]/
        data/
        db/
 playwright.config.ts
 package.json
 tsconfig.json
 README.md


### **File Naming Conventions**

| Type | Pattern | Example |
|------|---------|---------|
| Feature files | [feature]_[operation].feature | schedulinggroup_ui_create.feature |
| Step files | [feature]_[operation].steps.ts | schedulinggroup_ui_create.steps.ts |
| Page objects | [PageName]Page.ts | ScheduledGroupPage.ts |
| Test data | [feature]_[scenario]_UIdata.json | schdGroupCreate_AreaAdminNews_UIdata.json |
| Database queries | [feature].queries.ts | schedulinggroup.queries.ts |

### **Requirement-Based Folders**


tests/ui/features/NP035/           Requirement code
tests/ui/steps/NP035/               Requirement code
tests/ui/page/NP035/                Requirement code
workflows/schedulingGroup/           Feature name


---

## **COMMENT & DOCUMENTATION REQUIREMENTS**

### **1. Feature File Comments (MANDATORY)**

Every feature file **MUST** have these comments:

gherkin
@schdGroupCreateUI @ui
Feature: Scheduling Group CRUD
  # COVERAGE: NP035.01 (Feature Name) | NP035.02 (Feature Name)
  # VALIDATES: [Business rule 1], [Business rule 2], [Business rule 3]
  # ROLE: SystemAdmin | AreaAdmin | Both
  # INDEPENDENT: Yes (creates data before testing)

  Scenario: [Clear scenario description matching business context]
    Given user 'role' is on Show "Page Name" page


**Required Comment Elements:**
- COVERAGE: Which requirements/user stories this covers
- VALIDATES: What business rules are tested
- ROLE: Who can perform this operation
- INDEPENDENT: Yes (all scenarios must be independent)

### **2. Step File Comments (MANDATORY)**

Every step file **MUST** have:

typescript
import { Page } from '@playwright/test';
import users from '@core/data/users.json' with { type: 'json' };
import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { getPageObject, PageObject } from '@helpers/pageFactory';

const { Given, When, Then } = createBdd(test);

// COVERAGE: [What requirement/feature this covers]
// PURPOSE: [High-level description of step implementation]

let scenarioContext: { page: Page | null; scheduledGroupPage: PageObject | null } = {
  page: null,
  scheduledGroupPage: null,
};

Given(
  'user {string} is on Show {string} page',
  async ({ loginAs }, userAlias: string, pageName: string) => {
    // Locator: [CSS selector] - [what it targets]
    const page = await loginAs(userAlias as keyof typeof users);
    
    // Context: [why this is stored in scenario context]
    scenarioContext.page = page;
    
    console.log(User '{userAlias}' navigated to {pageName} page);
  },
);


**Required Comment Elements:**
- File-level COVERAGE & PURPOSE
- Inline Locator comments for every selector
- Context comments explaining state management
- console.log for debugging trace

### **3. Inline Code Comments**

typescript
//  DO: Comment WHY, not WHAT

// Locator: .fas.fa-edit - Edit icon in actions column
await scenarioContext.page.locator('.fas.fa-edit').first().click();

// Wait for API calls and DOM updates to complete
await scenarioContext.page.waitForLoadState('networkidle');

//  DON'T: Comment obvious code

// Click the edit button
await page.locator('.fas.fa-edit').click();

// Wait for network
await page.waitForLoadState('networkidle');


### **4. Documentation Standards**

markdown
#  DO: Clear, structured documentation

## Purpose
Brief description of what this does

## Requirements
- What's needed to run this

## Usage
Code examples

## Locators
| Element | Selector | Description |
|---------|----------|-------------|
| Edit Button | .fas.fa-edit | Actions column edit icon |

#  DON'T: Vague or incomplete docs

some documentation here
edit button is .fas.fa-edit


---

## **NAMING CONVENTIONS**

### **Variables**

typescript
//  DO: Descriptive, camelCase
let scenarioContext: { page: Page | null; scheduledGroupPage: PageObject | null };
const editButton = scenarioContext.page.locator('.fas.fa-edit');
const lastAmendedDateField = page.locator('[data-testid="last-amended-date"]');

//  DON'T: Abbreviated or unclear
let ctx: any;
const btn = page.locator('.fas.fa-edit');
const lad = page.locator('[data-testid="last-amended-date"]');


### **Functions**

typescript
//  DO: Verb + noun, clear intent
function setPageContext(page: Page) { }
function verifyScheduledGroupVisibleForUser() { }
async function waitForDeleteConfirmation() { }

//  DON'T: Vague or single-letter names
function setup() { }
function check() { }
async function wait() { }


### **Test Data**

typescript
//  DO: Descriptive, context-based
schdGroupCreate_AreaAdminNews_UIdata.json
schdGroupCreate_SystemAdmin_UIdata.json
schedulinggroup.queries.ts

//  DON'T: Generic or unclear
test_data.json
data.json
queries.ts


### **Tags**

gherkin
#  DO: Specific, searchable tags
@schdGroupCreateUI @ui @smoke
@schdGroupEditAreaAdminUI @ui @P1
@schdGroupDeleteUI @ui @critical

#  DON'T: Generic or too broad
@test @ui @feature
@create @smoke


---

## **TEST FILE STANDARDS**

### **Feature File Template**

gherkin
@[tagName] @ui
Feature: [Feature Name] CRUD

  # COVERAGE: NP035.XX ([Requirement]) | NP035.YY ([Requirement])
  # VALIDATES: [Business Rule 1], [Business Rule 2]
  # ROLE: [SystemAdmin | AreaAdmin | Both]
  # INDEPENDENT: Yes

  Scenario: [system-user-role] [performs-action] [expected-outcome]
    Given user '[role]' is on Show "[Page Name]" page
    When user creates a new [entity] using test data from "[datafile]"
    Then the [entity] should be visible in the list
    When user [action on entity]
    Then [expected result]


### **Scenario Guidelines**

gherkin
#  DO: Descriptive, business-focused scenarios

Scenario: systemAdmin creates a scheduling group successfully
  Given user 'systemAdmin' is on Show "Scheduled Group" page
  When user creates a new scheduling group using test data from "schdGroupCreate_SystemAdmin_UIdata"
  Then the scheduling group should be visible in the list
  And the Last Amended By should display current user name

#  DON'T: Vague or technical scenarios

Scenario: Create test
  Given user is logged in
  When user does something
  Then something happens


### **Independent Scenarios (CRITICAL)**

gherkin
#  DO: Each scenario creates its own data

Scenario: areaAdmin_News edits a scheduling group successfully
  Given user 'areaAdmin_News' is on Show "Scheduled Group" page
  When user creates a new scheduling group using test data from "schdGroupCreate_AreaAdminNews_UIdata"
  Then the scheduling group should be visible in the list
  When user clicks the Edit button for the scheduling group
  And user updates the scheduling group name to "Updated_Group_Name"
  Then the scheduling group name should be updated to "Updated_Group_Name"

#  DON'T: Depend on data created by other scenarios

Scenario: areaAdmin_News edits a pre-existing group
  # Assumes previous scenario created a group - FAILS in isolation!
  When user clicks the Edit button for the scheduling group
  Then the scheduling group should be editable


---

## **STEP IMPLEMENTATION STANDARDS**

### **Step File Template**

typescript
import { Page } from '@playwright/test';
import users from '@core/data/users.json' with { type: 'json' };
import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { getPageObject, PageObject } from '@helpers/pageFactory';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd(test);

// COVERAGE: [Feature area] - [What this covers]
// PURPOSE: Step implementations for [feature name] feature

let scenarioContext: { page: Page | null; scheduledGroupPage: PageObject | null } = {
  page: null,
  scheduledGroupPage: null,
};

Given(
  'user {string} is on Show {string} page',
  async ({ loginAs }, userAlias: string, pageName: string) => {
    // Locator: uses page factory to get page object by name
    const page = await loginAs(userAlias as keyof typeof users);
    const pageObject = getPageObject(pageName, page);
    await pageObject.open();
    
    // Store in scenario context for reuse across steps
    scenarioContext.page = page;
    scenarioContext.scheduledGroupPage = pageObject;
    
    console.log(User '{userAlias}' navigated to {pageName} page);
  },
);

When(
  'user clicks the Edit button for the scheduling group',
  async ({ }) => {
    if (!scenarioContext.page) {
      throw new Error('Page not available. Did you call the Given step first?');
    }
    
    // Locator: .fas.fa-edit - Edit icon in actions column (Font Awesome)
    await scenarioContext.page.locator('.fas.fa-edit').first().click();
    console.log('Clicked Edit button for scheduling group');
  },
);


### **Error Handling Standards**

typescript
//  DO: Always validate prerequisites
When('user updates the group name', async ({ }) => {
  if (!scenarioContext.page) {
    throw new Error('Page not available. Did you call the Given step first?');
  }
  
  if (!scenarioContext.scheduledGroupPage) {
    throw new Error('ScheduledGroupPage not initialized.');
  }
  
  await scenarioContext.page.locator('#group_name').fill('New Name');
});

//  DON'T: Assume context exists
When('user updates the group name', async ({ }) => {
  await scenarioContext.page.locator('#group_name').fill('New Name');
  // scenarioContext.page might be null  Runtime error
});


### **Locator Documentation**

typescript
//  DO: Always document locators with description

// Locator: .fas.fa-edit - Edit icon in actions column
await page.locator('.fas.fa-edit').click();

// Locator: button { name: 'Delete' } - Delete action button
await page.getByRole('button', { name: 'Delete' }).click();

// Locator: #group_name - Scheduling group name input field
await page.locator('#group_name').fill('New Name');

// Locator: textarea[name="notes"] - Notes text area for additional information
await page.locator('textarea[name="notes"]').fill('Updated notes');

//  DON'T: Undocumented selectors
await page.locator('.fas.fa-edit').click();
await page.locator('#group_name').fill('New Name');


---

## **GIT WORKFLOW & COMMIT STANDARDS**

### **Branch Naming**

bash
#  DO: Feature/requirement based branches
git checkout -b feature/NP035-scheduling-group-e2e
git checkout -b fix/login-step-timeout
git checkout -b docs/update-readme

#  DON'T: Generic or dated branches
git checkout -b feature/test
git checkout -b fix/bug
git checkout -b updates-march-19


### **Commit Message Format**

[Use Conventional Commits](https://www.conventionalcommits.org/):

bash
#  DO: Structured, descriptive commits

git commit -m "feat(NP035): Add scheduling group E2E test automation

- 10 feature files with comprehensive positive scenarios
- 6 step implementation files with locator documentation
- Role-based coverage (SystemAdmin + AreaAdmin)
- Permission boundary & data isolation validation

COVERAGE:
- NP035.01: View Scheduling Groups 
- NP035.02: Create/Add Scheduling Groups 
- NP035.03: Edit Scheduling Groups (with area change warning) 
- NP035.04: Delete Scheduling Groups 
- NP035.05: View History of Changes 

Test Execution:
  npx playwright test --grep @ui"

#  DON'T: Vague commit messages
git commit -m "add tests"
git commit -m "updates"
git commit -m "fix stuff"


### **Commit Types**

| Type | Use Case | Example |
|------|----------|---------|
| feat | New feature/test | feat(NP035): Add scheduling group tests |
| fix | Bug fix | fix(login): Increase timeout for slow networks |
| docs | Documentation | docs: Update README with new commands |
| refactor | Code improvement | refactor: Extract duplicate step logic |
| test | Test-only changes | test: Add edge case scenarios |
| chore | Dependencies, config | chore: Update playwright to v1.40 |

### **Pre-Commit Workflow**

bash
# 1. Verify all files present and properly commented
grep -l "# COVERAGE:" tests/ui/features/NP035/*.feature
grep -l "# VALIDATES:" tests/ui/features/NP035/*.feature
grep -l "// Locator:" tests/ui/steps/NP035/*.ts

# 2. Run TypeScript compiler check
npx tsc --noEmit

# 3. Run linter (if configured)
npx eslint tests/ui/steps/NP035/**/*.ts

# 4. Run feature file parser validation
npx playwright test --list --grep @ui 2>&1 | head -20

# 5. Stage files
git add tests/ui/features/NP035/
git add tests/ui/steps/NP035/

# 6. Commit with detailed message
git commit

# 7. Push
git push origin feature/NP035-scheduling-group-e2e


---

## **BDD FRAMEWORK COMMANDS & WORKFLOWS**

> **Playwright BDD with playwright-bdd plugin**

### **1. Generate BDD Feature Structure**

bash
# Generate new feature module structure
npx bddgen

# Options:
npx bddgen --path tests/ui/features/NP035  # Generate in specific path
npx bddgen --name schedulinggroup           # Generate with specific name


### **2. Feature File Generation**

bash
#  DO: Use following structure
npx bddgen --path tests/ui/features/NP035 --name schedulinggroup_ui_create

# Creates:
# tests/ui/features/NP035/schedulinggroup_ui_create.feature
# tests/ui/steps/NP035/schedulinggroup_ui_create.steps.ts

#  Then manually edit .feature file and add:
# - @tags for easy test filtering
# - # COVERAGE: [Requirement]
# - # VALIDATES: [Business rules]
# - Gherkin scenarios matching business context


### **3. Step Definition Generation**

bash
# Generate step definitions from existing feature file
npx bddgen --feature tests/ui/features/NP035/schedulinggroup_ui_create.feature

# This creates skeleton steps.ts with all Gherkin steps
# Then manually implement step logic

#  After generation, add:
# - File-level COVERAGE & PURPOSE comments
# - Locator comments for all selectors
# - Error handling for prerequisites
# - console.log for debugging


### **4. Running BDD Tests**

bash
# Run ALL tests
npx playwright test

# Run tests by feature tag
npx playwright test --grep @schdGroupCreateUI
npx playwright test --grep @schdGroupEditUI
npx playwright test --grep @schdGroupDeleteUI

# Run multiple tags (OR logic)
npx playwright test --grep "@schdGroupEditUI|@schdGroupDeleteUI"

# Run with specific browser
npx playwright test --grep @ui --project chromium
npx playwright test --grep @ui --project firefox
npx playwright test --grep @ui --project webkit

# Run with headed mode (see browser)
npx playwright test --grep @schdGroupCreateUI --headed

# Run with debug mode
npx playwright test --grep @schdGroupCreateUI --debug

# Run single feature file
npx playwright test tests/ui/features/NP035/schedulinggroup_ui_create.feature

# Run with custom reporter
npx playwright test --grep @ui --reporter=html
npx playwright test --grep @ui --reporter=json
npx playwright test --grep @ui --reporter=list


### **5. View Generated Test List**

bash
# List all tests that would be executed
npx playwright test --list --grep @ui

# List tests by tag
npx playwright test --list --grep @smoke
npx playwright test --list --grep @schdGroupEditUI

# Count total tests
npx playwright test --list --grep @ui | wc -l


### **6. BDD Workflow - Complete Example**

bash
# Step 1: Create new feature requirement (NP035)
mkdir -p tests/ui/features/NP035
mkdir -p tests/ui/steps/NP035

# Step 2: Generate BDD structure
npx bddgen --path tests/ui/features/NP035 --name schedulinggroup_ui_create

# Step 3: Edit .feature file with Gherkin scenarios
# Add:
# - @tags for tagging
# - # COVERAGE: NP035.01, NP035.02
# - # VALIDATES: Business rules
# - Scenario descriptions
# - Given/When/Then steps

# Step 4: Implement step definitions
# Edit schedulinggroup_ui_create.steps.ts
# Implement:
# - Given steps (setup)
# - When steps (actions)
# - Then steps (assertions)

# Step 5: Add required comments & locators
# - File-level COVERAGE & PURPOSE
# - Locator comments
# - Error handling
# - console.log

# Step 6: Validate
npx playwright test --list --grep @schdGroupCreateUI
npx tsc --noEmit

# Step 7: Run tests
npx playwright test --grep @schdGroupCreateUI --headed

# Step 8: Commit
git add tests/ui/features/NP035/
git add tests/ui/steps/NP035/
git commit -m "feat(NP035): Add scheduling group create tests"
git push


### **7. Common BDD Commands Cheat Sheet**

bash
# Generate new feature
npx bddgen

# List all tests
npx playwright test --list

# List tests by tag
npx playwright test --list --grep @smoke

# Run all UI tests
npx playwright test --grep @ui

# Run AreaAdmin tests only
npx playwright test --grep "@schdGroupCreateAreaAdminNewsUI|@schdGroupEditAreaAdminUI|@schdGroupDeleteAreaAdminUI|@schdGroupHistoryAreaAdminUI"

# Run SystemAdmin tests only
npx playwright test --grep "@schdGroupCreateSystemAdminUI|@schdGroupEditUI|@schdGroupDeleteUI|@schdGroupHistoryUI"

# Run Edit operations (all roles)
npx playwright test --grep "@schdGroupEditUI|@schdGroupEditAreaAdminUI|@schdGroupEditAreaChangeWarningUI"

# Run with debugging
npx playwright test --grep @schdGroupCreateUI --debug

# Run headed (visual)
npx playwright test --grep @schdGroupCreateUI --headed

# Generate test report
npx playwright test --reporter=html && npx playwright show-report

# Run with specific workers (parallel)
npx playwright test --workers=4

# Run with video recording
npx playwright test --video=on

# Run with screenshot on failure
npx playwright test --screenshot=only-on-failure

# Run with trace (debugging)
npx playwright test --trace=on


### **8. BDD Best Practices**

#### **Feature File Best Practices**

gherkin
#  DO: Business-focused Gherkin

@schdGroupCreateUI @ui @smoke
Feature: Scheduling Group CRUD

  # COVERAGE: NP035.01 (View) | NP035.02 (Create)
  # VALIDATES: Create permission, data visibility, system integration
  # ROLE: SystemAdmin | AreaAdmin
  # INDEPENDENT: Yes

  Scenario: SystemAdmin creates a scheduling group successfully
    Given user 'systemAdmin' is on Show "Scheduled Group" page
    When user creates a new scheduling group using test data from "schdGroupCreate_SystemAdmin_UIdata"
    Then the scheduling group should be visible in the list
    And the Last Amended By should display current user name

#  DON'T: Technical or vague scenarios

@test
Feature: Test feature
  Scenario: User test
    Given user is logged in
    When user clicks button
    Then page loads


#### **Step Definition Best Practices**

typescript
//  DO: Clear, reusable, well-commented steps

Given(
  'user {string} is on Show {string} page',
  async ({ loginAs }, userAlias: string, pageName: string) => {
    // Locator: uses page factory pattern to load correct page object
    const page = await loginAs(userAlias as keyof typeof users);
    const pageObject = getPageObject(pageName, page);
    await pageObject.open();
    
    // Store in context for reuse across multiple steps
    scenarioContext.page = page;
    scenarioContext.scheduledGroupPage = pageObject;
    
    console.log(User '{userAlias}' navigated to {pageName} page);
  },
);

//  DON'T: Hardcoded values or missing comments

Given('user is on page', async ({ }) => {
  const page = await loginAs('admin');
  await page.goto('http://localhost:3000/admin');
  // Missing context storage, no comments
});


### **9. Troubleshooting BDD Commands**

bash
# Error: "Command not found: bddgen"
# Solution: Ensure playwright-bdd is installed
npm install --save-dev @cucumber/cucumber playwright-bdd

# Error: "No tests found"
# Solution: Check feature files have @tags
npx playwright test --list --grep @ui

# Error: Steps not matching Gherkin
# Solution: Verify step definitions match Gherkin text exactly
npx playwright test --list --grep @schdGroupCreateUI

# Error: Feature file syntax error
# Solution: Validate Gherkin syntax
npx playwright test --list tests/ui/features/NP035/*.feature

# Error: Step implementation missing
# Solution: Generate steps from feature
npx bddgen --feature tests/ui/features/NP035/schedulinggroup_ui_create.feature


### **10. CI/CD Integration with BDD**

yaml
# .github/workflows/test.yml example

name: BDD Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Validate BDD structure
        run: |
          grep -r "# COVERAGE:" tests/ui/features/
          grep -r "# VALIDATES:" tests/ui/features/
          grep -r "// Locator:" tests/ui/steps/
      
      - name: Run BDD tests
        run: npx playwright test --grep @ui
      
      - name: Generate report
        if: always()
        run: npx playwright show-report


---

## **PRE-COMMIT VERIFICATION CHECKLIST**

### **Automated Checklist**

Run this before every commit:

bash
#!/bin/bash
# Pre-commit validation script

echo " Starting pre-commit validation..."

# 1. Check COVERAGE comments
echo -n " Checking COVERAGE comments... "
if grep -q "# COVERAGE:" tests/ui/features/**/*.feature 2>/dev/null; then
  echo ""
else
  echo " FAILED: Missing COVERAGE comments"
  exit 1
fi

# 2. Check VALIDATES comments
echo -n " Checking VALIDATES comments... "
if grep -q "# VALIDATES:" tests/ui/features/**/*.feature 2>/dev/null; then
  echo ""
else
  echo " FAILED: Missing VALIDATES comments"
  exit 1
fi

# 3. Check locator comments in steps
echo -n " Checking locator comments... "
if grep -q "// Locator:" tests/ui/steps/**/*.ts 2>/dev/null; then
  echo ""
else
  echo " FAILED: Missing locator comments"
  exit 1
fi

# 4. TypeScript compilation
echo -n " Checking TypeScript compilation... "
if npx tsc --noEmit 2>&1 | grep -q error; then
  echo " FAILED: TypeScript compilation errors"
  npx tsc --noEmit
  exit 1
else
  echo ""
fi

# 5. File count validation
echo -n " Verifying file counts... "
FEATURE_COUNT=(ls -1 tests/ui/features/NP035/*.feature 2>/dev/null | wc -l)
STEPS_COUNT=(ls -1 tests/ui/steps/NP035/*.ts 2>/dev/null | wc -l)
if [ "FEATURE_COUNT" -ge 1 ] && [ "STEPS_COUNT" -ge 1 ]; then
  echo " (FEATURE_COUNT features, STEPS_COUNT steps)"
else
  echo " FAILED: Missing feature or step files"
  exit 1
fi

echo ""
echo " All pre-commit checks passed!"
echo "Ready to commit and push."


### **Manual Verification Checklist**

- [ ] All feature files have # COVERAGE: comment
- [ ] All feature files have # VALIDATES: comment
- [ ] All step files have file-level // COVERAGE: comment
- [ ] All step files have // Locator: comments for selectors
- [ ] No TypeScript compilation errors (npx tsc --noEmit)
- [ ] All scenarios are independent (create data before testing)
- [ ] Role-based scenarios include role specification
- [ ] No hardcoded timeouts (use proper waits)
- [ ] All error messages are clear and actionable
- [ ] Console logs are present for debugging

---

## **CODE REVIEW CHECKLIST**

### **For Code Reviewers**

markdown
## Feature File Review

- [ ] COVERAGE comment present and accurate
- [ ] VALIDATES comment lists actual business rules
- [ ] Scenario is descriptive and business-focused
- [ ] All scenarios are independent (no data dependencies)
- [ ] Test data files referenced correctly
- [ ] Tags are specific and searchable
- [ ] Gherkin syntax is correct
- [ ] Steps are at the right level of abstraction

## Step Implementation Review

- [ ] File-level COVERAGE and PURPOSE comments present
- [ ] All locators have descriptive comments
- [ ] Error handling validates prerequisites
- [ ] console.log statements for debugging
- [ ] No hardcoded waits (use proper page events)
- [ ] Async/await used correctly
- [ ] TypeScript types are explicit
- [ ] No 'any' types used
- [ ] Functions follow DRY principle
- [ ] No duplicate code across files

## General Code Quality

- [ ] Code is readable and maintainable
- [ ] Variable names are descriptive
- [ ] Comments explain WHY, not WHAT
- [ ] Error messages are clear and actionable
- [ ] No console.error or debugging code left behind
- [ ] Follows framework conventions
- [ ] No hardcoded credentials or sensitive data
- [ ] Tests are deterministic (no flakiness)


---

## **LLM USAGE GUIDELINES**

### **For LLM Assistants (Claude, ChatGPT, etc.)**

When generating code for this framework, **MUST** follow:

#### **1. Context Requirement**
Always ask for and understand:
- [ ] Requirement number (e.g., NP035.01)
- [ ] Feature being tested
- [ ] Role/permissions involved
- [ ] Test data available
- [ ] Existing page objects/helpers

#### **2. Feature File Generation**

gherkin
# ALWAYS include these elements:
@tagName @ui
Feature: [Feature Name]
  # COVERAGE: [Requirement.XX] ([Description])
  # VALIDATES: [Business rule 1], [Business rule 2]
  # ROLE: [SystemAdmin/AreaAdmin/Both]
  # INDEPENDENT: Yes

  Scenario: [Complete, business-focused description]
    Given [setup]
    When [action with data creation first]
    Then [verification]


#### **3. Step File Generation**

typescript
// ALWAYS include:
import { Page } from '@playwright/test';
import users from '@core/data/users.json' with { type: 'json' };
// ... all required imports

// COVERAGE: [Feature] - [What this covers]
// PURPOSE: [High-level description]

// Locator: [selector] - [description]
// Error handling for missing context
// console.log for debugging


#### **4. Validation Checklist**

Before output, LLM must verify:
- [ ] All imports present
- [ ] COVERAGE and VALIDATES comments included
- [ ] Locators documented
- [ ] Error handling implemented
- [ ] Scenario is independent
- [ ] Follows naming conventions
- [ ] No hardcoded values
- [ ] TypeScript types explicit

#### **5. Quality Standards**

- Generate code that passes npx tsc --noEmit
- Include meaningful comments
- Use async/await correctly
- Validate context/prerequisites
- Follow existing framework patterns
- Never use 'any' type

---

## **TROUBLESHOOTING & COMMON ISSUES**

### **Compilation Errors**

bash
# Error: Property 'offsetParent' does not exist
# Fix: Use offsetHeight or other DOM properties

await page.waitForFunction(() => {
  const dialog = document.querySelector('[role="dialog"]');
  return !dialog || (dialog as HTMLElement).offsetHeight === 0;
});

# Error: Expected 2-3 arguments, but got 1
# Fix: Use correct Playwright API

#  WRONG: page.press('Escape')
#  RIGHT: page.keyboard.press('Escape')
await page.keyboard.press('Escape');


### **Missing Comments**

bash
# Error: Feature file missing COVERAGE comment
# Fix: Add required comments to all feature files

grep -L "# COVERAGE:" tests/ui/features/**/*.feature
# Add missing comments to files listed above

# Use this template:
# COVERAGE: NP035.XX ([Requirement])
# VALIDATES: [Business rule 1], [Business rule 2]


### **Context Not Found**

bash
# Error: "Page not available. Did you call the Given step first?"
# Cause: Step executed without prerequisite Given step
# Fix: Ensure all scenarios start with proper Given step

Scenario: Edit scheduling group
  Given user 'systemAdmin' is on Show "Scheduled Group" page  #  Always required!
  When user creates a new scheduling group...
  When user clicks the Edit button...  #  Now page context exists


### **Test Flakiness**

bash
# Problem: Tests pass/fail inconsistently
# Solution: Use proper waits, not hardcoded delays

#  DON'T: await page.waitForTimeout(3000);
#  DO: await page.waitForLoadState('networkidle');
#  DO: await expect(element).toBeVisible();
#  DO: await page.locator('selector').waitFor();


### **Locator Issues**

bash
# Problem: "Timeout waiting for locator"
# Solution: Verify locator and wait strategies

# Debug steps:
1. npx playwright codegen https://app-url  # Generate locators
2. Test locator in browser console
3. Add explicit waits before using locator
4. Use page.waitForSelector() if element loads dynamically

# Use specific locators:
#  getByRole('button', { name: 'Delete' })
#  locator('#group_name')
#  locator('textarea[name="notes"]')
#  locator('div.button')  # Too generic


---

## **QUICK REFERENCE**

### **Essential BDD Commands**

bash
# Generate new feature structure
npx bddgen                                    # Interactive generation
npx bddgen --path tests/ui/features/NP035    # Generate in specific path
npx bddgen --name schedulinggroup             # Generate with specific name

# List all tests (BDD discovery)
npx playwright test --list                     # All tests
npx playwright test --list --grep @ui          # UI tests
npx playwright test --list --grep @smoke       # Smoke tests

# Run BDD tests
npx playwright test --grep @ui                 # All UI tests
npx playwright test --grep @schdGroupCreateUI  # Specific feature
npx playwright test --grep "@edit|@delete"    # Multiple tags (OR)
npx playwright test --headed                   # Visual mode
npx playwright test --debug                    # Debug mode
npx playwright test --reporter=html            # HTML report

# Test combinations
npx playwright test --grep @ui --workers=4     # Parallel execution
npx playwright test --grep @ui --video=on      # Record videos
npx playwright test --grep @ui --trace=on      # Enable tracing


### **Essential Code Validation Commands**

bash
# Validate code before commit
npx tsc --noEmit                            # TypeScript check
grep -r "# COVERAGE:" tests/                # Check coverage comments
grep -r "# VALIDATES:" tests/               # Check validates comments
grep -r "// Locator:" tests/ui/steps/       # Check locator docs

# Code quality
npx eslint tests/                           # Lint check
npx prettier --check tests/                 # Format check

# Feature file syntax
npx playwright test --list --grep @ui 2>&1  # Validate feature files


### **Essential Commands**

bash
# Validate code before commit
npx tsc --noEmit                          # TypeScript check
grep -r "# COVERAGE:" tests/              # Check coverage comments
grep -r "// Locator:" tests/ui/steps/     # Check locator docs

# Run tests
npx playwright test --grep @ui            # All UI tests
npx playwright test --grep @smoke         # Smoke tests
npx playwright test --grep @schdGroupEditUI --headed  # Headed mode

# Code quality
npx eslint tests/                         # Lint check
npx prettier --check tests/               # Format check


### **File Templates**

**Feature File:**

@tag @ui
Feature: [Name]
# COVERAGE: REQ.XX
# VALIDATES: rule1, rule2
Scenario: [Description]
  Given...


**Step File:**

import { Page } from '@playwright/test';
import users from '@core/data/users.json' with { type: 'json' };
// COVERAGE: Feature - Description
let scenarioContext = { page: null };
Given('...', async ({ }) => {...});


**Test Data:**
json
{
  "groupName": "Test_Group",
  "notes": "Test notes",
  "area": "News"
}


---

## **VERSION HISTORY**

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Mar 19, 2026 | Initial framework guidelines |
| 1.1 | TBD | Add API testing standards |
| 1.2 | TBD | Add database testing standards |

---

## **REFERENCES**

- [Playwright Testing Guide](https://playwright.dev/docs/intro)
- [BDD & Gherkin Syntax](https://cucumber.io/docs/gherkin/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/)
- [git Workflow](https://git-scm.com/docs)

---

## **QUESTIONS OR UPDATES?**

For clarifications or to propose updates:
1. Open an issue with label documentation
2. Reference this file and specific section
3. Provide use case or example
4. Submit PR with updated guidelines

---

**Document Version:** 1.0  
**Last Updated:** March 19, 2026  
**Maintained By:** QA Automation Team  
**Applies To:** All team members, contributors, and LLMs



