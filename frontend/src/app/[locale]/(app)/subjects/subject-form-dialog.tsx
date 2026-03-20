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
import { getApiFormErrorMessage, mapApiFieldErrors } from "@/lib/api-error";
import type { MutationResult } from "@/types/api";
import type {
  CreateSubjectInput,
  Subject,
  UpdateSubjectInput,
} from "@/types/subject";

export interface SubjectFormValues {
  subjectName: string;
  periods: string;
}

export const SUBJECT_EMPTY_FORM: SubjectFormValues = {
  subjectName: "",
  periods: "",
};

export function subjectToFormValues(subject: Subject): SubjectFormValues {
  return {
    subjectName: subject.subjectName,
    periods: String(subject.periods),
  };
}

export interface SubjectFormValidationError {
  field: keyof SubjectFormValues | "general";
  message: string;
}

export function validateSubjectForm(
  values: SubjectFormValues,
): SubjectFormValidationError | null {
  if (!values.subjectName.trim()) {
    return {
      field: "subjectName",
      message: "Tên môn học không được để trống.",
    };
  }

  const periods = Number(values.periods);
  if (!Number.isFinite(periods) || periods <= 0) {
    return { field: "periods", message: "Số tiết phải là số lớn hơn 0." };
  }

  return null;
}

export function buildCreateSubjectPayload(
  values: SubjectFormValues,
): CreateSubjectInput {
  return {
    subjectName: values.subjectName.trim(),
    periods: Number(values.periods),
  };
}

export function buildUpdateSubjectPayload(
  values: SubjectFormValues,
): UpdateSubjectInput {
  return {
    subjectName: values.subjectName.trim() || undefined,
    periods: values.periods.trim() ? Number(values.periods) : undefined,
  };
}

interface SubjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSubject: Subject | null;
  onSubmit: (
    values: SubjectFormValues,
    mode: "create" | "edit",
  ) => Promise<MutationResult<Subject>>;
  isSubmitting?: boolean;
}

export function SubjectFormDialog({
  open,
  onOpenChange,
  editingSubject,
  onSubmit,
  isSubmitting = false,
}: SubjectFormDialogProps) {
  const [values, setValues] =
    React.useState<SubjectFormValues>(SUBJECT_EMPTY_FORM);
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<
    Partial<Record<keyof SubjectFormValues, string>>
  >({});

  const mode: "create" | "edit" = editingSubject ? "edit" : "create";

  React.useEffect(() => {
    if (open) {
      setValues(
        editingSubject
          ? subjectToFormValues(editingSubject)
          : SUBJECT_EMPTY_FORM,
      );
      setError(null);
      setFieldErrors({});
    }
  }, [open, editingSubject]);

  function handleFieldChange(field: keyof SubjectFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const validationError = validateSubjectForm(values);
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
      setFieldErrors(
        mapApiFieldErrors<keyof SubjectFormValues>(result.error, {
          subjectName: "subjectName",
          periods: "periods",
        }),
      );
      setError(
        getApiFormErrorMessage(
          result.error,
          mode === "edit"
            ? "Cập nhật môn học thất bại. Vui lòng thử lại."
            : "Tạo môn học thất bại. Vui lòng thử lại.",
        ),
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Chỉnh sửa môn học" : "Thêm môn học"}
          </DialogTitle>
        </DialogHeader>

        <form id="subject-form" onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="subjectName">Tên môn học</Label>
            <Input
              id="subjectName"
              placeholder="VD: Cơ sở dữ liệu"
              value={values.subjectName}
              onChange={(e) => handleFieldChange("subjectName", e.target.value)}
              disabled={isSubmitting}
              required
            />
            {fieldErrors.subjectName ? (
              <p className="text-destructive text-sm">
                {fieldErrors.subjectName}
              </p>
            ) : null}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="periods">Số tiết</Label>
            <Input
              id="periods"
              type="number"
              min={1}
              placeholder="VD: 45"
              value={values.periods}
              onChange={(e) => handleFieldChange("periods", e.target.value)}
              disabled={isSubmitting}
              required
            />
            {fieldErrors.periods ? (
              <p className="text-destructive text-sm">{fieldErrors.periods}</p>
            ) : null}
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
          <Button type="submit" form="subject-form" disabled={isSubmitting}>
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
