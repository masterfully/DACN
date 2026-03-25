# Schedule Management Endpoints Plan

## Objective
Complete the Schedule module endpoints for Member 2:

- `GET /api/schedules`
- `POST /api/schedules`
- `GET /api/schedules/my-schedule`
- `GET /api/schedules/:scheduleId`
- `PUT /api/schedules/:scheduleId`
- `DELETE /api/schedules/:scheduleId`
- `GET /api/sections/:sectionId/schedules`

## Scope

### In Scope
- Implement route/controller/service for all endpoints above.
- Keep validation with Zod + shared validators.
- Keep messages in Vietnamese.
- Add room conflict guard on create/update.
- Add Postman test cases aligned with `API_Document` section 8.

### Out of Scope
- DB schema changes.
- Frontend UI integration.
- Refactor unrelated modules.

## Implementation Notes

1. **List schedules (`GET /api/schedules`)**
   - Admin-only.
   - Supports pagination and filters: `roomId`, `sectionId`, `dayOfWeek`, `startDate`, `endDate`.

2. **Create schedule (`POST /api/schedules`)**
   - Admin-only.
   - Validates `totalPeriods = endPeriod - startPeriod + 1`.
   - Guards:
     - section exists
     - room exists
     - room schedule conflict does not occur

3. **My schedule (`GET /api/schedules/my-schedule`)**
   - Any authenticated role.
   - Lecturer: returns schedules for sections taught by the lecturer.
   - Student: returns schedules for registered sections.
   - Admin/Parent: returns empty list.

4. **Schedule detail/update/delete**
   - Detail is any auth.
   - Update/Delete are admin-only.
   - Update re-checks room conflict with merged data.

5. **Schedules by section (`GET /api/sections/:sectionId/schedules`)**
   - Any authenticated role.
   - Returns all schedules for the section.
   - Returns not found if section does not exist.

## Files Updated

- `backend/src/constants/errors/schedule/codes.ts`
- `backend/src/constants/errors/schedule/messages.ts`
- `backend/src/services/scheduleService.ts`
- `backend/src/controllers/scheduleController.ts`
- `backend/src/routes/scheduleRoute.ts`
- `backend/src/routes/sectionRoute.ts`
- `backend/src/routes/index.ts`
- `backend/src/constants/errors/index.ts`
- `backend/docs/postman/dacn-backend-test-cases.postman_collection.json`

## Postman Coverage (Planned)

1. Schedule list: success + auth/validation failures.
2. Schedule create: success + forbidden/missing token/conflict/not-found.
3. My schedule: lecturer/student success + missing token + invalid query.
4. Schedule detail: success + invalid id + not found.
5. Schedule update: success + forbidden + invalid payload + not found.
6. Schedule delete: success + forbidden + not found.
7. Schedules by section: success + missing token + invalid section id + not found.

