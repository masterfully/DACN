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
import type { MutationResult } from "@/types/api";
import type { Profile, UpdateProfileInput } from "@/types/profile";
import {
  PROFILE_GENDER_OPTIONS,
  PROFILE_STATUS_OPTIONS,
} from "./profile.constants";

export interface ProfileFormValues {
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  avatar: string;
  citizenId: string;
  hometown: string;
  status: string;
}

export const PROFILE_EMPTY_FORM: ProfileFormValues = {
  fullName: "",
  phoneNumber: "",
  dateOfBirth: "",
  gender: "MALE",
  avatar: "",
  citizenId: "",
  hometown: "",
  status: "ACTIVE",
};

export function profileToFormValues(profile: Profile): ProfileFormValues {
  return {
    fullName: profile.fullName ?? "",
    phoneNumber: profile.phoneNumber ?? "",
    dateOfBirth: profile.dateOfBirth ?? "",
    gender: profile.gender ?? "MALE",
    avatar: profile.avatar ?? "",
    citizenId: profile.citizenId ?? "",
    hometown: profile.hometown ?? "",
    status: profile.status ?? "ACTIVE",
  };
}

export interface ProfileFormValidationError {
  field: keyof ProfileFormValues | "general";
  message: string;
}

export function validateProfileForm(
  values: ProfileFormValues,
): ProfileFormValidationError | null {
  if (!values.fullName.trim()) {
    return {
      field: "fullName",
      message: "Họ và tên không được để trống.",
    };
  }

  if (values.dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(values.dateOfBirth)) {
    return {
      field: "dateOfBirth",
      message: "Ngày sinh phải có định dạng YYYY-MM-DD.",
    };
  }

  return null;
}

export function buildUpdateProfilePayload(
  values: ProfileFormValues,
): UpdateProfileInput {
  return {
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

interface ProfileFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  onSubmit: (values: ProfileFormValues) => Promise<MutationResult<Profile>>;
  isSubmitting?: boolean;
  title?: string;
}

export function ProfileFormDialog({
  open,
  onOpenChange,
  profile,
  onSubmit,
  isSubmitting = false,
  title = "Cập nhật thông tin cá nhân",
}: ProfileFormDialogProps) {
  const [values, setValues] =
    React.useState<ProfileFormValues>(PROFILE_EMPTY_FORM);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setValues(profile ? profileToFormValues(profile) : PROFILE_EMPTY_FORM);
      setError(null);
    }
  }, [open, profile]);

  function handleFieldChange(field: keyof ProfileFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validationError = validateProfileForm(values);
    if (validationError) {
      setError(validationError.message);
      return;
    }

    const result = await onSubmit(values);
    if (!result.ok) {
      setError("Cập nhật thông tin thất bại. Vui lòng thử lại.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form
          id="profile-form"
          onSubmit={handleSubmit}
          className="grid max-h-[60vh] gap-4 overflow-y-auto pr-4"
        >
          {/* Row 1: Họ và tên, Giới tính */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="fullName">Họ và tên *</Label>
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
              <Label htmlFor="gender">Giới tính</Label>
              <select
                id="gender"
                value={values.gender}
                onChange={(e) => handleFieldChange("gender", e.target.value)}
                disabled={isSubmitting}
                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {PROFILE_GENDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Ngày sinh, Trạng thái */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="dateOfBirth">Ngày sinh</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={values.dateOfBirth}
                onChange={(e) =>
                  handleFieldChange("dateOfBirth", e.target.value)
                }
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
                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {PROFILE_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Số điện thoại, CMND */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="VD: 0912345678"
                value={values.phoneNumber}
                onChange={(e) =>
                  handleFieldChange("phoneNumber", e.target.value)
                }
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="citizenId">Số CMND/CCCD</Label>
              <Input
                id="citizenId"
                placeholder="VD: 123456789"
                value={values.citizenId}
                onChange={(e) => handleFieldChange("citizenId", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Row 4: Quê quán */}
          <div className="grid gap-1.5">
            <Label htmlFor="hometown">Quê quán</Label>
            <Input
              id="hometown"
              placeholder="VD: Hà Nội"
              value={values.hometown}
              onChange={(e) => handleFieldChange("hometown", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Row 5: Ảnh đại diện */}
          <div className="grid gap-1.5">
            <Label htmlFor="avatar">URL ảnh đại diện</Label>
            <Input
              id="avatar"
              type="url"
              placeholder="VD: https://example.com/avatar.jpg"
              value={values.avatar}
              onChange={(e) => handleFieldChange("avatar", e.target.value)}
              disabled={isSubmitting}
            />
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
          <Button type="submit" form="profile-form" disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu…" : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
