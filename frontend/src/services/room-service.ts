import type { PaginatedData } from "@/types/api";
import type {
  CreateRoomInput,
  GetAvailableRoomsParams,
  GetRoomListParams,
  Room,
  UpdateRoomInput,
} from "@/types/room";
import type { Schedule } from "@/types/schedule";
import apiClient from "./api-client";
import { buildQuery } from "./utils";

type BackendRoom = {
  RoomID?: number;
  RoomName?: string;
  RoomType?: string | null;
  Campus?: string | null;
  Capacity?: number | null;
  Status?: string | null;
  // Some endpoints may already return camelCase
  roomId?: number;
  roomName?: string;
  roomType?: string | null;
  campus?: string | null;
  capacity?: number | null;
  status?: string | null;
};

function mapRoomFromBackend(input: BackendRoom): Room {
  return {
    roomId: input.roomId ?? input.RoomID ?? 0,
    roomName: input.roomName ?? input.RoomName ?? "",
    roomType: (input.roomType ?? input.RoomType ?? null) as Room["roomType"],
    campus: input.campus ?? input.Campus ?? null,
    capacity: input.capacity ?? input.Capacity ?? null,
    status: (input.status ?? input.Status ?? null) as Room["status"],
  };
}

export function getRoomListUrl(params: GetRoomListParams = {}): string {
  return `/rooms${buildQuery(params)}`;
}

export function getAvailableRoomsUrl(params: GetAvailableRoomsParams): string {
  return `/rooms/available${buildQuery(params)}`;
}

export function getRoomSchedulesUrl(
  roomId: number,
  params: { startDate?: string; endDate?: string } = {},
): string {
  return `/rooms/${roomId}/schedules${buildQuery(params)}`;
}

export async function getRoomList(
  params: GetRoomListParams = {},
): Promise<PaginatedData<Room>> {
  const res = await apiClient.get<BackendRoom[]>(getRoomListUrl(params));
  return {
    items: (res.data ?? []).map(mapRoomFromBackend),
    meta: (res as typeof res & { meta?: PaginatedData<Room>["meta"] }).meta ?? {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      total: 0,
    },
  };
}

export async function getRoomDetail(roomId: number): Promise<Room> {
  const res = await apiClient.get<BackendRoom>(`/rooms/${roomId}`);
  return mapRoomFromBackend(res.data as BackendRoom);
}

export async function getAvailableRooms(
  params: GetAvailableRoomsParams,
): Promise<Room[]> {
  const res = await apiClient.get<BackendRoom[]>(getAvailableRoomsUrl(params));
  return (res.data ?? []).map(mapRoomFromBackend);
}

export async function getRoomSchedules(
  roomId: number,
  params: { startDate?: string; endDate?: string } = {},
): Promise<Schedule[]> {
  const res = await apiClient.get<Schedule[]>(
    getRoomSchedulesUrl(roomId, params),
  );
  return (res.data ?? []) as Schedule[];
}

export async function createRoom(input: CreateRoomInput): Promise<Room> {
  const res = await apiClient.post<BackendRoom>("/rooms", input);
  return mapRoomFromBackend(res.data as BackendRoom);
}

export async function updateRoom(
  roomId: number,
  input: UpdateRoomInput,
): Promise<Room> {
  const res = await apiClient.put<BackendRoom>(`/rooms/${roomId}`, input);
  return mapRoomFromBackend(res.data as BackendRoom);
}

export async function deleteRoom(roomId: number): Promise<null> {
  await apiClient.delete(`/rooms/${roomId}`);
  return null;
}
