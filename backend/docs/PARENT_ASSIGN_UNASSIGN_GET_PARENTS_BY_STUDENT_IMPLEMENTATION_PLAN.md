# Parent Relationship Core Endpoints Implementation Plan

## Scope
Implement the core parent-student relationship endpoints from Step 4 in task assignment:

- `POST /api/parents/assign`
- `DELETE /api/parents/assign`
- `GET /api/students/:studentId/parents`

Out of scope for this plan (can be Phase 2 follow-up):

- `GET /api/parents/:parentId/students`
- `GET /api/parents/my-students`
- `GET /api/parents/students/:studentId/schedule`
- `GET /api/parents/students/:studentId/attendance`

## Source Of Truth Used

- API contract in `backend/docs/API_Document.md` section `16.1` to `16.3`
- Task assignment in `backend/docs/TASKS.md` (Member 1 - Step 4)
- Existing backend conventions in `skills/backend-coder-skill.md`
- Existing implementation patterns in:
  - `backend/src/routes/sectionRoute.ts`
  - `backend/src/controllers/registrationController.ts`
  - `backend/src/services/registrationService.ts`
  - `backend/src/services/scheduleService.ts`
  - `backend/src/services/attendanceService.ts`

## Current Codebase Snapshot (2026-04-04)

- Role `PARENT` is already supported in auth/role middleware.
- Prisma schema already has relation model `UserParents` with composite key:
  - `StudentID`
  - `ParentID`
- There is currently no dedicated parent route/controller/service module.
- Postman collection currently has no `Parents` folder.

Implication:

- No schema migration is required for Step 4 core.
- Work is primarily API layer + business rules + docs/postman synchronization.

## Target Contract (Core)

### 1) Assign Parent To Student

- Method: `POST`
- Path: `/api/parents/assign`
- Role: `ADMIN`
- Body:
  - `studentId` (positive integer, required)
  - `parentId` (positive integer, required)

### 2) Unassign Parent From Student

- Method: `DELETE`
- Path: `/api/parents/assign`
- Role: `ADMIN`
- Query:
  - `studentId` (positive integer, required)
  - `parentId` (positive integer, required)

### 3) Get Parents Of A Student

- Method: `GET`
- Path: `/api/students/:studentId/parents`
- Role: `ADMIN`
- Path param:
  - `studentId` (positive integer, required)
- Query:
  - `page` (default `1`)
  - `limit` (default `10`)

## Phase 0 - Contract & Error Policy Lock

### Confirmed Decisions

1. Standardize to prefixed error codes for this module.
2. Keep `DELETE /api/parents/assign` using query params (`studentId`, `parentId`) as documented.
3. For role mismatch (profile exists but wrong role), return `404`.
4. Scope remains limited to `16.1` to `16.3` only (no expansion to `16.4` to `16.7` in this batch).

### Proposed Status Mapping

- `POST /assign` success: `201`
- `DELETE /assign` success: `200`
- `GET /students/:studentId/parents` success: `200`
- validation errors: `400`
- unauthorized: `401`
- forbidden: `403`
- not found: `404`
- conflict (already linked): `409`

### Proposed Error Cases

- Assign:
  - invalid input
  - student or parent not found/role mismatch
  - link already exists
- Unassign:
  - invalid query
  - link not found
- Get parents of student:
  - invalid studentId/query
  - student not found/role mismatch

## Phase 1 - Files & Module Skeleton

### New Files

- `backend/src/routes/parentRoute.ts`
- `backend/src/routes/studentRoute.ts`
- `backend/src/controllers/parentController.ts`
- `backend/src/services/parentService.ts`
- `backend/src/constants/errors/parent/codes.ts`
- `backend/src/constants/errors/parent/messages.ts`

### Existing Files To Update

- `backend/src/routes/index.ts`
  - mount `router.use("/parents", parentRoute)`
  - mount `router.use("/students", studentRoute)`
- `backend/src/constants/errors/index.ts`
  - export parent error constants

## Phase 2 - Route Layer Plan

### parentRoute

- `POST /assign` -> `requireAuth`, `requireRole("ADMIN")`
- `DELETE /assign` -> `requireAuth`, `requireRole("ADMIN")`

### studentRoute

- `GET /:studentId/parents` -> `requireAuth`, `requireRole("ADMIN")`

### Route Order Notes

- Keep static paths before dynamic paths in each new router if additional routes are added later.
- No collisions with current routes because `/parents` and `/students` are new top-level mounts.

## Phase 3 - Controller & Validation Plan

### Validation Schemas (Zod)

- `assignParentSchema` (body):
  - `studentId`: positive int
  - `parentId`: positive int
- `unassignParentQuerySchema` (query):
  - `studentId`: positive int
  - `parentId`: positive int
- `getStudentParentsQuerySchema` (query):
  - `page`: positive int default `1`
  - `limit`: positive int max `100` default `10`

### Controller Handlers

- `assignParentToStudentHandler`
  - parse body with `parseOrThrow`
  - call service
  - return `sendSuccess(res, { studentId, parentId }, 201)`
- `unassignParentFromStudentHandler`
  - parse query with `parseOrThrow`
  - call service
  - return `sendSuccess(res, null, 200)`
- `getStudentParentsHandler`
  - parse `studentId` via `parsePositiveIntParamOrThrow`
  - parse pagination query
  - call service
  - return `sendSuccess(..., data, 200, { page, limit, total })`

## Phase 4 - Service Logic Plan

### Shared Service Helpers

- `assertStudentProfileExists(studentId)`
  - verifies profile exists and role is `STUDENT`
- `assertParentProfileExists(parentId)`
  - verifies profile exists and role is `PARENT`
- `buildBusinessErrorDetails(message)`
  - standardized `{ formErrors, fieldErrors }`

### Assign Flow

1. Verify student profile exists and has role `STUDENT`.
2. Verify parent profile exists and has role `PARENT`.
3. Check if link already exists in `UserParents`.
4. If exists -> conflict error.
5. Create link in `UserParents`.
6. Return `{ studentId, parentId }`.

### Unassign Flow

1. Delete by composite key (`StudentID`, `ParentID`) with `deleteMany`.
2. If deleted count is `0` -> link not found error.
3. Return success with `null` data.

### List Parents Of Student Flow

1. Verify student exists and role is `STUDENT`.
2. Query `UserParents` where `StudentID = studentId` with pagination.
3. Join parent profile + account email fields.
4. Map response items to API contract fields:
   - `profileID`, `fullName`, `phoneNumber`, `email`, `dateOfBirth`, `gender`, `avatar`
5. Return list + `total`.

## Phase 5 - Error Constants & Messages

### New Parent Error Constant Group

- Add `PARENT_ERROR_CODES` and `PARENT_ERROR_MESSAGES` in new module folder.
- Keep validation field error texts in `PARENT_FIELD_ERROR_MESSAGES`.

### Suggested Core Error Keys

- `PARENT_ASSIGN_INVALID_INPUT`
- `PARENT_ASSIGN_STUDENT_OR_PARENT_NOT_FOUND`
- `PARENT_ASSIGN_ALREADY_LINKED`
- `PARENT_UNASSIGN_INVALID_QUERY`
- `PARENT_UNASSIGN_LINK_NOT_FOUND`
- `PARENT_STUDENT_PARENTS_INVALID_STUDENT_ID`
- `PARENT_STUDENT_PARENTS_INVALID_QUERY`
- `PARENT_STUDENT_PARENTS_STUDENT_NOT_FOUND`

Decision applied:

- Runtime and docs alignment should use prefixed codes for all new parent module errors.
- Replace legacy generic code examples in docs/Postman with prefixed equivalents during implementation.

## Phase 6 - Postman Collection Plan

Target file:

- `backend/docs/postman/dacn-backend-test-cases.postman_collection.json`

### Folder Structure To Add

- New top-level folder: `Parents`
- Sub-groups (recommended):
  - `Assign Parent`
  - `Unassign Parent`
  - `Get Student Parents`

### New Collection Variables (Suggested)

- `existing_student_profile_id`
- `existing_parent_profile_id`
- `linked_student_profile_id`
- `linked_parent_profile_id`
- `unlinked_student_profile_id`
- `unlinked_parent_profile_id`

### Test Cases Matrix

#### Assign Parent (`POST /api/parents/assign`)

1. Success (`ADMIN`)
2. Missing token (`401`)
3. Forbidden (`STUDENT` or `PARENT`) (`403`)
4. Missing `studentId` (`400`)
5. Missing `parentId` (`400`)
6. `studentId` invalid type (`400`)
7. `parentId` invalid type (`400`)
8. Student or parent not found/role mismatch (`404`)
9. Already linked (`409`)

#### Unassign Parent (`DELETE /api/parents/assign`)

1. Success (`ADMIN`)
2. Missing token (`401`)
3. Forbidden (`STUDENT` or `PARENT`) (`403`)
4. Missing query `studentId` (`400`)
5. Missing query `parentId` (`400`)
6. Invalid query type (`400`)
7. Link not found (`404`)

#### Get Parents Of Student (`GET /api/students/:studentId/parents`)

1. Success (`ADMIN`) with pagination
2. Missing token (`401`)
3. Forbidden (`LECTURER`, `STUDENT`, `PARENT`) (`403`)
4. Invalid `studentId` param (`400`)
5. Student not found or not student role (`404`)
6. Invalid query `page`/`limit` (`400`)

### Postman Test Script Assertions (Per Case)

- Assert status code.
- Assert `success` boolean.
- Assert `error.code` where applicable.
- For success list case, assert `meta.page`, `meta.limit`, `meta.total` existence.

## Phase 7 - Verification Checklist

### Build & Static Checks

1. `pnpm build` passes.
2. No TypeScript errors for new parent modules.

### Functional Checks

1. Assign creates new row in `UserParents`.
2. Duplicate assign returns conflict.
3. Unassign removes only targeted composite link.
4. List parents returns only linked parent profiles for requested student.
5. Role guards enforce `ADMIN` only for all three core endpoints.

### Contract Checks

1. Response envelope uses project standard (`success/data/error/meta`).
2. Validation errors return field-level details.
3. Business errors return form-level details.

## Definition Of Done

- All three Step 4 endpoints implemented and mounted.
- Postman cases for these endpoints added and runnable.
- API doc and runtime error codes/messages are aligned.
- Corresponding Step 4 tasks can be checked off in `backend/docs/TASKS.md`.