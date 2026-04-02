import {
  profileApplicationDetailFromApi,
  profileApplicationFromApi,
} from "@/lib/profile-application-dto";
import type { PaginatedData } from "@/types/api";
import type {
  GetApplicationListParams,
  GetMyApplicationsParams,
  ProfileApplication,
  ProfileApplicationDetailModel,
  ReviewApplicationInput,
} from "@/types/profile-application";
import apiClient, { paginatedFetcher } from "./api-client";
import { buildQuery } from "./utils";

export function getApplicationListUrl(
  params: GetApplicationListParams = {},
): string {
  return `/profile-applications${buildQuery(params)}`;
}

export function getMyApplicationsUrl(
  params: GetMyApplicationsParams = {},
): string {
  return `/profile-applications/my-applications${buildQuery(params)}`;
}

export async function getApplicationList(
  params: GetApplicationListParams = {},
): Promise<PaginatedData<ProfileApplication>> {
  return paginatedFetcher<ProfileApplication>(getApplicationListUrl(params));
}

export async function getApplicationDetail(
  applicationId: number,
): Promise<ProfileApplicationDetailModel> {
  const res = await apiClient.get<unknown>(
    `/profile-applications/${applicationId}`,
  );
  return profileApplicationDetailFromApi(res.data);
}

export async function getMyApplications(
  params: GetMyApplicationsParams = {},
): Promise<PaginatedData<ProfileApplication>> {
  return paginatedFetcher<ProfileApplication>(getMyApplicationsUrl(params));
}

export async function submitApplication(): Promise<ProfileApplication> {
  const res = await apiClient.post<unknown>("/profile-applications", {});
  return profileApplicationFromApi(res.data);
}

export async function updateApplication(
  applicationId: number,
): Promise<ProfileApplication> {
  const res = await apiClient.put<unknown>(
    `/profile-applications/${applicationId}`,
    {},
  );
  return profileApplicationFromApi(res.data);
}

export async function reviewApplication(
  applicationId: number,
  input: ReviewApplicationInput,
): Promise<ProfileApplication> {
  const res = await apiClient.patch<unknown>(
    `/profile-applications/${applicationId}/review`,
    input,
  );
  return profileApplicationFromApi(res.data);
}
