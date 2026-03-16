"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Subject } from "@/types/subject";

interface SubjectDetailSheetProps {
  subject: Subject | null;
  onClose: () => void;
}

export function SubjectDetailSheet({
  subject,
  onClose,
}: SubjectDetailSheetProps) {
  return (
    <Sheet
      open={subject !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            Chi tiết môn học — {subject?.subjectName ?? ""}
          </SheetTitle>
        </SheetHeader>

        {subject && (
          <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 px-4 text-sm">
            <dt className="text-muted-foreground font-medium">Mã môn</dt>
            <dd>#{subject.subjectId}</dd>

            <dt className="text-muted-foreground font-medium">Tên môn học</dt>
            <dd>{subject.subjectName || "—"}</dd>

            <dt className="text-muted-foreground font-medium">Số tiết</dt>
            <dd>{subject.periods}</dd>
          </dl>
        )}
      </SheetContent>
    </Sheet>
  );
}
