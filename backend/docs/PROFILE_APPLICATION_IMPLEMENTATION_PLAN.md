# ProfileApplication Implementation Plan

## 1. Objective
Implement the ProfileApplication module as specified in TASKS.md (Member 3 responsibility). This module handles student profile applications for review, including submission, listing, updating (pending only), admin review workflow, and certificate integration.

## 2. Confirmed Decisions
- Base path: `/api/profile-applications`
- Role-based access: ADMIN (list/review), STUDENT (submit/my-list/update own pending)
- Status flow: PENDING → APPROVED/REJECTED (cannot revert)
- Update pending apps resets SubmissionDate (no body changes, certs via separate endpoint)
- Certificates linked via ApplicationID in CertificateDetail
- Pagination/search/filter on all endpoints
- Vietnamese error messages, English code names
- Zod validation + structured error envelopes

## 3. Scope and Ownership
**Owner**: Member 3  
**Endpoints** (7 total):
```
GET      /api/profile-applications              ADMIN list (paginated/filter)
POST     /api/profile-applications              STUDENT submit
GET      /api/profile-applications/my-applications  STUDENT own apps
GET      /api/profile-applications/:id           ADMIN/STUDENT(own) detail
PUT      /api/profile-applications/:id           STUDENT(own pending) update
PATCH    /api/profile-applications/:id/review    ADMIN review (approve/reject)
GET      /api/profile-applications/:id/certificates  certs for app
```
**Out of scope**: Frontend integration, certificate CRUD (separate modules)

## 4. Architecture and Conventions
### 4.1 Response Envelope
Standard `{ success, data, error, meta }` via `src/utils/response.ts`

### 4.2 Validation and Error Details Rules
- Zod schemas per endpoint (query/body/params)
- Field errors → `details.fieldErrors`
- Business errors → `details.formErrors`
- 400 validation, 401/403 auth/role, 404 not found, 409 conflict (dup/pending/status)

### 4.3 Route Ordering
Static first: `/my-applications` before `/:id`

## 5. File Plan
### 5.1 New Files Created
```
src/
  constants/errors/profileApplication/
    ├── codes.ts          # PROFILE_APPLICATION_SUBMIT_ALREADY_PENDING etc.
    ├── messages.ts       # Vietnamese user messages
    └── fieldMessages.ts  # Zod field errors
  types/
    └── profileApplication.ts  # Params/Responses interfaces
  services/
    └── profileApplicationService.ts
  controllers/
    └── profileApplicationController.ts
  routes/
    └── profileApplicationRoute.ts  # mounted to index.ts
```

### 5.2 Mount Point
`src/routes/index.ts`: `router.use("/profile-applications", profileApplicationRoute);`

### 5.3 Error Constants
```
PROFILE_APPLICATION_SUBMIT_ALREADY_PENDING (409)
PROFILE_APPLICATION_UPDATE_NOT_PENDING (409)
PROFILE_APPLICATION_REVIEW_ALREADY_REVIEWED (409)
PROFILE_APPLICATION_DETAIL_NOT_FOUND (404)
...
```

## 6. Endpoint-by-Endpoint Implementation Plan

### 6.1 GET /api/profile-applications (ADMIN)
#### Authentication/Authorization
`requireAuth, requireRole("ADMIN")`

#### Validation (Zod)
```
page: int >=1 (default 1)
limit: int 1-100 (default 10)
search?: string max255
applicationStatus?: "PENDING|APPROVED|REJECTED"
submissionFrom/To?: date ISO
```

#### Service Logic
- Build Prisma `where` clause (search FullName insensitive, status filter, date range)
- `prisma.profileApplication.findMany()` + include student (ProfileID/FullName)
- `prisma.profileApplication.count()`
- Map to `ProfileApplicationListItem[]` + meta

#### Response Mapping
```
201: { data: ProfileApplicationListItem[], meta: {page,limit,total} }
```

### 6.2 POST /api/profile-applications (STUDENT)
#### Authentication/Authorization
`requireAuth, requireRole("STUDENT")`

#### Validation
No body. Extract `user.accountId` → find ProfileID

#### Service Logic
- Find student profile by AccountID → 404 if missing
- Check existing PENDING for student → 409 if found
- `prisma.profileApplication.create()`: StudentProfileID, status="PENDING", SubmissionDate=now()

#### Response
```
201: { ApplicationID, StudentProfileID, ApplicationStatus: "PENDING", SubmissionDate }
```

### 6.3 GET /api/profile-applications/my-applications (STUDENT)
#### Authentication/Authorization
`requireAuth, requireRole("STUDENT")`

#### Validation
Same as 6.1

#### Service Logic
- Find student ProfileID → 404 missing
- `findMany(where: {StudentProfileID})` paginated no includes needed
- Basic mapping (FullName empty)

#### Response
Same as 6.1

### 6.4 GET /api/profile-applications/:id (ADMIN/STUDENT own)
#### Authentication/Authorization
`requireAuth` (permission check in service)

#### Validation
`id: int >0`

#### Service Logic
- `findUnique(id)` include student/reviewer (names), count CertificateDetail
- Map to `ProfileApplicationDetail`

#### Response
```
200: ProfileApplicationDetail
```

### 6.5 PUT /api/profile-applications/:id (STUDENT own pending)
#### Authentication/Authorization
`requireAuth, requireRole("STUDENT")`

#### Validation
`id: int >0`, empty body

#### Service Logic
- Verify owner (StudentProfileID == current profile)
- Verify PENDING → 409 if reviewed
- `update`: touch SubmissionDate

#### Response
```
200: { ApplicationID, StudentProfileID, status, SubmissionDate }
```

### 6.6 PATCH /api/profile-applications/:id/review (ADMIN)
#### Authentication/Authorization
`requireAuth, requireRole("ADMIN")`

#### Validation
```
applicationStatus: "APPROVED|REJECTED"
reviewNotes?: string max1000
```

#### Service Logic
- Verify PENDING → 409 reviewed
- `update`: status, ReviewedByProfileID (admin profile), ReviewDate=now(), ReviewNotes

#### Response
```
200: { ApplicationID, status, ReviewedByProfileID, ReviewDate, ReviewNotes }
```

### 6.7 GET /api/profile-applications/:id/certificates
#### Authentication/Authorization
`requireAuth`

#### Validation
`id: int >0`

#### Service Logic
- `certificateDetail.findMany({ApplicationID})` include certificateType (TypeName)
- 404 if empty

#### Response
```
200: CertificateDetail[] with type names
```

## 7. API Document Update Plan
Add section 12 to `backend/docs/API_Document.md` matching above contracts.

## 8. Postman Collection Test Plan
### 8.1 Pre-setup (Collection Variables)
```
admin_token: Bearer token from login (ADMIN)
student_token: Bearer token (STUDENT)
existing_app_id: ID from submit test
pending_app_id: ID pending app
reviewed_app_id: ID APPROVED/REJECTED
```

### 8.2 GET /api/profile-applications (ADMIN list)
```
✓ Success paginated page=1 limit=10
✓ Filter applicationStatus=PENDING
✓ Search by student name
✓ Invalid page=0 → 400
✓ STUDENT role → 403
✓ No token → 401
```

### 8.3 POST /api/profile-applications (submit)
```
✓ STUDENT success → 201 new ID
✓ STUDENT already pending → 409
✓ No profile → 404
✓ ADMIN role → 403
✓ No token → 401
```

### 8.4 GET /api/profile-applications/my-applications
```
✓ STUDENT success paginated
✓ STUDENT no profile → 404
✓ ADMIN → 403
✓ No token → 401
```

### 8.5 GET /api/profile-applications/:id
```
✓ ADMIN success detail
✓ STUDENT own success
✓ Invalid id → 400
✓ No token → 401
```

### 8.6 PUT /api/profile-applications/:id
```
✓ STUDENT own pending → 200 updated SubmissionDate
✓ Not pending → 409
✓ Not owner → 403
✓ ADMIN → 403
```

### 8.7 PATCH /api/profile-applications/:id/review
```
✓ ADMIN pending → 200 APPROVED
✓ ADMIN pending → 200 REJECTED
✓ Already reviewed → 409
✓ STUDENT → 403
✓ Invalid status → 400
```

### 8.8 GET /api/profile-applications/:id/certificates
```
✓ Success (assume certs exist)
✓ No certs → 404
✓ Invalid id → 400
```

### 8.9 Postman Variable Additions
```
student_token, admin_token, pending_app_id, reviewed_app_id
```

## 9. Delivery Sequence
1. Constants/types → service → controller → route → mount → plan MD → Postman
2. `pnpm build` passes
3. Manual tests + Postman full run
4. Commit `feat(profile-application): implement full module + tests`

## 10. Done Criteria
- [ ] All 7 endpoints implemented + guarded
- [ ] `pnpm build` clean
- [ ] Postman: 100% pass rate on new folder (20+ cases)
- [ ] Manual test: submit → list → update → review → certificates flow
- [ ] API_Document.md updated (if needed)
- [ ] Matches conventions (Vietnamese logic messages, English plan/docs)
- [ ] No regressions in existing endpoints (postman auth/rooms etc. pass)

