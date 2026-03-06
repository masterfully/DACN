export interface Student {
  StudentID: number;
  AccountID: number;
  StudentName?: string;
  PhoneNumber?: string;
  DateOfBirth?: string;
  Hometown?: string;
  Status?: string;
  Gender?: string;
  Email?: string;
  CitizenID?: string;
  Avatar?: string;
}

export interface Lecturer {
  LecturerID: number;
  AccountID: number;
  LecturerName?: string;
  PhoneNumber?: string;
  DateOfBirth?: string;
  Gender?: string;
  Email?: string;
  Avatar?: string;
}

export interface Account {
  AccountID: number;
  RoleID: number;
  Username: string;
  Password: string;
}

export interface Role {
  RoleID: number;
  RoleName?: string;
}

export interface Function {
  FunctionID: number;
  FunctionName?: string;
}

export interface PermissionDetail {
  FunctionID: number;
  RoleID: number;
  Action?: string;
}
