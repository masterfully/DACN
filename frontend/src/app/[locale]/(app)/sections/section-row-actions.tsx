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
import { useDeleteSection } from "@/hooks/use-sections";
import type { SectionListItem } from "@/types/section";

interface SectionRowActionsProps {
  section: SectionListItem;
  onEdit: (section: SectionListItem) => void;
  onDeleteSuccess?: () => void;
}

export function SectionRowActions({
  section,
  onEdit,
  onDeleteSuccess,
}: SectionRowActionsProps) {
  const { mutateWithResult: deleteSection, isLoading } = useDeleteSection(
    section.sectionId,
  );

  async function handleDelete() {
    const result = await deleteSection();
    if (result.ok) {
      toast.success("Xóa lớp học phần thành công.");
      await onDeleteSuccess?.();
    } else {
      toast.error(
        result.error?.message ?? "Xóa lớp học phần thất bại. Vui lòng thử lại.",
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
            <AlertDialogTitle>Xác nhận xóa lớp học phần</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa lớp học phần{" "}
              <span className="text-foreground font-medium">
                {section.subjectName || `#${section.sectionId}`}
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

      <Button variant="ghost" aria-label="Sửa" onClick={() => onEdit(section)}>
        <PencilIcon className="size-4" />
        Sửa
      </Button>
    </div>
  );
}
