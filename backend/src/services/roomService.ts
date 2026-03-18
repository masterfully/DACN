import { prisma } from '../prisma/prismaClient';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler';
import { Prisma } from '@prisma/client';
import { ROOM_ERROR_CODES } from '../constants/errors/room/codes';
import {
  ROOM_ERROR_MESSAGES,
  ROOM_FIELD_ERROR_MESSAGES,
} from '../constants/errors/room/messages';

// Input schemas with Zod
const roomNameSchema = z
  .string({
    error: (issue) => {
      if (issue.input === undefined) {
        return ROOM_FIELD_ERROR_MESSAGES.ROOM_NAME_REQUIRED;
      }

      return ROOM_FIELD_ERROR_MESSAGES.ROOM_NAME_INVALID_TYPE;
    },
  })
  .trim()
  .min(1, ROOM_FIELD_ERROR_MESSAGES.ROOM_NAME_REQUIRED)
  .max(255, ROOM_FIELD_ERROR_MESSAGES.ROOM_NAME_MAX_LENGTH);
const optionalShortTextSchema = z
  .string()
  .trim()
  .min(1, ROOM_FIELD_ERROR_MESSAGES.SHORT_TEXT_REQUIRED)
  .max(255, ROOM_FIELD_ERROR_MESSAGES.SHORT_TEXT_MAX_LENGTH);
const roomStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE'], {
  error: ROOM_FIELD_ERROR_MESSAGES.STATUS_INVALID_OPTION,
});

export const createRoomSchema = z.object({
  roomName: roomNameSchema,
  roomType: optionalShortTextSchema.optional(),
  campus: optionalShortTextSchema.optional(),
  capacity: z.coerce
    .number()
    .int(ROOM_FIELD_ERROR_MESSAGES.CAPACITY_INVALID_INTEGER)
    .min(1, ROOM_FIELD_ERROR_MESSAGES.CAPACITY_INVALID_POSITIVE)
    .max(1000, ROOM_FIELD_ERROR_MESSAGES.CAPACITY_MAX)
    .optional(),
  status: roomStatusSchema.optional(),
}).strict();

export const updateRoomSchema = z.object({
  roomName: roomNameSchema.optional(),
  roomType: optionalShortTextSchema.optional(),
  campus: optionalShortTextSchema.optional(),
  capacity: z.coerce
    .number()
    .int(ROOM_FIELD_ERROR_MESSAGES.CAPACITY_INVALID_INTEGER)
    .min(1, ROOM_FIELD_ERROR_MESSAGES.CAPACITY_INVALID_POSITIVE)
    .max(1000, ROOM_FIELD_ERROR_MESSAGES.CAPACITY_MAX)
    .optional(),
  status: roomStatusSchema.optional(),
}).refine(data => Object.values(data).some(Boolean), {
  message: ROOM_FIELD_ERROR_MESSAGES.UPDATE_MIN_ONE_FIELD,
}).strict();

export const listRoomsSchema = z.object({
  page: z.coerce
    .number()
    .int(ROOM_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_INTEGER)
    .min(1, ROOM_FIELD_ERROR_MESSAGES.QUERY_PAGE_MIN)
    .default(1),
  limit: z.coerce
    .number()
    .int(ROOM_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_INTEGER)
    .min(1, ROOM_FIELD_ERROR_MESSAGES.QUERY_LIMIT_MIN)
    .max(100, ROOM_FIELD_ERROR_MESSAGES.QUERY_LIMIT_MAX)
    .default(10),
  campus: z.string().optional(),
  roomType: z.string().optional(),
  status: z.string().optional(),
});

export const availableRoomsSchema = z.object({
  startDate: z.string().datetime({ message: ROOM_FIELD_ERROR_MESSAGES.START_DATE_INVALID }),
  endDate: z.string().datetime({ message: ROOM_FIELD_ERROR_MESSAGES.END_DATE_INVALID }),
  capacity: z.coerce
    .number()
    .int(ROOM_FIELD_ERROR_MESSAGES.CAPACITY_INVALID_INTEGER)
    .min(1, ROOM_FIELD_ERROR_MESSAGES.CAPACITY_INVALID_POSITIVE),
});

// Types
export interface ListRoomsMeta {
  page: number;
  limit: number;
  total: number;
}

const buildRoomWhereClause = (
  filters: Omit<z.infer<typeof listRoomsSchema>, 'page' | 'limit'>,
): Prisma.RoomWhereInput => {
  const where: Prisma.RoomWhereInput = {};

  if (filters.campus !== undefined) {
    where.Campus = filters.campus;
  }

  if (filters.roomType !== undefined) {
    where.RoomType = filters.roomType;
  }

  if (filters.status !== undefined) {
    where.Status = filters.status;
  }

  return where;
};

const mapCreateRoomData = (data: z.infer<typeof createRoomSchema>): Prisma.RoomCreateInput => {
  return {
    RoomName: data.roomName,
    RoomType: data.roomType,
    Campus: data.campus,
    Capacity: data.capacity,
    Status: data.status,
  };
};

const mapUpdateRoomData = (data: z.infer<typeof updateRoomSchema>): Prisma.RoomUpdateInput => {
  const updateData: Prisma.RoomUpdateInput = {};

  if (data.roomName !== undefined) {
    updateData.RoomName = data.roomName;
  }

  if (data.roomType !== undefined) {
    updateData.RoomType = data.roomType;
  }

  if (data.campus !== undefined) {
    updateData.Campus = data.campus;
  }

  if (data.capacity !== undefined) {
    updateData.Capacity = data.capacity;
  }

  if (data.status !== undefined) {
    updateData.Status = data.status;
  }

  return updateData;
};

// Service functions
export const listRooms = async (filters: z.infer<typeof listRoomsSchema>) => {
  const { page, limit, ...filter } = filters;
  const skip = (page - 1) * limit;

  const whereClause = buildRoomWhereClause(filter);

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
  const existing = await prisma.room.findFirst({ where: { RoomName: data.roomName } });
  if (existing) {
    throw new AppError(ROOM_ERROR_MESSAGES.ROOM_CREATE_NAME_EXISTS, {
      statusCode: 409,
      code: ROOM_ERROR_CODES.ROOM_CREATE_NAME_EXISTS,
      details: {
        formErrors: [],
        fieldErrors: {
          roomName: [ROOM_FIELD_ERROR_MESSAGES.ROOM_NAME_EXISTS],
        },
      },
    });
  }

  return prisma.room.create({ data: mapCreateRoomData(data) });
};

export const getRoom = async (roomId: number) => {
  const room = await prisma.room.findUnique({ where: { RoomID: roomId } });
  if (!room) {
    throw new AppError(ROOM_ERROR_MESSAGES.ROOM_GET_NOT_FOUND, {
      statusCode: 404,
      code: ROOM_ERROR_CODES.ROOM_GET_NOT_FOUND,
    });
  }
  return room;
};

export const updateRoom = async (roomId: number, data: z.infer<typeof updateRoomSchema>) => {
  const room = await getRoom(roomId); // Validates existence

  // Check unique if roomName changed
  if (data.roomName && data.roomName !== room.RoomName) {
    const existing = await prisma.room.findFirst({
      where: {
        RoomName: data.roomName,
        NOT: { RoomID: roomId },
      },
    });
    if (existing) {
      throw new AppError(ROOM_ERROR_MESSAGES.ROOM_CREATE_NAME_EXISTS, {
        statusCode: 409,
        code: ROOM_ERROR_CODES.ROOM_CREATE_NAME_EXISTS,
        details: {
          formErrors: [],
          fieldErrors: {
            roomName: [ROOM_FIELD_ERROR_MESSAGES.ROOM_NAME_EXISTS],
          },
        },
      });
    }
  }

  return prisma.room.update({ where: { RoomID: roomId }, data: mapUpdateRoomData(data) });
};

export const deleteRoom = async (roomId: number) => {
  const room = await getRoom(roomId);

  // Guard: has active schedules
  const activeSchedules = await prisma.schedule.count({
    where: { RoomID: roomId },
  });
  if (activeSchedules > 0) {
    throw new AppError(ROOM_ERROR_MESSAGES.ROOM_DELETE_HAS_SCHEDULES, {
      statusCode: 409,
      code: ROOM_ERROR_CODES.ROOM_DELETE_HAS_SCHEDULES,
    });
  }

  await prisma.room.delete({ where: { RoomID: roomId } });

  return {
    roomId: room.RoomID,
    roomName: room.RoomName,
    deleted: true,
  };
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

