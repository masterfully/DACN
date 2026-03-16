import type { ColumnDef } from "@tanstack/react-table";
import { ActivityIcon, MailIcon, PhoneIcon, UserIcon } from "lucide-react";
import { ColHeader } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProfileListItem } from "@/types/profile";
import {
  LECTURER_STATUS_LABELS,
  LECTURER_STATUS_STYLES,
} from "./lecturer.constants";

export function LecturerStatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-muted-foreground">—</span>;
  const key = status.toLowerCase();
  return (
    <Badge
      variant="ghost"
      className={cn(
        LECTURER_STATUS_STYLES[key] ?? "bg-muted text-muted-foreground",
      )}
    >
      {LECTURER_STATUS_LABELS[key] ?? status}
    </Badge>
  );
}

export const lecturerColumns: ColumnDef<ProfileListItem>[] = [
  {
    accessorKey: "fullName",
    header: () => <ColHeader icon={UserIcon} label="Họ và tên" />,
    meta: { visibilityLabel: "Họ và tên" },
    enableSorting: false,
    cell: ({ row }) => row.original.fullName ?? "—",
  },
  {
    accessorKey: "email",
    header: () => <ColHeader icon={MailIcon} label="Email" />,
    meta: { visibilityLabel: "Email" },
    enableSorting: false,
    cell: ({ row }) => row.original.email ?? "—",
  },
  {
    accessorKey: "phoneNumber",
    header: () => <ColHeader icon={PhoneIcon} label="Số điện thoại" />,
    meta: { visibilityLabel: "Số điện thoại" },
    enableSorting: false,
    cell: ({ row }) => row.original.phoneNumber ?? "—",
  },
  {
    accessorKey: "status",
    header: () => <ColHeader icon={ActivityIcon} label="Trạng thái" />,
    meta: { visibilityLabel: "Trạng thái" },
    enableSorting: false,
    cell: ({ row }) => <LecturerStatusBadge status={row.original.status} />,
  },
];
