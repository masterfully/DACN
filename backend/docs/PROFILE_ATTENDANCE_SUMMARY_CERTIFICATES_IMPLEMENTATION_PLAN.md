# Profile Attendance Summary + Certificates Implementation Plan (Rerun after DB updates)

## 1. Scope
Implement these pending UserProfile endpoints:

- GET /api/profiles/:profileId/attendance-summary (Role: ADMIN, LECTURER, or owner)
- GET /api/profiles/:profileId/certificates (Role: ADMIN or owner)
- POST /api/profiles/:profileId/certificates (Role: ADMIN)
- DELETE /api/profiles/:profileId/certificates/:certificateId (Role: ADMIN)

## 2. Confirmed Decisions (2026-04-03)
1. isVerified filter for GET /api/profiles/:profileId/certificates:
- Add a dedicated DB column via migration and support runtime filtering.
2. Attendance summary status handling:
- EXCUSED_ABSENCE is counted as absent.
3. attendanceRate format:
- Return integer percentage.
4. Non-STUDENT target profile behavior:
- Return 404 for attendance-summary and certificates endpoints.

## 3. Documents and Source Reviewed
- backend/docs/TASKS.md
- backend/docs/API_Document.md (sections 11.4 and 15.x)
- backend/src/routes/profileRoute.ts
- backend/src/controllers/profileController.ts
- backend/src/services/profileService.ts
- backend/src/services/attendanceDetailService.ts
- backend/src/services/profileApplicationService.ts
- backend/src/constants/errors/profile/codes.ts
- backend/src/constants/errors/profile/messages.ts
- backend/prisma/schema.prisma

## 4. Rerun Snapshot (DB-aware)
Current schema relations relevant to this scope:

1. UserProfile
- PK: ProfileID
- Relation to Account via AccountID (Account has IsDeleted for soft delete filtering)

2. Attendance summary data path
- AttendanceDetail(StudentProfileID, AttendanceID, Status)
- Attendance(AttendanceID, SectionID)
- Section(SectionID, SubjectID)
- Subject(SubjectID, SubjectName)

3. Certificates data path
- StudentCertificates(StudentID, CertificateID) with composite PK
- CertificateDetail(CertificateID, ApplicationID, CertificateTypeID, Score, IssueDate, ExpiryDate, EvidenceURL, Metadata)
- CertificateType(CertificateTypeID, TypeName)

4. Important DB-contract notes
- Student certificate linking is represented by StudentCertificates join table.
- Attendance statuses already used in code are uppercase: PRESENT, ABSENT, EXCUSED_ABSENCE, LATE.
- Current rerun decision: add IsVerified column to CertificateDetail via migration before endpoint implementation.

## 5. Functional Contract (target behavior)

### 5.1 GET /api/profiles/:profileId/attendance-summary
- Auth required.
- Access: ADMIN, LECTURER, or owner.
- Params:
  - profileId: positive int.
- Query:
  - sectionId (optional, positive int).
- Response fields (from API doc target):
  - profileId
  - studentName
  - sectionId (nullable when no filter)
  - subjectName (nullable when no filter)
  - totalSessions
  - present
  - absent
  - late
  - attendanceRate

### 5.2 GET /api/profiles/:profileId/certificates
- Auth required.
- Access: ADMIN or owner.
- Params:
  - profileId: positive int.
- Query:
  - page, limit
  - search (certificate type name)
  - certificateTypeId (optional)
  - isVerified (supported after migration)
- Response: paginated list + meta.

### 5.3 POST /api/profiles/:profileId/certificates
- Auth required.
- Access: ADMIN only.
- Params:
  - profileId: positive int.
- Body:
  - certificateId: positive int.
- Response:
  - linked row payload { studentId, certificateId }.

### 5.4 DELETE /api/profiles/:profileId/certificates/:certificateId
- Auth required.
- Access: ADMIN only.
- Params:
  - profileId: positive int.
  - certificateId: positive int.
- Response:
  - success with data: null when unlink succeeds.

## 6. Implementation Design

## Phase 0 - DB Migration (confirmed)
Update certificate schema to support isVerified filter.

Files:
- backend/prisma/schema.prisma
- backend/prisma/migrations/*

Work items:
- Add IsVerified Boolean @default(false) to CertificateDetail.
- Create and apply Prisma migration.
- Run prisma generate after migration.
- Ensure API/controller query validation accepts isVerified as boolean.

## Phase A - Error Constants
Update profile error constants.

Files:
- backend/src/constants/errors/profile/codes.ts
- backend/src/constants/errors/profile/messages.ts

Add new error codes/messages for:
- attendance summary:
  - PROFILE_ATTENDANCE_SUMMARY_INVALID_PARAMS
  - PROFILE_ATTENDANCE_SUMMARY_INVALID_QUERY
  - PROFILE_ATTENDANCE_SUMMARY_PROFILE_NOT_FOUND
  - PROFILE_ATTENDANCE_SUMMARY_FORBIDDEN
  - PROFILE_ATTENDANCE_SUMMARY_SECTION_NOT_FOUND (if sectionId provided and section missing)
- certificate list:
  - PROFILE_CERTIFICATE_LIST_INVALID_PARAMS
  - PROFILE_CERTIFICATE_LIST_INVALID_QUERY
  - PROFILE_CERTIFICATE_LIST_PROFILE_NOT_FOUND
  - PROFILE_CERTIFICATE_LIST_FORBIDDEN
- certificate link/unlink:
  - PROFILE_CERTIFICATE_LINK_INVALID_PARAMS
  - PROFILE_CERTIFICATE_LINK_INVALID_INPUT
  - PROFILE_CERTIFICATE_LINK_PROFILE_NOT_FOUND
  - PROFILE_CERTIFICATE_LINK_CERTIFICATE_NOT_FOUND
  - PROFILE_CERTIFICATE_LINK_ALREADY_EXISTS
  - PROFILE_CERTIFICATE_UNLINK_INVALID_PARAMS
  - PROFILE_CERTIFICATE_UNLINK_PROFILE_NOT_FOUND
  - PROFILE_CERTIFICATE_UNLINK_NOT_LINKED

Error detail convention:
- Validation errors (400): details.fieldErrors
- Business/auth errors (403/404/409): details.formErrors

## Phase B - Service Layer
Extend backend/src/services/profileService.ts with 4 methods:

1. getProfileAttendanceSummary(profileId, actor, query)
2. listProfileCertificates(profileId, actor, query)
3. linkCertificateToProfile(profileId, certificateId)
4. unlinkCertificateFromProfile(profileId, certificateId)

### B1. Shared helper rules
- Reuse/extend active profile lookup with account.IsDeleted = false.
- Owner check remains: actor.accountId === target.AccountID.
- For summary endpoint, allow LECTURER in addition to ADMIN/owner.
- For list certificates endpoint, allow ADMIN/owner only.

### B2. Attendance summary query logic
1. Validate target profile exists.
2. Return 404 if target profile role is not STUDENT.
3. Authorize actor.
4. If sectionId provided:
- Optionally verify section exists (return 404 when invalid sectionId).
5. Query attendance details by StudentProfileID with optional relation filter attendance.SectionID.
6. Compute counts:
- totalSessions = all matched details
- present = Status == PRESENT
- absent = Status == ABSENT or EXCUSED_ABSENCE
- late = Status == LATE
7. attendanceRate = integer percent using Math.round(present / totalSessions * 100), and 0 when totalSessions = 0.
8. Resolve subjectName only when sectionId is provided and section exists.

### B3. Certificates list query logic
1. Validate target profile exists.
2. Return 404 if target profile role is not STUDENT.
3. Authorize actor (ADMIN/owner).
4. Build where clause from StudentCertificates.StudentID + filters.
5. Apply isVerified filter on CertificateDetail.IsVerified when provided.
6. Join certificate and certificateType to return:
- certificateId
- typeName
- score
- issueDate
- expiryDate
- evidenceURL
7. Paginate with page/limit and return meta total.

### B4. Link certificate logic (ADMIN)
1. Validate profile exists.
2. Validate certificate exists.
3. Insert StudentCertificates row.
4. Handle unique conflict from composite PK as 409 PROFILE_CERTIFICATE_LINK_ALREADY_EXISTS.
5. Return { studentId, certificateId }.

### B5. Unlink certificate logic (ADMIN)
1. Validate profile exists.
2. Delete StudentCertificates by composite key (StudentID + CertificateID).
3. If no row deleted: return 404 with PROFILE_CERTIFICATE_UNLINK_NOT_LINKED.
4. Return success null.

## Phase C - Controller Layer
File: backend/src/controllers/profileController.ts

Add:
- query schema for attendance summary: { sectionId?: positive int }
- query schema for certificates list: { page, limit, search?, certificateTypeId?, isVerified? }
- body schema for link certificate: { certificateId: positive int }
- param parsing for profileId and certificateId using parsePositiveIntParamOrThrow

Add handlers:
1. getProfileAttendanceSummaryHandler
2. getProfileCertificatesHandler
3. addProfileCertificateHandler
4. removeProfileCertificateHandler

Controller responsibilities:
- parse params/query/body with parseOrThrow + parsePositiveIntParamOrThrow
- construct actor from req.user
- call service methods
- respond with sendSuccess and meta for paginated list

## Phase D - Route Layer
File: backend/src/routes/profileRoute.ts

Add routes:
- GET /:profileId/attendance-summary -> requireAuth
- GET /:profileId/certificates -> requireAuth
- POST /:profileId/certificates -> requireAuth + requireRole("ADMIN")
- DELETE /:profileId/certificates/:certificateId -> requireAuth + requireRole("ADMIN")

Route ordering:
- Keep static routes first (/me, /students, /lecturers)
- Register new nested dynamic routes before bare /:profileId routes for readability and safety.

## Phase E - Documentation and Task Sync
After implementation:
- Update backend/docs/API_Document.md to reflect confirmed decisions:
  - isVerified is backed by DB column.
  - EXCUSED_ABSENCE contributes to absent.
  - attendanceRate is returned as integer percentage.
  - Non-STUDENT profile requests return 404.
- Mark these 4 Step 3 items complete in backend/docs/TASKS.md.

## Phase F - Postman Case Additions
Update Postman collection with the new endpoint cases.

File:
- backend/docs/postman/dacn-backend-test-cases.postman_collection.json

Recommended folder:
- User Profiles - Attendance Summary & Certificates

### F.1 Seeded Variable Snapshot (Current DB)
Source DB: postgresql://postgres:123@127.0.0.1:5432/dacn_db
Generated at: 2026-04-03T11:30 local run

Update these existing environment variable keys before running tests:

- login_username: admin01
- login_password: Secret@123
- login_inactive_username: student_inactive01
- login_banned_username: student_banned01
- existing_lecturer_profile_id: 14
- non_lecturer_profile_id: 15
- profile_detail_id: 15
- profile_update_id: 15
- my_profile_id: 15
- another_profile_id: 16
- attendance_detail_student_profile_id: 15
- existing_section_id: 3
- section_with_students_id: 3
- registration_open_section_id: 3
- existing_attendance_id: 18
- attendance_editable_id: 18
- attendance_detail_target_attendance_id: 18
- existing_attendance_detail_id: 1
- existing_app_id: 1
- pending_app_id: 3
- reviewed_app_id: 4

Add these extra keys for attendance-summary/certificates endpoint tests:

- student_inactive_profile_id: 18
- student_banned_profile_id: 19
- profile_certificates_test_profile_id: 15
- profile_certificates_other_profile_id: 16
- certificate_link_success_id: 4
- certificate_unlink_success_id: 1
- certificate_not_linked_for_student01_id: 3
- certificate_filter_verified_true_id: 1
- certificate_filter_verified_false_id: 2

Seeded scenario notes:

- certificate_not_linked_for_student01_id is linked to student02, not student01.
- certificate_link_success_id is intentionally unlinked from all students.
- Rerun pnpm run seed:test if IDs shift and refresh this snapshot.

## 7. Test Plan
Add Postman cases in backend/docs/postman/dacn-backend-test-cases.postman_collection.json under User Profiles:

### 7.1 Attendance summary
1. Success as ADMIN.
2. Success as owner.
3. Success as LECTURER.
4. Forbidden as non-owner STUDENT.
5. Invalid profileId (400).
6. Profile not found (404).
7. Invalid sectionId query (400).
8. Missing token (401).

### 7.2 Certificates list
1. Success as ADMIN.
2. Success as owner.
3. Forbidden as non-owner STUDENT.
4. Search by typeName.
5. Filter by certificateTypeId.
6. Filter by isVerified=true.
7. Filter by isVerified=false.
8. Invalid query/page/limit.
9. Missing token.

### 7.3 Link certificate
1. Success as ADMIN.
2. Duplicate link (409).
3. profileId not found (404).
4. certificateId not found (404).
5. Invalid body (400).
6. Forbidden role (403).

### 7.4 Unlink certificate
1. Success as ADMIN.
2. Not linked case (404).
3. profileId not found.
4. Invalid params.
5. Forbidden role.

## 8. Definition of Done
- All 4 endpoints implemented and routed under /api/profiles.
- DB migration for CertificateDetail.IsVerified is applied and Prisma client regenerated.
- Authorization behavior matches TASKS contract.
- Validation uses zod + standard error details.
- Response envelope remains consistent.
- Attendance summary math is deterministic and documented.
- StudentCertificates link/unlink uses composite key correctly.
- Postman tests cover success + failure paths.
- TASKS and API docs aligned with final behavior.

## 9. Confirmed Inputs Applied
1. isVerified: implement via DB migration and runtime filter.
2. EXCUSED_ABSENCE: included in absent count.
3. attendanceRate: integer percentage.
4. Non-STUDENT profile: return 404 on attendance-summary and certificates endpoints.
