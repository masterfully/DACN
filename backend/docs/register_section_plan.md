# Register Section Implementation Plan

## 1. Mục tiêu

Implement endpoint `POST /api/registrations` theo tài liệu API mục **6.2 Register Section** để sinh viên đăng ký học phần.

Yêu cầu chính:
- Chỉ role `STUDENT` mới được đăng ký.
- Đảm bảo kiểm tra đầy đủ các điều kiện nghiệp vụ trước khi ghi dữ liệu.
- Cập nhật `EnrollmentCount` theo hướng **atomic** trong transaction.

## 2. Phạm vi

- In scope:
  - `POST /api/registrations`
  - Validate body request (`sectionId`)
  - Business guard:
    - section tồn tại
    - section đang mở đăng ký (`status = 1`)
    - section chưa đầy
    - sinh viên chưa đăng ký section đó
  - Tạo bản ghi `Registration`
  - Tăng `Section.EnrollmentCount`
  - Thêm test case Postman cho endpoint 6.2
- Out of scope:
  - `GET /api/registrations`
  - `DELETE /api/registrations/:sectionId`
  - `GET /api/registrations/my-registrations`
  - `GET /api/sections/:sectionId/registrations`

## 3. Tài liệu và chuẩn áp dụng

- API contract: `backend/docs/API_Document.md` (mục 6.2)
- Task phân công: `backend/docs/TASKS.md`
- Chuẩn response: `src/utils/response.ts`
- Chuẩn validate input: `src/utils/validation.ts`
- Chuẩn xử lý lỗi: `src/middleware/errorHandler.ts`
- Chuẩn route bảo mật: `requireAuth`, `requireRole`

## 4. Tóm tắt API Contract

- URL: `/api/registrations`
- Method: `POST`
- Auth: bắt buộc token + role `STUDENT`
- Request body:
  - `sectionId` (number, required, integer dương)
- Success response:
  - HTTP `201`
  - `{ success: true, data: null, error: null, meta: null }`
- Error response:
  - `400`: dữ liệu đầu vào không hợp lệ
  - `401`: thiếu/invalid token
  - `403`: sai role
  - `404`: không tìm thấy section hoặc hồ sơ sinh viên
  - `409`: section không mở / section đã đầy / đã đăng ký rồi

## 5. Thiết kế file/module

- Tạo mới:
  - `src/constants/errors/registration/codes.ts`
  - `src/constants/errors/registration/messages.ts`
  - `src/services/registrationService.ts`
  - `src/controllers/registrationController.ts`
  - `src/routes/registrationRoute.ts`
- Cập nhật:
  - `src/constants/errors/index.ts`
  - `src/routes/index.ts` (mount `/registrations`)
  - `backend/docs/postman/dacn-backend-test-cases.postman_collection.json`

## 6. Thiết kế xử lý nghiệp vụ

1. Xác định sinh viên từ token:
- Lấy `accountId` từ `req.user`.
- Tìm `UserProfile` theo `AccountID`.
- Nếu không có profile: trả lỗi `404`.

2. Validate section:
- Tìm section theo `sectionId`.
- Nếu không tồn tại: trả lỗi `SECTION_NOT_FOUND` (`404`).
- Nếu `status !== 1`: trả lỗi `SECTION_NOT_OPEN` (`409`).

3. Kiểm tra đã đăng ký chưa:
- Query `Registration` theo khóa ghép `(SectionID, StudentProfileID)`.
- Nếu đã tồn tại: trả lỗi `REGISTRATION_ALREADY_REGISTERED` (`409`).

4. Kiểm tra sức chứa:
- Nếu `EnrollmentCount >= MaxCapacity`: trả lỗi `SECTION_FULL` (`409`).

5. Ghi dữ liệu trong transaction:
- Tạo `Registration`.
- Tăng `EnrollmentCount` bằng update có điều kiện (`lt MaxCapacity`) để giảm rủi ro race condition.
- Nếu increment thất bại do trạng thái/sức chứa thay đổi giữa chừng: rollback và trả lỗi phù hợp.

## 7. Quy ước mã lỗi và message

- Mã lỗi chính:
  - `REGISTRATION_CREATE_INVALID_INPUT`
  - `STUDENT_PROFILE_NOT_FOUND`
  - `SECTION_NOT_FOUND`
  - `SECTION_NOT_OPEN`
  - `SECTION_FULL`
  - `REGISTRATION_ALREADY_REGISTERED`
- Message tiếng Việt có dấu, thống nhất theo API document và convention hiện tại của dự án.

## 8. Kế hoạch kiểm thử

### 8.1. Build check

- Chạy `pnpm build` trong `backend`.
- Yêu cầu: compile TypeScript thành công.

### 8.2. Test cases Postman cho 6.2

1. Register Section - Success (STUDENT) -> `201`
2. Register Section - Missing Token -> `401`
3. Register Section - Forbidden (ADMIN) -> `403`
4. Register Section - Missing sectionId -> `400`
5. Register Section - Invalid sectionId -> `400`
6. Register Section - Section Not Found -> `404`
7. Register Section - Section Not Open -> `409`
8. Register Section - Section Full -> `409`
9. Register Section - Already Registered -> `409`

## 9. Definition of Done

- Endpoint `POST /api/registrations` hoạt động đúng role `STUDENT`.
- Validate input đúng chuẩn và trả lỗi đúng format `{success,data,error,meta}`.
- Business guard được xử lý đầy đủ.
- Tạo đăng ký + tăng sĩ số theo transaction, hạn chế race condition.
- Postman collection có đủ test case cho flow 6.2.
- `pnpm build` pass.
