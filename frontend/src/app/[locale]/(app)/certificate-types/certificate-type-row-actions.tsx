"use client";

import { PencilIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteCertificateType } from "@/hooks/use-certificate-types";
import type { CertificateType } from "@/types/certificate";

interface CertificateTypeRowActionsProps {
  row: CertificateType;
  onEdit: (row: CertificateType) => void;
  onDeleteSuccess?: () => void;
}

export function CertificateTypeRowActions({
  row,
  onEdit,
  onDeleteSuccess,
}: CertificateTypeRowActionsProps) {
  const { mutateWithResult: deleteType, isLoading } = useDeleteCertificateType(
    row.certificateTypeId,
  );

  async function handleDelete() {
    const result = await deleteType(undefined);
    if (result.ok) {
      toast.success("Đã xóa loại chứng chỉ.");
      await onDeleteSuccess?.();
    } else {
      toast.error(result.error?.message ?? "Xóa thất bại.");
    }
  }

  return (
    <div className="flex w-full items-center justify-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={isLoading}>
            <TrashIcon className="size-4" />
            Xóa
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Xóa loại chứng chỉ{" "}
              <span className="text-foreground font-medium">
                {row.typeName}
              </span>
              ? Thao tác không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isLoading}
              onClick={handleDelete}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button variant="ghost" aria-label="Sửa" onClick={() => onEdit(row)}>
        <PencilIcon className="size-4" />
        Sửa
      </Button>
    </div>
  );
}
