import type {
  Attendance,
  AttendanceDetail,
  CertificateDetail,
  Lecturer,
  ProfileApplication,
  Registration,
  Room,
  Schedule,
  Section,
  Student,
  Subject,
  UsageHistory,
} from "@/types";

function asNumber(value: string | null) {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

let studentIdSeq = 3;
let lecturerIdSeq = 3;
let subjectIdSeq = 4;
let sectionIdSeq = 3;
let scheduleIdSeq = 4;
let usageHistoryIdSeq = 3;
let attendanceIdSeq = 1;
let attendanceDetailIdSeq = 1;
let applicationIdSeq = 1;
let certificateIdSeq = 1;

const students: Student[] = [
  {
    StudentID: 1,
    AccountID: 101,
    StudentName: "Nguyen Van A",
    Email: "a@student.example",
    Gender: "Male",
    Status: "Active",
  },
  {
    StudentID: 2,
    AccountID: 102,
    StudentName: "Tran Thi B",
    Email: "b@student.example",
    Gender: "Female",
    Status: "Active",
  },
];

const lecturers: Lecturer[] = [
  {
    LecturerID: 1,
    AccountID: 201,
    LecturerName: "Le Lecturer 1",
    Email: "l1@lecturer.example",
  },
  {
    LecturerID: 2,
    AccountID: 202,
    LecturerName: "Le Lecturer 2",
    Email: "l2@lecturer.example",
  },
];

const subjects: Subject[] = [
  { SubjectID: 1, SubjectName: "Database", Periods: 45 },
  { SubjectID: 2, SubjectName: "Web Programming", Periods: 45 },
  { SubjectID: 3, SubjectName: "Software Engineering", Periods: 45 },
];

const sections: Section[] = [
  {
    SectionID: 1,
    LecturerID: 1,
    SubjectID: 1,
    Semester: 2,
    Year: "2025-2026",
    EnrollmentCount: 0,
    MaxCapacity: 60,
  },
  {
    SectionID: 2,
    LecturerID: 2,
    SubjectID: 2,
    Semester: 2,
    Year: "2025-2026",
    EnrollmentCount: 0,
    MaxCapacity: 60,
  },
];

const registrations: Registration[] = [];

const rooms: Room[] = [
  { RoomID: 1, RoomName: "A101", Campus: "Main", Capacity: 60, Status: "Available" },
  { RoomID: 2, RoomName: "B202", Campus: "Main", Capacity: 45, Status: "Available" },
];

const schedules: Schedule[] = [
  {
    ScheduleID: 1,
    RoomID: 1,
    SectionID: 1,
    DayOfWeek: "Monday",
    StartPeriod: 1,
    EndPeriod: 3,
    TotalPeriods: 3,
    StartDate: "2026-02-01",
    EndDate: "2026-06-01",
  },
  {
    ScheduleID: 2,
    RoomID: 2,
    SectionID: 1,
    DayOfWeek: "Wednesday",
    StartPeriod: 4,
    EndPeriod: 6,
    TotalPeriods: 3,
    StartDate: "2026-02-01",
    EndDate: "2026-06-01",
  },
  {
    ScheduleID: 3,
    RoomID: 1,
    SectionID: 2,
    DayOfWeek: "Friday",
    StartPeriod: 7,
    EndPeriod: 9,
    TotalPeriods: 3,
    StartDate: "2026-02-01",
    EndDate: "2026-06-01",
  },
];

const usageHistories: UsageHistory[] = [
  {
    UsageHistoryID: 1,
    RoomID: 1,
    StartTime: "2026-03-01",
    EndTime: "2026-03-01",
    Note: "Club meeting",
  },
  {
    UsageHistoryID: 2,
    RoomID: 2,
    StartTime: "2026-03-02",
    EndTime: "2026-03-02",
    Note: "Maintenance",
  },
];

const attendanceSessions: Attendance[] = [];
const attendanceDetails: AttendanceDetail[] = [];

const applications: ProfileApplication[] = [];
const certificates: CertificateDetail[] = [];

export const mockStore = {
  students: {
    list(searchParams: URLSearchParams) {
      const status = searchParams.get("status");
      if (!status) return students;
      return students.filter((s) => s.Status === status);
    },
    getById(id: number) {
      return students.find((s) => s.StudentID === id) ?? null;
    },
    update(id: number, patch: Partial<Student>) {
      const idx = students.findIndex((s) => s.StudentID === id);
      if (idx === -1) return null;
      students[idx] = { ...students[idx], ...patch, StudentID: id };
      return students[idx];
    },
    create(data: Partial<Student>) {
      const created: Student = {
        StudentID: studentIdSeq++,
        AccountID: data.AccountID ?? 1000 + studentIdSeq,
        ...data,
      };
      students.push(created);
      return created;
    },
  },

  lecturers: {
    list() {
      return lecturers;
    },
    create(data: Partial<Lecturer>) {
      const created: Lecturer = {
        LecturerID: lecturerIdSeq++,
        AccountID: data.AccountID ?? 2000 + lecturerIdSeq,
        ...data,
      };
      lecturers.push(created);
      return created;
    },
  },

  subjects: {
    list() {
      return subjects;
    },
    create(data: Partial<Subject>) {
      const created: Subject = {
        SubjectID: subjectIdSeq++,
        ...data,
      };
      subjects.push(created);
      return created;
    },
  },

  sections: {
    list(searchParams: URLSearchParams) {
      const semester = asNumber(searchParams.get("semester"));
      const year = searchParams.get("year") || undefined;

      return sections.filter((s) => {
        if (semester !== undefined && s.Semester !== semester) return false;
        if (year !== undefined && s.Year !== year) return false;
        return true;
      });
    },
    getById(id: number) {
      return sections.find((s) => s.SectionID === id) ?? null;
    },
    create(data: Partial<Section>) {
      const created: Section = {
        SectionID: sectionIdSeq++,
        LecturerID: data.LecturerID ?? 1,
        SubjectID: data.SubjectID ?? 1,
        ...data,
      };
      sections.push(created);
      return created;
    },
    incrementEnrollment(sectionId: number, delta: number) {
      const s = sections.find((x) => x.SectionID === sectionId);
      if (!s) return null;
      const next = Math.max(0, (s.EnrollmentCount ?? 0) + delta);
      s.EnrollmentCount = next;
      return s;
    },
  },

  registrations: {
    list() {
      return registrations;
    },
    register(sectionId: number, studentId: number) {
      const exists = registrations.some(
        (r) => r.SectionID === sectionId && r.StudentID === studentId,
      );
      if (exists) return null;

      const created: Registration = { SectionID: sectionId, StudentID: studentId };
      registrations.push(created);
      mockStore.sections.incrementEnrollment(sectionId, 1);
      return created;
    },
    unregister(sectionId: number, studentId: number) {
      const idx = registrations.findIndex(
        (r) => r.SectionID === sectionId && r.StudentID === studentId,
      );
      if (idx === -1) return false;
      registrations.splice(idx, 1);
      mockStore.sections.incrementEnrollment(sectionId, -1);
      return true;
    },
  },

  rooms: {
    list() {
      return rooms;
    },
    getById(id: number) {
      return rooms.find((r) => r.RoomID === id) ?? null;
    },
  },

  schedules: {
    bySection(sectionId: number) {
      return schedules.filter((s) => s.SectionID === sectionId);
    },
    create(data: Partial<Schedule>) {
      const created: Schedule = {
        ScheduleID: scheduleIdSeq++,
        RoomID: data.RoomID ?? 1,
        SectionID: data.SectionID ?? 1,
        ...data,
      };
      schedules.push(created);
      return created;
    },
  },

  usageHistory: {
    byRoom(roomId: number) {
      return usageHistories.filter((u) => u.RoomID === roomId);
    },
    create(data: Partial<UsageHistory>) {
      const created: UsageHistory = {
        UsageHistoryID: usageHistoryIdSeq++,
        RoomID: data.RoomID ?? 1,
        ...data,
      };
      usageHistories.push(created);
      return created;
    },
  },

  attendance: {
    createSession(data: Partial<Attendance>) {
      const created: Attendance = {
        AttendanceID: attendanceIdSeq++,
        SectionID: data.SectionID ?? 1,
        LecturerID: data.LecturerID ?? 1,
        ...data,
        CreatedAt: data.CreatedAt ?? new Date().toISOString(),
      };
      attendanceSessions.push(created);

      // Seed details for all current students if none exist for this session
      for (const s of students) {
        attendanceDetails.push({
          AttendanceDetailID: attendanceDetailIdSeq++,
          AttendanceID: created.AttendanceID,
          StudentID: s.StudentID,
          Status: "Absent",
        });
      }

      return created;
    },
    details(attendanceId: number) {
      return attendanceDetails.filter((d) => d.AttendanceID === attendanceId);
    },
    updateDetailStatus(detailId: number, status: string) {
      const idx = attendanceDetails.findIndex((d) => d.AttendanceDetailID === detailId);
      if (idx === -1) return null;
      attendanceDetails[idx] = { ...attendanceDetails[idx], Status: status };
      return attendanceDetails[idx];
    },
  },

  applications: {
    submit(data: Partial<ProfileApplication>) {
      const created: ProfileApplication = {
        ApplicationID: applicationIdSeq++,
        StudentID: data.StudentID ?? 1,
        ...data,
        SubmissionDate: data.SubmissionDate ?? new Date().toISOString(),
        ApplicationStatus: data.ApplicationStatus ?? "Pending",
      };
      applications.push(created);

      // Seed a certificate record for demo purposes
      certificates.push({
        CertificateID: certificateIdSeq++,
        ApplicationID: created.ApplicationID,
        CertificateTypeID: 1,
        Score: 8.5,
        IssueDate: new Date().toISOString().slice(0, 10),
        EvidenceURL: "https://example.com/evidence",
        Metadata: { source: "mock" },
      });

      return created;
    },
    review(id: number, status: string, notes: string) {
      const idx = applications.findIndex((a) => a.ApplicationID === id);
      if (idx === -1) return null;
      applications[idx] = {
        ...applications[idx],
        ApplicationStatus: status,
        ReviewNotes: notes,
        ReviewDate: new Date().toISOString(),
      };
      return applications[idx];
    },
    getById(id: number) {
      return applications.find((a) => a.ApplicationID === id) ?? null;
    },
  },

  certificates: {
    byApplication(applicationId: number) {
      return certificates.filter((c) => c.ApplicationID === applicationId);
    },
  },
};

