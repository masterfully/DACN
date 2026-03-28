"use client";

import * as React from "react";
import { Check, Clock3, Plus, Users, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useAttendancesBySection,
  useCreateAttendance,
} from "@/hooks/use-attendance";
import {
  useAttendanceDetails,
  useCreateBulkAttendanceDetails,
} from "@/hooks/use-attendance-details";
import { useRegistrationsBySection } from "@/hooks/use-registrations";
import { useSectionStudents } from "@/hooks/use-sections";
import { updateAttendanceDetail } from "@/services/attendance-detail-service";
import type {
  Attendance,
  AttendanceDetail,
  AttendanceStatus,
} from "@/types/attendance";
import type { MySectionListItem } from "@/types/section";

interface ClassAttendanceSheetProps {
  section: MySectionListItem | null;
  onClose: () => void;
}

interface AttendanceStudent {
  profileId: number;
  fullName: string | null;
  email: string | null;
}

function formatDateLabel(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
}

function statusIcon(status: AttendanceStatus) {
  switch (status) {
    case "PRESENT":
      return <Check className="h-4 w-4 text-emerald-600" />;
    case "LATE":
      return <Clock3 className="h-4 w-4 text-amber-600" />;
    case "ABSENT":
      return <X className="h-4 w-4 text-rose-600" />;
    default:
      return <Check className="text-muted-foreground h-4 w-4" />;
  }
}

export function ClassAttendanceSheet({
  section,
  onClose,
}: ClassAttendanceSheetProps) {
  const [selectedAttendanceId, setSelectedAttendanceId] = React.useState<
    number | null
  >(null);
  const [updatingStudentId, setUpdatingStudentId] = React.useState<
    number | null
  >(null);

  const sectionId = section?.sectionId;

  const {
    data: attendancePage,
    isLoading: isAttendanceLoading,
    error: attendanceError,
    mutate: refreshAttendances,
  } = useAttendancesBySection(sectionId, { page: 1, limit: 100 });

  const {
    data: studentsPage,
    isLoading: isStudentsLoading,
    error: studentsError,
  } = useSectionStudents(sectionId, { page: 1, limit: 100 });

  const {
    data: registrationsPage,
    isLoading: isRegistrationsLoading,
    error: registrationsError,
  } = useRegistrationsBySection(sectionId, { page: 1, limit: 100 });

  const {
    data: detailsPage,
    isLoading: isDetailsLoading,
    error: detailsError,
    mutate: refreshDetails,
  } = useAttendanceDetails(selectedAttendanceId ?? undefined, {
    page: 1,
    limit: 100,
  });

  const {
    mutateWithResult: createAttendance,
    isLoading: isCreatingAttendance,
  } = useCreateAttendance();

  const {
    mutateWithResult: createBulkDetails,
    isLoading: isInitializingDetails,
  } = useCreateBulkAttendanceDetails(selectedAttendanceId ?? 0);

  const attendances = React.useMemo(() => {
    const items = attendancePage?.items ?? [];
    return [...items].sort((a, b) => {
      if (a.slot !== b.slot) return a.slot - b.slot;
      return a.attendanceId - b.attendanceId;
    });
  }, [attendancePage?.items]);

  React.useEffect(() => {
    if (!attendances.length) {
      setSelectedAttendanceId(null);
      return;
    }

    if (
      selectedAttendanceId === null ||
      !attendances.some((item) => item.attendanceId === selectedAttendanceId)
    ) {
      setSelectedAttendanceId(attendances[0].attendanceId);
    }
  }, [attendances, selectedAttendanceId]);

  React.useEffect(() => {
    if (attendanceError) toast.error(attendanceError.message);
  }, [attendanceError]);

  React.useEffect(() => {
    if (studentsError) toast.error(studentsError.message);
  }, [studentsError]);

  React.useEffect(() => {
    if (registrationsError) toast.error(registrationsError.message);
  }, [registrationsError]);

  React.useEffect(() => {
    if (detailsError) toast.error(detailsError.message);
  }, [detailsError]);

  const students = React.useMemo<AttendanceStudent[]>(() => {
    const fromStudents = studentsPage?.items ?? [];
    if (fromStudents.length > 0) {
      return fromStudents;
    }

    const fromRegistrations = registrationsPage?.items ?? [];
    return fromRegistrations.map((item) => ({
      profileId: item.studentProfileId,
      fullName: item.fullName,
      email: item.email,
    }));
  }, [studentsPage?.items, registrationsPage?.items]);

  const details = detailsPage?.items ?? [];

  const detailsMap = React.useMemo(() => {
    const map = new Map<number, AttendanceDetail>();
    details.forEach((item) => {
      map.set(item.studentProfileId, item);
    });
    return map;
  }, [details]);

  const summary = React.useMemo(() => {
    let present = 0;
    let late = 0;
    let absent = 0;

    details.forEach((item) => {
      const status = (item.status ?? "").toUpperCase();
      if (status === "PRESENT") present += 1;
      if (status === "LATE") late += 1;
      if (status === "ABSENT") absent += 1;
    });

    return { present, late, absent };
  }, [details]);

  async function handleCreateAttendance() {
    if (!sectionId) return;

    const nextSlot = (attendances.at(-1)?.slot ?? 0) + 1;
    const today = new Date().toISOString().slice(0, 10);

    const result = await createAttendance({
      sectionId,
      slot: nextSlot,
      attendanceDate: today,
      note: `Buoi ${nextSlot}`,
    });

    if (!result.ok) {
      toast.error(result.error?.message ?? "Tao buoi diem danh that bai");
      return;
    }

    const refreshed = await refreshAttendances();
    const latest = refreshed?.items?.at(-1);
    if (latest) {
      setSelectedAttendanceId(latest.attendanceId);
    }
    toast.success("Da tao buoi diem danh moi");
  }

  async function handleInitializeDetails() {
    if (!selectedAttendanceId) return;
    if (!students.length) {
      toast.error("Lop hoc chua co sinh vien de diem danh");
      return;
    }

    const result = await createBulkDetails({
      details: students.map((student) => ({
        studentProfileId: student.profileId,
        status: "PRESENT",
      })),
    });

    if (!result.ok) {
      toast.error(
        result.error?.message ?? "Khoi tao danh sach diem danh that bai",
      );
      return;
    }

    await refreshDetails();
    toast.success("Da khoi tao danh sach diem danh");
  }

  async function handleStatusChange(
    studentProfileId: number,
    nextStatus: AttendanceStatus,
  ) {
    if (!selectedAttendanceId) return;

    const detail = detailsMap.get(studentProfileId);
    if (!detail) {
      toast.error("Hay khoi tao danh sach diem danh truoc");
      return;
    }

    setUpdatingStudentId(studentProfileId);
    try {
      await updateAttendanceDetail(
        selectedAttendanceId,
        detail.attendanceDetailId,
        { status: nextStatus },
      );
      await refreshDetails();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Cap nhat diem danh that bai";
      toast.error(message);
    } finally {
      setUpdatingStudentId(null);
    }
  }

  return (
    <Sheet
      open={section !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-6xl"
      >
        <SheetHeader>
          <SheetTitle>Diem danh - {section?.subjectName ?? ""}</SheetTitle>
          <SheetDescription>
            Double-click vao lop de mo man hinh diem danh theo tung buoi hoc.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div className="rounded-lg border p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-medium">Buoi hoc</p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCreateAttendance}
                disabled={!sectionId || isCreatingAttendance}
              >
                <Plus className="mr-1 h-4 w-4" />
                Tao buoi
              </Button>
            </div>

            {isAttendanceLoading ? (
              <p className="text-muted-foreground text-sm">
                Dang tai buoi hoc...
              </p>
            ) : attendances.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Chua co buoi diem danh. Bam "Tao buoi" de bat dau.
              </p>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {attendances.map((item, idx) => {
                  const active = item.attendanceId === selectedAttendanceId;
                  return (
                    <button
                      key={item.attendanceId}
                      type="button"
                      onClick={() => setSelectedAttendanceId(item.attendanceId)}
                      className={[
                        "min-w-[110px] rounded-md border px-3 py-2 text-left text-sm transition-colors",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "hover:bg-muted",
                      ].join(" ")}
                    >
                      <p className="font-semibold">#{idx + 1}</p>
                      <p className="text-xs opacity-90">
                        {formatDateLabel(item.attendanceDate)}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-lg border p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-medium">Danh sach diem danh</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Present: {summary.present}</Badge>
                <Badge variant="secondary">Late: {summary.late}</Badge>
                <Badge variant="secondary">Absent: {summary.absent}</Badge>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleInitializeDetails}
                  disabled={
                    !selectedAttendanceId ||
                    isInitializingDetails ||
                    isStudentsLoading ||
                    students.length === 0 ||
                    details.length > 0
                  }
                >
                  <Users className="mr-1 h-4 w-4" />
                  Khoi tao danh sach
                </Button>
              </div>
            </div>

            {!selectedAttendanceId ? (
              <p className="text-muted-foreground text-sm">
                Hay chon mot buoi hoc de diem danh.
              </p>
            ) : isStudentsLoading ||
              isRegistrationsLoading ||
              isDetailsLoading ? (
              <p className="text-muted-foreground text-sm">
                Dang tai du lieu...
              </p>
            ) : students.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Lop hoc chua co sinh vien dang ky.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="px-2 py-2 text-left font-medium">
                        Sinh vien
                      </th>
                      <th className="px-2 py-2 text-center font-medium">
                        Present
                      </th>
                      <th className="px-2 py-2 text-center font-medium">
                        Late
                      </th>
                      <th className="px-2 py-2 text-center font-medium">
                        Absent
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => {
                      const detail = detailsMap.get(student.profileId);
                      const status = (detail?.status ?? "").toUpperCase();
                      const disabled =
                        updatingStudentId === student.profileId || !detail;

                      return (
                        <tr
                          key={student.profileId}
                          className="border-b last:border-b-0"
                        >
                          <td className="px-2 py-2">
                            <p className="font-medium">
                              {student.fullName ?? "N/A"}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {student.email ?? ""}
                            </p>
                          </td>

                          <td className="px-2 py-2 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={disabled}
                              onClick={() =>
                                handleStatusChange(student.profileId, "PRESENT")
                              }
                            >
                              {status === "PRESENT" ? (
                                statusIcon("PRESENT")
                              ) : (
                                <Check className="text-muted-foreground h-4 w-4" />
                              )}
                            </Button>
                          </td>

                          <td className="px-2 py-2 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={disabled}
                              onClick={() =>
                                handleStatusChange(student.profileId, "LATE")
                              }
                            >
                              {status === "LATE" ? (
                                statusIcon("LATE")
                              ) : (
                                <Clock3 className="text-muted-foreground h-4 w-4" />
                              )}
                            </Button>
                          </td>

                          <td className="px-2 py-2 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={disabled}
                              onClick={() =>
                                handleStatusChange(student.profileId, "ABSENT")
                              }
                            >
                              {status === "ABSENT" ? (
                                statusIcon("ABSENT")
                              ) : (
                                <X className="text-muted-foreground h-4 w-4" />
                              )}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
