"use client";

import { PlusIcon, TrashIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLecturerList } from "@/hooks/use-profiles";
import { useRoomList } from "@/hooks/use-rooms";
import { useSubjectList } from "@/hooks/use-subjects";
import { getApiFormErrorMessage, mapApiFieldErrors } from "@/lib/api-error";
import type { MutationResult } from "@/types/api";
import type { ProfileListItem } from "@/types/profile";
import type { Room } from "@/types/room";
import type {
  CreateSectionInput,
  SectionListItem,
  UpdateSectionInput,
} from "@/types/section";
import { SECTION_STATUS_OPTIONS } from "./section.constants";

const DAY_OF_WEEK_OPTIONS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  MONDAY: "T2",
  TUESDAY: "T3",
  WEDNESDAY: "T4",
  THURSDAY: "T5",
  FRIDAY: "T6",
  SATURDAY: "T7",
  SUNDAY: "CN",
};

type DayOfWeek = (typeof DAY_OF_WEEK_OPTIONS)[number];

export interface SectionScheduleFormItem {
  id: string;
  roomId: string;
  dayOfWeek: DayOfWeek | string;
  startPeriod: string;
  endPeriod: string;
}

export interface SectionFormValues {
  subjectId: string;
  lecturerProfileId: string;
  year: string;
  maxCapacity: string;
  status: string;
  visibility: string;
  startDate: string;
  endDate: string;
  schedule: SectionScheduleFormItem[];
}

export const SECTION_EMPTY_FORM: SectionFormValues = {
  subjectId: "",
  lecturerProfileId: "",
  year: "",
  maxCapacity: "",
  status: "0",
  visibility: "1",
  startDate: "",
  endDate: "",
  schedule: [],
};

export function sectionToFormValues(
  section: SectionListItem,
): SectionFormValues {
  return {
    subjectId: String(section.subjectId),
    lecturerProfileId: String(section.lecturerProfileId),
    year: section.year ?? "",
    maxCapacity: String(section.maxCapacity),
    status: String(section.status),
    // UI không cho chọn visibility; mặc định là hiển thị.
    visibility: "1",
    startDate: "",
    endDate: "",
    // schedule is only editable when creating; keep empty for edit.
    schedule: [],
  };
}

export interface SectionFormValidationError {
  field: keyof SectionFormValues | "general";
  message: string;
}

function validateYear(year: string): boolean {
  const match = year.match(/^(\d{4})-(\d{4})$/);
  if (!match) return false;
  const start = Number(match[1]);
  const end = Number(match[2]);
  return Number.isFinite(start) && Number.isFinite(end) && end === start + 1;
}

function isDayOfWeek(value: string): value is DayOfWeek {
  return (DAY_OF_WEEK_OPTIONS as readonly string[]).includes(value);
}

export function validateSectionForm(
  values: SectionFormValues,
  mode: "create" | "edit",
): SectionFormValidationError | null {
  if (!values.subjectId) {
    return { field: "subjectId", message: "Bắt buộc nhập subjectId." };
  }
  if (!values.lecturerProfileId) {
    return {
      field: "lecturerProfileId",
      message: "Bắt buộc nhập lecturerProfileId.",
    };
  }
  if (!validateYear(values.year)) {
    return {
      field: "year",
      message: "year phải đúng định dạng YYYY-YYYY và năm sau = năm trước + 1.",
    };
  }
  const maxCapacity = Number(values.maxCapacity);
  if (!Number.isFinite(maxCapacity) || maxCapacity <= 0) {
    return {
      field: "maxCapacity",
      message: "maxCapacity phải là số nguyên dương.",
    };
  }

  if (mode === "create") {
    if (values.schedule.length === 0) {
      return { field: "schedule", message: "Bắt buộc nhập schedule." };
    }

    for (const item of values.schedule) {
      const roomId = Number(item.roomId);
      if (!item.dayOfWeek || !isDayOfWeek(item.dayOfWeek)) {
        return {
          field: "schedule",
          message: "dayOfWeek phải là MONDAY..SUNDAY.",
        };
      }
      if (!Number.isFinite(roomId) || roomId <= 0) {
        return {
          field: "schedule",
          message: "roomId phải là số nguyên dương.",
        };
      }

      const startPeriod = Number(item.startPeriod);
      const endPeriod = Number(item.endPeriod);
      if (
        !Number.isFinite(startPeriod) ||
        !Number.isFinite(endPeriod) ||
        startPeriod <= 0 ||
        endPeriod <= 0 ||
        endPeriod < startPeriod
      ) {
        return {
          field: "schedule",
          message: "Period không hợp lệ (endPeriod >= startPeriod).",
        };
      }
    }

    if (!values.startDate || !values.endDate) {
      return {
        field: "schedule",
        message: "Ngày bắt đầu và ngày kết thúc không được để trống.",
      };
    }
    if (values.endDate < values.startDate) {
      return {
        field: "schedule",
        message: "Ngày kết thúc phải >= ngày bắt đầu.",
      };
    }
  }

  return null;
}

export function buildCreateSectionPayload(
  values: SectionFormValues,
): CreateSectionInput {
  return {
    subjectId: Number(values.subjectId),
    lecturerProfileId: Number(values.lecturerProfileId),
    year: values.year,
    maxCapacity: Number(values.maxCapacity),
    status: Number(values.status),
    // Backend visibility is 0|1; UI luôn mặc định hiển thị.
    visibility: 1,
    schedule: values.schedule.map((s) => ({
      roomId: Number(s.roomId),
      dayOfWeek: s.dayOfWeek,
      startPeriod: Number(s.startPeriod),
      endPeriod: Number(s.endPeriod),
      startDate: values.startDate,
      endDate: values.endDate,
    })),
  };
}

export function buildUpdateSectionPayload(
  values: SectionFormValues,
): UpdateSectionInput {
  return {
    lecturerProfileId: Number(values.lecturerProfileId),
    year: values.year,
    maxCapacity: Number(values.maxCapacity),
    status: Number(values.status),
    // No "visibility" picker in UI; always send visibility=1.
    visibility: 1,
  };
}

interface SectionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSection: SectionListItem | null;
  onSubmit: (
    values: SectionFormValues,
    mode: "create" | "edit",
  ) => Promise<MutationResult<unknown>>;
  isSubmitting?: boolean;
}

function createEmptyScheduleItem(): SectionScheduleFormItem {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    roomId: "",
    dayOfWeek: "MONDAY",
    startPeriod: "1",
    endPeriod: "1",
  };
}

export function SectionFormDialog({
  open,
  onOpenChange,
  editingSection,
  onSubmit,
  isSubmitting = false,
}: SectionFormDialogProps) {
  const mode: "create" | "edit" = editingSection ? "edit" : "create";

  const { data: subjectsData, isLoading: isSubjectsLoading } = useSubjectList({
    page: 1,
    limit: 1000,
  });
  const { data: lecturersData, isLoading: isLecturersLoading } =
    useLecturerList({ page: 1, limit: 1000 });
  const { data: roomsData, isLoading: isRoomsLoading } = useRoomList({
    page: 1,
    limit: 100,
  });

  const [values, setValues] =
    React.useState<SectionFormValues>(SECTION_EMPTY_FORM);
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<
    Partial<Record<keyof SectionFormValues, string>>
  >({});

  React.useEffect(() => {
    if (!open) return;

    setError(null);
    setFieldErrors({});

    if (editingSection) {
      setValues(sectionToFormValues(editingSection));
    } else {
      // Start with an empty schedule array.
      setValues(SECTION_EMPTY_FORM);
    }
  }, [open, editingSection]);

  function setBasicField(
    field: keyof Omit<SectionFormValues, "schedule">,
    value: string,
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function setScheduleField(
    index: number,
    field: keyof SectionScheduleFormItem,
    value: string,
  ) {
    setValues((prev) => {
      const nextSchedule = [...prev.schedule];
      nextSchedule[index] = { ...nextSchedule[index], [field]: value };
      return { ...prev, schedule: nextSchedule };
    });
  }

  function addScheduleRow() {
    setValues((prev) => ({
      ...prev,
      schedule: [...prev.schedule, createEmptyScheduleItem()],
    }));
  }

  function removeScheduleRow(index: number) {
    setValues((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const validationError = validateSectionForm(values, mode);
    if (validationError) {
      if (validationError.field === "general") {
        setError(validationError.message);
      } else {
        setFieldErrors({ [validationError.field]: validationError.message });
      }
      return;
    }

    const result = await onSubmit(values, mode);
    if (!result.ok) {
      setFieldErrors(mapApiFieldErrors<keyof SectionFormValues>(result.error));
      setError(
        getApiFormErrorMessage(
          result.error,
          mode === "edit"
            ? "Cập nhật lớp học phần thất bại. Vui lòng thử lại."
            : "Tạo lớp học phần thất bại. Vui lòng thử lại.",
        ),
      );
    }
  }

  const isOptionsLoading =
    isSubjectsLoading || isLecturersLoading || isRoomsLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Chỉnh sửa lớp học phần" : "Tạo lớp học phần"}
          </DialogTitle>
        </DialogHeader>

        <form id="section-form" onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-[2fr_3fr] gap-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="subjectId">Môn học</Label>
                  <select
                    id="subjectId"
                    value={values.subjectId}
                    onChange={(e) => setBasicField("subjectId", e.target.value)}
                    disabled={
                      isSubmitting || isOptionsLoading || mode === "edit"
                    }
                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Chọn môn học</option>
                    {(subjectsData?.items ?? []).map((s) => (
                      <option key={s.subjectId} value={String(s.subjectId)}>
                        {s.subjectName}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.subjectId ? (
                    <p className="text-destructive text-sm">
                      {fieldErrors.subjectId}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="lecturerProfileId">Giảng viên</Label>
                  <select
                    id="lecturerProfileId"
                    value={values.lecturerProfileId}
                    onChange={(e) =>
                      setBasicField("lecturerProfileId", e.target.value)
                    }
                    disabled={isSubmitting || isOptionsLoading}
                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Chọn giảng viên</option>
                    {(lecturersData?.items ?? []).map((p: ProfileListItem) => (
                      <option key={p.profileId} value={String(p.profileId)}>
                        {p.fullName ?? `#${p.profileId}`}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.lecturerProfileId ? (
                    <p className="text-destructive text-sm">
                      {fieldErrors.lecturerProfileId}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="year">Năm học</Label>
                  <Input
                    id="year"
                    placeholder="2024-2025"
                    value={values.year}
                    onChange={(e) => setBasicField("year", e.target.value)}
                    disabled={isSubmitting || isOptionsLoading}
                    required
                  />
                  {fieldErrors.year ? (
                    <p className="text-destructive text-sm">
                      {fieldErrors.year}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="maxCapacity">Sức chứa</Label>
                  <Input
                    id="maxCapacity"
                    type="number"
                    min={1}
                    placeholder="VD: 40"
                    value={values.maxCapacity}
                    onChange={(e) =>
                      setBasicField("maxCapacity", e.target.value)
                    }
                    disabled={isSubmitting || isOptionsLoading}
                    required
                  />
                  {fieldErrors.maxCapacity ? (
                    <p className="text-destructive text-sm">
                      {fieldErrors.maxCapacity}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="status">Trạng thái</Label>
                  <select
                    id="status"
                    value={values.status}
                    onChange={(e) => setBasicField("status", e.target.value)}
                    disabled={isSubmitting || isOptionsLoading}
                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {SECTION_STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.status ? (
                    <p className="text-destructive text-sm">
                      {fieldErrors.status}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {mode === "create" ? (
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">
                      Danh sách lịch học
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isSubmitting || isOptionsLoading}
                      onClick={addScheduleRow}
                    >
                      <PlusIcon className="size-4" />
                      Thêm lịch
                    </Button>
                  </div>

                  {fieldErrors.schedule ? (
                    <p className="text-destructive text-sm">
                      {fieldErrors.schedule}
                    </p>
                  ) : null}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                      <Label htmlFor="scheduleStartDate">Ngày bắt đầu</Label>
                      <Input
                        id="scheduleStartDate"
                        type="date"
                        value={values.startDate}
                        onChange={(e) =>
                          setBasicField("startDate", e.target.value)
                        }
                        disabled={isSubmitting || isOptionsLoading}
                        required
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="scheduleEndDate">Ngày kết thúc</Label>
                      <Input
                        id="scheduleEndDate"
                        type="date"
                        value={values.endDate}
                        onChange={(e) =>
                          setBasicField("endDate", e.target.value)
                        }
                        disabled={isSubmitting || isOptionsLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-md border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-3 py-2 text-left">Phòng</th>
                          <th className="px-3 py-2 text-left">Thứ</th>
                          <th className="px-3 py-2 text-left">Tiết bắt đầu</th>
                          <th className="px-3 py-2 text-left">Tiết kết thúc</th>
                          <th className="px-3 py-2 text-right">Xóa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {values.schedule.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="text-muted-foreground px-3 py-6 text-center"
                            >
                              Chưa có lịch học.
                            </td>
                          </tr>
                        ) : (
                          values.schedule.map((item, index) => (
                            <tr key={item.id} className="border-t">
                              <td className="px-3 py-2">
                                <select
                                  value={item.roomId}
                                  onChange={(e) =>
                                    setScheduleField(
                                      index,
                                      "roomId",
                                      e.target.value,
                                    )
                                  }
                                  disabled={isSubmitting || isOptionsLoading}
                                  className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                  required
                                >
                                  <option value="">Chọn phòng</option>
                                  {(roomsData?.items ?? []).map((r: Room) => (
                                    <option
                                      key={r.roomId}
                                      value={String(r.roomId)}
                                    >
                                      {r.roomName ?? `#${r.roomId}`}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-3 py-2">
                                <select
                                  value={item.dayOfWeek}
                                  onChange={(e) =>
                                    setScheduleField(
                                      index,
                                      "dayOfWeek",
                                      e.target.value,
                                    )
                                  }
                                  disabled={isSubmitting || isOptionsLoading}
                                  className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                  required
                                >
                                  {DAY_OF_WEEK_OPTIONS.map((d) => (
                                    <option key={d} value={d}>
                                      {DAY_OF_WEEK_LABELS[d]}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-3 py-2">
                                <Input
                                  type="number"
                                  min={1}
                                  value={item.startPeriod}
                                  onChange={(e) =>
                                    setScheduleField(
                                      index,
                                      "startPeriod",
                                      e.target.value,
                                    )
                                  }
                                  disabled={isSubmitting || isOptionsLoading}
                                  required
                                />
                              </td>
                              <td className="px-3 py-2">
                                <Input
                                  type="number"
                                  min={1}
                                  value={item.endPeriod}
                                  onChange={(e) =>
                                    setScheduleField(
                                      index,
                                      "endPeriod",
                                      e.target.value,
                                    )
                                  }
                                  disabled={isSubmitting || isOptionsLoading}
                                  required
                                />
                              </td>
                              <td className="px-3 py-2 text-right">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  disabled={isSubmitting}
                                  onClick={() => removeScheduleRow(index)}
                                >
                                  <TrashIcon className="size-4" />
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                // )
                <div className="bg-muted/30 text-muted-foreground rounded-md border p-3 text-sm">
                  Lịch học chỉ được cấu hình khi tạo mới lớp học phần.
                </div>
              )}
            </div>
          </div>

          {error ? <p className="text-destructive text-sm">{error}</p> : null}
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button type="submit" form="section-form" disabled={isSubmitting}>
            {isSubmitting
              ? "Đang lưu…"
              : mode === "edit"
                ? "Cập nhật"
                : "Tạo mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
