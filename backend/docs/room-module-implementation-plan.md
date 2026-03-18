# Kế hoạch triển khai Room Module - POST /api/rooms (Member 3)

## Nhiệm vụ: POST /api/rooms — Tạo phòng học

### Tổng quan
Triển khai endpoint POST tạo phòng học mới. Chỉ ADMIN được phép, kiểm tra tên phòng unique.

### Yêu cầu
- **Đường dẫn**: `POST /api/rooms`
- **Xác thực**: Bắt buộc (`Authorization: Bearer <token>`)
- **Phân quyền**: Chỉ ADMIN
- **Request Body**:
  - `roomName` (string, bắt buộc): Tên phòng
  - `roomType` (string, tùy chọn): Loại phòng
  - `campus` (string, tùy chọn): Cơ sở
  - `capacity` (number > 0, tùy chọn): Sức chứa
  - `status` (string, tùy chọn): Trạng thái
- **Response**:
  - Thành công (201): Trả về phòng đã tạo với ID
  - Lỗi xác thực (400): Input không hợp lệ
  - Không có quyền (401): Token thiếu/sai
  - Không đủ quyền (403): Không phải ADMIN
  - Conflict (409): Tên phòng đã tồn tại

### File được tạo
1. **`src/services/roomService.ts`**
   - `createRoom(data)` — Prisma tạo record + kiểm tra unique

2. **`src/controllers/roomController.ts`**
   - `createRoomHandler` — Zod validation + gọi service + format response

3. **`src/routes/roomRoute.ts`** 
   - Định nghĩa POST route + `requireAuth` + `requireRole("ADMIN")`

4. **`src/routes/index.ts`** (Cập nhật)
   - Mount `/rooms` routes

### Chi tiết triển khai
- **Validation**: Zod schema: `roomName.min(1)`, `capacity.int().min(1)`
- **Database**: Prisma `room.create()` sau kiểm tra `room.findUnique(RoomName)`
- **Response**: `sendSuccess(res, room, 201)` 
- **Error**: `AppError(409, "ROOM_NAME_EXISTS")`

### Test
```
curl -X POST http://localhost:8080/api/rooms \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "roomName": "A101", 
    "capacity": 50, 
    "campus": "CS1"
  }'
```

**Response mong đợi (201):**
```json
{
  "success": true,
  "data": {
    "RoomID": 1,
    "RoomName": "A101",
    "Capacity": 50,
    "Campus": "CS1"
  },
  "error": null
}
```

### Trạng thái
- [x] Tạo service layer
- [x] Controller + validation
- [x] Route + middleware
- [x] Mount router
- [ ] Test endpoint
