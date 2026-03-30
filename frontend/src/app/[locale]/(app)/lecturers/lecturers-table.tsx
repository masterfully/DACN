"use client";

import type { Row } from "@tanstack/react-table";
import * as React from "react";
import { DataTable } from "@/components/data-table";
import { toast } from "@/components/ui/sonner";
import { useListTableUrl } from "@/hooks/use-list-table-url";
import { useLecturerList, useUpdateProfile } from "@/hooks/use-profiles";
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
  const { state: urlState, replaceState } = useListTableUrl();
  const { page, limit: pageSize, q: search } = urlState;

  // Detail sheet
  const [detailLecturer, setDetailLecturer] =
    React.useState<ProfileListItem | null>(null);

  // Edit dialog
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingLecturer, setEditingLecturer] =
    React.useState<ProfileListItem | null>(null);

  const {
    data,
    isLoading,
    error,
    mutate: refreshLecturers,
  } = useLecturerList({
    page,
    limit: pageSize,
    search: search.trim() || undefined,
  });

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
    const limitChanged = newPageSize !== pageSize;
    replaceState({
      ...urlState,
      page: limitChanged ? 1 : newPage,
      limit: newPageSize,
    });
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
          page: data?.meta.page ?? page,
          pageSize: data?.meta.limit ?? pageSize,
          total: data?.meta.total ?? 0,
        }}
        onPaginationChange={handlePaginationChange}
        isLoading={isLoading}
        error={error?.message ?? null}
        getRowId={(row) => String(row.accountId)}
        enableColumnVisibility
        emptyMessage="Chưa có giảng viên nào."
        searchValue={search}
        onSearchChange={(value) => {
          replaceState({ ...urlState, page: 1, q: value });
        }}
        onSearch={(value) => {
          replaceState({ ...urlState, page: 1, q: value });
        }}
        searchPlaceholder="Tìm theo tên, username…"
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
