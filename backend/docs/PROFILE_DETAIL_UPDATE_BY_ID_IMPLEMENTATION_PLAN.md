# Profile Detail + Update By ID Implementation Plan

## Scope
Implement the remaining Step 3 profile endpoints:
- GET /api/profiles/:profileId (ADMIN or owner)
- PUT /api/profiles/:profileId (ADMIN or owner)

This plan also includes Postman case additions in the existing collection:
- backend/docs/postman/dacn-backend-test-cases.postman_collection.json

## Source Documents Reviewed
- backend/docs/TASKS.md (Step 3 pending profile-by-id items)
- backend/docs/API_Document.md (sections 3.3 and 3.4)
- backend/src/routes/profileRoute.ts
- backend/src/controllers/profileController.ts
- backend/src/services/profileService.ts
- backend/src/constants/errors/profile/codes.ts
- backend/src/constants/errors/profile/messages.ts
- backend/docs/PROFILE_ME_PUT_IMPLEMENTATION_PLAN.md

## Current Snapshot (2026-04-02)
Already implemented:
- GET /api/profiles
- POST /api/profiles
- GET /api/profiles/me
- PUT /api/profiles/me
- GET /api/profiles/students
- GET /api/profiles/lecturers

Not implemented:
- GET /api/profiles/:profileId
- PUT /api/profiles/:profileId

Important constraints from current codebase:
- Response envelope must stay: success, data, error, meta.
- Profile payload maps email from Account.Email.
- Soft-deleted accounts must be treated as not found (account.IsDeleted = false filter).
- Static profile routes must stay before dynamic routes.

## Confirmed Decisions (2026-04-02)
1. PUT /api/profiles/:profileId must keep email forbidden (no write to Account.Email).
2. status is editable by ADMIN only in PUT /api/profiles/:profileId.
3. Request field naming is standardized to avatar (singular).
4. Current runtime behavior note:
  - avatar is recognized.
  - avatars is not part of schema and is ignored by parsing unless explicit forbidden-field checks are added.

## Functional Contract

### 1) GET /api/profiles/:profileId
- Auth: required.
- Access: ADMIN or profile owner.
- Owner definition: req.user.accountId equals target profile AccountID.
- Param validation: profileId is positive integer.
- Success: 200 with full profile projection.
- Failure:
  - 400 invalid profileId.
  - 401 unauthenticated.
  - 403 authenticated but not ADMIN and not owner.
  - 404 profile not found (or linked account soft-deleted).

### 2) PUT /api/profiles/:profileId
- Auth: required.
- Access: ADMIN or profile owner.
- Param validation: profileId is positive integer.
- Body validation: allow only approved updatable fields by actor role.
- Success: 200 with updated profile projection.
- Failure:
  - 400 invalid profileId/body.
  - 401 unauthenticated.
  - 403 authenticated but not ADMIN and not owner.
  - 404 profile not found (or linked account soft-deleted).
  - 409 conflict if uniqueness/business constraints are introduced later.

## Implementation Phases

## Phase 1 - Error Constants
Update profile error constants to cover new flows.

Files:
- backend/src/constants/errors/profile/codes.ts
- backend/src/constants/errors/profile/messages.ts

Add codes/messages for:
- PROFILE_DETAIL_INVALID_PARAMS
- PROFILE_DETAIL_NOT_FOUND
- PROFILE_DETAIL_FORBIDDEN
- PROFILE_UPDATE_BY_ID_INVALID_PARAMS
- PROFILE_UPDATE_BY_ID_INVALID_INPUT
- PROFILE_UPDATE_BY_ID_NOT_FOUND
- PROFILE_UPDATE_BY_ID_FORBIDDEN
- PROFILE_UPDATE_BY_ID_FORBIDDEN_FIELD
- PROFILE_UPDATE_BY_ID_EMPTY_BODY

Error detail convention:
- Validation errors -> details.fieldErrors.
- Business/auth errors -> details.formErrors.

## Phase 2 - Service Layer
Extend profile service with owner-aware detail and update methods.

File:
- backend/src/services/profileService.ts

### New service methods
1. getProfileDetailById(profileId: number, actor: { accountId: number; role: RoleEnum })
2. updateProfileById(profileId: number, actor: { accountId: number; role: RoleEnum }, input: UpdateProfileByIdInput)

### Service algorithm
1. Query target profile with account relation and account.IsDeleted = false.
2. If not found -> 404.
3. Authorization check:
   - Allow if actor.role is ADMIN.
   - Else allow only when actor.accountId equals target AccountID.
   - Else 403.
4. For PUT: build update payload from allowed fields only.
5. Persist and return mapped profile (same projection contract as existing endpoints).

## Phase 3 - Controller Layer
Add dedicated handlers for :profileId endpoints with strict validation.

File:
- backend/src/controllers/profileController.ts

### Add schemas
- profileId param schema: coerce int, positive.
- update body schema with optional allowed fields + refine at least one field.

### New handlers
1. getProfileDetailHandler
2. updateProfileByIdHandler

Controller responsibilities:
- Parse params/body with parseOrThrow.
- Build actor from req.user.
- Call service methods.
- Return standardized success envelope.

## Phase 4 - Route Layer
Register dynamic routes after all static routes.

File:
- backend/src/routes/profileRoute.ts

Add:
- GET /:profileId -> requireAuth -> getProfileDetailHandler
- PUT /:profileId -> requireAuth -> updateProfileByIdHandler

Route order must remain:
1. /
2. /me
3. /students
4. /lecturers
5. /:profileId

## Phase 5 - Validation + Field Policy
Use one clear field policy for PUT /:profileId.

Locked behavior:
- Allowed for owner:
  - fullName
  - phoneNumber
  - dateOfBirth
  - gender
  - avatar
  - citizenId
  - hometown
- Additional field allowed for ADMIN only:
  - status
- Forbidden for owner:
  - email
  - status
  - role
  - accountId
  - profileId
- Forbidden for ADMIN too:
  - email
  - role
  - accountId
  - profileId

Naming policy:
- Accept avatar (singular) in request body.
- Treat avatars (plural) as legacy/incorrect naming in API docs and examples.

Important API doc mismatch to resolve during implementation:
- API_Document currently mentions avatars/email for update; implementation contract is avatar and email is not updatable via profile update.

## Phase 6 - Postman Additions
Add cases under folder: User Profiles.

Target file:
- backend/docs/postman/dacn-backend-test-cases.postman_collection.json

### Variables to add
- profile_detail_id
- profile_update_id
- my_profile_id
- another_profile_id

### Setup requests (recommended)
1. User Profiles > Setup - Capture My Profile ID
- GET {{base_url}}/api/profiles/me
- Token: {{student_token}} (or owner token)
- Tests: save response.data.profileId -> my_profile_id

2. User Profiles > Setup - Capture Another Profile ID
- GET {{base_url}}/api/profiles/students?page=1&limit=10
- Token: {{admin_token}}
- Tests: pick profileId different from my_profile_id -> another_profile_id

### GET /api/profiles/:profileId cases
1. Get Profile Detail By ID - Success (ADMIN)
2. Get Profile Detail By ID - Success (Owner)
3. Get Profile Detail By ID - Forbidden (Non-owner non-admin)
4. Get Profile Detail By ID - Invalid profileId
5. Get Profile Detail By ID - Not Found
6. Get Profile Detail By ID - Missing token

### PUT /api/profiles/:profileId cases
1. Update Profile By ID - Success (Owner, allowed fields)
2. Update Profile By ID - Success (ADMIN updates status)
3. Update Profile By ID - Empty body (400)
4. Update Profile By ID - Forbidden field (email)
5. Update Profile By ID - Forbidden field (status by owner)
6. Update Profile By ID - Invalid date format
7. Update Profile By ID - Invalid gender
8. Update Profile By ID - Forbidden (Non-owner non-admin)
9. Update Profile By ID - Invalid profileId
10. Update Profile By ID - Not Found
11. Update Profile By ID - Missing token
12. Update Profile By ID - Legacy field avatars (should not update Avatar)

### Expected assertions in Postman tests
- Success: status 200, success=true, data.profileId exists.
- Validation fail: status 400, error.details.fieldErrors populated.
- Forbidden: status 403, error.details.formErrors populated.
- Not found: status 404.
- Unauthorized: status 401.

## Phase 7 - Documentation + Task Updates
After implementation:
- Update backend/docs/API_Document.md sections 3.3 and 3.4 to match runtime fields and response envelope.
- Mark Step 3 items done in backend/docs/TASKS.md:
  - GET /api/profiles/:profileId
  - PUT /api/profiles/:profileId

## Definition of Done
- Both endpoints implemented and reachable.
- Owner-or-admin authorization works correctly.
- Soft-deleted account profiles are not returned.
- Validation and error details follow project convention.
- Postman includes success + failure cases for both endpoints.
- API docs and TASKS are aligned with actual behavior.
