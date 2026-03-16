/** Canonical status keys used throughout the rooms feature. */
export type RoomStatus = "active" | "inactive" | "maintenance";

export const ROOM_STATUS_LABELS: Record<string, string> = {
  active: "Hoạt động",
  inactive: "Ngừng hoạt động",
  maintenance: "Đang bảo trì",
};

export const ROOM_STATUS_STYLES: Record<string, string> = {
  active:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  maintenance:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export const ROOM_STATUS_OPTIONS: { value: RoomStatus; label: string }[] = [
  { value: "active", label: ROOM_STATUS_LABELS.active },
  { value: "inactive", label: ROOM_STATUS_LABELS.inactive },
  { value: "maintenance", label: ROOM_STATUS_LABELS.maintenance },
];
