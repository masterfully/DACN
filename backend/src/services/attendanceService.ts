import { Prisma } from "@prisma/client";
import { z } from "zod";
import { ATTENDANCE_ERROR_CODES } from "../constants/errors/attendance/codes";
import {
  ATTENDANCE_ERROR_MESSAGES,
  ATTENDANCE_FIELD_ERROR_MESSAGES,
} from "../constants/errors/attendance/messages";
import { AppError } from "../middleware/errorHandler";
import { prisma } from "../prisma/prismaClient";

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

const parseDateOnlyToUtc = (value: string): Date =>
  new Date(`${value}T00:00:00.000Z`);

const formatDateOnly = (value: Date): string => value.toISOString().slice(0, 10);

const businessErrorDetails = (message: string) => ({
  formErrors: [message],
  fieldErrors: {},
});

const pageSchema = z.coerce
  .number()
  .int(ATTENDANCE_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_INTEGER)
  .positive(ATTENDANCE_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_POSITIVE)
  .default(1);

const limitSchema = z.coerce
  .number()
  .int(ATTENDANCE_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_INTEGER)
  .positive(ATTENDANCE_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_POSITIVE)
  .max(100, ATTENDANCE_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_MAX)
  .default(10);

const dateOnlySchema = (message: string) =>
  z.string({ error: message }).trim().regex(dateOnlyRegex, message);

const slotSchema = (message: string) =>
  z.coerce
    .number({ error: message })
    .int(message)
    .positive(message);

const nullableNoteSchema = z
  .union([z.string(), z.null()], {
    error: ATTENDANCE_FIELD_ERROR_MESSAGES.NOTE_INVALID,
  })
  .optional();

export const getAttendancesQuerySchema = z.object({
  page: pageSchema,
  limit: limitSchema,
  sectionId: z.coerce
    .number({
      error: ATTENDANCE_FIELD_ERROR_MESSAGES.QUERY_SECTION_ID_INVALID,
    })
    .int(ATTENDANCE_FIELD_ERROR_MESSAGES.QUERY_SECTION_ID_INVALID)
    .positive(ATTENDANCE_FIELD_ERROR_MESSAGES.QUERY_SECTION_ID_INVALID)
    .optional(),
  attendanceDate: dateOnlySchema(
    ATTENDANCE_FIELD_ERROR_MESSAGES.QUERY_ATTENDANCE_DATE_INVALID,
  ).optional(),
  slot: slotSchema(ATTENDANCE_FIELD_ERROR_MESSAGES.QUERY_SLOT_INVALID).optional(),
});

export const createAttendanceSchema = z.object({
  sectionId: z.coerce
    .number({
      error: (issue) =>
        issue.input === undefined
          ? ATTENDANCE_FIELD_ERROR_MESSAGES.SECTION_ID_REQUIRED
          : ATTENDANCE_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID,
    })
    .int(ATTENDANCE_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID)
    .positive(ATTENDANCE_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID),
  attendanceDate: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? ATTENDANCE_FIELD_ERROR_MESSAGES.ATTENDANCE_DATE_REQUIRED
          : ATTENDANCE_FIELD_ERROR_MESSAGES.ATTENDANCE_DATE_INVALID,
    })
    .trim()
    .regex(
      dateOnlyRegex,
      ATTENDANCE_FIELD_ERROR_MESSAGES.ATTENDANCE_DATE_INVALID,
    ),
  slot: z.coerce
    .number({
      error: (issue) =>
        issue.input === undefined
          ? ATTENDANCE_FIELD_ERROR_MESSAGES.SLOT_REQUIRED
          : ATTENDANCE_FIELD_ERROR_MESSAGES.SLOT_INVALID,
    })
    .int(ATTENDANCE_FIELD_ERROR_MESSAGES.SLOT_INVALID)
    .positive(ATTENDANCE_FIELD_ERROR_MESSAGES.SLOT_INVALID),
  note: nullableNoteSchema,
});

export const updateAttendanceSchema = z
  .object({
    attendanceDate: dateOnlySchema(
      ATTENDANCE_FIELD_ERROR_MESSAGES.ATTENDANCE_DATE_INVALID,
    ).optional(),
    slot: slotSchema(ATTENDANCE_FIELD_ERROR_MESSAGES.SLOT_INVALID).optional(),
    note: nullableNoteSchema,
  })
  .superRefine((input, ctx) => {
    if (!Object.values(input).some((value) => value !== undefined)) {
      ctx.addIssue({
        code: "custom",
        path: ["body"],
        message: ATTENDANCE_FIELD_ERROR_MESSAGES.UPDATE_MIN_ONE_FIELD,
      });
    }
  });

export const getAttendancesBySectionQuerySchema = z.object({
  page: pageSchema,
  limit: limitSchema,
  attendanceDate: dateOnlySchema(
    ATTENDANCE_FIELD_ERROR_MESSAGES.QUERY_ATTENDANCE_DATE_INVALID,
  ).optional(),
  slot: slotSchema(ATTENDANCE_FIELD_ERROR_MESSAGES.QUERY_SLOT_INVALID).optional(),
});

type GetAttendancesQueryInput = z.infer<typeof getAttendancesQuerySchema>;
type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
type GetAttendancesBySectionQueryInput = z.infer<
  typeof getAttendancesBySectionQuerySchema
>;

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
      details: businessErrorDetails(options.message),
    });
  }
};

const mapFullAttendance = (attendance: {
  AttendanceID: number;
  SectionID: number;
  AttendanceDate: Date;
  Slot: number;
  Note: string | null;
  CreatedAt: Date;
  section: { subject: { SubjectName: string } };
}) => ({
  attendanceId: attendance.AttendanceID,
  sectionId: attendance.SectionID,
  subjectName: attendance.section.subject.SubjectName,
  attendanceDate: formatDateOnly(attendance.AttendanceDate),
  slot: attendance.Slot,
  note: attendance.Note,
  createdAt: attendance.CreatedAt.toISOString(),
});

const mapSectionAttendance = (attendance: {
  AttendanceID: number;
  AttendanceDate: Date;
  Slot: number;
  Note: string | null;
}) => ({
  attendanceId: attendance.AttendanceID,
  attendanceDate: formatDateOnly(attendance.AttendanceDate),
  slot: attendance.Slot,
  note: attendance.Note,
});

const buildAttendanceWhere = (input: {
  sectionId?: number;
  attendanceDate?: string;
  slot?: number;
}): Prisma.AttendanceWhereInput => {
  const clauses: Prisma.AttendanceWhereInput[] = [];

  if (input.sectionId !== undefined) {
    clauses.push({
      SectionID: input.sectionId,
    });
  }

  if (input.attendanceDate !== undefined) {
    clauses.push({
      AttendanceDate: parseDateOnlyToUtc(input.attendanceDate),
    });
  }

  if (input.slot !== undefined) {
    clauses.push({
      Slot: input.slot,
    });
  }

  if (clauses.length === 0) {
    return {};
  }

  if (clauses.length === 1) {
    return clauses[0];
  }

  return {
    AND: clauses,
  };
};

const checkAttendanceDuplicate = async (params: {
  sectionId: number;
  attendanceDate: Date;
  slot: number;
  excludeAttendanceId?: number;
  code: string;
  message: string;
}): Promise<void> => {
  const where: Prisma.AttendanceWhereInput = {
    SectionID: params.sectionId,
    AttendanceDate: params.attendanceDate,
    Slot: params.slot,
  };

  if (params.excludeAttendanceId !== undefined) {
    where.NOT = {
      AttendanceID: params.excludeAttendanceId,
    };
  }

  const duplicate = await prisma.attendance.findFirst({
    where,
    select: {
      AttendanceID: true,
    },
  });

  if (duplicate) {
    throw new AppError(params.message, {
      statusCode: 409,
      code: params.code,
      details: businessErrorDetails(params.message),
    });
  }
};

export const getAttendances = async (input: GetAttendancesQueryInput) => {
  const skip = (input.page - 1) * input.limit;
  const where = buildAttendanceWhere({
    sectionId: input.sectionId,
    attendanceDate: input.attendanceDate,
    slot: input.slot,
  });

  const [attendances, total] = await Promise.all([
    prisma.attendance.findMany({
      where,
      skip,
      take: input.limit,
      orderBy: [{ AttendanceDate: "desc" }, { Slot: "asc" }, { AttendanceID: "desc" }],
      select: {
        AttendanceID: true,
        SectionID: true,
        AttendanceDate: true,
        Slot: true,
        Note: true,
        CreatedAt: true,
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
    prisma.attendance.count({ where }),
  ]);

  return {
    attendances: attendances.map(mapFullAttendance),
    total,
  };
};

export const createAttendance = async (input: CreateAttendanceInput): Promise<void> => {
  await assertSectionExists(input.sectionId, {
    code: ATTENDANCE_ERROR_CODES.ATTENDANCE_CREATE_SECTION_NOT_FOUND,
    message: ATTENDANCE_ERROR_MESSAGES.ATTENDANCE_CREATE_SECTION_NOT_FOUND,
  });

  const attendanceDate = parseDateOnlyToUtc(input.attendanceDate);

  await checkAttendanceDuplicate({
    sectionId: input.sectionId,
    attendanceDate,
    slot: input.slot,
    code: ATTENDANCE_ERROR_CODES.ATTENDANCE_CREATE_DUPLICATE,
    message: ATTENDANCE_ERROR_MESSAGES.ATTENDANCE_CREATE_DUPLICATE,
  });

  await prisma.attendance.create({
    data: {
      SectionID: input.sectionId,
      AttendanceDate: attendanceDate,
      Slot: input.slot,
      Note: input.note ?? null,
    },
  });
};

export const getAttendanceDetail = async (attendanceId: number) => {
  const attendance = await prisma.attendance.findUnique({
    where: {
      AttendanceID: attendanceId,
    },
    select: {
      AttendanceID: true,
      SectionID: true,
      AttendanceDate: true,
      Slot: true,
      Note: true,
      CreatedAt: true,
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

  if (!attendance) {
    throw new AppError(ATTENDANCE_ERROR_MESSAGES.ATTENDANCE_GET_NOT_FOUND, {
      statusCode: 404,
      code: ATTENDANCE_ERROR_CODES.ATTENDANCE_GET_NOT_FOUND,
      details: businessErrorDetails(
        ATTENDANCE_ERROR_MESSAGES.ATTENDANCE_GET_NOT_FOUND,
      ),
    });
  }

  return mapFullAttendance(attendance);
};

export const updateAttendance = async (
  attendanceId: number,
  input: UpdateAttendanceInput,
) => {
  const current = await prisma.attendance.findUnique({
    where: {
      AttendanceID: attendanceId,
    },
    select: {
      AttendanceID: true,
      SectionID: true,
      AttendanceDate: true,
      Slot: true,
      Note: true,
      CreatedAt: true,
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

  if (!current) {
    throw new AppError(ATTENDANCE_ERROR_MESSAGES.ATTENDANCE_UPDATE_NOT_FOUND, {
      statusCode: 404,
      code: ATTENDANCE_ERROR_CODES.ATTENDANCE_UPDATE_NOT_FOUND,
      details: businessErrorDetails(
        ATTENDANCE_ERROR_MESSAGES.ATTENDANCE_UPDATE_NOT_FOUND,
      ),
    });
  }

  const mergedAttendanceDate = input.attendanceDate
    ? parseDateOnlyToUtc(input.attendanceDate)
    : current.AttendanceDate;
  const mergedSlot = input.slot ?? current.Slot;

  await checkAttendanceDuplicate({
    sectionId: current.SectionID,
    attendanceDate: mergedAttendanceDate,
    slot: mergedSlot,
    excludeAttendanceId: attendanceId,
    code: ATTENDANCE_ERROR_CODES.ATTENDANCE_UPDATE_DUPLICATE,
    message: ATTENDANCE_ERROR_MESSAGES.ATTENDANCE_UPDATE_DUPLICATE,
  });

  const updated = await prisma.attendance.update({
    where: {
      AttendanceID: attendanceId,
    },
    data: {
      AttendanceDate: mergedAttendanceDate,
      Slot: mergedSlot,
      Note: input.note !== undefined ? input.note : current.Note,
    },
    select: {
      AttendanceID: true,
      SectionID: true,
      AttendanceDate: true,
      Slot: true,
      Note: true,
      CreatedAt: true,
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

  return mapFullAttendance(updated);
};

export const deleteAttendance = async (attendanceId: number): Promise<void> => {
  const deletedCount = await prisma.$transaction(async (tx) => {
    await tx.attendanceDetail.deleteMany({
      where: {
        AttendanceID: attendanceId,
      },
    });

    const deleted = await tx.attendance.deleteMany({
      where: {
        AttendanceID: attendanceId,
      },
    });

    return deleted.count;
  });

  if (deletedCount === 0) {
    throw new AppError(ATTENDANCE_ERROR_MESSAGES.ATTENDANCE_DELETE_NOT_FOUND, {
      statusCode: 404,
      code: ATTENDANCE_ERROR_CODES.ATTENDANCE_DELETE_NOT_FOUND,
      details: businessErrorDetails(
        ATTENDANCE_ERROR_MESSAGES.ATTENDANCE_DELETE_NOT_FOUND,
      ),
    });
  }
};

export const getAttendancesBySection = async (
  sectionId: number,
  input: GetAttendancesBySectionQueryInput,
) => {
  await assertSectionExists(sectionId, {
    code: ATTENDANCE_ERROR_CODES.ATTENDANCE_SECTION_NOT_FOUND,
    message: ATTENDANCE_ERROR_MESSAGES.ATTENDANCE_SECTION_NOT_FOUND,
  });

  const skip = (input.page - 1) * input.limit;
  const where = buildAttendanceWhere({
    sectionId,
    attendanceDate: input.attendanceDate,
    slot: input.slot,
  });

  const [attendances, total] = await Promise.all([
    prisma.attendance.findMany({
      where,
      skip,
      take: input.limit,
      orderBy: [{ AttendanceDate: "desc" }, { Slot: "asc" }, { AttendanceID: "desc" }],
      select: {
        AttendanceID: true,
        AttendanceDate: true,
        Slot: true,
        Note: true,
      },
    }),
    prisma.attendance.count({ where }),
  ]);

  return {
    attendances: attendances.map(mapSectionAttendance),
    total,
  };
};
