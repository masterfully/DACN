"use client";

import type { Row } from "@tanstack/react-table";
import * as React from "react";
import { DataTable } from "@/components/data-table";
import { useListTableUrl } from "@/hooks/use-list-table-url";
import { useMySections } from "@/hooks/use-sections";
import type { MySectionListItem } from "@/types/section";
import { ClassAttendanceSheet } from "./class-attendance-sheet";
import { myClassesColumns } from "./columns";

export function MyClassesTable() {
  const { state: urlState, replaceState } = useListTableUrl();
  const { page, limit: pageSize, q: search } = urlState;

  const [selectedClass, setSelectedClass] =
    React.useState<MySectionListItem | null>(null);

  const { data, isLoading, error } = useMySections({
    page,
    limit: pageSize,
    year: search.trim() || undefined,
  });

  function handlePaginationChange(newPage: number, newPageSize: number) {
    const limitChanged = newPageSize !== pageSize;
    replaceState({
      ...urlState,
      page: limitChanged ? 1 : newPage,
      limit: newPageSize,
    });
  }

  function handleRowDoubleClick(row: Row<MySectionListItem>) {
    setSelectedClass(row.original);
  }

  return (
    <>
      <DataTable<MySectionListItem>
        columns={myClassesColumns}
        data={data?.items ?? []}
        pagination={{
          page: data?.meta.page ?? page,
          pageSize: data?.meta.limit ?? pageSize,
          total: data?.meta.total ?? 0,
        }}
        onPaginationChange={handlePaginationChange}
        isLoading={isLoading}
        error={error?.message ?? null}
        getRowId={(row) => String(row.sectionId)}
        enableRowSelection
        enableColumnVisibility
        searchValue={search}
        onSearchChange={(value) => {
          replaceState({ ...urlState, page: 1, q: value });
        }}
        onSearch={(value) => {
          replaceState({ ...urlState, page: 1, q: value });
        }}
        searchPlaceholder="Lọc theo năm học (ví dụ 2024)…"
        onRowDoubleClick={handleRowDoubleClick}
      />

      <ClassAttendanceSheet
        section={selectedClass}
        onClose={() => setSelectedClass(null)}
      />
    </>
  );
}
