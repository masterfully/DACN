# 🚀 Register Section Implementation Plan

---

## 🎯 1. Objective

Implement the endpoint `POST /api/registrations` based on the API documentation (**Section 6.2 - Register Section**) to allow students to register for a section.

### Key Requirements
- Only users with role `STUDENT` are allowed to register
- Ensure all business validations are performed before writing data
- Update `EnrollmentCount` using **atomic operations within a transaction**

---

## 📦 2. Scope

### ✅ In Scope
- `POST /api/registrations`
- Request body validation (`sectionId`)
- Business guards:
  - Section exists
  - Section is open for registration (`status = 1`)
  - Section is not full
  - Student has not already registered
- Create `Registration` record
- Increment `Section.EnrollmentCount`
- Add Postman test cases for endpoint 6.2

### ❌ Out of Scope
- `GET /api/registrations`
- `DELETE /api/registrations/:sectionId`
- `GET /api/registrations/my-registrations`
- `GET /api/sections/:sectionId/registrations`

---

## 📚 3. References & Standards

- API contract: `backend/docs/API_Document.md` (Section 6.2)
- Task assignment: `backend/docs/TASKS.md`
- Response standard: `src/utils/response.ts`
- Input validation: `src/utils/validation.ts`
- Error handling: `src/middleware/errorHandler.ts`
- Auth middleware: `requireAuth`, `requireRole`

---

## 🔗 4. API Contract Summary

| Field | Value |
|------|------|
| URL | `/api/registrations` |
| Method | `POST` |
| Auth | Required (Token + role `STUDENT`) |

### 📥 Request Body
```json
{
  "sectionId": 1
}