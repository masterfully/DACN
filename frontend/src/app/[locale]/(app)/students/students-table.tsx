"use client";

import type { Row } from "@tanstack/react-table";
import { PlusIcon, TrashIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import type { ToolbarActionGroup } from "@/components/data-table";
import { DataTable } from "@/components/data-table";
import {
  useAccountList,
  useCreateAccount,
  useUpdateAccount,
} from "@/hooks/use-accounts";
import { useListTableUrl } from "@/hooks/use-list-table-url";
import {
  useCreateProfile,
  useStudentList,
  useUpdateProfile,
} from "@/hooks/use-profiles";
import { studentColumns } from "./columns";
import type { Student } from "./student.types";
import { StudentDetailSheet } from "./student-detail-sheet";
import {
  buildCreateStudentPayload,
  buildUpdateStudentPayload,
  StudentFormDialog,
  type StudentFormValues,
} from "./student-form-dialog";
import { StudentRowActions } from "./student-row-actions";

const normalizeMaybe = (
  value: string | null | undefined,
): string | undefined => {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
};

const normalizeUpperMaybe = (
  value: string | null | undefined,
): string | undefined => {
  const normalized = value?.trim().toUpperCase();
  return normalized ? normalized : undefined;
};

export function StudentsTable() {
  const { state: urlState, replaceState } = useListTableUrl();
  const { page, limit: pageSize, q: search } = urlState;

  const [detailStudent, setDetailStudent] = React.useState<Student | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingStudent, setEditingStudent] = React.useState<Student | null>(
    null,
  );

  const {
    data: profileData,
    isLoading: isLoadingProfiles,
    error: profileError,
    mutate: refreshProfiles,
  } = useStudentList({
    page,
    limit: pageSize,
    search: search.trim() || undefined,
  });

  const {
    data: accountData,
    isLoading: isLoadingAccounts,
    error: accountError,
    mutate: refreshAccounts,
  } = useAccountList({ page, limit: pageSize, role: "STUDENT" });

  const students = React.useMemo<Student[]>(() => {
    const usernameByAccountId = new Map(
      (accountData?.items ?? []).map((account) => [
        account.accountId,
        account.username,
      ]),
    );

    return (profileData?.items ?? []).map((profile) => ({
      profileId: profile.profileId,
      accountId: profile.accountId,
      role: "STUDENT",
      username:
        usernameByAccountId.get(profile.accountId) ??
        `user-${profile.accountId}`,
      fullName: profile.fullName,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      avatar: profile.avatar,
      citizenId: profile.citizenId,
      hometown: profile.hometown,
      status: profile.status,
    }));
  }, [accountData?.items, profileData?.items]);

  const { mutateWithResult: createAccount, isLoading: isCreating } =
    useCreateAccount();
  const { mutateWithResult: updateAccount, isLoading: isUpdating } =
    useUpdateAccount(editingStudent?.accountId ?? 0);
  const { mutateWithResult: updateProfile, isLoading: isUpdatingProfile } =
    useUpdateProfile(editingStudent?.profileId ?? 0);
  const { mutateWithResult: createProfile, isLoading: isCreatingProfile } =
    useCreateProfile();
  const isSubmitting =
    isCreating || isUpdating || isUpdatingProfile || isCreatingProfile;

  function openAddDialog() {
    setEditingStudent(null);
    setDialogOpen(true);
  }

  function openEditDialog(student: Student) {
    setEditingStudent(student);
    setDialogOpen(true);
  }

  async function handleFormSubmit(
    values: StudentFormValues,
    mode: "create" | "edit",
  ): Promise<boolean> {
    try {
      if (mode === "edit" && editingStudent) {
        const payload = buildUpdateStudentPayload(values);
        const accountResult = await updateAccount({
          username: payload.username,
          email: payload.email,
        });

        if (!accountResult.ok) {
          toast.error(
            accountResult.error?.message ??
              "Cập nhật sinh viên thất bại. Vui lòng thử lại.",
          );
          return false;
        }

        if (editingStudent.profileId > 0) {
          const profilePatch: {
            fullName?: string;
            phoneNumber?: string;
            dateOfBirth?: string;
            gender?: string;
            avatar?: string;
            citizenId?: string;
            hometown?: string;
            status?: string;
          } = {};

          if (
            normalizeMaybe(payload.fullName) !==
            normalizeMaybe(editingStudent.fullName)
          ) {
            profilePatch.fullName = payload.fullName;
          }
          if (
            normalizeMaybe(payload.phoneNumber) !==
            normalizeMaybe(editingStudent.phoneNumber)
          ) {
            profilePatch.phoneNumber = payload.phoneNumber;
          }
          if (
            normalizeMaybe(payload.dateOfBirth) !==
            normalizeMaybe(editingStudent.dateOfBirth)
          ) {
            profilePatch.dateOfBirth = payload.dateOfBirth;
          }
          if (
            normalizeUpperMaybe(payload.gender) !==
            normalizeUpperMaybe(editingStudent.gender)
          ) {
            profilePatch.gender = payload.gender;
          }
          if (
            normalizeMaybe(payload.avatar) !==
            normalizeMaybe(editingStudent.avatar)
          ) {
            profilePatch.avatar = payload.avatar;
          }
          if (
            normalizeMaybe(payload.citizenId) !==
            normalizeMaybe(editingStudent.citizenId)
          ) {
            profilePatch.citizenId = payload.citizenId;
          }
          if (
            normalizeMaybe(payload.hometown) !==
            normalizeMaybe(editingStudent.hometown)
          ) {
            profilePatch.hometown = payload.hometown;
          }
          if (
            normalizeUpperMaybe(payload.status) !==
            normalizeUpperMaybe(editingStudent.status)
          ) {
            profilePatch.status = payload.status;
          }

          if (Object.keys(profilePatch).length > 0) {
            const profileResult = await updateProfile(profilePatch);

            if (!profileResult.ok) {
              toast.error(
                profileResult.error?.message ??
                  "Cập nhật trạng thái sinh viên thất bại. Vui lòng thử lại.",
              );
              return false;
            }
          }
        }

        toast.success("Cập nhật sinh viên thành công.");
        await Promise.all([refreshProfiles(), refreshAccounts()]);
        setDialogOpen(false);
        setEditingStudent(null);
        return true;
      }

      const payload = buildCreateStudentPayload(values);
      const createAccountResult = await createAccount({
        username: payload.username,
        email: payload.email,
        password: payload.password,
        role: "STUDENT",
      });

      if (!createAccountResult.ok || !createAccountResult.data) {
        toast.error(
          createAccountResult.error?.message ??
            "Tạo sinh viên thất bại. Vui lòng thử lại.",
        );
        return false;
      }

      const createProfileResult = await createProfile({
        accountId: createAccountResult.data.accountId,
        fullName: payload.fullName,
        phoneNumber: payload.phoneNumber,
        dateOfBirth: payload.dateOfBirth,
        gender: payload.gender,
        avatar: payload.avatar,
        citizenId: payload.citizenId,
        hometown: payload.hometown,
        status: payload.status,
      });

      if (!createProfileResult.ok) {
        toast.error(
          createProfileResult.error?.message ??
            "Đã tạo account nhưng tạo profile thất bại. Vui lòng tạo profile thủ công.",
        );
        await refreshProfiles();
        await refreshAccounts();
        setDialogOpen(false);
        return false;
      }

      replaceState({ ...urlState, page: 1 });
      toast.success("Tạo sinh viên thành công.");
      await Promise.all([refreshProfiles(), refreshAccounts()]);
      setDialogOpen(false);
      return true;
    } catch {
      toast.error(
        mode === "edit"
          ? "Cập nhật sinh viên thất bại. Vui lòng thử lại."
          : "Tạo sinh viên thất bại. Vui lòng thử lại.",
      );
      return false;
    } finally {
    }
  }

  async function handleDeleteSuccess() {
    if (detailStudent) {
      setDetailStudent(null);
    }
    if (editingStudent) {
      setEditingStudent(null);
      setDialogOpen(false);
    }
    await refreshProfiles();
    await refreshAccounts();
  }

  function handlePaginationChange(newPage: number, newPageSize: number) {
    const limitChanged = newPageSize !== pageSize;
    replaceState({
      ...urlState,
      page: limitChanged ? 1 : newPage,
      limit: newPageSize,
    });
  }

  function handleRowDoubleClick(row: Row<Student>) {
    setDetailStudent(row.original);
  }

  function buildToolbarActions(
    selectedRows: Row<Student>[],
  ): ToolbarActionGroup {
    return {
      primary: {
        label: "Thêm mới",
        icon: PlusIcon,
        variant: "outline",
        onClick: openAddDialog,
      },
      menuActions: [
        {
          label: `Xóa ${selectedRows.length > 0 ? `${selectedRows.length} sinh viên` : "sinh viên"}`,
          icon: TrashIcon,
          disabled: selectedRows.length === 0,
          onClick: () => {},
        },
      ],
    };
  }

  return (
    <>
      <DataTable<Student>
        columns={studentColumns}
        data={students}
        pagination={{
          page: profileData?.meta.page ?? page,
          pageSize: profileData?.meta.limit ?? pageSize,
          total: profileData?.meta.total ?? 0,
        }}
        onPaginationChange={handlePaginationChange}
        isLoading={isLoadingProfiles || isLoadingAccounts}
        error={profileError?.message ?? accountError?.message ?? null}
        getRowId={(row) => String(row.accountId)}
        enableRowSelection
        enableColumnVisibility
        toolbarActions={buildToolbarActions}
        onRowDoubleClick={handleRowDoubleClick}
        searchValue={search}
        onSearchChange={(value) => {
          replaceState({ ...urlState, page: 1, q: value });
        }}
        onSearch={(value) => {
          replaceState({ ...urlState, page: 1, q: value });
        }}
        searchPlaceholder="Tìm theo tên, username…"
        renderRowActions={(row) => (
          <StudentRowActions
            student={row.original}
            onEdit={openEditDialog}
            onDeleteSuccess={handleDeleteSuccess}
          />
        )}
      />

      <StudentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingStudent={editingStudent}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <StudentDetailSheet
        student={detailStudent}
        onClose={() => setDetailStudent(null)}
      />
    </>
  );
}
