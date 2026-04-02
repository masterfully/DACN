"use client";

import { Check, Clock3, Plus, Users, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";
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
import type { AttendanceDetail, AttendanceStatus } from "@/types/attendance";
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
  const t = useTranslations("MyClasses");
  const locale = useLocale();

  const [selectedAttendanceId, setSelectedAttendanceId] = React.useState<
    number | null
  >(null);
  const [updatingStudentId, setUpdatingStudentId] = React.useState<
    number | null
  >(null);

  const sectionId = section?.sectionId;

  const formatDateLabel = React.useCallback(
    (value: string) => {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return value;
      const intlLocale = locale.startsWith("vi") ? "vi-VN" : "en-US";
      return d.toLocaleDateString(intlLocale, {
        day: "2-digit",
        month: "2-digit",
      });
    },
    [locale],
  );

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
      note: t("attendance.sessionNote", { slot: nextSlot }),
    });

    if (!result.ok) {
      toast.error(
        result.error?.message ?? t("attendance.toastCreateSessionFailed"),
      );
      return;
    }

    const refreshed = await refreshAttendances();
    const latest = refreshed?.items?.at(-1);
    if (latest) {
      setSelectedAttendanceId(latest.attendanceId);
    }
    toast.success(t("attendance.toastCreateSessionOk"));
  }

  async function handleInitializeDetails() {
    if (!selectedAttendanceId) return;
    if (!students.length) {
      toast.error(t("attendance.toastNoStudentsInit"));
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
        result.error?.message ?? t("attendance.toastInitRosterFailed"),
      );
      return;
    }

    await refreshDetails();
    toast.success(t("attendance.toastInitRosterOk"));
  }

  async function handleStatusChange(
    studentProfileId: number,
    nextStatus: AttendanceStatus,
  ) {
    if (!selectedAttendanceId) return;

    const detail = detailsMap.get(studentProfileId);
    if (!detail) {
      toast.error(t("attendance.toastInitRosterFirst"));
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
        error instanceof Error
          ? error.message
          : t("attendance.toastUpdateFailed");
      toast.error(message);
    } finally {
      setUpdatingStudentId(null);
    }
  }

  const studentLabel = (student: AttendanceStudent) =>
    student.fullName?.trim() || t("attendance.studentNameFallback");

  return (
    <Sheet
      open={section !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="right"
        className="w-full overflow-y-auto px-4 sm:max-w-6xl"
      >
        <SheetHeader>
          <SheetTitle>
            {t("attendance.sheetTitle", {
              subject: section?.subjectName ?? "",
            })}
          </SheetTitle>
          <SheetDescription>
            {t("attendance.sheetDescription")}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div className="rounded-lg border p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-medium">
                {t("attendance.sessionsTitle")}
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCreateAttendance}
                disabled={!sectionId || isCreatingAttendance}
              >
                <Plus className="mr-1 h-4 w-4" />
                {t("attendance.createSession")}
              </Button>
            </div>

            {isAttendanceLoading ? (
              <p className="text-muted-foreground text-sm">
                {t("attendance.sessionsLoading")}
              </p>
            ) : attendances.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                {t("attendance.sessionsEmpty")}
              </p>
            ) : (
              <fieldset className="m-0 flex min-w-0 gap-2 overflow-x-auto border-0 p-0 pb-1">
                <legend className="sr-only">
                  {t("attendance.sessionPickerLabel")}
                </legend>
                {attendances.map((item, idx) => {
                  const active = item.attendanceId === selectedAttendanceId;
                  const dateStr = formatDateLabel(item.attendanceDate);
                  return (
                    <button
                      key={item.attendanceId}
                      type="button"
                      aria-pressed={active}
                      aria-label={t("attendance.sessionChipLabel", {
                        number: idx + 1,
                        date: dateStr,
                      })}
                      onClick={() => setSelectedAttendanceId(item.attendanceId)}
                      className={[
                        "min-w-[110px] rounded-md border px-3 py-2 text-left text-sm transition-colors",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "hover:bg-muted",
                      ].join(" ")}
                    >
                      <p className="font-semibold">#{idx + 1}</p>
                      <p className="text-xs opacity-90">{dateStr}</p>
                    </button>
                  );
                })}
              </fieldset>
            )}
          </div>

          <div className="rounded-lg border p-3">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">
                {t("attendance.rosterTitle")}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  {t("attendance.summaryPresent", { count: summary.present })}
                </Badge>
                <Badge variant="secondary">
                  {t("attendance.summaryLate", { count: summary.late })}
                </Badge>
                <Badge variant="secondary">
                  {t("attendance.summaryAbsent", { count: summary.absent })}
                </Badge>
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
                  {t("attendance.initRoster")}
                </Button>
              </div>
            </div>

            {!selectedAttendanceId ? (
              <p className="text-muted-foreground text-sm">
                {t("attendance.selectSessionFirst")}
              </p>
            ) : isStudentsLoading ||
              isRegistrationsLoading ||
              isDetailsLoading ? (
              <p className="text-muted-foreground text-sm">
                {t("attendance.rosterLoading")}
              </p>
            ) : students.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                {t("attendance.noStudents")}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="px-2 py-2 text-left font-medium">
                        {t("attendance.colStudent")}
                      </th>
                      <th className="px-2 py-2 text-center font-medium">
                        {t("attendance.statusPresent")}
                      </th>
                      <th className="px-2 py-2 text-center font-medium">
                        {t("attendance.statusLate")}
                      </th>
                      <th className="px-2 py-2 text-center font-medium">
                        {t("attendance.statusAbsent")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => {
                      const detail = detailsMap.get(student.profileId);
                      const status = (detail?.status ?? "").toUpperCase();
                      const disabled =
                        updatingStudentId === student.profileId || !detail;
                      const name = studentLabel(student);

                      return (
                        <tr
                          key={student.profileId}
                          className="border-b last:border-b-0"
                        >
                          <td className="px-2 py-2">
                            <p className="font-medium">{name}</p>
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
                              aria-label={t("attendance.markPresentFor", {
                                name,
                              })}
                              aria-pressed={status === "PRESENT"}
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
                              aria-label={t("attendance.markLateFor", {
                                name,
                              })}
                              aria-pressed={status === "LATE"}
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
                              aria-label={t("attendance.markAbsentFor", {
                                name,
                              })}
                              aria-pressed={status === "ABSENT"}
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
