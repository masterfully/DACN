# Implementation Plan: PUT /api/profiles/me (Update Own Profile)

## 1. Overview
Implement the endpoint for authenticated users to update their own profile (`PUT /api/profiles/me`). All roles (ADMIN, LECTURER, STUDENT, PARENT) can update their own profile, but only fields in the `UserProfile` table (except `status` and `email`).

## 2. Requirements
- Endpoint: `PUT /api/profiles/me`
- Auth required: Yes (any role)
- Updatable fields:
  - fullName
  - phoneNumber
  - dateOfBirth
  - gender
  - avatar
  - citizenId
  - hometown
- Not updatable: `email`, `status`, `role`, `accountId`, `profileId`
- Validation: Use zod, follow existing conventions
- Response: Standard response format
- Error handling: Standard conventions

## 3. Steps
1. **Controller**
   - Add `updateMyProfileHandler` to `profileController.ts`.
   - Validate body with zod schema (reuse/extend existing schema, exclude forbidden fields).
   - Call service to update profile by `req.user.accountId`.
   - Return updated profile in response.
2. **Service**
   - Add `updateMyProfile(accountId, data)` in `profileService.ts`.
   - Update only allowed fields in `UserProfile`.
   - Return updated profile.
3. **Route**
   - Register `PUT /api/profiles/me` in `profileRoute.ts` (before dynamic routes).
   - Use `requireAuth` middleware.
4. **Validation**
   - Ensure forbidden fields are not accepted (ignore or error).
   - Validate types, lengths, enums as per API doc.
5. **Docs**
   - Update TASKS.md and implementation plan.
6. **Postman**
   - Add/verify test cases in `dacn-backend-test-cases.postman_collection.json`:
     - Success: update all allowed fields
     - Partial update (only one field)
     - Forbidden field (email/status) is ignored or rejected
     - Unauthenticated (401)
     - Invalid input (400)

## 4. Postman Test Cases
- **PUT /api/profiles/me**
  - [Success] Update all allowed fields
  - [Success] Update only one field (e.g., phoneNumber)
  - [Fail] Try to update email/status (should be ignored or 400)
  - [Fail] Invalid input (e.g., wrong date format)
  - [Fail] No token (401)

## 5. Notes
- Do not allow email/status/role/accountId/profileId in request body.
- Use standard error and response format.
- No audit log/notification for now.

---
**Confirm with reviewer if any field mapping or business logic is unclear.**
