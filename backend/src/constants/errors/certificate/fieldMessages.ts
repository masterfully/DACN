export const CERTIFICATE_FIELD_ERROR_MESSAGES = {
  APPLICATION_ID_REQUIRED: "Mã hồ sơ là bắt buộc",
  APPLICATION_ID_INVALID: "Mã hồ sơ không hợp lệ",
  CERTIFICATE_TYPE_ID_REQUIRED: "Mã loại chứng chỉ là bắt buộc",
  CERTIFICATE_TYPE_ID_INVALID: "Mã loại chứng chỉ không hợp lệ",
  SCORE_INVALID: "Điểm số phải là số từ 0 đến 10",
  ISSUE_DATE_INVALID: "Ngày cấp phải là ngày hợp lệ",
  EXPIRY_DATE_INVALID: "Ngày hết hạn phải là ngày hợp lệ",
  ISSUE_DATE_AFTER_EXPIRY: "Ngày cấp không được sau ngày hết hạn",

  QUERY_PAGE_INVALID_INTEGER: "Trang phải là số nguyên dương",
  QUERY_LIMIT_INVALID_INTEGER: "Số lượng mỗi trang phải là số nguyên từ 1 đến 100",
} as const;

