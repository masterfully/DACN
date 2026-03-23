"use client";

import * as React from "react";
import {
  cancelRegistration,
  getMyRegistrations,
  getMyRegistrationsUrl,
  getRegistrationList,
  getRegistrationListUrl,
  getRegistrationsBySection,
  getRegistrationsBySectionUrl,
  registerSection,
} from "@/services/registration-service";
import type { PaginatedData } from "@/types/api";
import type {
  GetMyRegistrationsParams,
  GetRegistrationListParams,
  MyRegistration,
  RegisterSectionInput,
  Registration,
  RegistrationBySection,
} from "@/types/registration";
import type { UseFetchResult } from "./use-fetch";
import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";

const MOCK_MY_REGISTRATIONS: MyRegistration[] = [
  {
    sectionId: 101,
    subjectName: "Lập trình hướng đối tượng",
    lecturerName: "TS. Lê Văn C",
    year: "2025-2026",
    status: 1,
  },
  {
    sectionId: 102,
    subjectName: "Cấu trúc dữ liệu và giải thuật",
    lecturerName: "ThS. Nguyễn Thị A",
    year: "2025-2026",
    status: 1,
  },
  {
    sectionId: 103,
    subjectName: "Cơ sở dữ liệu",
    lecturerName: "TS. Phạm Văn B",
    year: "2025-2026",
    status: 1,
  },
  {
    sectionId: 104,
    subjectName: "Mạng máy tính",
    lecturerName: "ThS. Trần Quốc D",
    year: "2025-2026",
    status: 1,
  },
  {
    sectionId: 105,
    subjectName: "Hệ điều hành",
    lecturerName: "TS. Võ Minh E",
    year: "2025-2026",
    status: 1,
  },
];

export function useRegistrationList(params: GetRegistrationListParams = {}) {
  return useFetchWithFetcher<PaginatedData<Registration>>(
    getRegistrationListUrl(params),
    () => getRegistrationList(params),
  );
}

export function useMyRegistrations(params: GetMyRegistrationsParams = {}) {
  return useFetchWithFetcher<PaginatedData<MyRegistration>>(
    getMyRegistrationsUrl(params),
    () => getMyRegistrations(params),
  );
}

export function useMyRegistrationsMock(
  params: GetMyRegistrationsParams = {},
): UseFetchResult<PaginatedData<MyRegistration>> {
  const [data, setData] = React.useState<PaginatedData<MyRegistration>>();
  const [isLoading, setIsLoading] = React.useState(true);

  const page = Math.max(1, params.page ?? 1);
  const limit = Math.max(1, params.limit ?? 10);

  const buildPageData = React.useCallback((): PaginatedData<MyRegistration> => {
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      items: MOCK_MY_REGISTRATIONS.slice(start, end),
      meta: {
        page,
        limit,
        total: MOCK_MY_REGISTRATIONS.length,
      },
    };
  }, [page, limit]);

  React.useEffect(() => {
    setIsLoading(true);
    const timer = window.setTimeout(() => {
      setData(buildPageData());
      setIsLoading(false);
    }, 200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [buildPageData]);

  const mutate = React.useCallback(async () => {
    const nextData = buildPageData();
    setData(nextData);
    return nextData;
  }, [buildPageData]);

  return {
    data,
    isLoading,
    isValidating: false,
    error: undefined,
    mutate,
  };
}

export function useRegistrationsBySection(
  sectionId?: number,
  params: { page?: number; limit?: number } = {},
) {
  return useFetchWithFetcher<PaginatedData<RegistrationBySection>>(
    sectionId ? getRegistrationsBySectionUrl(sectionId, params) : null,
    () => {
      if (sectionId === undefined) {
        throw new Error("sectionId is required");
      }
      return getRegistrationsBySection(sectionId, params);
    },
    { enabled: !!sectionId },
  );
}

export function useRegisterSection() {
  return useMutation<null, RegisterSectionInput>(
    "/registrations",
    registerSection,
  );
}

export function useCancelRegistration(sectionId: number) {
  return useMutation<null, void>(`/registrations/${sectionId}`, () =>
    cancelRegistration(sectionId),
  );
}
