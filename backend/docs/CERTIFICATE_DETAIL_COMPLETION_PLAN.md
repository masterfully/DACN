# CERTIFICATE_DETAIL_COMPLETION_PLAN.md

## Module Overview
CertificateDetail module manages individual certificate records linked to approved student ProfileApplications. Admin-only CRUD with strict business rules enforcing workflow prerequisites and data integrity. Single certificate read accessible to any authenticated user.

## Architectural Position in the System
- **Layer**: Business Workflow (Certification)
- **Position**: Dependent on ProfileApplication (must be APPROVED) + CertificateType
- **Mount path**: `/api/certificates`
- **Consumers**: StudentCertificates view, Frontend admin panels
- **Dependencies**: CertificateType (FK), ProfileApplication (FK + status check)

## Dependency Rules
**USES**:
- Prisma: CertificateDetail (main), CertificateType (FK), ProfileApplication (status)
- Zod: Complex inline schemas with dates/URLs
- Auth: requireAuth everywhere, requireRole('ADMIN') for list/create/update/delete

**DOES NOT USE**:
- Direct UserProfile access (via junction StudentCertificates)
- Attendance/Section/Subject workflows
- File upload service (EvidenceURL is simple string)

## Data Model & Relationships
```
CertificateDetail {
  CertificateID     Int      @id @default(autoincrement())
  ApplicationID     Int      // FK: ProfileApplication (must be APPROVED)
  CertificateTypeID Int      // FK: CertificateType
  Score             Float?   // 0-10 validation
  IssueDate         DateTime? @db.Date
  ExpiryDate        DateTime? @db.Date  
  EvidenceURL       String?  @db.VarChar(255)  // URL validated
  Metadata          Json?

  application      ProfileApplication @relation(fields: [ApplicationID], ...)
  certificateType  CertificateType    @relation(fields: [CertificateTypeID], ...)
  studentCertificates StudentCertificates[]
}
```
- **Composite Business Key**: ApplicationID + CertificateTypeID (service-enforced unique)
- **N:1**: CertificateDetail → ProfileApplication, CertificateType
- **1:N**: CertificateDetail → StudentCertificates (junction)

## Endpoint Specifications
| Method | Path                  | Role Required     | Validation Schema |
|--------|-----------------------|-------------------|-------------------|
| GET    | /                     | ADMIN             | `page>=1, limit=1-100, typeId?, search?` |
| POST   | /                     | ADMIN             | `appId:int*, typeId:int*, score:0-10?, dates?, evidence:url?, metadata:any?` |
| GET    | /:certId              | AUTH (any role)   | `certId: valid int` |
| PUT    | /:certId              | ADMIN             | `score:0-10?, dates?, evidence:url?, metadata?` |
| DELETE | /:certId              | ADMIN             | `certId: valid int` |

## Business Rules & Constraints
1. **Workflow Prerequisite**: ProfileApplication.ApplicationStatus === \"APPROVED\" (create)
2. **Uniqueness**: No duplicate (ApplicationID, CertificateTypeID) per application
3. **Type Existence**: CertificateTypeID must exist
4. **Date Rules**:
   - Input: YYYY-MM-DD string parsed to Date @00:00Z
   - issueDate <= expiryDate (if both present)
   - Invalid date strings → fieldError{issueDate/expiryDate}
5. **Score**: number min(0) max(10)
6. **EvidenceURL**: z.string().url()
7. **Metadata**: record<any> → JSON stored
8. **GET /:id**: No authorization beyond auth; exposes any student's cert details

**Not enforced at service level**:
- Score precision/rounding
- Metadata structure
- Expiry business logic (passive storage)
- Per-application cert limits
- Ownership (any auth reads any cert)

## Data Flow (step-by-step)
**List (GET /**):
1. Zod.parse query params
2. where: typeId? + OR(search typeName/evidence insensitive)
3. prisma.findMany(include:certificateType) paginated + count parallel
4. Transform: dates YYYY-MM-DD, typeName

**Create (POST /**, adminAccountId from middleware):
1. Zod.parse body
2. prisma ProfileApplication → 404/409 if !exists/!\"APPROVED\"
3. prisma CertificateType → 404 if !exists
4. findFirst appId+typeId → 409 duplicate
5. Parse dates YYYY-MM-DD→Date, validate order → fieldErrors
6. prisma.create(data) include type/application{StudentProfileID}
7. Transform full response with studentProfileId

**Read (GET /:certId, requireAuth only):
1. prisma.findUnique include certificateType + application{StudentProfileID}
2. 404 if null
3. Transform: dates split('T')[0], metadata JSON.parse, studentProfileId exposed

**Update (PUT /:certId):
1. findUnique → 404
2. Re-parse dates/validate as create (no app/type change)
3. prisma.update → include/transform same as read

**Delete (DELETE /:certId):
1. findUnique → 404
2. prisma.delete hard
3. {deleted:true}

## Edge Cases handled in code
- Missing/unapproved ProfileApplication → explicit 404/409
- Missing CertificateType → 404
- Duplicate app+type combo → 409
- Invalid date format/order → 400 fieldErrors{issueDate/expiryDate}
- Invalid evidence URL → Zod 400
- Search matches typeName OR evidenceURL insensitive
- Zero-score certificates allowed

**Not handled**:
- Soft delete/cascade to StudentCertificates
- Audit trail (adminAccountId passed to create but unused)
- Concurrency (race conditions possible)

## Testing Recommendations
```
Unit (Service):
- create: approved app+unique type → success w/ studentProfileId
- create: unapproved app → 409 \"must be approved\"
- create: duplicate app+type → 409
- create/update: dates invalid/order → fieldErrors
- create: invalid appId/typeId → 404s

Integration (Controller+Service):
- ADMIN: full CRUD
- AUTH-LECTURER/STUDENT: GET/:id success (no role check)
- Invalid auth → 401; non-ADMIN writes → 403

E2E:
- ProfileApplication APPROVED → cert create success
- CertType delete blocked by existing certs (upstream)
```
**Coverage targets**: 98% services (complex validation)

## Future Improvement Suggestions
1. **Ownership checks** for GET (student/parent own certs only)
2. **StudentCertificates auto-management** (create junction on cert create)
3. **Certificate PDF generation** service
4. **Metadata typed schemas** per CertificateType
5. **Bulk certification** for multiple apps
6. **Auto-expiry** cron job (status update)
7. **Audit logging** (who/when issued using adminAccountId)
8. **Evidence file upload** + URL generation

