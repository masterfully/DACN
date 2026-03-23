"use client";

import * as React from "react";
import {
  getApplicationDetail,
  getApplicationList,
  getApplicationListUrl,
  getMyApplications,
  getMyApplicationsUrl,
  reviewApplication,
  submitApplication,
  updateApplication,
} from "@/services/profile-application-service";
import type { PaginatedData } from "@/types/api";
import type {
  GetApplicationListParams,
  GetMyApplicationsParams,
  ProfileApplication,
  ReviewApplicationVariables,
} from "@/types/profile-application";
import type { UseFetchResult } from "./use-fetch";
import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";

export type UpdateApplicationVariables = { applicationId: number };

export function useApplicationList(params: GetApplicationListParams = {}) {
  return useFetchWithFetcher<PaginatedData<ProfileApplication>>(
    getApplicationListUrl(params),
    () => getApplicationList(params),
  );
}

export function useApplicationDetail(applicationId?: number) {
  return useFetchWithFetcher<ProfileApplication>(
    applicationId ? `/profile-applications/${applicationId}` : null,
    () => {
      if (applicationId === undefined) {
        throw new Error("applicationId is required");
      }
      return getApplicationDetail(applicationId);
    },
    { enabled: !!applicationId },
  );
}

export function useMyApplications(params: GetMyApplicationsParams = {}) {
  return useFetchWithFetcher<PaginatedData<ProfileApplication>>(
    getMyApplicationsUrl(params),
    () => getMyApplications(params),
  );
}

export function useSubmitApplication() {
  return useMutation<ProfileApplication, void>("/profile-applications", () =>
    submitApplication(),
  );
}

export function useUpdateApplication(applicationId: number) {
  return useMutation<ProfileApplication, void>(
    `/profile-applications/${applicationId}`,
    () => updateApplication(applicationId),
  );
}

/** Safe when `applicationId` is not known upfront (e.g. form after async load). */
export function useUpdateApplicationMutation() {
  return useMutation<ProfileApplication, UpdateApplicationVariables>(
    "/profile-applications/update",
    ({ applicationId }) => updateApplication(applicationId),
  );
}

/**
 * Use in admin approval table: one hook instance, pass `applicationId` per call.
 */
export function useReviewApplicationMutation() {
  return useMutation<ProfileApplication, ReviewApplicationVariables>(
    "/profile-applications/review",
    ({ applicationId, applicationStatus, reviewNotes }) =>
      reviewApplication(applicationId, { applicationStatus, reviewNotes }),
  );
}

// --- Mock list hooks (UI testing, no API calls) ---

const MOCK_APPLICATION_LIST: ProfileApplication[] = [
  {
    applicationId: 1,
    studentProfileId: 101,
    studentName: "Nguyễn Văn An",
    applicationStatus: "PENDING",
    submissionDate: "2025-03-01T08:00:00Z",
  },
  {
    applicationId: 2,
    studentProfileId: 102,
    studentName: "Trần Thị Bình",
    applicationStatus: "APPROVED",
    submissionDate: "2025-02-15T10:30:00Z",
    reviewedByProfileId: 1,
    reviewDate: "2025-02-16T14:00:00Z",
    reviewNotes: "Hồ sơ hợp lệ",
  },
  {
    applicationId: 3,
    studentProfileId: 103,
    studentName: "Lê Minh Cường",
    applicationStatus: "REJECTED",
    submissionDate: "2025-02-20T09:00:00Z",
    reviewDate: "2025-02-21T11:00:00Z",
    reviewNotes: "Thiếu minh chứng",
  },
  {
    applicationId: 4,
    studentProfileId: 104,
    studentName: "Phạm Thu Dung",
    applicationStatus: "PENDING",
    submissionDate: "2025-03-10T07:45:00Z",
  },
  {
    applicationId: 5,
    studentProfileId: 105,
    studentName: "Hoàng Văn Em",
    applicationStatus: "CANCELLED",
    submissionDate: "2025-01-05T12:00:00Z",
  },
];

const MOCK_MY_APPLICATIONS: ProfileApplication[] = [
  {
    applicationId: 10,
    applicationStatus: "PENDING",
    submissionDate: "2025-03-08T09:00:00Z",
  },
  {
    applicationId: 9,
    applicationStatus: "REJECTED",
    submissionDate: "2025-02-01T08:00:00Z",
    reviewDate: "2025-02-03T15:00:00Z",
    reviewNotes: "Vui lòng bổ sung chứng chỉ",
  },
];

function filterMockApplicationList(
  params: GetApplicationListParams,
): ProfileApplication[] {
  let out = [...MOCK_APPLICATION_LIST];
  const q = params.search?.trim().toLowerCase();
  if (q) {
    out = out.filter((a) => (a.studentName ?? "").toLowerCase().includes(q));
  }
  if (params.applicationStatus) {
    out = out.filter((a) => a.applicationStatus === params.applicationStatus);
  }
  const submissionFrom = params.submissionFrom;
  if (submissionFrom) {
    out = out.filter(
      (a) =>
        a.submissionDate && a.submissionDate.slice(0, 10) >= submissionFrom,
    );
  }
  const submissionTo = params.submissionTo;
  if (submissionTo) {
    out = out.filter(
      (a) => a.submissionDate && a.submissionDate.slice(0, 10) <= submissionTo,
    );
  }
  return out;
}

function buildMockPage<T>(
  items: T[],
  page: number,
  limit: number,
): PaginatedData<T> {
  const p = Math.max(1, page);
  const l = Math.max(1, limit);
  const start = (p - 1) * l;
  return {
    items: items.slice(start, start + l),
    meta: { page: p, limit: l, total: items.length },
  };
}

/** Mock of `useApplicationList` for `/approvals` and admin lists. */
export function useApplicationListMock(
  params: GetApplicationListParams = {},
): UseFetchResult<PaginatedData<ProfileApplication>> {
  const [data, setData] = React.useState<PaginatedData<ProfileApplication>>();
  const [isLoading, setIsLoading] = React.useState(true);

  const page = Math.max(1, params.page ?? 1);
  const limit = Math.max(1, params.limit ?? 10);
  const search = params.search;
  const applicationStatus = params.applicationStatus;
  const submissionFrom = params.submissionFrom;
  const submissionTo = params.submissionTo;

  const filtered = React.useMemo(
    () =>
      filterMockApplicationList({
        search,
        applicationStatus,
        submissionFrom,
        submissionTo,
      }),
    [search, applicationStatus, submissionFrom, submissionTo],
  );

  const build = React.useCallback(
    () => buildMockPage(filtered, page, limit),
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

/** Mock of `useMyApplications` for `/profile-applications`. */
export function useMyApplicationsMock(
  params: GetMyApplicationsParams = {},
): UseFetchResult<PaginatedData<ProfileApplication>> {
  const [data, setData] = React.useState<PaginatedData<ProfileApplication>>();
  const [isLoading, setIsLoading] = React.useState(true);

  const page = Math.max(1, params.page ?? 1);
  const limit = Math.max(1, params.limit ?? 10);

  const build = React.useCallback(
    () => buildMockPage(MOCK_MY_APPLICATIONS, page, limit),
    [page, limit],
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
