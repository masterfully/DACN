"use client";

import type { Row } from "@tanstack/react-table";
import * as React from "react";
import { DataTable } from "@/components/data-table";
import { useAccountList } from "@/hooks/use-accounts";
import { parentColumns } from "./columns";
import { ParentDetailSheet } from "./parent-detail-sheet";
import { ParentRowActions } from "./parent-row-actions";
import type { Parent } from "./parent.types";

export function ParentsTable() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [detailParent, setDetailParent] = React.useState<Parent | null>(null);

  const {
    data: accountData,
    isLoading,
    error,
    mutate: refreshParents,
  } = useAccountList({ page, limit: pageSize, role: "PARENT" });

  const data = React.useMemo(() => {
    if (!accountData) return undefined;

    return {
      items: accountData.items.map((account) => ({
        accountId: account.accountId,
        role: "PARENT" as const,
        username: account.username,
        fullName: account.profile?.fullName ?? account.username,
        email: account.email ?? account.profile?.email ?? null,
        profileId: account.profile?.profileId ?? 0,
        avatar: account.profile?.avatar ?? null,
        status: account.profile?.status ?? null,
      })) satisfies Parent[],
      meta: accountData.meta,
    };
  }, [accountData]);

  function handlePaginationChange(newPage: number, newPageSize: number) {
    setPage(newPage);
    setPageSize(newPageSize);
  }

  function handleRowDoubleClick(row: Row<Parent>) {
    setDetailParent(row.original);
  }

  async function handleDeleteSuccess() {
    if (detailParent) {
      setDetailParent(null);
    }
    await refreshParents();
  }

  return (
    <>
      <DataTable<Parent>
        columns={parentColumns}
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
        emptyMessage="Chưa có phụ huynh nào."
        onRowDoubleClick={handleRowDoubleClick}
        renderRowActions={(row) => (
          <ParentRowActions
            parent={row.original}
            onDeleteSuccess={handleDeleteSuccess}
          />
        )}
      />

      <ParentDetailSheet
        parent={detailParent}
        onClose={() => setDetailParent(null)}
      />
    </>
  );
}
