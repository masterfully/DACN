export const ATTENDANCE_ERROR_MESSAGES = {
  ATTENDANCE_LIST_INVALID_QUERY:
    "Tham so truy van danh sach diem danh khong hop le",
  ATTENDANCE_SECTION_LIST_INVALID_QUERY:
    "Tham so truy van danh sach diem danh theo lop hoc phan khong hop le",
  ATTENDANCE_CREATE_INVALID_INPUT: "Du lieu tao buoi diem danh khong hop le",
  ATTENDANCE_UPDATE_INVALID_INPUT:
    "Du lieu cap nhat buoi diem danh khong hop le",
  ATTENDANCE_PARAM_INVALID_ID: "Ma buoi diem danh khong hop le",
  ATTENDANCE_SECTION_PARAM_INVALID_ID: "Ma lop hoc phan khong hop le",
  ATTENDANCE_CREATE_SECTION_NOT_FOUND: "Lop hoc phan khong ton tai",
  ATTENDANCE_CREATE_DUPLICATE: "Buoi diem danh cho tiet nay da ton tai",
  ATTENDANCE_GET_NOT_FOUND: "Buoi diem danh khong ton tai",
  ATTENDANCE_UPDATE_NOT_FOUND: "Buoi diem danh khong ton tai",
  ATTENDANCE_UPDATE_DUPLICATE: "Buoi diem danh cho tiet nay da ton tai",
  ATTENDANCE_DELETE_NOT_FOUND: "Buoi diem danh khong ton tai",
  ATTENDANCE_SECTION_NOT_FOUND: "Lop hoc phan khong ton tai",
} as const;

export const ATTENDANCE_FIELD_ERROR_MESSAGES = {
  QUERY_PAGE_INVALID_INTEGER: "page phai la so nguyen",
  QUERY_PAGE_INVALID_POSITIVE: "page phai lon hon 0",
  QUERY_LIMIT_INVALID_INTEGER: "limit phai la so nguyen",
  QUERY_LIMIT_INVALID_POSITIVE: "limit phai lon hon 0",
  QUERY_LIMIT_INVALID_MAX: "limit toi da la 100",
  QUERY_SECTION_ID_INVALID: "sectionId phai la so nguyen duong",
  QUERY_ATTENDANCE_DATE_INVALID: "attendanceDate phai dung dinh dang YYYY-MM-DD",
  QUERY_SLOT_INVALID: "slot phai la so nguyen duong",
  SECTION_ID_REQUIRED: "Bat buoc nhap sectionId",
  SECTION_ID_INVALID: "sectionId phai la so nguyen duong",
  ATTENDANCE_DATE_REQUIRED: "Bat buoc nhap attendanceDate",
  ATTENDANCE_DATE_INVALID: "attendanceDate phai dung dinh dang YYYY-MM-DD",
  SLOT_REQUIRED: "Bat buoc nhap slot",
  SLOT_INVALID: "slot phai la so nguyen duong",
  NOTE_INVALID: "note phai la chuoi hoac null",
  UPDATE_MIN_ONE_FIELD: "Can it nhat mot truong de cap nhat",
  ATTENDANCE_ID_INVALID: "attendanceId phai la so nguyen duong",
  SECTION_PARAM_ID_INVALID: "sectionId phai la so nguyen duong",
} as const;
