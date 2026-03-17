# Register Endpoint Implementation Plan

## Scope
Implement POST /api/auth/register for public student self-signup in Member 1 Auth module.

## Source of Truth Used
- API contract from API_Document.md (Auth 1.5 Register)
- Backend conventions from backend-coder-skill.md

## Goal
Build a secure register flow that:
- Creates Account with role STUDENT only
- Creates corresponding UserProfile
- Uses Account.Email as the only auth identity email (unique)
- Returns accessToken and refreshToken
- Persists refresh token with expiry
- Uses standard response envelope and status code policy

## Phase 0 - Contract Lock and Preconditions

### Objective
Freeze the contract and conventions before coding to avoid drift.

### Inputs
- API_Document.md (Auth 1.5 Register)
- backend-coder-skill.md conventions

### Checklist
- Confirm endpoint: POST /api/auth/register, public access
- Confirm request body fields: fullName, username, email, password, confirmPassword
- Confirm response envelope and status codes: 201, 400, 409, 500
- Confirm business rule: role must always be STUDENT for this endpoint
- Confirm data model decision: `Account.Email` is required + unique and is source of truth
- Record known API inconsistency: register success sample currently shows ADMIN role

### Exit Criteria
- Team agrees on contract and error codes
- Role policy (STUDENT-only) is explicitly locked

## API Contract (Target)
- Method: POST
- Path: /api/auth/register
- Auth required: No
- Request body:
  - fullName (string, required)
  - username (string, required)
  - email (string, required)
  - password (string, required)
  - confirmPassword (string, required, must equal password)
- Success response: 201, success=true, data includes accessToken, refreshToken, account + profile
- Error response: 400, 409, 500 with structured error object

## Data Model Decision (Locked)
- Store auth identity email in `Account.Email` only (required + unique)
- Do not use `UserProfile.Email` for auth identity or uniqueness checks
- Remove `UserProfile.Email` from schema after data migration

## Important Consistency Note
API_Document register example currently shows account.role as ADMIN in success sample. This conflicts with register business rule (STUDENT only). Implementation must enforce STUDENT. Update API sample to STUDENT after endpoint is finished.

## Phase 1 - API Surface (Route + Controller + Validation)

### Objective
Expose the endpoint and enforce strict request validation.

### Architecture
Use 3-layer pattern route -> controller -> service.

Planned files:
- src/routes/authRoute.ts
- src/controllers/authController.ts
- src/services/authService.ts

Likely supporting updates:
- src/routes/index.ts (mount auth router)
- src/index.ts (if not yet mounted under /api)
- src/utils/response.ts (reuse existing formatter)
- src/middleware/errorHandler.ts (reuse global error mapping)

### Validation Design (Zod)
Create register schema in controller or a dedicated schema block:
- fullName: non-empty string, trim, reasonable max length
- username: non-empty string, trim
- email: valid email
- password:
  - min 8 chars
  - at least 1 uppercase
  - at least 1 number
  - at least 1 special char
- confirmPassword: required string
- refine rule: confirmPassword === password

Validation failures:
- Return 400
- Include clear message from zod parse failure

### Controller Responsibilities
- Parse and validate body with zod
- Call authService.register
- Return 201 with standard success envelope
- Do not expose internal prisma errors

### Route Responsibilities
- Register POST /register route
- No requireAuth middleware on this route
- Ensure route registration does not break static-before-dynamic ordering (future-safe)

### Exit Criteria
- Request payload is validated end-to-end
- Controller returns standardized 201 success response shape
- Invalid payloads return structured 400

## Phase 2 - Business Logic and Persistence

### Objective
Implement secure register business logic and transactional persistence.

### Service Flow
1. Normalize input
- Trim username/email/fullName
- Lowercase email for uniqueness consistency

2. Check uniqueness
- Check existing account by username
- Check existing account by email
- If duplicate, throw conflict error 409 with stable code:
  - USERNAME_EXISTED or EMAIL_EXISTED

3. Hash password
- bcrypt hash with salt rounds >= 10

4. Transactional create
- Use prisma.$transaction to avoid partial writes:
  - Create Account with role STUDENT and unique email
  - Create UserProfile linked to Account

5. Token generation
- Generate access token and refresh token (JWT)
- Include accountId and role in payload
- Use separate expiries for access and refresh

6. Persist refresh token
- Save refresh token record with expiry in DB
- Keep only required fields (token, accountId, expiresAt, revoked flag if model supports)

7. Return payload
- accessToken
- refreshToken
- account object with profile projection

### Exit Criteria
- Account and profile are created atomically
- Password is hashed with bcrypt (>= 10 rounds)
- Access and refresh tokens are generated
- Refresh token is persisted with expiry
- Response payload includes tokens + account/profile data

## Phase 3 - Error Handling and Security Hardening

### Objective
Standardize failure behavior and enforce security baseline.

### Error Mapping
Use structured domain errors and map to standard envelope.

Recommended error codes:
- VALIDATION_ERROR -> 400
- PASSWORD_CONFIRM_MISMATCH -> 400
- USERNAME_EXISTED -> 409
- EMAIL_EXISTED -> 409
- INTERNAL_SERVER_ERROR -> 500

Response shape on failure:
- success: false
- data: null
- error: { code, message }
- meta: null

### Security Checklist
- Never accept role from client in register
- Force role STUDENT in service layer
- Never log plaintext password or raw refresh token
- Ensure JWT secrets and expiries are from environment config
- Keep refresh token rotation compatible with refresh endpoint design
- Ensure no code path reads/writes `UserProfile.Email`

### Exit Criteria
- Duplicate username/email cases return deterministic 409
- Sensitive values are not leaked to logs/responses
- Role injection attempts are ignored or rejected

## Phase 4 - Verification and Testing

### Objective
Verify functional behavior, failures, and security properties.

### Test Plan
Functional success:
- Register with valid body returns 201 and token pair
- Created account role is STUDENT
- Created account has normalized unique email in `Account.Email`
- UserProfile is linked to new account

Validation failures (400):
- Missing fields
- Invalid email format
- Weak password pattern
- confirmPassword mismatch

Conflict failures (409):
- Duplicate username
- Duplicate email

Security checks:
- Request role injection is ignored/rejected
- Password stored hashed, not plaintext
- Route works without Authorization header

Data consistency:
- If profile create fails, account is not left orphaned (transaction verified)

### Exit Criteria
- All success and failure paths pass
- Transaction rollback behavior is confirmed
- Endpoint behavior matches contract and conventions

## Phase 5 - Documentation and Rollout

### Objective
Finalize docs and prepare for future-compatible API evolution.

### Documentation Tasks
- Update API_Document register success sample role from ADMIN to STUDENT
- Keep request/response examples aligned with implementation
- Update API docs for profile/student/lecturer responses to expose email from account join

### Schema Migration Tasks
- Add `Email String @unique @db.VarChar(255)` to `Account`
- Backfill `Account.Email` from existing `UserProfile.Email`
- Add migration checks for duplicate/null emails before applying unique constraint
- Remove `Email` field from `UserProfile`
- Regenerate Prisma client and update service queries

### Forward Compatibility (Parent Registration)
When parent registration is added later, avoid role input in body. Prefer explicit routes:
- POST /api/auth/register/student
- POST /api/auth/register/parent

Migration strategy:
- Keep POST /api/auth/register as alias to student temporarily
- Mark alias as deprecated in docs
- Remove alias after client migration window

### Exit Criteria
- API docs reflect actual behavior
- Deprecation/migration notes are published for clients

## Definition of Done
- Endpoint matches API contract and conventions
- Response envelope is consistent with project standard
- Role is always STUDENT for public register
- Email uniqueness is enforced at `Account.Email`
- Tokens issued and refresh token persisted with expiry
- Error cases are deterministic and documented
- API document updated to remove role inconsistency in register example

## Actual Result (2026-03-17)

### Implementation Status
- Completed: `POST /api/auth/register` is implemented with route -> controller -> service architecture
- Completed: request validation includes `fullName`, `username`, `email`, `password`, `confirmPassword`
- Completed: business rule is enforced in service layer (`role = STUDENT` only)
- Completed: register returns `accessToken`, `refreshToken`, and account/profile payload
- Completed: refresh token is persisted with expiry in database
- Completed: auth identity email is stored in `Account.Email` (unique), and `UserProfile.Email` was removed from schema

### Verified Behavior
- Success path: returns `201` with standard envelope and token pair
- Validation failures: returns `400` with structured `error.details`
- Conflict failures (duplicate username/email): returns `409` with deterministic error codes and field-level `details.fieldErrors`
- Internal failure path: mapped to `500` with standard error envelope

### Documentation Alignment
- Updated: register response sample role is `STUDENT`
- Updated: global API error shape documents `details` object (`formErrors`, `fieldErrors`)
- Updated: error examples include `data: null` and `meta: null` for failure responses
