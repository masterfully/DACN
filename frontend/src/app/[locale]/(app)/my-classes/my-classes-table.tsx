"use client";

import type { Row } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import * as React from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useListTableUrl } from "@/hooks/use-list-table-url";
import { useMySections } from "@/hooks/use-sections";
import type { MySectionListItem } from "@/types/section";
import { ClassAttendanceSheet } from "./class-attendance-sheet";
import { createMyClassesColumns } from "./columns";

export function MyClassesTable() {
  const t = useTranslations("MyClasses");
  const { state: urlState, replaceState } = useListTableUrl();
  const { page, limit: pageSize, q: search } = urlState;

  const [selectedClass, setSelectedClass] =
    React.useState<MySectionListItem | null>(null);

  const { data, isLoading, error } = useMySections({
    page,
    limit: pageSize,
    year: search.trim() || undefined,
  });

  const columns = React.useMemo(
    () =>
      createMyClassesColumns({
        sectionId: t("colSectionId"),
        subject: t("colSubject"),
        year: t("colYear"),
        enrollment: t("colEnrollment"),
        capacity: t("colCapacity"),
      }),
    [t],
  );

  function handlePaginationChange(newPage: number, newPageSize: number) {
    const limitChanged = newPageSize !== pageSize;
    replaceState({
      ...urlState,
      page: limitChanged ? 1 : newPage,
      limit: newPageSize,
    });
  }

  function openAttendance(row: Row<MySectionListItem>) {
    setSelectedClass(row.original);
  }

  return (
    <>
      <DataTable<MySectionListItem>
        columns={columns}
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
        enableColumnVisibility
        searchValue={search}
        onSearchChange={(value) => {
          replaceState({ ...urlState, page: 1, q: value });
        }}
        onSearch={(value) => {
          replaceState({ ...urlState, page: 1, q: value });
        }}
        searchPlaceholder={t("searchPlaceholder")}
        messages={{
          empty: t("emptyTable"),
          searchPlaceholder: t("searchPlaceholder"),
          searchAriaLabel: t("searchAriaLabel"),
          actionsColumn: t("actionsColumn"),
        }}
        onRowClick={openAttendance}
        onRowDoubleClick={openAttendance}
        renderRowActions={(row) => (
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label={t("openAttendanceAria", {
              subject: row.original.subjectName,
            })}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedClass(row.original);
            }}
          >
            {t("openAttendance")}
          </Button>
        )}
      />

      <ClassAttendanceSheet
        section={selectedClass}
        onClose={() => setSelectedClass(null)}
      />
    </>
  );
}
