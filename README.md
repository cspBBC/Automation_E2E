#  E2E Test Automation Framework - Complete Developer Guide

**Welcome!** This comprehensive guide will help you understand and master this enterprise-grade test automation framework. Whether you're writing your first test or debugging complex scenarios, you'll find detailed explanations, real examples, and best practices here.

---

##  Table of Contents

### Getting Started
1. [Framework Overview](#1-framework-overview)
2. [Prerequisites & Setup](#2-prerequisites--setup)
3. [Quick Start (5 Minutes)](#3-quick-start-5-minutes)

### Understanding the Architecture
4. [Project Structure Explained](#4-project-structure-explained)
5. [How the Framework Really Works](#5-how-the-framework-really-works)
6. [Complete Test Execution Flow](#6-complete-test-execution-flow)
6.1. [**API Integration Suite Deep Dive** (NEW)](#61-api-integration-suite-deep-dive) 

### Deep Dives
7. [Test Execution Commands - Complete Reference](#7-test-execution-commands--complete-reference)
8. [Understanding Each Utils Module](#8-understanding-each-utils-module)
9. [Writing Your First Test - Step by Step](#9-writing-your-first-test--step-by-step)

### Advanced Topics
10. [Page Objects Explained](#10-page-objects-explained)
11. [Test Data & Form Filling](#11-test-data--form-filling)
12. [Parallel Execution & Context Isolation](#12-parallel-execution--context-isolation)
13. [Fixtures & Reusable Setup](#13-fixtures--reusable-setup)

### Reference & Support
14. [Common Workflows & Patterns](#14-common-workflows--patterns)
15. [Troubleshooting Guide](#15-troubleshooting-guide)
16. [Best Practices](#16-best-practices)
17. [FAQ](#17-faq)

---

# 1. Framework Overview

## What Problem Does This Solve?

Before this framework, teams faced:
-  Flaky tests that fail randomly
-  Tests that interfere with each other in parallel
-  Slow test execution (1 test = 5+ minutes)
-  Hard to maintain selectors and test logic
-  Tests written in code-only format (non-technical people can't understand)

**Our Solution:** A comprehensive framework that addresses all these challenges.

## What Technology Stack Are We Using?



             Test Automation Framework Stack             

 BDD Layer       Gherkin (.feature files)               
                 Playwright-BDD (step matching)         

 Test Layer      API Tests (REST client)                
                 UI Tests (Playwright browser)          
                 DB Tests (Direct SQL execution)        

 Utility Layer   Form Filler (auto-fill forms)         
                 JSON Reader (load test data)           
                 Page Factory (page object creation)    
                 Context Manager (parallel isolation)   

 Framework Foundation                                     
 Playwright (browser) | Node.js | TypeScript            



## Key Capabilities

| Capability | What It Means | Example |
|-----------|---------------|---------| 
| **BDD Format** | Write tests in plain English, not just code | "When user creates a scheduling group" (non-technical team can read) |
| **UI Testing** | Automate browser interactions | Click buttons, fill forms, verify text appears |
| **API Testing** | Test backend endpoints directly | POST /api/groups, verify response |
| **Database Testing** | Run SQL queries and stored procedures | Execute SP_CreateGroup, verify results |
| **Parallel Execution** | Run multiple tests at same time | 100 tests in 2 minutes (vs 30+ minutes sequentially) |
| **Page Objects** | Encapsulate UI selectors and interactions | Update one place = all tests still work |
| **Context Isolation** | Each test has isolated storage | Test 1's data doesn't affect Test 2 |
| **CI/CD Integration** | Automatic GitHub Actions integration | Tests run on every git push |

---

# 2. Prerequisites & Setup

## System Requirements

bash
# Check what you have installed
node --version        # Should be 16.x or higher
npm --version         # Should be 8.x or higher
git --version         # Any recent version


## Step 1: Clone & Install

bash
# Clone repository
git clone <YOUR_REPO_URL>
cd Automation_E2E

# Install all dependencies
npm install
# This installs:
# - Playwright (browser automation)
# - Playwright-BDD (step matching)
# - TypeScript (type checking)
# - All testing libraries


## Step 2: Create Environment Configuration Files

The framework needs .env files to know which environment to test and what credentials to use.

### Create .env.dev (Development Environment)

bash
# .env.dev - DEV Environment Configuration
# Database Connection Details
DB_AUTH_TYPE=sql
DB_HOST=dev-clus15-lsn1.national.core.bbc.co.uk  # Your dev database server
DB_NAME=BBCSchedules_WP                           # Your database name
DB_USER=ALLOCATE-D                               # Database user
DB_PASSWORD=ALLOCATE-D1                          # Database password

# Application URLs
API_BASE_URL=https://allocate-dev-wp.national.core.bbc.co.uk/api  # Dev API endpoint
UI_BASE_URL=https://allocate-dev-wp.national.core.bbc.co.uk      # Dev application URL

# User Credentials (from core/data/users.json)
SYS_ADMIN_PASSWORD=Jr.ntr@090909                # System Admin password
AREA_ADMIN_PASSWORD=BBC@2025@                   # Area Admin password
AREA_ADMIN_1_PASSWORD=your_actual_password      # Additional Area Admin
REGULAR_USER_PASSWORD=your_actual_password      # Regular user password

ENVIRONMENT=dev                                 # Always "dev" for this file


**Key Concepts:**
- DB_HOST + DB_USER + DB_PASSWORD = How to connect to development database
- API_BASE_URL + UI_BASE_URL = Where the dev application is hosted
- Passwords = Must match the users defined in core/data/users.json
- ENVIRONMENT=dev = Tells framework to use this file

### Create .env.systest (Staging/System Test Environment)

bash
# .env.systest - STAGING Environment Configuration
# Database Connection Details (Staging/Pre-Production)
DB_AUTH_TYPE=sql
DB_HOST=systest-clus15-lsn1.national.core.bbc.co.uk  # Your staging database server
DB_NAME=BBCSchedules_WP                              # Same database name
DB_USER=ALLOCATE-SYSTEST                            # Staging database user
DB_PASSWORD=ALLOCATE-SYSTEST-PWD                    # Staging database password

# Application URLs
API_BASE_URL=https://allocate-systest-wp.national.core.bbc.co.uk/api  # Staging API endpoint
UI_BASE_URL=https://allocate-systest-wp.national.core.bbc.co.uk      # Staging app URL

# User Credentials (from core/data/users.json)
SYS_ADMIN_PASSWORD=Jr.ntr@090909                # System Admin password (same as dev)
AREA_ADMIN_PASSWORD=BBC@2025@                   # Area Admin password (same as dev)
AREA_ADMIN_1_PASSWORD=your_actual_password      # Additional Area Admin
REGULAR_USER_PASSWORD=your_actual_password      # Regular user password

ENVIRONMENT=systest                             # Always "systest" for this file


**Key Concepts:**
- **Same structure as .env.dev** - only the host/URL values differ
- Uses **staging database server** instead of dev
- Used by **CI/CD pipelines** for automated testing before production
- Passwords should be **same as dev** (user accounts replicated between environments)

## Step 3: Verify Installation

bash
# Run this command to verify everything is installed
npm run uidevtest --help

# You should see Playwright test runner help text
# If you get an error, something isn't installed correctly


---

# 3. Quick Start (5 Minutes)

## Scenario: You want to run a test

### Command 1: Run UI Tests (See the browser)

bash
npm run uidevtest


**What happens:**
1.  Loads .env.dev configuration
2.  Launches Chrome browser (you can see it)
3.  Runs all UI tests marked with @ui tag
4.  Tests execute one-by-one (single worker)
5.  Results shown in terminal + HTML report

**Output:**

PASS  tests/ui/features/NP035/schedulinggroup_ui_create.feature
   AreaAdmin creates a scheduling group (5s)
   SystemAdmin edits the group (8s)
   SystemAdmin deletes the group (3s)

==== 3 passed (16s) ====


### Command 2: Run API Tests (No browser)

bash
npm run apitest


**What happens:**
1.  Makes HTTP requests directly to API
2.  No browser needed (faster)
3.  Runs headless (background)
4.  Verifies API responses, status codes, data

### Command 3: Run Everything

bash
npm run test:dev


**What happens:**
1.  Runs both UI tests + API tests
2.  UI tests with visible browser
3.  API tests headless
4.  Both use DEV environment config

### View Results

bash
npm run report


This opens an interactive HTML report showing:
-  Passed/failed tests
-  Execution time
-  Video recordings of failures
-  Screenshots
-  Full test logs

---

# 4. Project Structure Explained

## Directory Tree with Explanations


 Automation_E2E/

  tests/                               ALL TEST CODE LIVES HERE
   
     ui/                              Browser/UI automation tests
        features/                    Feature files (what to test, in English)
           NP035/
              schedulinggroup_ui_create.feature      Test scenario in Gherkin
              schedulinggroup_ui_edit.feature
              schedulinggroup_ui_delete.feature
              schedulinggroup_ui_permission_boundary.feature
      
        steps/                       Step implementations (how to test, in code)
           NP035/
              schedulinggroup_ui_common.steps.ts     Shared steps (Given/When)
              schedulinggroup_ui_create.steps.ts     Create logic
              schedulinggroup_ui_edit.steps.ts       Edit logic
              schedulinggroup_ui_delete.steps.ts     Delete logic
              schedulinggroup_ui_history.steps.ts    History logic
              schedulinggroup_ui_permission_boundary.steps.ts
      
        page/                        Page objects (UI elements & methods)
           NP035/
              ScheduledGroupPage.ts    All interactions with Scheduling Group page
      
        fixtures/                    Reusable test setup
           db.fixture.ts               Database fixture
           fixture.ts                  Base fixture
           pages.fixture.ts            Login fixture
   
     integrated/                      API & Database tests
        features/                    API test scenarios
           NP035/
              schedulinggroup_api_create.feature
      
        steps/                       API test implementations
            NP035/
               schedulinggroup_api_create.steps.ts
   
     fixtures/                        Shared fixtures (entire project)
       db.fixture.ts                   Database connection setup
       fixture.ts                      Base test setup
       pages.fixture.ts                Login & browser setup
   
     utils/                           Utility functions (everyone uses these)
        formFilledType.ts               TypeScript types for forms
        formFiller.ts                   Auto-fill HTML forms with data
        pageFactory.ts                  Get page objects by name
        readJson.ts                     Load JSON test data files
        scenarioContextManager.ts       Isolated context per test (for parallel)

  core/                                Framework core services
     api/                             HTTP client for API calls
       apiClient.ts                    Make requests to backend API
   
     db/                              Database automation
       connection.ts                   Database connection setup
       executeSp.ts                    Execute stored procedures
       queries.ts                      Execute SQL queries
       dbseed.ts                       Seed database with test data
   
     config/                          Environment configuration
       envConfig.ts                    Load .env files and expose variables
   
     data/                            Reference data
        users.json                      User credentials (systemAdmin, areaAdmin, etc)

  workflows/                           Test data organized by feature
     schedulingGroup/                 All data for Scheduling Group feature
        data/                        Form fill data (JSON files)
          schdGroupCreate_AreaAdminNews_UIdata.json
          schdGroupCreate_SystemAdmin_UIdata.json
          schdGroupCreate_ApiRequestPayload.json
      
        db/                          Database operations
           queries/
               schedulingGroup.queries.ts
   
     facility/                        All data for Facility feature
        data/
           facilityCreate_AreaAdminNewsUIdata.json
   
     schedulingTeam/                  All data for Scheduling Team feature
         data/
            schdTeamCreate_UIdata.json

  playwright-report/                   Generated HTML test report
    index.html                          Open this in browser to see results

  test-results/                        Test artifacts
     ui/                              UI test results
     video files                      Failure recordings
     screenshots                      Failure screenshots

  package.json                         Project dependencies & npm scripts
  playwright.config.ts                 Playwright configuration
  tsconfig.json                        TypeScript configuration
  .env.dev                             DEV environment config (YOU CREATE)
  .env.systest                         STAGING environment config (YOU CREATE)
  README.md                            This file!


## Folder Purpose Summary

| Folder | Purpose | Owner | Created By |
|--------|---------|-------|-----------|
| tests/ui/features/ | **What** to test (Gherkin) | QA/Business | Business analyst writes these |
| tests/ui/steps/ | **How** to test for UI (Code) | QA/Automation | Automation engineer |
| tests/ui/page/ | **UI element interactions** | Automation | Automation engineer (once, reused by all) |
| tests/integrated/ | **API/DB tests** | QA/Backend | Automation engineer + Backend |
| tests/utils/ | **Reusable utilities** | Framework | Framework developers (not changed often) |
| core/ | **Framework services** | Framework | Framework developers |
| workflows/ | **Test data** | QA | Data specialists or QA |
| core/data/users.json | **User credentials** | DevOps/Admin | Environment admins |

---

# 5. How the Framework Really Works

## The Complete Picture



                    TEST EXECUTION FLOW DIAGRAM                      


Step 1: YOU WRITE

 Feature File        
 (Gherkin - plain    
  English)           
                     
 Scenario: User      
 creates a group     

        

Step 2: FRAMEWORK MATCHES

 Step Definitions    
 (TypeScript code)   
                     
 Match each step     
 to code             

        

Step 3: CODE EXECUTES

 Fixtures            
 (Setup: login user) 
                     
 Page Objects        
 (Interact with UI)  
                     
 Utilities           
 (Fill forms, etc)   

        

Step 4: VERIFY

 Assertions          
 (Check results)     
                     
 Database queries    
 (Verify backend)    
                     
 API calls           
 (Check responses)   

        

Step 5: REPORT

 HTML Report         
 - Pass/Fail         
 - Screenshots       
 - Videos            
 - Logs              



## Real Concrete Example: Creating a Scheduling Group

**Below is the EXACT sequence of what happens when you run ONE test:**

### Phase 1: Test Initialization (0ms)

typescript
// File: tests/ui/features/NP035/schedulinggroup_ui_create.feature
//  What the test is supposed to do (written in plain English)

@schdGroupCreateUI @ui
Feature: Scheduling Group CRUD - Create

  Scenario: SystemAdmin creates a scheduling group successfully
    Given user 'systemAdmin' is on the "Scheduled Group" page
    When the user creates a new scheduling group using "schdGroupCreate_SystemAdmin_UIdata"
    Then the scheduling group is visible to 'systemAdmin'


**What the framework does:**
1.  Reads the feature file
2.  Parses each step (Given/When/Then)
3.  Finds matching step definitions in TypeScript files
4.  Prepares test execution
5.  Initializes a new context for this test (isolated storage)

### Phase 2: Login (1-2 seconds)

typescript
// File: tests/ui/steps/NP035/schedulinggroup_ui_common.steps.ts
// STEP: "user 'systemAdmin' is on the Scheduled Group page"

Given('user {string} is on the {string} page',
  async ({ loginAs }, userAlias: string, pageName: string) => {
    
    // Initialize context for this test
    initializeScenarioContext();
    
    // Use fixture to login
    const page = await loginAs(userAlias);  //  Fixture: uses users.json
    // Result: Logged in as systemAdmin in Chrome browser
    
    // Get page object
    const pageObject = getPageObject(pageName, page);  //  Factory: creates ScheduledGroupPage
    
    // Navigate to page
    await pageObject.open();  //  Page navigates to /mvc-app/admin/scheduling-group
    
    // Store for later use
    scenarioContext.page = page;  //  Stored in isolated context
    scenarioContext.scheduledGroupPage = pageObject;
    scenarioContext.currentUserAlias = userAlias;
    
    console.log( User '{userAlias}' logged in and on Scheduling Group page);
  }
);


**Behind the scenes:**

| What | Where | Why |
|------|-------|-----|
| User data (username, password) | core/data/users.json | Framework knows who to login |
| Password from environment | .env.dev | Sensitive data kept secure |
| Browser launched | Playwright | Needed to interact with UI |
| Page opened | https://dev-url/mvc-app/admin/scheduling-group | Where user navigates |
| Context created | contextStore[testId] | Isolated storage for this test |

### Phase 3: Create Scheduling Group (3-5 seconds)

typescript
// File: tests/ui/steps/NP035/schedulinggroup_ui_create.steps.ts
// STEP: "the user creates a new scheduling group using..."

When('the user creates a new scheduling group using {string}',
  async ({ }, filename: string) => {
    
    // Get page object from context
    const pageObject = scenarioContext.scheduledGroupPage;  //  From Phase 2
    
    // Call page object method to create
    await pageObject.createScheduledGroup(filename);
    // This calls: createScheduledGroup('schdGroupCreate_SystemAdmin_UIdata')
    
    // Get created group name
    const groupName = ScheduledGroupPage.lastCreatedGroupName;
    scenarioContext.lastCreatedGroupName = groupName;  //  Store for next step
    
    console.log( Created group: "{groupName}");
  }
);


**Inside ScheduledGroupPage.createScheduledGroup():**

typescript
// File: tests/ui/page/NP035/ScheduledGroupPage.ts

async createScheduledGroup(filename: string) {
  // Step 1: Click "Add Scheduling Group" button
  await this.page.getByRole('button', { name: 'Add Scheduling Group' }).click();
  
  // Step 2: Wait for modal to appear
  await this.page.locator('#facebox').waitFor({ state: 'visible' });
  
  // Step 3: Load test data from JSON
  const jsonPath = workflows/schedulingGroup/data/{filename}.json;
  //         Loads: schdGroupCreate_SystemAdmin_UIdata.json
  const jsonData = await readJSON(jsonPath);
  // Result: { "group_name": { type: "text", value: "..." }, ... }
  
  // Step 4: Generate unique group name (to avoid duplicates)
  const timestamp = Date.now();  // 1710000000000
  const randomNum = Math.floor(Math.random() * 10000);  // 5678
  jsonData['group_name'].value = Test_SchdGrp_{timestamp}_{randomNum};
  //  Result: "Test_SchdGrp_1710000000000_5678"
  
  // Step 5: Store group name in static property
  ScheduledGroupPage.lastCreatedGroupName = jsonData['group_name'].value;
  
  // Step 6: Fill form with data
  await this.fill(jsonData);
  // This calls formFiller utility internally:
  // - Fills text inputs
  // - Selects dropdowns
  // - Checks checkboxes
  // - Selects date pickers
  // - Clicks submit button
}


**Test data file being used:**

json
// File: workflows/schedulingGroup/data/schdGroupCreate_SystemAdmin_UIdata.json
{
  "group_name": {
    "type": "text",
    "value": "Default Name",  //  Gets replaced with unique name above
    "selector": "#group_name"
  },
  "division_id": {
    "type": "dropdown",
    "value": "1",  //  Selects option with value="1"
    "selector": "#division_id"
  },
  "description": {
    "type": "textarea",
    "value": "Test description",
    "selector": "#description"
  },
  "submit_button": {
    "type": "button",
    "selector": "button[type='submit']"
  }
}


### Phase 4: Verify Scheduling Group Exists (1-2 seconds)

typescript
// File: tests/ui/steps/NP035/schedulinggroup_ui_create.steps.ts
// STEP: "the scheduling group is visible"

Then('the scheduling group is visible to {string}',
  async ({ }, userName: string) => {
    
    // Get page object and group name from context
    const pageObject = scenarioContext.scheduledGroupPage;  //  From Phase 2
    const groupName = scenarioContext.lastCreatedGroupName;  //  From Phase 3
    
    // Call page object method to verify
    await pageObject.verifyScheduledGroupVisibleForUser();
    
    console.log( Verified: Group "{groupName}" is visible for '{userName}');
  }
);


**Inside ScheduledGroupPage.verifyScheduledGroupVisibleForUser():**

typescript
// File: tests/ui/page/NP035/ScheduledGroupPage.ts

async verifyScheduledGroupVisibleForUser() {
  // Get group name from static property
  const groupName = ScheduledGroupPage.lastCreatedGroupName;
  
  // Search for group in table
  const groupRow = this.page.locator('table#scheduling-list-table tbody tr').filter({
    has: this.page.locator(td.scheduling-group-name:has-text("{groupName}"))
  });
  
  // Assert: exactly 1 row found (group exists)
  await expect(groupRow).toHaveCount(1);  //  If not 1, test FAILS 
  
  // If we get here, test PASSES 
}


### Phase 5: Test Complete - Report


 PASSED: user 'systemAdmin' is on the "Scheduled Group" page (2.1s)
 PASSED: the user creates a new scheduling group using "schdGroupCreate_SystemAdmin_UIdata" (4.3s)
 PASSED: the scheduling group is visible to 'systemAdmin' (1.8s)

Total: 8.2 seconds
Status: PASSED 


---

# 6. Complete Test Execution Flow

## Visual Execution Timeline


Test Starts
 0ms: Read feature file
 10ms: Find matching steps
 20ms: Initialize context (contextStore[testId] created)

 30ms: GIVEN STEP - Login user
    Load user from users.json
    Launch Chrome browser
    Navigate to login URL
    Web server validates credentials
    Redirect to /mvc-app/admin/scheduling-group
     Login Complete (2s elapsed)

 2030ms: WHEN STEP - Create group
    Click "Add Scheduling Group" button
    Modal appears on UI
    Load test data from schdGroupCreate_SystemAdmin_UIdata.json
    Generate unique group name
    Fill form fields using formFiller utility
    Click submit button
    Wait for backend to create group in DB
    UI refreshes with new group
     Group Created (6s elapsed)

 6030ms: THEN STEP - Verify visibility
    Search for group name in table
    Assert found exactly 1 row
     Verification Complete (9s elapsed)

 9030ms: TEST COMPLETE
    Cleanup context
    Take final screenshot if needed
    Close browser (if --no-headed)
    Report: PASSED 


## Parallel Execution Example

When running npm run test:ci, multiple tests run AT THE SAME TIME:



   Worker Thread 1       Worker Thread 2       Worker Thread 3    

 Test A                Test B                Test C               
 contextStore[1]       contextStore[2]       contextStore[3]      
                                                                  
 0ms:                  0ms:                  0ms:                 
 Login systemAdmin     Login areaAdmin_News  Login facilityAdmin  
                                                                  
 2s:                   2s:                   2s:                  
 Create Group A        Create Group B        Create Group C       
 groupName: "TeamA"    groupName: "TeamB"    groupName: "TeamC"   
 contextStore[1]       contextStore[2]       contextStore[3]      
 .lastCreated..="A"    .lastCreated..="B"    .lastCreated..="C"   
                                                                  
 8s:                   8s:                   8s:                  
 Verify Group A        Verify Group B        Verify Group C       
 Searches table for    Searches table for    Searches table for   
 "TeamA"             "TeamB"             "TeamC"            
                                                                  
 10s: COMPLETE      10s: COMPLETE      10s: COMPLETE     
                                                                  


Result: 3 tests in 10 seconds (vs 30 seconds sequential)
Memory: Each test has isolated context = No collisions 


---

# 6.1. API Integration Suite Deep Dive

## What is the Integration Suite?

The **Integration Suite** (tests/integrated/) is a specialized testing layer for **API and backend testing** without any UI/browser interaction. It tests:

| What | Example | Why |
|------|---------|-----|
| **Direct API Calls** | POST /mark-action.php with parameters | Verify backend accepts requests |
| **Response Validation** | Check status=200, response body has "success":true | Ensure correct responses |
| **NTLM Authentication** | Authenticate user, reuse session for requests | Secure API access |
| **Database Verification** | Execute queries to verify data persisted | Confirm backend data integrity |

## Why a Separate Integration Suite?

### Problem With UI-Only Tests:

UI Tests (Browser-based):
 Tests complete user journey
 Finds UI bugs early
 Slow (1 test = 5-10 seconds)
 Brittle (selectors break easily)
 Heavy (browser uses 500MB+ RAM)
 Can't test server logic directly

Integration Tests solve this:
 Fast: No browser overhead (1 test = 1-2 seconds)
 Reliable: Test logic, not UI selectors
 Lightweight: 10+ tests in parallel easily
 Direct verification: Call API directly


### Real Example:

**User creates scheduling group:**

| Layer | What Happens | Time |
|-------|--------------|------|
| UI Test | 1. Click "Add Group"  2. Fill form  3. Click Submit  4. Wait for UI  5. Verify in table | **~30 seconds**  |
| Integration Test | 1. POST /api/create-group  2. Parse response  3. Verify status + data | **~2 seconds**  |

## Architecture: How Integration Tests Work



              INTEGRATION TEST ARCHITECTURE                       


Feature File (allocations_api_edit.feature)
        
    "Given user 'systemAdmin' is authenticated"
    "When the user hits mark-action.php to edit allocation..."
    "Then verify the edit endpoint returned expected response"
        
 GIVEN STEP: Authentication
   Load user credentials from core/data/users.json
   Authenticate via NTLM (Windows authentication)
   Get authenticated session (browser instance)
   Store in shared context: requestContext.authenticatedPage

 WHEN STEP: Make API Request
   Load test parameters from workflows/allocations/data/allocationApi_PostParams.json
   Build query string with parameters
   Send HTTP request using authenticated session
   Capture response status code & body
   Store in context: requestContext.status, requestContext.body

 THEN STEP: Validate Response
    Assert status code = 200
    Parse JSON response
    Assert "success" = true
    Test PASSES 


## Understanding NTLM Authentication

### What is NTLM?

**NTLM** = NT LAN Manager (Windows authentication protocol)

- Used in **enterprise environments** (like BBC internal systems)
- More secure than basic username:password
- Encrypts credentials in transit
- Validates against Windows domain

### Why Do We Use NTLM in Integration Tests?


Application Flow:

  Allocation System (Web App)         
  Requires NTLM authentication        
                                      
  Protected Endpoints:                
  - /mark-action.php (requires auth)  
  - /create-group.php (requires auth) 
  - /delete-allocation.php (requires) 

        
         Must authenticate first!
        
Test needs to:
1. Authenticate user via NTLM
2. Get session/cookies
3. Use authenticated session for API calls


### NTLM Flow in Detail


Test Execution Timeline:

Time 0ms:

 Test START: "Given user 'systemAdmin' is authenticated"

        

Time 50ms:

 Step: allocations_api_common.steps.ts   
 Code: Given('user {string} is authenticated'...)
                                         
 Actions:                                
 1. Load from users.json:                
    - username: "patans01"               
    - password: from .env (SYS_ADMIN..)  
                                         
 2. Launch Playwright browser (headless) 
    - No GUI (runs in background)        
    - Uses system credentials            
                                         
 3. Navigate to login URL:               
    GET https://allocate-systest/.../   
    Web server response:                 
    - Redirect to NTLM challenge page    

        

Time 200ms:

 NTLM Authentication Handshake:          
                                         
 Browser sends NTLM Type 1 message       
 Server responds with Type 2 challenge   
 Browser computes Type 3 response        
 (Cryptographic proof of password)       
                                         
 Server validates:                       
  Username = patans01                  
  Password hash correct                
  Timestamp not too old                
  Grant access                         

        

Time 300ms:

 Session Established:                    
                                         
 Browser receives:                       
 - Session cookie (secure, httpOnly)     
 - Redirect to /mvc-app/admin/home       
                                         
 Browser stores cookie automatically     
 (Playwright handles this transparently) 
                                         
 requestContext.authenticatedPage        
 = browser with active session         

        

Time 500ms:

 Step COMPLETE:                          
  User authenticated successfully      
  Session ready for API calls          
  Context stores: authenticatedPage    



### Why Browser + NTLM? (Architectural Decision)

You might ask: **"Why do we launch a browser just to authenticate for API tests? Can't we just use API-only auth?"**

This is an **excellent architectural question**, and the answer reveals an important framework design philosophy:

#### Problem: Multiple Authentication Approaches


Scenario: You have NTLM-protected APIs

Option 1: Manual NTLM Implementation
problem: Implementation Challenge
   NTLM protocol is complex (3-step handshake)
   Need cryptographic calculations
   Must handle challenge/response manually
   Session state management required
    High maintenance burden
  
Option 2: Browser-Based Authentication
Solution: Let Browser Handle It
   Browser built-in NTLM support
   Handles all cryptography automatically
   Session cookies stored automatically
   Works exactly like real user login
    Zero maintenance, proven reliability


#### The Core Insight: Session Reusability

The **key architectural benefit** is **reusing the authenticated session**:



        FRAMEWORK DESIGN: Unified Authentication          


Allocation System Architecture:

  Login Page         
  (NTLM Protected)      Browser authenticates here

                   
                   
          
           Session Cookie    Stored in browser
          
                   
         
           Authenticated User 
         
                    
      
                                 
           
     UI Tests           API Tests   
   (Browser)            (Browser)   
   - Click              - Reuse     
   - Fill                 session   
   - Verify             - Direct    
                          API calls 
           

 BENEFIT: Single session for both UI and API tests
 BENEFIT: No duplicate auth logic
 BENEFIT: Matches real user behavior


#### Why This Approach is Better:

**Comparison Table:**

| Aspect | Manual HTTP NTLM | Browser Session (Current) |
|--------|------------------|--------------------------|
| **Implementation** | Complex (crypto, handshakes) | Simple (browser does it) |
| **Maintenance** | High (updates needed for NTLM changes) | Zero (browser maintained by OS) |
| **Reliability** | Fragile (easy to break) | Solid (proven by all browsers) |
| **Session Reuse** | Limited | Full (UI and API both use same session) |
| **Real-World Match** | Artificial (not how users work) | Accurate (matches real login) |
| **Debugging** | Complex (crypto issues hard to debug) | Easy (browser API transparent) |
| **Code Complexity** | 200+ lines | 10 lines (use browser) |

#### Real-World Scenario:


TEST FLOW: Create Allocation (UI) + Verify via API

Without Browser Session Reuse:

 Step 1: Login for UI Test                    
 - Use browser for UI auth                    
 - Get session: sessionId_UI                  

        

 Step 2: Create allocation via UI             
 - Click button, fill form, submit            
 - Allocation saved to database               

        

 Step 3: Logout from UI                       
 - Close browser                              
 - sessionId_UI invalidated                 

        

 Step 4: Verify via API (separate test)       
 - Login AGAIN (different auth code)          
 - Manual NTLM implementation (error-prone)   
 - Get session: sessionId_API                 
 - Call API to verify allocation              
 -  Duplicated auth logic                   
 -  Harder to maintain                      


Problems:
 TWO different auth implementations
 Maintenance burden (fix auth bugs twice)
 Session handling is brittle
 Not realistic (different sessions)


With Browser Session Reuse (Current):

 Step 1: Authenticate in Browser              
 - Browser handles NTLM (automatic)           
 - Gets session cookie                        
 - Stores in browser                          
 - sessionId = browser.cookies['auth']        

        

 Step 2a: UI Test (same session)              
 - browser.goto(page)                         
 - Click button, fill form                    
 - Session cookie sent automatically          
 - Allocation created                       

        

 Step 2b: API Test (same session)             
 - requestContext.authenticatedPage = browser 
 - browser.goto(apiUrl)                       
 - Session cookie still valid               
 - API call succeeds                          
 - Verify allocation via API                


Benefits:
 ONE unified auth approach
 Browser handles all complexity
 No duplicate code
 Perfect session management
 Matches real user behavior
 Easy to maintain
 Both UI and API use same session


#### Why This Matters for Your Framework:


Without session reuse:
 Allocations: Manual NTLM code
 Facility: Duplicate manual NTLM code
 Scheduling Team: Duplicate manual NTLM code
 Result: Maintenance nightmare 

With session reuse (Current):
 Allocations: Browser + session (reusable)
 Facility: Use same browser session 
 Scheduling Team: Use same browser session 
 Common: One authentication fixture
 Result: Scalable, maintainable 


#### The Bottom Line:

**We use a browser for NTLM authentication NOT because we're building a UI test, but because:**

1. **Browser is the best NTLM client** available (built-in OS support)
2. **Session can be reused** for both UI and API tests
3. **Maintenance is zero** (browser maintained by OS/browser vendors)
4. **It's fool-proof** (can't break what's proven by millions of users)
5. **Scalable** (works for all modules without duplication)

This is an example of **choosing the right tool for the job** rather than reinventing the wheel with complex cryptography!

---

## Integration Suite File Structure


tests/integrated/

 features/
    NP035/
        allocations_api_edit.feature        What to test (plain English)

 steps/
    NP035/
        allocations_api_common.steps.ts     GIVEN steps (authentication)
        allocations_api_edit.steps.ts       WHEN/THEN steps (API calls)
        allocationApi.config.ts             Configuration (endpoints, actions)
        allocationApi.helper.ts             Helper (wrapper for API calls)

 helpers/
     (now moved to tests/utils/)


### Key Files Explained

#### 1. Feature File: allocations_api_edit.feature

gherkin
@allocation-api @smoke
Feature: Duty Allocation Edit via API

    @post
    Scenario Outline: Edit allocation with <user> user, <testDataFile> and <scenario> parameters
        Given user '<user>' is authenticated
        When the user hits mark-action.php to edit allocation with "<testDataFile>" and "<scenario>" parameters
        Then verify the edit endpoint returned expected response

        Examples:
            | user          | testDataFile               | scenario                |
            | systemAdmin   | allocationApi_PostParams.json | allocation-edit-default |


**Why this structure:**
-  <user> parameter = Works with ANY user from users.json
-  <testDataFile> = Works with ANY test data file
-  <scenario> = Works with ANY scenario within the file
-  Scenario Outline + Examples = Easy to add more test cases

#### 2. Authentication Step: allocations_api_common.steps.ts

typescript
import { createBdd } from 'playwright-bdd';
import { test } from '@fixtures/fixture';
import { getSharedContext } from '@helpers/apiHelper';

const { Given } = createBdd(test);

// This step runs ONCE per test
Given('user {string} is authenticated', async ({ authenticateWithNtlm }, userName: string) => {
  const requestContext = getSharedContext();
  
  console.log(\n[AUTH] Authenticating as: {userName});
  
  // authenticateWithNtlm = Playwright fixture
  // Returns: browser page with active NTLM session
  requestContext.authenticatedPage = await authenticateWithNtlm(userName);
  
  console.log([OK] NTLM session ready for API requests\n);
});


**What's happening:**
- authenticateWithNtlm(userName) = Custom fixture from tests/fixtures/fixture.ts
- Loads user from core/data/users.json
- Gets password from .env file
- Authenticates via NTLM (all handled by Playwright)
- Returns authenticated browser page
- Stores in shared context for later API calls

#### 3. API Request Step: allocations_api_edit.steps.ts

typescript
When('the user hits mark-action.php to edit allocation with {string} and {string} parameters', 
  async ({}, testDataFile: string, scenario: string) => {
    const requestContext = getSharedContext();
    
    // Load test data from JSON file
    const params = {
      ...loadTestParameters({API_CONFIG.dataPath}/{testDataFile}, scenario),
      action: API_CONFIG.actions.EDIT
    };
    
    // Make HTTP request using authenticated session
    await makeApiRequest(
      requestContext,
      'POST',
      API_CONFIG.endpoints.markAction,
      params,
      EDIT - Modify allocation (scenario: {scenario})
    );
  }
);


**What's happening:**
- loadTestParameters() = Load from JSON file (e.g., allocationApi_PostParams.json)
- Extract scenario key (e.g., "allocation-edit-default")
- Get all parameters from that scenario
- Add "action": "edit"
- Call makeApiRequest() with authenticated page

#### 4. Configuration: allocationApi.config.ts

typescript
export const ALLOCATION_API_CONFIG = {
  baseUrl: process.env.API_BASE_URL || 'https://allocate-systest-dbr.national.core.bbc.co.uk',
  dataPath: 'allocations/data',
  endpoints: {
    markAction: '/page-includes/allocations/weekly/actions/mark-action.php'
  },
  actions: {
    EDIT: 'edit',
    VIEW: 'view'
  }
};


**Why separate config file:**
-  Easy to change endpoints without touching code
-  All allocation-specific settings in one place
-  Environment variables loaded automatically
-  Reusable by all allocation tests

#### 5. Helper: allocationApi.helper.ts

typescript
export async function makeAllocationApiRequest(
  requestContext: ApiRequestContext,
  method: string,
  endpoint: string,
  params: Record<string, string>,
  note?: string
): Promise<void> {
  // Wrapper that adds allocation-specific config
  await makeModuleApiRequest(
    requestContext,
    method,
    ALLOCATION_API_CONFIG.baseUrl,    //  Allocation base URL
    endpoint,
    params,
    note
  );
}


**Why a wrapper:**
-  Steps don't need to know base URL
-  All allocation requests use same base URL
-  Easy to switch environments
-  Reusable across all allocation steps

## Step-by-Step: Complete API Test Flow

### Scenario: Testing allocation edit

**Test Data File:** workflows/allocations/data/allocationApi_PostParams.json

json
{
  "allocation-edit-default": {
    "DutyName": "Job_EDITED_PATANS01",
    "StartTime": "00:01",
    "EndTime": "00:05",
    "breakTimeHour": "0",
    "breakTimeMinute": "0",
    "dutyColorId": "None",
    "isNeedCovering": "off",
    "DutyDate": "2026-06-30",
    "DutyID": "6655748",
    "allocationsDutyId": "6655748",
    "allocationsSpId": "33720",
    ...
  }
}


### Execution Steps

#### Step 1: Test Starts (Feature File Parsed)


Framework reads: allocations_api_edit.feature
Finds: Scenario Outline with Examples
Extracts: user=systemAdmin, testDataFile=allocationApi_PostParams.json, scenario=allocation-edit-default
Creates: Test execution plan


#### Step 2: SETUP - Authenticate User (1-2 seconds)

typescript
//  GIVEN STEP EXECUTES
Given('user {string} is authenticated', ...)

Actions:
1. Context accessed: const requestContext = getSharedContext()
2. Get user details:
   - users.json["systemAdmin"]  {username: "patans01", ...}
3. Get password:
   - .env.systest  SYS_ADMIN_PASSWORD=Jr.ntr@090909
4. Launch Playwright browser (headless)
5. Navigate to login URL
6. NTLM negotiation happens automatically:
   - Browser  Server: Challenge/Response exchange
   - Credentials validated
   - Session established
7. Browser receives session cookie
8. Store in context:
   requestContext.authenticatedPage = browserPageWithActiveSession

 READY: Browser now authenticated, can make API calls


#### Step 3: EXECUTE - Make API Request (1-2 seconds)

typescript
//  WHEN STEP EXECUTES
When('the user hits mark-action.php to edit allocation...')

Actions:
1. Load test parameters:
   const params = loadTestParameters(
     'allocations/data/allocationApi_PostParams.json',
     'allocation-edit-default'
   )
   // Returns: { DutyName: "Job_EDITED_PATANS01", StartTime: "00:01", ... }

2. Add action:
   params.action = 'edit'

3. Build URL with query string:
   baseUrl = "https://allocate-systest-dbr.national.core.bbc.co.uk"
   endpoint = "/page-includes/allocations/weekly/actions/mark-action.php"
   
   Full URL:
   https://allocate-systest-dbr.national.core.bbc.co.uk/page-includes/allocations/weekly/actions/mark-action.php?DutyName=Job_EDITED_PATANS01&StartTime=00%3A01&EndTime=00%3A05&...

4. Send HTTP POST request:
   // Using authenticated browser session
   response = await requestContext.authenticatedPage.goto(fullUrl)
   // Browser automatically sends session cookie

5. Capture response:
   status = response.status()        // 200
   body = await response.json()      // {"success":true}
   
   Store in context:
   requestContext.status = 200
   requestContext.body = '{"success":true}'

 REQUEST COMPLETE: Data stored for validation


#### Step 4: VERIFY - Assert Response (1-2 seconds)

typescript
//  THEN STEP EXECUTES
Then('verify the edit endpoint returned expected response')

Actions:
1. Get context from request:
   const requestContext = getSharedContext()
   const status = requestContext.status        // 200
   const body = requestContext.body            // '{"success":true}'

2. Assert status code:
   expect(status).toBeGreaterThanOrEqual(200)    PASS
   expect(status).toBeLessThan(500)              PASS

3. Parse and assert body:
   const responseData = JSON.parse(body)       // {success: true}
   expect(responseData).toHaveProperty('success')    PASS
   expect(responseData.success).toBe(true)      PASS

 TEST PASSES!


#### Step 5: Cleanup


- Close browser session
- Clear context
- Report: PASSED 


## Parallel Integration Tests

Integration tests are **perfect for parallel execution** because:



   Thread 1         Thread 2         Thread 3      

 Allocations      Facility         Scheduling Team 
 Test 1           Test 2           Test 3          
                                                   
 User:            User:            User:           
 systemAdmin      areaAdmin_News   areaAdmin_Area1 
                                                   
 Context 1        Context 2        Context 3       
 Isolated!        Isolated!        Isolated!       
                                                   
 0s: Auth         0s: Auth         0s: Auth        
 1s: API Call     1s: API Call     1s: API Call    
 2s: Verify       2s: Verify       2s: Verify      
 3s: PASS       3s: PASS       3s: PASS      
                                                   


Result: 3 API tests in 3 seconds!
(vs 9 seconds sequential)


## Integration Suite Best Practices

###  DO:

1. **Use parameterized test data:**
   gherkin
   Examples:
     | user        | testDataFile               | scenario                |
     | systemAdmin | allocationApi_PostParams.json | allocation-edit-default |
     | areaAdmin   | allocationApi_PostParams.json | allocation-edit-with-coverage |
   
    Works with ANY user and ANY scenario

2. **Keep test data in separate JSON files:**
   
   workflows/allocations/data/allocationApi_PostParams.json
   workflows/facility/data/facilityApi_PostParams.json
   
    Easy to maintain, reuse across tests

3. **Use configuration files for module-specific settings:**
   typescript
   // allocationApi.config.ts
   export const ALLOCATION_API_CONFIG = {...}
   
    Centralized, environment-agnostic

4. **Leverage shared context:**
   typescript
   const requestContext = getSharedContext()
   
    Isolated per test, reusable within test

###  DON'T:

1. **Hardcode URLs or endpoints:**
   typescript
   //  BAD
   const response = await fetch('https://allocate-systest-dbr.national.core.bbc.co.uk/page-includes/...')
   
    Not reusable, breaks with environment change

2. **Duplicate test data:**
   typescript
   //  BAD
   const params = {
     DutyName: "Job_EDITED_PATANS01",
     StartTime: "00:01",
     ...
   }
   
    Hard to maintain across tests

3. **Hardcode user names:**
   gherkin
   //  BAD
   Given user 'systemAdmin' is authenticated
   
    Can't test with different users easily

4. **Create multi-step tests with no isolation:**
    Complex, flaky, hard to debug

## Running Integration Tests

bash
# Run all integration tests (systest environment)
npm run apitest:systest

# Output:
#  1  allocation with allocation-edit-default parameters @allocation-api @smoke @post (1.9s)
# 1 passed (5.8s)


## Creating a New API Module (For New Developers)

This section is a **step-by-step guide** for creating a completely new API module following the allocation pattern. Perfect for adding facility, scheduling team, or any other API module!

### Overview: What You're Creating


Your New Module: Facility API
 tests/integrated/steps/NP0XX/
    facilityApi.config.ts         Endpoints & config
    facilityApi.helper.ts         Module-specific wrapper
    facility_api_common.steps.ts  Authentication + shared steps
    facility_api_create.steps.ts  Create endpoint steps

 tests/integrated/features/NP0XX/
    facility_api_create.feature   BDD scenarios

 workflows/facility/data/
     facilityApi_PostParams.json   Test data


### Step 1: Create Config File (facilityApi.config.ts)

**File:** tests/integrated/steps/{FEATURE_FOLDER}/facilityApi.config.ts

typescript
/**
 * FACILITY API - Module-Specific Configuration
 * Centralized configuration for facility API tests
 * 
 * Pattern: Same as allocation, just facility-specific
 */

export const FACILITY_API_CONFIG = {
  baseUrl: process.env.API_BASE_URL || 'https://allocate-systest-dbr.national.core.bbc.co.uk',
  dataPath: 'facility/data',  //  Change for your module
  
  endpoints: {
    // Add your endpoints here
    create: '/api/facility/create',         // New facility endpoint
    edit: '/api/facility/edit',
    delete: '/api/facility/delete',
    view: '/api/facility/view'
  },
  
  actions: {
    CREATE: 'create',
    EDIT: 'edit',
    DELETE: 'delete',
    VIEW: 'view'
  }
};


**Key Points:**
-  dataPath: 'facility/data' = Points to your test data location
-  endpoints = All API endpoints your module uses
-  actions = Business operations
-  baseUrl = Same for all modules (from .env)

### Step 2: Create Helper File (facilityApi.helper.ts)

**File:** tests/integrated/steps/{FEATURE_FOLDER}/facilityApi.helper.ts

typescript
/**
 * FACILITY API - Internal Helper
 * Facility-specific API request handler
 * Delegates generic operations to apiHelper
 */

import type { ApiRequestContext } from '@helpers/apiHelper';
import { makeModuleApiRequest } from '@helpers/apiHelper';
import { FACILITY_API_CONFIG } from './facilityApi.config';

// Re-export facility-specific configuration
export { FACILITY_API_CONFIG as API_CONFIG };

// Facility-specific wrapper for API requests
export async function makeFacilityApiRequest(
  requestContext: ApiRequestContext,
  method: string,
  endpoint: string,
  params: Record<string, string>,
  note?: string
): Promise<void> {
  await makeModuleApiRequest(
    requestContext,
    method,
    FACILITY_API_CONFIG.baseUrl,
    endpoint,
    params,
    note
  );
}

// Convenience alias for backwards compatibility
export const makeApiRequest = makeFacilityApiRequest;


**Key Points:**
-  Same structure as allocation
-  Only change: FACILITY_API_CONFIG instead of ALLOCATION_API_CONFIG
-  Rest is boilerplate (copy, change names)

### Step 3: Create Feature File (facility_api_create.feature)

**File:** tests/integrated/features/{FEATURE_FOLDER}/facility_api_create.feature

gherkin
@facility-api @smoke
Feature: Facility Creation via API

    @post
    Scenario Outline: Create facility with <user> user, <testDataFile> and <scenario> parameters
        Given user '<user>' is authenticated
        When the user hits facility-create endpoint with "<testDataFile>" and "<scenario>" parameters
        Then verify the create endpoint returned expected response

        Examples:
            | user          | testDataFile              | scenario              |
            | systemAdmin   | facilityApi_PostParams.json | facility-create-default |
            | areaAdmin_News | facilityApi_PostParams.json | facility-create-news |


**Key Points:**
-  Copy allocation feature, update endpoint name
-  Use <user> parameter = works with ANY user
-  Use <testDataFile> parameter = works with ANY test data
-  Use <scenario> parameter = works with ANY scenario in JSON
-  Examples table = Easy to add more test cases

### Step 4: Create Steps File (facility_api_create.steps.ts)

**File:** tests/integrated/steps/{FEATURE_FOLDER}/facility_api_create.steps.ts

typescript
import { createBdd } from 'playwright-bdd';
import { test, expect } from '@fixtures/fixture';
import { getSharedContext, loadTestParameters } from '@helpers/apiHelper';
import {
  API_CONFIG,
  makeApiRequest
} from './facilityApi.helper';

const { When, Then } = createBdd(test);

//  WHEN STEP: Make API request
When('the user hits facility-create endpoint with {string} and {string} parameters', 
  async ({}, testDataFile: string, scenario: string) => {
    const requestContext = getSharedContext();
    
    // Load test parameters from JSON
    const params = {
      ...loadTestParameters({API_CONFIG.dataPath}/{testDataFile}, scenario),
      action: API_CONFIG.actions.CREATE  //  Use CREATE action
    };
    
    // Make API request
    await makeApiRequest(
      requestContext,
      'POST',
      API_CONFIG.endpoints.create,  //  Use create endpoint
      params,
      CREATE - Create facility (scenario: {scenario})
    );
  }
);

//  THEN STEP: Verify response
Then('verify the create endpoint returned expected response', async ({}) => {
  const requestContext = getSharedContext();
  console.log(\n[VERIFY] Verification: [{requestContext.method}] Status {requestContext.status});
  
  // Assertions
  expect(requestContext.status).toBeGreaterThanOrEqual(200);
  expect(requestContext.status).toBeLessThan(500);
  
  const responseData = requestContext.body ? JSON.parse(requestContext.body) : {};
  expect(responseData).toHaveProperty('success');
  expect(responseData.success).toBe(true);
  
  console.log([RESPONSE] Operation completed with result:, responseData);
  console.log([OK] Endpoint processed successfully.\n);
});


**Key Points:**
-  Copy allocation steps, update step text
-  Change API_CONFIG.endpoints.create for your endpoint
-  Change API_CONFIG.actions.CREATE for your action
-  Same assertion pattern (status + response body)

### Step 5: Create Test Data File (facilityApi_PostParams.json)

**File:** workflows/facility/data/facilityApi_PostParams.json

json
{
  "facility-create-default": {
    "facilityName": "Main_Facility_001",
    "facilityCode": "FAC001",
    "location": "London",
    "capacity": "100",
    "type": "studio",
    "isActive": "1"
  },
  
  "facility-create-news": {
    "facilityName": "News_Facility_BBC",
    "facilityCode": "FAC_NEWS_001",
    "location": "Broadcasting_House",
    "capacity": "50",
    "type": "news_studio",
    "isActive": "1"
  }
}


**Key Points:**
-  Create in workflows/{MODULE}/data/ folder
-  Each key = a scenario (e.g., facility-create-default)
-  Each scenario = object with test parameters
-  Add multiple scenarios for different test cases

### Step 6: Create Authentication Step (Optional - If Different User Groups)

If you need the same authentication as allocations, just import it:

**File:** tests/integrated/steps/{FEATURE_FOLDER}/facility_api_common.steps.ts

typescript
import { createBdd } from 'playwright-bdd';
import { test } from '@fixtures/fixture';
import { getSharedContext } from '@helpers/apiHelper';

const { Given } = createBdd(test);

// Reusable for all facility tests
Given('user {string} is authenticated', async ({ authenticateWithNtlm }, userName: string) => {
  const requestContext = getSharedContext();
  console.log(\n[AUTH] Authenticating as: {userName});
  requestContext.authenticatedPage = await authenticateWithNtlm(userName);
  console.log([OK] NTLM session ready for API requests\n);
});


### Step 7: Run Your Tests

bash
# Run your new facility API tests
npm run apitest:systest

# Output should show:
#  1 facility with systemAdmin user, facilityApi_PostParams.json... @facility-api @smoke @post (1.9s)
# 1 passed (5.8s)


### Quick Reference: File Checklist

When creating a new module, ensure you create:


 Checklist for New Module: {ModuleName}

1. Configuration
   [ ] {module}Api.config.ts
       - Define endpoints
       - Define actions
       - Set dataPath

2. Helper
   [ ] {module}Api.helper.ts
       - Wrapper for makeApiRequest()
       - Re-export API_CONFIG

3. Features
   [ ] {module}_api_{action}.feature
       - Gherkin scenarios
       - Examples table with parameters

4. Steps
   [ ] {module}_api_common.steps.ts
       - Authentication Given step
   [ ] {module}_api_{action}.steps.ts
       - When steps (API calls)
       - Then steps (assertions)

5. Test Data
   [ ] workflows/{module}/data/{module}Api_PostParams.json
       - Test scenarios and parameters

6. Run Tests
   [ ] npm run apitest:systest
   [ ] Verify all tests pass 


### Common Patterns Quick Reference

**For CREATE operation:**
typescript
// Config
CREATE: 'create',
endpoints: { create: '/api/facility/create' }

// Step
API_CONFIG.actions.CREATE
API_CONFIG.endpoints.create

// Feature
When the user hits facility-create endpoint with...
Then verify the create endpoint returned expected response


**For EDIT operation:**
typescript
// Config
EDIT: 'edit',
endpoints: { edit: '/api/facility/edit' }

// Step
API_CONFIG.actions.EDIT
API_CONFIG.endpoints.edit

// Feature
When the user hits facility-edit endpoint with...
Then verify the edit endpoint returned expected response


**For DELETE operation:**
typescript
// Config
DELETE: 'delete',
endpoints: { delete: '/api/facility/delete' }

// Step
API_CONFIG.actions.DELETE
API_CONFIG.endpoints.delete

// Feature
When the user hits facility-delete endpoint with...
Then verify the delete endpoint returned expected response


### Pro Tips for New Developers

 **DO:**
1. **Copy allocation files as templates** - They're well-structured
2. **Keep the same folder structure** - tests/integrated/{steps,features}/NP0XX/
3. **Use parameterized test data** - Use <user>, <testDataFile>, <scenario> placeholders
4. **Maintain separation of concerns** - Config  Helper  Steps
5. **Test locally first** - Run npm run apitest:systest before pushing
6. **Add multiple scenarios** - Different test cases in JSON examples table

 **DON'T:**
1. Don't hardcode URLs or endpoints - Use config file
2. Don't duplicate test data - Use single JSON file with multiple scenarios
3. Don't mix module logic - Keep facility/allocation/team separate
4. Don't skip authentication - Always add common steps file
5. Don't ignore naming patterns - Use {module}Api.{extension} format

---

## Troubleshooting Integration Tests

| Issue | Cause | Solution |
|-------|-------|----------|
| **Missing step definition** | GIVEN/WHEN/THEN not implemented | Create step in steps file, run test again |
| **NTLM auth fails** | Wrong password in .env | Check credentials match actual user |
| **API returns 401** | Session expired | Check authenticateWithNtlm fixture |
| **API returns 404** | Wrong endpoint in config | Verify endpoint in allocationApi.config.ts |
| **Timeout** | Slow API response | Increase timeout in playwright.config.ts |

---

# 7. Test Execution Commands - Complete Reference

## Understanding NPM Scripts & Environments

### Important: Base Scripts vs Environment Variants

Your package.json has **two types of scripts:**

| Type | Example | Environment | Use |
|------|---------|-------------|-----|
| **Base Scripts** | npm run _ui:run | Uses .env.systest (default) | Internal - don't use directly |
| **Environment Variants** | npm run uidevtest | Uses .env.dev (explicit) | Use these! |

**Why?** Base scripts don't set ENVIRONMENT, so they default to 'systest' in playwright.config.ts:
typescript
const environment = loadedEnv || process.env.ENVIRONMENT || 'systest';
                                                               DEFAULT


---

## Local Development

### Run UI Tests (See the browser - best for debugging)

bash
npm run uidevtest


**Configuration:**
-  Environment: DEV (loads .env.dev explicitly)
-  Browser: Chrome (HEADED - you see it)
-  Workers: 1 (tests run one at a time)
-  Speed: Slower (but easy to debug)

**When to use:**
-  Writing new tests
-  Debugging failing tests
-  Testing locally before commit

** Common Mistake:**
bash
#  DON'T use this - it uses .env.systest!
npm run _ui:run

#  DO use this - it uses .env.dev
npm run uidevtest


**Real output:**

Running 5 tests in 1 worker

  tests/ui/features/NP035/schedulinggroup_ui_create.feature:5 (8s)
  tests/ui/features/NP035/schedulinggroup_ui_edit.feature:6 (9s)
 tests/ui/features/NP035/schedulinggroup_ui_delete.feature:7 (12s)
    AssertionError: group not found in table
  tests/ui/features/NP035/schedulinggroup_ui_permission_boundary.feature:7 (7s)
  tests/ui/features/NP035/schedulinggroup_ui_history.feature:8 (6s)

4 passed, 1 failed (42s total)


### Run UI Tests on Staging Environment

bash
npm run uisystesttest


**Configuration:**
-  Environment: SYSTEST (loads .env.systest)
-  Browser: Chrome (HEADED)
-  Workers: 1
-  Runs against staging servers

### Run API Tests Only

bash
npm run apitest


**Configuration:**
-  Environment: DEV
-  No browser needed
-  Makes direct HTTP requests
-  Tests backend API endpoints

### Run API Tests on Staging

bash
npm run apitest:systest


### Run Both UI + API Tests (Full Suite)

bash
npm run test:dev


OR

bash
npm run test:systest


**Configuration:**
-  UI tests with visible browser
-  API tests headless
-  All tests in sequence

## Continuous Integration (GitHub Actions)

bash
npm run test:ci


**Configuration:**
-  Environment: SYSTEST (fixed, no choice)
-  Browser: Chrome (HEADLESS - not visible)
-  Workers: 4 parallel workers
-  Fastest execution
-  Full reporting

**When this runs:**
-  Every time you git push to main/develop
-  Every time you create a Pull Request
-  Automatically, no manual intervention

**Real output in GitHub:**

Test Results Summary
 47 passed
 2 failed
 1 skipped
 Execution time: 2m 34s
 Report: https://github.com/.../actions/runs/xxxxx


### View Test Report in Browser

bash
npm run report


**Opens:** playwright-report/index.html in your default browser

**Shows:**
- / Pass/fail status for each test
-  Execution time
-  Video recordings (failures only)
-  Screenshots
-  Full logs
-  Detailed error messages

## Command Reference Table

| Command | UI | API | Browser | Workers | Environment | Use Case | Notes |
|---------|----|----|---------|---------|-------------|----------|-------|
| _ui:run |  |  | Chrome Headed | 2 | **SYSTEST** |  **Don't use** | Base script - uses default env |
| _api:run |  |  | None | 2 | **SYSTEST** |  **Don't use** | Base script - uses default env |
| uidevtest |  |  | Chrome Headed | 1 | **DEV**  | Local UI debugging | **Recommended for dev** |
| uisystesttest |  |  | Chrome Headed | 1 | **SYSTEST** | Staging validation | For pre-prod testing |
| apitest |  |  | None | 1 | **DEV**  | Local API testing | **Recommended for dev** |
| apitest:systest |  |  | None | 1 | **SYSTEST** | Staging API testing | For pre-prod testing |
| test:dev |  |  | Chrome Headed | 1 | **DEV**  | Full suite locally | UI + API together |
| test:systest |  |  | Chrome Headed | 1 | **SYSTEST** | Full suite staging | UI + API together |
| test |  |  | Chrome Headed | 1 | **SYSTEST** | Default full run | Alias for test:systest |
| test:ci |  |  | Chrome Headless | 4 | **SYSTEST** | CI/CD automation | GitHub Actions |
| report | - | - | HTML Browser | - | - | View test results | Opens playwright-report/ |

---

# 8. Understanding Each Utils Module

## Module 1: scenarioContextManager.ts - Context Isolation

**Purpose:** Each test has isolated storage so parallel tests don't interfere with each other.

**The Problem (Without Context Manager):**

Test 1 runs:
  lastCreatedGroupName = "Team A"
  
Test 2 runs AT SAME TIME:
  lastCreatedGroupName = "Team B"   OVERWRITES Test 1's value!
  
Test 1 tries to verify:
  Searches for lastCreatedGroupName  Gets "Team B" 
  Test 1 FAILS (but it should pass!)


**The Solution (Context Manager):**

Test 1 runs:
  contextStore[1].lastCreatedGroupName = "Team A" 
  
Test 2 runs AT SAME TIME:
  contextStore[2].lastCreatedGroupName = "Team B" 
  (Separate storage!)
  
Test 1 tries to verify:
  Retrieves contextStore[1].lastCreatedGroupName  "Team A" 
  Test 1 PASSES 


**How to Use:**

typescript
import { scenarioContext, initializeScenarioContext } from '@helpers/scenarioContextManager';

// At start of test (usually in Given step)
initializeScenarioContext();  // Creates contextStore[testId] for this test

// Store data during test
scenarioContext.page = browserPage;
scenarioContext.lastCreatedGroupName = "Team A";
scenarioContext.currentUserAlias = "systemAdmin";
scenarioContext.anyCustomData = "anything";

// Retrieve data later (even in different step)
const groupName = scenarioContext.lastCreatedGroupName;  // Gets "Team A"
const user = scenarioContext.currentUserAlias;  // Gets "systemAdmin"


**Under the Hood (Advanced):**

The Proxy pattern automatically routes to the correct test:

typescript
// When you write:
scenarioContext.page = page1;

// Proxy intercepts:
1. Get current test ID: proxy.__testId = 1
2. Find context: contextStore[1]
3. Store value: contextStore[1].page = page1 

// When you read:
const myPage = scenarioContext.page;

// Proxy intercepts:
1. Get current test ID: proxy.__testId = 1
2. Find context: contextStore[1]
3. Return value: contextStore[1].page 


## Module 2: formFiller.ts - Auto-Fill HTML Forms

**Purpose:** Automatically fill any HTML form with test data.

**The Problem (Without Form Filler):**
typescript
// You'd have to write this for EVERY test:
await page.locator('#group_name').fill('Team A');
await page.locator('#division').selectOption('1');
await page.locator('#description').fill('Test description');
await page.locator('#active').check();
await page.locator('#submit').click();
//  50 fields = 250 lines of code per form!


**The Solution (Form Filler):**
typescript
// One line of code:
await fillForm(page, testData);
// Done! All fields filled automatically 


**How to Use:**

typescript
import { fillForm } from '@helpers/formFiller';
import { readJSON } from '@helpers/readJson';

async createGroup(filename: string) {
  // Load test data from JSON file
  const testData = await readJSON(workflows/schedulingGroup/data/{filename}.json);
  
  // Fill ALL form fields automatically
  await fillForm(page, testData);
  // Handles: text, dropdowns, checkboxes, date pickers, buttons, etc.
}


**Test Data JSON Format:**

json
{
  "group_name": {
    "type": "text",
    "value": "Team A",
    "selector": "#group_name"
  },
  "division": {
    "type": "dropdown",
    "value": "1",
    "selector": "#division"
  },
  "active": {
    "type": "checkbox",
    "value": true,
    "selector": "#active"
  },
  "start_date": {
    "type": "date",
    "value": "2025-03-20",
    "selector": "#start_date"
  },
  "submit": {
    "type": "button",
    "selector": "button[type='submit']"
  }
}


**Supported Field Types:**

| Type | Example | How It Works |
|------|---------|------------|
| text | Input field | page.fill(selector, value) |
| textarea | Large text | page.fill(selector, value) |
| dropdown | Select option | page.selectOption(selector, value) |
| multiDropdown | Multi-select | Selects multiple options |
| checkbox | Checkbox | page.check(selector) if true |
| radio | Radio button | Clicks associated label |
| date | Date picker | Opens picker, selects date |
| button | Button | page.click(selector) |

## Module 3: readJson.ts - Load Test Data

**Purpose:** Load test data from JSON files into your tests.

**The Problem (Without JSON Reader):**
typescript
// Hard-coded data scattered everywhere:
const groupName = "Team A";
const division = "1";
const description = "Test description";
//  100 fields = maintenance nightmare!
// Change one value? Search entire codebase!


**The Solution (JSON Reader):**
typescript
// All data in one place (organized by feature):
// workflows/schedulingGroup/data/schdGroupCreate_SystemAdmin_UIdata.json
// Just load it:
const testData = await readJSON('workflows/schedulingGroup/data/schdGroupCreate_SystemAdmin_UIdata.json');


**How to Use:**

typescript
import { readJSON } from '@helpers/readJson';

// Load form data
const formData = await readJSON('workflows/schedulingGroup/data/mydata.json');
console.log(formData.group_name.value);  // "Team A"

// Load users
const users = await readJSON('core/data/users.json');
console.log(users.systemAdmin.username);  // "patans01"

// Load API payload
const apiPayload = await readJSON('workflows/schedulingGroup/data/schdGroupCreate_ApiRequestPayload.json');


**Benefits:**
-  All test data in one place (easy to find)
-  Easy to modify test data (just edit JSON)
-  Non-technical people can update test data
-  Reuse same data across multiple tests
-  Organized by feature (scaling)

## Module 4: pageFactory.ts - Get Page Objects

**Purpose:** Centrally manage all page objects by name.

**The Problem (Without Factory):**
typescript
// Scattered imports and instantiation:
import { ScheduledGroupPage } from '@pages/NP035/ScheduledGroupPage';
import { SchedulingTeamPage } from '@pages/NP035/SchedulingTeamPage';
import { FacilityPage } from '@pages/NP035/FacilityPage';

// In every step file:
const scheduledGroupPage = new ScheduledGroupPage(page);
const schedulingTeamPage = new SchedulingTeamPage(page);
const facilityPage = new FacilityPage(page);
//  50 step files = A LOT of repeated imports!


**The Solution (Page Factory):**
typescript
// One function to get any page:
const pageObject = getPageObject('Scheduled Group', page);
// Returns: new ScheduledGroupPage(page)

// Want a different page?
const pageObject = getPageObject('Scheduling Team', page);
// Returns: new SchedulingTeamPage(page)


**How to Use:**

typescript
import { getPageObject } from '@helpers/pageFactory';

// Get page object by name
const pageObject = getPageObject('Scheduled Group', page);

// Use it immediately
await pageObject.open();
await pageObject.createScheduledGroup('testdata.json');
await pageObject.verifyGroupVisible();


**How to Add New Pages:**

typescript
// Step 1: Create page class
// File: tests/ui/page/NP035/MyNewPage.ts
export class MyNewPage {
  constructor(private page: Page) {}
  async open() { await this.page.goto('/my-page'); }
}

// Step 2: Register in pageFactory
// File: tests/utils/pageFactory.ts
import { MyNewPage } from '@pages/NP035/MyNewPage';

const pageFactory = {
  "Scheduled Group": (page: Page) => new ScheduledGroupPage(page),
  "My New Page": (page: Page) => new MyNewPage(page),  //  Add here
};

// Step 3: Use in feature
// Feature file:
Given user is on the "My New Page" page


## Module 5: formFilledType.ts - Type Definitions

**Purpose:** TypeScript types for form fields (helps catch errors early).

**Why It Matters:**
typescript
// Without types: typo goes unnoticed
const field = {
  tpye: "text",  //  Typo! But no error!
  value: "test"
};

// With types: TypeScript CATCHES the error
const field: FormField = {
  tpye: "text",  //  ERROR! Must be "type"
  value: "test"
};


**How It Works:**

typescript
// File: tests/utils/formFilledType.ts
export type FieldType = 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'radio' | 'date' | 'button';

export interface FormField {
  type: FieldType;  // Must be one of the types above
  value?: string | boolean | string[];  // Value to fill
  selector?: string;  // CSS selector to find element
  subValues?: string[];  // For multi-select
}

// In your test data JSON:
const field: FormField = {
  type: "text",  //  TypeScript checks this is valid
  value: "Test",
  selector: "#group_name"
};


---

# 9. Writing Your First Test - Step by Step

## Complete Example: Creating a Scheduling Group Test

### Step 1: Write the Feature File (What to test - Plain English)

Create file: tests/ui/features/NP035/my_first_test.feature

gherkin
@myFirstTest @ui
Feature: My First Automation Test

  Scenario: SystemAdmin creates a scheduling group
    Given user 'systemAdmin' is on the "Scheduled Group" page
    When the user creates a new scheduling group using "schdGroupCreate_SystemAdmin_UIdata"
    Then the scheduling group is visible to 'systemAdmin'


**Explanation of Gherkin syntax:**
- @myFirstTest = Tag to identify test (can run specific tests by tag)
- @ui = Tag saying this is UI test
- Given = Setup (what should be true before test)
- When = Action (what your test does)
- Then = Verification (what should be true after)
- {string} = Parameter (gets passed to step definition)

### Step 2: Create Step Definitions (How to test - TypeScript code)

Create file: tests/ui/steps/NP035/my_first_test.steps.ts

typescript
import { createBdd } from "playwright-bdd";
import { test } from "@fixtures/pages.fixture";
import { getPageObject } from '@helpers/pageFactory';
import { scenarioContext, initializeScenarioContext } from '@helpers/scenarioContextManager';
import users from '@core/data/users.json' with { type: 'json' };
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd(test);

// Step 1: Given - Setup
Given('user {string} is on the {string} page',
  async ({ loginAs }, userAlias: string, pageName: string) => {
    // Initialize context (important for parallel tests!)
    initializeScenarioContext();
    
    // Login user using fixture
    const page = await loginAs(userAlias as keyof typeof users);
    
    // Get page object using factory
    const pageObject = getPageObject(pageName, page);
    
    // Navigate to page
    await pageObject.open();
    
    // Store in context for use in later steps
    scenarioContext.page = page;
    scenarioContext.scheduledGroupPage = pageObject;
    scenarioContext.currentUserAlias = userAlias;
    
    console.log( User '{userAlias}' is on '{pageName}' page);
  }
);

// Step 2: When - Action
When('the user creates a new scheduling group using {string}',
  async ({ }, filename: string) => {
    // Get page object from context (stored in Given step)
    const pageObject = scenarioContext.scheduledGroupPage;
    if (!pageObject) {
      throw new Error('ScheduledGroupPage not initialized');
    }
    
    // Call page object method to create group
    await pageObject.createScheduledGroup(filename);
    
    // Store group name for verification step
    const groupName = pageObject.lastCreatedGroupName;
    scenarioContext.lastCreatedGroupName = groupName;
    
    console.log( Created group: "{groupName}");
  }
);

// Step 3: Then - Verify
Then('the scheduling group is visible to {string}',
  async ({ }, userName: string) => {
    // Get data from context
    const pageObject = scenarioContext.scheduledGroupPage;
    const groupName = scenarioContext.lastCreatedGroupName;
    
    // Verify group exists in table
    const groupRow = scenarioContext.page
      .locator('table#scheduling-list-table tbody tr')
      .filter({
        has: scenarioContext.page.locator(td:has-text("{groupName}"))
      });
    
    // Assert exactly 1 row found
    await expect(groupRow).toHaveCount(1);
    
    console.log( Verified: Group "{groupName}" is visible to '{userName}');
  }
);


### Step 3: Create or Use Existing Page Object

File: tests/ui/page/NP035/ScheduledGroupPage.ts (already exists, so we reuse it)

typescript
export class ScheduledGroupPage {
  private formData?: Record<string, FormField>;
  static lastCreatedGroupName: string | undefined;

  constructor(private page: Page) {}

  async open() {
    await this.page.goto('/mvc-app/admin/scheduling-group');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('table#scheduling-list-table');
  }

  async createScheduledGroup(filename: string = 'schdGroupData') {
    // Click "Add Scheduling Group" button
    await this.page.getByRole('button', { name: 'Add Scheduling Group' }).click();
    
    // Wait for modal
    await this.page.locator('#facebox').waitFor({ state: 'visible' });
    
    // Load test data
    const jsonPath = workflows/schedulingGroup/data/{filename}.json;
    const jsonData = await readJSON(jsonPath);
    
    // Generate unique name
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    jsonData['group_name'].value = Test_SchdGrp_{timestamp}_{randomNum};
    
    // Store for later retrieval
    ScheduledGroupPage.lastCreatedGroupName = jsonData['group_name'].value;
    
    // Fill form
    await this.fill(jsonData);
  }

  private async fill(formData: Record<string, FormField>) {
    this.formData = formData;
    await fillForm(this.page, formData);
  }
}


### Step 4: Create Test Data JSON

File: workflows/schedulingGroup/data/schdGroupCreate_SystemAdmin_UIdata.json

json
{
  "group_name": {
    "type": "text",
    "value": "Default Name",
    "selector": "#group_name"
  },
  "division_id": {
    "type": "dropdown",
    "value": "1",
    "selector": "#division_id"
  },
  "notes": {
    "type": "textarea",
    "value": "Test scheduling group",
    "selector": "#notes"
  },
  "active": {
    "type": "checkbox",
    "value": true,
    "selector": "#active"
  },
  "submit": {
    "type": "button",
    "selector": "button[type='submit']"
  }
}


### Step 5: Run Your Test

bash
# Run your specific test
npm run uidevtest -- --grep "My First Automation Test"

# Or run all tests
npm run uidevtest


### Step 6: View Results

If passing:

 PASSED: user 'systemAdmin' is on the "Scheduled Group" page (2.1s)
 PASSED: the user creates a new scheduling group using "schdGroupCreate_SystemAdmin_UIdata" (4.3s)
 PASSED: the scheduling group is visible to 'systemAdmin' (1.8s)

Total: 8.2 seconds - PASSED 


If failing:

 FAILED: the scheduling group is visible to 'systemAdmin' (0.5s)
   Expected: 1
   Received: 0
   
   The group was not found in the table. Possible reasons:
   - Form submission failed silently
   - Table didn't refresh after form submit
   - Group name doesn't match exactly


**To debug:**
1. Add await page.pause(); in step definition to inspect
2. Check browser devtools (F12)
3. Look at screenshot in test report
4. Check server logs for errors

---

# 10. Page Objects Explained

## What is a Page Object?

A Page Object is a **class that represents a single page/screen** in your application. It encapsulates:
-  All selectors for that page
-  All interactions with that page
-  Helper methods for common actions

**Benefits:**
- Update one selector = all tests using it still work
- Reuce code duplication
- Makes tests more readable
- Easier to maintain

### Page Object Example

typescript
// File: tests/ui/page/NP035/ScheduledGroupPage.ts

import { expect, Page } from '@playwright/test';
import { FormField } from '@helpers/formFilledType';
import { fillForm } from '@helpers/formFiller';
import { readJSON } from '@helpers/readJson';

export class ScheduledGroupPage {
  // Static property to store created group name
  static lastCreatedGroupName: string | undefined;

  // Constructor receives Playwright page object
  constructor(private page: Page) {}

  // Navigate to the page
  async open() {
    await this.page.goto('/mvc-app/admin/scheduling-group');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('table#scheduling-list-table');
  }

  // High-level action: Create a scheduling group
  async createScheduledGroup(filename: string = 'schdGroupData') {
    // Click Add button
    await this.page.getByRole('button', { name: 'Add Scheduling Group' }).click();

    // Wait for modal
    await this.page.locator('#facebox').waitFor({ state: 'visible' });

    // Load test data
    const jsonPath = workflows/schedulingGroup/data/{filename}.json;
    const jsonData = await readJSON(jsonPath);

    // Generate unique name
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    jsonData['group_name'].value = Test_SchdGrp_{timestamp}_{randomNum};
    
    // Store for later verification
    ScheduledGroupPage.lastCreatedGroupName = jsonData['group_name'].value;

    // Fill form
    await this.fill(jsonData);
  }

  // High-level action: Edit a scheduling group
  async editScheduledGroup(newName: string) {
    // Click first Edit button
    await this.page.locator('.fas.fa-edit').first().click();

    // Wait for modal
    await this.page.locator('#facebox').waitFor({ state: 'visible' });

    // Update name
    const nameInput = this.page.locator('#group_name');
    await nameInput.clear();
    await nameInput.fill(newName);

    // Save
    await this.page.getByRole('button', { name: /Save|Update/ }).click();

    // Wait for modal to close
    await this.page.locator('#facebox').waitFor({ state: 'hidden' });
  }

  // High-level action: Delete a scheduling group
  async deleteScheduledGroup() {
    // Click Delete button
    await this.page.locator('.fas.fa-trash-alt').first().click();

    // Confirm deletion
    await this.page.getByRole('button', { name: 'Confirm' }).click();

    // Wait for delete to complete
    await this.page.waitForTimeout(1000);
  }

  // Verification: Check if group is visible
  async verifyScheduledGroupVisibleForUser() {
    const groupName = ScheduledGroupPage.lastCreatedGroupName;
    if (!groupName) throw new Error('No group name to verify');

    const groupRow = this.page.locator('table#scheduling-list-table tbody tr').filter({
      has: this.page.locator(td.scheduling-group-name:has-text("{groupName}"))
    });

    await expect(groupRow).toHaveCount(1);
  }

  // Verification: Check if group is NOT visible
  async verifyScheduledGroupNotVisibleForUser() {
    const groupName = ScheduledGroupPage.lastCreatedGroupName;
    if (!groupName) throw new Error('No group name to verify');

    const groupRow = this.page.locator('table#scheduling-list-table tbody tr').filter({
      has: this.page.locator(td.scheduling-group-name:has-text("{groupName}"))
    });

    await expect(groupRow).toHaveCount(0);
  }

  // Private helper method
  private async fill(formData: Record<string, FormField>) {
    await fillForm(this.page, formData);
  }
}


### Using the Page Object in Tests

typescript
// In your step definition:

Given('user is on Scheduled Group page', async ({ loginAs }) => {
  const page = await loginAs('systemAdmin');
  const pageObject = new ScheduledGroupPage(page);
  
  await pageObject.open();  // Use page object!
  
  scenarioContext.page = page;
  scenarioContext.scheduledGroupPage = pageObject;
});

When('user creates a group', async ({}) => {
  const pageObject = scenarioContext.scheduledGroupPage;
  
  await pageObject.createScheduledGroup('testdata.json');  // Use method!
});

Then('group is visible', async ({}) => {
  const pageObject = scenarioContext.scheduledGroupPage;
  
  await pageObject.verifyScheduledGroupVisibleForUser();  // Use method!
});


## Page Object Best Practices

 **DO:**
- Create one Page Object per page
- Keep selectors in Page Object (not in steps)
- Use descriptive method names
- Add helper methods for common actions

 **DON'T:**
- Put assertions in Page Object (only verify, don't assert)
- Mix multiple pages in one Page Object
- Use generic names like clickButton() (use createGroup() instead)
- Hardcode selectors everywhere

---

# 11. Test Data & Form Filling

## Test Data File Organization


workflows/
 schedulingGroup/
    data/
        schdGroupCreate_AreaAdminNews_UIdata.json      (UI data for AreaAdmin)
        schdGroupCreate_SystemAdmin_UIdata.json        (UI data for SystemAdmin)
        schdGroupCreate_ApiRequestPayload.json         (API data)
 facility/
    data/
        facilityCreate_AreaAdminNewsUIdata.json
 schedulingTeam/
     data/
         schdTeamCreate_UIdata.json


**Why organize by feature?**
- Easy to find test data
- All Scheduling Group data in one place
- Easy to update when feature changes

## Form Data JSON Format

json
{
  "fieldId": {
    "type": "field_type",
    "value": "field_value",
    "selector": "#css_selector",
    "subValues": ["optional", "for", "multi-select"]
  }
}


### Field Type Examples

#### Text Input
json
{
  "group_name": {
    "type": "text",
    "value": "My Scheduling Group",
    "selector": "#group_name"
  }
}


#### Dropdown/Select
json
{
  "division": {
    "type": "dropdown",
    "value": "1",
    "selector": "#division_id"
  }
}


#### Multi-Select Dropdown
json
{
  "facilities": {
    "type": "multiDropdown",
    "value": "1",
    "selector": "#facilities",
    "subValues": ["1", "2", "3"]
  }
}


#### Checkbox
json
{
  "active": {
    "type": "checkbox",
    "value": true,
    "selector": "#active"
  }
}


#### Date Picker
json
{
  "start_date": {
    "type": "date",
    "value": "2025-03-20",
    "selector": "#start_date"
  }
}


#### TextArea
json
{
  "notes": {
    "type": "textarea",
    "value": "This is a\nmulti-line\ntext",
    "selector": "#notes"
  }
}


#### Button
json
{
  "submit": {
    "type": "button",
    "selector": "button[type='submit']"
  }
}


## How Form Filler Works

typescript
import { fillForm } from '@helpers/formFiller';
import { readJSON } from '@helpers/readJson';

async createGroup(filename: string) {
  // Load data
  const testData = await readJSON(workflows/schedulingGroup/data/{filename}.json);
  
  // Fill form - it handles all details!
  await fillForm(page, testData);
  
  // Done!
}


**Behind the scenes, fillForm does:**

typescript
for (const [fieldId, field] of Object.entries(testData)) {
  switch (field.type) {
    case 'text':
    case 'textarea':
      // Find element and type value
      await page.locator(field.selector).fill(field.value);
      break;
      
    case 'dropdown':
      // Select option by value
      await page.locator(field.selector).selectOption(field.value);
      break;
      
    case 'checkbox':
      // Check/uncheck based on value
      if (field.value) {
        await page.locator(field.selector).check();
      } else {
        await page.locator(field.selector).uncheck();
      }
      break;
      
    case 'date':
      // Open date picker and select
      await pickDate(page, field.selector, field.value);
      break;
      
    case 'button':
      // Click button
      await page.locator(field.selector).click();
      break;
  }
}


---

# 12. Parallel Execution & Context Isolation

## Why Parallel Execution Matters

**Sequential Execution (Current):**
- 100 tests  10 seconds each = 1000 seconds = 16+ minutes

**Parallel Execution (Goal):**
- 100 tests / 4 workers = 25 batches  10 seconds = 250 seconds = 4+ minutes

**Savings: 12 minutes per run!**

## How Context Isolation Works

Without isolation:
typescript
Test 1:
  groupName = "Team A"

Test 2 (runs at same time):
  groupName = "Team B"  //  OVERWRITES!

Test 1 later:
  Uses groupName  //  Gets "Team B" instead of "Team A" 
  Test FAILS!


With context isolation (our solution):
typescript
Test 1:
  contextStore[1].groupName = "Team A"  //  Separate storage

Test 2 (runs at same time):
  contextStore[2].groupName = "Team B"  //  Different storage

Test 1 later:
  Uses contextStore[1].groupName  //  Gets correct value "Team A" 
  Test PASSES!


## Implementing in Your Tests

typescript
import { scenarioContext, initializeScenarioContext } from '@helpers/scenarioContextManager';

Given('setup step', async () => {
  // Always initialize context at start of test
  initializeScenarioContext();  //  Creates isolated storage
  
  const page = await loginAs('systemAdmin');
  
  // Store in context (not in global/shared variable)
  scenarioContext.page = page;
  scenarioContext.myData = "something";
});

When('action step', async () => {
  // Retrieve from context
  const myData = scenarioContext.myData;  //  Gets correct value
  
  // Store more data
  scenarioContext.createdId = "123";
});

Then('verify step', async () => {
  // Retrieve all data
  const myData = scenarioContext.myData;
  const createdId = scenarioContext.createdId;
  
  // Use data for verification
});


## Running Tests in Parallel (for CI/CD)

By default, local tests run sequentially (1 worker).

For CI/CD, tests run parallel with multiple workers:

bash
# Local (sequential - 1 worker)
npm run uidevtest
# Each test waits for previous to complete
# Good for debugging

# CI (parallel - 4 workers)
npm run test:ci
# Multiple tests run at same time
# Good for speed


**Result:** Tests run 4x faster without interfering with each other!

---

# 13. Fixtures & Reusable Setup

## What is a Fixture?

A **Fixture** is reusable setup code that initializes test dependencies.

Instead of repeating setup in every test, fixtures handle it once:

typescript
// Without fixture: Repeat in every test
it('should create group', async () => {
  const page = await browser.newPage();
  await page.goto(url);
  // Login
  await page.locator('[name=username]').fill('admin');
  await page.locator('[name=password]').fill('pass');
  await page.locator('button[type=submit]').click();
  
  // NOW you can test
  //  100 tests = 100  login code!
});

// With fixture: Setup once, use everywhere
it('should create group', async({ page, loginAs }) => {
  await loginAs('systemAdmin');  //  Fixture handles everything!
  
  // Start testing immediately
});


## Available Fixtures

### 1. page - Playwright Page Object

typescript
Given('step', async ({ page }) => {
  // page is already initialized Playwright Page
  await page.goto('/someurl');
  await page.locator('#button').click();
});


### 2. loginAs - Login Fixture

typescript
Given('user is logged in', async ({ loginAs }) => {
  // Login as specific user
  const page = await loginAs('systemAdmin');
  // Now logged in and on homepage
  
  const page2 = await loginAs('areaAdmin_News');
  // Different browser session, different user
});


**How it works:**
1. Loads user from core/data/users.json
2. Gets password from environment (.env.dev)
3. Constructs login URL with embedded credentials
4. Navigates and verifies login successful

### 3. db - Database Connection

typescript
Given('group exists in database', async ({ db }) => {
  // Execute SQL query
  const result = await db.query('SELECT * FROM scheduling_groups WHERE name = ?', ['Team A']);
  console.log(result);
  
  // Execute stored procedure
  const spResult = await db.executeSp('SP_CREATE_GROUP', { name: 'Team A' });
});


## Creating Your Own Fixture

File: tests/fixtures/pages.fixture.ts

typescript
import { test as base } from '@playwright/test';
import { Page } from '@playwright/test';
import loginUser from '@helpers/loginManager';

// Define fixture interface
interface TestFixtures {
  loginAs: (userAlias: string) => Promise<Page>;
  customSetup: () => Promise<void>;
}

// Create fixture
export const test = base.extend<TestFixtures>({
  // loginAs fixture
  loginAs: async ({ page }, use) => {
    // Provide function that can be called multiple times
    await use(async (userAlias: string) => {
      const page = await loginUser(userAlias);
      return page;
    });
  },
  
  // Custom fixture
  customSetup: async ({ page }, use) => {
    // Setup before test
    console.log('Setting up...');
    
    // Provide object/function to test
    await use({});
    
    // Cleanup after test
    console.log('Cleaning up...');
  },
});


## Using Fixtures in Tests

typescript
import { test } from '@fixtures/pages.fixture';
import { expect } from '@playwright/test';

test('example', async ({ page, loginAs, customSetup }) => {
  // All fixtures are available!
  
  const adminPage = await loginAs('systemAdmin');
  await adminPage.goto('/dashboard');
  
  await expect(adminPage.locator('h1')).toContainText('Dashboard');
});


---

# 14. Common Workflows & Patterns

## Pattern 1: Create-Verify-Delete (CRUD Test)

typescript
Scenario: Complete CRUD lifecycle
  Given user 'systemAdmin' is on the "Scheduled Group" page
  
  When the user creates a new scheduling group using "testdata.json"
  Then the scheduling group is visible
  
  When the user edits the scheduling group name to "Updated Name"
  Then the updated name is visible
  
  When the user deletes the scheduling group
  Then the scheduling group is no longer visible


## Pattern 2: Permission Boundary Testing

typescript
Scenario: SystemAdmin can see all, AreaAdmin only their area
  Given user 'systemAdmin' creates a group in "News" area
  And the group is visible to 'systemAdmin'
  
  When user 'areaAdmin_Facilities' navigates to groups
  Then the "News" area group is NOT visible to 'areaAdmin_Facilities'
  
  When user 'areaAdmin_News' navigates to groups
  Then the "News" area group IS visible to 'areaAdmin_News'


## Pattern 3: Data Validation (UI + Database)

typescript
Scenario: Data saved correctly in database
  Given database is seeded with initial data
  
  When user creates a group via UI
  And the group appears in UI table
  
  Then database contains the group with correct values
  And audit trail records the creation
  And timestamp is recent


## Pattern 4: API + UI Integration

typescript
Scenario: API creates data, UI displays it
  Given API endpoint is available
  
  When I POST to /api/groups with payload
  And the response is 201 Created
  
  Then user navigates to groups page
  And the created group appears in list
  And all details match API response


---

# 15. Troubleshooting Guide

## Problem: Test Fails Randomly

**Cause:** Race condition - waiting for element that might not be loaded

**Solution:**
typescript
//  Bad: Element not loaded yet
await page.locator('table tr').count()  // Fast but unreliable

//  Good: Wait for element first
await page.locator('table').waitFor({ state: 'visible' });
await page.waitForLoadState('networkidle');
const count = await page.locator('table tr').count();


## Problem: Element Selector Broke (Test fails after UI change)

**UI changed from:**
html
<button id="submit">Submit</button>


**To:**
html
<button class="primary-btn">Submit</button>


**Solution: Update Page Object**
typescript
// Before:
await page.locator('#submit').click();

// After:
await page.locator('button:has-text("Submit")').click();
// OR use role (more reliable):
await page.getByRole('button', { name: 'Submit' }).click();


## Problem: Tests Interfere (When running parallel)

**Cause:** Shared state between tests

**Solution:**
typescript
//  Bad: Global variable
let User = null;
Given('login', async () => {
  User = 'admin';  // Shared between tests!
});

//  Good: Context storage
Given('login', async () => {
  initializeScenarioContext();
  scenarioContext.currentUser = 'admin';  // Isolated per test
});


## Problem: Timeout - Test takes too long

**Investigation:**
bash
# Run with verbose output
npm run uidevtest -- --reporter=verbose

# See which step is slow


**Solution Options:**
1. Reduce timeout for faster failure
2. Speed up test setup (reuse credentials)
3. Parallel workers (CI/CD)
4. Optimize selectors (faster DOM queries)

## Problem: Tests Run Against Wrong Environment

**Symptoms:**
- You run a test but it connects to STAGING database (not dev)
- Tests fail with unfamiliar database names
- Different password doesn't work

**Root Cause:**
You used npm run _ui:run or npm run _api:run (base scripts) instead of environment-specific commands.

**Solution:**
bash
#  WRONG - uses .env.systest by default
npm run _ui:run

#  CORRECT - explicitly uses .env.dev
npm run uidevtest

#  ALSO CORRECT - for API tests
npm run apitest


**How to verify which environment loaded:**
1. Look at console output when test starts - it prints the environment
2. Check the database host connecting - is it dev or staging?
3. Check the URL - is it allocate-dev-wp or allocate-systest-wp?

## Problem: Credentials Wrong

**Error:**

401 Unauthorized
or
Login failed


**Solution:**
1. Check .env.dev or .env.systest exists
2. Verify credentials are correct
3. Check user exists in core/data/users.json
4. Verify environment variable is loaded:
   typescript
   console.log(process.env.SYS_ADMIN_PASSWORD);  // Should print password
   

## Problem: Database Connection Failed

**Error:**

ECONNREFUSED: Connection refused 127.0.0.1:1433


**Solution:**
1. Check database is running
2. Verify host/port in .env file
3. Test connection manually:
   bash
   sqlcmd -S yourserver -U youruser -P yourpassword
   

## Problem: Screenshot/Video Not Showing

**Check:**
1. Test actually failed (not passed)
2. Report generated:
   bash
   npm run report  # Opens playwright-report/index.html
   
3. Look in test-results/ folder
4. Check playwright.config.ts for screenshot settings

---

# 16. Best Practices

## Testing Best Practices

 **DO:**
- One assertion per scenario (keep tests focused)
- Use meaningful test names (describes what is tested, not HOW)
- Keep tests independent (no test depends on another running first)
- Use test data (don't hardcode values)
- Add logging/comments (help future developers)
- Use page objects (centralize UI selectors)
- Clean up after tests (delete created data)

 **DON'T:**
- Put multiple scenarios in one test
- Use hardcoded wait times (use waits instead)
- Make tests depend on each other
- Ignore flaky tests (fix them!)
- Use generic variable names (data vs. groupName)
- Test implementation details (test behavior)

## Code Organization

typescript
//  Good structure
When('user creates a group using {string}',
  async ({ }, filename: string) => {
    // 1. Setup
    const pageObject = scenarioContext.scheduledGroupPage;
    
    // 2. Action
    await pageObject.createScheduledGroup(filename);
    
    // 3. Store result
    scenarioContext.lastCreatedGroupName = pageObject.lastCreatedGroupName;
    
    // 4. Log
    console.log( Created group: "{scenarioContext.lastCreatedGroupName}");
  }
);


## Error Messages

typescript
//  Bad error message
if (!page) {
  throw new Error('Page not available');  // Too vague
}

//  Good error message
if (!page) {
  throw new Error('Page object not initialized. Did you call "user is on..." step first?');
}


## Documentation

typescript
/**
 * Creates a new scheduling group and stores the name for later verification
 * 
 * @param filename - Test data file name (without .json extension)
 * @example
 * When('user creates group using {string}', async ({}, 'testdata.json') => {
 *   await pageObject.createScheduledGroup('testdata');  // Note: no .json
 * });
 */
async createScheduledGroup(filename: string) {
  // Implementation
}


---

# 17. FAQ

## General Questions

### Q: Which command should I use to run tests locally?
**A:** 
- **For DEV environment:** npm run uidevtest (loads .env.dev)
- **For STAGING environment:** npm run uisystesttest (loads .env.systest)
- **Don't use:** npm run _ui:run - it defaults to SYSTEST!

**Pro tip:** Always use environment-specific commands:
bash
npm run uidevtest       #  Local dev - uses .env.dev
npm run apitest         #  Local API - uses .env.dev
npm run test:dev        #  Full suite - uses .env.dev

npm run _ui:run         #  Defaults to .env.systest (confusing!)


### Q: How long does a test take?
**A:** Typically 8-15 seconds per test. Simple tests (UI clicks only) = faster. Complex tests (form filling, waiting) = slower.

### Q: Can I run just one test locally?
**A:** Yes!
bash
npm run uidevtest -- --grep "test name"


### Q: How do I skip a test temporarily?
**A:** Add @skip tag to feature file:
gherkin
@skip
Scenario: This test is skipped


OR in code:
typescript
test.skip('should do something', async () => {
  // This test is skipped
});


### Q: How do I debug a failing test?
**A:** 
typescript
// Add pause to inspect
Given('step', async () => {
  // ... test code ...
  
  await page.pause();  //  Test stops here, inspect browser
  
  // ... more code ...
});


Then run:
bash
npm run uidevtest -- --debug


### Q: Can I run tests on different browsers?
**A:** Yes, modify playwright.config.ts:
typescript
use: {
  channel: 'chrome',  // chrome, firefox, webkit
}


## Framework Questions

###Q: What if the test data JSON is wrong?
**A:** formFiller will throw error:

Error: Cannot find element with selector #unknown_selector


Fix: Update JSON or check selector exists in HTML.

### Q: How do I add a new page to the framework?
**A:** 
1. Create page object: tests/ui/page/NP035/MyPage.ts
2. Register in pageFactory: tests/utils/pageFactory.ts
3. Use in feature: Given user is on the "My Page" page

### Q: How do I update test data?
**A:** Edit the JSON file:
json
// workflows/schedulingGroup/data/mydata.json
{
  "group_name": {
    "value": "New Value"  Just change this
  }
}


All tests using this file get updated data!

## Execution Questions

### Q: Why are my parallel tests failing when they pass sequentially?
**A:** Shared state between tests. Use context manager:
typescript
// Initialize context (important!)
initializeScenarioContext();

// Store in context (not global)
scenarioContext.data = value;


### Q: How do I see which tests are running in CI?
**A:** Check GitHub Actions:
1. Push to repository
2. Go to GitHub repo  Actions tab
3. Click on workflow run
4. See test output in real-time

### Q: Can I rerun only failed tests?
**A:** Not automatically, but you can manually:
bash
npm run uidevtest -- --grep "test name"


Or filter by tag:
bash
npm run uidevtest -- --grep "@myTag"


## Maintenance Questions

### Q: How often should I update selectors?
**A:** When UI changes.  Use getByRole() when possible (more stable than ID/class selectors that change).

### Q: How long should test data be retained?
**A:** Indefinitely. Keep all data versions for reproducibility.

### Q: What happens if I delete a test?
**A:** Just delete the feature file. CI will show fewer tests passing (which is fine).

---

## Additional Resources

### Official Documentation
- [Playwright Docs](https://playwright.dev)
- [Cucumber/BDD Guide](https://cucumber.io)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Useful Links
- VSCode Extensions:
  - Gherkin Official (for .feature files)
  - Playwright Test for VSCode (running tests)
- GitHub Actions: .github/workflows/ci.yml

### Getting Help
1. Check this README first (definitely has your answer)
2. Search existing test code for similar patterns
3. Check test report for error messages
4. Add console.log() for debugging

---

**Last Updated:** March 20, 2026
**Framework Version:** 1.0.0
**Maintained By:** Automation Team



