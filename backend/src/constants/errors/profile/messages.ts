export const PROFILE_ERROR_MESSAGES = {
  PROFILE_LIST_INVALID_QUERY: "Tham số truy vấn hồ sơ không hợp lệ",
  PROFILE_LIST_LEGACY_ROLE_FILTER_UNSUPPORTED:
    "Tham số 'roles' không được hỗ trợ, vui lòng dùng 'role'",
  PROFILE_CREATE_INVALID_INPUT: "Dữ liệu tạo hồ sơ không hợp lệ",
  PROFILE_CREATE_ACCOUNT_NOT_FOUND: "Tài khoản không tồn tại",
  PROFILE_CREATE_ALREADY_EXISTS: "Tài khoản đã có hồ sơ",
  PROFILE_ME_NOT_FOUND: "Không tìm thấy hồ sơ của người dùng hiện tại",
} as const;

export const PROFILE_FIELD_ERROR_MESSAGES = {
  QUERY_PAGE_INVALID_INTEGER: "Trang phải là số nguyên",
  QUERY_PAGE_INVALID_POSITIVE: "Trang phải lớn hơn 0",
  QUERY_LIMIT_INVALID_INTEGER: "Giới hạn phải là số nguyên",
  QUERY_LIMIT_INVALID_POSITIVE: "Giới hạn phải lớn hơn 0",
  QUERY_ROLE_INVALID:
    "Vai trò không hợp lệ. Giá trị cho phép: ADMIN, LECTURER, STUDENT, PARENT",
  QUERY_STATUS_INVALID:
    "Trạng thái không hợp lệ. Giá trị cho phép: ACTIVE, INACTIVE, BANNED",
  QUERY_GENDER_INVALID:
    "Giới tính không hợp lệ. Giá trị cho phép: MALE, FEMALE",
  SEARCH_INVALID_TYPE: "Từ khóa tìm kiếm phải là chuỗi",
  ACCOUNT_ID_REQUIRED: "accountId là bắt buộc",
  ACCOUNT_ID_INVALID_TYPE: "accountId phải là số",
  ACCOUNT_ID_INVALID_INTEGER: "accountId phải là số nguyên",
  ACCOUNT_ID_INVALID_POSITIVE: "accountId phải lớn hơn 0",
  FULL_NAME_REQUIRED: "Họ và tên là bắt buộc",
  FULL_NAME_INVALID_TYPE: "Họ và tên phải là chuỗi",
  FULL_NAME_MAX_LENGTH: "Họ và tên tối đa 255 ký tự",
  PHONE_NUMBER_INVALID_TYPE: "Số điện thoại phải là chuỗi",
  PHONE_NUMBER_MAX_LENGTH: "Số điện thoại tối đa 255 ký tự",
  DATE_OF_BIRTH_INVALID_TYPE: "Ngày sinh phải là chuỗi",
  DATE_OF_BIRTH_INVALID_FORMAT: "Ngày sinh phải theo định dạng YYYY-MM-DD",
  GENDER_INVALID:
    "Giới tính không hợp lệ. Giá trị cho phép: MALE, FEMALE",
  AVATAR_INVALID_TYPE: "avatar phải là chuỗi",
  AVATAR_MAX_LENGTH: "avatar tối đa 255 ký tự",
  CITIZEN_ID_INVALID_TYPE: "CCCD/CMND phải là chuỗi",
  CITIZEN_ID_MAX_LENGTH: "CCCD/CMND tối đa 255 ký tự",
  HOMETOWN_INVALID_TYPE: "Quê quán phải là chuỗi",
  HOMETOWN_MAX_LENGTH: "Quê quán tối đa 255 ký tự",
  STATUS_INVALID:
    "Trạng thái không hợp lệ. Giá trị cho phép: ACTIVE, INACTIVE, BANNED",
} as const;
