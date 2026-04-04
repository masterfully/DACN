# Change Password Endpoint Implementation Plan

## Scope
Implement `PUT /api/auth/change-password` for Member 1 Auth module.

## Source of Truth Used
- API contract from `backend/docs/API_Document.md` (Auth 1.4 Change Password)
- Task assignment from `backend/docs/TASKS.md` (Step 1 Auth)
- Backend conventions from `skills/backend-coder-skill.md`
- Current auth architecture in:
  - `backend/src/routes/authRoute.ts`
  - `backend/src/controllers/authController.ts`
  - `backend/src/services/authService.ts`
  - `backend/src/constants/errors/auth/*`

## Current Codebase Snapshot (2026-04-04)
- Implemented endpoints: login, logout, refresh-token, register.
- Missing endpoint: `PUT /api/auth/change-password`.
- `requireAuth` middleware already exists and attaches `req.user.accountId`.
- Auth controller already has shared password regex and Zod validation patterns.
- Auth service already uses bcrypt + AppError + Prisma patterns.
- Request logger already redacts `currentPassword` and `newPassword`.

Implication:
- This endpoint should be added by extending the existing auth route/controller/service and error constants, not by introducing new architecture.

## Goal
Build a secure authenticated password-change flow that:
- Verifies `currentPassword` against stored bcrypt hash
- Validates `newPassword` against password policy
- Hashes and updates the password with bcrypt
- Returns standardized response envelope and deterministic error codes

## Target Contract
- Method: `PUT`
- Path: `/api/auth/change-password`
- Auth required: Yes (`Authorization: Bearer <token>`)
- Request body:
  - `currentPassword` (string, required)
  - `newPassword` (string, required)
- Success status: `200`
- Success body:

```json
{
  "success": true,
  "data": {
    "message": "Đổi mật khẩu thành công"
  },
  "error": null,
  "meta": null
}
```

- Failure envelope follows project standard with `data: null`, `error.details`, and `meta: null`.

## Phase 0 - Contract Lock

### Objective
Lock error semantics and side effects before coding.

### Proposed Error Mapping
- `AUTH_CHANGE_PASSWORD_INVALID_INPUT` -> `400`
- `AUTH_CHANGE_PASSWORD_WRONG_CURRENT_PASSWORD` -> `401`
- `AUTH_CHANGE_PASSWORD_SAME_AS_CURRENT` -> `409`
- `UNAUTHORIZED` (missing/invalid bearer token) -> `401` (already handled by middleware)
- `INTERNAL_SERVER_ERROR` -> `500`

### Confirmed Decisions
1. Use standardized prefixed error codes (no legacy `WRONG_CURRENT_PASSWORD`).
2. Revoke all active refresh tokens after password change.
3. Reject `newPassword === currentPassword`.
4. Return a success message in `data.message`.

### Exit Criteria
- No unresolved policy decisions remain.

## Phase 1 - API Surface (Route + Controller + Validation)

### Planned File Updates
- `backend/src/routes/authRoute.ts`
- `backend/src/controllers/authController.ts`
- `backend/src/constants/errors/auth/codes.ts`
- `backend/src/constants/errors/auth/messages.ts`

### Route Plan
- Add `PUT /change-password`.
- Protect endpoint with `requireAuth` middleware.
- Keep route file thin and consistent with current auth routes.

### Validation Plan (Zod)
- `currentPassword`: required string, non-empty.
- `newPassword`: required string, minimum 8 chars, regex policy:
  - at least 1 uppercase letter
  - at least 1 number
  - at least 1 special character

Validation failure behavior:
- `400` with code `AUTH_CHANGE_PASSWORD_INVALID_INPUT`
- Use `error.details.fieldErrors` (no form-level errors for schema failures)

### Controller Plan
- Parse payload with `parseOrThrow`.
- Read authenticated account from `req.user.accountId`.
- Call service: `authService.changePassword(...)`.
- Return success using `sendSuccess(res, { message: AUTH_ERROR_MESSAGES.AUTH_CHANGE_PASSWORD_SUCCESS }, 200)`.

### Exit Criteria
- Invalid payloads fail deterministically with structured field errors.
- Valid requests reach service layer only for authenticated users.

## Phase 2 - Service Logic (Verify + Hash + Update)

### Planned File Update
- `backend/src/services/authService.ts`

### New Service Input
- `ChangePasswordInput`:
  - `accountId: number`
  - `currentPassword: string`
  - `newPassword: string`

### Service Flow
1. Fetch active account by `AccountID` + `IsDeleted = false`.
2. If account not found, throw unauthorized-style auth error (token/account no longer valid).
3. Compare `currentPassword` with stored hash using `bcrypt.compare`.
4. If mismatch, throw `AUTH_CHANGE_PASSWORD_WRONG_CURRENT_PASSWORD` with `formErrors`.
5. If `newPassword === currentPassword`, throw `AUTH_CHANGE_PASSWORD_SAME_AS_CURRENT` (`409`) with `formErrors`.
6. Hash `newPassword` using `bcrypt.hash(..., 10)`.
7. In one Prisma transaction:
   - update account password hash
   - revoke all active refresh tokens for that account (`RevokedAt = now`)
8. Return success payload with message.

### Transaction Recommendation
- Use a Prisma transaction:
  - update account password
  - revoke token rows (`RevokedAt = now`) where `AccountID` matches and `RevokedAt` is null

### Exit Criteria
- Password hash changes only after correct current password.
- Wrong current password never updates DB.
- No plaintext password/token logging.

## Phase 3 - Error Constants and Messages

### Planned Updates
- Add new auth error codes/messages in:
  - `backend/src/constants/errors/auth/codes.ts`
  - `backend/src/constants/errors/auth/messages.ts`

### Proposed Additions
- `AUTH_CHANGE_PASSWORD_INVALID_INPUT`
- `AUTH_CHANGE_PASSWORD_WRONG_CURRENT_PASSWORD`
- `AUTH_CHANGE_PASSWORD_SAME_AS_CURRENT`
- `AUTH_CHANGE_PASSWORD_SUCCESS`

### Proposed Field Messages
- `CURRENT_PASSWORD_REQUIRED`
- `NEW_PASSWORD_REQUIRED`
- Reuse existing password strength messages where possible to avoid duplication.

### Exit Criteria
- Error naming is deterministic and consistent with existing auth constants.

## Phase 4 - Documentation and Postman Alignment

### Docs Update Plan
- Update `backend/docs/API_Document.md` section 1.4 to match runtime envelope exactly:
  - success contains `success/data/error/meta`
  - failure contains `error.details.formErrors/fieldErrors`
- Ensure final error code naming in docs matches implementation constants.

### Postman Update Plan
Target file:
- `backend/docs/postman/dacn-backend-test-cases.postman_collection.json`

Add under `Auth` folder:
1. Change Password - Success
2. Change Password - Missing currentPassword
3. Change Password - Missing newPassword
4. Change Password - Weak newPassword
5. Change Password - Wrong currentPassword
6. Change Password - New password equals current password
7. Change Password - Missing bearer token
8. Change Password - Invalid bearer token
9. Change Password - old refresh token fails on `/auth/refresh-token`
10. Change Password - re-login required for new refresh flow

### Exit Criteria
- API docs and Postman tests match implemented behavior and constants.

## Phase 5 - Verification Checklist

### Build and Runtime Checks
1. `pnpm build` passes.
2. Success request returns `200` with `data.message` and standard envelope.
3. Old password fails login after change.
4. New password succeeds login after change.
5. Old refresh tokens fail after password change (`401` on `/auth/refresh-token`).
6. Error payloads follow details convention:
   - validation errors -> `fieldErrors`
   - auth/business errors -> `formErrors`

### Data Integrity Checks
1. Password stored as hash (never plaintext).
2. Only target account password is updated.
3. Refresh token revocation behavior matches chosen policy.

## Definition of Done
- Endpoint is mounted and protected by `requireAuth`.
- Validation, service logic, and error mapping are complete.
- Docs and Postman are aligned with runtime behavior.
- Task can be checked off in `backend/docs/TASKS.md` after verification.
