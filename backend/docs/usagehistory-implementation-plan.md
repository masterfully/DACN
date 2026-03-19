# UsageHistory Module Implementation Plan

## Task: Full CRUD UsageHistory + Section Linking

### Overview
Implement complete module for room usage history management with full CRUD and many-to-many linking with Section.

### Requirements

- **Base path**: `/api/usageHistories`
- **Authentication**: requireAuth all endpoints
- **Authorization**: ADMIN for CREATE/UPDATE/DELETE/LINK
- **Key features**:
  - Time overlap detection
  - Section linking (many-to-many)
  - Pagination + room filter
  - Transaction safety

### API Endpoints
| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/` | ✓ | - | List with pagination/filter |
| POST | `/` | ✓ | ADMIN | Create usage history |
| GET | `/:id` | ✓ | - | Get detail + linked sections |
| PUT | `/:id` | ✓ | ADMIN | Partial update |
| DELETE | `/:id` | ✓ | ADMIN | Delete (fail if linked) |
| POST | `/:id/sections/:sectionId` | ✓ | ADMIN | Link section |
| DELETE | `/:id/sections/:sectionId` | ✓ | ADMIN | Unlink section |

### Request/Response Examples

**POST /api/usageHistories**
```
curl -X POST http://localhost:8080/api/usageHistories \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": 1,
    "startTime": "2024-01-01T09:00:00Z",
    "endTime": "2024-01-01T11:00:00Z",
    "note": "Management meeting"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "UsageHistoryID": 1,
    "RoomID": 1,
    "StartTime": "2024-01-01T09:00:00.000Z",
    "EndTime": "2024-01-01T11:00:00.000Z",
    "Note": "Management meeting"
  },
  "error": null
}
```

### Files Created/Updated
1. **`src/services/usageHistoryService.ts`**
   - Zod schemas (create/update/list)
   - Prisma CRUD + timeOverlap check
   - Section link/unlink logic
   
2. **`src/controllers/usageHistoryController.ts`**
   - 7 handlers (CRUD + link/unlink)
   - Zod parsing + service calls
   
3. **`src/routes/usageHistoryRoute.ts`**
   - All 7 routes + middleware stack
   
4. **`src/constants/errors/usageHistory/`**
   - codes.ts + messages.ts

5. **`src/routes/index.ts`** (Mount router)

### Implementation Details
- **Validation**: Zod + refine(endTime > startTime), note max 255
- **Business logic**: 
  - Transactional overlap check (RoomID + time range)
  - Junction table for Section links
  - Prevent delete if linked sections exist
- **Pagination**: skip/take + total count
- **Projections**: Lean list, full detail with sections
- **Errors**: 400/404/409/403 mapping

### How To Test (Postman)
1. **Preparation**:
   - Create Room ID=1
   - Create Section ID=5  
   - Get admin accessToken

2. **Test sequence**:
```
1. POST /usageHistories  → Create ID=1 (201)
2. POST /usageHistories/1/sections/5 → Link (201)  
3. GET /usageHistories/1 → Verify sections (200)
4. DELETE /usageHistories/1 → Fail 409 (linked)
5. DELETE /usageHistories/1/sections/5 → Unlink (200)
6. DELETE /usageHistories/1 → Success (200)
```

3. **Error cases**:
   - Overlap time → 409 USAGE_TIME_OVERLAP
   - Invalid roomId → 404 (room not found)
   - Non-admin → 403
   - Invalid datetime → 400

### Status
- [x] Service layer (Zod + Prisma + transactions)
- [x] Controller handlers (7 endpoints)
- [x] Routes + middleware (auth/roles)
- [x] Error constants (codes + English messages)
- [x] Router mounting
- [x] Business rules (overlap, links, delete guard)
- [x] Full Postman collection

