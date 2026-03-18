# Subject Create Endpoint Implementation Plan

## Task: POST /api/subjects — Create Subject

### Overview
Implement the POST endpoint to create a new subject. This endpoint allows admins to add subjects to the system.

### Requirements
- **Route**: `POST /api/subjects`
- **Authentication**: Required (`Authorization: Bearer <token>`)
- **Authorization**: Admin role only
- **Request Body**:
  - `subjectName` (string, required): Name of the subject
  - `periods` (number, required): Number of teaching periods
- **Response**: 
  - Success (201): Returns created subject with ID
  - Validation Error (400): Invalid input
  - Unauthorized (401): Missing/invalid token
  - Forbidden (403): Non-admin role

### Files Created
1. **`src/services/subjectService.ts`**
   - `createSubject(subjectName, periods)` — Calls Prisma to create subject in DB

2. **`src/controllers/subjectController.ts`**
   - `createSubjectHandler` — Validates request, calls service, returns response
   - Uses Zod validation for input schema

3. **`src/routes/subjectRoute.ts`**
   - Defines POST route
   - Applies `requireAuth` and `requireRole("ADMIN")` middleware

4. **`src/routes/index.ts`** (Updated)
   - Mounts subject routes under `/subjects`

### Implementation Details
- **Validation**: Zod schema validates `subjectName` (non-empty string) and `periods` (positive integer)
- **Database**: Uses Prisma Client to create subject record
- **Response Format**: Uses standard response utility from `src/utils/response.ts`
- **Error Handling**: Global error handler catches exceptions

### Testing
Once deployed, test with:
```
POST /api/subjects
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "subjectName": "Object-Oriented Programming",
  "periods": 45
}
```

Expected Response (201):
```json
{
  "success": true,
  "data": {
    "SubjectID": 1,
    "SubjectName": "Object-Oriented Programming",
    "Periods": 45,
    "CreatedAt": "2026-03-17T...",
    ...
  },
  "error": null,
  "meta": null
}
```

### Status
- [x] Create service layer
- [x] Create controller with validation
- [x] Create route with middleware
- [x] Mount route in main router
- [ ] Test endpoint
- [ ] Commit changes
