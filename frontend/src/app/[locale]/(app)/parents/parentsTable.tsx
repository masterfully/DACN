"use client";

import type { Row } from "@tanstack/react-table";
import * as React from "react";
import { DataTable } from "@/components/data-table";
import { useAccountList } from "@/hooks/use-accounts";
import { useProfileList } from "@/hooks/use-profiles";
import { parentColumns } from "./columns";
import { ParentDetailSheet } from "./parent-detail-sheet";
import { ParentRowActions } from "./parent-row-actions";
import type { Parent } from "./parent.types";

export function ParentsTable() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [detailParent, setDetailParent] = React.useState<Parent | null>(null);

  const {
    data: profileData,
    isLoading: isLoadingProfiles,
    error: profileError,
    mutate: refreshProfiles,
  } = useProfileList({ page, limit: pageSize, role: "PARENT" });

  const {
    data: accountData,
    isLoading: isLoadingAccounts,
    error: accountError,
    mutate: refreshAccounts,
  } = useAccountList({ page, limit: pageSize, role: "PARENT" });

  const data = React.useMemo(() => {
    if (!profileData) return undefined;

    const usernameByAccountId = new Map(
      (accountData?.items ?? []).map((account) => [
        account.accountId,
        account.username,
      ]),
    );

    return {
      items: profileData.items.map((profile) => ({
        accountId: profile.accountId,
        role: "PARENT" as const,
        username:
          usernameByAccountId.get(profile.accountId) ??
          `user-${profile.accountId}`,
        fullName: profile.fullName,
        email: profile.email,
        profileId: profile.profileId,
        avatar: profile.avatar,
        status: profile.status,
      })) satisfies Parent[],
      meta: profileData.meta,
    };
  }, [accountData?.items, profileData]);

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
    await Promise.all([refreshProfiles(), refreshAccounts()]);
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
        isLoading={isLoadingProfiles || isLoadingAccounts}
        error={profileError?.message ?? accountError?.message ?? null}
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
