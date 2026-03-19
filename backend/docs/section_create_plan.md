# Section Create Implementation Plan

## 1. Goal

Implement `POST /api/sections` based on API Document section 5.2, restricted to `ADMIN` role, and keep all write operations safe in one transaction:

`Section -> Schedule -> Attendance -> UsageHistory -> SectionUsageHistory`

## 2. Scope

- In scope:
  - Create a new section
  - Create schedules from request payload
  - Create attendance entries from schedules
  - Create usage history and section-usage link records
  - Validate input and return the standard response format
- Out of scope:
  - Other section endpoints (`GET/PUT/DELETE`)
  - Advanced cross-section conflict detection (unless confirmed by team)

## 3. References and Conventions

- API contract: `backend/docs/API_Document.md` (5.2 Create Section)
- Task assignment: `backend/docs/TASKS.md`
- Response format: `src/utils/response.ts`
- Validation utility: `src/utils/validation.ts`
- Error handling: `src/middleware/errorHandler.ts`

## 4. API Contract Summary

- URL: `/api/sections`
- Method: `POST`
- Auth: `requireAuth + requireRole("ADMIN")`
- Body:
  - `subjectId` (number, required)
  - `lecturerProfileId` (number, required)
  - `year` (string, required, format `YYYY-YYYY`)
  - `maxCapacity` (number, required, > 0)
  - `status` (number, optional, default `0`, allowed `0|1|2`)
  - `visibility` (number, optional, default `1`, allowed `0|1`)
  - `schedule` (required array; each item has `roomId`, `dayOfWeek`, `startPeriod`, `endPeriod`, `startDate`, `endDate`)

## 5. File and Module Design

- Create:
  - `src/constants/errors/section/codes.ts`
  - `src/constants/errors/section/messages.ts`
  - `src/services/sectionService.ts`
  - `src/controllers/sectionController.ts`
  - `src/routes/sectionRoute.ts`
- Update:
  - `src/routes/index.ts` to mount `/sections`

## 6. Detailed Implementation Steps

1. Add `SECTION_ERROR_CODES`, `SECTION_ERROR_MESSAGES`, and `SECTION_FIELD_ERROR_MESSAGES`.
2. Define Zod request schema `createSectionSchema`.
3. Implement controller:
   - Parse request body with `parseOrThrow`
   - Call `createSection` service
   - Return `201`
4. Implement service `createSection`:
   - Validate subject exists
   - Validate lecturer profile exists and belongs to role `LECTURER`
   - Validate all `roomId` values exist
   - Run `prisma.$transaction`:
     - Create section
     - Create schedules
     - Generate and create attendance records from schedules
     - Create usage history
     - Create section usage history links
5. Add route:
   - `router.post("/", requireAuth, requireRole("ADMIN"), createSectionHandler)`
6. Mount route in `routes/index.ts`.

## 7. Required Validation Rules

- `schedule` must not be empty.
- `endPeriod >= startPeriod`.
- `startDate <= endDate`.
- `dayOfWeek` must be one of `MONDAY..SUNDAY`.
- Reject duplicated schedule items in one request (same room/day/period/date range).

## 8. Expected Error Mapping

- `400`: invalid body/query
- `401`: missing or invalid token
- `403`: invalid role
- `404`: subject/lecturer/room not found
- `409`: business conflict (if applied)
- `500`: unexpected server error

## 9. Test Plan (Postman + Build)

### 9.1 Build Check

- `pnpm build` must pass.

### 9.2 Manual API Cases

1. Create section success (`201`)
2. Missing token (`401`)
3. Non-admin token (`403`)
4. Missing required field (`400`)
5. Invalid `year` format (`400`)
6. Invalid `status` or `visibility` (`400`)
7. Subject not found (`404`)
8. Lecturer not found (`404`)
9. Room not found (`404`)
10. Transaction rollback: if one schedule item fails, no partial data remains

## 10. Commit Plan

1. `feat(be): add section create service and validation`
2. `feat(be): add section create controller and route`
3. `test(be): add postman test cases for section create`
4. `docs(be): add section create implementation plan`

## 11. Definition of Done

- `POST /api/sections` works with correct auth and validation.
- Data is created according to the agreed flow.
- Response follows standard format `{success,data,error,meta}`.
- Build passes and core test cases pass.
- Postman collection is updated and branch is pushed.

## 12. Team Confirmations Needed Before Deep Logic

1. Attendance generation rule from schedule: one record per session or one record per period.
2. UsageHistory strategy: one per schedule item or grouped by section.
3. Conflict detection scope at this endpoint: enforce now or defer to Schedule module.
