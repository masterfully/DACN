import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { SectionDetail } from "@/types/section";

interface ClassDetailSheetProps {
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

export function ClassDetailSheet({ section, onClose }: ClassDetailSheetProps) {
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
            Chi tiết lớp học — {section?.subjectName ?? ""}
          </SheetTitle>
        </SheetHeader>

        {section && (
          <>
            <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 px-4 text-sm">
              <dt className="text-muted-foreground font-medium">Mã</dt>
              <dd>{section.sectionId}</dd>

              <dt className="text-muted-foreground font-medium">Môn học</dt>
              <dd>{section.subjectName}</dd>

              <dt className="text-muted-foreground font-medium">Năm học</dt>
              <dd>{section.year}</dd>

              <dt className="text-muted-foreground font-medium">Số đăng ký</dt>
              <dd>{section.enrollmentCount}</dd>

              <dt className="text-muted-foreground font-medium">Sức chứa</dt>
              <dd>{section.maxCapacity}</dd>
            </dl>

            {section.schedule && section.schedule.length > 0 && (
              <div className="mt-6 px-4">
                <h3 className="font-medium">Lịch học</h3>
                <div className="mt-3 space-y-3">
                  {section.schedule.map((sched, idx) => (
                    <div
                      key={idx}
                      className="border-border rounded border p-3 text-sm"
                    >
                      <p className="font-medium">
                        {sched.roomName ?? `Phòng ${sched.roomId}`}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {sched.dayOfWeek}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        <PeriodRange
                          startPeriod={sched.startPeriod}
                          endPeriod={sched.endPeriod}
                        />
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {sched.startDate} đến {sched.endDate}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
