"use client";

import type { Row } from "@tanstack/react-table";
import { PlusIcon, TrashIcon } from "lucide-react";
import * as React from "react";
import type { ToolbarActionGroup } from "@/components/data-table";
import { DataTable } from "@/components/data-table";
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

const SUBJECT_NAMES = [
  "Cơ sở dữ liệu",
  "Lập trình Java",
  "Cấu trúc dữ liệu và giải thuật",
  "Mạng máy tính",
  "Hệ điều hành",
  "Trí tuệ nhân tạo",
  "Phân tích thiết kế hệ thống",
  "An toàn thông tin",
  "Xử lý ảnh số",
  "Lập trình Web",
];

const MOCK_SUBJECTS: Subject[] = Array.from({ length: 80 }, (_, i) => ({
  subjectId: i + 1,
  subjectName: SUBJECT_NAMES[i % SUBJECT_NAMES.length],
  periods: [30, 45, 60, 75][i % 4],
}));

function useMockSubjectList(
  subjects: Subject[],
  page: number,
  pageSize: number,
) {
  const data = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    const items = subjects.slice(start, start + pageSize);
    return {
      items,
      meta: { page, limit: pageSize, total: subjects.length },
    };
  }, [subjects, page, pageSize]);

  return {
    data,
    isLoading: false,
    error: {
      message: null,
    },
    mutate: () => undefined,
  };
}

export function SubjectsTable() {
  const [allSubjects, setAllSubjects] =
    React.useState<Subject[]>(MOCK_SUBJECTS);

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const [detailSubject, setDetailSubject] = React.useState<Subject | null>(
    null,
  );

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingSubject, setEditingSubject] = React.useState<Subject | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    data,
    isLoading,
    error,
    mutate: refreshSubjects,
  } = useMockSubjectList(allSubjects, page, pageSize);

  function openAddDialog() {
    setEditingSubject(null);
    setDialogOpen(true);
  }

  function openEditDialog(subject: Subject) {
    setEditingSubject(subject);
    setDialogOpen(true);
  }

  async function handleDelete(subject: Subject): Promise<boolean> {
    setAllSubjects((prev) =>
      prev.filter((item) => item.subjectId !== subject.subjectId),
    );
    return true;
  }

  async function handleFormSubmit(
    values: SubjectFormValues,
    mode: "create" | "edit",
  ): Promise<boolean> {
    setIsSubmitting(true);
    try {
      if (mode === "edit" && editingSubject) {
        const payload = buildUpdateSubjectPayload(values);
        setAllSubjects((prev) =>
          prev.map((subject) =>
            subject.subjectId === editingSubject.subjectId
              ? {
                  ...subject,
                  ...payload,
                  subjectName: payload.subjectName ?? subject.subjectName,
                  periods: payload.periods ?? subject.periods,
                }
              : subject,
          ),
        );
      } else {
        const payload = buildCreateSubjectPayload(values);
        setAllSubjects((prev) => {
          const nextId =
            prev.reduce((max, item) => Math.max(max, item.subjectId), 0) + 1;
          return [{ subjectId: nextId, ...payload }, ...prev];
        });
      }

      refreshSubjects();
      setDialogOpen(false);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }

  function handlePaginationChange(newPage: number, newPageSize: number) {
    setPage(newPage);
    setPageSize(newPageSize);
  }

  function handleRowDoubleClick(row: Row<Subject>) {
    setDetailSubject(row.original);
  }

  function handleBulkDelete(selectedRows: Row<Subject>[]) {
    const selectedIds = new Set(
      selectedRows.map((row) => row.original.subjectId),
    );
    setAllSubjects((prev) =>
      prev.filter((item) => !selectedIds.has(item.subjectId)),
    );
    refreshSubjects();
  }

  function buildToolbarActions(
    selectedRows: Row<Subject>[],
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
          label: `Xóa ${selectedRows.length > 0 ? `${selectedRows.length} môn` : "môn"}`,
          icon: TrashIcon,
          disabled: selectedRows.length === 0,
          onClick: () => {
            handleBulkDelete(selectedRows);
          },
        },
      ],
    };
  }

  React.useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(allSubjects.length / pageSize));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [allSubjects.length, page, pageSize]);

  return (
    <>
      <DataTable<Subject>
        columns={subjectColumns}
        data={data?.items ?? []}
        pagination={{
          page: data?.meta.page ?? 1,
          pageSize: data?.meta.limit ?? 10,
          total: data?.meta.total ?? 0,
        }}
        onPaginationChange={handlePaginationChange}
        isLoading={isLoading}
        error={error?.message ?? null}
        getRowId={(row) => String(row.subjectId)}
        enableRowSelection
        enableColumnVisibility
        toolbarActions={buildToolbarActions}
        emptyMessage="Chưa có môn học nào."
        onRowDoubleClick={handleRowDoubleClick}
        renderRowActions={(row) => (
          <SubjectRowActions
            subject={row.original}
            onEdit={openEditDialog}
            onDelete={handleDelete}
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
