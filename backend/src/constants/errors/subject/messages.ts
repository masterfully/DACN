export const SUBJECT_ERROR_MESSAGES = {
  SUBJECT_LIST_INVALID_QUERY: "Tham số truy vấn môn học không hợp lệ",
  SUBJECT_CREATE_INVALID_INPUT: "Dữ liệu tạo môn học không hợp lệ",
  SUBJECT_CREATE_NAME_EXISTS: "Tên môn học đã tồn tại",
  SUBJECT_PARAM_INVALID_ID: "Mã môn học không hợp lệ",
  SUBJECT_GET_NOT_FOUND: "Môn học không tồn tại",
  SUBJECT_UPDATE_INVALID_INPUT: "Dữ liệu cập nhật môn học không hợp lệ",
  SUBJECT_UPDATE_NOT_FOUND: "Môn học không tồn tại",
  SUBJECT_UPDATE_NAME_EXISTS: "Tên môn học đã tồn tại",
  SUBJECT_DELETE_NOT_FOUND: "Môn học không tồn tại",
  SUBJECT_DELETE_IN_USE:
    "Không thể xóa môn học đang được sử dụng trong lớp học phần",
} as const;

export const SUBJECT_FIELD_ERROR_MESSAGES = {
  SUBJECT_NAME_REQUIRED: "Tên môn học là bắt buộc",
  SUBJECT_NAME_INVALID_TYPE: "Tên môn học phải là chuỗi",
  PERIODS_REQUIRED: "Số tiết là bắt buộc",
  PERIODS_INVALID_TYPE: "Số tiết phải là số",
  PERIODS_INVALID_INTEGER: "Số tiết phải là số nguyên",
  PERIODS_INVALID_POSITIVE: "Số tiết phải lớn hơn 0",
  QUERY_PAGE_INVALID_INTEGER: "Trang phải là số nguyên",
  QUERY_PAGE_INVALID_POSITIVE: "Trang phải lớn hơn 0",
  QUERY_LIMIT_INVALID_INTEGER: "Giới hạn phải là số nguyên",
  QUERY_LIMIT_INVALID_POSITIVE: "Giới hạn phải lớn hơn 0",
  SUBJECT_ID_INVALID: "Mã môn học phải là số nguyên dương",
  UPDATE_AT_LEAST_ONE_FIELD: "Cần ít nhất một trường để cập nhật",
} as const;

