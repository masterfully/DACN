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
import { useDeleteSubject } from "@/hooks/use-subjects";
import type { Subject } from "@/types/subject";

interface SubjectRowActionsProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDeleteSuccess?: () => void;
}

export function SubjectRowActions({
  subject,
  onEdit,
  onDeleteSuccess,
}: SubjectRowActionsProps) {
  const { mutateWithResult: deleteSubject, isLoading } = useDeleteSubject(
    subject.subjectId,
  );

  async function handleDelete() {
    const result = await deleteSubject();
    if (result.ok) {
      toast.success("Xóa môn học thành công.");
      await onDeleteSuccess?.();
    } else {
      toast.error(
        result.error?.message ?? "Xóa môn học thất bại. Vui lòng thử lại.",
      );
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
            <AlertDialogTitle>Xác nhận xóa môn học</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa môn{" "}
              <span className="text-foreground font-medium">
                {subject.subjectName || `#${subject.subjectId}`}
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

      <Button variant="ghost" aria-label="Sửa" onClick={() => onEdit(subject)}>
        <PencilIcon className="size-4" />
        Sửa
      </Button>
    </div>
  );
}
