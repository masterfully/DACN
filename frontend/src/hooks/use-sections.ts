"use client";

import {
  createSection,
  deleteSection,
  getMySections,
  getMySectionsUrl,
  getSectionDetail,
  getSectionList,
  getSectionListUrl,
  getSectionSchedules,
  getSectionSchedulesUrl,
  getSectionStudents,
  getSectionStudentsUrl,
  updateSection,
  updateSectionStatus,
  updateSectionVisibility,
} from "@/services/section-service";
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
import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";

export function useSectionList(params: GetSectionListParams = {}) {
  return useFetchWithFetcher<PaginatedData<SectionListItem>>(
    getSectionListUrl(params),
    () => getSectionList(params),
  );
}

export function useMySections(params: GetMySectionsParams = {}) {
  return useFetchWithFetcher<PaginatedData<MySectionListItem>>(
    getMySectionsUrl(params),
    () => getMySections(params),
  );
}

export function useSectionDetail(sectionId?: number) {
  return useFetchWithFetcher<SectionDetail>(
    sectionId ? `/sections/${sectionId}` : null,
    () => {
      if (sectionId === undefined) {
        throw new Error("sectionId is required");
      }
      return getSectionDetail(sectionId);
    },
    { enabled: !!sectionId },
  );
}

export function useSectionStudents(
  sectionId?: number,
  params: { page?: number; limit?: number } = {},
) {
  return useFetchWithFetcher<PaginatedData<SectionStudent>>(
    sectionId ? getSectionStudentsUrl(sectionId, params) : null,
    () => {
      if (sectionId === undefined) {
        throw new Error("sectionId is required");
      }
      return getSectionStudents(sectionId, params);
    },
    { enabled: !!sectionId },
  );
}

export function useSectionSchedules(sectionId?: number) {
  return useFetchWithFetcher<Schedule[]>(
    sectionId ? getSectionSchedulesUrl(sectionId) : null,
    () => {
      if (sectionId === undefined) {
        throw new Error("sectionId is required");
      }
      return getSectionSchedules(sectionId);
    },
    { enabled: !!sectionId },
  );
}

export function useCreateSection() {
  return useMutation<null, CreateSectionInput>("/sections", createSection);
}

export function useUpdateSection(sectionId: number) {
  return useMutation<
    { sectionId: number; maxCapacity: number; status: number },
    UpdateSectionInput
  >(`/sections/${sectionId}`, (input) => updateSection(sectionId, input));
}

export function useUpdateSectionStatus(sectionId: number) {
  return useMutation<null, UpdateSectionStatusInput>(
    `/sections/${sectionId}/status`,
    (input) => updateSectionStatus(sectionId, input),
  );
}

export function useUpdateSectionVisibility(sectionId: number) {
  return useMutation<null, UpdateSectionVisibilityInput>(
    `/sections/${sectionId}/visibility`,
    (input) => updateSectionVisibility(sectionId, input),
  );
}

export function useDeleteSection(sectionId: number) {
  return useMutation<null, void>(`/sections/${sectionId}/delete`, () =>
    deleteSection(sectionId),
  );
}
