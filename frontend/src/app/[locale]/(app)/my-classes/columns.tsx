import type { ColumnDef } from "@tanstack/react-table";
import { UsersIcon } from "lucide-react";
import { ColHeader } from "@/components/data-table";
import type { MySectionListItem } from "@/types/section";

export const myClassesColumns: ColumnDef<MySectionListItem>[] = [
  {
    accessorKey: "sectionId",
    header: () => <ColHeader label="Mã lớp" />,
    meta: { visibilityLabel: "Mã lớp" },
    enableSorting: false,
    size: 80,
  },
  {
    accessorKey: "subjectName",
    header: () => <ColHeader label="Môn học" />,
    meta: { visibilityLabel: "Môn học" },
    enableSorting: false,
  },
  {
    accessorKey: "year",
    header: () => <ColHeader label="Năm học" />,
    meta: { visibilityLabel: "Năm học" },
    enableSorting: false,
    size: 100,
  },
  {
    accessorKey: "enrollmentCount",
    header: () => <ColHeader icon={UsersIcon} label="Số đăng ký" />,
    meta: { visibilityLabel: "Số đăng ký" },
    enableSorting: false,
    size: 100,
    cell: ({ row }) => `${row.original.enrollmentCount ?? 0}`,
  },
  {
    accessorKey: "maxCapacity",
    header: () => <ColHeader icon={UsersIcon} label="Sức chứa" />,
    meta: { visibilityLabel: "Sức chứa" },
    enableSorting: false,
    size: 100,
  },
];
