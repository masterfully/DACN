import { ProfileApplicationErrorCode } from "./codes";

export const PROFILE_APPLICATION_ERROR_MESSAGES: Record<ProfileApplicationErrorCode, string> = {
  PROFILE_APPLICATION_LIST_INVALID_INPUT: "Dữ liệu danh sách hồ sơ không hợp lệ",
  PROFILE_APPLICATION_SUBMIT_STUDENT_PROFILE_NOT_FOUND: "Hồ sơ sinh viên không tồn tại",
  PROFILE_APPLICATION_SUBMIT_ALREADY_PENDING: "Bạn đã có hồ sơ đang chờ xét duyệt",
  PROFILE_APPLICATION_DETAIL_NOT_FOUND: "Hồ sơ không tồn tại",
  PROFILE_APPLICATION_UPDATE_NOT_FOUND: "Hồ sơ không tồn tại",
  PROFILE_APPLICATION_UPDATE_NOT_PENDING: "Hồ sơ đã được xét duyệt, không thể chỉnh sửa",
  PROFILE_APPLICATION_UPDATE_NOT_OWNER: "Bạn không phải chủ sở hữu hồ sơ",
  PROFILE_APPLICATION_REVIEW_NOT_FOUND: "Hồ sơ không tồn tại",
  PROFILE_APPLICATION_REVIEW_ALREADY_REVIEWED: "Hồ sơ đã được xét duyệt",
  PROFILE_APPLICATION_CERTIFICATES_NOT_FOUND: "Không tìm thấy chứng chỉ cho hồ sơ này",
  UNAUTHORIZED: "Vui lòng đăng nhập để tiếp tục",
  FORBIDDEN: "Bạn không có quyền truy cập tài nguyên này",
};

