"use client";

import { TrashIcon } from "lucide-react";
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
import type { Parent } from "./parent.types";

interface ParentRowActionsProps {
  parent: Parent;
  onDeleteSuccess?: () => void;
}

export function ParentRowActions({
  parent,
  onDeleteSuccess,
}: ParentRowActionsProps) {
  const { mutateWithResult: deleteAccount, isLoading } = useDeleteAccount(
    parent.accountId,
  );

  async function handleDelete() {
    const result = await deleteAccount();
    if (result.ok) {
      toast.success("Xóa phụ huynh thành công.");
      await onDeleteSuccess?.();
      return;
    }

    toast.error(
      result.error?.message ?? "Xóa phụ huynh thất bại. Vui lòng thử lại.",
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isLoading}>
          <TrashIcon className="size-4" />
          Xóa
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa phụ huynh</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa phụ huynh{" "}
            <span className="text-foreground font-medium">
              {parent.fullName ?? `#A${parent.accountId}`}
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
  );
}
