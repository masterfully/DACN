"use client";

import type { Row } from "@tanstack/react-table";
import * as React from "react";
import { DataTable } from "@/components/data-table";
import { toast } from "@/components/ui/sonner";
import { useAccountList } from "@/hooks/use-accounts";
import { useUpdateProfile } from "@/hooks/use-profiles";
import type { ProfileListItem } from "@/types/profile";
import { lecturerColumns } from "./columns";
import { LecturerDetailSheet } from "./lecturer-detail-sheet";
import {
  buildUpdateLecturerPayload,
  LecturerFormDialog,
  type LecturerFormValues,
} from "./lecturer-form-dialog";
import { LecturerRowActions } from "./lecturer-row-actions";

export function LecturersTable() {
  // Pagination
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Detail sheet
  const [detailLecturer, setDetailLecturer] =
    React.useState<ProfileListItem | null>(null);

  // Edit dialog
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingLecturer, setEditingLecturer] =
    React.useState<ProfileListItem | null>(null);

  const {
    data: accountData,
    isLoading,
    error,
    mutate: refreshLecturers,
  } = useAccountList({ page, limit: pageSize, role: "LECTURER" });

  const data = React.useMemo(() => {
    if (!accountData) return undefined;

    return {
      items: accountData.items.map((account) => ({
        profileId: account.profile?.profileId ?? 0,
        accountId: account.accountId,
        role: account.role,
        fullName: account.profile?.fullName ?? account.username,
        email: account.email ?? account.profile?.email ?? null,
        phoneNumber: null,
        dateOfBirth: null,
        gender: null,
        status: account.profile?.status ?? null,
      })) satisfies ProfileListItem[],
      meta: accountData.meta,
    };
  }, [accountData]);

  const { mutateWithResult: updateProfile, isLoading: isUpdating } =
    useUpdateProfile(editingLecturer?.profileId ?? 0);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  function openEditDialog(lecturer: ProfileListItem) {
    setEditingLecturer(lecturer);
    setDialogOpen(true);
  }

  async function handleFormSubmit(
    values: LecturerFormValues,
  ): Promise<boolean> {
    if (!editingLecturer || editingLecturer.profileId <= 0) {
      toast.error("Giảng viên chưa có profile để cập nhật.");
      return false;
    }
    const result = await updateProfile(buildUpdateLecturerPayload(values));
    if (result.ok) {
      toast.success("Cập nhật giảng viên thành công.");
      await refreshLecturers();
      setDialogOpen(false);
      setEditingLecturer(null);
      return true;
    }

    toast.error(
      result.error?.message ??
        "Cập nhật giảng viên thất bại. Vui lòng thử lại.",
    );
    return false;
  }

  function handlePaginationChange(newPage: number, newPageSize: number) {
    setPage(newPage);
    setPageSize(newPageSize);
  }

  function handleRowDoubleClick(row: Row<ProfileListItem>) {
    setDetailLecturer(row.original);
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <DataTable<ProfileListItem>
        columns={lecturerColumns}
        data={data?.items ?? []}
        pagination={{
          page: data?.meta.page ?? 1,
          pageSize: data?.meta.limit ?? 10,
          total: data?.meta.total ?? 0,
        }}
        onPaginationChange={handlePaginationChange}
        isLoading={isLoading}
        error={error?.message ?? null}
        getRowId={(row) => String(row.accountId)}
        enableColumnVisibility
        emptyMessage="Chưa có giảng viên nào."
        onRowDoubleClick={handleRowDoubleClick}
        renderRowActions={(row) => (
          <LecturerRowActions
            lecturer={row.original}
            onEdit={openEditDialog}
            onDeleteSuccess={refreshLecturers}
          />
        )}
      />

      <LecturerFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingLecturer={editingLecturer}
        onSubmit={handleFormSubmit}
        isSubmitting={isUpdating}
      />

      <LecturerDetailSheet
        lecturer={detailLecturer}
        onClose={() => setDetailLecturer(null)}
      />
    </>
  );
}
