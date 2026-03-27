import type { Prisma, RoleEnum } from "@prisma/client";
import { z } from "zod";
import { SCHEDULE_ERROR_CODES } from "../constants/errors/schedule/codes";
import {
  SCHEDULE_ERROR_MESSAGES,
  SCHEDULE_FIELD_ERROR_MESSAGES,
} from "../constants/errors/schedule/messages";
import { AppError } from "../middleware/errorHandler";
import { prisma } from "../prisma/prismaClient";

const dayOfWeekValues = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

type DayOfWeek = (typeof dayOfWeekValues)[number];

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

const dayOfWeekSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim().toUpperCase() : value),
  z.enum(dayOfWeekValues, {
    error: SCHEDULE_FIELD_ERROR_MESSAGES.DAY_OF_WEEK_INVALID,
  }),
);

const parseDateOnlyToUtc = (value: string): Date => {
  return new Date(`${value}T00:00:00.000Z`);
};

const formatDateOnly = (value: Date): string => value.toISOString().slice(0, 10);

const formatDayOfWeek = (value: string): string =>
  `${value.charAt(0)}${value.slice(1).toLowerCase()}`;

const buildRoomConflictWhere = (params: {
  roomId: number;
  dayOfWeek: DayOfWeek;
  startDate: Date;
  endDate: Date;
  startPeriod: number;
  endPeriod: number;
  excludeScheduleId?: number;
}): Prisma.ScheduleWhereInput => {
  const where: Prisma.ScheduleWhereInput = {
    RoomID: params.roomId,
    DayOfWeek: params.dayOfWeek,
    StartDate: {
      lte: params.endDate,
    },
    EndDate: {
      gte: params.startDate,
    },
    StartPeriod: {
      lte: params.endPeriod,
    },
    EndPeriod: {
      gte: params.startPeriod,
    },
  };

  if (params.excludeScheduleId !== undefined) {
    where.NOT = {
      ScheduleID: params.excludeScheduleId,
    };
  }

  return where;
};

const buildDateRangeClauses = (
  startDate?: string,
  endDate?: string,
): Prisma.ScheduleWhereInput[] => {
  if (startDate && endDate) {
    const start = parseDateOnlyToUtc(startDate);
    const end = parseDateOnlyToUtc(endDate);
    return [
      {
        StartDate: {
          lte: end,
        },
      },
      {
        EndDate: {
          gte: start,
        },
      },
    ];
  }

  if (startDate) {
    const start = parseDateOnlyToUtc(startDate);
    return [
      {
        EndDate: {
          gte: start,
        },
      },
    ];
  }

  if (endDate) {
    const end = parseDateOnlyToUtc(endDate);
    return [
      {
        StartDate: {
          lte: end,
        },
      },
    ];
  }

  return [];
};

const assertRoomExists = async (
  roomId: number,
  options: { code: string; message: string },
): Promise<void> => {
  const room = await prisma.room.findUnique({
    where: {
      RoomID: roomId,
    },
    select: {
      RoomID: true,
    },
  });

  if (!room) {
    throw new AppError(options.message, {
      statusCode: 404,
      code: options.code,
      details: {
        formErrors: [options.message],
        fieldErrors: {},
      },
    });
  }
};

const assertSectionExists = async (
  sectionId: number,
  options: { code: string; message: string },
): Promise<void> => {
  const section = await prisma.section.findUnique({
    where: {
      SectionID: sectionId,
    },
    select: {
      SectionID: true,
    },
  });

  if (!section) {
    throw new AppError(options.message, {
      statusCode: 404,
      code: options.code,
      details: {
        formErrors: [options.message],
        fieldErrors: {},
      },
    });
  }
};

const assertNoRoomConflict = async (params: {
  roomId: number;
  dayOfWeek: DayOfWeek;
  startDate: Date;
  endDate: Date;
  startPeriod: number;
  endPeriod: number;
  excludeScheduleId?: number;
  errorCode: string;
  errorMessage: string;
}): Promise<void> => {
  const conflict = await prisma.schedule.findFirst({
    where: buildRoomConflictWhere(params),
    select: {
      ScheduleID: true,
    },
  });

  if (conflict) {
    throw new AppError(params.errorMessage, {
      statusCode: 409,
      code: params.errorCode,
      details: {
        formErrors: [params.errorMessage],
        fieldErrors: {},
      },
    });
  }
};

const validateMergedScheduleData = (input: {
  startPeriod: number;
  endPeriod: number;
  totalPeriods: number;
  startDate: Date;
  endDate: Date;
}): void => {
  if (input.endPeriod < input.startPeriod) {
    throw new AppError(SCHEDULE_ERROR_MESSAGES.SCHEDULE_UPDATE_INVALID_INPUT, {
      statusCode: 400,
      code: SCHEDULE_ERROR_CODES.SCHEDULE_UPDATE_INVALID_INPUT,
      details: {
        formErrors: [],
        fieldErrors: {
          endPeriod: [SCHEDULE_FIELD_ERROR_MESSAGES.PERIOD_RANGE_INVALID],
        },
      },
    });
  }

  if (input.endDate < input.startDate) {
    throw new AppError(SCHEDULE_ERROR_MESSAGES.SCHEDULE_UPDATE_INVALID_INPUT, {
      statusCode: 400,
      code: SCHEDULE_ERROR_CODES.SCHEDULE_UPDATE_INVALID_INPUT,
      details: {
        formErrors: [],
        fieldErrors: {
          endDate: [SCHEDULE_FIELD_ERROR_MESSAGES.DATE_RANGE_INVALID],
        },
      },
    });
  }

  const expectedTotalPeriods = input.endPeriod - input.startPeriod + 1;
  if (input.totalPeriods !== expectedTotalPeriods) {
    throw new AppError(SCHEDULE_ERROR_MESSAGES.SCHEDULE_UPDATE_INVALID_INPUT, {
      statusCode: 400,
      code: SCHEDULE_ERROR_CODES.SCHEDULE_UPDATE_INVALID_INPUT,
      details: {
        formErrors: [],
        fieldErrors: {
          totalPeriods: [SCHEDULE_FIELD_ERROR_MESSAGES.TOTAL_PERIODS_MISMATCH],
        },
      },
    });
  }
};

export const getSchedulesQuerySchema = z
  .object({
    page: z.coerce
      .number()
      .int(SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_INTEGER)
      .positive(SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_POSITIVE)
      .default(1),
    limit: z.coerce
      .number()
      .int(SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_INTEGER)
      .positive(SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_POSITIVE)
      .max(100, SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_MAX)
      .default(10),
    roomId: z.coerce
      .number({
        error: SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_ROOM_ID_INVALID,
      })
      .int(SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_ROOM_ID_INVALID)
      .positive(SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_ROOM_ID_INVALID)
      .optional(),
    sectionId: z.coerce
      .number({
        error: SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_SECTION_ID_INVALID,
      })
      .int(SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_SECTION_ID_INVALID)
      .positive(SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_SECTION_ID_INVALID)
      .optional(),
    dayOfWeek: dayOfWeekSchema.optional(),
    startDate: z
      .string({
        error: SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_START_DATE_INVALID,
      })
      .trim()
      .regex(dateOnlyRegex, SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_START_DATE_INVALID)
      .optional(),
    endDate: z
      .string({
        error: SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_END_DATE_INVALID,
      })
      .trim()
      .regex(dateOnlyRegex, SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_END_DATE_INVALID)
      .optional(),
  })
  .superRefine((input, ctx) => {
    if (input.startDate && input.endDate && input.endDate < input.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_DATE_RANGE_INVALID,
      });
    }
  });

export const createScheduleSchema = z
  .object({
    roomId: z.coerce
      .number({
        error: (issue) =>
          issue.input === undefined
            ? SCHEDULE_FIELD_ERROR_MESSAGES.ROOM_ID_REQUIRED
            : SCHEDULE_FIELD_ERROR_MESSAGES.ROOM_ID_INVALID,
      })
      .int(SCHEDULE_FIELD_ERROR_MESSAGES.ROOM_ID_INVALID)
      .positive(SCHEDULE_FIELD_ERROR_MESSAGES.ROOM_ID_INVALID),
    sectionId: z.coerce
      .number({
        error: (issue) =>
          issue.input === undefined
            ? SCHEDULE_FIELD_ERROR_MESSAGES.SECTION_ID_REQUIRED
            : SCHEDULE_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID,
      })
      .int(SCHEDULE_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID)
      .positive(SCHEDULE_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID),
    dayOfWeek: z.preprocess(
      (value) => (typeof value === "string" ? value.trim().toUpperCase() : value),
      z.enum(dayOfWeekValues, {
        error: (issue) =>
          issue.input === undefined
            ? SCHEDULE_FIELD_ERROR_MESSAGES.DAY_OF_WEEK_REQUIRED
            : SCHEDULE_FIELD_ERROR_MESSAGES.DAY_OF_WEEK_INVALID,
      }),
    ),
    startPeriod: z.coerce
      .number({
        error: (issue) =>
          issue.input === undefined
            ? SCHEDULE_FIELD_ERROR_MESSAGES.START_PERIOD_REQUIRED
            : SCHEDULE_FIELD_ERROR_MESSAGES.START_PERIOD_INVALID,
      })
      .int(SCHEDULE_FIELD_ERROR_MESSAGES.START_PERIOD_INVALID)
      .positive(SCHEDULE_FIELD_ERROR_MESSAGES.START_PERIOD_INVALID),
    endPeriod: z.coerce
      .number({
        error: (issue) =>
          issue.input === undefined
            ? SCHEDULE_FIELD_ERROR_MESSAGES.END_PERIOD_REQUIRED
            : SCHEDULE_FIELD_ERROR_MESSAGES.END_PERIOD_INVALID,
      })
      .int(SCHEDULE_FIELD_ERROR_MESSAGES.END_PERIOD_INVALID)
      .positive(SCHEDULE_FIELD_ERROR_MESSAGES.END_PERIOD_INVALID),
    totalPeriods: z.coerce
      .number({
        error: (issue) =>
          issue.input === undefined
            ? SCHEDULE_FIELD_ERROR_MESSAGES.TOTAL_PERIODS_REQUIRED
            : SCHEDULE_FIELD_ERROR_MESSAGES.TOTAL_PERIODS_INVALID,
      })
      .int(SCHEDULE_FIELD_ERROR_MESSAGES.TOTAL_PERIODS_INVALID)
      .positive(SCHEDULE_FIELD_ERROR_MESSAGES.TOTAL_PERIODS_INVALID),
    startDate: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? SCHEDULE_FIELD_ERROR_MESSAGES.START_DATE_REQUIRED
            : SCHEDULE_FIELD_ERROR_MESSAGES.START_DATE_INVALID,
      })
      .trim()
      .regex(dateOnlyRegex, SCHEDULE_FIELD_ERROR_MESSAGES.START_DATE_INVALID),
    endDate: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? SCHEDULE_FIELD_ERROR_MESSAGES.END_DATE_REQUIRED
            : SCHEDULE_FIELD_ERROR_MESSAGES.END_DATE_INVALID,
      })
      .trim()
      .regex(dateOnlyRegex, SCHEDULE_FIELD_ERROR_MESSAGES.END_DATE_INVALID),
  })
  .superRefine((input, ctx) => {
    if (input.endPeriod < input.startPeriod) {
      ctx.addIssue({
        code: "custom",
        path: ["endPeriod"],
        message: SCHEDULE_FIELD_ERROR_MESSAGES.PERIOD_RANGE_INVALID,
      });
    }

    if (input.endDate < input.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: SCHEDULE_FIELD_ERROR_MESSAGES.DATE_RANGE_INVALID,
      });
    }

    const expectedTotalPeriods = input.endPeriod - input.startPeriod + 1;
    if (input.totalPeriods !== expectedTotalPeriods) {
      ctx.addIssue({
        code: "custom",
        path: ["totalPeriods"],
        message: SCHEDULE_FIELD_ERROR_MESSAGES.TOTAL_PERIODS_MISMATCH,
      });
    }
  });

export const updateScheduleSchema = z
  .object({
    roomId: z.coerce
      .number({
        error: SCHEDULE_FIELD_ERROR_MESSAGES.ROOM_ID_INVALID,
      })
      .int(SCHEDULE_FIELD_ERROR_MESSAGES.ROOM_ID_INVALID)
      .positive(SCHEDULE_FIELD_ERROR_MESSAGES.ROOM_ID_INVALID)
      .optional(),
    dayOfWeek: dayOfWeekSchema.optional(),
    startPeriod: z.coerce
      .number({
        error: SCHEDULE_FIELD_ERROR_MESSAGES.START_PERIOD_INVALID,
      })
      .int(SCHEDULE_FIELD_ERROR_MESSAGES.START_PERIOD_INVALID)
      .positive(SCHEDULE_FIELD_ERROR_MESSAGES.START_PERIOD_INVALID)
      .optional(),
    endPeriod: z.coerce
      .number({
        error: SCHEDULE_FIELD_ERROR_MESSAGES.END_PERIOD_INVALID,
      })
      .int(SCHEDULE_FIELD_ERROR_MESSAGES.END_PERIOD_INVALID)
      .positive(SCHEDULE_FIELD_ERROR_MESSAGES.END_PERIOD_INVALID)
      .optional(),
    totalPeriods: z.coerce
      .number({
        error: SCHEDULE_FIELD_ERROR_MESSAGES.TOTAL_PERIODS_INVALID,
      })
      .int(SCHEDULE_FIELD_ERROR_MESSAGES.TOTAL_PERIODS_INVALID)
      .positive(SCHEDULE_FIELD_ERROR_MESSAGES.TOTAL_PERIODS_INVALID)
      .optional(),
    startDate: z
      .string({
        error: SCHEDULE_FIELD_ERROR_MESSAGES.START_DATE_INVALID,
      })
      .trim()
      .regex(dateOnlyRegex, SCHEDULE_FIELD_ERROR_MESSAGES.START_DATE_INVALID)
      .optional(),
    endDate: z
      .string({
        error: SCHEDULE_FIELD_ERROR_MESSAGES.END_DATE_INVALID,
      })
      .trim()
      .regex(dateOnlyRegex, SCHEDULE_FIELD_ERROR_MESSAGES.END_DATE_INVALID)
      .optional(),
  })
  .superRefine((input, ctx) => {
    if (!Object.values(input).some((value) => value !== undefined)) {
      ctx.addIssue({
        code: "custom",
        path: ["body"],
        message: SCHEDULE_FIELD_ERROR_MESSAGES.UPDATE_MIN_ONE_FIELD,
      });
    }

    if (
      input.startPeriod !== undefined &&
      input.endPeriod !== undefined &&
      input.endPeriod < input.startPeriod
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endPeriod"],
        message: SCHEDULE_FIELD_ERROR_MESSAGES.PERIOD_RANGE_INVALID,
      });
    }

    if (
      input.startDate !== undefined &&
      input.endDate !== undefined &&
      input.endDate < input.startDate
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: SCHEDULE_FIELD_ERROR_MESSAGES.DATE_RANGE_INVALID,
      });
    }
  });

export const getMyScheduleQuerySchema = z
  .object({
    sectionId: z.coerce
      .number({
        error: SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_SECTION_ID_INVALID,
      })
      .int(SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_SECTION_ID_INVALID)
      .positive(SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_SECTION_ID_INVALID)
      .optional(),
    roomId: z.coerce
      .number({
        error: SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_ROOM_ID_INVALID,
      })
      .int(SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_ROOM_ID_INVALID)
      .positive(SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_ROOM_ID_INVALID)
      .optional(),
    dayOfWeek: dayOfWeekSchema.optional(),
    startDate: z
      .string({
        error: SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_START_DATE_INVALID,
      })
      .trim()
      .regex(dateOnlyRegex, SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_START_DATE_INVALID)
      .optional(),
    endDate: z
      .string({
        error: SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_END_DATE_INVALID,
      })
      .trim()
      .regex(dateOnlyRegex, SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_END_DATE_INVALID)
      .optional(),
  })
  .superRefine((input, ctx) => {
    if (input.startDate && input.endDate && input.endDate < input.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: SCHEDULE_FIELD_ERROR_MESSAGES.QUERY_DATE_RANGE_INVALID,
      });
    }
  });

type GetSchedulesQueryInput = z.infer<typeof getSchedulesQuerySchema>;
type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
type GetMyScheduleQueryInput = z.infer<typeof getMyScheduleQuerySchema>;

const buildBaseScheduleQueryClauses = (
  input: {
    sectionId?: number;
    roomId?: number;
    dayOfWeek?: DayOfWeek;
    startDate?: string;
    endDate?: string;
  },
): Prisma.ScheduleWhereInput[] => {
  const clauses: Prisma.ScheduleWhereInput[] = [];

  if (input.sectionId !== undefined) {
    clauses.push({ SectionID: input.sectionId });
  }

  if (input.roomId !== undefined) {
    clauses.push({ RoomID: input.roomId });
  }

  if (input.dayOfWeek !== undefined) {
    clauses.push({ DayOfWeek: input.dayOfWeek });
  }

  clauses.push(...buildDateRangeClauses(input.startDate, input.endDate));
  return clauses;
};

export const getSchedules = async (input: GetSchedulesQueryInput) => {
  const skip = (input.page - 1) * input.limit;
  const clauses = buildBaseScheduleQueryClauses(input);
  const where: Prisma.ScheduleWhereInput =
    clauses.length > 0 ? { AND: clauses } : {};

  const [schedules, total] = await Promise.all([
    prisma.schedule.findMany({
      where,
      skip,
      take: input.limit,
      orderBy: [{ StartDate: "asc" }, { StartPeriod: "asc" }],
      select: {
        ScheduleID: true,
        RoomID: true,
        SectionID: true,
        DayOfWeek: true,
        StartPeriod: true,
        EndPeriod: true,
        TotalPeriods: true,
        StartDate: true,
        EndDate: true,
        room: {
          select: {
            RoomName: true,
          },
        },
        section: {
          select: {
            subject: {
              select: {
                SubjectName: true,
              },
            },
          },
        },
      },
    }),
    prisma.schedule.count({ where }),
  ]);

  return {
    schedules: schedules.map((schedule) => ({
      scheduleId: schedule.ScheduleID,
      roomId: schedule.RoomID,
      roomName: schedule.room.RoomName,
      sectionId: schedule.SectionID,
      subjectName: schedule.section.subject.SubjectName,
      dayOfWeek: formatDayOfWeek(schedule.DayOfWeek),
      startPeriod: schedule.StartPeriod,
      endPeriod: schedule.EndPeriod,
      totalPeriods: schedule.TotalPeriods,
      startDate: formatDateOnly(schedule.StartDate),
      endDate: formatDateOnly(schedule.EndDate),
    })),
    total,
  };
};

export const createSchedule = async (input: CreateScheduleInput): Promise<void> => {
  const startDate = parseDateOnlyToUtc(input.startDate);
  const endDate = parseDateOnlyToUtc(input.endDate);

  await Promise.all([
    assertSectionExists(input.sectionId, {
      code: SCHEDULE_ERROR_CODES.SCHEDULE_CREATE_SECTION_NOT_FOUND,
      message: SCHEDULE_ERROR_MESSAGES.SCHEDULE_CREATE_SECTION_NOT_FOUND,
    }),
    assertRoomExists(input.roomId, {
      code: SCHEDULE_ERROR_CODES.SCHEDULE_CREATE_ROOM_NOT_FOUND,
      message: SCHEDULE_ERROR_MESSAGES.SCHEDULE_CREATE_ROOM_NOT_FOUND,
    }),
  ]);

  await assertNoRoomConflict({
    roomId: input.roomId,
    dayOfWeek: input.dayOfWeek,
    startDate,
    endDate,
    startPeriod: input.startPeriod,
    endPeriod: input.endPeriod,
    errorCode: SCHEDULE_ERROR_CODES.SCHEDULE_CREATE_ROOM_CONFLICT,
    errorMessage: SCHEDULE_ERROR_MESSAGES.SCHEDULE_CREATE_ROOM_CONFLICT,
  });

  await prisma.schedule.create({
    data: {
      RoomID: input.roomId,
      SectionID: input.sectionId,
      DayOfWeek: input.dayOfWeek,
      StartPeriod: input.startPeriod,
      EndPeriod: input.endPeriod,
      TotalPeriods: input.totalPeriods,
      StartDate: startDate,
      EndDate: endDate,
    },
  });
};

export const getScheduleDetail = async (scheduleId: number) => {
  const schedule = await prisma.schedule.findUnique({
    where: {
      ScheduleID: scheduleId,
    },
    select: {
      ScheduleID: true,
      RoomID: true,
      SectionID: true,
      DayOfWeek: true,
      StartPeriod: true,
      EndPeriod: true,
      TotalPeriods: true,
      StartDate: true,
      EndDate: true,
      room: {
        select: {
          RoomName: true,
        },
      },
      section: {
        select: {
          subject: {
            select: {
              SubjectName: true,
            },
          },
        },
      },
    },
  });

  if (!schedule) {
    throw new AppError(SCHEDULE_ERROR_MESSAGES.SCHEDULE_GET_NOT_FOUND, {
      statusCode: 404,
      code: SCHEDULE_ERROR_CODES.SCHEDULE_GET_NOT_FOUND,
      details: {
        formErrors: [SCHEDULE_ERROR_MESSAGES.SCHEDULE_GET_NOT_FOUND],
        fieldErrors: {},
      },
    });
  }

  return {
    scheduleId: schedule.ScheduleID,
    roomId: schedule.RoomID,
    roomName: schedule.room.RoomName,
    sectionId: schedule.SectionID,
    subjectName: schedule.section.subject.SubjectName,
    dayOfWeek: formatDayOfWeek(schedule.DayOfWeek),
    startPeriod: schedule.StartPeriod,
    endPeriod: schedule.EndPeriod,
    totalPeriods: schedule.TotalPeriods,
    startDate: formatDateOnly(schedule.StartDate),
    endDate: formatDateOnly(schedule.EndDate),
  };
};

export const updateSchedule = async (
  scheduleId: number,
  input: UpdateScheduleInput,
) => {
  const current = await prisma.schedule.findUnique({
    where: {
      ScheduleID: scheduleId,
    },
    select: {
      ScheduleID: true,
      RoomID: true,
      DayOfWeek: true,
      StartPeriod: true,
      EndPeriod: true,
      TotalPeriods: true,
      StartDate: true,
      EndDate: true,
    },
  });

  if (!current) {
    throw new AppError(SCHEDULE_ERROR_MESSAGES.SCHEDULE_UPDATE_NOT_FOUND, {
      statusCode: 404,
      code: SCHEDULE_ERROR_CODES.SCHEDULE_UPDATE_NOT_FOUND,
      details: {
        formErrors: [SCHEDULE_ERROR_MESSAGES.SCHEDULE_UPDATE_NOT_FOUND],
        fieldErrors: {},
      },
    });
  }

  const merged = {
    roomId: input.roomId ?? current.RoomID,
    dayOfWeek: input.dayOfWeek ?? (current.DayOfWeek as DayOfWeek),
    startPeriod: input.startPeriod ?? current.StartPeriod,
    endPeriod: input.endPeriod ?? current.EndPeriod,
    totalPeriods: input.totalPeriods ?? current.TotalPeriods,
    startDate: input.startDate ? parseDateOnlyToUtc(input.startDate) : current.StartDate,
    endDate: input.endDate ? parseDateOnlyToUtc(input.endDate) : current.EndDate,
  };

  validateMergedScheduleData({
    startPeriod: merged.startPeriod,
    endPeriod: merged.endPeriod,
    totalPeriods: merged.totalPeriods,
    startDate: merged.startDate,
    endDate: merged.endDate,
  });

  await assertRoomExists(merged.roomId, {
    code: SCHEDULE_ERROR_CODES.SCHEDULE_UPDATE_ROOM_NOT_FOUND,
    message: SCHEDULE_ERROR_MESSAGES.SCHEDULE_UPDATE_ROOM_NOT_FOUND,
  });

  await assertNoRoomConflict({
    roomId: merged.roomId,
    dayOfWeek: merged.dayOfWeek,
    startDate: merged.startDate,
    endDate: merged.endDate,
    startPeriod: merged.startPeriod,
    endPeriod: merged.endPeriod,
    excludeScheduleId: scheduleId,
    errorCode: SCHEDULE_ERROR_CODES.SCHEDULE_UPDATE_ROOM_CONFLICT,
    errorMessage: SCHEDULE_ERROR_MESSAGES.SCHEDULE_UPDATE_ROOM_CONFLICT,
  });

  const updated = await prisma.schedule.update({
    where: {
      ScheduleID: scheduleId,
    },
    data: {
      RoomID: merged.roomId,
      DayOfWeek: merged.dayOfWeek,
      StartPeriod: merged.startPeriod,
      EndPeriod: merged.endPeriod,
      TotalPeriods: merged.totalPeriods,
      StartDate: merged.startDate,
      EndDate: merged.endDate,
    },
    select: {
      ScheduleID: true,
      RoomID: true,
      DayOfWeek: true,
    },
  });

  return {
    scheduleId: updated.ScheduleID,
    roomId: updated.RoomID,
    dayOfWeek: updated.DayOfWeek,
  };
};

export const deleteSchedule = async (scheduleId: number): Promise<void> => {
  const deleted = await prisma.schedule.deleteMany({
    where: {
      ScheduleID: scheduleId,
    },
  });

  if (deleted.count === 0) {
    throw new AppError(SCHEDULE_ERROR_MESSAGES.SCHEDULE_DELETE_NOT_FOUND, {
      statusCode: 404,
      code: SCHEDULE_ERROR_CODES.SCHEDULE_DELETE_NOT_FOUND,
      details: {
        formErrors: [SCHEDULE_ERROR_MESSAGES.SCHEDULE_DELETE_NOT_FOUND],
        fieldErrors: {},
      },
    });
  }
};

export const getMySchedule = async (
  accountId: number,
  role: RoleEnum | "ADMIN" | "LECTURER" | "STUDENT" | "PARENT",
  input: GetMyScheduleQueryInput,
) => {
  if (role !== "LECTURER" && role !== "STUDENT") {
    return [];
  }

  const profile = await prisma.userProfile.findUnique({
    where: {
      AccountID: accountId,
    },
    select: {
      ProfileID: true,
    },
  });

  if (!profile) {
    throw new AppError(SCHEDULE_ERROR_MESSAGES.SCHEDULE_MY_PROFILE_NOT_FOUND, {
      statusCode: 404,
      code: SCHEDULE_ERROR_CODES.SCHEDULE_MY_PROFILE_NOT_FOUND,
      details: {
        formErrors: [SCHEDULE_ERROR_MESSAGES.SCHEDULE_MY_PROFILE_NOT_FOUND],
        fieldErrors: {},
      },
    });
  }

  const clauses = buildBaseScheduleQueryClauses(input);
  if (role === "LECTURER") {
    clauses.push({
      section: {
        is: {
          LecturerProfileID: profile.ProfileID,
        },
      },
    });
  } else {
    clauses.push({
      section: {
        is: {
          registrations: {
            some: {
              StudentProfileID: profile.ProfileID,
            },
          },
        },
      },
    });
  }

  const where: Prisma.ScheduleWhereInput = {
    AND: clauses,
  };

  const schedules = await prisma.schedule.findMany({
    where,
    orderBy: [{ StartDate: "asc" }, { StartPeriod: "asc" }],
    select: {
      ScheduleID: true,
      DayOfWeek: true,
      StartPeriod: true,
      EndPeriod: true,
      room: {
        select: {
          RoomName: true,
        },
      },
      section: {
        select: {
          subject: {
            select: {
              SubjectName: true,
            },
          },
        },
      },
    },
  });

  return schedules.map((schedule) => ({
    scheduleId: schedule.ScheduleID,
    roomName: schedule.room.RoomName,
    subjectName: schedule.section.subject.SubjectName,
    dayOfWeek: formatDayOfWeek(schedule.DayOfWeek),
    startPeriod: schedule.StartPeriod,
    endPeriod: schedule.EndPeriod,
  }));
};

export const getSchedulesBySection = async (sectionId: number) => {
  await assertSectionExists(sectionId, {
    code: SCHEDULE_ERROR_CODES.SCHEDULE_SECTION_NOT_FOUND,
    message: SCHEDULE_ERROR_MESSAGES.SCHEDULE_SECTION_NOT_FOUND,
  });

  const schedules = await prisma.schedule.findMany({
    where: {
      SectionID: sectionId,
    },
    orderBy: [{ StartDate: "asc" }, { StartPeriod: "asc" }],
    select: {
      ScheduleID: true,
      RoomID: true,
      SectionID: true,
      DayOfWeek: true,
      StartPeriod: true,
      EndPeriod: true,
      TotalPeriods: true,
      StartDate: true,
      EndDate: true,
      room: {
        select: {
          RoomName: true,
        },
      },
      section: {
        select: {
          subject: {
            select: {
              SubjectName: true,
            },
          },
        },
      },
    },
  });

  return schedules.map((schedule) => ({
    scheduleId: schedule.ScheduleID,
    roomId: schedule.RoomID,
    roomName: schedule.room.RoomName,
    sectionId: schedule.SectionID,
    subjectName: schedule.section.subject.SubjectName,
    dayOfWeek: formatDayOfWeek(schedule.DayOfWeek),
    startPeriod: schedule.StartPeriod,
    endPeriod: schedule.EndPeriod,
    totalPeriods: schedule.TotalPeriods,
    startDate: formatDateOnly(schedule.StartDate),
    endDate: formatDateOnly(schedule.EndDate),
  }));
};

