"use client";

import { studentService } from "@/services";
import type { Lecturer, Student } from "@/types";
import { type UseFetchOptions, useFetchWithFetcher } from "./use-fetch";
import { type UseMutationResult, useMutation } from "./use-mutation";

function stableKeyFromParams(params?: Record<string, unknown>) {
  if (!params) return "";
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify(Object.fromEntries(entries));
}

export function useStudents(
  params?: Record<string, unknown>,
  options: UseFetchOptions<Student[]> = {},
) {
  const key = `/students${stableKeyFromParams(params) ? `?${stableKeyFromParams(params)}` : ""}`;
  return useFetchWithFetcher<Student[]>(
    options.enabled === false ? null : key,
    async () => (await studentService.getAll(params)).data,
    options,
  );
}

export function useStudent(
  id: number | null | undefined,
  options: UseFetchOptions<Student> = {},
) {
  const key = id ? `/students/${id}` : null;
  return useFetchWithFetcher<Student>(
    options.enabled === false ? null : key,
    async () => (await studentService.getById(id as number)).data,
    options,
  );
}

export function useLecturers(options: UseFetchOptions<Lecturer[]> = {}) {
  const key = "/lecturers";
  return useFetchWithFetcher<Lecturer[]>(
    options.enabled === false ? null : key,
    async () => (await studentService.getLecturers()).data,
    options,
  );
}

export type UpdateStudentProfileVariables = {
  id: number;
  data: Partial<Student>;
};

export function useUpdateStudentProfile(): UseMutationResult<
  Student,
  UpdateStudentProfileVariables
> {
  return useMutation<Student, UpdateStudentProfileVariables>(
    "/students/updateProfile",
    async ({ id, data }) => (await studentService.updateProfile(id, data)).data,
  );
}
