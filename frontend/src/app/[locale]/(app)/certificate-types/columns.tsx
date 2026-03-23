import type { ColumnDef } from "@tanstack/react-table";
import { FileTextIcon, HashIcon, TagIcon } from "lucide-react";
import { ColHeader } from "@/components/data-table";
import type { CertificateType } from "@/types/certificate";

export const certificateTypeColumns: ColumnDef<CertificateType>[] = [
  {
    accessorKey: "certificateTypeId",
    header: () => <ColHeader icon={HashIcon} label="Mã" center />,
    meta: { visibilityLabel: "Mã" },
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-center">{row.original.certificateTypeId}</div>
    ),
  },
  {
    accessorKey: "typeName",
    header: () => <ColHeader icon={TagIcon} label="Tên loại chứng chỉ" />,
    meta: { visibilityLabel: "Tên loại chứng chỉ" },
    enableSorting: false,
  },
  {
    accessorKey: "description",
    header: () => <ColHeader icon={FileTextIcon} label="Mô tả" />,
    meta: { visibilityLabel: "Mô tả" },
    enableSorting: false,
    cell: ({ row }) => row.original.description ?? "—",
  },
];
