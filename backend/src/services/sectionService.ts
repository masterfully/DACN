import { Prisma, RoleEnum } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../prisma/prismaClient";
import { AppError } from "../middleware/errorHandler";
import { SECTION_ERROR_CODES } from "../constants/errors/section/codes";
import {
  SECTION_ERROR_MESSAGES,
  SECTION_FIELD_ERROR_MESSAGES,
} from "../constants/errors/section/messages";

const dayOfWeekSchema = z.enum([
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
], {
  error: SECTION_FIELD_ERROR_MESSAGES.SCHEDULE_DAY_OF_WEEK_INVALID,
});

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
const yearRegex = /^\d{4}-\d{4}$/;

const scheduleItemSchema = z
  .object({
    roomId: z.coerce
      .number({
        error: SECTION_FIELD_ERROR_MESSAGES.SCHEDULE_ROOM_ID_INVALID,
      })
      .int(SECTION_FIELD_ERROR_MESSAGES.SCHEDULE_ROOM_ID_INVALID)
      .positive(SECTION_FIELD_ERROR_MESSAGES.SCHEDULE_ROOM_ID_INVALID),
    dayOfWeek: dayOfWeekSchema,
    startPeriod: z.coerce
      .number()
      .int(SECTION_FIELD_ERROR_MESSAGES.SCHEDULE_START_PERIOD_INVALID)
      .positive(SECTION_FIELD_ERROR_MESSAGES.SCHEDULE_START_PERIOD_INVALID),
    endPeriod: z.coerce
      .number()
      .int(SECTION_FIELD_ERROR_MESSAGES.SCHEDULE_END_PERIOD_INVALID)
      .positive(SECTION_FIELD_ERROR_MESSAGES.SCHEDULE_END_PERIOD_INVALID),
    startDate: z
      .string()
      .regex(dateOnlyRegex, SECTION_FIELD_ERROR_MESSAGES.SCHEDULE_START_DATE_INVALID),
    endDate: z
      .string()
      .regex(dateOnlyRegex, SECTION_FIELD_ERROR_MESSAGES.SCHEDULE_END_DATE_INVALID),
  })
  .superRefine((item, ctx) => {
    if (item.endPeriod < item.startPeriod) {
      ctx.addIssue({
        code: "custom",
        path: ["endPeriod"],
        message: SECTION_FIELD_ERROR_MESSAGES.SCHEDULE_PERIOD_RANGE_INVALID,
      });
    }

    if (item.endDate < item.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: SECTION_FIELD_ERROR_MESSAGES.SCHEDULE_DATE_RANGE_INVALID,
      });
    }
  });

export const createSectionSchema = z
  .object({
    subjectId: z.coerce
      .number({
        error: (issue) =>
          issue.input === undefined
            ? SECTION_FIELD_ERROR_MESSAGES.SUBJECT_ID_REQUIRED
            : SECTION_FIELD_ERROR_MESSAGES.SUBJECT_ID_INVALID,
      })
      .int(SECTION_FIELD_ERROR_MESSAGES.SUBJECT_ID_INVALID)
      .positive(SECTION_FIELD_ERROR_MESSAGES.SUBJECT_ID_INVALID),
    lecturerProfileId: z.coerce
      .number({
        error: (issue) =>
          issue.input === undefined
            ? SECTION_FIELD_ERROR_MESSAGES.LECTURER_PROFILE_ID_REQUIRED
            : SECTION_FIELD_ERROR_MESSAGES.LECTURER_PROFILE_ID_INVALID,
      })
      .int(SECTION_FIELD_ERROR_MESSAGES.LECTURER_PROFILE_ID_INVALID)
      .positive(SECTION_FIELD_ERROR_MESSAGES.LECTURER_PROFILE_ID_INVALID),
    year: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? SECTION_FIELD_ERROR_MESSAGES.YEAR_REQUIRED
            : SECTION_FIELD_ERROR_MESSAGES.YEAR_INVALID_FORMAT,
      })
      .trim()
      .regex(yearRegex, SECTION_FIELD_ERROR_MESSAGES.YEAR_INVALID_FORMAT),
    maxCapacity: z.coerce
      .number({
        error: (issue) =>
          issue.input === undefined
            ? SECTION_FIELD_ERROR_MESSAGES.MAX_CAPACITY_REQUIRED
            : SECTION_FIELD_ERROR_MESSAGES.MAX_CAPACITY_INVALID,
      })
      .int(SECTION_FIELD_ERROR_MESSAGES.MAX_CAPACITY_INVALID)
      .positive(SECTION_FIELD_ERROR_MESSAGES.MAX_CAPACITY_INVALID),
    status: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional().default(0),
    visibility: z.union([z.literal(0), z.literal(1)]).optional().default(1),
    schedule: z
      .array(scheduleItemSchema, {
        error: SECTION_FIELD_ERROR_MESSAGES.SCHEDULE_REQUIRED,
      })
      .min(1, SECTION_FIELD_ERROR_MESSAGES.SCHEDULE_EMPTY),
  })
  .superRefine((data, ctx) => {
    const [startYearRaw, endYearRaw] = data.year.split("-");
    const startYear = Number(startYearRaw);
    const endYear = Number(endYearRaw);

    if (!Number.isNaN(startYear) && !Number.isNaN(endYear) && endYear !== startYear + 1) {
      ctx.addIssue({
        code: "custom",
        path: ["year"],
        message: SECTION_FIELD_ERROR_MESSAGES.YEAR_INVALID_RANGE,
      });
    }
  });

export const getSectionsQuerySchema = z.object({
  page: z.coerce
    .number()
    .int(SECTION_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_INTEGER)
    .positive(SECTION_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_POSITIVE)
    .default(1),
  limit: z.coerce
    .number()
    .int(SECTION_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_INTEGER)
    .positive(SECTION_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_POSITIVE)
    .max(100, SECTION_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_MAX)
    .default(10),
  search: z
    .string({
      error: SECTION_FIELD_ERROR_MESSAGES.QUERY_SEARCH_INVALID,
    })
    .trim()
    .optional(),
  subjectId: z.coerce
    .number({
      error: SECTION_FIELD_ERROR_MESSAGES.QUERY_SUBJECT_ID_INVALID,
    })
    .int(SECTION_FIELD_ERROR_MESSAGES.QUERY_SUBJECT_ID_INVALID)
    .positive(SECTION_FIELD_ERROR_MESSAGES.QUERY_SUBJECT_ID_INVALID)
    .optional(),
  lecturerProfileId: z.coerce
    .number({
      error: SECTION_FIELD_ERROR_MESSAGES.QUERY_LECTURER_PROFILE_ID_INVALID,
    })
    .int(SECTION_FIELD_ERROR_MESSAGES.QUERY_LECTURER_PROFILE_ID_INVALID)
    .positive(SECTION_FIELD_ERROR_MESSAGES.QUERY_LECTURER_PROFILE_ID_INVALID)
    .optional(),
  year: z
    .string({
      error: SECTION_FIELD_ERROR_MESSAGES.QUERY_YEAR_INVALID_FORMAT,
    })
    .trim()
    .regex(yearRegex, SECTION_FIELD_ERROR_MESSAGES.QUERY_YEAR_INVALID_FORMAT)
    .optional(),
  status: z.coerce
    .number({
      error: SECTION_FIELD_ERROR_MESSAGES.QUERY_STATUS_INVALID,
    })
    .int(SECTION_FIELD_ERROR_MESSAGES.QUERY_STATUS_INVALID)
    .refine((value) => [0, 1, 2].includes(value), {
      message: SECTION_FIELD_ERROR_MESSAGES.QUERY_STATUS_INVALID,
    })
    .optional(),
  visibility: z.coerce
    .number({
      error: SECTION_FIELD_ERROR_MESSAGES.QUERY_VISIBILITY_INVALID,
    })
    .int(SECTION_FIELD_ERROR_MESSAGES.QUERY_VISIBILITY_INVALID)
    .refine((value) => [0, 1].includes(value), {
      message: SECTION_FIELD_ERROR_MESSAGES.QUERY_VISIBILITY_INVALID,
    })
    .optional(),
});

type CreateSectionInput = z.infer<typeof createSectionSchema>;
type GetSectionsQueryInput = z.infer<typeof getSectionsQuerySchema>;
type DayOfWeek = z.infer<typeof dayOfWeekSchema>;

const DAY_TO_UTC_INDEX: Record<DayOfWeek, number> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 0,
};

const toUtcDate = (dateString: string): Date => {
  return new Date(`${dateString}T00:00:00.000Z`);
};

const rangesOverlap = (startA: Date, endA: Date, startB: Date, endB: Date): boolean => {
  return startA <= endB && startB <= endA;
};

const periodsOverlap = (
  startPeriodA: number,
  endPeriodA: number,
  startPeriodB: number,
  endPeriodB: number,
): boolean => {
  return startPeriodA <= endPeriodB && startPeriodB <= endPeriodA;
};

const assertNoInternalScheduleOverlap = (input: CreateSectionInput): void => {
  for (let i = 0; i < input.schedule.length; i += 1) {
    const left = input.schedule[i];

    for (let j = i + 1; j < input.schedule.length; j += 1) {
      const right = input.schedule[j];

      if (left.dayOfWeek !== right.dayOfWeek) {
        continue;
      }

      const dateOverlap = rangesOverlap(
        toUtcDate(left.startDate),
        toUtcDate(left.endDate),
        toUtcDate(right.startDate),
        toUtcDate(right.endDate),
      );

      if (!dateOverlap) {
        continue;
      }

      const periodOverlap = periodsOverlap(
        left.startPeriod,
        left.endPeriod,
        right.startPeriod,
        right.endPeriod,
      );

      if (periodOverlap) {
        throw new AppError(SECTION_ERROR_MESSAGES.SECTION_CREATE_SCHEDULE_DUPLICATE, {
          statusCode: 400,
          code: SECTION_ERROR_CODES.SECTION_CREATE_SCHEDULE_DUPLICATE,
          details: {
            formErrors: [],
            fieldErrors: {
              schedule: [SECTION_FIELD_ERROR_MESSAGES.SCHEDULE_DUPLICATE],
            },
          },
        });
      }
    }
  }
};

const buildAttendanceDates = (
  startDate: Date,
  endDate: Date,
  dayOfWeek: DayOfWeek,
): Date[] => {
  const targetDay = DAY_TO_UTC_INDEX[dayOfWeek];
  const dates: Date[] = [];
  const cursor = new Date(startDate);

  while (cursor <= endDate) {
    if (cursor.getUTCDay() === targetDay) {
      dates.push(new Date(cursor));
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
};

const buildSectionListWhere = (input: GetSectionsQueryInput): Prisma.SectionWhereInput => {
  const andClauses: Prisma.SectionWhereInput[] = [];
  const normalizedSearch = input.search?.trim();

  if (normalizedSearch) {
    andClauses.push({
      OR: [
        {
          subject: {
            is: {
              SubjectName: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
          },
        },
        {
          lecturer: {
            is: {
              FullName: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    });
  }

  if (input.subjectId !== undefined) {
    andClauses.push({
      SubjectID: input.subjectId,
    });
  }

  if (input.lecturerProfileId !== undefined) {
    andClauses.push({
      LecturerProfileID: input.lecturerProfileId,
    });
  }

  if (input.year !== undefined) {
    andClauses.push({
      Year: input.year,
    });
  }

  if (input.status !== undefined) {
    andClauses.push({
      status: input.status,
    });
  }

  if (input.visibility !== undefined) {
    andClauses.push({
      visibility: input.visibility,
    });
  }

  return andClauses.length > 0 ? { AND: andClauses } : {};
};

export const getSections = async (input: GetSectionsQueryInput) => {
  const skip = (input.page - 1) * input.limit;
  const where = buildSectionListWhere(input);

  const [sections, total] = await Promise.all([
    prisma.section.findMany({
      where,
      skip,
      take: input.limit,
      orderBy: {
        SectionID: "asc",
      },
      select: {
        SectionID: true,
        SubjectID: true,
        LecturerProfileID: true,
        Year: true,
        EnrollmentCount: true,
        MaxCapacity: true,
        status: true,
        visibility: true,
        subject: {
          select: {
            SubjectName: true,
          },
        },
        lecturer: {
          select: {
            FullName: true,
          },
        },
      },
    }),
    prisma.section.count({ where }),
  ]);

  return {
    sections: sections.map((section) => ({
      sectionId: section.SectionID,
      subjectId: section.SubjectID,
      subjectName: section.subject.SubjectName,
      lecturerProfileId: section.LecturerProfileID,
      lecturerName: section.lecturer.FullName,
      year: section.Year,
      enrollmentCount: section.EnrollmentCount,
      maxCapacity: section.MaxCapacity,
      status: section.status,
      visibility: section.visibility,
    })),
    total,
  };
};

export const createSection = async (input: CreateSectionInput) => {
  assertNoInternalScheduleOverlap(input);

  const [subject, lecturerProfile] = await Promise.all([
    prisma.subject.findUnique({
      where: { SubjectID: input.subjectId },
      select: { SubjectID: true, SubjectName: true },
    }),
    prisma.userProfile.findUnique({
      where: { ProfileID: input.lecturerProfileId },
      select: {
        ProfileID: true,
        FullName: true,
        account: {
          select: {
            Role: true,
          },
        },
      },
    }),
  ]);

  if (!subject) {
    throw new AppError(SECTION_ERROR_MESSAGES.SECTION_CREATE_SUBJECT_NOT_FOUND, {
      statusCode: 404,
      code: SECTION_ERROR_CODES.SECTION_CREATE_SUBJECT_NOT_FOUND,
      details: {
        formErrors: [],
        fieldErrors: {
          subjectId: [SECTION_ERROR_MESSAGES.SECTION_CREATE_SUBJECT_NOT_FOUND],
        },
      },
    });
  }

  if (!lecturerProfile) {
    throw new AppError(SECTION_ERROR_MESSAGES.SECTION_CREATE_LECTURER_NOT_FOUND, {
      statusCode: 404,
      code: SECTION_ERROR_CODES.SECTION_CREATE_LECTURER_NOT_FOUND,
      details: {
        formErrors: [],
        fieldErrors: {
          lecturerProfileId: [SECTION_ERROR_MESSAGES.SECTION_CREATE_LECTURER_NOT_FOUND],
        },
      },
    });
  }

  if (lecturerProfile.account.Role !== RoleEnum.LECTURER) {
    throw new AppError(SECTION_ERROR_MESSAGES.SECTION_CREATE_LECTURER_INVALID_ROLE, {
      statusCode: 400,
      code: SECTION_ERROR_CODES.SECTION_CREATE_LECTURER_INVALID_ROLE,
      details: {
        formErrors: [],
        fieldErrors: {
          lecturerProfileId: [SECTION_ERROR_MESSAGES.SECTION_CREATE_LECTURER_INVALID_ROLE],
        },
      },
    });
  }

  const roomIds = [...new Set(input.schedule.map((item) => item.roomId))];
  const existingRooms = await prisma.room.findMany({
    where: {
      RoomID: {
        in: roomIds,
      },
    },
    select: {
      RoomID: true,
    },
  });

  const existingRoomIdSet = new Set(existingRooms.map((room) => room.RoomID));
  const missingRoomIds = roomIds.filter((roomId) => !existingRoomIdSet.has(roomId));

  if (missingRoomIds.length > 0) {
    throw new AppError(SECTION_ERROR_MESSAGES.SECTION_CREATE_ROOM_NOT_FOUND, {
      statusCode: 404,
      code: SECTION_ERROR_CODES.SECTION_CREATE_ROOM_NOT_FOUND,
      details: {
        formErrors: [],
        fieldErrors: {
          schedule: [
            `${SECTION_ERROR_MESSAGES.SECTION_CREATE_ROOM_NOT_FOUND}: ${missingRoomIds.join(", ")}`,
          ],
        },
      },
    });
  }

  return prisma.$transaction(async (tx) => {
    const section = await tx.section.create({
      data: {
        SubjectID: input.subjectId,
        LecturerProfileID: input.lecturerProfileId,
        Year: input.year,
        MaxCapacity: input.maxCapacity,
        status: input.status,
        visibility: input.visibility,
      },
      select: {
        SectionID: true,
        SubjectID: true,
        LecturerProfileID: true,
        Year: true,
        EnrollmentCount: true,
        MaxCapacity: true,
        status: true,
        visibility: true,
      },
    });

    const attendanceRows: Prisma.AttendanceCreateManyInput[] = [];
    const createdScheduleRows: {
      scheduleId: number;
      roomId: number;
      dayOfWeek: string;
      startDate: string;
      endDate: string;
      startPeriod: number;
      endPeriod: number;
    }[] = [];

    for (const item of input.schedule) {
      const startDate = toUtcDate(item.startDate);
      const endDate = toUtcDate(item.endDate);

      const conflict = await tx.schedule.findFirst({
        where: {
          RoomID: item.roomId,
          DayOfWeek: item.dayOfWeek,
          StartDate: {
            lte: endDate,
          },
          EndDate: {
            gte: startDate,
          },
          StartPeriod: {
            lte: item.endPeriod,
          },
          EndPeriod: {
            gte: item.startPeriod,
          },
        },
        select: {
          ScheduleID: true,
        },
      });

      if (conflict) {
        throw new AppError(SECTION_ERROR_MESSAGES.SECTION_CREATE_SCHEDULE_CONFLICT, {
          statusCode: 409,
          code: SECTION_ERROR_CODES.SECTION_CREATE_SCHEDULE_CONFLICT,
          details: {
            formErrors: [],
            fieldErrors: {
              schedule: [SECTION_FIELD_ERROR_MESSAGES.SCHEDULE_CONFLICT],
            },
          },
        });
      }

      const schedule = await tx.schedule.create({
        data: {
          RoomID: item.roomId,
          SectionID: section.SectionID,
          DayOfWeek: item.dayOfWeek,
          StartPeriod: item.startPeriod,
          EndPeriod: item.endPeriod,
          TotalPeriods: item.endPeriod - item.startPeriod + 1,
          StartDate: startDate,
          EndDate: endDate,
        },
        select: {
          ScheduleID: true,
          RoomID: true,
          DayOfWeek: true,
          StartDate: true,
          EndDate: true,
          StartPeriod: true,
          EndPeriod: true,
        },
      });

      createdScheduleRows.push({
        scheduleId: schedule.ScheduleID,
        roomId: schedule.RoomID,
        dayOfWeek: schedule.DayOfWeek,
        startDate: schedule.StartDate.toISOString().slice(0, 10),
        endDate: schedule.EndDate.toISOString().slice(0, 10),
        startPeriod: schedule.StartPeriod,
        endPeriod: schedule.EndPeriod,
      });

      const attendanceDates = buildAttendanceDates(startDate, endDate, item.dayOfWeek);
      attendanceRows.push(
        ...attendanceDates.map((attendanceDate) => ({
          SectionID: section.SectionID,
          AttendanceDate: attendanceDate,
          Slot: item.startPeriod,
          Note: null,
        })),
      );

      const usageHistory = await tx.usageHistory.create({
        data: {
          RoomID: item.roomId,
          StartTime: startDate,
          EndTime: endDate,
          Note: `Auto-generated for section ${section.SectionID}`,
        },
        select: {
          UsageHistoryID: true,
        },
      });

      await tx.sectionUsageHistory.create({
        data: {
          UsageHistoryID: usageHistory.UsageHistoryID,
          SectionID: section.SectionID,
        },
      });
    }

    if (attendanceRows.length > 0) {
      await tx.attendance.createMany({
        data: attendanceRows,
      });
    }

    return {
      sectionId: section.SectionID,
      subjectId: section.SubjectID,
      subjectName: subject.SubjectName,
      lecturerProfileId: section.LecturerProfileID,
      lecturerName: lecturerProfile.FullName,
      year: section.Year,
      enrollmentCount: section.EnrollmentCount,
      maxCapacity: section.MaxCapacity,
      status: section.status,
      visibility: section.visibility,
      schedules: createdScheduleRows,
      attendanceCount: attendanceRows.length,
    };
  });
};
