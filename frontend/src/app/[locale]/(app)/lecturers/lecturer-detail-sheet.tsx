"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ProfileListItem } from "@/types/profile";
import {
  LECTURER_GENDER_LABELS,
  LECTURER_STATUS_LABELS,
} from "./lecturer.constants";

interface LecturerDetailSheetProps {
  lecturer: ProfileListItem | null;
  onClose: () => void;
}

export function LecturerDetailSheet({
  lecturer,
  onClose,
}: LecturerDetailSheetProps) {
  return (
    <Sheet
      open={lecturer !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            Chi tiết giảng viên — {lecturer?.fullName ?? ""}
          </SheetTitle>
        </SheetHeader>

        {lecturer && (
          <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 px-4 text-sm">
            <dt className="text-muted-foreground font-medium">Mã hồ sơ</dt>
            <dd>{lecturer.profileId}</dd>

            <dt className="text-muted-foreground font-medium">Họ và tên</dt>
            <dd>{lecturer.fullName ?? "—"}</dd>

            <dt className="text-muted-foreground font-medium">Email</dt>
            <dd>{lecturer.email ?? "—"}</dd>

            <dt className="text-muted-foreground font-medium">Số điện thoại</dt>
            <dd>{lecturer.phoneNumber ?? "—"}</dd>

            <dt className="text-muted-foreground font-medium">Ngày sinh</dt>
            <dd>{lecturer.dateOfBirth ?? "—"}</dd>

            <dt className="text-muted-foreground font-medium">Giới tính</dt>
            <dd>
              {lecturer.gender
                ? (LECTURER_GENDER_LABELS[lecturer.gender.toUpperCase()] ??
                  lecturer.gender)
                : "—"}
            </dd>

            <dt className="text-muted-foreground font-medium">Trạng thái</dt>
            <dd>
              {lecturer.status
                ? (LECTURER_STATUS_LABELS[lecturer.status.toUpperCase()] ??
                  lecturer.status)
                : "—"}
            </dd>
          </dl>
        )}
      </SheetContent>
    </Sheet>
  );
}
