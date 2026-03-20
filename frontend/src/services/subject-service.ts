import type { PaginatedData } from "@/types/api";
import type {
  CreateSubjectInput,
  GetSubjectListParams,
  Subject,
  UpdateSubjectInput,
} from "@/types/subject";
import apiClient from "./api-client";
import { buildQuery } from "./utils";

type BackendSubject = {
  SubjectID?: number;
  SubjectName?: string;
  Periods?: number;
  subjectId?: number;
  subjectName?: string;
  periods?: number;
};

function mapSubjectFromBackend(input: BackendSubject): Subject {
  return {
    subjectId: input.subjectId ?? input.SubjectID ?? 0,
    subjectName: input.subjectName ?? input.SubjectName ?? "",
    periods: input.periods ?? input.Periods ?? 0,
  };
}

export function getSubjectListUrl(params: GetSubjectListParams = {}): string {
  return `/subjects${buildQuery(params)}`;
}

export async function getSubjectList(
  params: GetSubjectListParams = {},
): Promise<PaginatedData<Subject>> {
  const res = await apiClient.get<BackendSubject[]>(getSubjectListUrl(params));
  return {
    items: (res.data ?? []).map(mapSubjectFromBackend),
    meta: (res as typeof res & { meta?: PaginatedData<Subject>["meta"] })
      .meta ?? {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      total: 0,
    },
  };
}

export async function getSubjectDetail(subjectId: number): Promise<Subject> {
  const res = await apiClient.get<BackendSubject>(`/subjects/${subjectId}`);
  return mapSubjectFromBackend(res.data as BackendSubject);
}

export async function createSubject(
  input: CreateSubjectInput,
): Promise<Subject> {
  const res = await apiClient.post<BackendSubject>("/subjects", input);
  return mapSubjectFromBackend(res.data as BackendSubject);
}

export async function updateSubject(
  subjectId: number,
  input: UpdateSubjectInput,
): Promise<Subject> {
  const res = await apiClient.put<BackendSubject>(
    `/subjects/${subjectId}`,
    input,
  );
  return mapSubjectFromBackend(res.data as BackendSubject);
}

export async function deleteSubject(subjectId: number): Promise<null> {
  await apiClient.delete(`/subjects/${subjectId}`);
  return null;
}
