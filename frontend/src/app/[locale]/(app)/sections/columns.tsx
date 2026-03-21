import type { ColumnDef } from "@tanstack/react-table";
import { ActivityIcon, FileTextIcon, TagIcon, UsersIcon } from "lucide-react";
import { ColHeader } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SectionListItem } from "@/types/section";
import {
  SECTION_STATUS_LABELS,
  SECTION_STATUS_STYLES,
} from "./section.constants";

function SectionStatusBadge({ status }: { status: number }) {
  const safeStatus = status as keyof typeof SECTION_STATUS_LABELS;
  const label = SECTION_STATUS_LABELS[safeStatus] ?? String(status);
  const className =
    SECTION_STATUS_STYLES[safeStatus] ?? "bg-muted text-muted-foreground";

  return (
    <Badge variant="ghost" className={className}>
      {label}
    </Badge>
  );
}

function SectionVisibilityBadge({ visibility }: { visibility: number }) {
  const className = cn(
    visibility === 1
      ? "bg-emerald-100 text-emerald-800"
      : "bg-slate-100 text-slate-700",
  );

  return (
    <Badge variant="ghost" className={className}>
      {visibility === 1 ? "Hiển thị" : "Ẩn"}
    </Badge>
  );
}

export const sectionColumns: ColumnDef<SectionListItem>[] = [
  {
    accessorKey: "sectionId",
    header: () => <ColHeader label="Mã lớp học phần" />,
    meta: { visibilityLabel: "Mã lớp học phần" },
    enableSorting: false,
  },
  {
    accessorKey: "subjectName",
    header: () => <ColHeader label="Môn học" />,
    meta: { visibilityLabel: "Môn học" },
    enableSorting: false,
  },
  {
    accessorKey: "lecturerName",
    header: () => <ColHeader icon={FileTextIcon} label="Giảng viên" />,
    meta: { visibilityLabel: "Giảng viên" },
    enableSorting: false,
  },
  {
    accessorKey: "year",
    header: () => <ColHeader label="Năm học" />,
    meta: { visibilityLabel: "Năm học" },
    enableSorting: false,
  },
  {
    accessorKey: "enrollmentCount",
    header: () => <ColHeader icon={UsersIcon} label="Số đăng ký" />,
    meta: { visibilityLabel: "Số đăng ký" },
    enableSorting: false,
    cell: ({ row }) => `${row.original.enrollmentCount ?? 0}`,
  },
  {
    accessorKey: "maxCapacity",
    header: () => <ColHeader icon={UsersIcon} label="Sức chứa" />,
    meta: { visibilityLabel: "Sức chứa" },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: () => <ColHeader icon={ActivityIcon} label="Trạng thái" />,
    meta: { visibilityLabel: "Trạng thái" },
    enableSorting: false,
    cell: ({ row }) => <SectionStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "visibility",
    header: () => <ColHeader icon={TagIcon} label="Hiển thị" />,
    meta: { visibilityLabel: "Hiển thị" },
    enableSorting: false,
    cell: ({ row }) => (
      <SectionVisibilityBadge visibility={row.original.visibility} />
    ),
  },
];
