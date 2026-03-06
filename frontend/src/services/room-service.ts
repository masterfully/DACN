import type { Room, Schedule, UsageHistory } from "@/types";
import apiClient from "./api-client";

export const roomService = {
  getRooms: () => apiClient.get<Room[]>("/rooms"),

  getScheduleBySection: (sectionId: number) =>
    apiClient.get<Schedule[]>(`/sections/${sectionId}/schedules`),

  getUsageHistory: (roomId: number) =>
    apiClient.get<UsageHistory[]>(`/rooms/${roomId}/usage-history`),
};
