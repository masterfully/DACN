export interface GetApplicationsListParams {
  page?: number;
  limit?: number;
  search?: string;
  applicationStatus?: string;
  submissionFrom?: string;
  submissionTo?: string;
}

export interface GetMyApplicationsParams {
  page?: number;
  limit?: number;
}

export interface ProfileApplicationListItem {
  ApplicationID: number;
  StudentProfileID: number;
  FullName: string;
  ApplicationStatus: string | null;
  SubmissionDate: string | null;
  ReviewedByProfileID: number | null;
  ReviewDate: string | null;
}

export interface ProfileApplicationDetail {
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

export interface ReviewApplicationInput {
  applicationStatus: "APPROVED" | "REJECTED";
  reviewNotes?: string;
}

export interface PaginatedProfileApplicationListItem {
  data: ProfileApplicationListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

