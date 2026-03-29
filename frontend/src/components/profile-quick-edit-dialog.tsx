"use client";

import * as React from "react";
import { toast } from "@/components/ui/sonner";
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
import { useMyProfile, useUpdateMyProfile } from "@/hooks/use-profiles";
import { useAuthStore } from "@/stores/auth-store";

interface ProfileQuickEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ProfileFormValues = {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  avatar: string;
  citizenId: string;
  hometown: string;
};

const EMPTY_VALUES: ProfileFormValues = {
  fullName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  gender: "MALE",
  avatar: "",
  citizenId: "",
  hometown: "",
};

const GENDER_OPTIONS = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
];

function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

function extractApiErrorMessage(error: {
  message: string;
  details?: { fieldErrors?: Record<string, string[]> };
}): string {
  const fieldErrors = error.details?.fieldErrors;
  if (fieldErrors) {
    for (const messages of Object.values(fieldErrors)) {
      if (Array.isArray(messages) && messages.length > 0) {
        return messages[0];
      }
    }
  }
  return error.message;
}

function buildProfilePatch(
  values: ProfileFormValues,
  profile: {
    fullName: string | null;
    email: string | null;
    phoneNumber: string | null;
    dateOfBirth: string | null;
    gender: string | null;
    avatar: string | null;
    citizenId: string | null;
    hometown: string | null;
  } | null,
) {
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

  if (!profile) {
    return nextValues;
  }

  const currentValues = {
    fullName: (profile.fullName ?? "").trim(),
    email: (profile.email ?? "").trim().toLowerCase() || undefined,
    phoneNumber: (profile.phoneNumber ?? "").trim() || undefined,
    dateOfBirth: toDateInputValue(profile.dateOfBirth) || undefined,
    gender: profile.gender ?? undefined,
    avatar: (profile.avatar ?? "").trim() || undefined,
    citizenId: (profile.citizenId ?? "").trim() || undefined,
    hometown: (profile.hometown ?? "").trim() || undefined,
  };

  return {
    fullName:
      nextValues.fullName !== currentValues.fullName
        ? nextValues.fullName
        : undefined,
    email:
      nextValues.email !== currentValues.email ? nextValues.email : undefined,
    phoneNumber:
      nextValues.phoneNumber !== currentValues.phoneNumber
        ? nextValues.phoneNumber
        : undefined,
    dateOfBirth:
      nextValues.dateOfBirth !== currentValues.dateOfBirth
        ? nextValues.dateOfBirth
        : undefined,
    gender:
      nextValues.gender !== currentValues.gender
        ? nextValues.gender
        : undefined,
    avatar:
      nextValues.avatar !== currentValues.avatar
        ? nextValues.avatar
        : undefined,
    citizenId:
      nextValues.citizenId !== currentValues.citizenId
        ? nextValues.citizenId
        : undefined,
    hometown:
      nextValues.hometown !== currentValues.hometown
        ? nextValues.hometown
        : undefined,
  };
}

export function ProfileQuickEditDialog({
  open,
  onOpenChange,
}: ProfileQuickEditDialogProps) {
  const [values, setValues] = React.useState<ProfileFormValues>(EMPTY_VALUES);
  const [error, setError] = React.useState<string | null>(null);

  const { data: profile, isLoading: isLoadingProfile } = useMyProfile();
  const { mutateWithResult: updateMyProfile, isLoading: isUpdating } =
    useUpdateMyProfile();
  const updateCurrentUser = useAuthStore((state) => state.updateCurrentUser);

  React.useEffect(() => {
    if (!open || !profile) {
      return;
    }

    setValues({
      fullName: profile.fullName ?? "",
      email: profile.email ?? "",
      phoneNumber: profile.phoneNumber ?? "",
      dateOfBirth: toDateInputValue(profile.dateOfBirth),
      gender: profile.gender ?? "MALE",
      avatar: profile.avatar ?? "",
      citizenId: profile.citizenId ?? "",
      hometown: profile.hometown ?? "",
    });
    setError(null);
  }, [open, profile]);

  function handleFieldChange(field: keyof ProfileFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!values.fullName.trim()) {
      setError("Họ và tên không được để trống.");
      return;
    }

    if (values.email.trim() && !/^\S+@\S+\.\S+$/.test(values.email.trim())) {
      setError("Email không đúng định dạng.");
      return;
    }

    const patch = buildProfilePatch(values, profile ?? null);
    const result = await updateMyProfile(patch);

    if (!result.ok || !result.data) {
      setError(
        result.error
          ? extractApiErrorMessage(result.error)
          : "Cập nhật profile thất bại.",
      );
      return;
    }

    const updatedProfile = result.data;

    updateCurrentUser((user) => ({
      ...user,
      profile: {
        profileId: updatedProfile.profileId,
        fullName: updatedProfile.fullName,
        email: updatedProfile.email,
        avatar: updatedProfile.avatar,
        status: updatedProfile.status,
      },
    }));

    toast.success("Cập nhật profile thành công.");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hồ sơ cá nhân</DialogTitle>
        </DialogHeader>

        <form
          id="quick-profile-form"
          onSubmit={handleSubmit}
          className="grid max-h-[60vh] gap-4 overflow-y-auto pr-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="quick-fullName">Họ và tên *</Label>
              <Input
                id="quick-fullName"
                value={values.fullName}
                onChange={(e) => handleFieldChange("fullName", e.target.value)}
                disabled={isUpdating || isLoadingProfile}
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="quick-email">Email</Label>
              <Input
                id="quick-email"
                type="email"
                value={values.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                disabled={isUpdating || isLoadingProfile}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="quick-gender">Giới tính</Label>
              <select
                id="quick-gender"
                value={values.gender}
                onChange={(e) => handleFieldChange("gender", e.target.value)}
                disabled={isUpdating || isLoadingProfile}
                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {GENDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="quick-dateOfBirth">Ngày sinh</Label>
              <Input
                id="quick-dateOfBirth"
                type="date"
                value={values.dateOfBirth}
                onChange={(e) =>
                  handleFieldChange("dateOfBirth", e.target.value)
                }
                disabled={isUpdating || isLoadingProfile}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="quick-phoneNumber">Số điện thoại</Label>
              <Input
                id="quick-phoneNumber"
                type="tel"
                value={values.phoneNumber}
                onChange={(e) =>
                  handleFieldChange("phoneNumber", e.target.value)
                }
                disabled={isUpdating || isLoadingProfile}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="quick-citizenId">Số CMND/CCCD</Label>
              <Input
                id="quick-citizenId"
                value={values.citizenId}
                onChange={(e) => handleFieldChange("citizenId", e.target.value)}
                disabled={isUpdating || isLoadingProfile}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="quick-hometown">Quê quán</Label>
              <Input
                id="quick-hometown"
                value={values.hometown}
                onChange={(e) => handleFieldChange("hometown", e.target.value)}
                disabled={isUpdating || isLoadingProfile}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="quick-avatar">URL ảnh đại diện</Label>
            <Input
              id="quick-avatar"
              type="url"
              value={values.avatar}
              onChange={(e) => handleFieldChange("avatar", e.target.value)}
              disabled={isUpdating || isLoadingProfile}
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form="quick-profile-form"
            disabled={isUpdating || isLoadingProfile}
          >
            {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
