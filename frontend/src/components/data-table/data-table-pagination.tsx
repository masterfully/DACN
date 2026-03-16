"use client";

import { ChevronFirstIcon, ChevronLastIcon } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: (page: number, pageSize: number) => void;
  pageSizeOptions?: number[];
  recordsPerPageLabel?: string;
  noRecordsLabel?: string;
  recordRangeLabel?: (start: number, end: number, total: number) => string;
}

type PageItem =
  | { type: "page"; value: number }
  | { type: "ellipsis"; id: "start" | "end" };

function buildPageRange(current: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => ({
      type: "page" as const,
      value: i + 1,
    }));
  }

  const items: PageItem[] = [{ type: "page", value: 1 }];
  if (current > 3) items.push({ type: "ellipsis", id: "start" });

  const rangeStart = Math.max(2, current - 1);
  const rangeEnd = Math.min(totalPages - 1, current + 1);
  for (let p = rangeStart; p <= rangeEnd; p++) {
    items.push({ type: "page", value: p });
  }

  if (current < totalPages - 2) items.push({ type: "ellipsis", id: "end" });
  items.push({ type: "page", value: totalPages });
  return items;
}

export function DataTablePagination({
  page,
  pageSize,
  total,
  onPaginationChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  recordsPerPageLabel = "Số bản ghi mỗi trang",
  noRecordsLabel = "Không có bản ghi nào",
  recordRangeLabel = (start, end, t) => `${start}–${end} trong ${t} bản ghi`,
}: DataTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);
  const pageRange = buildPageRange(page, totalPages);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-muted-foreground">{recordsPerPageLabel}</span>
          <select
            value={pageSize}
            onChange={(e) => onPaginationChange(1, Number(e.target.value))}
            className={cn(
              "border-input rounded-md border bg-transparent px-2 py-1 text-center text-sm shadow-xs",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus:outline-none focus-visible:ring-[3px]",
            )}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <p className="text-muted-foreground text-sm">
          {total === 0
            ? noRecordsLabel
            : recordRangeLabel(startItem, endItem, total)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Pagination className="justify-start sm:justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                href="#"
                aria-label="Go to first page"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  onPaginationChange(1, pageSize);
                }}
                className={cn(page <= 1 && "pointer-events-none opacity-50")}
                aria-disabled={page <= 1}
                tabIndex={page <= 1 ? -1 : undefined}
              >
                <ChevronFirstIcon className="size-4" />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPaginationChange(page - 1, pageSize);
                }}
                className={cn(page <= 1 && "pointer-events-none opacity-50")}
                aria-disabled={page <= 1}
                tabIndex={page <= 1 ? -1 : undefined}
              />
            </PaginationItem>

            {pageRange.map((item) =>
              item.type === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${item.id}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={`page-${item.value}`}>
                  <PaginationLink
                    href="#"
                    isActive={item.value === page}
                    onClick={(e) => {
                      e.preventDefault();
                      onPaginationChange(item.value, pageSize);
                    }}
                    className={cn(
                      item.value === page && "pointer-events-none opacity-100",
                    )}
                  >
                    {item.value}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPaginationChange(page + 1, pageSize);
                }}
                className={cn(
                  page >= totalPages && "pointer-events-none opacity-50",
                )}
                aria-disabled={page >= totalPages}
                tabIndex={page >= totalPages ? -1 : undefined}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                aria-label="Go to last page"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  onPaginationChange(totalPages, pageSize);
                }}
                className={cn(
                  page >= totalPages && "pointer-events-none opacity-50",
                )}
                aria-disabled={page >= totalPages}
                tabIndex={page >= totalPages ? -1 : undefined}
              >
                <ChevronLastIcon className="size-4" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
