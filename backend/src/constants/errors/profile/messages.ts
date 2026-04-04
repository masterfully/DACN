export const PROFILE_ERROR_MESSAGES = {
  PROFILE_LIST_INVALID_QUERY: "Tham số truy vấn hồ sơ không hợp lệ",
  PROFILE_LIST_LEGACY_ROLE_FILTER_UNSUPPORTED:
    "Tham số 'roles' không được hỗ trợ, vui lòng dùng 'role'",
  PROFILE_CREATE_INVALID_INPUT: "Dữ liệu tạo hồ sơ không hợp lệ",
  PROFILE_CREATE_ACCOUNT_NOT_FOUND: "Tài khoản không tồn tại",
  PROFILE_CREATE_ALREADY_EXISTS: "Tài khoản đã có hồ sơ",
  PROFILE_ME_NOT_FOUND: "Không tìm thấy hồ sơ của người dùng hiện tại",
  PROFILE_UPDATE_FORBIDDEN_FIELD: "Trường này không được phép cập nhật",
  PROFILE_DETAIL_INVALID_PARAMS: "Tham số hồ sơ không hợp lệ",
  PROFILE_DETAIL_NOT_FOUND: "Hồ sơ không tồn tại",
  PROFILE_DETAIL_FORBIDDEN: "Bạn không có quyền xem hồ sơ này",
  PROFILE_UPDATE_BY_ID_INVALID_PARAMS: "Tham số hồ sơ không hợp lệ",
  PROFILE_UPDATE_BY_ID_INVALID_INPUT: "Dữ liệu cập nhật hồ sơ không hợp lệ",
  PROFILE_UPDATE_BY_ID_NOT_FOUND: "Hồ sơ không tồn tại",
  PROFILE_UPDATE_BY_ID_FORBIDDEN: "Bạn không có quyền cập nhật hồ sơ này",
  PROFILE_UPDATE_BY_ID_FORBIDDEN_FIELD: "Trường này không được phép cập nhật",
  PROFILE_ATTENDANCE_SUMMARY_INVALID_PARAMS:
    "Tham số hồ sơ cho thống kê điểm danh không hợp lệ",
  PROFILE_ATTENDANCE_SUMMARY_INVALID_QUERY:
    "Tham số truy vấn thống kê điểm danh không hợp lệ",
  PROFILE_ATTENDANCE_SUMMARY_PROFILE_NOT_FOUND: "Hồ sơ sinh viên không tồn tại",
  PROFILE_ATTENDANCE_SUMMARY_FORBIDDEN:
    "Bạn không có quyền xem thống kê điểm danh của hồ sơ này",
  PROFILE_ATTENDANCE_SUMMARY_SECTION_NOT_FOUND: "Lớp học phần không tồn tại",
  PROFILE_CERTIFICATE_LIST_INVALID_PARAMS: "Tham số hồ sơ không hợp lệ",
  PROFILE_CERTIFICATE_LIST_INVALID_QUERY:
    "Tham số truy vấn chứng chỉ không hợp lệ",
  PROFILE_CERTIFICATE_LIST_PROFILE_NOT_FOUND: "Hồ sơ sinh viên không tồn tại",
  PROFILE_CERTIFICATE_LIST_FORBIDDEN:
    "Bạn không có quyền xem chứng chỉ của hồ sơ này",
  PROFILE_CERTIFICATE_LINK_INVALID_PARAMS: "Tham số hồ sơ không hợp lệ",
  PROFILE_CERTIFICATE_LINK_INVALID_INPUT: "Dữ liệu gắn chứng chỉ không hợp lệ",
  PROFILE_CERTIFICATE_LINK_PROFILE_NOT_FOUND: "Hồ sơ sinh viên không tồn tại",
  PROFILE_CERTIFICATE_LINK_CERTIFICATE_NOT_FOUND: "Chứng chỉ không tồn tại",
  PROFILE_CERTIFICATE_LINK_ALREADY_EXISTS:
    "Chứng chỉ đã được gắn cho sinh viên này",
  PROFILE_CERTIFICATE_UNLINK_INVALID_PARAMS: "Tham số hồ sơ hoặc chứng chỉ không hợp lệ",
  PROFILE_CERTIFICATE_UNLINK_PROFILE_NOT_FOUND: "Hồ sơ sinh viên không tồn tại",
  PROFILE_CERTIFICATE_UNLINK_NOT_LINKED: "Chứng chỉ không thuộc sinh viên này",
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
  PROFILE_ID_INVALID: "Mã hồ sơ phải là số nguyên dương",
  SECTION_ID_INVALID: "Mã lớp học phần phải là số nguyên dương",
  QUERY_CERTIFICATE_TYPE_ID_INVALID:
    "certificateTypeId phải là số nguyên dương",
  QUERY_IS_VERIFIED_INVALID: "isVerified chỉ chấp nhận true hoặc false",
  CERTIFICATE_ID_REQUIRED: "certificateId là bắt buộc",
  CERTIFICATE_ID_INVALID_TYPE: "certificateId phải là số",
  CERTIFICATE_ID_INVALID_INTEGER: "certificateId phải là số nguyên",
  CERTIFICATE_ID_INVALID_POSITIVE: "certificateId phải lớn hơn 0",
  ACCOUNT_ID_REQUIRED: "accountId là bắt buộc",
  ACCOUNT_ID_INVALID_TYPE: "accountId phải là số",
  ACCOUNT_ID_INVALID_INTEGER: "accountId phải là số nguyên",
  ACCOUNT_ID_INVALID_POSITIVE: "accountId phải lớn hơn 0",
  FULL_NAME_REQUIRED: "Họ và tên là bắt buộc",
  FULL_NAME_INVALID_TYPE: "Họ và tên phải là chuỗi",
  FULL_NAME_MAX_LENGTH: "Họ và tên tối đa 255 ký tự",
  EMAIL_INVALID_TYPE: "Email phải là chuỗi",
  EMAIL_INVALID_FORMAT: "Email không đúng định dạng",
  EMAIL_MAX_LENGTH: "Email tối đa 255 ký tự",
  EMAIL_EXISTS: "Email đã được sử dụng",
  PHONE_NUMBER_INVALID_TYPE: "Số điện thoại không hợp lệ",
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
