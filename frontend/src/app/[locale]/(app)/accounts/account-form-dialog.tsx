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
import type {
  Account,
  CreateAccountInput,
  Role,
  UpdateAccountInput,
} from "@/types/account";
import { ACCOUNT_ROLE_OPTIONS } from "./account.constants";

export interface AccountFormValues {
  username: string;
  email: string;
  password: string;
  role: Role;
}

export const ACCOUNT_EMPTY_FORM: AccountFormValues = {
  username: "",
  email: "",
  password: "",
  role: "STUDENT",
};

export function accountToFormValues(account: Account): AccountFormValues {
  return {
    username: account.username,
    email: account.profile?.email ?? "",
    password: "",
    role: account.role,
  };
}

export interface AccountFormValidationError {
  field: keyof AccountFormValues | "general";
  message: string;
}

export function validateAccountForm(
  values: AccountFormValues,
  mode: "create" | "edit",
): AccountFormValidationError | null {
  if (!values.username.trim()) {
    return {
      field: "username",
      message: "Tên đăng nhập không được để trống.",
    };
  }

  if (mode === "create") {
    if (!values.email.trim()) {
      return { field: "email", message: "Email không được để trống." };
    }
    if (!values.password.trim()) {
      return { field: "password", message: "Mật khẩu không được để trống." };
    }
  }

  return null;
}

export function buildCreateAccountPayload(
  values: AccountFormValues,
): CreateAccountInput {
  return {
    username: values.username.trim(),
    email: values.email.trim(),
    password: values.password,
    role: values.role,
  };
}

export function buildUpdateAccountPayload(
  values: AccountFormValues,
): UpdateAccountInput {
  return {
    username: values.username.trim(),
    role: values.role,
  };
}

interface AccountFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingAccount: Account | null;
  onSubmit: (
    values: AccountFormValues,
    mode: "create" | "edit",
  ) => Promise<boolean>;
  isSubmitting?: boolean;
}

export function AccountFormDialog({
  open,
  onOpenChange,
  editingAccount,
  onSubmit,
  isSubmitting = false,
}: AccountFormDialogProps) {
  const [values, setValues] =
    React.useState<AccountFormValues>(ACCOUNT_EMPTY_FORM);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setValues(
        editingAccount
          ? accountToFormValues(editingAccount)
          : ACCOUNT_EMPTY_FORM,
      );
      setError(null);
    }
  }, [open, editingAccount]);

  function handleFieldChange(field: keyof AccountFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const mode = editingAccount ? "edit" : "create";
    const validationError = validateAccountForm(values, mode);
    if (validationError) {
      setError(validationError.message);
      return;
    }

    const ok = await onSubmit(values, mode);
    if (!ok) {
      setError(
        mode === "edit"
          ? "Cập nhật tài khoản thất bại. Vui lòng thử lại."
          : "Tạo tài khoản thất bại. Vui lòng thử lại.",
      );
    }
  }

  const isEditing = editingAccount !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Cập nhật tài khoản" : "Thêm tài khoản mới"}
          </DialogTitle>
        </DialogHeader>

        <form id="account-form" onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              placeholder="VD: nguyenvana"
              value={values.username}
              onChange={(e) => handleFieldChange("username", e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          {!isEditing && (
            <>
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="VD: user@example.com"
                  value={values.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={values.password}
                  onChange={(e) =>
                    handleFieldChange("password", e.target.value)
                  }
                  disabled={isSubmitting}
                  required
                />
              </div>
            </>
          )}

          <div className="grid gap-1.5">
            <Label htmlFor="role">Vai trò</Label>
            <select
              id="role"
              value={values.role}
              onChange={(e) => handleFieldChange("role", e.target.value)}
              disabled={isSubmitting}
              className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {ACCOUNT_ROLE_OPTIONS.map((opt) => (
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
          <Button type="submit" form="account-form" disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu…" : isEditing ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
