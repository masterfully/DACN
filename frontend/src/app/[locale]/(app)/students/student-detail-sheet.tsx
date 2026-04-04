"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  STUDENT_GENDER_LABELS,
  STUDENT_STATUS_LABELS,
} from "./student.constants";
import type { Student } from "./student.types";

interface StudentDetailSheetProps {
  student: Student | null;
  onClose: () => void;
}

export function StudentDetailSheet({
  student,
  onClose,
}: StudentDetailSheetProps) {
  return (
    <Sheet
      open={student !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            Chi tiết sinh viên — {student?.fullName ?? ""}
          </SheetTitle>
        </SheetHeader>

        {student && (
          <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 px-4 text-sm">
            <dt className="text-muted-foreground font-medium">Mã hồ sơ</dt>
            <dd>{student.profileId}</dd>

            <dt className="text-muted-foreground font-medium">Mã tài khoản</dt>
            <dd>{student.accountId}</dd>

            <dt className="text-muted-foreground font-medium">Tên đăng nhập</dt>
            <dd>{student.username}</dd>

            <dt className="text-muted-foreground font-medium">Họ và tên</dt>
            <dd>{student.fullName ?? "—"}</dd>

            <dt className="text-muted-foreground font-medium">Email</dt>
            <dd>{student.email ?? "—"}</dd>

            <dt className="text-muted-foreground font-medium">Số điện thoại</dt>
            <dd>{student.phoneNumber ?? "—"}</dd>

            <dt className="text-muted-foreground font-medium">Ngày sinh</dt>
            <dd>{student.dateOfBirth ?? "—"}</dd>

            <dt className="text-muted-foreground font-medium">Giới tính</dt>
            <dd>
              {student.gender
                ? (STUDENT_GENDER_LABELS[student.gender.toUpperCase()] ??
                  student.gender)
                : "—"}
            </dd>

            <dt className="text-muted-foreground font-medium">Avatar</dt>
            <dd className="truncate">{student.avatar ?? "—"}</dd>

            <dt className="text-muted-foreground font-medium">CCCD/CMND</dt>
            <dd>{student.citizenId ?? "—"}</dd>

            <dt className="text-muted-foreground font-medium">Quê quán</dt>
            <dd>{student.hometown ?? "—"}</dd>

            <dt className="text-muted-foreground font-medium">Trạng thái</dt>
            <dd>
              {student.status
                ? (STUDENT_STATUS_LABELS[student.status.toUpperCase()] ??
                  student.status)
                : "—"}
            </dd>
          </dl>
        )}
      </SheetContent>
    </Sheet>
  );
}
