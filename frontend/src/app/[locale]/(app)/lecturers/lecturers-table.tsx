"use client";

import type { Row } from "@tanstack/react-table";
import * as React from "react";
import { DataTable } from "@/components/data-table";
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

// ---------------------------------------------------------------------------
// Mock data — chỉ dùng để test hiển thị, xóa khi kết nối API thật
// ---------------------------------------------------------------------------
const MOCK_LECTURERS: ProfileListItem[] = Array.from(
  { length: 60 },
  (_, i) => ({
    profileId: i + 1,
    accountId: i + 100,
    role: "LECTURER" as const,
    fullName: [
      "Nguyễn Văn An",
      "Trần Thị Bình",
      "Lê Hoàng Cường",
      "Phạm Minh Đức",
      "Võ Thị Hoa",
    ][i % 5],
    email: `gv${i + 1}@university.edu.vn`,
    phoneNumber: `09${String(10000000 + i).slice(1)}`,
    dateOfBirth: `198${(i % 9) + 1}-0${(i % 9) + 1}-15`,
    gender: ["male", "female"][i % 2],
    status: ["active", "inactive", "suspended"][i % 3],
  }),
);

function useMockLecturerList(page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  const items = MOCK_LECTURERS.slice(start, start + pageSize);
  return {
    data: {
      items,
      meta: { page, limit: pageSize, total: MOCK_LECTURERS.length },
    },
    isLoading: false,
    error: { message: null },
    mutate: () => undefined,
  };
}
// ---------------------------------------------------------------------------

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
    data,
    isLoading,
    error,
    mutate: refreshLecturers,
  } = useMockLecturerList(page, pageSize);

  const { mutate: updateProfile, isLoading: isUpdating } = useUpdateProfile(
    editingLecturer?.profileId ?? 0,
  );

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
    const ok = await updateProfile(buildUpdateLecturerPayload(values));
    if (ok) refreshLecturers();
    return !!ok;
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
        getRowId={(row) => String(row.profileId)}
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
