"use client";

import type { Row } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import type { ToolbarActionGroup } from "@/components/data-table";
import { DataTable } from "@/components/data-table";
import { useListTableUrl } from "@/hooks/use-list-table-url";
import {
  useCreateSubject,
  useSubjectList,
  useUpdateSubject,
} from "@/hooks/use-subjects";
import type { MutationResult } from "@/types/api";
import type { Subject } from "@/types/subject";
import { subjectColumns } from "./columns";
import { SubjectDetailSheet } from "./subject-detail-sheet";
import {
  buildCreateSubjectPayload,
  buildUpdateSubjectPayload,
  SubjectFormDialog,
  type SubjectFormValues,
} from "./subject-form-dialog";
import { SubjectRowActions } from "./subject-row-actions";

export function SubjectsTable() {
  const { state: urlState, replaceState } = useListTableUrl();
  const { page, limit: pageSize, q: search } = urlState;

  const [detailSubject, setDetailSubject] = React.useState<Subject | null>(
    null,
  );

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingSubject, setEditingSubject] = React.useState<Subject | null>(
    null,
  );

  const {
    data,
    isLoading,
    error,
    mutate: refreshSubjects,
  } = useSubjectList({
    page,
    limit: pageSize,
    search: search.trim() || undefined,
  });

  const { mutateWithResult: createSubject, isLoading: isCreating } =
    useCreateSubject();
  const { mutateWithResult: updateSubject, isLoading: isUpdating } =
    useUpdateSubject(editingSubject?.subjectId ?? 0);
  const isSubmitting = isCreating || isUpdating;

  function openAddDialog() {
    setEditingSubject(null);
    setDialogOpen(true);
  }

  function openEditDialog(subject: Subject) {
    setEditingSubject(subject);
    setDialogOpen(true);
  }

  async function handleFormSubmit(
    values: SubjectFormValues,
    mode: "create" | "edit",
  ): Promise<MutationResult<Subject>> {
    if (mode === "edit") {
      const result = await updateSubject(buildUpdateSubjectPayload(values));
      if (result.ok) {
        toast.success("Cập nhật môn học thành công.");
        await refreshSubjects();
        setDialogOpen(false);
        setEditingSubject(null);
      } else {
        toast.error(
          result.error?.message ??
            "Cập nhật môn học thất bại. Vui lòng thử lại.",
        );
      }
      return result;
    }

    const result = await createSubject(buildCreateSubjectPayload(values));
    if (result.ok) {
      toast.success("Tạo môn học thành công.");
      await refreshSubjects();
      setDialogOpen(false);
      setEditingSubject(null);
    } else {
      toast.error(
        result.error?.message ?? "Tạo môn học thất bại. Vui lòng thử lại.",
      );
    }
    return result;
  }

  function handlePaginationChange(newPage: number, newPageSize: number) {
    const limitChanged = newPageSize !== pageSize;
    replaceState({
      ...urlState,
      page: limitChanged ? 1 : newPage,
      limit: newPageSize,
    });
  }

  function handleRowDoubleClick(row: Row<Subject>) {
    setDetailSubject(row.original);
  }

  function buildToolbarActions(
    _selectedRows: Row<Subject>[],
  ): ToolbarActionGroup {
    return {
      primary: {
        label: "Thêm mới",
        icon: PlusIcon,
        variant: "outline",
        onClick: openAddDialog,
      },
      // menuActions: [
      //   {
      //     label: `Xóa ${selectedRows.length > 0 ? `${selectedRows.length} môn` : "môn"}`,
      //     icon: TrashIcon,
      //     disabled: selectedRows.length === 0,
      //     onClick: () => {
      //       // TODO: gọi API xóa hàng loạt cho selectedRows
      //     },
      //   },
      // ],
    };
  }

  return (
    <>
      <DataTable<Subject>
        columns={subjectColumns}
        data={data?.items ?? []}
        pagination={{
          page: data?.meta.page ?? page,
          pageSize: data?.meta.limit ?? pageSize,
          total: data?.meta.total ?? 0,
        }}
        onPaginationChange={handlePaginationChange}
        isLoading={isLoading}
        error={error?.message ?? null}
        getRowId={(row) => String(row.subjectId)}
        enableRowSelection
        enableColumnVisibility
        searchValue={search}
        onSearchChange={(value) => {
          replaceState({ ...urlState, page: 1, q: value });
        }}
        onSearch={(value) => {
          replaceState({ ...urlState, page: 1, q: value });
        }}
        toolbarActions={buildToolbarActions}
        onRowDoubleClick={handleRowDoubleClick}
        renderRowActions={(row) => (
          <SubjectRowActions
            subject={row.original}
            onEdit={openEditDialog}
            onDeleteSuccess={refreshSubjects}
          />
        )}
      />

      <SubjectFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingSubject={editingSubject}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <SubjectDetailSheet
        subject={detailSubject}
        onClose={() => setDetailSubject(null)}
      />
    </>
  );
}
