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
import { useDeleteAccount } from "@/hooks/use-accounts";
import type { ProfileListItem } from "@/types/profile";

interface LecturerRowActionsProps {
  lecturer: ProfileListItem;
  onEdit: (lecturer: ProfileListItem) => void;
  onDeleteSuccess?: () => void;
}

export function LecturerRowActions({
  lecturer,
  onEdit,
  onDeleteSuccess,
}: LecturerRowActionsProps) {
  const hasProfile = lecturer.profileId > 0;

  const { mutateWithResult: deleteAccount, isLoading } = useDeleteAccount(
    lecturer.accountId,
  );

  async function handleDelete() {
    const result = await deleteAccount();
    if (result.ok) {
      toast.success("Xóa giảng viên thành công.");
      await onDeleteSuccess?.();
    } else {
      toast.error(
        result.error?.message ?? "Xóa giảng viên thất bại. Vui lòng thử lại.",
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
            <AlertDialogTitle>Xác nhận xóa giảng viên</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa giảng viên{" "}
              <span className="text-foreground font-medium">
                {lecturer.fullName ?? `#A${lecturer.accountId}`}
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

      <Button
        variant="ghost"
        aria-label="Sửa"
        onClick={() => onEdit(lecturer)}
        disabled={!hasProfile}
      >
        <PencilIcon className="size-4" />
        Sửa
      </Button>
    </div>
  );
}
