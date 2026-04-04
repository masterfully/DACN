import type { ProfileStatus, Role } from "@/types/account";

export const ACCOUNT_ROLE_OPTIONS: Array<{ value: Role; label: string }> = [
  { value: "ADMIN", label: "Quản trị viên" },
  { value: "LECTURER", label: "Giảng viên" },
  { value: "STUDENT", label: "Sinh viên" },
  { value: "PARENT", label: "Phụ huynh" },
];

export const ACCOUNT_ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Quản trị viên",
  LECTURER: "Giảng viên",
  STUDENT: "Sinh viên",
  PARENT: "Phụ huynh",
};

export const ACCOUNT_ROLE_BADGE_STYLES: Record<Role, string> = {
  ADMIN: "bg-purple-100 text-purple-800",
  LECTURER: "bg-blue-100 text-blue-800",
  STUDENT: "bg-emerald-100 text-emerald-800",
  PARENT: "bg-violet-100 text-violet-800",
};

export const ACCOUNT_STATUS_OPTIONS: Array<{
  value: ProfileStatus;
  label: string;
}> = [
  { value: "ACTIVE", label: "Hoạt động" },
  { value: "INACTIVE", label: "Không hoạt động" },
  { value: "BANNED", label: "Bị khóa" },
];
