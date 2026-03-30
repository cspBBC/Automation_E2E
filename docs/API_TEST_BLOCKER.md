# API Test Implementation - Current Status & Blockers

## What Works ✅
- Session Manager: Captures browser NTLM authentication and saves cookies
- Browser Login: Successfully authenticates with NTLM credentials
- Session Persistence: Saves session to `.auth/systemAdmin.json` for reuse
- UI Test Independence: No UI fixtures or tests were modified

## Current Blocker ❌
API test returns **401 Unauthorized** when trying to call `/mvc-app/admin/scheduling-group`

### Root Cause
The endpoint `/mvc-app/admin/scheduling-group` appears to be a **UI page**, not a REST API:
- ✅ Returns 200 (HTML) when accessed via browser
- ❌ Returns 401 when called as API (even with credentials)

### Why NTLM URL Credentials Don't Work for APIs
NTLM authentication requires:
1. Persistent TCP connection
2. Challenge-response handshake between client and server
3. Stateful authentication across multiple HTTP requests

URL-embedded credentials (`https://user:pass@host/`) only work for Basic Auth, not NTLM.

## Questions for Developer

1. **API Endpoint**: What's the actual REST API endpoint for scheduling groups?
   - Example: `/api/v1/scheduling-groups` ?
   - Example: `/mvc-app/api/admin/scheduling-group` ?

2. **Authentication Method**: What auth does the REST API use?
   - API Keys? (e.g., `X-API-Key: xxx`)
   - Bearer Token? (e.g., `Authorization: Bearer xxx`)
   - OAuth 2.0?
   - Something else?

3. **Endpoint Verification**: Can you confirm:
   - Is `/mvc-app/admin/scheduling-group` a UI page or API endpoint?
   - If API, how should it be authenticated?

## Next Steps (Once Developer Confirms)

### Option A: If API Keys are available
```typescript
// Use API key directly
apiClient.setAuthHeaders({
  'X-API-Key': process.env.SYSTEM_ADMIN_API_KEY,
  'Content-Type': 'application/json'
});
```

### Option B: If Bearer Token needed
```typescript
// Get token from endpoint, then use it
const tokenResponse = await browserContext.request.post('/api/auth/token', {
  data: { username, password }
});
const token = await tokenResponse.json();
apiClient.setAuthHeaders({
  'Authorization': `Bearer ${token.accessToken}`
});
```

### Option C: If REST API endpoint is different
Update `.env.systest` with correct API base URL and update test steps accordingly.

## Current Test Implementation

**Feature**: `/tests/integrated/features/NP035/schedulinggroup_api_create.feature`
- Authenticates with browser login ✅
- Attempts to call endpoint ✅ (but returns 401)
- Validates response status ✅ (fails on assertion)

**Steps**: `/tests/integrated/steps/NP035/schedulinggroup_api_create.steps.ts`
- `Given user 'systemAdmin' is authenticated` - Opens browser, logs in, saves session
- `When the system admin requests to view all Scheduling Groups` - Makes API call
- `Then the response status code should be {int}` - Validates response

**Session Manager**: `/core/auth/sessionManager.ts`
- Saves authentication sessions
- Reuses sessions across test runs (24-hour TTL)
- No external dependencies

## Files Modified
1. `core/auth/sessionManager.ts` - NEW
2. `tests/fixtures/fixture.ts` - Updated authenticateAs fixture
3. `tests/integrated/steps/NP035/schedulinggroup_api_create.steps.ts` - NEW full implementation
4. `playwright.config.ts` - Fixed API fixtures path

## Branch
`apidemo` - Ready for review and API auth clarification
