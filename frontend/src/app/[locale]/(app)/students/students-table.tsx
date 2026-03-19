"use client";

import type { Row } from "@tanstack/react-table";
import { PlusIcon, TrashIcon } from "lucide-react";
import * as React from "react";
import type { ToolbarActionGroup } from "@/components/data-table";
import { DataTable } from "@/components/data-table";
import { studentColumns } from "./columns";
import { StudentDetailSheet } from "./student-detail-sheet";
import {
  buildCreateStudentPayload,
  buildUpdateStudentPayload,
  StudentFormDialog,
  type StudentFormValues,
} from "./student-form-dialog";
import { StudentRowActions } from "./student-row-actions";
import type { Student } from "./student.types";

const MOCK_STUDENTS: Student[] = Array.from({ length: 90 }, (_, index) => {
  const id = index + 1;
  return {
    profileId: id,
    accountId: 1000 + id,
    role: "STUDENT",
    username: `student${String(id).padStart(3, "0")}`,
    fullName: `Sinh viên ${id}`,
    email: `student${id}@example.edu.vn`,
    phoneNumber: `09${String(10000000 + id).slice(1)}`,
    dateOfBirth: `200${id % 10}-0${(id % 9) + 1}-15`,
    gender: ["male", "female"][index % 2],
    avatar: `https://i.pravatar.cc/120?img=${(id % 70) + 1}`,
    citizenId: `${String(100000000000 + id)}`,
    hometown: ["Cần Thơ", "TP.HCM", "Hà Nội", "Đà Nẵng"][index % 4],
    status: ["active", "inactive", "suspended"][index % 3],
  };
});

export function StudentsTable() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [students, setStudents] = React.useState<Student[]>(MOCK_STUDENTS);

  const [detailStudent, setDetailStudent] = React.useState<Student | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingStudent, setEditingStudent] = React.useState<Student | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const paginated = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    const items = students.slice(start, start + pageSize);
    return {
      items,
      meta: {
        page,
        limit: pageSize,
        total: students.length,
      },
    };
  }, [students, page, pageSize]);

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
    setIsSubmitting(true);
    try {
      if (mode === "edit" && editingStudent) {
        const payload = buildUpdateStudentPayload(values);
        setStudents((current) =>
          current.map((student) =>
            student.profileId === editingStudent.profileId
              ? {
                  ...student,
                  username: payload.username,
                  fullName: payload.fullName,
                  email: payload.email || null,
                  phoneNumber: payload.phoneNumber ?? null,
                  dateOfBirth: payload.dateOfBirth ?? null,
                  gender: payload.gender ?? null,
                  avatar: payload.avatar ?? null,
                  citizenId: payload.citizenId ?? null,
                  hometown: payload.hometown ?? null,
                  status: payload.status ?? student.status,
                }
              : student,
          ),
        );
        setDialogOpen(false);
        return true;
      }

      const payload = buildCreateStudentPayload(values);
      const nextProfileId =
        students.length > 0
          ? Math.max(...students.map((student) => student.profileId)) + 1
          : 1;
      const nextAccountId =
        students.length > 0
          ? Math.max(...students.map((student) => student.accountId)) + 1
          : 1001;

      const newStudent: Student = {
        profileId: nextProfileId,
        accountId: nextAccountId,
        role: "STUDENT",
        username: payload.username,
        fullName: payload.fullName,
        email: payload.email || null,
        phoneNumber: payload.phoneNumber ?? null,
        dateOfBirth: payload.dateOfBirth ?? null,
        gender: payload.gender ?? null,
        avatar: payload.avatar ?? null,
        citizenId: payload.citizenId ?? null,
        hometown: payload.hometown ?? null,
        status: payload.status ?? "active",
      };

      setStudents((current) => [newStudent, ...current]);
      setPage(1);
      setDialogOpen(false);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteStudent(student: Student) {
    setStudents((current) =>
      current.filter((item) => item.profileId !== student.profileId),
    );

    if (detailStudent?.profileId === student.profileId) {
      setDetailStudent(null);
    }
    if (editingStudent?.profileId === student.profileId) {
      setEditingStudent(null);
      setDialogOpen(false);
    }
  }

  function handlePaginationChange(newPage: number, newPageSize: number) {
    setPage(newPage);
    setPageSize(newPageSize);
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
        data={paginated.items}
        pagination={{
          page: paginated.meta.page,
          pageSize: paginated.meta.limit,
          total: paginated.meta.total,
        }}
        onPaginationChange={handlePaginationChange}
        isLoading={false}
        error={null}
        getRowId={(row) => String(row.profileId)}
        enableRowSelection
        enableColumnVisibility
        toolbarActions={buildToolbarActions}
        onRowDoubleClick={handleRowDoubleClick}
        renderRowActions={(row) => (
          <StudentRowActions
            student={row.original}
            onEdit={openEditDialog}
            onDelete={handleDeleteStudent}
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
