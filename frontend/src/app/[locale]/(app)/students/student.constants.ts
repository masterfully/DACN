export const STUDENT_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngừng hoạt động",
  BANNED: "Bị khóa",
  active: "Đang hoạt động",
  inactive: "Ngừng hoạt động",
  suspended: "Bị khóa",
};

export const STUDENT_STATUS_STYLES: Record<string, string> = {
  ACTIVE:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  INACTIVE: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  BANNED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  active:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  suspended: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export const STUDENT_GENDER_LABELS: Record<string, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  male: "Nam",
  female: "Nữ",
};

export const STUDENT_GENDER_OPTIONS: { value: string; label: string }[] = [
  { value: "MALE", label: STUDENT_GENDER_LABELS.MALE },
  { value: "FEMALE", label: STUDENT_GENDER_LABELS.FEMALE },
];

export const STUDENT_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "ACTIVE", label: STUDENT_STATUS_LABELS.ACTIVE },
  { value: "INACTIVE", label: STUDENT_STATUS_LABELS.INACTIVE },
  { value: "BANNED", label: STUDENT_STATUS_LABELS.BANNED },
];
