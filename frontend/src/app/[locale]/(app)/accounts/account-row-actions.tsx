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
import { useDeleteAccount } from "@/hooks/use-accounts";
import type { Account } from "@/types/account";

interface AccountRowActionsProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDeleteSuccess?: () => void;
}

export function AccountRowActions({
  account,
  onEdit,
  onDeleteSuccess,
}: AccountRowActionsProps) {
  const { mutateWithResult: deleteAccount, isLoading } = useDeleteAccount(
    account.accountId,
  );

  async function handleDelete() {
    const result = await deleteAccount();
    if (result.ok) {
      await onDeleteSuccess?.();
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
            <AlertDialogTitle>Xác nhận xóa tài khoản</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa tài khoản{" "}
              <span className="text-foreground font-medium">
                {account.username ?? `#${account.accountId}`}
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

      <Button variant="ghost" aria-label="Sửa" onClick={() => onEdit(account)}>
        <PencilIcon className="size-4" />
        Sửa
      </Button>
    </div>
  );
}
