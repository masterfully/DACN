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
import {
  STUDENT_GENDER_OPTIONS,
  STUDENT_STATUS_OPTIONS,
} from "./student.constants";
import type { Student } from "./student.types";

export interface StudentFormValues {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  avatar: string;
  citizenId: string;
  hometown: string;
  status: string;
}

export const STUDENT_EMPTY_FORM: StudentFormValues = {
  username: "",
  email: "",
  password: "",
  fullName: "",
  phoneNumber: "",
  dateOfBirth: "",
  gender: "",
  avatar: "",
  citizenId: "",
  hometown: "",
  status: "active",
};

export function studentToFormValues(student: Student): StudentFormValues {
  return {
    username: student.username,
    email: student.email ?? "",
    password: "",
    fullName: student.fullName ?? "",
    phoneNumber: student.phoneNumber ?? "",
    dateOfBirth: student.dateOfBirth ?? "",
    gender: student.gender ?? "",
    avatar: student.avatar ?? "",
    citizenId: student.citizenId ?? "",
    hometown: student.hometown ?? "",
    status: student.status ?? "active",
  };
}

export interface StudentFormValidationError {
  field: keyof StudentFormValues | "general";
  message: string;
}

export function validateStudentForm(
  values: StudentFormValues,
  mode: "create" | "edit",
): StudentFormValidationError | null {
  if (!values.username.trim()) {
    return { field: "username", message: "Tên đăng nhập không được để trống." };
  }
  if (!values.fullName.trim()) {
    return { field: "fullName", message: "Họ và tên không được để trống." };
  }
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return { field: "email", message: "Email không hợp lệ." };
  }
  if (values.avatar && !/^https?:\/\//.test(values.avatar.trim())) {
    return {
      field: "avatar",
      message:
        "Avatar phải là URL hợp lệ (bắt đầu bằng http:// hoặc https://).",
    };
  }
  if (mode === "create" && !values.password.trim()) {
    return { field: "password", message: "Mật khẩu không được để trống." };
  }
  return null;
}

export interface CreateStudentPayload {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  avatar?: string;
  citizenId?: string;
  hometown?: string;
  status?: string;
}

export interface UpdateStudentPayload {
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  avatar?: string;
  citizenId?: string;
  hometown?: string;
  status?: string;
}

export function buildCreateStudentPayload(
  values: StudentFormValues,
): CreateStudentPayload {
  return {
    username: values.username.trim(),
    email: values.email.trim(),
    password: values.password,
    fullName: values.fullName.trim(),
    phoneNumber: values.phoneNumber.trim() || undefined,
    dateOfBirth: values.dateOfBirth || undefined,
    gender: values.gender || undefined,
    avatar: values.avatar.trim() || undefined,
    citizenId: values.citizenId.trim() || undefined,
    hometown: values.hometown.trim() || undefined,
    status: values.status || undefined,
  };
}

export function buildUpdateStudentPayload(
  values: StudentFormValues,
): UpdateStudentPayload {
  return {
    username: values.username.trim(),
    email: values.email.trim(),
    fullName: values.fullName.trim(),
    phoneNumber: values.phoneNumber.trim() || undefined,
    dateOfBirth: values.dateOfBirth || undefined,
    gender: values.gender || undefined,
    avatar: values.avatar.trim() || undefined,
    citizenId: values.citizenId.trim() || undefined,
    hometown: values.hometown.trim() || undefined,
    status: values.status || undefined,
  };
}

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingStudent: Student | null;
  onSubmit: (
    values: StudentFormValues,
    mode: "create" | "edit",
  ) => Promise<boolean>;
  isSubmitting?: boolean;
}

export function StudentFormDialog({
  open,
  onOpenChange,
  editingStudent,
  onSubmit,
  isSubmitting = false,
}: StudentFormDialogProps) {
  const [values, setValues] =
    React.useState<StudentFormValues>(STUDENT_EMPTY_FORM);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setValues(
        editingStudent
          ? studentToFormValues(editingStudent)
          : STUDENT_EMPTY_FORM,
      );
      setError(null);
    }
  }, [open, editingStudent]);

  function handleFieldChange(field: keyof StudentFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const mode = editingStudent ? "edit" : "create";
    const validationError = validateStudentForm(values, mode);
    if (validationError) {
      setError(validationError.message);
      return;
    }

    const ok = await onSubmit(values, mode);
    if (!ok) {
      setError(
        mode === "edit"
          ? "Cập nhật sinh viên thất bại. Vui lòng thử lại."
          : "Tạo sinh viên thất bại. Vui lòng thử lại.",
      );
    }
  }

  const isEditing = editingStudent !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Cập nhật sinh viên" : "Thêm sinh viên mới"}
          </DialogTitle>
        </DialogHeader>

        <form id="student-form" onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              placeholder="VD: student01"
              value={values.username}
              onChange={(e) => handleFieldChange("username", e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          {!isEditing && (
            <div className="grid gap-1.5">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={values.password}
                onChange={(e) => handleFieldChange("password", e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          )}

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
              placeholder="VD: student@example.com"
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
              {STUDENT_GENDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="avatar">Avatar (URL)</Label>
            <Input
              id="avatar"
              placeholder="VD: https://example.com/avatar.jpg"
              value={values.avatar}
              onChange={(e) => handleFieldChange("avatar", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="citizenId">CCCD/CMND</Label>
            <Input
              id="citizenId"
              placeholder="VD: 079123456789"
              value={values.citizenId}
              onChange={(e) => handleFieldChange("citizenId", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="hometown">Quê quán</Label>
            <Input
              id="hometown"
              placeholder="VD: Cần Thơ"
              value={values.hometown}
              onChange={(e) => handleFieldChange("hometown", e.target.value)}
              disabled={isSubmitting}
            />
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
              {STUDENT_STATUS_OPTIONS.map((opt) => (
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
          <Button type="submit" form="student-form" disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu…" : isEditing ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
