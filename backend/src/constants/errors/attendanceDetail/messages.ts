export const ATTENDANCE_DETAIL_ERROR_MESSAGES = {
  ATTENDANCE_DETAIL_LIST_INVALID_QUERY:
    "Tham số truy vấn danh sách chi tiết điểm danh không hợp lệ",
  ATTENDANCE_DETAIL_CREATE_INVALID_INPUT:
    "Dữ liệu tạo chi tiết điểm danh không hợp lệ",
  ATTENDANCE_DETAIL_UPDATE_INVALID_INPUT:
    "Dữ liệu cập nhật chi tiết điểm danh không hợp lệ",
  ATTENDANCE_DETAIL_PARAM_INVALID_ATTENDANCE_ID:
    "Mã buổi điểm danh không hợp lệ",
  ATTENDANCE_DETAIL_PARAM_INVALID_DETAIL_ID:
    "Mã chi tiết điểm danh không hợp lệ",
  ATTENDANCE_DETAIL_LIST_ATTENDANCE_NOT_FOUND:
    "Buổi điểm danh không tồn tại",
  ATTENDANCE_DETAIL_CREATE_ATTENDANCE_NOT_FOUND:
    "Buổi điểm danh không tồn tại",
  ATTENDANCE_DETAIL_CREATE_ALREADY_EXISTS:
    "Chi tiết điểm danh cho buổi này đã được tạo",
  ATTENDANCE_DETAIL_UPDATE_NOT_FOUND:
    "Chi tiết điểm danh không tồn tại",
} as const;

export const ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES = {
  QUERY_PAGE_INVALID_INTEGER: "page phải là số nguyên",
  QUERY_PAGE_INVALID_POSITIVE: "page phải lớn hơn 0",
  QUERY_LIMIT_INVALID_INTEGER: "limit phải là số nguyên",
  QUERY_LIMIT_INVALID_POSITIVE: "limit phải lớn hơn 0",
  QUERY_LIMIT_INVALID_MAX: "limit tối đa là 100",
  QUERY_STUDENT_PROFILE_ID_INVALID:
    "studentProfileId phải là số nguyên dương",
  QUERY_STATUS_INVALID:
    "status chỉ chấp nhận: PRESENT, ABSENT, EXCUSED_ABSENCE, LATE",
  ATTENDANCE_ID_INVALID: "attendanceId phải là số nguyên dương",
  DETAIL_ID_INVALID: "detailId phải là số nguyên dương",
  DETAILS_REQUIRED: "Bắt buộc nhập details",
  DETAILS_INVALID_TYPE: "details phải là mảng",
  DETAILS_MIN_ITEMS: "details cần ít nhất 1 phần tử",
  STUDENT_PROFILE_ID_REQUIRED: "Bắt buộc nhập studentProfileId",
  STUDENT_PROFILE_ID_INVALID:
    "studentProfileId phải là số nguyên dương",
  STATUS_REQUIRED: "Bắt buộc nhập status",
  STATUS_INVALID:
    "status chỉ chấp nhận: PRESENT, ABSENT, EXCUSED_ABSENCE, LATE",
  NOTE_INVALID: "note phải là chuỗi hoặc null",
  UPDATE_MIN_ONE_FIELD: "Cần ít nhất một trường để cập nhật",
  DUPLICATE_STUDENT_PROFILE_ID:
    "details không được trùng studentProfileId trong cùng một yêu cầu",
  STUDENT_PROFILE_ID_NOT_FOUND:
    "Không tìm thấy studentProfileId trong hệ thống",
} as const;
