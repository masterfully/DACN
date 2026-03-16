import type { ColumnDef } from "@tanstack/react-table";
import { ActivityIcon, MapPinIcon, TagIcon, UsersIcon } from "lucide-react";
import { ColHeader } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Room } from "@/types/room";
import { ROOM_STATUS_LABELS, ROOM_STATUS_STYLES } from "./room.constants";

export function RoomStatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-muted-foreground">—</span>;
  const key = status.toLowerCase();
  return (
    <Badge
      variant="ghost"
      className={cn(
        ROOM_STATUS_STYLES[key] ?? "bg-muted text-muted-foreground",
      )}
    >
      {ROOM_STATUS_LABELS[key] ?? status}
    </Badge>
  );
}

export const roomColumns: ColumnDef<Room>[] = [
  {
    accessorKey: "roomId",
    header: () => <ColHeader label="Mã phòng" />,
    meta: { visibilityLabel: "Mã phòng" },
    enableSorting: false,
  },
  {
    accessorKey: "roomName",
    header: () => <ColHeader label="Tên phòng" />,
    meta: { visibilityLabel: "Tên phòng" },
    enableSorting: false,
  },
  {
    accessorKey: "roomType",
    header: () => <ColHeader icon={TagIcon} label="Loại phòng" />,
    meta: { visibilityLabel: "Loại phòng" },
    enableSorting: false,
    cell: ({ row }) => row.original.roomType ?? "—",
  },
  {
    accessorKey: "campus",
    header: () => <ColHeader icon={MapPinIcon} label="Cơ sở" />,
    meta: { visibilityLabel: "Cơ sở" },
    enableSorting: true,
    cell: ({ row }) => row.original.campus ?? "—",
  },
  {
    accessorKey: "capacity",
    header: () => <ColHeader icon={UsersIcon} label="Sức chứa" />,
    meta: { visibilityLabel: "Sức chứa" },
    enableSorting: true,
    cell: ({ row }) =>
      row.original.capacity != null ? (
        <span>{row.original.capacity} chỗ</span>
      ) : (
        "—"
      ),
  },
  {
    accessorKey: "status",
    header: () => <ColHeader icon={ActivityIcon} label="Trạng thái" />,
    meta: { visibilityLabel: "Trạng thái" },
    enableSorting: false,
    cell: ({ row }) => <RoomStatusBadge status={row.original.status} />,
  },
];
