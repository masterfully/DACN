# Registration Read/Cancel Implementation Plan

## Objective
Complete the remaining Registration module endpoints for Member 2:

- `GET /api/registrations`
- `GET /api/registrations/my-registrations`
- `DELETE /api/registrations/:sectionId`
- `GET /api/sections/:sectionId/registrations`

## Scope

### In Scope
- Add route handlers and service logic for all 4 endpoints.
- Keep response format aligned with `sendSuccess` / `errorHandler`.
- Validate query/body/params with Zod through `parseOrThrow` and `parsePositiveIntParamOrThrow`.
- Keep registration cancel flow atomic with a DB transaction.
- Keep route ordering safe for static route precedence (`/my-registrations` before `/:sectionId`).

### Out of Scope
- Schema redesign (for example, adding registration timestamp/status columns).
- Postman collection updates.
- Frontend UI changes.

## Implementation Summary

### 1. Query/Param Validation
Added schemas in `registrationService.ts`:
- `getRegistrationsQuerySchema`
- `getMyRegistrationsQuerySchema`
- `getSectionRegistrationsQuerySchema`

Validation includes:
- pagination (`page`, `limit`)
- positive integer checks (`sectionId`, `studentProfileId`)
- optional section status filter (`0 | 1 | 2`)
- optional school year format (`YYYY-YYYY`)

### 2. Business Logic

#### `GET /api/registrations` (ADMIN)
- Returns paginated registration list.
- Supports filters: `sectionId`, `studentProfileId`, `status`, `year`.
- Output shape:
  - `sectionId`
  - `studentProfileId`
  - `studentName`
  - `subjectName`

#### `GET /api/registrations/my-registrations` (STUDENT)
- Resolves current student profile from `req.user.accountId`.
- Returns only current student registrations.
- Supports filters: `status`, `year`.
- Output shape:
  - `sectionId`
  - `subjectName`
  - `lecturerName`
  - `year`
  - `status`

#### `DELETE /api/registrations/:sectionId` (STUDENT)
- Resolves current student profile.
- Deletes registration by composite key `(SectionID, StudentProfileID)`.
- Atomically decrements `Section.EnrollmentCount` in the same transaction.
- Returns `200` with `data: null` on success.
- Returns `404` with `REGISTRATION_CANCEL_NOT_FOUND` if the registration does not exist.

#### `GET /api/sections/:sectionId/registrations` (ADMIN, LECTURER)
- Validates `sectionId` and checks section existence.
- Returns paginated registration list for the section.
- Supports optional `search` on student full name or account email.
- Output shape:
  - `studentProfileId`
  - `fullName`
  - `email`

### 3. Routing Changes
- `registrationRoute.ts`
  - `GET /`
  - `GET /my-registrations`
  - `POST /`
  - `DELETE /:sectionId`
- `sectionRoute.ts`
  - `GET /:sectionId/registrations`

## Error Handling
Added registration error constants for:
- invalid list queries
- invalid `sectionId` param
- missing student profile in list/cancel flows
- registration not found on cancel
- section not found for section registration list

## Quick Manual Test Checklist

1. `GET /api/registrations` with ADMIN token returns paginated data.
2. `GET /api/registrations` with STUDENT token returns `403`.
3. `GET /api/registrations/my-registrations` with STUDENT token returns own data only.
4. `DELETE /api/registrations/:sectionId` deletes existing registration and decreases enrollment.
5. `DELETE /api/registrations/:sectionId` for non-registered section returns `404`.
6. `GET /api/sections/:sectionId/registrations` returns students for that section.
7. Invalid `sectionId` (non-positive integer) returns `400`.

