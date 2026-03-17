"use client";

import type { Row } from "@tanstack/react-table";
import { PlusIcon, TrashIcon } from "lucide-react";
import * as React from "react";
import type { ToolbarActionGroup } from "@/components/data-table";
import { DataTable } from "@/components/data-table";
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

const MOCK_ACCOUNTS: Account[] = Array.from({ length: 80 }, (_, index) => {
  const id = index + 1;
  const role = ["ADMIN", "LECTURER", "STUDENT", "PARENT"][
    index % 4
  ] as Account["role"];
  return {
    accountId: id,
    username: `user${String(id).padStart(3, "0")}`,
    role,
    profile: {
      profileId: id,
      fullName: `Người dùng ${id}`,
      email: `user${id}@example.edu.vn`,
      avatar: null,
      status: "active",
    },
  };
});

export function AccountsTable() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [accounts, setAccounts] = React.useState<Account[]>(MOCK_ACCOUNTS);

  const [detailAccount, setDetailAccount] = React.useState<Account | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingAccount, setEditingAccount] = React.useState<Account | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const paginated = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    const items = accounts.slice(start, start + pageSize);
    return {
      items,
      meta: {
        page,
        limit: pageSize,
        total: accounts.length,
      },
    };
  }, [accounts, page, pageSize]);

  async function refreshAccounts() {
    return {
      data: paginated,
      isLoading: false,
      error: undefined,
    };
  }

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
  ): Promise<boolean> {
    setIsSubmitting(true);
    try {
      if (mode === "edit" && editingAccount) {
        const payload = buildUpdateAccountPayload(values);
        setAccounts((current) =>
          current.map((account) =>
            account.accountId === editingAccount.accountId
              ? {
                  ...account,
                  username: payload.username ?? account.username,
                  role: payload.role ?? account.role,
                }
              : account,
          ),
        );
        return true;
      }

      const payload = buildCreateAccountPayload(values);
      const nextId =
        accounts.length > 0
          ? Math.max(...accounts.map((account) => account.accountId)) + 1
          : 1;

      const newAccount: Account = {
        accountId: nextId,
        username: payload.username,
        role: payload.role,
        profile: {
          profileId: nextId,
          fullName: null,
          email: payload.email,
          avatar: null,
          status: "active",
        },
      };

      setAccounts((current) => [newAccount, ...current]);
      setPage(1);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteAccount(account: Account) {
    setAccounts((current) =>
      current.filter((item) => item.accountId !== account.accountId),
    );
    if (detailAccount?.accountId === account.accountId) {
      setDetailAccount(null);
    }
    if (editingAccount?.accountId === account.accountId) {
      setEditingAccount(null);
      setDialogOpen(false);
    }
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
      menuActions: [
        {
          label: `Xóa ${selectedRows.length > 0 ? `${selectedRows.length} tài khoản` : "tài khoản"}`,
          icon: TrashIcon,
          disabled: selectedRows.length === 0,
          onClick: () => {},
        },
      ],
    };
  }

  return (
    <>
      <DataTable<Account>
        columns={accountColumns}
        data={paginated.items}
        pagination={{
          page: paginated.meta.page,
          pageSize: paginated.meta.limit,
          total: paginated.meta.total,
        }}
        onPaginationChange={handlePaginationChange}
        isLoading={false}
        error={null}
        getRowId={(row) => String(row.accountId)}
        enableRowSelection
        enableColumnVisibility
        toolbarActions={buildToolbarActions}
        onRowDoubleClick={handleRowDoubleClick}
        renderRowActions={(row) => (
          <AccountRowActions
            account={row.original}
            onEdit={openEditDialog}
            onDelete={handleDeleteAccount}
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
