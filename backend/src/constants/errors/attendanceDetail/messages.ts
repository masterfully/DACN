export const ATTENDANCE_DETAIL_ERROR_MESSAGES = {
  ATTENDANCE_DETAIL_LIST_INVALID_QUERY:
    "Tham so truy van danh sach chi tiet diem danh khong hop le",
  ATTENDANCE_DETAIL_CREATE_INVALID_INPUT:
    "Du lieu tao chi tiet diem danh khong hop le",
  ATTENDANCE_DETAIL_UPDATE_INVALID_INPUT:
    "Du lieu cap nhat chi tiet diem danh khong hop le",
  ATTENDANCE_DETAIL_PARAM_INVALID_ATTENDANCE_ID:
    "Ma buoi diem danh khong hop le",
  ATTENDANCE_DETAIL_PARAM_INVALID_DETAIL_ID:
    "Ma chi tiet diem danh khong hop le",
  ATTENDANCE_DETAIL_LIST_ATTENDANCE_NOT_FOUND: "Buoi diem danh khong ton tai",
  ATTENDANCE_DETAIL_CREATE_ATTENDANCE_NOT_FOUND: "Buoi diem danh khong ton tai",
  ATTENDANCE_DETAIL_CREATE_ALREADY_EXISTS:
    "Chi tiet diem danh cho buoi nay da duoc tao",
  ATTENDANCE_DETAIL_UPDATE_NOT_FOUND: "Chi tiet diem danh khong ton tai",
} as const;

export const ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES = {
  QUERY_PAGE_INVALID_INTEGER: "page phai la so nguyen",
  QUERY_PAGE_INVALID_POSITIVE: "page phai lon hon 0",
  QUERY_LIMIT_INVALID_INTEGER: "limit phai la so nguyen",
  QUERY_LIMIT_INVALID_POSITIVE: "limit phai lon hon 0",
  QUERY_LIMIT_INVALID_MAX: "limit toi da la 100",
  QUERY_STUDENT_PROFILE_ID_INVALID: "studentProfileId phai la so nguyen duong",
  QUERY_STATUS_INVALID:
    "status chi chap nhan PRESENT, ABSENT, EXCUSED_ABSENCE, LATE",
  ATTENDANCE_ID_INVALID: "attendanceId phai la so nguyen duong",
  DETAIL_ID_INVALID: "detailId phai la so nguyen duong",
  DETAILS_REQUIRED: "Bat buoc nhap details",
  DETAILS_INVALID_TYPE: "details phai la mang",
  DETAILS_MIN_ITEMS: "details can it nhat 1 phan tu",
  STUDENT_PROFILE_ID_REQUIRED: "Bat buoc nhap studentProfileId",
  STUDENT_PROFILE_ID_INVALID: "studentProfileId phai la so nguyen duong",
  STATUS_REQUIRED: "Bat buoc nhap status",
  STATUS_INVALID: "status chi chap nhan PRESENT, ABSENT, EXCUSED_ABSENCE, LATE",
  NOTE_INVALID: "note phai la chuoi hoac null",
  UPDATE_MIN_ONE_FIELD: "Can it nhat mot truong de cap nhat",
  DUPLICATE_STUDENT_PROFILE_ID:
    "details khong duoc trung studentProfileId trong cung mot yeu cau",
  STUDENT_PROFILE_ID_NOT_FOUND:
    "Khong tim thay studentProfileId trong he thong",
} as const;
