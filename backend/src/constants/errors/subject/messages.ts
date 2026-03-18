export const SUBJECT_ERROR_MESSAGES = {
  SUBJECT_LIST_INVALID_QUERY: "Tham số truy vấn môn học không hợp lệ",
  SUBJECT_CREATE_INVALID_INPUT: "Dữ liệu tạo môn học không hợp lệ",
  SUBJECT_CREATE_NAME_EXISTS: "Tên môn học đã tồn tại",
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
} as const;
