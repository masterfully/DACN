# Subject Detail/Update/Delete Implementation Plan

## Objective
Complete the remaining Subject module endpoints assigned to Member 2:

- `GET /api/subjects/:subjectId`
- `PUT /api/subjects/:subjectId`
- `DELETE /api/subjects/:subjectId`

## Scope

### In Scope
- Add API handlers, routes, and service logic for detail/update/delete flows.
- Validate path parameters and request body using existing validation utilities.
- Enforce role rules from task file:
  - Detail: any authenticated user
  - Update/Delete: `ADMIN` only
- Add guard for delete to prevent removing a subject used by any section.
- Add Postman test cases for the 3 new endpoints.
- Keep user-facing error messages in Vietnamese.

### Out of Scope
- Database schema changes.
- Subject list/create refactor (already completed).
- Frontend UI updates.

## Design Notes

### Validation
- `subjectId` is parsed via `parsePositiveIntParamOrThrow`.
- Update payload allows partial fields:
  - `subjectName?: string` (non-empty when provided)
  - `periods?: number` (positive integer when provided)
- Update payload requires at least one field.

### Business Rules
- `GET /:subjectId`
  - Return `404` when subject does not exist.
- `PUT /:subjectId`
  - Return `404` when subject does not exist.
  - Return `409` when new `subjectName` duplicates another subject.
- `DELETE /:subjectId`
  - Return `404` when subject does not exist.
  - Return `409` if subject is linked to at least one section.
  - Return `200` with `data: null` on successful delete.

## Files Updated

- `backend/src/constants/errors/subject/codes.ts`
- `backend/src/constants/errors/subject/messages.ts`
- `backend/src/services/subjectService.ts`
- `backend/src/controllers/subjectController.ts`
- `backend/src/routes/subjectRoute.ts`
- `backend/docs/postman/dacn-backend-test-cases.postman_collection.json`

## Quick Test Matrix

1. Detail success with `ADMIN`/`STUDENT` token.
2. Detail invalid `subjectId` and not found.
3. Update success with `ADMIN`.
4. Update forbidden for `STUDENT`.
5. Update invalid payload (empty body).
6. Update duplicate `subjectName`.
7. Delete success with deletable subject id.
8. Delete forbidden for `STUDENT`.
9. Delete not found.
10. Delete blocked when subject is in use by section.

