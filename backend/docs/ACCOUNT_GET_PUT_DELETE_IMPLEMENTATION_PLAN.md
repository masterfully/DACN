# Account Endpoint Implementation Plan (Get Me + Get Detail + Update + Delete)

## Scope
Implement remaining Member 1 Step 2 account endpoints:
- GET /api/accounts/me
- GET /api/accounts/:accountId
- PUT /api/accounts/:accountId
- DELETE /api/accounts/:accountId

## Source of Truth Used
- backend/docs/TASKS.md (Member 1, Step 2)
- backend/docs/API_Document.md (Account 2.3, 2.4, 2.5, 2.6)
- skills/backend-coder-skill.md
- Existing account implementation files:
  - backend/src/routes/accountRoute.ts
  - backend/src/controllers/accountController.ts
  - backend/src/services/accountService.ts
  - backend/src/constants/errors/account/codes.ts
  - backend/src/constants/errors/account/messages.ts

## Current Codebase Snapshot (2026-04-01)
- Already implemented:
  - GET /api/accounts (ADMIN)
  - POST /api/accounts (ADMIN)
- Not implemented:
  - GET /api/accounts/me
  - GET /api/accounts/:accountId
  - PUT /api/accounts/:accountId
  - DELETE /api/accounts/:accountId
- accountRoute currently contains only `/` GET and `/` POST.
- accountController currently contains only getAccountsHandler and createAccountHandler.
- accountService currently contains only getAccounts and createAccount.
- Postman collection Accounts folder currently covers list/create only.

Implication:
- Add 4 endpoints in the same account module and preserve route ordering (`/me` before `/:accountId`).

## Goal
Deliver complete account management for Step 2 with:
- proper auth/role guards
- deterministic validation and error mapping
- consistent response envelope and profile projection
- Postman import cases for success and negative scenarios

## Convention Alignment
- API base path under /api/*
- 3-layer structure: route -> controller -> service
- Zod validation for params/body/query
- Error details convention:
  - validation errors -> error.details.fieldErrors
  - auth/business errors -> error.details.formErrors
- Status policy:
  - 200 for GET/PUT/DELETE success
  - 400 validation
  - 401 unauthorized
  - 403 forbidden
  - 404 not found
  - 409 conflict
  - 500 unexpected

## Phase 0 - Contract Lock

### Endpoint Contracts
1. GET /api/accounts/me
- Auth: required
- Role: any authenticated account
- Response: current account with profile projection

2. GET /api/accounts/:accountId
- Auth: required
- Role: ADMIN
- Params: accountId integer > 0
- Response: account detail with profile projection

3. PUT /api/accounts/:accountId
- Auth: required
- Role: ADMIN
- Params: accountId integer > 0
- Body:
  - username (optional)
  - role (optional; enum ADMIN/LECTURER/STUDENT/PARENT)
- Rule: at least one updatable field must be provided

4. DELETE /api/accounts/:accountId
- Auth: required
- Role: ADMIN
- Params: accountId integer > 0
- Rule: hard-delete account (plus cascade if schema configured) or explicit guarded delete if needed

### Response Shape (target)
- Success: `success: true`, `data`, `error: null`, `meta: null`
- Error: `success: false`, `data: null`, `error`, `meta: null`

### Lock Decisions
1. Keep PUT body field name as `role` (not `roles`) to match current code and examples.
2. GET /me must be registered before `/:accountId`.
3. Return 404 for missing account in detail/update/delete.

## Phase 1 - API Surface (Route + Controller)

### Planned Files
- Update backend/src/routes/accountRoute.ts
- Update backend/src/controllers/accountController.ts
- Update backend/src/constants/errors/account/codes.ts
- Update backend/src/constants/errors/account/messages.ts

### Route Plan
Add routes in this order:
1. GET `/me` -> requireAuth
2. GET `/:accountId` -> requireAuth + requireRole("ADMIN")
3. PUT `/:accountId` -> requireAuth + requireRole("ADMIN")
4. DELETE `/:accountId` -> requireAuth + requireRole("ADMIN")

Route ordering requirement:
- `/me` must be registered before `/:accountId` to avoid Express dynamic match collisions.

### Controller Plan
Add handlers:
- getMyAccountHandler
- getAccountDetailHandler
- updateAccountHandler
- deleteAccountHandler

Validation schemas:
- accountId param schema: positive integer
- update body schema:
  - username optional trimmed string max 255
  - role optional enum
  - refine: body must contain at least one of username/role

## Phase 2 - Service Layer Design

### Planned File
- Update backend/src/services/accountService.ts

### New Service Interfaces
- GetMyAccountInput
  - accountId: number
- GetAccountDetailInput
  - accountId: number
- UpdateAccountInput
  - accountId: number
  - username?: string
  - role?: RoleEnum
- DeleteAccountInput
  - accountId: number

### Shared Projection
Use the same account projection pattern as existing list/create responses:
- accountId, username, email, role
- profile:
  - profileId, fullName, avatar, status
  - null if account has no profile

### Service Flows

#### A) getMyAccount
1. Query account by authenticated accountId.
2. If not found -> throw ACCOUNT_NOT_FOUND (404).
3. Return mapped account projection.

#### B) getAccountById
1. Query by param accountId.
2. If not found -> throw ACCOUNT_NOT_FOUND (404).
3. Return mapped projection.

#### C) updateAccount
1. Normalize optional username (trim).
2. Check target account exists.
3. If username provided, enforce uniqueness.
4. Update allowed fields only (username, role).
5. Return updated projection.
6. Map conflicts to 409 (username exists).

#### D) deleteAccount
1. Check target account exists.
2. Optional safeguard (recommended): block deleting own admin account if business wants.
3. Delete account.
4. Return `data: null`.

## Phase 3 - Error Mapping and Constants

### Add Codes
- ACCOUNT_DETAIL_INVALID_PARAMS
- ACCOUNT_DETAIL_NOT_FOUND
- ACCOUNT_ME_NOT_FOUND
- ACCOUNT_UPDATE_INVALID_PARAMS
- ACCOUNT_UPDATE_INVALID_INPUT
- ACCOUNT_UPDATE_NOT_FOUND
- ACCOUNT_UPDATE_USERNAME_EXISTS
- ACCOUNT_DELETE_INVALID_PARAMS
- ACCOUNT_DELETE_NOT_FOUND

Optional business guard code:
- ACCOUNT_DELETE_SELF_FORBIDDEN

### Add Messages
Vietnamese messages aligned with existing account constants style.

### Status Mapping
- Invalid params/input -> 400
- Not found -> 404
- Duplicate username -> 409
- Unauthorized -> 401 (from middleware)
- Forbidden role -> 403 (from middleware)

## Phase 4 - Verification Plan

### GET /api/accounts/me
1. Success with valid token -> 200
2. Missing token -> 401
3. Invalid token -> 401
4. Authenticated account not found (edge) -> 404

### GET /api/accounts/:accountId
1. Success ADMIN -> 200
2. Invalid accountId (abc/0/-1) -> 400
3. Not found -> 404
4. STUDENT token -> 403
5. Missing token -> 401

### PUT /api/accounts/:accountId
1. Success update username -> 200
2. Success update role -> 200
3. Success update both -> 200
4. Empty body -> 400
5. Invalid role -> 400
6. Invalid accountId -> 400
7. Duplicate username -> 409
8. Not found -> 404
9. STUDENT token -> 403
10. Missing token -> 401

### DELETE /api/accounts/:accountId
1. Success ADMIN -> 200 with `data: null`
2. Invalid accountId -> 400
3. Not found -> 404
4. STUDENT token -> 403
5. Missing token -> 401

## Phase 5 - Postman Import Rollout

### Target File
- backend/docs/postman/dacn-backend-test-cases.postman_collection.json

### Placement Strategy
- Add these cases under existing `Accounts` folder.
- Keep naming pattern: `<Endpoint> - <Scenario>`.
- Keep Authorization header variable-based (`{{admin_token}}`, `{{student_token}}`).

### Variables To Add (if not already present)
- `account_detail_id`
- `account_update_id`
- `account_delete_id`
- `account_updated_username`

Suggested defaults:
- account_detail_id: 2
- account_update_id: 2
- account_delete_id: 0 (set dynamically per environment)
- account_updated_username: account_updated_{{$timestamp}}

### Import Cases To Add

#### A) GET /api/accounts/me
1. Get My Account - Success
- GET {{base_url}}/api/accounts/me
- Authorization: Bearer {{admin_token}}
- Expect: 200, data.accountId exists

2. Get My Account - Missing token
- No Authorization header
- Expect: 401, error.code UNAUTHORIZED

3. Get My Account - Invalid token
- Authorization: Bearer invalid.token
- Expect: 401, error.code UNAUTHORIZED

#### B) GET /api/accounts/:accountId
4. Get Account Detail - Success (ADMIN)
- GET {{base_url}}/api/accounts/{{account_detail_id}}
- Authorization: Bearer {{admin_token}}
- Expect: 200

5. Get Account Detail - Invalid accountId
- GET {{base_url}}/api/accounts/abc
- Authorization: Bearer {{admin_token}}
- Expect: 400

6. Get Account Detail - Not found
- GET {{base_url}}/api/accounts/999999
- Authorization: Bearer {{admin_token}}
- Expect: 404

7. Get Account Detail - Forbidden (STUDENT)
- GET {{base_url}}/api/accounts/{{account_detail_id}}
- Authorization: Bearer {{student_token}}
- Expect: 403

#### C) PUT /api/accounts/:accountId
8. Update Account - Success (username)
- PUT {{base_url}}/api/accounts/{{account_update_id}}
- Body: { "username": "{{account_updated_username}}" }
- Authorization: Bearer {{admin_token}}
- Expect: 200

9. Update Account - Success (role)
- PUT {{base_url}}/api/accounts/{{account_update_id}}
- Body: { "role": "LECTURER" }
- Authorization: Bearer {{admin_token}}
- Expect: 200

10. Update Account - Empty body
- PUT with {}
- Expect: 400

11. Update Account - Invalid role
- Body: { "role": "SUPER_ADMIN" }
- Expect: 400

12. Update Account - Duplicate username
- Body uses existing username
- Expect: 409

13. Update Account - Not found
- PUT /api/accounts/999999
- Expect: 404

14. Update Account - Forbidden (STUDENT)
- Authorization: Bearer {{student_token}}
- Expect: 403

#### D) DELETE /api/accounts/:accountId
15. Delete Account - Success (ADMIN)
- DELETE {{base_url}}/api/accounts/{{account_delete_id}}
- Authorization: Bearer {{admin_token}}
- Expect: 200, data = null

16. Delete Account - Invalid accountId
- DELETE /api/accounts/abc
- Expect: 400

17. Delete Account - Not found
- DELETE /api/accounts/999999
- Expect: 404

18. Delete Account - Forbidden (STUDENT)
- Authorization: Bearer {{student_token}}
- Expect: 403

19. Delete Account - Missing token
- No Authorization header
- Expect: 401

### Postman Execution Order
1. Get My Account - Success
2. Get Account Detail - Success
3. Update Account - Success (username/role)
4. Verify with Get Account Detail
5. Run negative update/detail cases
6. Run delete success on disposable account only
7. Run delete negative cases

### Postman Validation Checklist
- Collection JSON is valid after import.
- Requests are under Accounts folder.
- Authorization and URL placeholders resolve correctly.
- Expected status and error codes match implementation constants.

## Phase 6 - Documentation and Task Closure

### Docs Updates
- Update backend/docs/API_Document.md examples if runtime envelope differs:
  - include `error: null` and `meta: null` for success
  - include `data: null` and `error.details` for error
- Ensure update body field naming is consistently `role` (not `roles`).

### Task Closure
After implementation and verification, mark these items done in backend/docs/TASKS.md:
- GET /api/accounts/me
- GET /api/accounts/:accountId
- PUT /api/accounts/:accountId
- DELETE /api/accounts/:accountId

## Definition of Done
- All 4 endpoints implemented and mounted with correct guards.
- `/me` route registered before `/:accountId`.
- Params/body validation and error mapping are complete.
- Postman cases are added and verified.
- TASKS.md and API docs are aligned with runtime behavior.