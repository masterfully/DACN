import type { ApiMeta, PaginatedData } from "@/types/api";
import type {
  ProfileApplication,
  ProfileApplicationDetailModel,
} from "@/types/profile-application";

export function profileApplicationFromApi(row: unknown): ProfileApplication {
  const r = row as Record<string, unknown>;
  const applicationId = Number(r.applicationId ?? r.ApplicationID);
  const studentProfileId = r.studentProfileId ?? r.StudentProfileID;
  return {
    applicationId: Number.isFinite(applicationId) ? applicationId : 0,
    studentProfileId:
      typeof studentProfileId === "number" ? studentProfileId : undefined,
    studentName:
      typeof r.studentName === "string"
        ? r.studentName
        : typeof r.FullName === "string"
          ? r.FullName
          : undefined,
    applicationStatus: (r.applicationStatus ?? r.ApplicationStatus ?? null) as
      | ProfileApplication["applicationStatus"]
      | null,
    submissionDate: (r.submissionDate ?? r.SubmissionDate ?? null) as
      | string
      | null,
    reviewedByProfileId: (r.reviewedByProfileId ??
      r.ReviewedByProfileID ??
      null) as number | null | undefined,
    reviewDate: (r.reviewDate ?? r.ReviewDate ?? null) as
      | string
      | null
      | undefined,
    reviewNotes: (r.reviewNotes ?? r.ReviewNotes ?? null) as
      | string
      | null
      | undefined,
  };
}

export function profileApplicationDetailFromApi(
  row: unknown,
): ProfileApplicationDetailModel {
  const base = profileApplicationFromApi(row);
  const r = row as Record<string, unknown>;
  const studentFull =
    typeof r.StudentFullName === "string" ? r.StudentFullName : undefined;
  return {
    ...base,
    studentName: base.studentName ?? studentFull,
    reviewedByFullName:
      (r.ReviewedByFullName as string | null | undefined) ?? null,
    certificatesCount:
      typeof r.CertificatesCount === "number" ? r.CertificatesCount : undefined,
  };
}

const fallbackPaginationMeta = (): ApiMeta => ({
  page: 1,
  limit: 10,
  total: 0,
});

/** Expects `PaginatedData` from `paginatedFetcher` / mocks with `items` as row array. */
export function normalizePaginatedProfileApplications(
  raw: PaginatedData<ProfileApplication> | undefined,
): { items: ProfileApplication[]; meta: ApiMeta } {
  const fallbackMeta = fallbackPaginationMeta();
  if (!raw) return { items: [], meta: fallbackMeta };

  const rows = Array.isArray(raw.items) ? raw.items : [];
  return {
    items: rows.map(profileApplicationFromApi),
    meta: raw.meta ?? fallbackMeta,
  };
}
