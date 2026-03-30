"use client";

import { PencilIcon, TrashIcon } from "lucide-react";
import * as React from "react";
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
import { useDeleteAccount } from "@/hooks/use-accounts";
import type { Student } from "./student.types";

interface StudentRowActionsProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDeleteSuccess?: () => Promise<void> | void;
}

export function StudentRowActions({
  student,
  onEdit,
  onDeleteSuccess,
}: StudentRowActionsProps) {
  const { mutateWithResult: deleteAccount, isLoading } = useDeleteAccount(
    student.accountId,
  );

  async function handleDelete() {
    const result = await deleteAccount();
    if (result.ok) {
      toast.success("Xóa sinh viên thành công.");
      await onDeleteSuccess?.();
    } else {
      toast.error("Xóa sinh viên thất bại. Vui lòng thử lại.");
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
            <AlertDialogTitle>Xác nhận xóa sinh viên</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa sinh viên{" "}
              <span className="text-foreground font-medium">
                {student.fullName ?? `#${student.profileId}`}
              </span>
              ? Hành động này không thể hoàn tác.
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

      <Button variant="ghost" aria-label="Sửa" onClick={() => onEdit(student)}>
        <PencilIcon className="size-4" />
        Sửa
      </Button>
    </div>
  );
}
