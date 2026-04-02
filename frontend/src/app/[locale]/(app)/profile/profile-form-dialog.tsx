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
import { PROFILE_GENDER_OPTIONS } from "./profile.constants";

export interface ProfileFormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  avatar: string;
  citizenId: string;
  hometown: string;
}

export const PROFILE_EMPTY_FORM: ProfileFormValues = {
  fullName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  gender: "MALE",
  avatar: "",
  citizenId: "",
  hometown: "",
};

function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

export function profileToFormValues(profile: Profile): ProfileFormValues {
  return {
    fullName: profile.fullName ?? "",
    email: profile.email ?? "",
    phoneNumber: profile.phoneNumber ?? "",
    dateOfBirth: toDateInputValue(profile.dateOfBirth),
    gender: profile.gender ?? "MALE",
    avatar: profile.avatar ?? "",
    citizenId: profile.citizenId ?? "",
    hometown: profile.hometown ?? "",
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

  if (values.email.trim() && !/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    return {
      field: "email",
      message: "Email không đúng định dạng.",
    };
  }

  return null;
}

export function buildUpdateProfilePayload(
  values: ProfileFormValues,
  options?: { profile?: Profile | null },
): UpdateProfileInput {
  const currentProfile = options?.profile ?? null;

  const nextValues = {
    fullName: values.fullName.trim(),
    email: values.email.trim().toLowerCase() || undefined,
    phoneNumber: values.phoneNumber.trim() || undefined,
    dateOfBirth: toDateInputValue(values.dateOfBirth) || undefined,
    gender: values.gender || undefined,
    avatar: values.avatar.trim() || undefined,
    citizenId: values.citizenId.trim() || undefined,
    hometown: values.hometown.trim() || undefined,
  };

  if (!currentProfile) {
    return nextValues;
  }

  const currentValues = {
    fullName: (currentProfile.fullName ?? "").trim(),
    email: (currentProfile.email ?? "").trim().toLowerCase() || undefined,
    phoneNumber: (currentProfile.phoneNumber ?? "").trim() || undefined,
    dateOfBirth: toDateInputValue(currentProfile.dateOfBirth) || undefined,
    gender: currentProfile.gender ?? undefined,
    avatar: (currentProfile.avatar ?? "").trim() || undefined,
    citizenId: (currentProfile.citizenId ?? "").trim() || undefined,
    hometown: (currentProfile.hometown ?? "").trim() || undefined,
  };

  const payload: UpdateProfileInput = {};

  if (nextValues.fullName !== currentValues.fullName) {
    payload.fullName = nextValues.fullName;
  }
  if (nextValues.email !== currentValues.email && nextValues.email) {
    payload.email = nextValues.email;
  }
  if (
    nextValues.phoneNumber !== currentValues.phoneNumber &&
    nextValues.phoneNumber
  ) {
    payload.phoneNumber = nextValues.phoneNumber;
  }
  if (
    nextValues.dateOfBirth !== currentValues.dateOfBirth &&
    nextValues.dateOfBirth
  ) {
    payload.dateOfBirth = nextValues.dateOfBirth;
  }
  if (nextValues.gender !== currentValues.gender && nextValues.gender) {
    payload.gender = nextValues.gender;
  }
  if (nextValues.avatar !== currentValues.avatar && nextValues.avatar) {
    payload.avatar = nextValues.avatar;
  }
  if (
    nextValues.citizenId !== currentValues.citizenId &&
    nextValues.citizenId
  ) {
    payload.citizenId = nextValues.citizenId;
  }
  if (nextValues.hometown !== currentValues.hometown && nextValues.hometown) {
    payload.hometown = nextValues.hometown;
  }

  return payload;
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
          {/* Row 1: Họ và tên, Email */}
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="VD: user@example.com"
                value={values.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Row 2: Giới tính */}
          <div className="grid grid-cols-2 gap-4">
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

          {/* Row 3: Ngày sinh */}
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

          {/* Row 4: Số điện thoại, CMND */}
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

          {/* Row 5: Quê quán */}
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

          {/* Row 6: Ảnh đại diện */}
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
