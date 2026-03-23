import { prisma } from '../prisma/prismaClient';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler';
import * as roomService from './roomService';
import {
  USAGE_ERROR_MESSAGES,
  USAGE_FIELD_ERROR_MESSAGES,
  USAGE_SUCCESS_MESSAGES,
} from '../constants/errors/usageHistory/messages';
import { USAGE_ERROR_CODES } from '../constants/errors/usageHistory/codes';

/* ============================================================
   VALIDATION SCHEMA
============================================================ */
const positiveInt = z.coerce.number().int().positive('ID phải là số nguyên dương');
const datetime = z.string().datetime('Thời gian không hợp lệ');
const noteSchema = z.string().max(255, 'Ghi chú tối đa 255 ký tự').optional();

export const createSchema = z
  .object({
    roomId: positiveInt,
    startTime: datetime,
    endTime: datetime,
    note: noteSchema,
  })
  .refine((d) => new Date(d.endTime) > new Date(d.startTime), {
    message: USAGE_FIELD_ERROR_MESSAGES.TIME_RANGE_INVALID,
    path: ['endTime'],
  });

export const updateSchema = z
  .object({
    startTime: datetime.optional(),
    endTime: datetime.optional(),
    note: noteSchema,
  })
  .refine((d) => Object.values(d).some((v) => v !== undefined), {
    message: USAGE_FIELD_ERROR_MESSAGES.UPDATE_MIN_ONE_FIELD,
  });

export const listSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  roomId: positiveInt.optional(),
});

/* ============================================================
   BUSINESS VALIDATION
============================================================ */
const checkTimeOverlap = async (
  tx: any,
  roomId: number,
  start: Date,
  end: Date,
  excludeId?: number
) => {
  const overlap = await tx.usageHistory.findFirst({
    where: {
      RoomID: roomId,
      ...(excludeId && { UsageHistoryID: { not: excludeId } }),
      AND: [{ StartTime: { lt: end } }, { EndTime: { gt: start } }],
    },
    select: { UsageHistoryID: true },
  });

  if (overlap) {
    throw new AppError(USAGE_ERROR_MESSAGES.USAGE_TIME_OVERLAP, {
      statusCode: 409,
      code: USAGE_ERROR_CODES.USAGE_TIME_OVERLAP,
    });
  }
};

/* ============================================================
   LIST USAGE HISTORIES
============================================================ */
export const listUsageHistories = async (filters: z.infer<typeof listSchema>) => {
  const { page, limit, roomId } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.UsageHistoryWhereInput = {
    ...(roomId && { RoomID: roomId }),
  };

  const [data, total] = await Promise.all([
    prisma.usageHistory.findMany({
      where,
      skip,
      take: limit,
      orderBy: { StartTime: 'desc' },
      select: {
        UsageHistoryID: true,
        RoomID: true,
        StartTime: true,
        EndTime: true,
        Note: true,
      },
    }),
    prisma.usageHistory.count({ where }),
  ]);

  return { data, meta: { page, limit, total } };
};

/* ============================================================
   GET DETAIL
============================================================ */
export const getUsageHistory = async (id: number) => {
  const data = await prisma.usageHistory.findUnique({
    where: { UsageHistoryID: id },
    include: {
      sectionUsageHistories: { include: { section: true } },
    },
  });

  if (!data) {
    throw new AppError(USAGE_ERROR_MESSAGES.USAGE_GET_NOT_FOUND, {
      statusCode: 404,
      code: USAGE_ERROR_CODES.USAGE_GET_NOT_FOUND,
    });
  }

  return data;
};

/* ============================================================
   CREATE USAGE HISTORY
============================================================ */
export const createUsageHistory = async (input: z.infer<typeof createSchema>) => {
  const start = new Date(input.startTime);
  const end = new Date(input.endTime);

  // ensure room exists
  await roomService.getRoom(input.roomId);

  return prisma.$transaction(async (tx) => {
    await checkTimeOverlap(tx, input.roomId, start, end);

    return tx.usageHistory.create({
      data: {
        RoomID: input.roomId,
        StartTime: start,
        EndTime: end,
        Note: input.note,
      },
    });
  });
};

/* ============================================================
   UPDATE USAGE HISTORY
============================================================ */
export const updateUsageHistory = async (id: number, input: z.infer<typeof updateSchema>) => {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.usageHistory.findUnique({ where: { UsageHistoryID: id } });

    if (!existing) {
      throw new AppError(USAGE_ERROR_MESSAGES.USAGE_UPDATE_NOT_FOUND, {
        statusCode: 404,
        code: USAGE_ERROR_CODES.USAGE_UPDATE_NOT_FOUND,
      });
    }

    const start = input.startTime ? new Date(input.startTime) : existing.StartTime;
    const end = input.endTime ? new Date(input.endTime) : existing.EndTime;

    if (end <= start) {
      throw new AppError(USAGE_FIELD_ERROR_MESSAGES.TIME_RANGE_INVALID, {
        statusCode: 400,
        code: USAGE_ERROR_CODES.USAGE_UPDATE_INVALID_INPUT,
      });
    }

    await checkTimeOverlap(tx, existing.RoomID, start, end, id);

    return tx.usageHistory.update({
      where: { UsageHistoryID: id },
      data: { StartTime: start, EndTime: end, Note: input.note },
    });
  });
};

/* ============================================================
   DELETE USAGE HISTORY
============================================================ */
export const deleteUsageHistory = async (id: number) => {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.usageHistory.findUnique({ where: { UsageHistoryID: id } });

    if (!existing) {
      throw new AppError(USAGE_ERROR_MESSAGES.USAGE_DELETE_NOT_FOUND, {
        statusCode: 404,
        code: USAGE_ERROR_CODES.USAGE_DELETE_NOT_FOUND,
      });
    }

    const linked = await tx.sectionUsageHistory.count({ where: { UsageHistoryID: id } });

    if (linked > 0) {
      throw new AppError(USAGE_ERROR_MESSAGES.USAGE_DELETE_HAS_SECTIONS, {
        statusCode: 409,
        code: USAGE_ERROR_CODES.USAGE_DELETE_HAS_SECTIONS,
      });
    }

    await tx.usageHistory.delete({ where: { UsageHistoryID: id } });

    return { deleted: true };
  });
};

/* ============================================================
   LINK SECTION
============================================================ */
export const linkSection = async (usageId: number, sectionId: number) => {
  return prisma.$transaction(async (tx) => {
    const usage = await tx.usageHistory.findUnique({ where: { UsageHistoryID: usageId } });
    if (!usage) {
      throw new AppError(USAGE_ERROR_MESSAGES.USAGE_GET_NOT_FOUND, {
        statusCode: 404,
        code: USAGE_ERROR_CODES.USAGE_GET_NOT_FOUND,
      });
    }

    const section = await tx.section.findUnique({ where: { SectionID: sectionId } });
    if (!section) {
      throw new AppError(USAGE_ERROR_MESSAGES.USAGE_LINK_SECTION_NOT_FOUND, {
        statusCode: 404,
        code: USAGE_ERROR_CODES.USAGE_LINK_SECTION_NOT_FOUND,
      });
    }

    const existed = await tx.sectionUsageHistory.findUnique({
      where: { UsageHistoryID_SectionID: { UsageHistoryID: usageId, SectionID: sectionId } },
    });

    if (existed) {
      throw new AppError(USAGE_ERROR_MESSAGES.USAGE_LINK_SECTION_EXISTS, {
        statusCode: 409,
        code: USAGE_ERROR_CODES.USAGE_LINK_SECTION_EXISTS,
      });
    }

    return tx.sectionUsageHistory.create({
      data: { UsageHistoryID: usageId, SectionID: sectionId },
    });
  });
};

/* ============================================================
   UNLINK SECTION
============================================================ */
export const unlinkSection = async (usageId: number, sectionId: number) => {
  return prisma.$transaction(async (tx) => {
    const deleted = await tx.sectionUsageHistory.deleteMany({
      where: { UsageHistoryID: usageId, SectionID: sectionId },
    });

    if (deleted.count === 0) {
      throw new AppError(USAGE_ERROR_MESSAGES.USAGE_UNLINK_SECTION_NOT_LINKED, {
        statusCode: 404,
        code: USAGE_ERROR_CODES.USAGE_UNLINK_SECTION_NOT_LINKED,
      });
    }

    return { unlinked: true };
  });
};