"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import type { MutationResult } from "@/types/api";
import type { Profile } from "@/types/profile";
import { useMyProfile, useUpdateMyProfile } from "@/hooks/use-profiles";
import { toast } from "@/components/ui/sonner";
import {
  ProfileFormDialog,
  type ProfileFormValues,
  buildUpdateProfilePayload,
} from "./profile-form-dialog";
import {
  PROFILE_GENDER_OPTIONS,
  PROFILE_STATUS_OPTIONS,
} from "./profile.constants";

function getGenderLabel(gender: string | null): string {
  const option = PROFILE_GENDER_OPTIONS.find((opt) => opt.value === gender);
  return option?.label ?? gender ?? "—";
}

function getStatusLabel(status: string | null): string {
  const option = PROFILE_STATUS_OPTIONS.find((opt) => opt.value === status);
  return option?.label ?? status ?? "—";
}

function formatDate(date: string | null): string {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleDateString("vi-VN");
}

export default function ProfilePage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const { data: profile, isLoading: isLoadingProfile } = useMyProfile();
  const { mutateWithResult: updateMyProfileMut, isLoading: isUpdating } =
    useUpdateMyProfile();

  const handleProfileSubmit = async (
    values: ProfileFormValues,
  ): Promise<MutationResult<Profile>> => {
    const payload = buildUpdateProfilePayload(values);
    const result = await updateMyProfileMut(payload);
    if (result.ok) {
      toast.success("Cập nhật thông tin thành công.");
      setDialogOpen(false);
    } else {
      toast.error(
        result.error?.message ??
          "Cập nhật thông tin thất bại. Vui lòng thử lại.",
      );
    }
    return result;
  };

  if (isLoadingProfile) {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Thông tin tài khoản
        </h1>
        <div className="bg-muted/50 flex min-h-[50vh] items-center justify-center rounded-xl">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Thông tin tài khoản
        </h1>
        <div className="bg-muted/50 rounded-xl p-6 text-center">
          <p className="text-muted-foreground">
            Không thể tải thông tin tài khoản. Vui lòng thử lại.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Thông tin tài khoản
        </h1>
        <Button onClick={() => setDialogOpen(true)}>Chỉnh sửa</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Thông tin cá nhân */}
        <div className="border-input bg-muted/30 rounded-lg border p-4">
          <h3 className="mb-4 font-semibold">Thông tin cá nhân</h3>
          <div className="space-y-4">
            <div className="grid gap-1.5">
              <p className="text-muted-foreground text-sm font-medium">
                Họ và tên
              </p>
              <p className="text-sm">{profile.fullName ?? "—"}</p>
            </div>
            <div className="grid gap-1.5">
              <p className="text-muted-foreground text-sm font-medium">Email</p>
              <p className="text-sm">{profile.email ?? "—"}</p>
            </div>
            <div className="grid gap-1.5">
              <p className="text-muted-foreground text-sm font-medium">
                Giới tính
              </p>
              <p className="text-sm">{getGenderLabel(profile.gender)}</p>
            </div>
            <div className="grid gap-1.5">
              <p className="text-muted-foreground text-sm font-medium">
                Ngày sinh
              </p>
              <p className="text-sm">{formatDate(profile.dateOfBirth)}</p>
            </div>
          </div>
        </div>

        {/* Thông tin liên hệ */}
        <div className="border-input bg-muted/30 rounded-lg border p-4">
          <h3 className="mb-4 font-semibold">Thông tin liên hệ</h3>
          <div className="space-y-4">
            <div className="grid gap-1.5">
              <p className="text-muted-foreground text-sm font-medium">
                Số điện thoại
              </p>
              <p className="text-sm">{profile.phoneNumber ?? "—"}</p>
            </div>
            <div className="grid gap-1.5">
              <p className="text-muted-foreground text-sm font-medium">
                Quê quán
              </p>
              <p className="text-sm">{profile.hometown ?? "—"}</p>
            </div>
            <div className="grid gap-1.5">
              <p className="text-muted-foreground text-sm font-medium">
                Số CMND/CCCD
              </p>
              <p className="text-sm">{profile.citizenId ?? "—"}</p>
            </div>
            <div className="grid gap-1.5">
              <p className="text-muted-foreground text-sm font-medium">
                Trạng thái
              </p>
              <p className="text-sm">{getStatusLabel(profile.status)}</p>
            </div>
          </div>
        </div>

        {/* Ảnh đại diện */}
        {profile.avatar && (
          <div className="border-input bg-muted/30 rounded-lg border p-4 md:col-span-2">
            <h3 className="mb-4 font-semibold">Ảnh đại diện</h3>
            <img
              src={profile.avatar}
              alt="Avatar"
              className="h-auto max-w-xs rounded-lg"
            />
          </div>
        )}
      </div>

      <ProfileFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        profile={profile}
        onSubmit={handleProfileSubmit}
        isSubmitting={isUpdating}
      />
    </div>
  );
}
