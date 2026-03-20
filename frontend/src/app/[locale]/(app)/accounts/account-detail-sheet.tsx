"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Account } from "@/types/account";
import { ACCOUNT_ROLE_LABELS } from "./account.constants";

interface AccountDetailSheetProps {
  account: Account | null;
  onClose: () => void;
}

export function AccountDetailSheet({
  account,
  onClose,
}: AccountDetailSheetProps) {
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
