# Section Management Endpoints Plan

## Objective
Complete the remaining Section module endpoints for Member 2:

- `GET /api/sections/my-sections`
- `GET /api/sections/:sectionId`
- `PUT /api/sections/:sectionId`
- `DELETE /api/sections/:sectionId`
- `GET /api/sections/:sectionId/students`
- `PATCH /api/sections/:sectionId/status`
- `PATCH /api/sections/:sectionId/visibility`

## Scope

### In Scope
- Route/controller/service implementation for all 7 endpoints.
- Role constraints:
  - `my-sections`: `LECTURER`
  - detail: any authenticated role
  - update/delete: `ADMIN`
  - students/status/visibility: `ADMIN`, `LECTURER`
- Validation using Zod + shared validation helpers.
- Vietnamese error messages and field validation messages.
- Delete guard: block delete when section has registered students.
- Postman test coverage for success + common failure cases.

### Out of Scope
- Refactoring existing section list/create implementation.
- DB schema changes.
- Frontend UI changes.

## Design Decisions

1. `PUT /sections/:sectionId` supports partial updates:
   - `lecturerProfileId`, `year`, `maxCapacity`, `status`, `visibility`
   - At least one field is required.

2. `DELETE /sections/:sectionId` cleanup strategy:
   - If registrations exist: return conflict (`SECTION_DELETE_HAS_STUDENTS`).
   - If no registrations: delete dependent rows in transaction
     (`attendanceDetails`, `attendances`, `schedules`, `sectionUsageHistories`, orphan `usageHistories`) before deleting section.

3. `GET /sections/:sectionId` returns section summary + schedule details in API document format.

4. `PATCH /status` and `PATCH /visibility` return `data: null` on success.

## Updated Files

- `backend/src/constants/errors/section/codes.ts`
- `backend/src/constants/errors/section/messages.ts`
- `backend/src/services/sectionService.ts`
- `backend/src/controllers/sectionController.ts`
- `backend/src/routes/sectionRoute.ts`
- `backend/docs/postman/dacn-backend-test-cases.postman_collection.json`

## Postman Coverage Targets

- `my-sections`: success, forbidden, missing token, invalid query.
- `section detail`: success, missing token, invalid sectionId, not found.
- `section update`: success, forbidden, missing token, invalid payload, invalid sectionId, not found.
- `section delete`: success, forbidden, missing token, invalid sectionId, not found, has students.
- `section students`: success, forbidden, missing token, invalid sectionId, not found.
- `status patch`: success (admin + lecturer), forbidden, missing token, invalid body, invalid sectionId, not found.
- `visibility patch`: success (admin + lecturer), forbidden, missing token, invalid body, invalid sectionId, not found.

