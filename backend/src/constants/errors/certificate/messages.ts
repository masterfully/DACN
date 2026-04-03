import type { CertificateErrorCode } from "./codes";
import { CERTIFICATE_FIELD_ERROR_MESSAGES } from "./fieldMessages";

export const CERTIFICATE_ERROR_MESSAGES: Record<CertificateErrorCode, string> = {
  CERTIFICATE_LIST_INVALID_QUERY: "Tham số truy vấn danh sách chứng chỉ không hợp lệ",

  CERTIFICATE_CREATE_APPLICATION_NOT_APPROVED: "Hồ sơ phải được duyệt trước khi tạo chứng chỉ",
  CERTIFICATE_CREATE_TYPE_NOT_FOUND: "Loại chứng chỉ không tồn tại",
  CERTIFICATE_CREATE_DUPLICATE_APP_TYPE: "Chứng chỉ loại này đã tồn tại cho hồ sơ",

  CERTIFICATE_DETAIL_NOT_FOUND: "Chứng chỉ không tồn tại",

  CERTIFICATE_UPDATE_NOT_FOUND: "Chứng chỉ không tồn tại",

  CERTIFICATE_DELETE_NOT_FOUND: "Chứng chỉ không tồn tại",
} as const;

