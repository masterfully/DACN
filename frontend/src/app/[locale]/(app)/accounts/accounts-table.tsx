"use client";

import type { Row } from "@tanstack/react-table";
import { PlusIcon, TrashIcon } from "lucide-react";
import * as React from "react";
import type { ToolbarActionGroup } from "@/components/data-table";
import { DataTable } from "@/components/data-table";
import {
  useAccountList,
  useCreateAccount,
  useUpdateAccount,
} from "@/hooks/use-accounts";
import type { MutationResult } from "@/types/api";
import type { Account } from "@/types/account";
import {
  AccountFormDialog,
  buildCreateAccountPayload,
  buildUpdateAccountPayload,
  type AccountFormValues,
} from "./account-form-dialog";
import { AccountDetailSheet } from "./account-detail-sheet";
import { AccountRowActions } from "./account-row-actions";
import { accountColumns } from "./columns";

export function AccountsTable() {
  // Pagination
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Detail sheet
  const [detailAccount, setDetailAccount] = React.useState<Account | null>(
    null,
  );

  // Create / edit dialog
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingAccount, setEditingAccount] = React.useState<Account | null>(
    null,
  );

  const {
    data,
    isLoading,
    error,
    mutate: refreshAccounts,
  } = useAccountList({ page, limit: pageSize });

  console.log("data", data);

  const { mutateWithResult: createAccount, isLoading: isCreating } =
    useCreateAccount();
  const { mutateWithResult: updateAccount, isLoading: isUpdating } =
    useUpdateAccount(editingAccount?.accountId ?? 0);
  const isSubmitting = isCreating || isUpdating;

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  function openAddDialog() {
    setEditingAccount(null);
    setDialogOpen(true);
  }

  function openEditDialog(account: Account) {
    setEditingAccount(account);
    setDialogOpen(true);
  }

  async function handleFormSubmit(
    values: AccountFormValues,
    mode: "create" | "edit",
  ): Promise<MutationResult<Account>> {
    if (mode === "edit") {
      const result = await updateAccount(buildUpdateAccountPayload(values));
      if (result.ok) {
        await refreshAccounts();
        setDialogOpen(false);
        setEditingAccount(null);
      }
      return result;
    }

    const result = await createAccount(buildCreateAccountPayload(values));
    if (result.ok) {
      await refreshAccounts();
      setDialogOpen(false);
      setEditingAccount(null);
    }
    return result;
  }

  function handlePaginationChange(newPage: number, newPageSize: number) {
    setPage(newPage);
    setPageSize(newPageSize);
  }

  function handleRowDoubleClick(row: Row<Account>) {
    setDetailAccount(row.original);
  }

  function buildToolbarActions(
    selectedRows: Row<Account>[],
  ): ToolbarActionGroup {
    return {
      primary: {
        label: "Thêm mới",
        icon: PlusIcon,
        variant: "outline",
        onClick: openAddDialog,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <DataTable<Account>
        columns={accountColumns}
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
        enableRowSelection
        enableColumnVisibility
        toolbarActions={buildToolbarActions}
        onRowDoubleClick={handleRowDoubleClick}
        renderRowActions={(row) => (
          <AccountRowActions
            account={row.original}
            onEdit={openEditDialog}
            onDeleteSuccess={refreshAccounts}
          />
        )}
      />

      <AccountFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingAccount={editingAccount}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <AccountDetailSheet
        account={detailAccount}
        onClose={() => setDetailAccount(null)}
      />
    </>
  );
}
