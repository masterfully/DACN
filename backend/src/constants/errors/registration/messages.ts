export const REGISTRATION_ERROR_MESSAGES = {
  REGISTRATION_LIST_INVALID_QUERY:
    "Tham số truy vấn danh sách đăng ký không hợp lệ",
  REGISTRATION_MY_LIST_INVALID_QUERY:
    "Tham số truy vấn danh sách đăng ký của tôi không hợp lệ",
  REGISTRATION_SECTION_LIST_INVALID_QUERY:
    "Tham số truy vấn danh sách đăng ký theo lớp học phần không hợp lệ",
  REGISTRATION_PARAM_INVALID_SECTION_ID: "sectionId không hợp lệ",
  REGISTRATION_CREATE_INVALID_INPUT: "Dữ liệu đăng ký học phần không hợp lệ",
  REGISTRATION_CREATE_STUDENT_PROFILE_NOT_FOUND:
    "Không tìm thấy hồ sơ sinh viên cho tài khoản hiện tại",
  REGISTRATION_CREATE_SECTION_NOT_FOUND: "Lớp học phần không tồn tại",
  REGISTRATION_CREATE_SECTION_NOT_OPEN: "Lớp học phần không mở đăng ký",
  REGISTRATION_CREATE_SECTION_FULL: "Lớp học phần đã đạt sĩ số tối đa",
  REGISTRATION_CREATE_ALREADY_REGISTERED: "Bạn đã đăng ký lớp học phần này",
  REGISTRATION_LIST_STUDENT_PROFILE_NOT_FOUND:
    "Không tìm thấy hồ sơ sinh viên cho tài khoản hiện tại",
  REGISTRATION_CANCEL_STUDENT_PROFILE_NOT_FOUND:
    "Không tìm thấy hồ sơ sinh viên cho tài khoản hiện tại",
  REGISTRATION_CANCEL_NOT_FOUND: "Bạn chưa đăng ký lớp học phần này",
  REGISTRATION_SECTION_LIST_SECTION_NOT_FOUND: "Lớp học phần không tồn tại",
} as const;

export const REGISTRATION_FIELD_ERROR_MESSAGES = {
  SECTION_ID_REQUIRED: "Bắt buộc nhập sectionId",
  SECTION_ID_INVALID: "sectionId phải là số nguyên dương",
  QUERY_PAGE_INVALID_INTEGER: "page phải là số nguyên",
  QUERY_PAGE_INVALID_POSITIVE: "page phải lớn hơn 0",
  QUERY_LIMIT_INVALID_INTEGER: "limit phải là số nguyên",
  QUERY_LIMIT_INVALID_POSITIVE: "limit phải lớn hơn 0",
  QUERY_LIMIT_INVALID_MAX: "limit phải nhỏ hơn hoặc bằng 100",
  QUERY_SECTION_ID_INVALID: "sectionId phải là số nguyên dương",
  QUERY_STUDENT_PROFILE_ID_INVALID: "studentProfileId phải là số nguyên dương",
  QUERY_STATUS_INVALID: "status chỉ nhận một trong các giá trị 0, 1 hoặc 2",
  QUERY_YEAR_INVALID_FORMAT: "year phải theo định dạng YYYY-YYYY",
  QUERY_SEARCH_INVALID: "search phải là chuỗi",
} as const;
