"use client";

import type { Row } from "@tanstack/react-table";
import * as React from "react";
import { DataTable } from "@/components/data-table";
import { useMySections } from "@/hooks/use-sections";
import type { MySectionListItem } from "@/types/section";
import { ClassAttendanceSheet } from "./class-attendance-sheet";
import { myClassesColumns } from "./columns";

export function MyClassesTable() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");

  const [selectedClass, setSelectedClass] =
    React.useState<MySectionListItem | null>(null);

  const { data, isLoading, error } = useMySections({
    page,
    limit: pageSize,
    year: search.trim() || undefined,
  });

  function handlePaginationChange(newPage: number, newPageSize: number) {
    setPage(newPage);
    setPageSize(newPageSize);
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
          page: data?.meta.page ?? 1,
          pageSize: data?.meta.limit ?? 10,
          total: data?.meta.total ?? 0,
        }}
        onPaginationChange={handlePaginationChange}
        isLoading={isLoading}
        error={error?.message ?? null}
        getRowId={(row) => String(row.sectionId)}
        enableRowSelection
        enableColumnVisibility
        searchValue={search}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onRowDoubleClick={handleRowDoubleClick}
      />

      <ClassAttendanceSheet
        section={selectedClass}
        onClose={() => setSelectedClass(null)}
      />
    </>
  );
}
