import type { ColumnDef } from "@tanstack/react-table";
import { Armchair, UsersIcon } from "lucide-react";
import { ColHeader } from "@/components/data-table";
import type { MySectionListItem } from "@/types/section";

export interface MyClassesColumnLabels {
  sectionId: string;
  subject: string;
  year: string;
  enrollment: string;
  capacity: string;
}

export function createMyClassesColumns(
  labels: MyClassesColumnLabels,
): ColumnDef<MySectionListItem>[] {
  return [
    {
      accessorKey: "sectionId",
      header: () => <ColHeader label={labels.sectionId} />,
      meta: { visibilityLabel: labels.sectionId },
      enableSorting: false,
      size: 80,
    },
    {
      accessorKey: "subjectName",
      header: () => <ColHeader label={labels.subject} />,
      meta: { visibilityLabel: labels.subject },
      enableSorting: false,
    },
    {
      accessorKey: "year",
      header: () => <ColHeader label={labels.year} />,
      meta: { visibilityLabel: labels.year },
      enableSorting: false,
      size: 100,
    },
    {
      accessorKey: "enrollmentCount",
      header: () => <ColHeader icon={UsersIcon} label={labels.enrollment} />,
      meta: { visibilityLabel: labels.enrollment },
      enableSorting: false,
      size: 100,
      cell: ({ row }) => `${row.original.enrollmentCount ?? 0}`,
    },
    {
      accessorKey: "maxCapacity",
      header: () => <ColHeader icon={Armchair} label={labels.capacity} />,
      meta: { visibilityLabel: labels.capacity },
      enableSorting: false,
      size: 100,
    },
  ];
}
