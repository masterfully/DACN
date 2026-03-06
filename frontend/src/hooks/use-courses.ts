"use client";

import { courseService } from "@/services";
import type { Registration, Section, Subject } from "@/types";
import { type UseFetchOptions, useFetchWithFetcher } from "./use-fetch";
import { type UseMutationResult, useMutation } from "./use-mutation";

export function useSubjects(options: UseFetchOptions<Subject[]> = {}) {
  const key = "/subjects";
  return useFetchWithFetcher<Subject[]>(
    options.enabled === false ? null : key,
    async () => (await courseService.getSubjects()).data,
    options,
  );
}

export function useSections(
  semester?: number,
  year?: string,
  options: UseFetchOptions<Section[]> = {},
) {
  const key = `/sections?semester=${semester ?? ""}&year=${year ?? ""}`;
  return useFetchWithFetcher<Section[]>(
    options.enabled === false ? null : key,
    async () => (await courseService.getSections(semester, year)).data,
    options,
  );
}

export type RegisterSectionVariables = {
  sectionId: number;
  studentId: number;
};

export function useRegisterSection(): UseMutationResult<
  Registration,
  RegisterSectionVariables
> {
  return useMutation<Registration, RegisterSectionVariables>(
    "/registrations/register",
    async ({ sectionId, studentId }) =>
      (await courseService.register(sectionId, studentId)).data,
  );
}

export function useUnregisterSection(): UseMutationResult<
  unknown,
  RegisterSectionVariables
> {
  return useMutation<unknown, RegisterSectionVariables>(
    "/registrations/unregister",
    async ({ sectionId, studentId }) =>
      (await courseService.unregister(sectionId, studentId)).data,
  );
}
