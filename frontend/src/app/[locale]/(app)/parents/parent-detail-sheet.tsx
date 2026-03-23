"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PARENT_STATUS_LABELS } from "./parent.constants";
import type { Parent } from "./parent.types";

interface ParentDetailSheetProps {
  parent: Parent | null;
  onClose: () => void;
}

export function ParentDetailSheet({ parent, onClose }: ParentDetailSheetProps) {
  return (
    <Sheet
      open={parent !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Chi tiết phụ huynh — {parent?.fullName ?? ""}</SheetTitle>
        </SheetHeader>

        {parent && (
          <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 px-4 text-sm">
            <dt className="text-muted-foreground font-medium">Mã tài khoản</dt>
            <dd>{parent.accountId}</dd>

            <dt className="text-muted-foreground font-medium">Tên đăng nhập</dt>
            <dd>{parent.username}</dd>

            <dt className="text-muted-foreground font-medium">Mã hồ sơ</dt>
            <dd>{parent.profileId > 0 ? parent.profileId : "—"}</dd>

            <dt className="text-muted-foreground font-medium">Họ và tên</dt>
            <dd>{parent.fullName ?? "—"}</dd>

            <dt className="text-muted-foreground font-medium">Email</dt>
            <dd>{parent.email ?? "—"}</dd>

            <dt className="text-muted-foreground font-medium">Avatar</dt>
            <dd className="truncate">{parent.avatar ?? "—"}</dd>

            <dt className="text-muted-foreground font-medium">Trạng thái</dt>
            <dd>
              {parent.status
                ? (PARENT_STATUS_LABELS[parent.status] ?? parent.status)
                : "—"}
            </dd>
          </dl>
        )}
      </SheetContent>
    </Sheet>
  );
}
