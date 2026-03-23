import type { ApplicationStatus } from "@/types/profile-application";

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  CANCELLED: "Đã hủy",
};

export function formatApplicationStatus(
  status: ApplicationStatus | null | undefined,
): string {
  if (!status) return "—";
  return APPLICATION_STATUS_LABELS[status] ?? status;
}
