export const ACCOUNT_ERROR_MESSAGES = {
  ACCOUNT_LIST_INVALID_QUERY: "Tham số truy vấn tài khoản không hợp lệ",
  ACCOUNT_LIST_LEGACY_ROLE_FILTER_UNSUPPORTED:
    "Tham số 'roles' không được hỗ trợ, vui lòng dùng 'role'",
  ACCOUNT_CREATE_INVALID_INPUT: "Dữ liệu tạo tài khoản không hợp lệ",
  ACCOUNT_CREATE_USERNAME_EXISTS: "Tên đăng nhập đã tồn tại",
  ACCOUNT_CREATE_EMAIL_EXISTS: "Email đã tồn tại",
} as const;

export const ACCOUNT_FIELD_ERROR_MESSAGES = {
  QUERY_PAGE_INVALID_INTEGER: "Trang phải là số nguyên",
  QUERY_PAGE_INVALID_POSITIVE: "Trang phải lớn hơn 0",
  QUERY_LIMIT_INVALID_INTEGER: "Giới hạn phải là số nguyên",
  QUERY_LIMIT_INVALID_POSITIVE: "Giới hạn phải lớn hơn 0",
  QUERY_ROLE_INVALID:
    "Vai trò không hợp lệ. Giá trị cho phép: ADMIN, LECTURER, STUDENT, PARENT",
  QUERY_STATUS_INVALID:
    "Trạng thái không hợp lệ. Giá trị cho phép: ACTIVE, INACTIVE, BANNED",
  USERNAME_REQUIRED: "Tên đăng nhập là bắt buộc",
  USERNAME_INVALID_TYPE: "Tên đăng nhập phải là chuỗi",
  USERNAME_MAX_LENGTH: "Tên đăng nhập tối đa 255 ký tự",
  EMAIL_REQUIRED: "Email là bắt buộc",
  EMAIL_INVALID_TYPE: "Email phải là chuỗi",
  EMAIL_INVALID_FORMAT: "Email không hợp lệ",
  EMAIL_MAX_LENGTH: "Email tối đa 255 ký tự",
  PASSWORD_REQUIRED: "Mật khẩu là bắt buộc",
  PASSWORD_INVALID_TYPE: "Mật khẩu phải là chuỗi",
  PASSWORD_MIN_LENGTH: "Mật khẩu phải có ít nhất 8 ký tự",
  PASSWORD_WEAK:
    "Mật khẩu phải có ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt",
  ROLE_REQUIRED: "Vai trò là bắt buộc",
  ROLE_INVALID:
    "Vai trò không hợp lệ. Giá trị cho phép: ADMIN, LECTURER, STUDENT, PARENT",
  USERNAME_EXISTS: "Tên đăng nhập đã tồn tại",
  EMAIL_EXISTS: "Email đã tồn tại",
} as const;
