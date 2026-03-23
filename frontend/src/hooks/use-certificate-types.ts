"use client";

import * as React from "react";
import {
  createCertificateType,
  deleteCertificateType,
  getCertificateTypeDetail,
  getCertificateTypeList,
  getCertificateTypeListUrl,
  updateCertificateType,
} from "@/services/certificate-type-service";
import type { PaginatedData } from "@/types/api";
import type {
  CertificateType,
  CreateCertificateTypeInput,
  GetCertificateTypeListParams,
  UpdateCertificateTypeInput,
} from "@/types/certificate";
import type { UseFetchResult } from "./use-fetch";
import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";

export function useCertificateTypeList(
  params: GetCertificateTypeListParams = {},
) {
  return useFetchWithFetcher<PaginatedData<CertificateType>>(
    getCertificateTypeListUrl(params),
    () => getCertificateTypeList(params),
  );
}

export function useCertificateTypeDetail(typeId?: number) {
  return useFetchWithFetcher<CertificateType>(
    typeId ? `/certificate-types/${typeId}` : null,
    () => {
      if (typeId === undefined) {
        throw new Error("typeId is required");
      }
      return getCertificateTypeDetail(typeId);
    },
    { enabled: !!typeId },
  );
}

export function useCreateCertificateType() {
  return useMutation<CertificateType, CreateCertificateTypeInput>(
    "/certificate-types",
    createCertificateType,
  );
}

export function useUpdateCertificateType(typeId: number) {
  return useMutation<CertificateType, UpdateCertificateTypeInput>(
    `/certificate-types/${typeId}`,
    (input) => updateCertificateType(typeId, input),
  );
}

export function useDeleteCertificateType(typeId: number) {
  return useMutation<null, void>(`/certificate-types/${typeId}`, () =>
    deleteCertificateType(typeId),
  );
}

// --- Mock list hook (UI testing) ---

const MOCK_CERTIFICATE_TYPES: CertificateType[] = [
  {
    certificateTypeId: 1,
    typeName: "IELTS",
    description: "Chứng chỉ tiếng Anh quốc tế",
  },
  {
    certificateTypeId: 2,
    typeName: "TOEIC",
    description: "Đánh giá tiếng Anh trong môi trường công sở",
  },
  {
    certificateTypeId: 3,
    typeName: "HSK",
    description: "Chứng chỉ tiếng Trung",
  },
  {
    certificateTypeId: 4,
    typeName: "JLPT",
    description: "Năng lực tiếng Nhật",
  },
  {
    certificateTypeId: 5,
    typeName: "MOS",
    description: "Microsoft Office Specialist",
  },
];

function filterMockCertificateTypes(
  params: GetCertificateTypeListParams,
): CertificateType[] {
  const q = params.search?.trim().toLowerCase();
  if (!q) return [...MOCK_CERTIFICATE_TYPES];
  return MOCK_CERTIFICATE_TYPES.filter((t) =>
    t.typeName.toLowerCase().includes(q),
  );
}

function buildMockCertificateTypePage(
  items: CertificateType[],
  page: number,
  limit: number,
): PaginatedData<CertificateType> {
  const p = Math.max(1, page);
  const l = Math.max(1, limit);
  const start = (p - 1) * l;
  return {
    items: items.slice(start, start + l),
    meta: { page: p, limit: l, total: items.length },
  };
}

/** Mock of `useCertificateTypeList` for `/certificate-types`. */
export function useCertificateTypeListMock(
  params: GetCertificateTypeListParams = {},
): UseFetchResult<PaginatedData<CertificateType>> {
  const [data, setData] = React.useState<PaginatedData<CertificateType>>();
  const [isLoading, setIsLoading] = React.useState(true);

  const page = Math.max(1, params.page ?? 1);
  const limit = Math.max(1, params.limit ?? 10);
  const search = params.search;

  const filtered = React.useMemo(
    () => filterMockCertificateTypes({ search }),
    [search],
  );

  const build = React.useCallback(
    () => buildMockCertificateTypePage(filtered, page, limit),
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
