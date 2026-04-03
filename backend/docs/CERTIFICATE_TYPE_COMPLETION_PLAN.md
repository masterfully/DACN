# CERTIFICATE_TYPE_COMPLETION_PLAN.md

## Module Overview
The CertificateType module manages master data for certificate categories in an academic profile certification system. It provides full CRUD operations on certificate types, serving as the foundational reference for CertificateDetail records. This is a pure master data module with no business workflow dependencies.

## Architectural Position in the System
- **Layer**: Master Data Management (Reference Data)
- **Position**: Foundational layer for CertificateDetail module (1:N relationship)
- **Mount path**: `/api/certificate-types`
- **Consumers**: CertificateService (foreign key validation), Frontend (type dropdowns)
- **Dependencies**: Prisma CertificateType model only

## Dependency Rules
**USES**:
- Prisma: CertificateType model, CertificateDetail.count() for referential integrity
- Zod: Inline validation schemas per operation
- Auth middleware: requireAuth, requireRole('ADMIN')

**DOES NOT USE**:
- Other business services (pure isolation)
- ProfileApplication/CertificateDetail workflows
- Complex business rules beyond uniqueness and referential integrity

## Data Model & Relationships
```
CertificateType {
  CertificateTypeID Int @id @default(autoincrement())
  TypeName          String @db.VarChar(255)  // UNIQUE enforced at service
  Description       String?
  
  certificateDetails CertificateDetail[]
}
```
- **PK**: CertificateTypeID (autoincrement)
- **Business Key**: TypeName (UNIQUE enforced in service layer, not DB)
- **1:N**: CertificateType → CertificateDetail (delete cascade protection)

## Endpoint Specifications
| Method | Path                  | Role Required       | Validation Schema |
|--------|-----------------------|---------------------|-------------------|
| GET    | /                     | None (Public)       | `page>=1, limit=1-100, search?` |
| POST   | /                     | ADMIN               | `typeName:1-255*, description<=1000?` |
| GET    | /:typeId              | None (Public)       | `typeId: valid int` |
| PUT    | /:typeId              | ADMIN               | `typeName:1-255?, description<=1000?` |
| DELETE | /:typeId              | ADMIN               | `typeId: valid int` |

## Business Rules & Constraints
1. **Uniqueness**: TypeName UNIQUE across all records (checked create/update)
2. **Referential Integrity**: Cannot DELETE if any CertificateDetail references it
3. **Validation**:
   - typeName: required(1-255 chars)
   - description: optional(<=1000 chars)
4. **Pagination**: Default page=1, limit=10 (max100), search insensitive TypeName
5. **Ordering**: newest CertificateTypeID first
6. **No soft delete**: Hard DELETE after integrity check

**Not enforced at service level**:
- TypeName format/content (any non-empty string)
- Description content
- Max number of types
- Audit trail (no createdBy/updatedBy)

## Data Flow (step-by-step)
**List (GET /**):
1. Zod.parse query → validated params
2. Build Prisma where (search TypeName insensitive)
3. Parallel: findMany(paginated, select id/name/desc) + count()
4. Transform → {data[], meta{page,limit,total}}

**Create (POST /**):
1. Zod.parse body
2. Check existing TypeName → 409 if duplicate
3. prisma.create → select id/name/desc
4. Transform response

**Read (GET /:id**):
1. parseInt(id) → throw 400 if NaN
2. prisma.findUnique → 404 if null
3. Transform response

**Update (PUT /:id**):
1. parseInt(id) → 404 if not found
2. If new typeName && != old && exists → 409
3. prisma.update → transform

**Delete (DELETE /:id**):
1. count CertificateDetail → 409 if >0
2. findUnique → 404 if null
3. prisma.delete → {deleted:true}

## Edge Cases handled in code
- Invalid ID param → 400 with fieldError{id}
- Duplicate TypeName → 409 business error
- Delete with dependencies → 409 with usage count check
- Pagination edge (page=1 limit=100 max)
- Empty search → all records
- Partial update (only description)

**Not handled**:
- Concurrent create with same name (race condition possible)
- Very long searches

## Testing Recommendations
```
Unit (Service):
- create unique → success
- create duplicate name → 409
- update name collision → 409  
- delete referenced → 409
- delete non-referenced → success
- pagination + search

Integration (Controller+Service):
- Public GET list/single
- ADMIN POST/PUT/DELETE
- Invalid ID → 400
- Unauthorized → 401
- Forbidden (non-ADMIN) → 403

E2E:
- Full CRUD cycle with CertificateDetail dependency
- Pagination boundaries
```
**Coverage targets**: 95% services, 90% controllers

## Future Improvement Suggestions
1. **Add audit fields**: createdAt/updatedAt/createdBy (adminAccountId)
2. **DB UNIQUE constraint** on TypeName (remove service check)
3. **Soft delete** for types (status field)
4. **Caching** for list (Redis, 5min TTL)
5. **Bulk operations** (create/update many)
6. **TypeName enum suggestions** (Olympic, IELTS, etc.)
7. **Internationalization** support (name_i18n JSON)

