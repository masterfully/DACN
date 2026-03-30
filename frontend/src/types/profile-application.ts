/** Matches API string values (GET filters, PATCH review, response). */
export type ApplicationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export interface ProfileApplication {
  applicationId: number;
  /** Present on admin list/detail; may be absent on `my-applications` items. */
  studentProfileId?: number;
  studentName?: string;
  applicationStatus: ApplicationStatus | null;
  submissionDate: string | null;
  reviewedByProfileId?: number | null;
  reviewDate?: string | null;
  reviewNotes?: string | null;
}

/**
 * GET `/profile-applications/:id` — shape of `data` from backend (`ProfileApplicationDetail`).
 */
export interface ProfileApplicationDetailResponse {
  ApplicationID: number;
  StudentProfileID: number;
  StudentFullName: string;
  ApplicationStatus: string | null;
  SubmissionDate: string | null;
  ReviewedByProfileID: number | null;
  ReviewedByFullName: string | null;
  ReviewDate: string | null;
  ReviewNotes: string | null;
  CertificatesCount: number;
}

/** Normalized detail for UI (includes optional fields from detail endpoint). */
export type ProfileApplicationDetailModel = ProfileApplication & {
  reviewedByFullName?: string | null;
  certificatesCount?: number;
};

export interface GetApplicationListParams {
  page?: number;
  limit?: number;
  search?: string;
  applicationStatus?: ApplicationStatus;
  submissionFrom?: string;
  submissionTo?: string;
}

export interface GetMyApplicationsParams {
  page?: number;
  limit?: number;
}

export interface ReviewApplicationInput {
  applicationStatus: "APPROVED" | "REJECTED";
  reviewNotes?: string;
}

/** Variables for dynamic review mutation (table with many rows). */
export type ReviewApplicationVariables = {
  applicationId: number;
} & ReviewApplicationInput;
