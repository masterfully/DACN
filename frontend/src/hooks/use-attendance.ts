"use client";

import { attendanceService } from "@/services";
import type { Attendance, AttendanceDetail } from "@/types";
import { type UseFetchOptions, useFetchWithFetcher } from "./use-fetch";
import { type UseMutationResult, useMutation } from "./use-mutation";

export function useAttendanceDetails(
  attendanceId: number | null | undefined,
  options: UseFetchOptions<AttendanceDetail[]> = {},
) {
  const key = attendanceId ? `/attendance/${attendanceId}/details` : null;
  return useFetchWithFetcher<AttendanceDetail[]>(
    options.enabled === false ? null : key,
    async () =>
      (await attendanceService.getDetails(attendanceId as number)).data,
    options,
  );
}

export function useCreateAttendanceSession(): UseMutationResult<
  Attendance,
  Partial<Attendance>
> {
  return useMutation<Attendance, Partial<Attendance>>(
    "/attendance/createSession",
    async (data) => (await attendanceService.createSession(data)).data,
  );
}

export type UpdateAttendanceStatusVariables = {
  detailId: number;
  status: string;
};

export function useUpdateAttendanceStatus(): UseMutationResult<
  unknown,
  UpdateAttendanceStatusVariables
> {
  return useMutation<unknown, UpdateAttendanceStatusVariables>(
    "/attendance-details/updateStatus",
    async ({ detailId, status }) =>
      (await attendanceService.updateStatus(detailId, status)).data,
  );
}
