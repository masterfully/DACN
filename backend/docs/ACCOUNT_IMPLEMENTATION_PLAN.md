# Account Module Implementation Plan (Get List + Create)

## Scope
Implement Member 1 - Step 2 (partial):
- `GET /api/accounts` (paginated account list with filters)
- `POST /api/accounts` (admin creates account)

## Source of Truth Used
- `backend/docs/TASKS.md`
- `backend/docs/API_Document.md` (Section 2.1 and 2.2)
- `skills/backend-coder-skill.md`
- Current backend implementation patterns in auth/room/subject modules

## Current Codebase Snapshot (2026-03-19)
- `auth` module is implemented with route -> controller -> service architecture.
- Standard response envelope exists and includes `error.details`.
- Auth guards `requireAuth` and `requireRole` already exist.
- Account module files are currently empty:
  - `src/routes/userRoute.ts`
  - `src/controllers/userController.ts`
  - `src/services/userService.ts`
- API router does not yet mount `/accounts`.
- Existing error constants are module-scoped (`auth`, `room`, `section`, `subject`), no `account` constants yet.

## Goal
Deliver two admin-only endpoints aligned with contract and current conventions:
1. `GET /api/accounts` returns list + `meta` pagination.
2. `POST /api/accounts` creates account with hashed password and deterministic conflict errors.

## Contract Summary (Target)

### 1) GET /api/accounts
- Auth: required
- Role: `ADMIN`
- Query params:
  - `page` (default `1`)
  - `limit` (default `10`)
  - `search` (username/email)
  - `role` filter (single canonical key)
  - `status` (profile status)
- Success: `200`
- Response data item:
  - `accountId`, `username`, `email`, `role`
  - `profile`: `{ profileId, fullName, avatar, status } | null`
- Meta: `{ page, limit, total }`

### 2) POST /api/accounts
- Auth: required
- Role: `ADMIN`
- Body:
  - `username` (required)
  - `email` (required)
  - `password` (required, strong password rules)
  - `role` (required)
- Success: `201`
- Response data:
  - `accountId`, `username`, `email`, `role`, `profile: null`
- Errors:
  - `400` validation
  - `409` duplicate username/email

## Phase 0 - Contract Lock (Required Before Coding)

### Objective
Resolve mismatches to avoid implementation rework.

### Mismatch A: Role enum in docs vs schema
- Docs for create account mention `PARENT`.
- Prisma `RoleEnum` currently has only `ADMIN | LECTURER | STUDENT`.

Decision:
- Support `PARENT` now.
- Add `PARENT` to Prisma `RoleEnum` and keep it in the initial migration baseline (do not introduce a separate follow-up migration for this enum change).
- Regenerate Prisma client before implementing `POST /api/accounts`.

### Mismatch B: Query parameter naming
- Account list table uses `roles`.
- Account list sample URL uses `role`.

Current requirement and decision:
- Canonical and only supported query key is `role`.
- `roles` is treated as invalid input and must return `400` validation error.

### Mismatch C: File naming
- Workspace has `userRoute/userController/userService` placeholders.
- Endpoint namespace is `/accounts`.

### Exit Criteria
- Enum and query param naming decisions are locked.
- Account module is implemented using new `account*` files (confirmed).

## Phase 1 - Module Scaffolding

### Objective
Create Account module skeleton aligned with current architecture.

### Planned Files
- `src/routes/accountRoute.ts`
- `src/controllers/accountController.ts`
- `src/services/accountService.ts`
- `src/constants/errors/account/codes.ts`
- `src/constants/errors/account/messages.ts`
- `src/routes/index.ts` (mount `/accounts`)

### Route Registration
- Add `router.use("/accounts", accountRouter)` in API router.
- For this phase (only list/create), no dynamic `/:accountId` route yet.

## Phase 2 - GET /api/accounts Implementation

### Objective
Deliver paginated account list with optional search/filter.

### Validation (Zod)
- `page`: positive integer, default `1`
- `limit`: integer range (recommended `1..100`), default `10`
- `search`: optional trimmed string
- role filter: optional enum from `role` only
- `status`: optional string/enum (`ACTIVE`, `INACTIVE`, `BANNED`)

### Service Query Design (Prisma)
- Build `where` dynamically:
  - Search:
    - `Account.Username` contains `search`, case-insensitive
    - OR `Account.Email` contains `search`, case-insensitive
  - Role filter on `Account.Role`
  - Status filter behavior:
    - If `status` is provided, include accounts where `profile.Status = status`
    - Also include accounts with `profile = null` (confirmed requirement: do not exclude no-profile accounts)
- Execute list + total in one transaction:
  - `findMany` with `skip/take/orderBy`
  - `count` with same `where`
- Include profile projection:
  - `ProfileID`, `FullName`, `Avatar`, `Status`

### Mapping
Convert DB fields to API shape:
- `AccountID -> accountId`
- `Username -> username`
- `Email -> email`
- `Role -> role`
- `profile` mapped to camelCase or `null`

### Success Response
- Status `200`
- `sendSuccess(res, data, 200, { page, limit, total })`

### Error Handling
- `400` for invalid query params
- `500` unexpected errors through global handler

Specific query validation rule:
- Reject `roles` query key with `400` and a descriptive validation message to keep API contract strict.

## Phase 3 - POST /api/accounts Implementation

### Objective
Allow admin to create account with secure password handling.

### Validation (Zod)
- `username`: required, trimmed, max 255
- `email`: required, valid email, max 255
- `password`: required, min 8, 1 uppercase, 1 number, 1 special
- `role`: required enum `ADMIN | LECTURER | STUDENT | PARENT`

### Service Flow
1. Normalize fields (`trim`, lowercase email).
2. Pre-check existing account by username/email (optional but good UX).
3. Hash password with `bcrypt` salt rounds `10`.
4. Create account row in DB.
5. Return projection without password.

### Conflict Handling
- Catch Prisma `P2002` and map to `409`:
  - username unique conflict
  - email unique conflict
- Return stable account-specific error codes/messages.

### Success Response
- Status `201`
- Payload:
  - `accountId`, `username`, `email`, `role`, `profile: null`

## Phase 4 - Authorization and Middleware Wiring

### Objective
Enforce admin-only access consistently.

### Route Middleware
- `requireAuth`
- `requireRole("ADMIN")`

### Security Notes
- Never return password hash.
- Never accept unknown fields silently (strict Zod schema).
- Keep response envelope consistent: `success/data/error/meta`.

## Phase 5 - Verification and Test Plan

### GET /api/accounts
- Success:
  - default pagination
  - search by username
  - search by email
  - role filter
  - status filter
- Auth:
  - no token -> `401`
  - non-admin token -> `403`
- Validation:
  - invalid page/limit -> `400`

### POST /api/accounts
- Success:
  - create `LECTURER`
  - create `STUDENT`
- Validation:
  - missing username/email/password/role -> `400`
  - weak password -> `400`
  - invalid role -> `400`
- Conflict:
  - duplicate username -> `409`
  - duplicate email -> `409`

### Data Integrity Checks
- Confirm DB stores hashed password only.
- Confirm created account has no profile by default (`profile: null`).

## Definition of Done
- `/api/accounts` GET + POST are implemented, mounted, and role-protected.
- Validation is done with Zod.
- Error mapping and envelope follow current project format.
- Pagination `meta` is returned for list endpoint.
- Postman test cases for both endpoints are added and passing.

## Confirmations Needed
All initial confirmations are resolved:
1. `POST /api/accounts` supports `PARENT`.
2. Canonical and only filter key is `role`; `roles` is rejected with `400`.
3. When `status` is provided, accounts without profile are still included.

Migration policy lock:
- `PARENT` must be present in the Prisma initial migration baseline.
