import { Prisma } from "@prisma/client";
import { z } from "zod";
import { ATTENDANCE_DETAIL_ERROR_CODES } from "../constants/errors/attendanceDetail/codes";
import {
  ATTENDANCE_DETAIL_ERROR_MESSAGES,
  ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES,
} from "../constants/errors/attendanceDetail/messages";
import { AppError } from "../middleware/errorHandler";
import { prisma } from "../prisma/prismaClient";

const attendanceStatusValues = [
  "PRESENT",
  "ABSENT",
  "EXCUSED_ABSENCE",
  "LATE",
] as const;

const normalizeStatus = (value: unknown): unknown =>
  typeof value === "string" ? value.trim().toUpperCase() : value;

const statusSchema = z.preprocess(
  normalizeStatus,
  z.enum(attendanceStatusValues, {
    error: ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.STATUS_INVALID,
  }),
);

const queryStatusSchema = z.preprocess(
  normalizeStatus,
  z.enum(attendanceStatusValues, {
    error: ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.QUERY_STATUS_INVALID,
  }),
);

const pageSchema = z.coerce
  .number()
  .int(ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_INTEGER)
  .positive(ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_POSITIVE)
  .default(1);

const limitSchema = z.coerce
  .number()
  .int(ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_INTEGER)
  .positive(ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_POSITIVE)
  .max(100, ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_MAX)
  .default(50);

const businessErrorDetails = (message: string) => ({
  formErrors: [message],
  fieldErrors: {},
});

const noteSchema = z
  .union([z.string(), z.null()], {
    error: ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.NOTE_INVALID,
  })
  .optional();

export const getAttendanceDetailsQuerySchema = z.object({
  page: pageSchema,
  limit: limitSchema,
  studentProfileId: z.coerce
    .number({
      error: ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.QUERY_STUDENT_PROFILE_ID_INVALID,
    })
    .int(ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.QUERY_STUDENT_PROFILE_ID_INVALID)
    .positive(ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.QUERY_STUDENT_PROFILE_ID_INVALID)
    .optional(),
  status: queryStatusSchema.optional(),
});

const createAttendanceDetailItemSchema = z.object({
  studentProfileId: z.coerce
    .number({
      error: (issue) =>
        issue.input === undefined
          ? ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.STUDENT_PROFILE_ID_REQUIRED
          : ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.STUDENT_PROFILE_ID_INVALID,
    })
    .int(ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.STUDENT_PROFILE_ID_INVALID)
    .positive(ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.STUDENT_PROFILE_ID_INVALID),
  status: z.preprocess(
    normalizeStatus,
    z.enum(attendanceStatusValues, {
      error: (issue) =>
        issue.input === undefined
          ? ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.STATUS_REQUIRED
          : ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.STATUS_INVALID,
    }),
  ),
  note: noteSchema,
});

export const createAttendanceDetailsSchema = z
  .object({
    details: z.array(createAttendanceDetailItemSchema, {
      error: (issue) => {
        if (issue.input === undefined) {
          return ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.DETAILS_REQUIRED;
        }
        return ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.DETAILS_INVALID_TYPE;
      },
    }),
  })
  .superRefine((input, ctx) => {
    if (input.details.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["details"],
        message: ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.DETAILS_MIN_ITEMS,
      });
      return;
    }

    const seen = new Set<number>();
    input.details.forEach((detail, index) => {
      if (seen.has(detail.studentProfileId)) {
        ctx.addIssue({
          code: "custom",
          path: ["details", index, "studentProfileId"],
          message: ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.DUPLICATE_STUDENT_PROFILE_ID,
        });
      } else {
        seen.add(detail.studentProfileId);
      }
    });
  });

export const updateAttendanceDetailSchema = z
  .object({
    status: statusSchema.optional(),
    note: noteSchema,
  })
  .superRefine((input, ctx) => {
    if (!Object.values(input).some((value) => value !== undefined)) {
      ctx.addIssue({
        code: "custom",
        path: ["body"],
        message: ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.UPDATE_MIN_ONE_FIELD,
      });
    }
  });

type GetAttendanceDetailsQueryInput = z.infer<typeof getAttendanceDetailsQuerySchema>;
type CreateAttendanceDetailsInput = z.infer<typeof createAttendanceDetailsSchema>;
type UpdateAttendanceDetailInput = z.infer<typeof updateAttendanceDetailSchema>;

const assertAttendanceExists = async (
  attendanceId: number,
  options: {
    code: string;
    message: string;
  },
): Promise<void> => {
  const attendance = await prisma.attendance.findUnique({
    where: {
      AttendanceID: attendanceId,
    },
    select: {
      AttendanceID: true,
    },
  });

  if (!attendance) {
    throw new AppError(options.message, {
      statusCode: 404,
      code: options.code,
      details: businessErrorDetails(options.message),
    });
  }
};

const buildAttendanceDetailsWhere = (
  attendanceId: number,
  input: GetAttendanceDetailsQueryInput,
): Prisma.AttendanceDetailWhereInput => {
  const clauses: Prisma.AttendanceDetailWhereInput[] = [
    {
      AttendanceID: attendanceId,
    },
  ];

  if (input.studentProfileId !== undefined) {
    clauses.push({
      StudentProfileID: input.studentProfileId,
    });
  }

  if (input.status !== undefined) {
    clauses.push({
      Status: input.status,
    });
  }

  if (clauses.length === 1) {
    return clauses[0];
  }

  return {
    AND: clauses,
  };
};

export const getAttendanceDetails = async (
  attendanceId: number,
  input: GetAttendanceDetailsQueryInput,
) => {
  await assertAttendanceExists(attendanceId, {
    code: ATTENDANCE_DETAIL_ERROR_CODES.ATTENDANCE_DETAIL_LIST_ATTENDANCE_NOT_FOUND,
    message:
      ATTENDANCE_DETAIL_ERROR_MESSAGES.ATTENDANCE_DETAIL_LIST_ATTENDANCE_NOT_FOUND,
  });

  const where = buildAttendanceDetailsWhere(attendanceId, input);
  const skip = (input.page - 1) * input.limit;

  const [details, total] = await Promise.all([
    prisma.attendanceDetail.findMany({
      where,
      skip,
      take: input.limit,
      orderBy: {
        AttendanceDetailID: "asc",
      },
      select: {
        AttendanceDetailID: true,
        StudentProfileID: true,
        Status: true,
        Note: true,
        student: {
          select: {
            FullName: true,
          },
        },
      },
    }),
    prisma.attendanceDetail.count({ where }),
  ]);

  return {
    details: details.map((detail) => ({
      attendanceDetailId: detail.AttendanceDetailID,
      studentProfileId: detail.StudentProfileID,
      studentName: detail.student.FullName ?? "",
      status: detail.Status,
      note: detail.Note,
    })),
    total,
  };
};

export const createAttendanceDetails = async (
  attendanceId: number,
  input: CreateAttendanceDetailsInput,
) => {
  await assertAttendanceExists(attendanceId, {
    code: ATTENDANCE_DETAIL_ERROR_CODES.ATTENDANCE_DETAIL_CREATE_ATTENDANCE_NOT_FOUND,
    message:
      ATTENDANCE_DETAIL_ERROR_MESSAGES.ATTENDANCE_DETAIL_CREATE_ATTENDANCE_NOT_FOUND,
  });

  const existedCount = await prisma.attendanceDetail.count({
    where: {
      AttendanceID: attendanceId,
    },
  });

  if (existedCount > 0) {
    throw new AppError(
      ATTENDANCE_DETAIL_ERROR_MESSAGES.ATTENDANCE_DETAIL_CREATE_ALREADY_EXISTS,
      {
        statusCode: 409,
        code: ATTENDANCE_DETAIL_ERROR_CODES.ATTENDANCE_DETAIL_CREATE_ALREADY_EXISTS,
        details: businessErrorDetails(
          ATTENDANCE_DETAIL_ERROR_MESSAGES.ATTENDANCE_DETAIL_CREATE_ALREADY_EXISTS,
        ),
      },
    );
  }

  const requestedStudentIds = input.details.map((item) => item.studentProfileId);
  const existingStudents = await prisma.userProfile.findMany({
    where: {
      ProfileID: {
        in: requestedStudentIds,
      },
    },
    select: {
      ProfileID: true,
    },
  });

  const existingStudentIdSet = new Set(
    existingStudents.map((student) => student.ProfileID),
  );
  const missingStudentIds = requestedStudentIds.filter(
    (studentId) => !existingStudentIdSet.has(studentId),
  );

  if (missingStudentIds.length > 0) {
    throw new AppError(
      ATTENDANCE_DETAIL_ERROR_MESSAGES.ATTENDANCE_DETAIL_CREATE_INVALID_INPUT,
      {
        statusCode: 400,
        code: ATTENDANCE_DETAIL_ERROR_CODES.ATTENDANCE_DETAIL_CREATE_INVALID_INPUT,
        details: {
          formErrors: [],
          fieldErrors: {
            details: [
              `${ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.STUDENT_PROFILE_ID_NOT_FOUND}: ${missingStudentIds.join(", ")}`,
            ],
          },
        },
      },
    );
  }

  const created = await prisma.attendanceDetail.createMany({
    data: input.details.map((item) => ({
      AttendanceID: attendanceId,
      StudentProfileID: item.studentProfileId,
      Status: item.status,
      Note: item.note ?? null,
    })),
  });

  return {
    created: created.count,
    attendanceId,
  };
};

export const updateAttendanceDetail = async (
  attendanceId: number,
  detailId: number,
  input: UpdateAttendanceDetailInput,
) => {
  const current = await prisma.attendanceDetail.findFirst({
    where: {
      AttendanceID: attendanceId,
      AttendanceDetailID: detailId,
    },
    select: {
      AttendanceDetailID: true,
      Status: true,
      Note: true,
    },
  });

  if (!current) {
    throw new AppError(
      ATTENDANCE_DETAIL_ERROR_MESSAGES.ATTENDANCE_DETAIL_UPDATE_NOT_FOUND,
      {
        statusCode: 404,
        code: ATTENDANCE_DETAIL_ERROR_CODES.ATTENDANCE_DETAIL_UPDATE_NOT_FOUND,
        details: businessErrorDetails(
          ATTENDANCE_DETAIL_ERROR_MESSAGES.ATTENDANCE_DETAIL_UPDATE_NOT_FOUND,
        ),
      },
    );
  }

  const updated = await prisma.attendanceDetail.update({
    where: {
      AttendanceDetailID: detailId,
    },
    data: {
      Status: input.status ?? current.Status,
      Note: input.note !== undefined ? input.note : current.Note,
    },
    select: {
      AttendanceDetailID: true,
      Status: true,
      Note: true,
    },
  });

  return {
    attendanceDetailId: updated.AttendanceDetailID,
    status: updated.Status,
    note: updated.Note,
  };
};
