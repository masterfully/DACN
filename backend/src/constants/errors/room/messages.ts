export const ROOM_ERROR_MESSAGES = {
  ROOM_LIST_INVALID_QUERY: "Tham số truy vấn phòng không hợp lệ",
  ROOM_CREATE_INVALID_INPUT: "Dữ liệu tạo phòng không hợp lệ",
  ROOM_AVAILABILITY_INVALID_QUERY: "Tham số tìm phòng trống không hợp lệ",
  ROOM_UPDATE_INVALID_INPUT: "Dữ liệu cập nhật phòng không hợp lệ",
  ROOM_PARAM_INVALID_ID: "Mã phòng không hợp lệ",
  ROOM_CREATE_NAME_EXISTS: "Tên phòng đã tồn tại",
  ROOM_GET_NOT_FOUND: "Không tìm thấy phòng",
  ROOM_DELETE_HAS_SCHEDULES: "Không thể xóa phòng vì đang có lịch học",
} as const;

export const ROOM_FIELD_ERROR_MESSAGES = {
  ROOM_NAME_REQUIRED: "Tên phòng là bắt buộc",
  ROOM_NAME_INVALID_TYPE: "Tên phòng phải là chuỗi",
  ROOM_NAME_MAX_LENGTH: "Tên phòng tối đa 255 ký tự",
  SHORT_TEXT_REQUIRED: "Giá trị không được để trống",
  SHORT_TEXT_MAX_LENGTH: "Giá trị tối đa 255 ký tự",
  CAPACITY_INVALID_INTEGER: "Sức chứa phải là số nguyên",
  CAPACITY_INVALID_POSITIVE: "Sức chứa phải lớn hơn 0",
  CAPACITY_MAX: "Sức chứa tối đa là 1000",
  UPDATE_MIN_ONE_FIELD: "Cần ít nhất một trường để cập nhật",
  QUERY_PAGE_INVALID_INTEGER: "Trang phải là số nguyên",
  QUERY_PAGE_MIN: "Trang phải lớn hơn hoặc bằng 1",
  QUERY_LIMIT_INVALID_INTEGER: "Giới hạn phải là số nguyên",
  QUERY_LIMIT_MIN: "Giới hạn phải lớn hơn hoặc bằng 1",
  QUERY_LIMIT_MAX: "Giới hạn tối đa là 100",
  START_DATE_INVALID: "Ngày bắt đầu không hợp lệ",
  END_DATE_INVALID: "Ngày kết thúc không hợp lệ",
  STATUS_INVALID_OPTION:
    "Trạng thái phòng không hợp lệ (chỉ chấp nhận ACTIVE, INACTIVE hoặc MAINTENANCE)",
  ROOM_ID_INVALID: "Mã phòng không hợp lệ",
  ROOM_NAME_EXISTS: "Tên phòng đã tồn tại",
} as const;

export const ROOM_SUCCESS_MESSAGES = {
  ROOM_DELETE_SUCCESS: "Xóa phòng thành công",
} as const;
