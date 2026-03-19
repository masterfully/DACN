export const USAGE_ERROR_MESSAGES = {
  // Query
  USAGE_LIST_INVALID_QUERY: "Tham số truy vấn lịch sử sử dụng không hợp lệ",

  // Create / Update
  USAGE_CREATE_INVALID_INPUT: "Dữ liệu tạo lịch sử sử dụng không hợp lệ",
  USAGE_UPDATE_INVALID_INPUT: "Dữ liệu cập nhật lịch sử sử dụng không hợp lệ",

  // Params
  USAGE_PARAM_INVALID_ID: "Mã lịch sử sử dụng không hợp lệ",
  USAGE_PARAM_INVALID_SECTION_ID: "Mã khu vực không hợp lệ",

  // Not found
  USAGE_GET_NOT_FOUND: "Không tìm thấy lịch sử sử dụng",
  USAGE_UPDATE_NOT_FOUND: "Không tìm thấy lịch sử sử dụng để cập nhật",
  USAGE_DELETE_NOT_FOUND: "Không tìm thấy lịch sử sử dụng để xóa",

  // Business
  USAGE_CREATE_ROOM_NOT_FOUND: "Phòng không tồn tại",
  USAGE_TIME_OVERLAP: "Phòng đã được sử dụng trong khoảng thời gian này",

  // Section
  USAGE_LINK_SECTION_EXISTS: "Khu vực đã được liên kết với lịch sử này",
  USAGE_LINK_SECTION_NOT_FOUND: "Không tìm thấy khu vực",
  USAGE_UNLINK_SECTION_NOT_LINKED: "Khu vực chưa được liên kết với lịch sử này",

  // Delete
  USAGE_DELETE_HAS_SECTIONS: "Không thể xóa vì đang có khu vực liên kết",
} as const;
export const USAGE_FIELD_ERROR_MESSAGES = {
  ROOM_ID_REQUIRED: "Mã phòng là bắt buộc",
  ROOM_ID_INVALID: "Mã phòng phải là số nguyên dương",

  START_TIME_REQUIRED: "Thời gian bắt đầu là bắt buộc",
  START_TIME_INVALID: "Thời gian bắt đầu không hợp lệ",

  END_TIME_REQUIRED: "Thời gian kết thúc là bắt buộc",
  END_TIME_INVALID: "Thời gian kết thúc không hợp lệ",

  TIME_RANGE_INVALID: "Thời gian kết thúc phải sau thời gian bắt đầu",

  SECTION_ID_INVALID: "Mã khu vực không hợp lệ",

  NOTE_MAX_LENGTH: "Ghi chú tối đa 255 ký tự",

  UPDATE_MIN_ONE_FIELD: "Cần ít nhất một trường để cập nhật",
} as const;

export const USAGE_SUCCESS_MESSAGES = {
  USAGE_CREATE_SUCCESS: "Tạo lịch sử sử dụng thành công",
  USAGE_UPDATE_SUCCESS: "Cập nhật lịch sử sử dụng thành công",
  USAGE_DELETE_SUCCESS: "Xóa lịch sử sử dụng thành công",
  USAGE_LINK_SUCCESS: "Liên kết khu vực thành công",
  USAGE_UNLINK_SUCCESS: "Hủy liên kết khu vực thành công",
} as const;