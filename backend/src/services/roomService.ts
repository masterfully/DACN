import { prisma } from '../prisma/prismaClient';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler';

// Input schemas with Zod
export const createRoomSchema = z.object({
  roomName: z.string().min(1, 'Room name is required'),
  roomType: z.string().optional(),
  campus: z.string().optional(),
  capacity: z.number().int().min(1).optional(),
  status: z.string().optional(),
});

export const updateRoomSchema = z.object({
  roomName: z.string().optional(),
  roomType: z.string().optional(),
  campus: z.string().optional(),
  capacity: z.number().int().min(1).optional(),
  status: z.string().optional(),
}).refine(data => Object.values(data).some(Boolean), {
  message: 'At least one field must be provided for update',
});

export const listRoomsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  campus: z.string().optional(),
  roomType: z.string().optional(),
  status: z.string().optional(),
});

export const availableRoomsSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  capacity: z.coerce.number().int().min(1),
});

// Types
export interface ListRoomsMeta {
  page: number;
  limit: number;
  total: number;
}

// Service functions
export const listRooms = async (filters: z.infer<typeof listRoomsSchema>) => {
  const { page, limit, ...filter } = filters;
  const skip = (page - 1) * limit;

  const whereClause = Object.entries(filter).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key as keyof typeof filter] = value;
    }
    return acc;
  }, {} as any);

  const [rooms, total] = await Promise.all([
    prisma.room.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { RoomID: 'desc' },
    }),
    prisma.room.count({ where: whereClause }),
  ]);

  return { data: rooms, meta: { page, limit, total } as ListRoomsMeta };
};

export const createRoom = async (data: z.infer<typeof createRoomSchema>) => {
  // Check unique roomName
  const existing = await prisma.room.findUnique({ where: { RoomName: data.roomName } });
  if (existing) {
    throw new AppError('Room name already exists', {
      statusCode: 409,
      code: 'ROOM_NAME_EXISTS',
    });
  }

  return prisma.room.create({ data });
};

export const getRoom = async (roomId: number) => {
  const room = await prisma.room.findUnique({ where: { RoomID: roomId } });
  if (!room) {
    throw new AppError('Room not found', { statusCode: 404, code: 'ROOM_NOT_FOUND' });
  }
  return room;
};

export const updateRoom = async (roomId: number, data: z.infer<typeof updateRoomSchema>) => {
  const room = await getRoom(roomId); // Validates existence

  // Check unique if roomName changed
  if (data.roomName && data.roomName !== room.RoomName) {
    const existing = await prisma.room.findUnique({ where: { RoomName: data.roomName } });
    if (existing) {
      throw new AppError('Room name already exists', {
        statusCode: 409,
        code: 'ROOM_NAME_EXISTS',
      });
    }
  }

  return prisma.room.update({ where: { RoomID: roomId }, data });
};

export const deleteRoom = async (roomId: number) => {
  const room = await getRoom(roomId);

  // Guard: has active schedules
  const activeSchedules = await prisma.schedule.count({
    where: { RoomID: roomId },
  });
  if (activeSchedules > 0) {
    throw new AppError('Cannot delete room with active schedules', {
      statusCode: 409,
      code: 'ROOM_HAS_SCHEDULES',
    });
  }

  await prisma.room.delete({ where: { RoomID: roomId } });
};

export const getRoomSchedules = async (roomId: number) => {
  await getRoom(roomId); // Validate
  return prisma.schedule.findMany({
    where: { RoomID: roomId },
    include: { section: true },
    orderBy: { StartDate: 'asc' },
  });
};

export const getRoomUsageHistories = async (roomId: number) => {
  await getRoom(roomId); // Validate
  return prisma.usageHistory.findMany({
    where: { RoomID: roomId },
    include: { sectionUsageHistories: { include: { section: true } } },
    orderBy: { StartTime: 'desc' },
  });
};

export const getAvailableRooms = async (filters: z.infer<typeof availableRoomsSchema>) => {
  const { startDate, endDate, capacity } = filters;

  // Query rooms where NO schedule overlaps with [startDate, endDate] AND capacity >= required
  const rooms = await prisma.room.findMany({
    where: {
      Capacity: { gte: capacity },
      NOT: {
        schedules: {
          some: {
            AND: [
              { StartDate: { lte: new Date(endDate) } },
              { EndDate: { gte: new Date(startDate) } },
            ],
          },
        },
      },
    },
    orderBy: { Capacity: 'asc' },
  });

  return rooms;
};

