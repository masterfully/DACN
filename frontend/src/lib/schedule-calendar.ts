/**
 * Utilities for schedule calendar rendering.
 *
 * Note: API contract for date-only strings is `YYYY-MM-DD`.
 * Backend parses `YYYY-MM-DDT00:00:00.000Z`, so we must send a stable
 * date-only representation (no timezone offsets).
 */

const pad2 = (n: number): string => String(n).padStart(2, "0");

export function toISODateLocal(date: Date): string {
  // Create a stable local date string: YYYY-MM-DD
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}-${pad2(m)}-${pad2(d)}`;
}

function toUTCDateOnlyMs(dateOnly: string): number {
  // Interpret date-only string as UTC midnight for consistent comparisons.
  return new Date(`${dateOnly}T00:00:00.000Z`).getTime();
}

function addDaysLocal(date: Date, days: number): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Given a Monday date of an ISO week, return inclusive week boundaries.
 */
export function weekRangeISO(weekMonday: Date): {
  weekStart: string;
  weekEnd: string;
} {
  const monday = new Date(
    weekMonday.getFullYear(),
    weekMonday.getMonth(),
    weekMonday.getDate(),
  );
  monday.setHours(0, 0, 0, 0);

  const sunday = addDaysLocal(monday, 6);
  return {
    weekStart: toISODateLocal(monday),
    weekEnd: toISODateLocal(sunday),
  };
}

/**
 * True if [startDate..endDate] overlaps (inclusive) [weekStart..weekEnd].
 */
export function overlapsWeek(
  startDate: string,
  endDate: string,
  weekStart: string,
  weekEnd: string,
): boolean {
  const s = toUTCDateOnlyMs(startDate);
  const e = toUTCDateOnlyMs(endDate);
  const ws = toUTCDateOnlyMs(weekStart);
  const we = toUTCDateOnlyMs(weekEnd);

  // Overlap for inclusive ranges: start <= we && end >= ws
  return s <= we && e >= ws;
}

function formatDDMM(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

function formatDDMMYY(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

/**
 * ISO week starts on Monday.
 *
 * Given an arbitrary local date, return the Monday (local midnight) of that ISO week.
 */
export function startOfISOWeekLocal(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setHours(0, 0, 0, 0);
  const isoDay = ((d.getDay() + 6) % 7) + 1; // Mon=1..Sun=7
  return addDaysLocal(d, -(isoDay - 1));
}

export function parseAcademicYear(
  year: string,
): { startYear: number; endYear: number } | null {
  const parts = year.split("-");
  if (parts.length !== 2) return null;
  const startYear = Number(parts[0]);
  const endYear = Number(parts[1]);
  if (!Number.isFinite(startYear) || !Number.isFinite(endYear)) return null;
  return { startYear, endYear };
}

function isoWeekInfo(date: Date): { isoWeek: number; isoWeekYear: number } {
  // ISO week algorithm (based on UTC calendar).
  const tmp = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = tmp.getUTCDay() || 7; // Mon=1..Sun=7
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum); // Thursday in current week
  const isoWeekYear = tmp.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoWeekYear, 0, 1));
  const weekNo = Math.ceil(
    ((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return { isoWeek: weekNo, isoWeekYear };
}

export type WeekOption = {
  weekMonday: Date;
  mondayISO: string; // YYYY-MM-DD
  isoWeek: number;
  isoWeekYear: number;
  label: string;
};

function buildWeekOptionsInternal(academicYear: string): WeekOption[] {
  const parsed = parseAcademicYear(academicYear);
  if (!parsed) return [];

  const rangeStart = new Date(parsed.startYear, 0, 1);
  rangeStart.setHours(0, 0, 0, 0);
  const rangeEnd = new Date(parsed.endYear, 11, 31);
  rangeEnd.setHours(0, 0, 0, 0);

  // First ISO week Monday on/after rangeStart.
  const startMonday = startOfISOWeekLocal(rangeStart);
  const firstMonday =
    startMonday < rangeStart ? addDaysLocal(startMonday, 7) : startMonday;

  const options: WeekOption[] = [];
  for (
    let monday = firstMonday;
    monday.getTime() <= rangeEnd.getTime();
    monday = addDaysLocal(monday, 7)
  ) {
    const { isoWeek, isoWeekYear } = isoWeekInfo(monday);
    const mondayISO = toISODateLocal(monday);
    options.push({
      weekMonday: monday,
      mondayISO,
      isoWeek,
      isoWeekYear,
      label: `Tuần ${isoWeek} [${formatDDMMYY(monday)} - ${formatDDMMYY(addDaysLocal(monday, 6))}]`,
    });
  }

  return options;
}

export function buildWeekOptions(academicYear: string): WeekOption[] {
  return buildWeekOptionsInternal(academicYear);
}

export function getAcademicYearGuess(date: Date): string {
  const y = date.getFullYear();
  return `${y}-${y + 1}`;
}

export function buildFallbackAcademicYears(
  guess: string,
  countPerSide = 2,
): string[] {
  const parsed = parseAcademicYear(guess);
  if (!parsed) return [guess].filter(Boolean);

  // Generate a small list so the dropdown still works when API calls fail.
  const start = parsed.startYear - countPerSide;
  const end = parsed.endYear + countPerSide - 1;
  const years: string[] = [];
  for (let y = start; y <= end; y++) {
    years.push(`${y}-${y + 1}`);
  }
  return years;
}
