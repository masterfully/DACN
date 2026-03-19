"use client";

import * as React from "react";
import { PencilIcon, TrashIcon } from "lucide-react";
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
import type { Student } from "./student.types";

interface StudentRowActionsProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => Promise<void> | void;
}

export function StudentRowActions({
  student,
  onEdit,
  onDelete,
}: StudentRowActionsProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleDelete() {
    setIsLoading(true);
    try {
      await onDelete(student);
    } finally {
      setIsLoading(false);
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
