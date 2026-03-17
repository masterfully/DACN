import type { ColumnDef } from "@tanstack/react-table";
import {
  AtSignIcon,
  IdCardIcon,
  ShieldCheckIcon,
  UserIcon,
} from "lucide-react";
import { ColHeader } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Account } from "@/types/account";
import {
  ACCOUNT_ROLE_BADGE_STYLES,
  ACCOUNT_ROLE_LABELS,
} from "./account.constants";

function RoleBadge({ role }: { role: Account["role"] }) {
  return (
    <Badge
      variant="ghost"
      className={cn(
        ACCOUNT_ROLE_BADGE_STYLES[role] ?? "bg-muted text-muted-foreground",
      )}
    >
      {ACCOUNT_ROLE_LABELS[role] ?? role}
    </Badge>
  );
}

export const accountColumns: ColumnDef<Account>[] = [
  {
    accessorKey: "accountId",
    header: () => <ColHeader icon={IdCardIcon} label="Mã tài khoản" />,
    meta: { visibilityLabel: "Mã tài khoản" },
    enableSorting: false,
  },
  {
    accessorKey: "username",
    header: () => <ColHeader icon={AtSignIcon} label="Tên đăng nhập" />,
    meta: { visibilityLabel: "Tên đăng nhập" },
    enableSorting: false,
  },
  {
    id: "fullName",
    header: () => <ColHeader icon={UserIcon} label="Họ và tên" />,
    meta: { visibilityLabel: "Họ và tên" },
    enableSorting: false,
    cell: ({ row }) => row.original.profile?.fullName ?? "—",
  },
  {
    id: "email",
    header: () => <ColHeader label="Email" />,
    meta: { visibilityLabel: "Email" },
    enableSorting: false,
    cell: ({ row }) => row.original.profile?.email ?? "—",
  },
  {
    accessorKey: "role",
    header: () => <ColHeader icon={ShieldCheckIcon} label="Vai trò" />,
    meta: { visibilityLabel: "Vai trò" },
    enableSorting: false,
    cell: ({ row }) => <RoleBadge role={row.original.role} />,
  },
];
