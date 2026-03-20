"use client";

import {
  createSubject,
  deleteSubject,
  getSubjectDetail,
  getSubjectList,
  getSubjectListUrl,
  updateSubject,
} from "@/services/subject-service";
import type { PaginatedData } from "@/types/api";
import type {
  CreateSubjectInput,
  GetSubjectListParams,
  Subject,
  UpdateSubjectInput,
} from "@/types/subject";
import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";

export function useSubjectList(params: GetSubjectListParams = {}) {
  return useFetchWithFetcher<PaginatedData<Subject>>(
    getSubjectListUrl(params),
    () => getSubjectList(params),
  );
}

export function useSubjectDetail(subjectId?: number) {
  return useFetchWithFetcher<Subject>(
    subjectId ? `/subjects/${subjectId}` : null,
    () => {
      if (!subjectId) {
        throw new Error("subjectId is required");
      }
      return getSubjectDetail(subjectId);
    },
    { enabled: !!subjectId },
  );
}

export function useCreateSubject() {
  return useMutation<Subject, CreateSubjectInput>("/subjects", createSubject);
}

export function useUpdateSubject(subjectId: number) {
  return useMutation<Subject, UpdateSubjectInput>(
    `/subjects/${subjectId}`,
    (input) => updateSubject(subjectId, input),
  );
}

export function useDeleteSubject(subjectId: number) {
  return useMutation<null, void>(`/subjects/${subjectId}`, () =>
    deleteSubject(subjectId),
  );
}
