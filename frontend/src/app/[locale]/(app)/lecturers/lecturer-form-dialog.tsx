"use client";

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
import type { ProfileListItem, UpdateProfileInput } from "@/types/profile";
import {
  LECTURER_GENDER_OPTIONS,
  LECTURER_STATUS_OPTIONS,
} from "./lecturer.constants";

// ---------------------------------------------------------------------------
// Form state
// ---------------------------------------------------------------------------

export interface LecturerFormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  status: string;
}

export const LECTURER_EMPTY_FORM: LecturerFormValues = {
  fullName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  gender: "",
  status: "ACTIVE",
};

const normalizeLecturerStatus = (status: unknown): string => {
  if (typeof status !== "string") {
    return "ACTIVE";
  }

  const normalized = status.trim().toUpperCase();
  if (normalized === "INACTIVE") {
    return "INACTIVE";
  }

  if (normalized === "BANNED" || normalized === "SUSPENDED") {
    return "BANNED";
  }

  return "ACTIVE";
};

const normalizeLecturerGender = (gender: unknown): string => {
  if (typeof gender !== "string") {
    return "";
  }

  const normalized = gender.trim().toUpperCase();
  if (normalized === "MALE" || normalized === "FEMALE") {
    return normalized;
  }

  return "";
};

export function lecturerToFormValues(
  lecturer: ProfileListItem,
): LecturerFormValues {
  return {
    fullName: lecturer.fullName ?? "",
    email: lecturer.email ?? "",
    phoneNumber: lecturer.phoneNumber ?? "",
    dateOfBirth: lecturer.dateOfBirth ?? "",
    gender: normalizeLecturerGender(lecturer.gender),
    status: normalizeLecturerStatus(lecturer.status),
  };
}

// ---------------------------------------------------------------------------
// Validation + payload mapping
// ---------------------------------------------------------------------------

export interface LecturerFormValidationError {
  field: keyof LecturerFormValues | "general";
  message: string;
}

export function validateLecturerForm(
  values: LecturerFormValues,
): LecturerFormValidationError | null {
  if (!values.fullName.trim()) {
    return { field: "fullName", message: "Họ và tên không được để trống." };
  }
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return { field: "email", message: "Email không hợp lệ." };
  }
  return null;
}

export function buildUpdateLecturerPayload(
  values: LecturerFormValues,
): UpdateProfileInput {
  return {
    fullName: values.fullName.trim() || undefined,
    phoneNumber: values.phoneNumber.trim() || undefined,
    dateOfBirth: values.dateOfBirth || undefined,
    gender: values.gender || undefined,
    status: values.status || undefined,
  };
}

// ---------------------------------------------------------------------------
// Component (edit-only)
// ---------------------------------------------------------------------------

interface LecturerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingLecturer: ProfileListItem | null;
  onSubmit: (values: LecturerFormValues) => Promise<boolean>;
  isSubmitting?: boolean;
}

export function LecturerFormDialog({
  open,
  onOpenChange,
  editingLecturer,
  onSubmit,
  isSubmitting = false,
}: LecturerFormDialogProps) {
  const [values, setValues] =
    React.useState<LecturerFormValues>(LECTURER_EMPTY_FORM);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setValues(
        editingLecturer
          ? lecturerToFormValues(editingLecturer)
          : LECTURER_EMPTY_FORM,
      );
      setError(null);
    }
  }, [open, editingLecturer]);

  function handleFieldChange(field: keyof LecturerFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validationError = validateLecturerForm(values);
    if (validationError) {
      setError(validationError.message);
      return;
    }

    const ok = await onSubmit(values);
    if (!ok) {
      setError("Cập nhật thông tin thất bại. Vui lòng thử lại.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin giảng viên</DialogTitle>
        </DialogHeader>

        <form id="lecturer-form" onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              placeholder="VD: Nguyễn Văn A"
              value={values.fullName}
              onChange={(e) => handleFieldChange("fullName", e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="VD: gv@example.com"
              value={values.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            <Input
              id="phoneNumber"
              placeholder="VD: 0901234567"
              value={values.phoneNumber}
              onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="dateOfBirth">Ngày sinh</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={values.dateOfBirth}
              onChange={(e) => handleFieldChange("dateOfBirth", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="gender">Giới tính</Label>
            <select
              id="gender"
              value={values.gender}
              onChange={(e) => handleFieldChange("gender", e.target.value)}
              disabled={isSubmitting}
              className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">— Chọn giới tính —</option>
              {LECTURER_GENDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="status">Trạng thái</Label>
            <select
              id="status"
              value={values.status}
              onChange={(e) => handleFieldChange("status", e.target.value)}
              disabled={isSubmitting}
              className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {LECTURER_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}
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
          <Button type="submit" form="lecturer-form" disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu…" : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
