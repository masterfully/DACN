import type { ColumnDef } from "@tanstack/react-table";
import {
  ActivityIcon,
  HashIcon,
  MailIcon,
  UserIcon,
  UserRoundIcon,
} from "lucide-react";
import { ColHeader } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PARENT_STATUS_LABELS, PARENT_STATUS_STYLES } from "./parent.constants";
import type { Parent } from "./parent.types";

export function ParentStatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-muted-foreground">—</span>;
  const key = status.toLowerCase();
  return (
    <Badge
      variant="ghost"
      className={cn(
        PARENT_STATUS_STYLES[key] ?? "bg-muted text-muted-foreground",
      )}
    >
      {PARENT_STATUS_LABELS[key] ?? status}
    </Badge>
  );
}

export const parentColumns: ColumnDef<Parent>[] = [
  {
    accessorKey: "accountId",
    header: () => <ColHeader icon={HashIcon} label="Mã tài khoản" center />,
    meta: { visibilityLabel: "Mã tài khoản" },
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-center">{row.original.accountId}</div>
    ),
  },
  {
    accessorKey: "username",
    header: () => <ColHeader icon={UserRoundIcon} label="Tên đăng nhập" />,
    meta: { visibilityLabel: "Tên đăng nhập" },
    enableSorting: false,
    cell: ({ row }) => row.original.username,
  },
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
    accessorKey: "status",
    header: () => <ColHeader icon={ActivityIcon} label="Trạng thái" />,
    meta: { visibilityLabel: "Trạng thái" },
    enableSorting: false,
    cell: ({ row }) => <ParentStatusBadge status={row.original.status} />,
  },
];
