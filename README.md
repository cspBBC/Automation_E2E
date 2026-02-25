# POC BBC - Automated Testing Framework

## 📋 Overview

**POC BBC** is a test automation framework built with **Playwright BDD (Behavior-Driven Development)**. It provides comprehensive testing across UI, API, and Database layers.

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
├── README.md                               # Documentation
├── package.json                            # NPM dependencies & scripts
├── playwright.config.ts                    # Playwright & BDD configuration
├── tsconfig.json                           # TypeScript configuration
│
├── core/                                   # Core infrastructure
│   ├── api/
│   │   └── apiClient.ts                   # HTTP client wrapper
│   ├── data/
│   │   └── users.json                     # Test user definitions
│   └── db/
│       ├── connection.ts                  # MSSQL connection pool
│       ├── dbseed.ts                      # User verification utilities
│       └── queries.ts                     # Database query helpers
│
├── tests/
│   ├── api_db/                            # API & Database tests
│   │   ├── db/                            # Pure database tests
│   │   │   ├── mock-schd-group-create.db.spec.ts
│   │   │   └── smoke-connection.db.spec.ts
│   │   ├── features/
│   │   │   └── NP035/
│   │   │       ├── NP035.01_view.feature
│   │   │       └── NP035.02_create.feature
│   │   └── steps/
│   │       └── NP035/
│   │           ├── schd_grp_view.steps.ts
│   │           └── schd_grp_create_steps.ts
│   │
│   ├── ui/                                # UI (Browser) tests
│   │   ├── features/
│   │   │   └── NP001/
│   │   │       └── facility_booking.feature
│   │   ├── page/
│   │   │   └── NP001/
│   │   │       └── FacilityPage.ts
│   │   └── steps/
│   │       └── NP001/
│   │           └── facility_booking.steps.ts
│   │
│   ├── fixtures/                          # Shared test fixtures
│   │   ├── test.fixture.ts               # API/DB fixtures
│   │   ├── pages.fixture.ts              # UI fixtures
│   │   ├── db.fixture.ts
│   │   └── correlation.fixture.ts
│   │
│   ├── types/
│   │   └── formField.ts
│   │
│   └── utils/
│       ├── formFiller.ts
│       └── readJson.ts
│
├── workflows/                              # Reusable business logic
│   ├── facilities/
│   │   ├── api/
│   │   ├── data/
│   │   └── db/
│   │
│   └── schd-group/
│       ├── api/
│       │   ├── view.api.ts
│       │   ├── create.api.ts
│       │   ├── update.api.ts
│       │   └── delete.api.ts
│       ├── data/
│       │   └── payloads.json
│       ├── db/
│       │   ├── queries/
│       │   │   └── schedulingGroup.queries.ts
│       │   └── seed/
│       │       └── db.seed.ts
│       └── invariants/
│           ├── api.invariants.ts
│           └── db.invariants.ts
│
├── playwright-report/                     # Test reports (auto-generated)
│
└── test-results/                          # Test artifacts
```

---

## 🧪 Test Types

### **UI Tests** (`tests/ui/features/*.feature`)

Browser automation tests using Playwright with HTTP Basic Auth.

**Default Execution:** `npm run uitest`

**Example File:** `tests/ui/features/NP001/facility_booking.feature`

```gherkin
@facility @smoke @ui
Feature: Facility CRUD

  Scenario: Area Admin creates and manages a facility
    Given user 'areaAdmin_News' is on facility catalogue page
    When user creates a new facility using test data from "facilityFormData"
    Then the facility should be created successfully
    And delete the created facility to clean up
```

### **API/Integration Tests** (`tests/api_db/features/*.feature`)

End-to-end tests with API calls and database verification.

**Status:** Ready for execution (blocked on PHP endpoints)

### **Database Tests** (`tests/api_db/db/*.db.spec.ts`)

Direct database query validation without browser/API.

**Default Execution:** `npm run dbtest`

---

## 🔐 Authentication - HTTP Basic Auth

### **How It Works**

1. **loginAs fixture** loads credentials from `core/data/users.json` and `.env`
2. **Embeds credentials in URL** before navigation: `https://username:password@host/path`
3. **Browser authenticates once** on first navigation
4. **Session maintained** for all subsequent requests

### **Implementation Details**

**File:** `tests/fixtures/pages.fixture.ts`

```typescript
loginAs: async ({ page }, use) => {
  await use(async (userAlias: string) => {
    const users = loadUsers();
    const user = users[userAlias];
    const password = getPassword(user.envKey);
    
    // Authenticate to base URL with embedded credentials
    const baseURL = process.env.UI_BASE_URL;
    const url = new URL(baseURL);
    const urlWithAuth = `${url.protocol}//${user.username}:${password}@${url.host}${url.pathname}`;
    
    await page.goto(urlWithAuth);  // Authenticate once
  });
}
```

### **Usage in Tests**

```typescript
Given('user {string} is on facility catalogue page', 
  async ({ loginAs, facilityPage }, userAlias: string) => {
    await loginAs(userAlias);        // Authenticates to base URL
    await facilityPage.open();       // Navigates to /mvc-app/facility (session active)
  }
);
```

### **User Configuration**

**File:** `core/data/users.json`

```json
{
  "systemAdmin": {
    "id": 10752,
    "roleid": 1,
    "username": "jaina15",
    "envKey": "SYS_ADMIN_PASSWORD"
  },
  "areaAdmin_News": {
    "id": 10769,
    "roleid": 2,
    "username": "pandec01",
    "area": "News",
    "envKey": "AREA_ADMIN_PASSWORD"
  },
  "areaAdmin_Area1": {
    "id": 1003,
    "roleid": 3,
    "username": "area_admin_11",
    "area": "Area1",
    "envKey": "AREA_ADMIN_1_PASSWORD"
  }
}
```

**File:** `.env`

```bash
UI_BASE_URL=https://allocate-systest-dbr.national.core.bbc.co.uk
API_BASE_URL=https://allocate-systest-dbr.national.core.bbc.co.uk/api

# Test user passwords
SYS_ADMIN_PASSWORD=<password_for_jaina15>
AREA_ADMIN_PASSWORD=BBC@2025@
AREA_ADMIN_1_PASSWORD=<password_for_area_admin_11>
```

---

## 📊 Test Execution

### **UI Tests (Working Now)**

```bash
# Run all UI tests
npm run uitest

# Run specific test
npx playwright test --project=uitest facility_booking.feature

# Debug mode
npx playwright test --debug

# View report
npx playwright show-report
```

### **API/DB Tests (Ready, Blocked on Backend)**

```bash
# Integration tests
npm run integratedtest

# Database tests
npm run dbtest

# All tests with report
npm run all:report
```

---

## 📝 Test Examples

### **UI Test Flow**

```
Feature File (Gherkin)
  ↓
Given: loginAs('areaAdmin_News') → Authenticates to base URL
  ↓
When: facilityPage.open() → Navigates to /mvc-app/facility (uses session)
  ↓
Then: Assert facility created
  ↓
And: Delete facility (cleanup)
```

### **Database Test Flow**

```typescript
test('area admin can access their group', async ({ db, ensureUserExists }) => {
  // 1. Verify user exists
  const areaAdmin = await ensureUserExists('areaAdmin_News');
  
  // 2. Query database
  const group = await SchedulingGroupQueries.getByIdForUser(db, 24, areaAdmin.id);
  
  // 3. Assert
  expect(group).toBeTruthy();
  expect(group.SchedulingGroupsID).toBe(24);
  
  // Auto-cleanup: Transaction rolls back after test
});
```

---

## 🏗️ API Modularization Pattern

### **Modular CRUD Structure**

```
workflows/schd-group/api/
├── view.api.ts      # GET operations
├── create.api.ts    # POST operations
├── update.api.ts    # PUT operations
└── delete.api.ts    # DELETE operations
```

### **Benefits**

- ✅ Scalable for multiple modules
- ✅ One operation type per file
- ✅ Self-contained (no central registry)
- ✅ Independently testable

### **Usage Example**

```typescript
import { viewAPI } from '@workflows/schd-group/api/view.api';
import { createAPI } from '@workflows/schd-group/api/create.api';

// View operations
const groups = await viewAPI.list(apiClient);
const group = await viewAPI.getById(apiClient, groupId);

// Create operations
const newGroup = await createAPI.create(apiClient, payload);
```

---

## 🔄 Database Fixtures

### **Available Fixtures** (`tests/fixtures/test.fixture.ts`)

| Fixture | Purpose |
|---------|---------|
| `db` | Database connection pool |
| `ensureUserExists(userAlias)` | Verify test user exists |
| `authenticateAs(userId)` | Set auth headers for API |
| `apiClient` | Authenticated HTTP client |

### **Auto Transaction Rollback**

All database tests automatically:
1. Start transaction before test
2. Execute all queries
3. ROLLBACK after test completes

This prevents test pollution and isolates data.

---

## ✅ Current Status

### **Phase 1: UI Testing - ✅ COMPLETE**

| Component | Status |
|-----------|--------|
| HTTP Basic Auth | ✅ Working |
| Facility Feature | ✅ Ready |
| Page Object Model | ✅ Implemented |
| Test Execution | ✅ `npm run uitest` WORKS |

### **Phase 2: API Modularization - ✅ COMPLETE**

| Component | Status |
|-----------|--------|
| view.api.ts | ✅ Ready |
| create.api.ts | ✅ Ready |
| update.api.ts | ✅ Ready |
| delete.api.ts | ✅ Ready |
| View Steps | ✅ Ready |
| Create Steps | ✅ Ready |

### **Phase 3: Database Testing - ✅ READY**

| Component | Status |
|-----------|--------|
| Connection Pool | ✅ Ready |
| Query Helpers | ✅ Ready |
| Permission Logic | ✅ Tested |
| DB Tests | ✅ Ready |

### **Phase 4: Backend Endpoints - 🔴 BLOCKED**

Waiting on PHP team for:
- GET /api/scheduling-groups
- POST /api/scheduling-groups
- PUT /api/scheduling-groups/{id}
- DELETE /api/scheduling-groups/{id}

---

## 💡 Quick Start

### **1. Install Dependencies**

```bash
npm install
```

### **2. Configure Environment**

Create `.env` file with actual credentials:

```bash
UI_BASE_URL=https://allocate-systest-dbr.national.core.bbc.co.uk
API_BASE_URL=https://allocate-systest-dbr.national.core.bbc.co.uk/api
SYS_ADMIN_PASSWORD=<actual_password>
AREA_ADMIN_PASSWORD=<actual_password>
AREA_ADMIN_1_PASSWORD=<actual_password>
```

### **3. Run UI Tests**

```bash
npm run uitest
```

### **4. View Results**

```bash
npx playwright show-report
```

---

## 📚 Key Files Reference

| Purpose | File |
|---------|------|
| HTTP Basic Auth Setup | [tests/fixtures/pages.fixture.ts](tests/fixtures/pages.fixture.ts) |
| UI Feature & Steps | [tests/ui/features/NP001/facility_booking.feature](tests/ui/features/NP001/facility_booking.feature) |
| Page Object Model | [tests/ui/page/NP001/FacilityPage.ts](tests/ui/page/NP001/FacilityPage.ts) |
| Test Users Config | [core/data/users.json](core/data/users.json) |
| API View Ops | [workflows/schd-group/api/view.api.ts](workflows/schd-group/api/view.api.ts) |
| API Create Ops | [workflows/schd-group/api/create.api.ts](workflows/schd-group/api/create.api.ts) |
| DB Queries | [workflows/schd-group/db/queries/schedulingGroup.queries.ts](workflows/schd-group/db/queries/schedulingGroup.queries.ts) |

---

## 🎯 Architecture Overview

```
┌──────────────────────────────────────────┐
│     Playwright BDD Test Framework         │
└──────────────┬───────────────────────────┘
               │
        ┌──────┼──────┬──────────┐
        │      │      │          │
        ▼      ▼      ▼          ▼
    ┌─────┐ ┌───┐ ┌──────┐ ┌──────────┐
    │ UI  │ │API│ │ DB   │ │ Fixtures │
    └─────┘ └───┘ └──────┘ └──────────┘
      │        │      │         │
      │        │      │         │
   Browser  HTTP    SQL    Dependencies
   Automation Requests Queries
```

---

## 📝 Best Practices

### **DO ✅**

- Use fixtures for all test dependencies
- Store reusable code in `workflows/`
- Use Page Object Model for UI selectors
- Embed credentials only in fixture (not steps)
- Verify prerequisites before assertions

### **DON'T ❌**

- Write raw SQL in test files
- Hardcode credentials in tests
- Mix UI selectors into step definitions
- Run tests with `--workers > 1` for DB tests
- Commit `.env` file to repository

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Test fails on login | Verify credentials in `.env` |
| `__dirname is not defined` | Fixed - using `fileURLToPath` for ES modules |
| Tests run in parallel and fail | Use `--workers=1` for sequential execution |
| Port already in use | Kill existing processes on that port |

---

**Last Updated:** February 25, 2026  
**Status:** UI Tests Working ✅ | API/DB Ready | Backend Endpoints Pending  
**Framework Version:** 1.0 (POC)
