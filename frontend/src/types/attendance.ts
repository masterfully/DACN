export interface Attendance {
  AttendanceID: number;
  SectionID: number;
  LecturerID: number;
  AttendanceDate?: string;
  Slot?: number;
  Note?: string;
  CreatedAt?: string;
}

export interface AttendanceDetail {
  AttendanceDetailID: number;
  AttendanceID: number;
  StudentID: number;
  Status?: string;
  Note?: string;
}
