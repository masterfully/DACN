# Logout Endpoint Implementation Plan

## Scope
Implement POST /api/auth/logout for Member 1 Auth module.

## Source of Truth Used
- API contract baseline from backend/docs/API_Document.md (Auth section and response envelope conventions)
- Backend conventions from skills/backend-coder-skill.md
- Task assignment from backend/docs/TASKS.md (Step 1 Auth)

## Current Codebase Snapshot (2026-03-18)
- POST /api/auth/login and POST /api/auth/register are implemented.
- Refresh tokens are persisted in RefreshToken table with fields: Token, ExpiresAt, RevokedAt.
- POST /api/auth/logout is not implemented in route/controller/service.
- API_Document.md currently has login, refresh-token, change-password, register, but no explicit logout section.

Implication:
- This plan includes both implementation and documentation additions for logout.

## Goal
Build a deterministic logout flow that:
- Accepts a refresh token and invalidates the corresponding DB record
- Returns standard response envelope
- Is idempotent and safe against token probing
- Aligns with current multi-session policy (revoke only presented token)

## Convention Alignment
- API base path under /api/*
- 3-layer architecture: route -> controller -> service
- Zod validation for request body
- Standard response envelope: success, data, error, meta
- Status code policy from backend skill

## Phase 0 - Contract Lock

### Proposed Contract
- Method: POST
- Path: /api/auth/logout
- Auth required: No (token-based invalidation via request body)
- Request body:
  - refreshToken: string (required)
- Success response: 200
  - success true
  - data.message: "Đăng xuất thành công"
  - error null
  - meta null

### Failure Mapping (Proposed)
- 400 AUTH_LOGOUT_INVALID_INPUT: missing/invalid refreshToken field
- 401 AUTH_LOGOUT_INVALID_TOKEN: token not found, already revoked, malformed, or expired
- 500 INTERNAL_SERVER_ERROR: unexpected failure

### Security Decision
Use a generic 401 response for all invalid token states to avoid token enumeration.

### Lock Items to Confirm
1. Keep auth requirement as public body-token endpoint (recommended), or require bearer auth as well.
2. Keep idempotent behavior with generic 401 for invalid/nonexistent token.

## Phase 1 - API Surface (Route + Controller + Validation)

### Planned Files
- Update src/routes/authRoute.ts
- Update src/controllers/authController.ts
- Update src/constants/errors/auth/codes.ts
- Update src/constants/errors/auth/messages.ts

### Validation Design (Zod)
- refreshToken: required string, trimmed, min length 1

Validation failure behavior:
- Return 400
- code: AUTH_LOGOUT_INVALID_INPUT
- details:
  - formErrors []
  - fieldErrors.refreshToken with descriptive message

### Controller Responsibilities
- Parse and validate request body
- Call authService.logout
- Return 200 via sendSuccess

### Route Responsibilities
- Register POST /logout
- Keep route file thin and static-route safe

## Phase 2 - Service Logic

### Planned Files
- Update src/services/authService.ts

### Service Flow
1. Normalize input
- Trim refreshToken

2. Lookup token record
- Find refresh token row by exact Token value

3. Validate token lifecycle state
- If not found, revoked, or expired => throw AUTH_LOGOUT_INVALID_TOKEN (401)

4. Invalidate token
- Set RevokedAt = now

5. Return success payload
- message: "Đăng xuất thành công"

### Optional Hardening (Follow-up)
- Store hash of refresh token instead of raw token
- Revoke all tokens by account for global logout endpoint

## Phase 3 - Error Handling and Security

### Error Mapping
- AUTH_LOGOUT_INVALID_INPUT -> 400
- AUTH_LOGOUT_INVALID_TOKEN -> 401
- INTERNAL_SERVER_ERROR -> 500

### Security Checklist
- Do not leak whether token exists in database
- Do not log raw refresh token
- Keep error.details convention:
  - validation errors -> fieldErrors
  - auth/business errors -> formErrors

## Phase 4 - Verification and Testing

### Test Matrix
1. Logout - Success
- Input: valid active refreshToken
- Expected: 200, success true, message present
- DB: corresponding row RevokedAt is set

2. Logout - Missing refreshToken
- Input: {}
- Expected: 400 AUTH_LOGOUT_INVALID_INPUT
- details.fieldErrors.refreshToken populated

3. Logout - Empty refreshToken
- Input: { refreshToken: "   " }
- Expected: 400 AUTH_LOGOUT_INVALID_INPUT

4. Logout - Token not found
- Input: random token
- Expected: 401 AUTH_LOGOUT_INVALID_TOKEN

5. Logout - Already revoked token
- Input: same token used successfully in case 1
- Expected: 401 AUTH_LOGOUT_INVALID_TOKEN

6. Logout - Expired token
- Input: refresh token with ExpiresAt in the past
- Expected: 401 AUTH_LOGOUT_INVALID_TOKEN

### Exit Criteria
- Build passes (pnpm build)
- Manual/API tests pass for success and failure paths
- Response envelopes are consistent with project conventions

## Phase 5 - Documentation and Postman Rollout

### Tasks
- Add Auth 1.x Logout section to backend/docs/API_Document.md
- Include success + failure examples with full envelope
- Add Postman cases to backend/docs/postman/dacn-backend-test-cases.postman_collection.json:
  - Logout - Success
  - Logout - Missing refreshToken
  - Logout - Invalid token
  - Logout - Already revoked token
- Mark logout task done in backend/docs/TASKS.md after verification
- Add Actual Result section to this file after implementation

### Postman Case Addition Plan

#### Target File
- backend/docs/postman/dacn-backend-test-cases.postman_collection.json

#### Placement Strategy
- Add new requests under existing `Auth` folder.
- Place logout cases after login cases to preserve auth-flow readability.
- Keep request naming consistent with existing pattern: `Logout - <Scenario>`.

#### Variables to Add
- `logout_refresh_token`: refresh token captured from successful login.
- `logout_invalid_refresh_token`: static invalid token string for negative test.

Recommended default values:
- `logout_refresh_token`: empty string (filled at runtime)
- `logout_invalid_refresh_token`: `invalid.refresh.token`

#### Cases to Add (Request + Expected)
1. Logout - Success
- Method: `POST /api/auth/logout`
- Body:
  - `{ "refreshToken": "{{logout_refresh_token}}" }`
- Expected:
  - HTTP `200`
  - `success = true`
  - `data.message` exists
  - `error = null`
  - `meta = null`

2. Logout - Missing refreshToken
- Body: `{}`
- Expected:
  - HTTP `400`
  - `error.code = AUTH_LOGOUT_INVALID_INPUT`
  - `error.details.fieldErrors.refreshToken` present

3. Logout - Empty refreshToken
- Body: `{ "refreshToken": "   " }`
- Expected:
  - HTTP `400`
  - `error.code = AUTH_LOGOUT_INVALID_INPUT`

4. Logout - Invalid token
- Body:
  - `{ "refreshToken": "{{logout_invalid_refresh_token}}" }`
- Expected:
  - HTTP `401`
  - `error.code = AUTH_LOGOUT_INVALID_TOKEN`
  - `error.details.formErrors` present

5. Logout - Already revoked token
- Body:
  - `{ "refreshToken": "{{logout_refresh_token}}" }`
- Preconditions:
  - Run `Logout - Success` first with same token.
- Expected:
  - HTTP `401`
  - `error.code = AUTH_LOGOUT_INVALID_TOKEN`

#### Execution Order in Postman
1. `Login - Success` (capture `refreshToken` into `logout_refresh_token`)
2. `Logout - Success`
3. `Logout - Already revoked token`
4. `Logout - Missing refreshToken`
5. `Logout - Empty refreshToken`
6. `Logout - Invalid token`

#### Collection Script Suggestion
- Add a test script to `Login - Success` to save refresh token:

```javascript
const json = pm.response.json();
if (json?.data?.refreshToken) {
  pm.collectionVariables.set("logout_refresh_token", json.data.refreshToken);
}
```

#### Validation Checklist for Collection Update
- JSON remains valid after editing.
- New variables are present in `variable` array.
- New requests are in `Auth` folder and use `Content-Type: application/json`.
- Case names and expected codes match API_Document and service error constants.

## Definition of Done
- POST /api/auth/logout implemented and mounted
- Refresh token invalidation persisted via RevokedAt
- Validation and error mapping complete
- Docs and Postman coverage added
- Build and manual verification completed

## Proposed Error Constants
- AUTH_LOGOUT_INVALID_INPUT
- AUTH_LOGOUT_INVALID_TOKEN

## Proposed Error Messages
- AUTH_LOGOUT_INVALID_INPUT: "Dữ liệu đăng xuất không hợp lệ"
- AUTH_LOGOUT_INVALID_TOKEN: "Refresh token không hợp lệ hoặc đã hết hạn"
- AUTH_LOGOUT_SUCCESS: "Đăng xuất thành công"

## Actual Result (2026-03-18)

### Implemented
- Added `POST /api/auth/logout` to auth route.
- Added logout request validation in controller:
  - required `refreshToken` string
  - trimmed and non-empty
  - invalid input maps to `400 AUTH_LOGOUT_INVALID_INPUT`
- Added service logic to revoke refresh token:
  - lookup by exact `Token`
  - invalid if not found, already revoked, or expired
  - invalid states map to generic `401 AUTH_LOGOUT_INVALID_TOKEN`
  - valid token is revoked by setting `RevokedAt = now`
- Added auth constants/messages:
  - `AUTH_LOGOUT_INVALID_INPUT`
  - `AUTH_LOGOUT_INVALID_TOKEN`
  - `AUTH_LOGOUT_SUCCESS`

### Documentation & Test Assets
- Updated `API_Document.md`:
  - added `1.2 Logout` section with request and full success/error envelopes
  - renumbered Auth subsection headings in TOC and section titles
- Updated Postman collection:
  - added login test script to capture `refreshToken` into `logout_refresh_token`
  - added logout test cases:
    - `Logout - Success`
    - `Logout - Already revoked token`
    - `Logout - Missing refreshToken`
    - `Logout - Empty refreshToken`
    - `Logout - Invalid token`
  - added collection variables:
    - `logout_refresh_token`
    - `logout_invalid_refresh_token`
- Updated task checklist in `TASKS.md`:
  - marked `POST /api/auth/logout` as done.

### Contract Decisions Applied
- Logout remains a public body-token endpoint (no bearer auth required).
- Invalid token states use one generic 401 response to avoid token probing.
