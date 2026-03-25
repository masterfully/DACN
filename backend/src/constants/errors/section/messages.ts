export const SECTION_ERROR_MESSAGES = {
  SECTION_LIST_INVALID_QUERY: "Tham số truy vấn lớp học không hợp lệ",
  SECTION_CREATE_INVALID_INPUT: "Dữ liệu tạo lớp học không hợp lệ",
  SECTION_MY_LIST_INVALID_QUERY:
    "Tham số truy vấn danh sách lớp giảng dạy không hợp lệ",
  SECTION_STUDENTS_INVALID_QUERY:
    "Tham số truy vấn danh sách sinh viên của lớp không hợp lệ",
  SECTION_UPDATE_INVALID_INPUT: "Dữ liệu cập nhật lớp học không hợp lệ",
  SECTION_STATUS_INVALID_INPUT: "Dữ liệu cập nhật trạng thái lớp không hợp lệ",
  SECTION_VISIBILITY_INVALID_INPUT:
    "Dữ liệu cập nhật hiển thị lớp không hợp lệ",
  SECTION_PARAM_INVALID_ID: "Mã lớp học phần không hợp lệ",
  SECTION_GET_NOT_FOUND: "Lớp học phần không tồn tại",
  SECTION_MY_LIST_LECTURER_PROFILE_NOT_FOUND:
    "Không tìm thấy hồ sơ giảng viên cho tài khoản hiện tại",
  SECTION_STUDENTS_SECTION_NOT_FOUND: "Lớp học phần không tồn tại",
  SECTION_UPDATE_NOT_FOUND: "Lớp học phần không tồn tại",
  SECTION_UPDATE_LECTURER_NOT_FOUND: "Không tìm thấy hồ sơ giảng viên",
  SECTION_UPDATE_LECTURER_INVALID_ROLE:
    "Hồ sơ không thuộc tài khoản giảng viên",
  SECTION_UPDATE_MAX_CAPACITY_TOO_SMALL:
    "Sĩ số tối đa không được nhỏ hơn số lượng sinh viên đã đăng ký",
  SECTION_DELETE_NOT_FOUND: "Lớp học phần không tồn tại",
  SECTION_DELETE_HAS_STUDENTS:
    "Không thể xóa lớp đang có sinh viên đăng ký",
  SECTION_STATUS_NOT_FOUND: "Lớp học phần không tồn tại",
  SECTION_VISIBILITY_NOT_FOUND: "Lớp học phần không tồn tại",
  SECTION_CREATE_SUBJECT_NOT_FOUND: "Không tìm thấy môn học",
  SECTION_CREATE_LECTURER_NOT_FOUND: "Không tìm thấy hồ sơ giảng viên",
  SECTION_CREATE_LECTURER_INVALID_ROLE: "Hồ sơ không thuộc tài khoản giảng viên",
  SECTION_CREATE_ROOM_NOT_FOUND: "Một hoặc nhiều phòng học không tồn tại",
  SECTION_CREATE_SCHEDULE_CONFLICT: "Lịch học bị trùng với lịch đã tồn tại",
  SECTION_CREATE_SCHEDULE_DUPLICATE: "Các dòng lịch trong yêu cầu đang bị chồng lấp",
} as const;

export const SECTION_FIELD_ERROR_MESSAGES = {
  QUERY_PAGE_INVALID_INTEGER: "page phải là số nguyên",
  QUERY_PAGE_INVALID_POSITIVE: "page phải lớn hơn 0",
  QUERY_LIMIT_INVALID_INTEGER: "limit phải là số nguyên",
  QUERY_LIMIT_INVALID_POSITIVE: "limit phải lớn hơn 0",
  QUERY_LIMIT_INVALID_MAX: "limit tối đa là 100",
  QUERY_SEARCH_INVALID: "search phải là chuỗi",
  QUERY_SUBJECT_ID_INVALID: "subjectId phải là số nguyên dương",
  QUERY_LECTURER_PROFILE_ID_INVALID: "lecturerProfileId phải là số nguyên dương",
  QUERY_YEAR_INVALID_FORMAT: "year phải đúng định dạng YYYY-YYYY",
  QUERY_YEAR_INVALID_RANGE:
    "Khoảng năm học không hợp lệ (năm sau phải bằng năm trước + 1)",
  QUERY_STATUS_INVALID: "status chỉ chấp nhận 0, 1, 2",
  QUERY_VISIBILITY_INVALID: "visibility chỉ chấp nhận 0 hoặc 1",
  SUBJECT_ID_REQUIRED: "Bắt buộc nhập subjectId",
  SUBJECT_ID_INVALID: "subjectId phải là số nguyên dương",
  LECTURER_PROFILE_ID_REQUIRED: "Bắt buộc nhập lecturerProfileId",
  LECTURER_PROFILE_ID_INVALID: "lecturerProfileId phải là số nguyên dương",
  YEAR_REQUIRED: "Bắt buộc nhập năm học",
  YEAR_INVALID_FORMAT: "year phải đúng định dạng YYYY-YYYY",
  YEAR_INVALID_RANGE: "Khoảng năm học không hợp lệ (năm sau phải bằng năm trước + 1)",
  MAX_CAPACITY_REQUIRED: "Bắt buộc nhập maxCapacity",
  MAX_CAPACITY_INVALID: "maxCapacity phải là số nguyên dương",
  STATUS_INVALID: "status chỉ chấp nhận 0, 1, 2",
  VISIBILITY_INVALID: "visibility chỉ chấp nhận 0 hoặc 1",
  SCHEDULE_REQUIRED: "Bắt buộc nhập schedule",
  SCHEDULE_EMPTY: "schedule phải có ít nhất 1 phần tử",
  SCHEDULE_ROOM_ID_INVALID: "roomId phải là số nguyên dương",
  SCHEDULE_DAY_OF_WEEK_INVALID:
    "dayOfWeek chỉ chấp nhận MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY",
  SCHEDULE_START_PERIOD_INVALID: "startPeriod phải là số nguyên dương",
  SCHEDULE_END_PERIOD_INVALID: "endPeriod phải là số nguyên dương",
  SCHEDULE_PERIOD_RANGE_INVALID: "endPeriod phải lớn hơn hoặc bằng startPeriod",
  SCHEDULE_START_DATE_INVALID: "startDate phải đúng định dạng YYYY-MM-DD",
  SCHEDULE_END_DATE_INVALID: "endDate phải đúng định dạng YYYY-MM-DD",
  SCHEDULE_DATE_RANGE_INVALID: "endDate phải lớn hơn hoặc bằng startDate",
  SCHEDULE_CONFLICT: "Lịch học bị trùng",
  SCHEDULE_DUPLICATE: "Có lịch bị trùng hoặc chồng lấp trong request",
  SECTION_ID_INVALID: "sectionId phải là số nguyên dương",
  UPDATE_MIN_ONE_FIELD: "Cần ít nhất một trường để cập nhật",
  STATUS_REQUIRED: "Bắt buộc nhập status",
  VISIBILITY_REQUIRED: "Bắt buộc nhập visibility",
} as const;

