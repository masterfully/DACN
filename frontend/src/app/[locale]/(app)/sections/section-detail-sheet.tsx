"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { SectionDetail } from "@/types/section";
import { SECTION_STATUS_LABELS } from "./section.constants";

interface SectionDetailSheetProps {
  section: SectionDetail | null;
  onClose: () => void;
}

function PeriodRange({
  startPeriod,
  endPeriod,
}: {
  startPeriod: number;
  endPeriod: number;
}) {
  return (
    <span>
      {startPeriod} - {endPeriod}
    </span>
  );
}

export function SectionDetailSheet({
  section,
  onClose,
}: SectionDetailSheetProps) {
  return (
    <Sheet
      open={section !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            Chi tiết lớp học phần — {section?.subjectName ?? ""}
          </SheetTitle>
        </SheetHeader>

        {section && (
          <>
            <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 px-4 text-sm">
              <dt className="text-muted-foreground font-medium">Mã</dt>
              <dd>{section.sectionId}</dd>

              <dt className="text-muted-foreground font-medium">Môn học</dt>
              <dd>{section.subjectName}</dd>

              <dt className="text-muted-foreground font-medium">Giảng viên</dt>
              <dd>{section.lecturerName ?? "—"}</dd>

              <dt className="text-muted-foreground font-medium">Năm học</dt>
              <dd>{section.year}</dd>

              <dt className="text-muted-foreground font-medium">Số đăng ký</dt>
              <dd>{section.enrollmentCount}</dd>

              <dt className="text-muted-foreground font-medium">Sức chứa</dt>
              <dd>{section.maxCapacity}</dd>

              <dt className="text-muted-foreground font-medium">Trạng thái</dt>
              <dd>
                {SECTION_STATUS_LABELS[
                  section.status as keyof typeof SECTION_STATUS_LABELS
                ] ?? section.status}
              </dd>

              <dt className="text-muted-foreground font-medium">Hiển thị</dt>
              <dd>{section.visibility === 1 ? "Hiển thị" : "Ẩn"}</dd>
            </dl>

            <div className="px-4 mt-6">
              <div className="text-sm font-medium mb-2">Lịch học</div>
              {section.schedule.length === 0 ? (
                <div className="text-muted-foreground text-sm">—</div>
              ) : (
                <ul className="grid gap-3">
                  {section.schedule.map((s) => (
                    <li key={s.scheduleId} className="rounded-md border p-3">
                      <div className="text-sm font-medium">
                        {s.dayOfWeek} (Phòng {s.roomName})
                      </div>
                      <div className="text-muted-foreground text-sm mt-1">
                        Tiết:{" "}
                        <PeriodRange
                          startPeriod={s.startPeriod}
                          endPeriod={s.endPeriod}
                        />
                      </div>
                      <div className="text-muted-foreground text-sm mt-1">
                        Ngày: {s.startDate} - {s.endDate}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
