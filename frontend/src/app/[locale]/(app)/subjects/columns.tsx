import type { ColumnDef } from "@tanstack/react-table";
import { BookOpenIcon, Clock3Icon, HashIcon } from "lucide-react";
import { ColHeader } from "@/components/data-table";
import type { Subject } from "@/types/subject";

export const subjectColumns: ColumnDef<Subject>[] = [
  {
    accessorKey: "subjectId",
    header: () => <ColHeader icon={HashIcon} label="Mã môn" center />,
    meta: { visibilityLabel: "Mã môn" },
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-center">{row.original.subjectId}</div>
    ),
  },
  {
    accessorKey: "subjectName",
    header: () => <ColHeader icon={BookOpenIcon} label="Tên môn học" />,
    meta: { visibilityLabel: "Tên môn học" },
    enableSorting: false,
    cell: ({ row }) => row.original.subjectName,
  },
  {
    accessorKey: "periods",
    header: () => <ColHeader icon={Clock3Icon} label="Số tiết" center />,
    meta: { visibilityLabel: "Số tiết" },
    cell: ({ row }) => row.original.periods,
  },
];
