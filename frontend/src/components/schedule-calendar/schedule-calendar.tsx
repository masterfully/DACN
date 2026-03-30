"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  buildFallbackAcademicYears,
  buildWeekOptions,
  getAcademicYearGuess,
  startOfISOWeekLocal,
  toISODateLocal,
  type WeekOption,
} from "@/lib/schedule-calendar";
import { cn } from "@/lib/utils";
import type { ApiError } from "@/types/api";
import type { Schedule } from "@/types/schedule";

const DEFAULT_TITLE = "Lịch học";

const DEFAULT_PERIODS_PER_DAY = 10;

const DEFAULT_DAYS_LABELS: readonly string[] = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ Nhật",
];

function addDaysLocal(date: Date, days: number): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDDMM(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

function dayOfWeekToIndex(dayOfWeek: string): number | null {
  const norm = dayOfWeek.trim().toLowerCase();
  switch (norm) {
    case "monday":
      return 0;
    case "tuesday":
      return 1;
    case "wednesday":
      return 2;
    case "thursday":
      return 3;
    case "friday":
      return 4;
    case "saturday":
      return 5;
    case "sunday":
      return 6;
    default:
      return null;
  }
}

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0; // force 32-bit
  }
  return Math.abs(h);
}

const SUBJECT_PALETTE: Array<{ bg: string; border: string; text: string }> = [
  {
    bg: "bg-blue-500/10",
    border: "border-blue-500/40",
    text: "text-blue-700 dark:text-blue-200",
  },
  {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/40",
    text: "text-emerald-700 dark:text-emerald-200",
  },
  {
    bg: "bg-orange-500/10",
    border: "border-orange-500/40",
    text: "text-orange-700 dark:text-orange-200",
  },
  {
    bg: "bg-fuchsia-500/10",
    border: "border-fuchsia-500/40",
    text: "text-fuchsia-700 dark:text-fuchsia-200",
  },
  {
    bg: "bg-rose-500/10",
    border: "border-rose-500/40",
    text: "text-rose-700 dark:text-rose-200",
  },
  {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/40",
    text: "text-cyan-700 dark:text-cyan-200",
  },
];

function getSubjectColor(subjectName: string) {
  const h = hashString(subjectName || "");
  return SUBJECT_PALETTE[h % SUBJECT_PALETTE.length];
}

export type ScheduleCalendarProps = {
  title?: string;
  canRender: boolean;
  yearOptions: string[];
  academicYear: string;
  onAcademicYearChange: (next: string) => void;
  weekMonday: Date;
  onWeekMondayChange: (next: Date) => void;
  schedules?: Schedule[];
  isLoading: boolean;
  error?: ApiError;
  periodsPerDay?: number;
  daysLabels?: readonly string[];
};

export function ScheduleCalendar({
  title = DEFAULT_TITLE,
  canRender,
  yearOptions,
  academicYear,
  onAcademicYearChange,
  weekMonday,
  onWeekMondayChange,
  schedules,
  isLoading,
  error,
  periodsPerDay = DEFAULT_PERIODS_PER_DAY,
  daysLabels = DEFAULT_DAYS_LABELS,
}: ScheduleCalendarProps) {
  const uid = React.useId();
  const today = React.useMemo(() => new Date(), []);

  const [yearSearch, setYearSearch] = React.useState<string>("");
  const [weekSearch, setWeekSearch] = React.useState<string>("");

  const fallbackYearOptions = React.useMemo(
    () => buildFallbackAcademicYears(getAcademicYearGuess(today), 2),
    [today],
  );

  const availableYearOptions =
    yearOptions.length > 0 ? yearOptions : fallbackYearOptions;

  const filteredYearOptions = React.useMemo(() => {
    const q = yearSearch.trim().toLowerCase();
    if (!q) return availableYearOptions;
    return availableYearOptions.filter((y) => y.toLowerCase().includes(q));
  }, [availableYearOptions, yearSearch]);

  const yearMenuOptions = React.useMemo(() => {
    if (!academicYear) return filteredYearOptions;
    if (filteredYearOptions.includes(academicYear)) return filteredYearOptions;
    return [...filteredYearOptions, academicYear];
  }, [academicYear, filteredYearOptions]);

  React.useEffect(() => {
    // Only try to "auto-fix" academic year when API has something to offer.
    if (yearOptions.length === 0) return;
    if (!availableYearOptions.includes(academicYear)) {
      const guess = getAcademicYearGuess(today);
      onAcademicYearChange(
        yearOptions.includes(guess) ? guess : yearOptions[0],
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    yearOptions,
    availableYearOptions,
    academicYear,
    today,
    onAcademicYearChange,
  ]);

  const weekOptions = React.useMemo((): WeekOption[] => {
    return buildWeekOptions(academicYear);
  }, [academicYear]);

  React.useEffect(() => {
    // Reset week search when changing academic year to avoid confusing empty results.
    void academicYear;
    setWeekSearch("");
  }, [academicYear]);

  React.useEffect(() => {
    if (!academicYear || weekOptions.length === 0) return;

    const currentMonday = startOfISOWeekLocal(today);
    const currentISO = toISODateLocal(currentMonday);
    const match = weekOptions.find((w) => w.mondayISO === currentISO);

    if (match) onWeekMondayChange(match.weekMonday);
    else onWeekMondayChange(weekOptions[0].weekMonday);
  }, [academicYear, onWeekMondayChange, today, weekOptions]);

  const selectedWeekISO = toISODateLocal(weekMonday);
  const currentWeekIndex = weekOptions.findIndex(
    (w) => w.mondayISO === selectedWeekISO,
  );

  function goWeek(delta: number) {
    if (currentWeekIndex < 0) return;
    const nextIndex = currentWeekIndex + delta;
    if (nextIndex < 0 || nextIndex >= weekOptions.length) return;
    onWeekMondayChange(weekOptions[nextIndex].weekMonday);
  }

  const filteredWeekOptions = React.useMemo(() => {
    const q = weekSearch.trim().toLowerCase();
    if (!q) return weekOptions;
    return weekOptions.filter(
      (w) =>
        w.label.toLowerCase().includes(q) ||
        w.mondayISO.toLowerCase().includes(q),
    );
  }, [weekOptions, weekSearch]);

  const selectedWeekOption = React.useMemo(
    () => weekOptions.find((w) => w.mondayISO === selectedWeekISO),
    [weekOptions, selectedWeekISO],
  );

  const weekMenuOptions = React.useMemo(() => {
    if (!selectedWeekOption) return filteredWeekOptions;
    if (
      filteredWeekOptions.some(
        (w) => w.mondayISO === selectedWeekOption.mondayISO,
      )
    ) {
      return filteredWeekOptions;
    }
    return [...filteredWeekOptions, selectedWeekOption];
  }, [filteredWeekOptions, selectedWeekOption]);

  const header = (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <Badge variant="secondary" className="h-6 px-2">
            {academicYear}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-1">
          <Label>Năm học</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={availableYearOptions.length === 0}
              >
                {academicYear || "Chọn năm"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="max-h-72 w-56 overflow-y-auto"
            >
              <DropdownMenuLabel>Năm học</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Label htmlFor={`${uid}-year-search`} className="sr-only">
                  Tìm năm học
                </Label>
                <Input
                  id={`${uid}-year-search`}
                  name={`${uid}-year-search`}
                  value={yearSearch}
                  onChange={(e) => setYearSearch(e.target.value)}
                  placeholder="Tìm năm…"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={academicYear ?? ""}
                onValueChange={(value) => onAcademicYearChange(value)}
              >
                {yearMenuOptions.map((y) => (
                  <DropdownMenuRadioItem key={y} value={y}>
                    {y}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col gap-1">
          <Label>Tuần</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => goWeek(-1)}
              disabled={currentWeekIndex <= 0}
              aria-label="Tuần trước"
            >
              <ChevronLeft className="size-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={weekOptions.length === 0}
                >
                  {weekOptions[currentWeekIndex]?.label ?? "Chọn tuần"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="max-h-72 w-72 overflow-y-auto"
              >
                <DropdownMenuLabel>Tuần</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Label htmlFor={`${uid}-week-search`} className="sr-only">
                    Tìm tuần
                  </Label>
                  <Input
                    id={`${uid}-week-search`}
                    name={`${uid}-week-search`}
                    value={weekSearch}
                    onChange={(e) => setWeekSearch(e.target.value)}
                    placeholder="Tìm tuần…"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={selectedWeekISO}
                  onValueChange={(value) => {
                    const match = weekOptions.find(
                      (w) => w.mondayISO === value,
                    );
                    if (match) onWeekMondayChange(match.weekMonday);
                  }}
                >
                  {weekMenuOptions.map((w) => (
                    <DropdownMenuRadioItem
                      key={w.mondayISO}
                      value={w.mondayISO}
                    >
                      {w.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => goWeek(1)}
              disabled={
                currentWeekIndex < 0 ||
                currentWeekIndex >= weekOptions.length - 1
              }
              aria-label="Tuần sau"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const dayHeaders =
    weekOptions.length > 0 ? (
      <div
        className="grid items-stretch"
        style={{
          gridTemplateColumns: `64px repeat(7, minmax(0, 1fr))`,
          height: 44,
        }}
      >
        <div className="bg-muted/30 text-muted-foreground flex h-11 items-center border-r border-b px-2 py-0 text-xs font-medium">
          <p className="w-full text-center text-xs leading-none font-semibold">
            Tiết
          </p>
        </div>
        {daysLabels.map((dayLabel, dayIndex) => {
          const d = addDaysLocal(weekMonday, dayIndex);
          return (
            <div
              key={dayLabel}
              className="bg-muted/30 flex h-11 min-w-0 flex-col justify-center gap-1 border-r border-b px-2 py-0"
            >
              <div className="text-xs leading-none font-semibold">
                {dayLabel}
              </div>
              <div className="text-muted-foreground truncate text-[11px] leading-none">
                {formatDDMM(d)}
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div
        className="grid items-stretch"
        style={{
          gridTemplateColumns: `64px repeat(7, minmax(0, 1fr))`,
          height: 44,
        }}
      >
        <div className="bg-muted/30 text-muted-foreground flex h-11 items-center border-r border-b px-2 py-0 text-xs font-medium">
          Tiết
        </div>
        {daysLabels.map((dayLabel) => (
          <div
            key={dayLabel}
            className="bg-muted/30 flex h-11 items-center border-r border-b px-2 py-0"
          >
            <Skeleton className="h-3.5 w-full rounded-sm" />
          </div>
        ))}
      </div>
    );

  const renderEmptyGridCells = () => {
    const cells: React.ReactNode[] = [];
    for (let period = 1; period <= periodsPerDay; period++) {
      cells.push(
        <div
          key={`label-${period}`}
          style={{ gridColumn: 1, gridRow: period }}
          className="bg-muted/20 text-muted-foreground flex items-center justify-center border-r border-b px-2 text-xs font-medium"
        >
          Tiết {period}
        </div>,
      );
      for (let day = 0; day < 7; day++) {
        cells.push(
          <div
            key={`cell-${day}-${period}`}
            style={{ gridColumn: day + 2, gridRow: period }}
            className="bg-background border-r border-b"
          />,
        );
      }
    }
    return cells;
  };

  const renderSkeletonGridCells = () => {
    const cells: React.ReactNode[] = [];
    for (let period = 1; period <= periodsPerDay; period++) {
      cells.push(
        <div
          key={`sk-label-${period}`}
          style={{ gridColumn: 1, gridRow: period }}
          className="bg-muted/20 flex items-center justify-center border-r border-b px-2"
        >
          <Skeleton className="h-3 w-12 rounded-sm" />
        </div>,
      );
      for (let day = 0; day < 7; day++) {
        cells.push(
          <div
            key={`sk-cell-${day}-${period}`}
            style={{ gridColumn: day + 2, gridRow: period }}
            className="bg-background flex items-center border-r border-b px-2"
          >
            <Skeleton className="h-3 w-full rounded-sm" />
          </div>,
        );
      }
    }
    return cells;
  };

  const scheduleBlocks = (schedules ?? []).map((s) => {
    const dayIndex = dayOfWeekToIndex(s.dayOfWeek);
    if (dayIndex === null) return null;

    const start = Math.max(1, s.startPeriod);
    const end = Math.min(periodsPerDay, s.endPeriod);
    if (end < 1 || start > periodsPerDay || start > end) return null;

    const color = getSubjectColor(s.subjectName);
    const blockStyle: React.CSSProperties = {
      gridColumnStart: dayIndex + 2,
      gridColumnEnd: dayIndex + 3,
      gridRowStart: start,
      gridRowEnd: end + 1,
      zIndex: 10 + start,
    };

    return (
      <div
        key={s.scheduleId}
        style={blockStyle}
        className={cn(
          "w-full min-w-0 overflow-hidden rounded-md border p-2",
          color.bg,
          color.border,
          color.text,
        )}
      >
        <div className="flex min-w-0 flex-col gap-1">
          <div className="w-full min-w-0 truncate text-[11.5px] leading-tight font-semibold text-wrap">
            {s.subjectName}
          </div>
          <div className="w-full min-w-0 truncate text-[10.5px] leading-tight opacity-90">
            Phòng: {s.roomName}
          </div>
        </div>
      </div>
    );
  });

  const showSkeleton = canRender && (isLoading || weekOptions.length === 0);
  const hasSchedules = (schedules?.length ?? 0) > 0;

  return (
    <div className="flex flex-1 flex-col gap-4">
      {header}

      <Separator className="my-4" />

      {!canRender ? (
        <div className="bg-background overflow-hidden rounded-lg border p-4 text-sm">
          <div className="font-medium">Không thể tải lịch</div>
          <div className="text-muted-foreground mt-1">
            Vai trò hiện tại không hợp lệ để hiển thị lịch.
          </div>
        </div>
      ) : showSkeleton ? (
        <div
          aria-busy="true"
          className="bg-background overflow-hidden rounded-lg border"
        >
          <output aria-live="polite" className="sr-only">
            Đang tải lịch…
          </output>
          {dayHeaders}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `64px repeat(7, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${periodsPerDay}, 44px)`,
            }}
          >
            {renderSkeletonGridCells()}
          </div>
        </div>
      ) : error ? (
        <div className="bg-background overflow-hidden rounded-lg border">
          {dayHeaders}
          <div
            className="text-destructive p-3 text-sm"
            role="alert"
            aria-live="polite"
          >
            {error.message || "Không thể tải lịch. Vui lòng thử lại."}
          </div>
        </div>
      ) : (
        <div className="bg-background overflow-hidden rounded-lg border">
          {dayHeaders}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `64px repeat(7, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${periodsPerDay}, 44px)`,
            }}
          >
            {renderEmptyGridCells()}
            {scheduleBlocks}
          </div>

          {!hasSchedules && (
            <output
              className="text-muted-foreground p-3 text-sm"
              aria-live="polite"
            >
              Không có lịch cho tuần này.
            </output>
          )}
        </div>
      )}
    </div>
  );
}
