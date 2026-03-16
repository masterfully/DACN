export const LECTURER_STATUS_LABELS: Record<string, string> = {
  active: "Đang hoạt động",
  inactive: "Ngừng hoạt động",
  suspended: "Bị tạm khóa",
};

export const LECTURER_STATUS_STYLES: Record<string, string> = {
  active:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  suspended: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export const LECTURER_GENDER_LABELS: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
};

export const LECTURER_GENDER_OPTIONS: { value: string; label: string }[] = [
  { value: "male", label: LECTURER_GENDER_LABELS.male },
  { value: "female", label: LECTURER_GENDER_LABELS.female },
  { value: "other", label: LECTURER_GENDER_LABELS.other },
];

export const LECTURER_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "active", label: LECTURER_STATUS_LABELS.active },
  { value: "inactive", label: LECTURER_STATUS_LABELS.inactive },
  { value: "suspended", label: LECTURER_STATUS_LABELS.suspended },
];
