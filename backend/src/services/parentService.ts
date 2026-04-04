import { Prisma, RoleEnum } from "@prisma/client";
import { z } from "zod";
import { PARENT_ERROR_CODES } from "../constants/errors/parent/codes";
import {
  PARENT_ERROR_MESSAGES,
  PARENT_FIELD_ERROR_MESSAGES,
} from "../constants/errors/parent/messages";
import { AppError } from "../middleware/errorHandler";
import { prisma } from "../prisma/prismaClient";

const businessErrorDetails = (message: string) => ({
  formErrors: [message],
  fieldErrors: {},
});

const requiredPositiveIntSchema = (
  requiredMessage: string,
  invalidMessage: string,
) =>
  z.coerce
    .number({
      error: (issue) =>
        issue.input === undefined ? requiredMessage : invalidMessage,
    })
    .int(invalidMessage)
    .positive(invalidMessage);

const pageSchema = z.coerce
  .number({
    error: PARENT_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_INTEGER,
  })
  .int(PARENT_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_INTEGER)
  .positive(PARENT_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_POSITIVE)
  .default(1);

const limitSchema = z.coerce
  .number({
    error: PARENT_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_INTEGER,
  })
  .int(PARENT_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_INTEGER)
  .positive(PARENT_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_POSITIVE)
  .max(100, PARENT_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_MAX)
  .default(10);

export const assignParentSchema = z.object({
  studentId: requiredPositiveIntSchema(
    PARENT_FIELD_ERROR_MESSAGES.STUDENT_ID_REQUIRED,
    PARENT_FIELD_ERROR_MESSAGES.STUDENT_ID_INVALID,
  ),
  parentId: requiredPositiveIntSchema(
    PARENT_FIELD_ERROR_MESSAGES.PARENT_ID_REQUIRED,
    PARENT_FIELD_ERROR_MESSAGES.PARENT_ID_INVALID,
  ),
});

export const unassignParentQuerySchema = z.object({
  studentId: requiredPositiveIntSchema(
    PARENT_FIELD_ERROR_MESSAGES.STUDENT_ID_REQUIRED,
    PARENT_FIELD_ERROR_MESSAGES.STUDENT_ID_INVALID,
  ),
  parentId: requiredPositiveIntSchema(
    PARENT_FIELD_ERROR_MESSAGES.PARENT_ID_REQUIRED,
    PARENT_FIELD_ERROR_MESSAGES.PARENT_ID_INVALID,
  ),
});

export const getStudentParentsQuerySchema = z.object({
  page: pageSchema,
  limit: limitSchema,
});

type AssignParentInput = z.infer<typeof assignParentSchema>;
type UnassignParentQueryInput = z.infer<typeof unassignParentQuerySchema>;
type GetStudentParentsQueryInput = z.infer<typeof getStudentParentsQuerySchema>;

const formatDateOnly = (value: Date | null): string | null =>
  value ? value.toISOString().slice(0, 10) : null;

const assertStudentProfileExists = async (
  studentId: number,
  options: { code: string; message: string },
): Promise<void> => {
  const student = await prisma.userProfile.findFirst({
    where: {
      ProfileID: studentId,
      account: {
        is: {
          IsDeleted: false,
          Role: RoleEnum.STUDENT,
        },
      },
    },
    select: {
      ProfileID: true,
    },
  });

  if (!student) {
    throw new AppError(options.message, {
      statusCode: 404,
      code: options.code,
      details: businessErrorDetails(options.message),
    });
  }
};

const assertParentProfileExists = async (
  parentId: number,
  options: { code: string; message: string },
): Promise<void> => {
  const parent = await prisma.userProfile.findFirst({
    where: {
      ProfileID: parentId,
      account: {
        is: {
          IsDeleted: false,
          Role: RoleEnum.PARENT,
        },
      },
    },
    select: {
      ProfileID: true,
    },
  });

  if (!parent) {
    throw new AppError(options.message, {
      statusCode: 404,
      code: options.code,
      details: businessErrorDetails(options.message),
    });
  }
};

export const assignParentToStudent = async (input: AssignParentInput) => {
  await Promise.all([
    assertStudentProfileExists(input.studentId, {
      code: PARENT_ERROR_CODES.PARENT_ASSIGN_STUDENT_OR_PARENT_NOT_FOUND,
      message: PARENT_ERROR_MESSAGES.PARENT_ASSIGN_STUDENT_OR_PARENT_NOT_FOUND,
    }),
    assertParentProfileExists(input.parentId, {
      code: PARENT_ERROR_CODES.PARENT_ASSIGN_STUDENT_OR_PARENT_NOT_FOUND,
      message: PARENT_ERROR_MESSAGES.PARENT_ASSIGN_STUDENT_OR_PARENT_NOT_FOUND,
    }),
  ]);

  const existingLink = await prisma.userParents.findUnique({
    where: {
      StudentID_ParentID: {
        StudentID: input.studentId,
        ParentID: input.parentId,
      },
    },
    select: {
      StudentID: true,
    },
  });

  if (existingLink) {
    throw new AppError(PARENT_ERROR_MESSAGES.PARENT_ASSIGN_ALREADY_LINKED, {
      statusCode: 409,
      code: PARENT_ERROR_CODES.PARENT_ASSIGN_ALREADY_LINKED,
      details: businessErrorDetails(
        PARENT_ERROR_MESSAGES.PARENT_ASSIGN_ALREADY_LINKED,
      ),
    });
  }

  try {
    await prisma.userParents.create({
      data: {
        StudentID: input.studentId,
        ParentID: input.parentId,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(PARENT_ERROR_MESSAGES.PARENT_ASSIGN_ALREADY_LINKED, {
        statusCode: 409,
        code: PARENT_ERROR_CODES.PARENT_ASSIGN_ALREADY_LINKED,
        details: businessErrorDetails(
          PARENT_ERROR_MESSAGES.PARENT_ASSIGN_ALREADY_LINKED,
        ),
      });
    }

    throw error;
  }

  return {
    studentId: input.studentId,
    parentId: input.parentId,
  };
};

export const unassignParentFromStudent = async (
  input: UnassignParentQueryInput,
): Promise<void> => {
  const deleted = await prisma.userParents.deleteMany({
    where: {
      StudentID: input.studentId,
      ParentID: input.parentId,
    },
  });

  if (deleted.count === 0) {
    throw new AppError(PARENT_ERROR_MESSAGES.PARENT_UNASSIGN_LINK_NOT_FOUND, {
      statusCode: 404,
      code: PARENT_ERROR_CODES.PARENT_UNASSIGN_LINK_NOT_FOUND,
      details: businessErrorDetails(
        PARENT_ERROR_MESSAGES.PARENT_UNASSIGN_LINK_NOT_FOUND,
      ),
    });
  }
};

export const getParentsOfStudent = async (
  studentId: number,
  input: GetStudentParentsQueryInput,
) => {
  await assertStudentProfileExists(studentId, {
    code: PARENT_ERROR_CODES.PARENT_STUDENT_PARENTS_STUDENT_NOT_FOUND,
    message: PARENT_ERROR_MESSAGES.PARENT_STUDENT_PARENTS_STUDENT_NOT_FOUND,
  });

  const skip = (input.page - 1) * input.limit;
  const where: Prisma.UserParentsWhereInput = {
    StudentID: studentId,
    parent: {
      is: {
        account: {
          is: {
            IsDeleted: false,
            Role: RoleEnum.PARENT,
          },
        },
      },
    },
  };

  const [rows, total] = await Promise.all([
    prisma.userParents.findMany({
      where,
      skip,
      take: input.limit,
      orderBy: {
        ParentID: "asc",
      },
      select: {
        parent: {
          select: {
            ProfileID: true,
            FullName: true,
            PhoneNumber: true,
            DateOfBirth: true,
            Gender: true,
            Avatar: true,
            account: {
              select: {
                Email: true,
              },
            },
          },
        },
      },
    }),
    prisma.userParents.count({ where }),
  ]);

  return {
    parents: rows.map((row) => ({
      profileID: row.parent.ProfileID,
      fullName: row.parent.FullName,
      phoneNumber: row.parent.PhoneNumber,
      email: row.parent.account.Email,
      dateOfBirth: formatDateOnly(row.parent.DateOfBirth),
      gender: row.parent.Gender,
      avatar: row.parent.Avatar,
    })),
    total,
  };
};