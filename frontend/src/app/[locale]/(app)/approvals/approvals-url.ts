import type { ApplicationStatus } from "@/types/profile-application";

const ALLOWED_LIMITS = new Set([10, 20, 50, 100]);
const VALID_STATUS = new Set<ApplicationStatus | "">([
  "",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
]);

export type ApprovalsUrlState = {
  page: number;
  limit: number;
  q: string;
  status: "" | ApplicationStatus;
  from: string;
  to: string;
};

export function parseApprovalsSearchParams(
  sp: URLSearchParams,
): ApprovalsUrlState {
  const pageRaw = Number.parseInt(sp.get("page") ?? "1", 10);
  const page =
    Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;

  const limitRaw = Number.parseInt(sp.get("limit") ?? "10", 10);
  const limit = ALLOWED_LIMITS.has(limitRaw) ? limitRaw : 10;

  const q = sp.get("q") ?? "";

  const statusRaw = (sp.get("status") ?? "") as ApplicationStatus | "";
  const status = VALID_STATUS.has(statusRaw) ? statusRaw : "";

  const from = sp.get("from") ?? "";
  const to = sp.get("to") ?? "";

  return { page, limit, q, status, from, to };
}

export function buildApprovalsQueryString(s: ApprovalsUrlState): string {
  const p = new URLSearchParams();
  if (s.page !== 1) p.set("page", String(s.page));
  if (s.limit !== 10) p.set("limit", String(s.limit));
  if (s.q.trim()) p.set("q", s.q.trim());
  if (s.status) p.set("status", s.status);
  if (s.from.trim()) p.set("from", s.from.trim());
  if (s.to.trim()) p.set("to", s.to.trim());
  return p.toString();
}
