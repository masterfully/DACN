import apiClient, { paginatedFetcher } from "./api-client";
import { buildQuery } from "./utils";
import type { PaginatedData } from "@/types/api";
import type {
  Registration,
  MyRegistration,
  RegistrationBySection,
  GetRegistrationListParams,
  GetMyRegistrationsParams,
  RegisterSectionInput,
} from "@/types/registration";

export function getRegistrationListUrl(params: GetRegistrationListParams = {}): string {
  return `/registrations${buildQuery(params)}`;
}

export function getMyRegistrationsUrl(params: GetMyRegistrationsParams = {}): string {
  return `/registrations/my-registrations${buildQuery(params)}`;
}

export function getRegistrationsBySectionUrl(
  sectionId: number,
  params: { page?: number; limit?: number } = {},
): string {
  return `/sections/${sectionId}/registrations${buildQuery(params)}`;
}

export async function getRegistrationList(
  params: GetRegistrationListParams = {},
): Promise<PaginatedData<Registration>> {
  return paginatedFetcher<Registration>(getRegistrationListUrl(params));
}

export async function getMyRegistrations(
  params: GetMyRegistrationsParams = {},
): Promise<PaginatedData<MyRegistration>> {
  return paginatedFetcher<MyRegistration>(getMyRegistrationsUrl(params));
}

export async function getRegistrationsBySection(
  sectionId: number,
  params: { page?: number; limit?: number } = {},
): Promise<PaginatedData<RegistrationBySection>> {
  return paginatedFetcher<RegistrationBySection>(
    getRegistrationsBySectionUrl(sectionId, params),
  );
}

export async function registerSection(
  input: RegisterSectionInput,
): Promise<null> {
  const res = await apiClient.post<null>("/registrations", input);
  return res.data as null;
}

export async function cancelRegistration(sectionId: number): Promise<null> {
  await apiClient.delete(`/registrations/${sectionId}`);
  return null;
}
