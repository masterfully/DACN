"use client";

import { roomService } from "@/services";
import type { Room, Schedule, UsageHistory } from "@/types";
import { type UseFetchOptions, useFetchWithFetcher } from "./use-fetch";

export function useRooms(options: UseFetchOptions<Room[]> = {}) {
  const key = "/rooms";
  return useFetchWithFetcher<Room[]>(
    options.enabled === false ? null : key,
    async () => (await roomService.getRooms()).data,
    options,
  );
}

export function useScheduleBySection(
  sectionId: number | null | undefined,
  options: UseFetchOptions<Schedule[]> = {},
) {
  const key = sectionId ? `/sections/${sectionId}/schedules` : null;
  return useFetchWithFetcher<Schedule[]>(
    options.enabled === false ? null : key,
    async () =>
      (await roomService.getScheduleBySection(sectionId as number)).data,
    options,
  );
}

export function useUsageHistory(
  roomId: number | null | undefined,
  options: UseFetchOptions<UsageHistory[]> = {},
) {
  const key = roomId ? `/rooms/${roomId}/usage-history` : null;
  return useFetchWithFetcher<UsageHistory[]>(
    options.enabled === false ? null : key,
    async () =>
      (await roomService.getUsageHistory(roomId as number))
        .data as UsageHistory[],
    options,
  );
}
