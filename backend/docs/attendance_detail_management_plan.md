# Attendance Detail Management Endpoints Plan

## Objective
Complete the AttendanceDetail module endpoints for Member 2:

- `GET /api/attendances/:attendanceId/details`
- `POST /api/attendances/:attendanceId/details`
- `PUT /api/attendances/:attendanceId/details/:detailId`

## Scope

### In Scope
- Implement route/controller/service for all 3 AttendanceDetail endpoints.
- Enforce role constraints from `TASKS.md`:
  - `GET`: `ADMIN`, `LECTURER`
  - `POST`: `LECTURER`
  - `PUT`: `LECTURER`
- Validate request params/query/body using Zod.
- Keep all error and validation messages in Vietnamese.
- Add guard for bulk create: block when details were already created for the attendance session.
- Add Postman test cases aligned with `API_Document` section 11.

### Out of Scope
- Attendance session CRUD endpoints (`/api/attendances`).
- Attendance summary endpoint (`GET /api/profiles/:profileId/attendance-summary`).
- Database schema changes.

## Implementation Notes

1. **List attendance details**
   - Supports pagination (`page`, `limit`) and filters (`studentProfileId`, `status`).
   - Returns not found when attendance session does not exist.

2. **Bulk create attendance details**
   - Requires `details` array with at least 1 item.
   - Each item validates `studentProfileId`, `status`, optional `note`.
   - Duplicate `studentProfileId` inside the same request is rejected.
   - Guard: if attendance session already has detail rows, return conflict (`ATTENDANCE_DETAIL_EXISTED`).

3. **Update one attendance detail**
   - Supports partial update (`status`, `note`).
   - Requires at least one field.
   - Ensures `detailId` belongs to provided `attendanceId`.

## Files Updated

- `backend/src/constants/errors/attendanceDetail/codes.ts`
- `backend/src/constants/errors/attendanceDetail/messages.ts`
- `backend/src/services/attendanceDetailService.ts`
- `backend/src/controllers/attendanceDetailController.ts`
- `backend/src/routes/attendanceRoute.ts`
- `backend/src/constants/errors/index.ts`
- `backend/docs/postman/dacn-backend-test-cases.postman_collection.json`
- `backend/docs/TASKS.md`

## Postman Coverage (Planned)

1. Attendance detail list: success, missing token, invalid attendanceId, invalid query, attendance not found.
2. Bulk create details: success, forbidden, missing token, invalid payload, attendance not found, already created.
3. Update detail: success, forbidden, missing token, invalid params, invalid payload, detail not found.
