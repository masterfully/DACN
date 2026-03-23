"use client";

import type { Row } from "@tanstack/react-table";
import * as React from "react";
import { toast } from "sonner";
import type { ToolbarActionGroup } from "@/components/data-table";
import { DataTable } from "@/components/data-table";
import {
  useCreateSection,
  useSectionDetail,
  useSectionList,
  useUpdateSection,
} from "@/hooks/use-sections";
import type { MutationResult } from "@/types/api";
import type { SectionDetail, SectionListItem } from "@/types/section";
import { sectionColumns } from "./columns";
import { SectionDetailSheet } from "./section-detail-sheet";
import {
  buildCreateSectionPayload,
  buildUpdateSectionPayload,
  SectionFormDialog,
  type SectionFormValues,
} from "./section-form-dialog";
import { SectionRowActions } from "./section-row-actions";

export function SectionsTable() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingSection, setEditingSection] =
    React.useState<SectionListItem | null>(null);

  const [detailSectionId, setDetailSectionId] = React.useState<number | null>(
    null,
  );

  const {
    data,
    isLoading,
    error,
    mutate: refreshSections,
  } = useSectionList({
    page,
    limit: pageSize,
    search: search.trim() || undefined,
  });

  const { data: detailSection, error: detailError } = useSectionDetail(
    detailSectionId ?? undefined,
  );

  React.useEffect(() => {
    if (detailError) {
      toast.error(detailError.message);
      setDetailSectionId(null);
    }
  }, [detailError]);

  const { mutateWithResult: createSection, isLoading: isCreating } =
    // key uses SWR mutation; editingSection is null-safe
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    useCreateSection();
  const { mutateWithResult: updateSection, isLoading: isUpdating } =
    useUpdateSection(editingSection?.sectionId ?? 0);
  const isSubmitting = isCreating || isUpdating;

  function openAddDialog() {
    setEditingSection(null);
    setDialogOpen(true);
  }

  function openEditDialog(section: SectionListItem) {
    setEditingSection(section);
    setDialogOpen(true);
  }

  async function handleFormSubmit(
    values: SectionFormValues,
    mode: "create" | "edit",
  ): Promise<MutationResult<unknown>> {
    if (mode === "edit") {
      const result = await updateSection(buildUpdateSectionPayload(values));
      if (result.ok) {
        await refreshSections();
        setDialogOpen(false);
        setEditingSection(null);
      }
      return result;
    }

    const result = await createSection(buildCreateSectionPayload(values));
    if (result.ok) {
      await refreshSections();
      setDialogOpen(false);
      setEditingSection(null);
    }
    return result;
  }

  function handlePaginationChange(newPage: number, newPageSize: number) {
    setPage(newPage);
    setPageSize(newPageSize);
  }

  function handleRowDoubleClick(row: Row<SectionListItem>) {
    setDetailSectionId(row.original.sectionId);
  }

  function buildToolbarActions(
    _selectedRows: Row<SectionListItem>[],
  ): ToolbarActionGroup {
    return {
      primary: {
        label: "Thêm mới",
        variant: "outline",
        onClick: openAddDialog,
      },
    };
  }

  return (
    <>
      <DataTable<SectionListItem>
        columns={sectionColumns}
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
        toolbarActions={buildToolbarActions}
        onRowDoubleClick={handleRowDoubleClick}
        renderRowActions={(row) => (
          <SectionRowActions
            section={row.original}
            onEdit={openEditDialog}
            onDeleteSuccess={refreshSections}
          />
        )}
      />

      <SectionFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingSection={editingSection}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <SectionDetailSheet
        section={(detailSection as SectionDetail | undefined) ?? null}
        onClose={() => setDetailSectionId(null)}
      />
    </>
  );
}
