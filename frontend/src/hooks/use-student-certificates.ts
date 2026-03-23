"use client";

import * as React from "react";
import {
  addCertificateToStudent,
  getStudentCertificates,
  getStudentCertificatesUrl,
  removeCertificateFromStudent,
} from "@/services/student-certificate-service";
import type { PaginatedData } from "@/types/api";
import type {
  AddCertificateToStudentInput,
  GetStudentCertificatesParams,
  StudentCertificate,
} from "@/types/certificate";
import type { UseFetchResult } from "./use-fetch";
import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";

export function useStudentCertificates(
  profileId?: number,
  params: GetStudentCertificatesParams = {},
) {
  return useFetchWithFetcher<PaginatedData<StudentCertificate>>(
    profileId ? getStudentCertificatesUrl(profileId, params) : null,
    () => {
      if (profileId === undefined) {
        throw new Error("profileId is required");
      }
      return getStudentCertificates(profileId, params);
    },
    { enabled: !!profileId },
  );
}

export function useAddCertificateToStudent(profileId: number) {
  return useMutation<
    { studentId: number; certificateId: number },
    AddCertificateToStudentInput
  >(`/profiles/${profileId}/certificates`, (input) =>
    addCertificateToStudent(profileId, input),
  );
}

export function useRemoveCertificateFromStudent(
  profileId: number,
  certificateId: number,
) {
  return useMutation<null, void>(
    `/profiles/${profileId}/certificates/${certificateId}`,
    () => removeCertificateFromStudent(profileId, certificateId),
  );
}

// --- Mock list hook (UI testing) ---

const MOCK_STUDENT_CERTIFICATES: StudentCertificate[] = [
  {
    certificateId: 1,
    typeName: "IELTS",
    score: 7.0,
    issueDate: "2024-05-01",
    expiryDate: "2026-05-01",
    evidenceURL: null,
  },
  {
    certificateId: 2,
    typeName: "TOEIC",
    score: 800,
    issueDate: "2024-07-10",
    expiryDate: null,
    evidenceURL: "https://example.com/toeic.pdf",
  },
];

function buildMockStudentCertPage(
  page: number,
  limit: number,
): PaginatedData<StudentCertificate> {
  const p = Math.max(1, page);
  const l = Math.max(1, limit);
  const start = (p - 1) * l;
  return {
    items: MOCK_STUDENT_CERTIFICATES.slice(start, start + l),
    meta: {
      page: p,
      limit: l,
      total: MOCK_STUDENT_CERTIFICATES.length,
    },
  };
}

/** Mock of `useStudentCertificates` for profile / student views. */
export function useStudentCertificatesMock(
  profileId?: number,
  params: GetStudentCertificatesParams = {},
): UseFetchResult<PaginatedData<StudentCertificate>> {
  const [data, setData] = React.useState<PaginatedData<StudentCertificate>>();
  const [isLoading, setIsLoading] = React.useState(!!profileId);

  const page = Math.max(1, params.page ?? 1);
  const limit = Math.max(1, params.limit ?? 10);

  const build = React.useCallback(
    () => buildMockStudentCertPage(page, limit),
    [page, limit],
  );

  React.useEffect(() => {
    if (profileId === undefined) {
      setData(undefined);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const t = window.setTimeout(() => {
      setData(build());
      setIsLoading(false);
    }, 200);
    return () => window.clearTimeout(t);
  }, [profileId, build]);

  const mutate = React.useCallback(async () => {
    const next = build();
    setData(next);
    return next;
  }, [build]);

  return {
    data,
    isLoading,
    isValidating: false,
    error: undefined,
    mutate,
  };
}
