import type { ColumnDef } from "@tanstack/react-table";
import { CalendarIcon, HashIcon, UserIcon } from "lucide-react";
import { ColHeader } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import type { ProfileApplication } from "@/types/profile-application";
import { formatApplicationStatus } from "./application-status";

function statusBadgeClass(status: ProfileApplication["applicationStatus"]) {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-900";
    case "APPROVED":
      return "bg-emerald-100 text-emerald-900";
    case "REJECTED":
      return "bg-red-100 text-red-900";
    case "CANCELLED":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function buildApprovalColumns(
  onReview: (row: ProfileApplication) => void,
): ColumnDef<ProfileApplication>[] {
  return [
    {
      accessorKey: "applicationId",
      header: () => <ColHeader icon={HashIcon} label="Mã hồ sơ" center />,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-center">{row.original.applicationId}</div>
      ),
    },
    {
      accessorKey: "studentName",
      header: () => <ColHeader icon={UserIcon} label="Sinh viên" />,
      enableSorting: false,
      cell: ({ row }) => row.original.studentName ?? "—",
    },
    {
      accessorKey: "applicationStatus",
      header: () => <ColHeader label="Trạng thái" center />,
      enableSorting: false,
      cell: ({ row }) => {
        const s = row.original.applicationStatus;
        return (
          <div className="flex justify-center">
            <Badge variant="ghost" className={statusBadgeClass(s)}>
              {formatApplicationStatus(s)}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "submissionDate",
      header: () => <ColHeader icon={CalendarIcon} label="Ngày nộp" />,
      enableSorting: false,
      cell: ({ row }) => {
        const d = row.original.submissionDate;
        if (!d) return "—";
        try {
          return new Date(d).toLocaleString("vi-VN");
        } catch {
          return d;
        }
      },
    },
    {
      id: "__review__",
      header: () => <ColHeader label="Thao tác" center />,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.original.applicationStatus === "PENDING" ? (
            <button
              type="button"
              className="text-primary text-sm font-medium underline-offset-4 hover:underline"
              onClick={() => onReview(row.original)}
            >
              Xét duyệt
            </button>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          )}
        </div>
      ),
    },
  ];
}
