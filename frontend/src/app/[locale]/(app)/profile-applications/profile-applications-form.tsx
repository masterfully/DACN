"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCertificateTypeListMock } from "@/hooks/use-certificate-types";
import {
  useCertificatesByApplicationMock,
  useCreateCertificate,
  useDeleteCertificate,
} from "@/hooks/use-certificates";
import {
  useMyApplicationsMock,
  useSubmitApplication,
  useUpdateApplicationMutation,
} from "@/hooks/use-profile-applications";
import {
  getProfileApplicationsAccessMessage,
  shouldRedirectProfileApplications,
} from "@/lib/profile-applications-access";
import { useAuthStore } from "@/stores/auth-store";
import type { CertificateDetail } from "@/types/certificate";
import type { ProfileApplication } from "@/types/profile-application";
import { formatApplicationStatus } from "../approvals/application-status";

function CertificateDeleteButton({
  certificateId,
  onDeleted,
  disabled,
}: {
  certificateId: number;
  onDeleted: () => Promise<void>;
  disabled?: boolean;
}) {
  const { mutateWithResult: del, isLoading } =
    useDeleteCertificate(certificateId);

  async function handleDelete() {
    const result = await del(undefined);
    if (!result.ok) {
      toast.error(result.error?.message ?? "Không thể xóa chứng chỉ.");
      return;
    }
    toast.success("Đã xóa chứng chỉ khỏi hồ sơ.");
    await onDeleted();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={disabled || isLoading}
        >
          Xóa
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa chứng chỉ?</AlertDialogTitle>
          <AlertDialogDescription>
            Chứng chỉ sẽ bị gỡ khỏi hồ sơ. Bạn có chắc chắn?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isLoading}
            onClick={() => void handleDelete()}
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function formatDateShort(iso: string | null | undefined) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("vi-VN");
  } catch {
    return iso;
  }
}

export function ProfileApplicationsForm() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const role = currentUser?.role ?? null;

  const accessMessage = getProfileApplicationsAccessMessage(role);
  const _redirect = shouldRedirectProfileApplications(role);
  void _redirect;

  const {
    data: myApps,
    isLoading: appsLoading,
    error: appsError,
    mutate: refreshMyApps,
  } = useMyApplicationsMock({ page: 1, limit: 50 });

  const items = myApps?.items ?? [];
  const pendingApp =
    items.find((a) => a.applicationStatus === "PENDING") ?? null;

  const { data: typesData } = useCertificateTypeListMock({
    page: 1,
    limit: 200,
  });
  const typeOptions = typesData?.items ?? [];

  const {
    data: certificates,
    isLoading: certsLoading,
    mutate: refreshCertificates,
  } = useCertificatesByApplicationMock(pendingApp?.applicationId);

  const { mutateWithResult: submitApp, isLoading: submitting } =
    useSubmitApplication();
  const { mutateWithResult: updateApp, isLoading: updating } =
    useUpdateApplicationMutation();
  const { mutateWithResult: createCert, isLoading: creatingCert } =
    useCreateCertificate();

  const [formTypeId, setFormTypeId] = React.useState<string>("");
  const [formScore, setFormScore] = React.useState("");
  const [formIssue, setFormIssue] = React.useState("");
  const [formExpiry, setFormExpiry] = React.useState("");
  const [formUrl, setFormUrl] = React.useState("");

  const canEditCertificates = pendingApp?.applicationStatus === "PENDING";

  async function handleSubmitNewApplication() {
    const result = await submitApp(undefined);
    if (!result.ok) {
      toast.error(result.error?.message ?? "Không thể nộp hồ sơ.");
      return;
    }
    toast.success("Đã nộp hồ sơ. Bạn có thể thêm chứng chỉ đính kèm.");
    await refreshMyApps();
  }

  async function handleUpdateApplication() {
    if (!pendingApp) return;
    const result = await updateApp({ applicationId: pendingApp.applicationId });
    if (!result.ok) {
      toast.error(result.error?.message ?? "Không thể cập nhật hồ sơ.");
      return;
    }
    toast.success("Đã cập nhật hồ sơ.");
    await refreshMyApps();
    await refreshCertificates();
  }

  async function handleAddCertificate(e: React.FormEvent) {
    e.preventDefault();
    if (!pendingApp) return;
    const certificateTypeId = Number(formTypeId);
    if (!Number.isFinite(certificateTypeId) || certificateTypeId <= 0) {
      toast.error("Chọn loại chứng chỉ.");
      return;
    }

    const score = formScore.trim() === "" ? undefined : Number(formScore);
    if (formScore.trim() !== "" && !Number.isFinite(score)) {
      toast.error("Điểm không hợp lệ.");
      return;
    }

    const result = await createCert({
      applicationId: pendingApp.applicationId,
      certificateTypeId,
      score,
      issueDate: formIssue.trim() || undefined,
      expiryDate: formExpiry.trim() || undefined,
      evidenceURL: formUrl.trim() || undefined,
    });

    if (!result.ok) {
      toast.error(
        result.error?.message ??
          "Không thể thêm chứng chỉ. Kiểm tra quyền tài khoản hoặc dữ liệu.",
      );
      return;
    }

    toast.success("Đã thêm chứng chỉ vào hồ sơ.");
    setFormTypeId("");
    setFormScore("");
    setFormIssue("");
    setFormExpiry("");
    setFormUrl("");
    await refreshCertificates();
    await refreshMyApps();
  }

  function renderApplicationSummary(app: ProfileApplication) {
    return (
      <li
        key={app.applicationId}
        className="text-muted-foreground border-b py-2 text-sm last:border-0"
      >
        <span className="text-foreground font-medium">
          #{app.applicationId}
        </span>{" "}
        — {formatApplicationStatus(app.applicationStatus)}{" "}
        <span className="text-xs">
          · Nộp: {formatDateShort(app.submissionDate)}
          {app.reviewDate
            ? ` · Duyệt: ${formatDateShort(app.reviewDate)}`
            : null}
        </span>
      </li>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {accessMessage ? (
        <div className="bg-muted rounded-lg border px-4 py-3 text-sm">
          {accessMessage}
        </div>
      ) : null}

      <section className="space-y-3 rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Trạng thái hồ sơ</h2>
        {appsLoading ? (
          <p className="text-muted-foreground text-sm">Đang tải…</p>
        ) : appsError ? (
          <p className="text-destructive text-sm">{appsError.message}</p>
        ) : pendingApp ? (
          <div className="grid gap-2 text-sm">
            <p>
              <span className="text-muted-foreground">Mã hồ sơ: </span>
              <span className="font-medium">{pendingApp.applicationId}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Trạng thái: </span>
              {formatApplicationStatus(pendingApp.applicationStatus)}
            </p>
            <p>
              <span className="text-muted-foreground">Ngày nộp: </span>
              {formatDateShort(pendingApp.submissionDate)}
            </p>
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={updating}
                onClick={() => void handleUpdateApplication()}
              >
                {updating ? "Đang lưu…" : "Cập nhật hồ sơ (lưu thay đổi)"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            <p className="text-muted-foreground text-sm">
              Bạn chưa có hồ sơ đang chờ duyệt. Nhấn nút bên dưới để nộp hồ sơ
              mới.
            </p>
            <Button
              type="button"
              disabled={submitting}
              onClick={() => void handleSubmitNewApplication()}
            >
              {submitting ? "Đang nộp…" : "Nộp hồ sơ"}
            </Button>
          </div>
        )}
      </section>

      {pendingApp && canEditCertificates ? (
        <section className="space-y-4 rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Chứng chỉ đính kèm</h2>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loại</TableHead>
                  <TableHead className="text-center">Điểm</TableHead>
                  <TableHead>Cấp</TableHead>
                  <TableHead>Hết hạn</TableHead>
                  <TableHead>Minh chứng</TableHead>
                  <TableHead className="text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certsLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-20 text-center text-sm">
                      Đang tải chứng chỉ…
                    </TableCell>
                  </TableRow>
                ) : !certificates?.length ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-muted-foreground h-20 text-center text-sm"
                    >
                      Chưa có chứng chỉ nào. Thêm mới bằng biểu mẫu bên dưới.
                    </TableCell>
                  </TableRow>
                ) : (
                  certificates.map((c: CertificateDetail) => (
                    <TableRow key={c.certificateId}>
                      <TableCell>
                        {c.typeName ?? `#${c.certificateTypeId}`}
                      </TableCell>
                      <TableCell className="text-center">
                        {c.score ?? "—"}
                      </TableCell>
                      <TableCell>{formatDateShort(c.issueDate)}</TableCell>
                      <TableCell>{formatDateShort(c.expiryDate)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
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
                      <TableCell>
                        <div className="flex justify-center">
                          <CertificateDeleteButton
                            certificateId={c.certificateId}
                            onDeleted={async () => {
                              await refreshCertificates();
                            }}
                            disabled={!canEditCertificates}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <form
            onSubmit={(e) => void handleAddCertificate(e)}
            className="bg-muted/30 grid gap-4 rounded-md border p-4 sm:grid-cols-2"
          >
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="certType">Loại chứng chỉ</Label>
              <select
                id="certType"
                className="border-input bg-background h-9 w-full rounded-md border px-2 text-sm"
                value={formTypeId}
                onChange={(e) => setFormTypeId(e.target.value)}
                disabled={creatingCert}
                required
              >
                <option value="">— Chọn —</option>
                {typeOptions.map((t) => (
                  <option
                    key={t.certificateTypeId}
                    value={String(t.certificateTypeId)}
                  >
                    {t.typeName}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="certScore">Điểm (tuỳ chọn)</Label>
              <Input
                id="certScore"
                type="number"
                step="any"
                value={formScore}
                onChange={(e) => setFormScore(e.target.value)}
                disabled={creatingCert}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="certIssue">Ngày cấp</Label>
              <Input
                id="certIssue"
                type="date"
                value={formIssue}
                onChange={(e) => setFormIssue(e.target.value)}
                disabled={creatingCert}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="certExpiry">Ngày hết hạn</Label>
              <Input
                id="certExpiry"
                type="date"
                value={formExpiry}
                onChange={(e) => setFormExpiry(e.target.value)}
                disabled={creatingCert}
              />
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="certUrl">URL minh chứng (tuỳ chọn)</Label>
              <Input
                id="certUrl"
                type="url"
                placeholder="https://..."
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                disabled={creatingCert}
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={creatingCert}>
                {creatingCert ? "Đang thêm…" : "Thêm chứng chỉ"}
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      {items.length > 0 ? (
        <section className="space-y-3 rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Lịch sử hồ sơ</h2>
          <ul>{items.map(renderApplicationSummary)}</ul>
        </section>
      ) : null}
    </div>
  );
}
