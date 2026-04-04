export const PARENT_ERROR_MESSAGES = {
  PARENT_ASSIGN_INVALID_INPUT: "Dữ liệu gán phụ huynh cho học sinh không hợp lệ",
  PARENT_ASSIGN_STUDENT_OR_PARENT_NOT_FOUND:
    "Học sinh hoặc phụ huynh không tồn tại",
  PARENT_ASSIGN_ALREADY_LINKED: "Phụ huynh này đã được gán cho học sinh này",
  PARENT_UNASSIGN_INVALID_QUERY:
    "Tham số truy vấn hủy liên kết phụ huynh - học sinh không hợp lệ",
  PARENT_UNASSIGN_LINK_NOT_FOUND: "Liên kết phụ huynh - học sinh không tồn tại",
  PARENT_STUDENT_PARENTS_INVALID_STUDENT_ID: "studentId không hợp lệ",
  PARENT_STUDENT_PARENTS_INVALID_QUERY:
    "Tham số truy vấn danh sách phụ huynh của học sinh không hợp lệ",
  PARENT_STUDENT_PARENTS_STUDENT_NOT_FOUND: "Học sinh không tồn tại",
} as const;

export const PARENT_SUCCESS_MESSAGES = {
  PARENT_ASSIGN_SUCCESS: "Gán phụ huynh cho học sinh thành công",
  PARENT_UNASSIGN_SUCCESS: "Hủy liên kết phụ huynh - học sinh thành công",
} as const;

export const PARENT_FIELD_ERROR_MESSAGES = {
  STUDENT_ID_REQUIRED: "Bắt buộc nhập studentId",
  STUDENT_ID_INVALID: "studentId phải là số nguyên dương",
  PARENT_ID_REQUIRED: "Bắt buộc nhập parentId",
  PARENT_ID_INVALID: "parentId phải là số nguyên dương",
  QUERY_STUDENT_ID_INVALID: "studentId phải là số nguyên dương",
  QUERY_PAGE_INVALID_INTEGER: "page phải là số nguyên",
  QUERY_PAGE_INVALID_POSITIVE: "page phải lớn hơn 0",
  QUERY_LIMIT_INVALID_INTEGER: "limit phải là số nguyên",
  QUERY_LIMIT_INVALID_POSITIVE: "limit phải lớn hơn 0",
  QUERY_LIMIT_INVALID_MAX: "limit phải nhỏ hơn hoặc bằng 100",
} as const;