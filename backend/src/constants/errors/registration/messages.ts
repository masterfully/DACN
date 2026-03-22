export const REGISTRATION_ERROR_MESSAGES = {
  REGISTRATION_CREATE_INVALID_INPUT: "Dữ liệu đăng ký học phần không hợp lệ",
  REGISTRATION_CREATE_STUDENT_PROFILE_NOT_FOUND: "Không tìm thấy hồ sơ sinh viên",
  REGISTRATION_CREATE_SECTION_NOT_FOUND: "Lớp học phần không tồn tại",
  REGISTRATION_CREATE_SECTION_NOT_OPEN: "Lớp học phần không mở đăng ký",
  REGISTRATION_CREATE_SECTION_FULL: "Lớp học phần đã đạt sĩ số tối đa",
  REGISTRATION_CREATE_ALREADY_REGISTERED: "Bạn đã đăng ký lớp học phần này",
} as const;

export const REGISTRATION_FIELD_ERROR_MESSAGES = {
  SECTION_ID_REQUIRED: "Bắt buộc nhập sectionId",
  SECTION_ID_INVALID: "sectionId phải là số nguyên dương",
} as const;
