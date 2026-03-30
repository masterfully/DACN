"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApplicationList } from "@/hooks/use-profile-applications";
import { normalizePaginatedProfileApplications } from "@/lib/profile-application-dto";
import type {
  ApplicationStatus,
  ProfileApplication,
} from "@/types/profile-application";
import { ApplicationPendingDetailSheet } from "./application-pending-detail-sheet";
import { ApplicationReviewDialog } from "./application-review-dialog";
import { buildApprovalColumns } from "./columns";

const STATUS_FILTER_OPTIONS: {
  value: "" | ApplicationStatus;
  label: string;
}[] = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "REJECTED", label: "Từ chối" },
  // { value: "CANCELLED", label: "Đã hủy" },
];

export function ApprovalsTable() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "" | ApplicationStatus
  >("");
  const [submissionFrom, setSubmissionFrom] = React.useState("");
  const [submissionTo, setSubmissionTo] = React.useState("");

  const [reviewTarget, setReviewTarget] =
    React.useState<ProfileApplication | null>(null);
  const [reviewOpen, setReviewOpen] = React.useState(false);

  const [detailTarget, setDetailTarget] =
    React.useState<ProfileApplication | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  const listParams = React.useMemo(
    () => ({
      page,
      limit: pageSize,
      search: search.trim() || undefined,
      applicationStatus: statusFilter || undefined,
      submissionFrom: submissionFrom.trim() || undefined,
      submissionTo: submissionTo.trim() || undefined,
    }),
    [page, pageSize, search, statusFilter, submissionFrom, submissionTo],
  );

  const {
    data,
    isLoading,
    error,
    mutate: refreshList,
  } = useApplicationList(listParams);

  const { items: tableItems, meta: tableMeta } = React.useMemo(
    () => normalizePaginatedProfileApplications(data),
    [data],
  );

  const handleOpenReview = React.useCallback((row: ProfileApplication) => {
    setReviewTarget(row);
    setReviewOpen(true);
  }, []);

  const handleRowDoubleClick = React.useCallback((row: ProfileApplication) => {
    // if (row.applicationStatus !== "PENDING") return;
    setDetailTarget(row);
    setDetailOpen(true);
  }, []);

  const columns = React.useMemo(
    () => buildApprovalColumns(handleOpenReview),
    [handleOpenReview],
  );

  function handlePaginationChange(newPage: number, newPageSize: number) {
    setPage(newPage);
    setPageSize(newPageSize);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="grid gap-1.5">
          <Label htmlFor="approval-status">Trạng thái</Label>
          <select
            id="approval-status"
            className="border-input bg-background h-9 w-full rounded-md border px-2 text-sm"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "" | ApplicationStatus);
              setPage(1);
            }}
          >
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="submissionFrom">Nộp từ (YYYY-MM-DD)</Label>
          <Input
            id="submissionFrom"
            type="date"
            value={submissionFrom}
            onChange={(e) => {
              setSubmissionFrom(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="submissionTo">Nộp đến (YYYY-MM-DD)</Label>
          <Input
            id="submissionTo"
            type="date"
            value={submissionTo}
            onChange={(e) => {
              setSubmissionTo(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <DataTable<ProfileApplication>
        columns={columns}
        data={tableItems}
        pagination={{
          page: tableMeta.page ?? page,
          pageSize: tableMeta.limit ?? pageSize,
          total: tableMeta.total ?? 0,
        }}
        onPaginationChange={handlePaginationChange}
        isLoading={isLoading}
        error={error?.message ?? null}
        getRowId={(row) => String(row.applicationId)}
        onRowDoubleClick={(row) => handleRowDoubleClick(row.original)}
        enableColumnVisibility
        searchValue={search}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder="Tìm theo tên sinh viên..."
        messages={{ empty: "Không có hồ sơ nào." }}
      />

      <ApplicationPendingDetailSheet
        key={detailTarget?.applicationId ?? "detail-closed"}
        application={detailTarget}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setDetailTarget(null);
        }}
        onRequestReview={() => {
          if (!detailTarget) return;
          const app = detailTarget;
          setDetailOpen(false);
          setDetailTarget(null);
          setReviewTarget(app);
          setReviewOpen(true);
        }}
      />

      <ApplicationReviewDialog
        key={reviewTarget?.applicationId ?? "closed"}
        application={reviewTarget}
        open={reviewOpen}
        onOpenChange={(open) => {
          setReviewOpen(open);
          if (!open) setReviewTarget(null);
        }}
        onSuccess={async () => {
          await refreshList();
        }}
      />
    </div>
  );
}
