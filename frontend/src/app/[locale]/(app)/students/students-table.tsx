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
import { useCreateProfile } from "@/hooks/use-profiles";
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

export function StudentsTable() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const [detailStudent, setDetailStudent] = React.useState<Student | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingStudent, setEditingStudent] = React.useState<Student | null>(
    null,
  );

  const {
    data,
    isLoading,
    error,
    mutate: refreshStudents,
  } = useAccountList({ page, limit: pageSize, role: "STUDENT" });

  const students = React.useMemo<Student[]>(() => {
    return (data?.items ?? []).map((account) => ({
      profileId: account.profile?.profileId ?? 0,
      accountId: account.accountId,
      role: "STUDENT",
      username: account.username,
      fullName: account.profile?.fullName ?? account.username,
      email: account.email ?? account.profile?.email ?? null,
      phoneNumber: null,
      dateOfBirth: null,
      gender: null,
      avatar: account.profile?.avatar ?? null,
      citizenId: null,
      hometown: null,
      status: account.profile?.status ?? null,
    }));
  }, [data?.items]);

  const { mutateWithResult: createAccount, isLoading: isCreating } =
    useCreateAccount();
  const { mutateWithResult: updateAccount, isLoading: isUpdating } =
    useUpdateAccount(editingStudent?.accountId ?? 0);
  const { mutateWithResult: createProfile, isLoading: isCreatingProfile } =
    useCreateProfile();
  const isSubmitting = isCreating || isUpdating || isCreatingProfile;

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
        const result = await updateAccount({
          username: payload.username,
        });

        if (!result.ok) {
          toast.error(
            result.error?.message ??
              "Cập nhật sinh viên thất bại. Vui lòng thử lại.",
          );
          return false;
        }

        toast.success("Cập nhật sinh viên thành công.");
        await refreshStudents();
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
        await refreshStudents();
        setDialogOpen(false);
        return false;
      }

      setPage(1);
      toast.success("Tạo sinh viên thành công.");
      await refreshStudents();
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
    await refreshStudents();
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
        data={students}
        pagination={{
          page: data?.meta.page ?? 1,
          pageSize: data?.meta.limit ?? 10,
          total: data?.meta.total ?? 0,
        }}
        onPaginationChange={handlePaginationChange}
        isLoading={isLoading}
        error={error?.message ?? null}
        getRowId={(row) => String(row.accountId)}
        enableRowSelection
        enableColumnVisibility
        toolbarActions={buildToolbarActions}
        onRowDoubleClick={handleRowDoubleClick}
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
