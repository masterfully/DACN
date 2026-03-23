"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useReviewApplicationMutation } from "@/hooks/use-profile-applications";
import type { ProfileApplication } from "@/types/profile-application";
import { formatApplicationStatus } from "./application-status";

interface ApplicationReviewDialogProps {
  application: ProfileApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => Promise<void>;
}

export function ApplicationReviewDialog({
  application,
  open,
  onOpenChange,
  onSuccess,
}: ApplicationReviewDialogProps) {
  const [notes, setNotes] = React.useState("");
  const { mutateWithResult: review, isLoading } =
    useReviewApplicationMutation();

  React.useEffect(() => {
    if (open) setNotes("");
  }, [open]);

  async function submit(status: "APPROVED" | "REJECTED") {
    if (!application) return;
    const result = await review({
      applicationId: application.applicationId,
      applicationStatus: status,
      reviewNotes: notes.trim() || undefined,
    });
    if (!result.ok) {
      toast.error(result.error?.message ?? "Cập nhật trạng thái thất bại.");
      return;
    }
    toast.success(
      status === "APPROVED" ? "Đã duyệt hồ sơ." : "Đã từ chối hồ sơ.",
    );
    onOpenChange(false);
    await onSuccess();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Xét duyệt hồ sơ</DialogTitle>
        </DialogHeader>

        {application ? (
          <div className="grid gap-3 text-sm">
            <p>
              <span className="text-muted-foreground">Sinh viên: </span>
              <span className="font-medium">
                {application.studentName ?? "—"}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">
                Trạng thái hiện tại:{" "}
              </span>
              {formatApplicationStatus(application.applicationStatus)}
            </p>
            <div className="grid gap-1.5">
              <Label htmlFor="reviewNotes">Ghi chú (tuỳ chọn)</Label>
              <Textarea
                id="reviewNotes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isLoading}
                rows={3}
                placeholder="Nhập ghi chú cho sinh viên…"
              />
            </div>
          </div>
        ) : null}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Đóng
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isLoading || !application}
            onClick={() => void submit("REJECTED")}
          >
            Từ chối
          </Button>
          <Button
            type="button"
            disabled={isLoading || !application}
            onClick={() => void submit("APPROVED")}
          >
            Duyệt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
