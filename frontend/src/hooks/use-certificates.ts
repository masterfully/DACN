"use client";

import * as React from "react";
import { MOCK_PROFILE_APPLICATION_CERTIFICATES } from "@/mocks/profile-application-certificates";
import {
  createCertificate,
  deleteCertificate,
  getCertificateDetail,
  getCertificateList,
  getCertificateListUrl,
  getCertificatesByApplication,
  getCertificatesByApplicationUrl,
  updateCertificate,
} from "@/services/certificate-service";
import type { PaginatedData } from "@/types/api";
import type {
  CertificateDetail,
  CreateCertificateInput,
  GetCertificateListParams,
  UpdateCertificateInput,
} from "@/types/certificate";
import type { UseFetchResult } from "./use-fetch";
import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";

export function useCertificateList(params: GetCertificateListParams = {}) {
  return useFetchWithFetcher<PaginatedData<CertificateDetail>>(
    getCertificateListUrl(params),
    () => getCertificateList(params),
  );
}

export function useCertificateDetail(certificateId?: number) {
  return useFetchWithFetcher<CertificateDetail>(
    certificateId ? `/certificates/${certificateId}` : null,
    () => {
      if (certificateId === undefined) {
        throw new Error("certificateId is required");
      }
      return getCertificateDetail(certificateId);
    },
    { enabled: !!certificateId },
  );
}

export function useCertificatesByApplication(applicationId?: number) {
  return useFetchWithFetcher<CertificateDetail[]>(
    applicationId ? getCertificatesByApplicationUrl(applicationId) : null,
    () => {
      if (applicationId === undefined) {
        throw new Error("applicationId is required");
      }
      return getCertificatesByApplication(applicationId);
    },
    { enabled: !!applicationId },
  );
}

export function useCreateCertificate() {
  return useMutation<CertificateDetail, CreateCertificateInput>(
    "/certificates",
    createCertificate,
  );
}

export function useUpdateCertificate(certificateId: number) {
  return useMutation<CertificateDetail, UpdateCertificateInput>(
    `/certificates/${certificateId}`,
    (input) => updateCertificate(certificateId, input),
  );
}

export function useDeleteCertificate(certificateId: number) {
  return useMutation<null, void>(`/certificates/${certificateId}`, () =>
    deleteCertificate(certificateId),
  );
}

// --- Mock list hooks (UI testing) ---

/** Admin list mock + hồ sơ khác (không trùng bộ mock trang nộp hồ sơ). */
const MOCK_CERTIFICATE_DETAILS: CertificateDetail[] = [
  ...MOCK_PROFILE_APPLICATION_CERTIFICATES,
  {
    certificateId: 3,
    applicationId: 11,
    certificateTypeId: 3,
    typeName: "HSK 4",
    score: 210,
    issueDate: "2023-12-01",
    expiryDate: null,
    evidenceURL: null,
  },
];

function filterMockCertificateList(
  params: GetCertificateListParams,
): CertificateDetail[] {
  let out = [...MOCK_CERTIFICATE_DETAILS];
  const q = params.search?.trim().toLowerCase();
  if (q) {
    out = out.filter((c) => (c.typeName ?? "").toLowerCase().includes(q));
  }
  if (params.certificateTypeId != null) {
    out = out.filter((c) => c.certificateTypeId === params.certificateTypeId);
  }
  return out;
}

function buildMockCertificatePage(
  items: CertificateDetail[],
  page: number,
  limit: number,
): PaginatedData<CertificateDetail> {
  const p = Math.max(1, page);
  const l = Math.max(1, limit);
  const start = (p - 1) * l;
  return {
    items: items.slice(start, start + l),
    meta: { page: p, limit: l, total: items.length },
  };
}

/** Mock of `useCertificateList` (admin `/certificates` nếu có). */
export function useCertificateListMock(
  params: GetCertificateListParams = {},
): UseFetchResult<PaginatedData<CertificateDetail>> {
  const [data, setData] = React.useState<PaginatedData<CertificateDetail>>();
  const [isLoading, setIsLoading] = React.useState(true);

  const page = Math.max(1, params.page ?? 1);
  const limit = Math.max(1, params.limit ?? 10);
  const search = params.search;
  const certificateTypeId = params.certificateTypeId;

  const filtered = React.useMemo(
    () => filterMockCertificateList({ search, certificateTypeId }),
    [search, certificateTypeId],
  );

  const build = React.useCallback(
    () => buildMockCertificatePage(filtered, page, limit),
    [filtered, page, limit],
  );

  React.useEffect(() => {
    setIsLoading(true);
    const t = window.setTimeout(() => {
      setData(build());
      setIsLoading(false);
    }, 200);
    return () => window.clearTimeout(t);
  }, [build]);

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

/** Mock of `useCertificatesByApplication` for `/profile-applications`. */
export function useCertificatesByApplicationMock(
  applicationId?: number,
): UseFetchResult<CertificateDetail[]> {
  const [data, setData] = React.useState<CertificateDetail[]>();
  const [isLoading, setIsLoading] = React.useState(!!applicationId);

  const build = React.useCallback(() => {
    if (applicationId === undefined) return undefined;
    return MOCK_CERTIFICATE_DETAILS.filter(
      (c) => c.applicationId === applicationId,
    );
  }, [applicationId]);

  React.useEffect(() => {
    if (applicationId === undefined) {
      setData(undefined);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const t = window.setTimeout(() => {
      setData(build() ?? []);
      setIsLoading(false);
    }, 200);
    return () => window.clearTimeout(t);
  }, [applicationId, build]);

  const mutate = React.useCallback(async () => {
    const next = build();
    setData(next ?? []);
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
