# Get Subjects List - Implementation Plan

## Overview
Implement `GET /api/subjects` endpoint to retrieve paginated subject list with optional search filter.

## Specifications
- **Endpoint**: `GET /api/subjects`
- **Authentication**: Required (any role)
- **Query Parameters**:
  - `page` (number, optional, default: 1)
  - `limit` (number, optional, default: 10)
  - `search` (string, optional, search by subjectName)

## Response Format
```json
{
  "success": true,
  "data": [
    {
      "SubjectID": 1,
      "SubjectName": "Lập trình hướng đối tượng",
      "Periods": 45,
      "CreatedAt": "2026-03-18T..."
    }
  ],
  "error": null,
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

## Files to Create/Modify
1. **Service**: `src/services/subjectService.ts` - Add `getSubjects()` function
2. **Controller**: `src/controllers/subjectController.ts` - Add `getSubjectsHandler()` function
3. **Route**: `src/routes/subjectRoute.ts` - Add GET route

## Implementation Details

### Service Layer
- Function: `getSubjects(page: number, limit: number, search?: string)`
- Uses Prisma `findMany()` with filters and skip/take for pagination
- Query filter: Case-insensitive search on SubjectName
- Returns: `{ subjects, total }`

### Controller Layer
- Parse and validate query params using Zod
- Call service function
- Handle errors
- Format response with meta pagination

### Route Layer
- Define GET route: `router.get("/")`
- Apply middleware: `requireAuth` (no role restriction)

## Status
- [ ] Service layer implementation
- [ ] Controller layer implementation
- [ ] Route integration
- [ ] Testing with Postman
- [ ] Commit and PR
