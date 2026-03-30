"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCertificatesByApplication } from "@/hooks/use-certificates";
import { useApplicationDetail } from "@/hooks/use-profile-applications";
import type { CertificateDetail } from "@/types/certificate";
import type {
  ProfileApplication,
  ProfileApplicationDetailModel,
} from "@/types/profile-application";
import { formatApplicationStatus } from "./application-status";

function formatDateShort(iso: string | null | undefined) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("vi-VN");
  } catch {
    return iso;
  }
}

function ApplicationCertificatesReadOnly({
  applicationId,
}: {
  applicationId: number;
}) {
  const { data, isLoading, error } =
    useCertificatesByApplication(applicationId);
  const rows = error ? [] : (data ?? []);
  const showLoading = isLoading && !error;

  if (showLoading) {
    return <p className="text-muted-foreground text-sm">Đang tải chứng chỉ…</p>;
  }

  if (!rows.length) {
    return (
      <p className="text-muted-foreground text-sm">
        Không có chứng chỉ đính kèm.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Loại</TableHead>
            <TableHead className="text-center">Điểm</TableHead>
            <TableHead>Cấp</TableHead>
            <TableHead>Hết hạn</TableHead>
            <TableHead>Minh chứng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((c: CertificateDetail) => (
            <TableRow key={c.certificateId}>
              <TableCell>{c.typeName ?? `#${c.certificateTypeId}`}</TableCell>
              <TableCell className="text-center">{c.score ?? "—"}</TableCell>
              <TableCell>{formatDateShort(c.issueDate)}</TableCell>
              <TableCell>{formatDateShort(c.expiryDate)}</TableCell>
              <TableCell className="max-w-[160px] truncate">
                {c.evidenceURL ? (
                  <a
                    href={c.evidenceURL}
                    className="text-primary underline-offset-2 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Liên kết
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export interface ApplicationPendingDetailSheetProps {
  application: ProfileApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Mở dialog xét duyệt với cùng hồ sơ (chỉ hiện khi PENDING). */
  onRequestReview?: () => void;
}

export function ApplicationPendingDetailSheet({
  application,
  open,
  onOpenChange,
  onRequestReview,
}: ApplicationPendingDetailSheetProps) {
  const applicationId = application?.applicationId;

  const { data: detailData, isLoading: detailLoading } = useApplicationDetail(
    open && applicationId !== undefined ? applicationId : undefined,
  );

  const sheetApplication =
    React.useMemo((): ProfileApplicationDetailModel | null => {
      if (!application) return null;
      if (detailData) return detailData;
      if (detailLoading) return null;
      return {
        ...application,
        reviewedByFullName: null,
        certificatesCount: undefined,
      };
    }, [application, detailData, detailLoading]);

  const isPending = application?.applicationStatus === "PENDING";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-y-auto sm:max-w-2xl"
      >
        {applicationId !== undefined && detailLoading ? (
          <p className="text-muted-foreground px-4 pt-2 text-sm">
            Đang tải chi tiết hồ sơ…
          </p>
        ) : sheetApplication ? (
          <>
            <SheetHeader>
              <SheetTitle>Hồ sơ #{sheetApplication.applicationId}</SheetTitle>
              <SheetDescription>
                {formatApplicationStatus(sheetApplication.applicationStatus)}
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-1 flex-col gap-4 px-4 pb-4 text-sm">
              <div className="flex flex-col gap-2">
                {sheetApplication.studentName ? (
                  <p>
                    <span className="text-muted-foreground">Sinh viên: </span>
                    {sheetApplication.studentName}
                  </p>
                ) : null}
                <p>
                  <span className="text-muted-foreground">Ngày nộp: </span>
                  {formatDateShort(sheetApplication.submissionDate)}
                </p>
                {sheetApplication.certificatesCount != null ? (
                  <p>
                    <span className="text-muted-foreground">
                      Số chứng chỉ:{" "}
                    </span>
                    {sheetApplication.certificatesCount}
                  </p>
                ) : null}
                {sheetApplication.reviewDate ? (
                  <p>
                    <span className="text-muted-foreground">Ngày duyệt: </span>
                    {formatDateShort(sheetApplication.reviewDate)}
                  </p>
                ) : null}
                {sheetApplication.reviewedByFullName ? (
                  <p>
                    <span className="text-muted-foreground">Người duyệt: </span>
                    {sheetApplication.reviewedByFullName}
                  </p>
                ) : null}
                {sheetApplication.reviewNotes ? (
                  <div className="grid gap-1">
                    <span className="text-muted-foreground">Ghi chú duyệt</span>
                    <p className="bg-muted/50 text-foreground rounded-md border p-3">
                      {sheetApplication.reviewNotes}
                    </p>
                  </div>
                ) : null}
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Chứng chỉ đính kèm</h3>
                <ApplicationCertificatesReadOnly
                  applicationId={sheetApplication.applicationId}
                />
              </div>
            </div>
            {isPending && onRequestReview ? (
              <SheetFooter className="border-t px-4 py-4 sm:justify-start">
                <Button
                  type="button"
                  onClick={() => {
                    onRequestReview();
                  }}
                >
                  Xét duyệt hồ sơ
                </Button>
              </SheetFooter>
            ) : null}
          </>
        ) : applicationId !== undefined ? (
          <SheetHeader>
            <SheetTitle>Không tìm thấy hồ sơ</SheetTitle>
          </SheetHeader>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
