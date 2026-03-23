import type { CertificateDetail } from "@/types/certificate";

/** Khớp `applicationId` hồ sơ PENDING trong `useMyApplicationsMock` (hooks/use-profile-applications.ts). */
export const MOCK_PROFILE_PENDING_APPLICATION_ID = 10;

/** Chứng chỉ mock hiển thị trên trang nộp hồ sơ (đính kèm hồ sơ đang chờ duyệt). */
export const MOCK_PROFILE_APPLICATION_CERTIFICATES: CertificateDetail[] = [
  {
    certificateId: 101,
    applicationId: MOCK_PROFILE_PENDING_APPLICATION_ID,
    certificateTypeId: 1,
    typeName: "IELTS Academic",
    score: 7.5,
    issueDate: "2024-06-01",
    expiryDate: "2026-06-01",
    evidenceURL: "https://example.com/mock-ielts.pdf",
  },
  {
    certificateId: 102,
    applicationId: MOCK_PROFILE_PENDING_APPLICATION_ID,
    certificateTypeId: 2,
    typeName: "TOEIC Listening & Reading",
    score: 850,
    issueDate: "2024-08-15",
    expiryDate: null,
    evidenceURL: null,
  },
  {
    certificateId: 103,
    applicationId: MOCK_PROFILE_PENDING_APPLICATION_ID,
    certificateTypeId: 3,
    typeName: "Chứng chỉ tin học MOS",
    score: null,
    issueDate: "2024-11-20",
    expiryDate: null,
    evidenceURL: "https://example.com/mock-mos.pdf",
  },
];
