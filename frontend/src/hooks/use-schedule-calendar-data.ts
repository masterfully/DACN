"use client";

import type { Role } from "@/types/account";

import {
  overlapsWeek,
  toISODateLocal,
  weekRangeISO,
} from "@/lib/schedule-calendar";

import { getMyRegistrations } from "@/services/registration-service";
import { getScheduleList } from "@/services/schedule-service";
import { getMySections, getSectionSchedules } from "@/services/section-service";
import type { Schedule } from "@/types/schedule";
import { useFetchWithFetcher } from "./use-fetch";

export type ScheduleCalendarRole = Role | null | undefined;

function dedupeSchedules(rows: Schedule[]): Schedule[] {
  const map = new Map<number, Schedule>();
  for (const s of rows) {
    map.set(s.scheduleId, s);
  }
  return [...map.values()];
}

function filterOverlappingWeek(
  rows: Schedule[],
  weekStart: string,
  weekEnd: string,
): Schedule[] {
  return rows.filter((s) =>
    overlapsWeek(s.startDate, s.endDate, weekStart, weekEnd),
  );
}

async function fetchStudentOrLecturerSchedules(
  role: "STUDENT" | "LECTURER",
  weekMonday: Date,
  yearFilter: string | null,
): Promise<Schedule[]> {
  const { weekStart, weekEnd } = weekRangeISO(weekMonday);

  const sectionIds: number[] = [];

  if (role === "STUDENT") {
    const reg = await getMyRegistrations({
      page: 1,
      limit: 100,
      ...(yearFilter ? { year: yearFilter } : {}),
    });
    for (const r of reg.items) {
      if (!yearFilter || r.year === yearFilter) {
        sectionIds.push(r.sectionId);
      }
    }
  } else {
    const sec = await getMySections({
      page: 1,
      limit: 100,
      ...(yearFilter ? { year: yearFilter } : {}),
    });
    for (const s of sec.items) {
      if (!yearFilter || s.year === yearFilter) {
        sectionIds.push(s.sectionId);
      }
    }
  }

  const unique = [...new Set(sectionIds)];
  if (unique.length === 0) {
    return [];
  }

  const batches = await Promise.all(unique.map((id) => getSectionSchedules(id)));
  const merged = dedupeSchedules(batches.flat());
  return filterOverlappingWeek(merged, weekStart, weekEnd);
}

async function fetchAdminSchedules(weekMonday: Date): Promise<Schedule[]> {
  const { weekStart, weekEnd } = weekRangeISO(weekMonday);
  const res = await getScheduleList({
    page: 1,
    limit: 100,
    startDate: weekStart,
    endDate: weekEnd,
  });
  return filterOverlappingWeek(res.items, weekStart, weekEnd);
}

function buildCalendarKey(
  role: Role,
  weekMonday: Date,
  yearFilter: string | null,
): string | null {
  if (role !== "STUDENT" && role !== "LECTURER" && role !== "ADMIN") {
    return null;
  }

  const d = toISODateLocal(weekMonday);
  const y = yearFilter ?? "all";
  return `schedule-calendar:${role}:${d}:${y}`;
}

async function fetchCalendarData(
  role: Role,
  weekMonday: Date,
  yearFilter: string | null,
): Promise<Schedule[]> {
  if (role === "ADMIN") {
    return fetchAdminSchedules(weekMonday);
  }
  if (role === "STUDENT" || role === "LECTURER") {
    return fetchStudentOrLecturerSchedules(role, weekMonday, yearFilter);
  }
  return [];
}

export function useScheduleCalendarData(
  role: ScheduleCalendarRole,
  weekMonday: Date,
  yearFilter: string | null,
) {
  const key = role ? buildCalendarKey(role, weekMonday, yearFilter) : null;

  return useFetchWithFetcher<Schedule[]>(
    key,
    () => {
      if (!role) {
        return Promise.resolve([]);
      }
      return fetchCalendarData(role, weekMonday, yearFilter);
    },
    {
      enabled: key !== null,
    },
  );
}
