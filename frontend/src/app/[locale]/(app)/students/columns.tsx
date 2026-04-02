import type { ColumnDef } from "@tanstack/react-table";
import {
  ActivityIcon,
  IdCardIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import { ColHeader } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  STUDENT_STATUS_LABELS,
  STUDENT_STATUS_STYLES,
} from "./student.constants";
import type { Student } from "./student.types";

export function StudentStatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-muted-foreground">—</span>;
  const key = status.toLowerCase();
  return (
    <Badge
      variant="ghost"
      className={cn(
        STUDENT_STATUS_STYLES[key] ?? "bg-muted text-muted-foreground",
      )}
    >
      {STUDENT_STATUS_LABELS[key] ?? status}
    </Badge>
  );
}

export const studentColumns: ColumnDef<Student>[] = [
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
    accessorKey: "citizenId",
    header: () => <ColHeader icon={IdCardIcon} label="CCCD/CMND" />,
    meta: { visibilityLabel: "CCCD/CMND" },
    enableSorting: false,
    cell: ({ row }) => row.original.citizenId ?? "—",
  },
  {
    accessorKey: "hometown",
    header: () => <ColHeader icon={MapPinIcon} label="Quê quán" />,
    meta: { visibilityLabel: "Quê quán" },
    enableSorting: false,
    cell: ({ row }) => row.original.hometown ?? "—",
  },
  {
    accessorKey: "status",
    header: () => <ColHeader icon={ActivityIcon} label="Trạng thái" />,
    meta: { visibilityLabel: "Trạng thái" },
    enableSorting: false,
    cell: ({ row }) => <StudentStatusBadge status={row.original.status} />,
  },
];
