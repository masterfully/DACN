# Attendance Management Endpoints Plan

## Objective
Complete the Attendance module endpoints for Member 2:

- `GET /api/attendances`
- `POST /api/attendances`
- `GET /api/attendances/:attendanceId`
- `PUT /api/attendances/:attendanceId`
- `DELETE /api/attendances/:attendanceId`
- `GET /api/sections/:sectionId/attendances`

## Scope

### In Scope
- Implement route/controller/service for all endpoints above.
- Enforce role constraints from `TASKS.md` and `API_Document.md`.
- Keep validation using Zod + shared validation helpers.
- Keep error messages in Vietnamese.
- Add duplicate guard for `sectionId + attendanceDate + slot` on create/update.
- Add Postman test cases aligned with Attendance section in API document.

### Out of Scope
- Attendance detail endpoints (`/api/attendances/:attendanceId/details`).
- DB schema changes.
- Frontend UI changes.

## Implementation Notes

1. **Attendance list (`GET /api/attendances`)**
   - Admin-only endpoint.
   - Supports pagination and filters: `sectionId`, `attendanceDate`, `slot`.
   - Returns `subjectName` for quick administrative tracking.

2. **Create attendance (`POST /api/attendances`)**
   - Lecturer-only endpoint.
   - Validates required fields: `sectionId`, `attendanceDate`, `slot`.
   - Guards:
     - section exists
     - no duplicate attendance session with same `sectionId + attendanceDate + slot`

3. **Attendance detail (`GET /api/attendances/:attendanceId`)**
   - Roles: `ADMIN`, `LECTURER`.
   - Returns full attendance session information.

4. **Update attendance (`PUT /api/attendances/:attendanceId`)**
   - Lecturer-only endpoint.
   - Accepts partial updates (`attendanceDate`, `slot`, `note`).
   - Requires at least one field.
   - Re-checks duplicate guard with merged values.

5. **Delete attendance (`DELETE /api/attendances/:attendanceId`)**
   - Roles: `ADMIN`, `LECTURER`.
   - Deletes related `AttendanceDetail` rows first, then deletes attendance session.

6. **Attendances by section (`GET /api/sections/:sectionId/attendances`)**
   - Roles: `ADMIN`, `LECTURER`.
   - Supports pagination and filters: `attendanceDate`, `slot`.
   - Returns not found when section does not exist.

## Files Updated

- `backend/src/constants/errors/attendance/codes.ts`
- `backend/src/constants/errors/attendance/messages.ts`
- `backend/src/services/attendanceService.ts`
- `backend/src/controllers/attendanceController.ts`
- `backend/src/routes/attendanceRoute.ts`
- `backend/src/routes/index.ts`
- `backend/src/routes/sectionRoute.ts`
- `backend/src/constants/errors/index.ts`
- `backend/docs/postman/dacn-backend-test-cases.postman_collection.json`

## Postman Coverage (Planned)

1. Attendance list: success + forbidden + missing token + invalid query.
2. Attendance create: success + forbidden + missing token + duplicate + section not found.
3. Attendance detail: success + missing token + invalid id + not found.
4. Attendance update: success + forbidden + invalid payload + duplicate + not found.
5. Attendance delete: success + forbidden + missing token + not found.
6. Attendances by section: success + forbidden + missing token + invalid section id + not found.
