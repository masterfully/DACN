"use client";

import { approvalService } from "@/services";
import type { CertificateDetail, ProfileApplication } from "@/types";
import { type UseFetchOptions, useFetchWithFetcher } from "./use-fetch";
import { type UseMutationResult, useMutation } from "./use-mutation";

export function useCertificates(
  applicationId: number | null | undefined,
  options: UseFetchOptions<CertificateDetail[]> = {},
) {
  const key = applicationId
    ? `/applications/${applicationId}/certificates`
    : null;
  return useFetchWithFetcher<CertificateDetail[]>(
    options.enabled === false ? null : key,
    async () =>
      (await approvalService.getCertificates(applicationId as number)).data,
    options,
  );
}

export function useSubmitApplication(): UseMutationResult<
  ProfileApplication,
  Partial<ProfileApplication>
> {
  return useMutation<ProfileApplication, Partial<ProfileApplication>>(
    "/applications/submit",
    async (data) => (await approvalService.submitApplication(data)).data,
  );
}

export type ReviewApplicationVariables = {
  id: number;
  status: "Approved" | "Rejected";
  notes: string;
};

export function useReviewApplication(): UseMutationResult<
  unknown,
  ReviewApplicationVariables
> {
  return useMutation<unknown, ReviewApplicationVariables>(
    "/applications/review",
    async ({ id, status, notes }) =>
      (await approvalService.reviewApplication(id, status, notes)).data,
  );
}
