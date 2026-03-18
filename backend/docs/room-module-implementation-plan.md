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
- **Error**: `AppError(409, "ROOM_CREATE_NAME_EXISTS")`

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

### How To Test (Postman)
1. Chuẩn bị token ADMIN
  - Gọi endpoint auth để lấy `accessToken` của tài khoản có role `ADMIN`.
  - Nếu vừa đổi role trong DB, cần tạo token mới (token cũ vẫn chứa role cũ).

2. Tạo request
  - Method: `POST`
  - URL: `{{base_url}}/api/rooms`
  - Headers:
    - `Authorization: Bearer <admin-access-token>`
    - `Content-Type: application/json`
  - Body (raw JSON):

```json
{
  "roomName": "A101",
  "capacity": 50,
  "campus": "CS1"
}
```

3. Kết quả mong đợi
  - `201 Created`: tạo phòng thành công.
  - `409 Conflict`: `roomName` đã tồn tại.
  - `400 Bad Request`: dữ liệu sai định dạng (ví dụ `capacity <= 0`, `roomName` rỗng).
  - `401 Unauthorized`: thiếu token hoặc token sai/hết hạn.
  - `403 Forbidden`: token không phải `ADMIN`.

4. Validation cases nên test thêm
  - `roomName` thiếu.
  - `roomName` là chuỗi rỗng hoặc chỉ có khoảng trắng.
  - `capacity` là số âm, 0, hoặc số thập phân.
  - Payload có field không hợp lệ.
  - Tạo 2 lần cùng `roomName` để kiểm tra conflict.

### Trạng thái
- [x] Tạo service layer
- [x] Controller + validation
- [x] Route + middleware
- [x] Mount router
- [ ] Test endpoint
