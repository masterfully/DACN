import type { ColumnDef, Row, SortingState } from "@tanstack/react-table";
import type { ReactNode } from "react";
import type { ToolbarActionGroup } from "./data-table-toolbar.types";

export interface DataTablePagination {
  page: number;
  pageSize: number;
  total: number;
}

/**
 * Overrideable UI strings for the table, toolbar and pagination.
 * All fields are optional — only provide what you need to customize.
 */
export interface DataTableMessages {
  /** Checkbox aria-label for "select all rows" */
  selectAll?: string;
  /** Checkbox aria-label for "select single row" */
  selectRow?: string;
  /** Header label for the auto-generated actions column */
  actionsColumn?: string;
  /** Message shown when the data array is empty */
  empty?: string;
  /** Placeholder for the search input */
  searchPlaceholder?: string;
  /** Accessible name for the search input (replaces default toolbar label when set) */
  searchAriaLabel?: string;
  /** Label on the "hide columns" trigger button */
  hideColumns?: string;
  /** Title of the column visibility dropdown */
  showHideColumns?: string;
  /** Label before the page-size selector */
  recordsPerPage?: string;
  /** Message shown when total === 0 */
  noRecords?: string;
  /** Range summary e.g. "1–10 trong 42 bản ghi" */
  recordRange?: (start: number, end: number, total: number) => string;
}

export interface DataTableProps<TData> {
  /** Column definitions for @tanstack/react-table */
  columns: ColumnDef<TData>[];
  /** Current page data */
  data: TData[];
  /** Server-side pagination state */
  pagination: DataTablePagination;
  /** Called when page or pageSize changes */
  onPaginationChange: (page: number, pageSize: number) => void;
  /**
   * Controlled server-side sorting state.
   * When provided, toggling a sort header will call onSortingChange
   * and the parent is responsible for re-fetching with the new sort params.
   */
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  /**
   * Controlled search/filter value.
   * When provided, the toolbar shows a search input.
   * Parent is responsible for passing the value to the API.
   */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  /** Show skeleton loading rows */
  isLoading?: boolean;
  /** Error message rendered inside the table body */
  error?: string | null;
  /** Enable row checkbox selection */
  enableRowSelection?: boolean;
  /** Enable column visibility toggle dropdown */
  enableColumnVisibility?: boolean;
  /**
   * Render a cell with actions (edit / delete / view) for each row.
   * Automatically appended as the last column
   */
  renderRowActions?: (row: Row<TData>) => ReactNode;
  /**
   * Declarative toolbar action group.  The primary action is always rendered
   * as a full button; additional actions land in a chevron dropdown.
   * Accepts either a static config or a factory that receives the currently
   * selected rows so callers can drive `disabled` from selection state.
   */
  toolbarActions?:
    | ToolbarActionGroup
    | ((selectedRows: Row<TData>[]) => ToolbarActionGroup);
  /**
   * Stable row identity function passed to useReactTable.
   * Defaults to the row index if not provided.
   */
  getRowId?: (row: TData) => string;
  /**
   * Message shown when data array is empty.
   * @deprecated Use `messages.empty` instead.
   */
  emptyMessage?: string;
  /**
   * Called when a data row is clicked (single click).
   * Use `stopPropagation` on interactive cells (links, buttons) when needed.
   */
  onRowClick?: (row: Row<TData>) => void;
  /**
   * Optional extra `className` per row (e.g. `cursor-pointer` only for some rows).
   */
  getRowClassName?: (row: Row<TData>) => string | undefined;
  /**
   * Called when a data row is double-clicked.
   * DataTable forwards the tanstack Row object; the page is responsible
   * for deciding what to do (open dialog, navigate, etc.).
   * When provided, rows also get a `cursor-pointer` affordance.
   */
  onRowDoubleClick?: (row: Row<TData>) => void;
  /**
   * Override any UI label/string rendered by the table, toolbar or pagination.
   * Unset fields fall back to built-in defaults.
   */
  messages?: DataTableMessages;
  /**
   * Options for the page-size selector.
   * Defaults to [10, 20, 50, 100].
   */
  pageSizeOptions?: number[];
  /**
   * Debounce delay (ms) for the search input.
   * Defaults to 400.
   */
  searchDebounceMs?: number;
}
