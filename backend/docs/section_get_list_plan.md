# Section Get List Implementation Plan

## 1. Goal

Implement `GET /api/sections` based on API Document section 5.1, restricted to `ADMIN` role, with pagination and filtering support.

## 2. Scope

- In scope:
  - Get paginated section list
  - Search by subject name and lecturer name
  - Filter by `subjectId`, `lecturerProfileId`, `year`, `status`, `visibility`
  - Return standard response format with `meta`
- Out of scope:
  - Section detail endpoint (`GET /api/sections/:sectionId`)
  - Lecturer self-section endpoint (`GET /api/sections/my-sections`)
  - Update/delete section endpoints

## 3. References and Conventions

- API contract: `backend/docs/API_Document.md` (5.1 Get Section List)
- Task assignment: `backend/docs/TASKS.md`
- Response format: `src/utils/response.ts`
- Validation utility: `src/utils/validation.ts`
- Error handling: `src/middleware/errorHandler.ts`

## 4. API Contract Summary

- URL: `/api/sections`
- Method: `GET`
- Auth: `requireAuth + requireRole("ADMIN")`
- Query params:
  - `page` (number, optional, default `1`)
  - `limit` (number, optional, default `10`, max `100`)
  - `search` (string, optional)
  - `subjectId` (number, optional)
  - `lecturerProfileId` (number, optional)
  - `year` (string, optional, format `YYYY-YYYY`)
  - `status` (number, optional, allowed `0|1|2`)
  - `visibility` (number, optional, allowed `0|1`)

## 5. File and Module Design

- Update:
  - `src/constants/errors/section/codes.ts`
  - `src/constants/errors/section/messages.ts`
  - `src/services/sectionService.ts`
  - `src/controllers/sectionController.ts`
  - `src/routes/sectionRoute.ts`
  - `backend/docs/postman/dacn-backend-test-cases.postman_collection.json`

## 6. Detailed Implementation Steps

1. Add section list error code/message constants:
   - `SECTION_LIST_INVALID_QUERY`
   - query field error messages for invalid query params.
2. Define Zod query schema `getSectionsQuerySchema` in service layer.
3. Implement `buildSectionListWhere` to build Prisma `where` dynamically.
4. Implement `getSections` service:
   - apply `skip/take` pagination
   - query list + total by `Promise.all`
   - map DB fields to API response fields.
5. Implement `getSectionsHandler` in controller:
   - parse query via `parseOrThrow`
   - call service
   - return `sendSuccess(data, 200, meta)`.
6. Register route:
   - `router.get("/", requireAuth, requireRole("ADMIN"), getSectionsHandler)`.
7. Add Postman test cases under `Sections` folder.

## 7. Validation Rules

- `page` and `limit` must be positive integers.
- `limit` must be `<= 100`.
- `subjectId` and `lecturerProfileId` must be positive integers if provided.
- `year` must follow `YYYY-YYYY` if provided.
- `status` only accepts `0, 1, 2`.
- `visibility` only accepts `0, 1`.

## 8. Expected Error Mapping

- `400`: invalid query params
- `401`: missing or invalid token
- `403`: authenticated but not `ADMIN`
- `500`: unexpected server error

## 9. Test Plan (Build + Postman)

### 9.1 Build Check

- Run `pnpm build` and ensure TypeScript compiles successfully.

### 9.2 Postman Cases

1. Get section list success (ADMIN) -> `200`
2. Get section list with filters (ADMIN) -> `200`
3. Missing token -> `401`
4. Forbidden role (STUDENT) -> `403`
5. Invalid page (`page=0`) -> `400`
6. Invalid status (`status=5`) -> `400`

## 10. Commit Plan

1. `feat(be): add section list query schema and service logic`
2. `feat(be): add section list controller and route`
3. `test(be): add postman test cases for section list`
4. `docs(be): add section get list implementation plan`

## 11. Definition of Done

- `GET /api/sections` works with correct auth and filters.
- Response format follows `{ success, data, error, meta }`.
- Build passes (`pnpm build`).
- Postman section list test cases are added and runnable.
