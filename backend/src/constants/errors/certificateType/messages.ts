import type { CertificateTypeErrorCode } from "./codes";
import { CERTIFICATE_TYPE_FIELD_ERROR_MESSAGES } from "./fieldMessages";

export const CERTIFICATE_TYPE_ERROR_MESSAGES: Record<CertificateTypeErrorCode, string> = {
  CERTIFICATE_TYPE_LIST_INVALID_QUERY: "Tham số truy vấn danh sách loại chứng chỉ không hợp lệ",

  CERTIFICATE_TYPE_CREATE_NAME_REQUIRED: "Tên loại chứng chỉ là bắt buộc",
  CERTIFICATE_TYPE_CREATE_NAME_EXISTS: "Loại chứng chỉ với tên này đã tồn tại",

  CERTIFICATE_TYPE_DETAIL_NOT_FOUND: "Loại chứng chỉ không tồn tại",

  CERTIFICATE_TYPE_UPDATE_NOT_FOUND: "Loại chứng chỉ không tồn tại",
  CERTIFICATE_TYPE_UPDATE_NAME_EXISTS: "Tên loại chứng chỉ đã được sử dụng",

  CERTIFICATE_TYPE_DELETE_NOT_FOUND: "Loại chứng chỉ không tồn tại",
  CERTIFICATE_TYPE_DELETE_IN_USE: "Không thể xóa loại chứng chỉ đang được sử dụng trong chứng chỉ chi tiết",
} as const;

