# UserProfile Implementation Plan

## 1. Objective

Implement and document the UserProfile module endpoints below, aligned with current backend conventions and your confirmed decisions:

- `GET /api/profiles` (Get profile list)
- `POST /api/profiles` (Create profile)
- `GET /api/profiles/me` (Get my profile)
- `GET /api/profiles/students` (Get student list)
- `GET /api/profiles/lecturers` (Get lecturer list)

## 2. Confirmed Decisions

1. Query filter uses only `role` (not `roles`) and docs must be updated accordingly.
2. `POST /api/profiles` success response returns full created profile data.
3. `GET /api/profiles/lecturers` is strictly `ADMIN` only.
4. Rename/replace `user*` module naming with `profile*` naming for this scope.

## 3. Scope and Ownership

This plan covers Member 1 UserProfile scope in `backend/src`:

- Route layer
- Controller layer
- Service layer
- Error constants for profile module
- API document alignment
- Postman collection test cases

## 4. Architecture and Conventions

### 4.1 Response Envelope

All endpoints must return:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": null
}
```

Error format:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "message",
    "details": {
      "formErrors": [],
      "fieldErrors": {}
    }
  },
  "meta": null
}
```

### 4.2 Validation and Error Details Rules

- Validation errors (`400`) -> put messages in `error.details.fieldErrors`.
- Business/auth errors (`401`, `403`, `404`, `409`) -> put messages in `error.details.formErrors`.

### 4.3 Route Ordering

Static routes must be registered before dynamic routes.

For this phase:

1. `GET /`  
2. `POST /`  
3. `GET /me`  
4. `GET /students`  
5. `GET /lecturers`  

(Place any future `/:profileId` routes after static routes.)

## 5. File Plan

### 5.1 Create/Use Profile Files

- `src/routes/profileRoute.ts`
- `src/controllers/profileController.ts`
- `src/services/profileService.ts`

### 5.2 Migrate Naming from User to Profile

- Replace usage of:
  - `src/routes/userRoute.ts`
  - `src/controllers/userController.ts`
  - `src/services/userService.ts`
- Target naming should be `profile*` for module clarity and consistency.

### 5.3 Router Mount

- Mount profile router in `src/routes/index.ts` under `/profiles`.

### 5.4 Error Constants

Add profile constants:

- `src/constants/errors/profile/codes.ts`
- `src/constants/errors/profile/messages.ts`

Include entries for:

- Invalid query/input
- Account not found
- Profile not found
- Profile already exists

## 6. Endpoint-by-Endpoint Implementation Plan

### 6.1 GET /api/profiles (ADMIN)

#### Validation

- Query params:
  - `page` (default 1, positive int)
  - `limit` (default 10, positive int)
  - `search` (optional string)
  - `role` (optional enum: `ADMIN|LECTURER|STUDENT|PARENT`)
  - `status` (optional enum: `ACTIVE|INACTIVE|BANNED`)
  - `gender` (optional enum: `MALE|FEMALE`)
- Reject legacy `roles` query param with `400`.

#### Service Logic

- Build Prisma filters:
  - Search by `UserProfile.FullName` OR `Account.Email`
  - Filter by `Account.Role` using `role`
  - Filter by profile `Status`, `Gender`
- Apply pagination and return `meta: { page, limit, total }`.

#### Response Mapping

Each row returns:

- `profileId`
- `accountId`
- `role`
- `fullName`
- `email` (from `Account.Email`)
- `phoneNumber`
- `dateOfBirth`
- `gender`
- `avatar`
- `citizenId`
- `hometown`
- `status`

### 6.2 POST /api/profiles (ADMIN)

#### Validation

Body fields:

- required: `accountId`, `fullName`
- optional: `phoneNumber`, `dateOfBirth`, `gender`, `avatar`, `citizenId`, `hometown`, `status`

`dateOfBirth` format: `YYYY-MM-DD`.

#### Service Logic

- Verify account exists.
- Verify account does not already have a profile.
- Create profile.

#### Response

- Return full created profile data (not `null`).

### 6.3 GET /api/profiles/me (Any Auth)

#### Service Logic

- Use `req.user.accountId` from `requireAuth`.
- Find profile by `AccountID`.
- If not found -> `404 PROFILE_NOT_FOUND`.

#### Response

- Return complete profile payload with email from account relation.

### 6.4 GET /api/profiles/students (ADMIN, LECTURER)

#### Validation

- `page`, `limit`, `search`, `status`, `gender`

#### Service Logic

- Force role filter to `STUDENT`.
- Search by name/email and apply filters.
- Return paginated list + meta.

### 6.5 GET /api/profiles/lecturers (ADMIN only)

#### Validation

- `page`, `limit`, `search`, `status`, `gender`

#### Service Logic

- Force role filter to `LECTURER`.
- Search by name/email and apply filters.
- Return paginated list + meta.

## 7. API Document Update Plan

Update UserProfile documentation in `docs/API_Document.md`:

- Use only `role` as the role filter query parameter for profile list.
- Remove/replace `roles` mentions in UserProfile list docs.
- Keep lecturer list role requirement strictly `ADMIN`.
- Keep create profile success example with full created profile payload.

## 8. Postman Collection Test Plan

Update `docs/postman/dacn-backend-test-cases.postman_collection.json` by adding a new folder: `User Profiles`.

### 8.1 GET /api/profiles

- Success (ADMIN)
- Search by full name
- Search by email
- Filter by `role`
- Filter by `status`
- Filter by `gender`
- Invalid query (`page=0`, invalid enums)
- Legacy `roles` param should fail (`400`)
- Forbidden (LECTURER/STUDENT)
- Missing token

### 8.2 POST /api/profiles

- Success (ADMIN) with full profile response
- Account not found (`404`)
- Profile already exists (`409`)
- Missing required fields (`400`)
- Invalid date format (`400`)
- Invalid enum values (`400`)
- Forbidden (LECTURER/STUDENT)
- Missing token

### 8.3 GET /api/profiles/me

- Success (authenticated account with profile)
- Profile not found (`404`)
- Missing token (`401`)
- Invalid token (`401`)
- Expired token (`401`)

### 8.4 GET /api/profiles/students

- Success (ADMIN)
- Success (LECTURER)
- Search/filter combinations
- Forbidden (STUDENT)
- Missing token

### 8.5 GET /api/profiles/lecturers

- Success (ADMIN)
- Search/filter combinations
- Forbidden (LECTURER)
- Forbidden (STUDENT)
- Missing token

### 8.6 Postman Variable Additions

Add or ensure these collection variables exist:

- `lecturer_token`
- `profile_existing_account_id`
- `profile_new_account_id`
- `profile_not_found_account_token` (optional)

## 9. Delivery Sequence

1. Create/rename profile module files and mount route.
2. Implement profile constants, controller validation, and service logic.
3. Add five endpoints and enforce role guards.
4. Update API document (`role` only + examples).
5. Add Postman User Profiles folder and all test cases.
6. Run smoke tests for new endpoints and quick regression for existing folders.

## 10. Done Criteria

- All 5 endpoints implemented and reachable.
- Role guards match contract exactly.
- `GET /profiles` accepts only `role` role-filter parameter.
- `POST /profiles` returns full created profile payload.
- Email values and email search use `Account.Email`.
- Postman collection contains success and failure test cases for each endpoint.
- Response envelope and error detail conventions are consistent across endpoints.
