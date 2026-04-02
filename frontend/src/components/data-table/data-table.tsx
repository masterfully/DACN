"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  Target,
} from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { DataTableProps } from "./data-table.types";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

const SKELETON_ROW_IDS = ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4"] as const;

export function DataTable<TData>({
  columns: columnsProp,
  data,
  pagination,
  onPaginationChange,
  sorting: sortingProp,
  onSortingChange,
  searchValue,
  onSearchChange,
  onSearch,
  searchPlaceholder,
  isLoading = false,
  error,
  enableRowSelection = false,
  enableColumnVisibility = true,
  renderRowActions,
  toolbarActions,
  getRowId,
  emptyMessage,
  onRowClick,
  getRowClassName,
  onRowDoubleClick,
  messages,
  pageSizeOptions,
  searchDebounceMs,
}: DataTableProps<TData>) {
  const resolvedMessages = React.useMemo(
    () => ({
      selectAll: messages?.selectAll ?? "Chọn tất cả",
      selectRow: messages?.selectRow ?? "Chọn dòng",
      actionsColumn: messages?.actionsColumn ?? "Hành động",
      empty: messages?.empty ?? emptyMessage ?? "Không có dữ liệu.",
      searchPlaceholder:
        messages?.searchPlaceholder ?? searchPlaceholder ?? "Tìm kiếm…",
      searchAriaLabel: messages?.searchAriaLabel,
      hideColumns: messages?.hideColumns ?? "Ẩn cột",
      showHideColumns: messages?.showHideColumns ?? "Hiện / ẩn cột",
      recordsPerPage: messages?.recordsPerPage ?? "Số bản ghi mỗi trang",
      noRecords: messages?.noRecords ?? "Không có bản ghi nào",
      recordRange:
        messages?.recordRange ??
        ((start: number, end: number, total: number) =>
          `${start}–${end} trong ${total} bản ghi`),
    }),
    [
      messages?.selectAll,
      messages?.selectRow,
      messages?.actionsColumn,
      messages?.empty,
      messages?.searchPlaceholder,
      messages?.searchAriaLabel,
      messages?.hideColumns,
      messages?.showHideColumns,
      messages?.recordsPerPage,
      messages?.noRecords,
      messages?.recordRange,
      emptyMessage,
      searchPlaceholder,
    ],
  );
  const [sorting, setSorting] = React.useState<SortingState>(sortingProp ?? []);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  React.useEffect(() => {
    if (sortingProp !== undefined) {
      setSorting(sortingProp);
    }
  }, [sortingProp]);

  const { page, pageSize } = pagination;

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional trigger on pagination change
  React.useEffect(() => {
    setRowSelection({});
  }, [page, pageSize]);

  const columns = React.useMemo<ColumnDef<TData>[]>(() => {
    const cols: ColumnDef<TData>[] = [];

    if (enableRowSelection) {
      cols.push({
        id: "__select__",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            ref={(el) => {
              if (el) {
                el.indeterminate =
                  table.getIsSomePageRowsSelected() &&
                  !table.getIsAllPageRowsSelected();
              }
            }}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            onClick={(e) => e.stopPropagation()}
            aria-label={resolvedMessages.selectAll}
            className="cursor-pointer"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            onClick={(e) => e.stopPropagation()}
            aria-label={resolvedMessages.selectRow}
            className="cursor-pointer"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      });
    }

    cols.push(...columnsProp);

    if (renderRowActions) {
      cols.push({
        id: "__actions__",
        header: () => (
          <ColHeader
            icon={Target}
            label={resolvedMessages.actionsColumn}
            center
          />
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            {renderRowActions(row)}
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }

    return cols;
  }, [columnsProp, enableRowSelection, renderRowActions, resolvedMessages]);

  const { total } = pagination;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { sorting, columnVisibility, rowSelection },
    manualPagination: true,
    manualSorting: false, // TODO: remove this when API is ready
    enableRowSelection,
    getRowId,
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      setSorting(next);
      onSortingChange?.(next);
    },
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const resolvedToolbarActions =
    typeof toolbarActions === "function"
      ? toolbarActions(selectedRows)
      : toolbarActions;

  return (
    <div className="flex h-full flex-col gap-4 select-none">
      <DataTableToolbar
        table={table}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onSearch={onSearch}
        searchPlaceholder={resolvedMessages.searchPlaceholder}
        searchAriaLabel={resolvedMessages.searchAriaLabel}
        enableColumnVisibility={enableColumnVisibility}
        selectedCount={selectedRows.length}
        toolbarActions={resolvedToolbarActions}
        hideColumnsLabel={resolvedMessages.hideColumns}
        showHideColumnsLabel={resolvedMessages.showHideColumns}
        debounceMs={searchDebounceMs}
      />

      <div className="max-h-[calc(100vh-20rem)] overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-muted sticky top-0"
                    style={{
                      width:
                        header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="-ml-2 h-8 justify-start gap-1 px-2 font-normal"
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            header.column.getToggleSortingHandler()?.(event);
                          }
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        <span
                          className="text-muted-foreground text-xs"
                          aria-hidden
                        >
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUpIcon className="size-4" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDownIcon className="size-4" />
                          ) : (
                            <ArrowUpDownIcon className="size-4" />
                          )}
                        </span>
                      </Button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="">
            {isLoading ? (
              SKELETON_ROW_IDS.map((rowKey) => (
                <TableRow key={rowKey}>
                  {table
                    .getAllColumns()
                    .filter((col) => col.getIsVisible())
                    .map((col) => (
                      <TableCell
                        key={`${rowKey}-${col.id}`}
                        // className="border-r last:border-r-0"
                      >
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-destructive h-24 text-center"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  {resolvedMessages.empty}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className={cn(
                    onRowClick || onRowDoubleClick
                      ? "cursor-pointer"
                      : undefined,
                    getRowClassName?.(row),
                  )}
                  onClick={() => onRowClick?.(row)}
                  onDoubleClick={() => onRowDoubleClick?.(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      // className="border-r last:border-r-0"
                      style={{
                        width:
                          cell.column.getSize() !== 150
                            ? cell.column.getSize()
                            : undefined,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPaginationChange={onPaginationChange}
        pageSizeOptions={pageSizeOptions}
        recordsPerPageLabel={resolvedMessages.recordsPerPage}
        noRecordsLabel={resolvedMessages.noRecords}
        recordRangeLabel={resolvedMessages.recordRange}
      />
    </div>
  );
}

export function ColHeader({
  icon: Icon,
  label,
  center,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-1.5",
        center ? "justify-center" : "justify-start",
        className,
      )}
    >
      {Icon && (
        <Icon className="text-muted-foreground size-3.5 shrink-0" aria-hidden />
      )}
      {label}
    </span>
  );
}
