import type { Schedule } from "@/types/schedule";

export interface SectionListItem {
  sectionId: number;
  subjectId: number;
  subjectName: string;
  lecturerProfileId: number;
  lecturerName: string;
  year: string;
  enrollmentCount: number;
  maxCapacity: number;
  status: number;
  visibility: number;
}

export interface MySectionListItem {
  sectionId: number;
  subjectName: string;
  year: string;
  enrollmentCount: number;
  maxCapacity: number;
}

export interface SectionDetail extends SectionListItem {
  schedule: Schedule[];
}

export interface SectionStudent {
  profileId: number;
  fullName: string | null;
  email: string | null;
}

export interface GetSectionListParams {
  page?: number;
  limit?: number;
  search?: string;
  subjectId?: number;
  lecturerProfileId?: number;
  year?: string;
  status?: number;
  visibility?: number;
}

export interface GetMySectionsParams {
  page?: number;
  limit?: number;
  year?: string;
}

export interface CreateSectionInput {
  subjectId: number;
  lecturerProfileId: number;
  year: string;
  maxCapacity: number;
  status?: number;
  visibility?: number;
  schedule: CreateSectionScheduleItem[];
}

export interface CreateSectionScheduleItem {
  roomId: number;
  dayOfWeek: string;
  startPeriod: number;
  endPeriod: number;
  startDate: string;
  endDate: string;
}

export interface UpdateSectionInput {
  lecturerProfileId?: number;
  year?: string;
  maxCapacity?: number;
  status?: number;
  visibility?: number;
}

export interface UpdateSectionStatusInput {
  status: number;
}

export interface UpdateSectionVisibilityInput {
  visibility: number;
}
