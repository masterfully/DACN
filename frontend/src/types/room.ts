export type RoomType = "LECTURE" | "LAB";
export type RoomStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";

export interface Room {
  roomId: number;
  roomName: string;
  roomType: RoomType | null;
  campus: string | null;
  capacity: number | null;
  status: RoomStatus | null;
}

export interface GetRoomListParams {
  page?: number;
  limit?: number;
  search?: string;
  campus?: string;
  roomType?: RoomType;
  status?: RoomStatus;
  minCapacity?: number;
  maxCapacity?: number;
}

export interface GetAvailableRoomsParams {
  date: string;
  startPeriod: number;
  endPeriod: number;
  capacity?: number;
}

export interface CreateRoomInput {
  roomName: string;
  roomType: RoomType;
  campus: string;
  capacity: number;
  status?: RoomStatus;
}

export interface UpdateRoomInput {
  roomName?: string;
  roomType?: RoomType;
  campus?: string;
  capacity?: number;
  status?: RoomStatus;
}
