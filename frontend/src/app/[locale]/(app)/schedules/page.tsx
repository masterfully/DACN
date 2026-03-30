"use client";

import * as React from "react";

import { ScheduleCalendar } from "@/components/schedule-calendar/schedule-calendar";
import {
  useMyRegistrations,
  useMySections,
  useScheduleCalendarData,
} from "@/hooks";
import {
  getAcademicYearGuess,
  parseAcademicYear,
  startOfISOWeekLocal,
} from "@/lib/schedule-calendar";
import { useAuthStore } from "@/stores/auth-store";

export default function SchedulesPage() {
  const role = useAuthStore((s) => s.currentUser?.role);

  const today = React.useMemo(() => new Date(), []);
  const defaultAcademicYear = React.useMemo(
    () => getAcademicYearGuess(today),
    [today],
  );

  const [academicYear, setAcademicYear] =
    React.useState<string>(defaultAcademicYear);
  const [weekMonday, setWeekMonday] = React.useState<Date>(() =>
    startOfISOWeekLocal(today),
  );

  const { data: myRegs } = useMyRegistrations({ page: 1, limit: 100 });
  const { data: mySections } = useMySections({ page: 1, limit: 100 });

  const yearOptions = React.useMemo(() => {
    const years =
      role === "STUDENT"
        ? (myRegs?.items.map((i) => i.year) ?? [])
        : (mySections?.items.map((i) => i.year) ?? []);

    const unique = Array.from(new Set(years)).filter(Boolean);
    unique.sort((a, b) => {
      const ap = parseAcademicYear(a);
      const bp = parseAcademicYear(b);
      const ax = ap ? ap.startYear : 0;
      const bx = bp ? bp.startYear : 0;
      return bx - ax;
    });
    return unique;
  }, [myRegs?.items, mySections?.items, role]);

  const scheduleRole = role ?? null;
  const {
    data: schedules,
    isLoading: schedulesLoading,
    error: schedulesError,
  } = useScheduleCalendarData(scheduleRole, weekMonday, academicYear);

  return (
    <ScheduleCalendar
      canRender={scheduleRole != null}
      yearOptions={yearOptions}
      academicYear={academicYear}
      onAcademicYearChange={setAcademicYear}
      weekMonday={weekMonday}
      onWeekMondayChange={setWeekMonday}
      schedules={schedules}
      isLoading={schedulesLoading}
      error={schedulesError}
    />
  );
}
