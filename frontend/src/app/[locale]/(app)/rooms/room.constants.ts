import type { RoomStatus, RoomType } from "@/types/room";

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  LECTURE: "Phòng lý thuyết",
  LAB: "Phòng thực hành",
};

export const ROOM_TYPE_OPTIONS: { value: RoomType; label: string }[] = [
  { value: "LECTURE", label: ROOM_TYPE_LABELS.LECTURE },
  { value: "LAB", label: ROOM_TYPE_LABELS.LAB },
];

export const ROOM_STATUS_LABELS: Record<RoomStatus, string> = {
  ACTIVE: "Hoạt động",
  INACTIVE: "Ngừng hoạt động",
  MAINTENANCE: "Đang bảo trì",
};

export const ROOM_STATUS_STYLES: Record<RoomStatus, string> = {
  ACTIVE:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  INACTIVE: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  MAINTENANCE:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export const ROOM_STATUS_OPTIONS: { value: RoomStatus; label: string }[] = [
  { value: "ACTIVE", label: ROOM_STATUS_LABELS.ACTIVE },
  { value: "INACTIVE", label: ROOM_STATUS_LABELS.INACTIVE },
  { value: "MAINTENANCE", label: ROOM_STATUS_LABELS.MAINTENANCE },
];
