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
import { Textarea } from "@/components/ui/textarea";
import { getApiFormErrorMessage, mapApiFieldErrors } from "@/lib/api-error";
import type { MutationResult } from "@/types/api";
import type {
  CertificateType,
  CreateCertificateTypeInput,
  UpdateCertificateTypeInput,
} from "@/types/certificate";

export interface CertificateTypeFormValues {
  typeName: string;
  description: string;
}

export const CERTIFICATE_TYPE_EMPTY_FORM: CertificateTypeFormValues = {
  typeName: "",
  description: "",
};

export function certificateTypeToFormValues(
  row: CertificateType,
): CertificateTypeFormValues {
  return {
    typeName: row.typeName,
    description: row.description ?? "",
  };
}

export function validateCertificateTypeForm(
  values: CertificateTypeFormValues,
): {
  field: keyof CertificateTypeFormValues | "general";
  message: string;
} | null {
  if (!values.typeName.trim()) {
    return {
      field: "typeName",
      message: "Tên loại chứng chỉ không được để trống.",
    };
  }
  return null;
}

export function buildCreateCertificateTypePayload(
  values: CertificateTypeFormValues,
): CreateCertificateTypeInput {
  return {
    typeName: values.typeName.trim(),
    description: values.description.trim() || undefined,
  };
}

export function buildUpdateCertificateTypePayload(
  values: CertificateTypeFormValues,
): UpdateCertificateTypeInput {
  return {
    typeName: values.typeName.trim() || undefined,
    description: values.description.trim() || undefined,
  };
}

interface CertificateTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: CertificateType | null;
  onSubmit: (
    values: CertificateTypeFormValues,
    mode: "create" | "edit",
  ) => Promise<MutationResult<CertificateType>>;
  isSubmitting?: boolean;
}

export function CertificateTypeFormDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
  isSubmitting = false,
}: CertificateTypeFormDialogProps) {
  const [values, setValues] = React.useState<CertificateTypeFormValues>(
    CERTIFICATE_TYPE_EMPTY_FORM,
  );
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<
    Partial<Record<keyof CertificateTypeFormValues, string>>
  >({});

  const mode: "create" | "edit" = editing ? "edit" : "create";

  React.useEffect(() => {
    if (open) {
      setValues(
        editing
          ? certificateTypeToFormValues(editing)
          : CERTIFICATE_TYPE_EMPTY_FORM,
      );
      setError(null);
      setFieldErrors({});
    }
  }, [open, editing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const validationError = validateCertificateTypeForm(values);
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
        mapApiFieldErrors<keyof CertificateTypeFormValues>(result.error, {
          typeName: "typeName",
          description: "description",
        }),
      );
      setError(
        getApiFormErrorMessage(
          result.error,
          mode === "edit"
            ? "Cập nhật loại chứng chỉ thất bại."
            : "Tạo loại chứng chỉ thất bại.",
        ),
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit"
              ? "Chỉnh sửa loại chứng chỉ"
              : "Thêm loại chứng chỉ"}
          </DialogTitle>
        </DialogHeader>

        <form
          id="certificate-type-form"
          onSubmit={handleSubmit}
          className="grid gap-4"
        >
          <div className="grid gap-1.5">
            <Label htmlFor="typeName">Tên loại chứng chỉ</Label>
            <Input
              id="typeName"
              placeholder="VD: IELTS"
              value={values.typeName}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, typeName: e.target.value }))
              }
              disabled={isSubmitting}
              required
            />
            {fieldErrors.typeName ? (
              <p className="text-destructive text-sm">{fieldErrors.typeName}</p>
            ) : null}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="description">Mô tả (tuỳ chọn)</Label>
            <Textarea
              id="description"
              placeholder="Mô tả ngắn gọn…"
              value={values.description}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, description: e.target.value }))
              }
              disabled={isSubmitting}
              rows={3}
            />
            {fieldErrors.description ? (
              <p className="text-destructive text-sm">
                {fieldErrors.description}
              </p>
            ) : null}
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
          <Button
            type="submit"
            form="certificate-type-form"
            disabled={isSubmitting}
          >
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
