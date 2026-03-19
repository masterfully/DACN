export const STUDENT_STATUS_LABELS: Record<string, string> = {
  active: "Đang hoạt động",
  inactive: "Ngừng hoạt động",
  suspended: "Bị tạm khóa",
};

export const STUDENT_STATUS_STYLES: Record<string, string> = {
  active:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  suspended: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export const STUDENT_GENDER_LABELS: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
};

export const STUDENT_GENDER_OPTIONS: { value: string; label: string }[] = [
  { value: "male", label: STUDENT_GENDER_LABELS.male },
  { value: "female", label: STUDENT_GENDER_LABELS.female },
  { value: "other", label: STUDENT_GENDER_LABELS.other },
];

export const STUDENT_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "active", label: STUDENT_STATUS_LABELS.active },
  { value: "inactive", label: STUDENT_STATUS_LABELS.inactive },
  { value: "suspended", label: STUDENT_STATUS_LABELS.suspended },
];
