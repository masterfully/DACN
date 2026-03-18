# Login Endpoint Implementation Plan

## Scope
Implement POST /api/auth/login for Member 1 Auth module.

## Source of Truth Used
- API contract from API_Document.md (Auth 1.1 Login)
- Backend conventions from skills/backend-coder-skill.md
- Task assignment from backend/docs/TASKS.md (Step 1 Auth)

## Goal
Build a secure login flow that:
- Authenticates by username + password
- Returns accessToken and refreshToken
- Persists refresh token with expiry in database
- Returns account + profile in standard response envelope
- Uses consistent error shape with code/message (and details extension used by current project)

## Convention Alignment
- API base path remains under /api/*
- Keep 3-layer architecture: route -> controller -> service
- Use Zod for request validation
- Return standardized response envelope on both success and error
- Apply status code policy from backend skill (200/201/400/401/403/404/409/500)
- Keep static routes registered before dynamic routes (future-safe routing)

## Phase 0 - Contract Lock and Preconditions

### Objective
Freeze API contract and security rules before coding.

### Checklist
- Confirm endpoint: POST /api/auth/login (public)
- Confirm request body fields: username, password
- Confirm success status: 200
- Confirm error status targets: 400, 401, 403 (optional), 500
- Confirm response envelope includes: success, data, error, meta
- Confirm login result projection includes account + profile

### Exit Criteria
- Team agrees on final status code and error code matrix
- Team agrees on exact response payload fields

## API Contract (Target)
- Method: POST
- Path: /api/auth/login
- Auth required: No
- Request body:
  - username (string, required)
  - password (string, required)
- Success response: 200
  - data.accessToken
  - data.refreshToken
  - data.account (accountId, username, role, email)
  - data.account.profile (profileId, fullName, avatar, status, optional fields as available)
- Failure response: standardized error envelope with `meta: null`

## Phase 1 - API Surface (Route + Controller + Validation)

### Objective
Expose endpoint and enforce strict input validation.

### Planned Files
- Update `src/routes/authRoute.ts`
- Update `src/controllers/authController.ts`

### Validation Design (Zod)
- username: required, trimmed, non-empty, max 255
- password: required, non-empty

Validation failure behavior:
- Return 400
- code: VALIDATION_ERROR
- details: `formErrors` and `fieldErrors`

### Controller Responsibilities
- Parse and validate request body
- Call `authService.login`
- Return 200 success via `sendSuccess`
- Avoid leaking internal errors

### Route Responsibilities
- Register `POST /login`
- Keep route file thin
- Keep static-before-dynamic ordering in auth routes for future endpoints

### Exit Criteria
- Invalid input produces deterministic 400 response
- Valid input reaches service layer with normalized payload

## Phase 2 - Service Logic and Persistence

### Objective
Implement credential verification, token issuance, and refresh-token persistence.

### Planned Files
- Update `src/services/authService.ts`

### Service Flow
1. Normalize input
- Trim username

2. Fetch account for authentication
- Query account by username
- Include minimal profile fields for response payload

3. Verify credentials
- If account not found: authentication error
- Compare plaintext password with stored bcrypt hash
- If mismatch: authentication error

4. Generate token pair
- Reuse existing JWT helpers and expiry config
- Payload: accountId, role, username

5. Persist refresh token
- Insert into `RefreshToken` with `AccountID`, `Token`, `ExpiresAt`

6. Build response projection
- accessToken
- refreshToken
- account + profile fields in API contract shape

### Exit Criteria
- Valid credentials return token pair and account payload
- Invalid credentials never reveal whether username exists
- Refresh token record is persisted for every successful login

## Phase 3 - Error Handling and Security Hardening

### Objective
Ensure deterministic and secure failure behavior.

### Error Mapping (Recommended)
- VALIDATION_ERROR -> 400
- INVALID_CREDENTIALS -> 401
- ACCOUNT_INACTIVE -> 403
- INTERNAL_SERVER_ERROR -> 500

Notes:
- 404 and 409 are part of global policy but not expected for normal login path
- Internal Prisma errors must be mapped to domain errors; never return raw DB errors

### Security Checklist
- Use generic message for bad credentials (no username existence leak)
- Never log plaintext passwords or raw tokens
- Keep JWT secret and expiries from env only
- Reuse centralized AppError + global error handler
- Keep response `error.details` structure consistent

### Exit Criteria
- All auth failures return standardized envelope
- No sensitive data is exposed in logs/responses

## Phase 4 - Verification and Testing

### Objective
Verify functionality, failure paths, and consistency with existing register behavior.

### Test Plan
Success case:
- Valid username/password returns 200
- Response includes accessToken, refreshToken, account, profile
- RefreshToken table gets new active token row

Validation failures:
- Missing username -> 400
- Missing password -> 400
- Empty/whitespace username -> 400

Authentication failures:
- Wrong password -> 401 INVALID_CREDENTIALS
- Non-existing username -> 401 INVALID_CREDENTIALS

Consistency checks:
- Error response contains `data: null`, `error.code`, `error.message`, `error.details`, `meta: null`
- Response field naming matches existing auth/register conventions

### Exit Criteria
- Build passes (`pnpm build`)
- Manual API tests pass for success + failure paths
- Response shape is consistent with project standard

## Phase 5 - Documentation and Task Rollout

### Objective
Keep docs and tracking in sync with actual implementation.

### Tasks
- Update API_Document.md login examples if payload differs from reality
- Ensure global error format in docs remains aligned (`details` documented)
- Mark login task completed in TASKS.md once verified
- Add short implementation note in this file under an `Actual Result` section

## Workflow Mapping (Backend Skill)
1. Confirm endpoint contract (path, method, auth, request/response)
2. Define Zod schema for request body
3. Add route and keep route ordering safe
4. Implement controller with response utility
5. Implement service logic with Prisma + bcrypt + JWT
6. Map errors to domain codes and status codes
7. Verify behavior against API document examples

### Exit Criteria
- Docs reflect shipped behavior
- Task board reflects completed login endpoint

## Definition of Done
- POST /api/auth/login implemented and mounted
- Input validation is complete and deterministic
- Credentials are verified with bcrypt
- Access/refresh token pair is issued
- Refresh token is persisted with expiry
- Response envelope and error.details are consistent
- Build and manual tests pass

## Locked Decisions
1. Invalid credentials status code: `401`
2. Inactive account/profile must be blocked at login: `403` with code `ACCOUNT_INACTIVE`
3. `error.details` remains required in login error responses for consistency with register

## Refresh Token Session Policy (Confirmed)
Allow multiple active sessions/devices.

Rationale:
- Better user experience across phone/laptop/browser sessions
- Lower risk of unexpected logouts during normal usage
- Works naturally with refresh-token rotation design

Implementation notes:
- Keep one refresh token record per successful login
- Revoke only the presented refresh token on logout
- Rotate refresh token on `/auth/refresh-token` and revoke the old token
- Optional hardening later: add max active sessions per account and revoke oldest tokens beyond limit

