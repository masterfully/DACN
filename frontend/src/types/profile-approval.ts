export interface ProfileApplication {
  ApplicationID: number;
  StudentID: number;
  ApplicationStatus?: string;
  SubmissionDate?: string;
  ReviewedBy?: number;
  ReviewDate?: string;
  ReviewNotes?: string;
}

export interface CertificateType {
  CertificateTypeID: number;
  TypeName?: string;
  Description?: string;
}

export interface CertificateDetail {
  CertificateID: number;
  ApplicationID: number;
  CertificateTypeID: number;
  Score?: number;
  IssueDate?: string;
  ExpiryDate?: string;
  EvidenceURL?: string;
  Metadata?: Record<string, unknown>;
}
