import type { PaginatedData } from "@/types/api";
import type { Schedule } from "@/types/schedule";
import type {
  CreateSectionInput,
  GetMySectionsParams,
  GetSectionListParams,
  MySectionListItem,
  SectionDetail,
  SectionListItem,
  SectionStudent,
  UpdateSectionInput,
  UpdateSectionStatusInput,
  UpdateSectionVisibilityInput,
} from "@/types/section";
import apiClient, { paginatedFetcher } from "./api-client";
import { buildQuery } from "./utils";

export function getSectionListUrl(params: GetSectionListParams = {}): string {
  return `/sections${buildQuery(params)}`;
}

export function getMySectionsUrl(params: GetMySectionsParams = {}): string {
  return `/sections/my-sections${buildQuery(params)}`;
}

export function getSectionStudentsUrl(
  sectionId: number,
  params: { page?: number; limit?: number } = {},
): string {
  return `/sections/${sectionId}/students${buildQuery(params)}`;
}

export function getSectionSchedulesUrl(sectionId: number): string {
  return `/sections/${sectionId}/schedules`;
}

export async function getSectionList(
  params: GetSectionListParams = {},
): Promise<PaginatedData<SectionListItem>> {
  return paginatedFetcher<SectionListItem>(getSectionListUrl(params));
}

export async function getMySections(
  params: GetMySectionsParams = {},
): Promise<PaginatedData<MySectionListItem>> {
  return paginatedFetcher<MySectionListItem>(getMySectionsUrl(params));
}

export async function getSectionDetail(
  sectionId: number,
): Promise<SectionDetail> {
  const res = await apiClient.get<SectionDetail>(`/sections/${sectionId}`);
  return res.data as SectionDetail;
}

export async function getSectionStudents(
  sectionId: number,
  params: { page?: number; limit?: number } = {},
): Promise<PaginatedData<SectionStudent>> {
  return paginatedFetcher<SectionStudent>(
    getSectionStudentsUrl(sectionId, params),
  );
}

export async function getSectionSchedules(
  sectionId: number,
): Promise<Schedule[]> {
  const res = await apiClient.get<Schedule[]>(
    getSectionSchedulesUrl(sectionId),
  );
  return res.data as Schedule[];
}

export async function createSection(input: CreateSectionInput): Promise<null> {
  const res = await apiClient.post<null>("/sections", input);
  return res.data as null;
}

export async function updateSection(
  sectionId: number,
  input: UpdateSectionInput,
): Promise<{ sectionId: number; maxCapacity: number; status: number }> {
  const res = await apiClient.put<{
    sectionId: number;
    maxCapacity: number;
    status: number;
  }>(`/sections/${sectionId}`, input);
  return res.data as { sectionId: number; maxCapacity: number; status: number };
}

export async function updateSectionStatus(
  sectionId: number,
  input: UpdateSectionStatusInput,
): Promise<null> {
  const res = await apiClient.patch<null>(
    `/sections/${sectionId}/status`,
    input,
  );
  return res.data as null;
}

export async function updateSectionVisibility(
  sectionId: number,
  input: UpdateSectionVisibilityInput,
): Promise<null> {
  const res = await apiClient.patch<null>(
    `/sections/${sectionId}/visibility`,
    input,
  );
  return res.data as null;
}

export async function deleteSection(sectionId: number): Promise<null> {
  await apiClient.delete(`/sections/${sectionId}`);
  return null;
}
