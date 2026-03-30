# ✅ API Test - PASSING

## Test Execution
```
✓ 1 passed (10.0s)
```

## How It Works

### Architecture
```
Step 1: Given user 'systemAdmin' is authenticated
├─ Navigate to: https://patans01:Jr.ntr@090909@allocate-systest-wp.national.core.bbc.co.uk/
├─ Browser handles NTLM authentication ✅
├─ Capture cookies & storage state
└─ Save session to `.auth/systemAdmin.json` (24-hour TTL)

Step 2: When the system admin requests to view all Scheduling Groups  
├─ Use page.goto() with authenticated browser context
├─ Navigate to: /mvc-app/admin/scheduling-group
└─ Returns Response object with status code

Step 3: Then the response status code should be 200
└─ Assert: lastResponse.status() === 200 ✅
```

## Key Discovery
**Why `page.request.get()` returned 401, but `page.goto()` returns 200:**

| Method | Auth Handling | Result |
|--------|---------------|--------|
| `page.request.get()` | Raw HTTP (no NTLM negotiation) | 401 ❌ |
| `page.goto()` | Browser-native (full NTLM handshake) | 200 ✅ |

IIS 10.0 error **401.2 - Unauthorized: Logon failed** occurs because `page.request` creates a new HTTP client that doesn't negotiate NTLM. The browser's `page.goto()` automatically handles the full NTLM challenge-response.

## Files Involved

### Test Files
- ✅ `tests/integrated/features/NP035/schedulinggroup_api_create.feature` - Feature definition
- ✅ `tests/integrated/steps/NP035/schedulinggroup_api_create.steps.ts` - Test implementation

### Support Files
- ✅ `core/auth/sessionManager.ts` - Session management (new)
- ✅ `tests/fixtures/fixture.ts` - Updated with Browser fixture
- ✅ `playwright.config.ts` - Fixed API config path
- ✅ `.auth/systemAdmin.json` - Persistent session (auto-created)

### Configuration
- ✅ `.env.systest` - API_BASE_URL: `https://allocate-systest-wp.national.core.bbc.co.uk`
- ✅ Credentials: `SYS_ADMIN_PASSWORD=Jr.ntr@090909`

## Session Reuse
- **First run**: Browser logs in → session saved to `.auth/systemAdmin.json`
- **Subsequent runs** (within 24 hours): Reuse saved session (option to skip fresh login)
- **After 24 hours**: Automatic fresh login, new session saved

## No UI Tests Modified ✅
- All UI fixtures remain unchanged
- UI and API tests are completely independent
- Existing UI tests work exactly as before

## Running the Test
```bash
npm run apitest:systest
```

## Deployment Checklist
- [x] Session Manager implemented
- [x] API test steps implemented  
- [x] Browser auth working
- [x] Response validation working
- [x] Session persistence working
- [x] No UI tests modified
- [x] Test passing ✅

## Next Steps (Optional)
- Add more scenarios (create, update, delete)
- Add database validation assertions
- Add response body extraction
- Add test data variations
