export interface Section {
  SectionID: number;
  LecturerID: number;
  SubjectID: number;
  Semester?: number;
  Year?: string;
  EnrollmentCount?: number;
  MaxCapacity?: number;
}

export interface Registration {
  SectionID: number;
  StudentID: number;
}
