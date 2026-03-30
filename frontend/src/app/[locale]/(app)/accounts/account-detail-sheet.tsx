"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/sonner";
import { useCreateProfile } from "@/hooks/use-profiles";
import type { Account } from "@/types/account";
import { ACCOUNT_ROLE_LABELS } from "./account.constants";

interface AccountDetailSheetProps {
  account: Account | null;
  onClose: () => void;
  onCreateProfileSuccess?: (updatedAccount: Account) => Promise<void> | void;
}

export function AccountDetailSheet({
  account,
  onClose,
  onCreateProfileSuccess,
}: AccountDetailSheetProps) {
  const { mutateWithResult: createProfile, isLoading: isCreatingProfile } =
    useCreateProfile();

  async function handleCreateProfile() {
    if (!account) return;
    if (account.profile) {
      toast.info("Tài khoản đã có profile.");
      return;
    }

    const result = await createProfile({
      accountId: account.accountId,
      fullName: account.username,
    });

    if (!result.ok || !result.data) {
      toast.error(result.error?.message ?? "Tạo profile thất bại.");
      return;
    }

    const updatedAccount: Account = {
      ...account,
      profile: {
        profileId: result.data.profileId,
        fullName: result.data.fullName,
        email: result.data.email,
        avatar: result.data.avatar,
        status: result.data.status,
      },
    };

    await onCreateProfileSuccess?.(updatedAccount);
    toast.success("Tạo profile thành công.");
  }

  return (
    <Sheet
      open={account !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            Chi tiết tài khoản — {account?.username ?? ""}
          </SheetTitle>
        </SheetHeader>

        {account && !account.profile && (
          <div className="px-4 py-3">
            <Button
              variant="outline"
              onClick={() => {
                void handleCreateProfile();
              }}
              disabled={isCreatingProfile}
            >
              <UserPlus className="size-4" />
              {isCreatingProfile ? "Đang tạo..." : "Tạo profile"}
            </Button>
          </div>
        )}

        {account && (
          <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 px-4 text-sm">
            <dt className="text-muted-foreground font-medium">Mã tài khoản</dt>
            <dd>{account.accountId}</dd>

            <dt className="text-muted-foreground font-medium">Tên đăng nhập</dt>
            <dd>{account.username}</dd>

            <dt className="text-muted-foreground font-medium">Vai trò</dt>
            <dd>{ACCOUNT_ROLE_LABELS[account.role] ?? account.role}</dd>

            <dt className="text-muted-foreground font-medium">Họ và tên</dt>
            <dd>{account.profile?.fullName ?? account.username ?? "—"}</dd>

            <dt className="text-muted-foreground font-medium">Email</dt>
            <dd>{account.email ?? account.profile?.email ?? "—"}</dd>

            <dt className="text-muted-foreground font-medium">
              Trạng thái hồ sơ
            </dt>
            <dd>{account.profile?.status ?? "—"}</dd>
          </dl>
        )}
      </SheetContent>
    </Sheet>
  );
}
