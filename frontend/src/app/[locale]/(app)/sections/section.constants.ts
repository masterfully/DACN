export const SECTION_STATUS = {
  OPEN: 0,
  COMPLETED: 1,
  CANCELLED: 2,
} as const;

export type SectionStatus =
  (typeof SECTION_STATUS)[keyof typeof SECTION_STATUS];

export const SECTION_STATUS_LABELS = {
  [SECTION_STATUS.OPEN]: "OPEN",
  [SECTION_STATUS.COMPLETED]: "COMPLETED",
  [SECTION_STATUS.CANCELLED]: "CANCELLED",
} satisfies Record<SectionStatus, string>;

export const SECTION_STATUS_STYLES = {
  [SECTION_STATUS.OPEN]: "bg-emerald-100 text-emerald-800",
  [SECTION_STATUS.COMPLETED]: "bg-muted text-muted-foreground",
  [SECTION_STATUS.CANCELLED]: "bg-amber-100 text-amber-800",
} satisfies Record<SectionStatus, string>;

export const SECTION_STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  {
    value: String(SECTION_STATUS.OPEN),
    label: SECTION_STATUS_LABELS[SECTION_STATUS.OPEN],
  },
  {
    value: String(SECTION_STATUS.COMPLETED),
    label: SECTION_STATUS_LABELS[SECTION_STATUS.COMPLETED],
  },
  {
    value: String(SECTION_STATUS.CANCELLED),
    label: SECTION_STATUS_LABELS[SECTION_STATUS.CANCELLED],
  },
];
