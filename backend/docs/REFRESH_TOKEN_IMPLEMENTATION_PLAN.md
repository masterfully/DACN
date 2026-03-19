# Refresh Token Endpoint Implementation Plan

## Scope
Implement POST /api/auth/refresh-token for Member 1 Auth module.

## Source of Truth Used
- API contract baseline from backend/docs/API_Document.md (Auth 1.3 Refresh Token)
- Backend conventions from skills/backend-coder-skill.md
- Task assignment from backend/docs/TASKS.md (Step 1 Auth)
- Existing auth implementation style from:
  - backend/docs/LOGIN_IMPLEMENTATION_PLAN.md
  - backend/docs/LOGOUT_IMPLEMENTATION_PLAN.md
  - backend/src/controllers/authController.ts
  - backend/src/services/authService.ts

## Current Codebase Snapshot (2026-03-19)
- Implemented: POST /api/auth/login
- Implemented: POST /api/auth/logout
- Implemented: POST /api/auth/register
- Not implemented: POST /api/auth/refresh-token
- Refresh tokens are persisted in DB table RefreshToken with lifecycle fields ExpiresAt and RevokedAt.
- Global error envelope already supports error.details.formErrors and error.details.fieldErrors.

Implication:
- Refresh-token implementation should reuse current auth architecture and token helpers in authService.

## Goal
Build a secure refresh flow that:
- Verifies the provided refresh token against DB and token signature
- Rejects invalid, expired, or revoked refresh tokens
- Rotates refresh token on every successful refresh (old token revoked, new token created)
- Issues a new accessToken and refreshToken pair
- Returns a standardized response envelope and deterministic error mapping

## Convention Alignment
- API base path stays under /api/*
- 3-layer architecture: route -> controller -> service
- Zod validation for request payload
- Standard response envelope on success and failure
- Error details convention:
  - Validation errors: error.details.fieldErrors
  - Auth/business errors: error.details.formErrors

## Phase 0 - Contract Lock

### Objective
Freeze endpoint behavior before coding.

### Proposed Contract
- Method: POST
- Path: /api/auth/refresh-token
- Auth required: No (body refresh token based)
- Request body:
  - refreshToken: string (required)
- Success status: 200
- Success payload:
  - data.accessToken
  - data.refreshToken
- Error statuses:
  - 400 for invalid input payload
  - 401 for invalid/expired/revoked token states
  - 500 for unexpected server errors

### Exit Criteria
- Team agrees on status/error code matrix
- Team agrees refresh endpoint returns tokens only (no account profile payload)

## Phase 1 - API Surface (Route + Controller + Validation)

### Planned Files
- Update backend/src/routes/authRoute.ts
- Update backend/src/controllers/authController.ts
- Update backend/src/constants/errors/auth/codes.ts
- Update backend/src/constants/errors/auth/messages.ts

### Route Plan
- Add POST /refresh-token to auth router.
- Keep static routes explicit and grouped for future maintainability.

### Controller Plan
- Add refreshToken schema with zod:
  - required string
  - trim
  - min length 1
- Map validation failures to:
  - code: AUTH_REFRESH_TOKEN_INVALID_INPUT
  - status: 400
  - details.fieldErrors.refreshToken
- Call authService.refreshToken and send success 200 via sendSuccess.

### Error Constant Plan
Add refresh-token specific constants for deterministic mapping:
- AUTH_REFRESH_TOKEN_INVALID_INPUT
- AUTH_REFRESH_TOKEN_INVALID_TOKEN
- AUTH_REFRESH_TOKEN_EXPIRED
- AUTH_REFRESH_TOKEN_REVOKED

Note:
- If product prefers generic error semantics for security, keep one public-facing 401 code and message for all invalid states.

### Exit Criteria
- Invalid payloads return consistent 400 response
- Valid payload reaches service layer only after schema pass

## Phase 2 - Service Logic and Rotation

### Planned Files
- Update backend/src/services/authService.ts

### New Types
- Add RefreshTokenInput interface:
  - refreshToken: string

### Refresh Service Flow
1. Normalize input
- Trim provided refreshToken.

2. Verify JWT structure and signature
- jwt.verify with JWT secret.
- Payload must include accountId, role, username.
- If malformed/invalid signature: reject with 401 invalid token.

3. Lookup token record in DB
- Query RefreshToken by exact Token.
- Retrieve RefreshTokenID, AccountID, ExpiresAt, RevokedAt.

4. Validate token lifecycle in DB
- Not found -> 401 invalid token
- RevokedAt not null -> 401 invalid token (or revoked-specific code)
- ExpiresAt <= now -> 401 invalid token (or expired-specific code)

5. Optional account sanity check (recommended)
- Ensure account still exists and is allowed to authenticate.
- If account/profile inactive or banned, reject with 403/401 based on existing auth policy.

6. Rotate token atomically in transaction
- Create new access token from payload accountId/role/username.
- Create new refresh token with refresh expiry.
- In a single prisma transaction:
  - Mark old token RevokedAt = now
  - Insert new refresh token row with ExpiresAt
- Return new token pair.

### Concurrency and Replay Handling
- Use updateMany on old token with condition RevokedAt = null to prevent double-revoke race.
- If transaction detects already-revoked state due to concurrent refresh, return 401 invalid token.
- Treat each refresh token as one-time-use after successful rotation.

### Exit Criteria
- Success path returns new token pair and revokes old token
- Old token cannot be used after refresh
- Replay attempts fail deterministically with 401

## Phase 3 - Error Handling and Security

### Error Mapping (Recommended)
- AUTH_REFRESH_TOKEN_INVALID_INPUT -> 400
- AUTH_REFRESH_TOKEN_INVALID_TOKEN -> 401
- AUTH_REFRESH_TOKEN_EXPIRED -> 401
- AUTH_REFRESH_TOKEN_REVOKED -> 401
- SERVER_MISCONFIGURATION -> 500
- INTERNAL_SERVER_ERROR -> 500

### Security Checklist
- Never log raw refresh token value.
- Return generic 401 wording for token-state failures to avoid token probing.
- Keep DB as source of truth for revocation even if JWT signature is valid.
- Keep access and refresh expiry values from env variables only.
- Preserve existing error.details conventions.

### Exit Criteria
- All failure responses are standardized and safe
- No sensitive token data leaks in logs/responses

## Phase 4 - Documentation Alignment

### Planned Docs Updates
- Update backend/docs/API_Document.md section 1.3 to match runtime envelope:
  - Success includes success, data, error: null, meta: null
  - Error includes success: false, data: null, error with details, meta: null
- Add explicit refresh-token error code examples consistent with constants.
- Keep wording aligned with login/logout docs style.

### Exit Criteria
- API docs match actual implementation behavior
- No envelope mismatch remains for refresh-token endpoint

## Phase 5 - Verification and Postman Rollout

### Functional Verification
- Build passes and endpoint is reachable through /api/auth/refresh-token.
- Old refresh token is revoked after successful refresh.
- New refresh token can refresh again.
- Old refresh token replay fails.

### Postman Collection Target
- backend/docs/postman/dacn-backend-test-cases.postman_collection.json

### Variables to Add
- refresh_source_token: source refresh token captured from Login - Success
- refresh_rotated_token: token captured from Refresh Token - Success
- refresh_invalid_token: static invalid token string

Recommended default values:
- refresh_source_token: empty
- refresh_rotated_token: empty
- refresh_invalid_token: invalid.refresh.token

## Postman Cases (Add At End Of Auth Folder)

1. Refresh Token - Success
- Method: POST /api/auth/refresh-token
- Body:
  {
    "refreshToken": "{{refresh_source_token}}"
  }
- Expected:
  - HTTP 200
  - success true
  - data.accessToken exists
  - data.refreshToken exists and differs from refresh_source_token
  - error null
  - meta null
- Test script:
  - Save data.refreshToken to refresh_rotated_token

2. Refresh Token - Replay old token after rotation
- Method: POST /api/auth/refresh-token
- Body:
  {
    "refreshToken": "{{refresh_source_token}}"
  }
- Precondition:
  - Run Refresh Token - Success first.
- Expected:
  - HTTP 401
  - error.code indicates invalid/revoked token
  - error.details.formErrors populated

3. Refresh Token - Use rotated token (second success)
- Method: POST /api/auth/refresh-token
- Body:
  {
    "refreshToken": "{{refresh_rotated_token}}"
  }
- Expected:
  - HTTP 200
  - success true
  - returns new token pair again

4. Refresh Token - Missing refreshToken
- Body: {}
- Expected:
  - HTTP 400
  - error.code AUTH_REFRESH_TOKEN_INVALID_INPUT
  - error.details.fieldErrors.refreshToken present

5. Refresh Token - Empty refreshToken
- Body:
  {
    "refreshToken": "   "
  }
- Expected:
  - HTTP 400
  - error.code AUTH_REFRESH_TOKEN_INVALID_INPUT

6. Refresh Token - Invalid token format or signature
- Body:
  {
    "refreshToken": "{{refresh_invalid_token}}"
  }
- Expected:
  - HTTP 401
  - error.code indicates invalid token

7. Refresh Token - Expired token
- Body: expired refresh token fixture
- Expected:
  - HTTP 401
  - error.code indicates expired/invalid token

8. Refresh Token - Token revoked by logout
- Precondition:
  - Run Login - Success and capture refresh token.
  - Run Logout - Success using same token.
- Request:
  - POST /api/auth/refresh-token with revoked token
- Expected:
  - HTTP 401
  - error.code indicates invalid/revoked token

### Suggested Execution Order In Postman
1. Login - Success (capture refresh_source_token)
2. Refresh Token - Success
3. Refresh Token - Replay old token after rotation
4. Refresh Token - Use rotated token (second success)
5. Refresh Token - Missing refreshToken
6. Refresh Token - Empty refreshToken
7. Refresh Token - Invalid token format or signature
8. Refresh Token - Token revoked by logout
9. Refresh Token - Expired token

### Collection Script Suggestion
Add in Login - Success test script:
- Save login refresh token to refresh_source_token.
- Keep existing logout_refresh_token capture unchanged.

Add in Refresh Token - Success test script:
- Save new refresh token to refresh_rotated_token.

## Definition of Done
- POST /api/auth/refresh-token implemented and mounted
- Rotation is enforced (old token revoked, new token persisted)
- Validation and error mapping are complete
- API docs aligned with response envelope conventions
- Postman cases for refresh-token scenarios are added and pass
