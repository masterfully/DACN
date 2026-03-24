import { Prisma } from "@prisma/client";
import { z } from "zod";
import { REGISTRATION_ERROR_CODES } from "../constants/errors/registration/codes";
import {
  REGISTRATION_ERROR_MESSAGES,
  REGISTRATION_FIELD_ERROR_MESSAGES,
} from "../constants/errors/registration/messages";
import { AppError } from "../middleware/errorHandler";
import { prisma } from "../prisma/prismaClient";

const OPEN_SECTION_STATUS = 1;
const yearRegex = /^\d{4}-\d{4}$/;

const businessErrorDetails = (message: string) => ({
  formErrors: [message],
  fieldErrors: {},
});

const positiveIntSchema = (invalidMessage: string) =>
  z.coerce.number().int(invalidMessage).positive(invalidMessage);

const pageSchema = z.coerce
  .number()
  .int(REGISTRATION_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_INTEGER)
  .positive(REGISTRATION_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_POSITIVE)
  .default(1);

const limitSchema = z.coerce
  .number()
  .int(REGISTRATION_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_INTEGER)
  .positive(REGISTRATION_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_POSITIVE)
  .max(100, REGISTRATION_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_MAX)
  .default(10);

const statusSchema = z.coerce
  .number({
    error: REGISTRATION_FIELD_ERROR_MESSAGES.QUERY_STATUS_INVALID,
  })
  .int(REGISTRATION_FIELD_ERROR_MESSAGES.QUERY_STATUS_INVALID)
  .refine((value) => [0, 1, 2].includes(value), {
    message: REGISTRATION_FIELD_ERROR_MESSAGES.QUERY_STATUS_INVALID,
  });

export const createRegistrationSchema = z.object({
  sectionId: z.coerce
    .number({
      error: (issue) =>
        issue.input === undefined
          ? REGISTRATION_FIELD_ERROR_MESSAGES.SECTION_ID_REQUIRED
          : REGISTRATION_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID,
    })
    .int(REGISTRATION_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID)
    .positive(REGISTRATION_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID),
});

export const getRegistrationsQuerySchema = z.object({
  page: pageSchema,
  limit: limitSchema,
  sectionId: positiveIntSchema(
    REGISTRATION_FIELD_ERROR_MESSAGES.QUERY_SECTION_ID_INVALID,
  ).optional(),
  studentProfileId: positiveIntSchema(
    REGISTRATION_FIELD_ERROR_MESSAGES.QUERY_STUDENT_PROFILE_ID_INVALID,
  ).optional(),
  status: statusSchema.optional(),
  year: z
    .string({
      error: REGISTRATION_FIELD_ERROR_MESSAGES.QUERY_YEAR_INVALID_FORMAT,
    })
    .trim()
    .regex(yearRegex, REGISTRATION_FIELD_ERROR_MESSAGES.QUERY_YEAR_INVALID_FORMAT)
    .optional(),
});

export const getMyRegistrationsQuerySchema = z.object({
  page: pageSchema,
  limit: limitSchema,
  status: statusSchema.optional(),
  year: z
    .string({
      error: REGISTRATION_FIELD_ERROR_MESSAGES.QUERY_YEAR_INVALID_FORMAT,
    })
    .trim()
    .regex(yearRegex, REGISTRATION_FIELD_ERROR_MESSAGES.QUERY_YEAR_INVALID_FORMAT)
    .optional(),
});

export const getSectionRegistrationsQuerySchema = z.object({
  page: pageSchema,
  limit: limitSchema,
  search: z
    .string({
      error: REGISTRATION_FIELD_ERROR_MESSAGES.QUERY_SEARCH_INVALID,
    })
    .trim()
    .optional(),
  status: statusSchema.optional(),
});

type CreateRegistrationInput = z.infer<typeof createRegistrationSchema>;
type GetRegistrationsQueryInput = z.infer<typeof getRegistrationsQuerySchema>;
type GetMyRegistrationsQueryInput = z.infer<typeof getMyRegistrationsQuerySchema>;
type GetSectionRegistrationsQueryInput = z.infer<
  typeof getSectionRegistrationsQuerySchema
>;

const getStudentProfileIdByAccount = async (
  accountId: number,
  options: {
    code: string;
    message: string;
  },
): Promise<number> => {
  const studentProfile = await prisma.userProfile.findUnique({
    where: { AccountID: accountId },
    select: { ProfileID: true },
  });

  if (!studentProfile) {
    throw new AppError(options.message, {
      statusCode: 404,
      code: options.code,
      details: businessErrorDetails(options.message),
    });
  }

  return studentProfile.ProfileID;
};

export const registerSection = async (
  accountId: number,
  input: CreateRegistrationInput,
): Promise<{ sectionId: number; studentProfileId: number }> => {
  const studentProfileId = await getStudentProfileIdByAccount(accountId, {
    code: REGISTRATION_ERROR_CODES.REGISTRATION_CREATE_STUDENT_PROFILE_NOT_FOUND,
    message:
      REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_STUDENT_PROFILE_NOT_FOUND,
  });

  return prisma.$transaction(async (tx) => {
    const section = await tx.section.findUnique({
      where: { SectionID: input.sectionId },
      select: {
        SectionID: true,
        status: true,
        EnrollmentCount: true,
        MaxCapacity: true,
      },
    });

    if (!section) {
      throw new AppError(
        REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_NOT_FOUND,
        {
          statusCode: 404,
          code: REGISTRATION_ERROR_CODES.REGISTRATION_CREATE_SECTION_NOT_FOUND,
          details: businessErrorDetails(
            REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_NOT_FOUND,
          ),
        },
      );
    }

    if (section.status !== OPEN_SECTION_STATUS) {
      throw new AppError(
        REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_NOT_OPEN,
        {
          statusCode: 409,
          code: REGISTRATION_ERROR_CODES.REGISTRATION_CREATE_SECTION_NOT_OPEN,
          details: businessErrorDetails(
            REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_NOT_OPEN,
          ),
        },
      );
    }

    const existedRegistration = await tx.registration.findUnique({
      where: {
        SectionID_StudentProfileID: {
          SectionID: section.SectionID,
          StudentProfileID: studentProfileId,
        },
      },
      select: {
        SectionID: true,
      },
    });

    if (existedRegistration) {
      throw new AppError(
        REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_ALREADY_REGISTERED,
        {
          statusCode: 409,
          code: REGISTRATION_ERROR_CODES.REGISTRATION_CREATE_ALREADY_REGISTERED,
          details: businessErrorDetails(
            REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_ALREADY_REGISTERED,
          ),
        },
      );
    }

    if (section.EnrollmentCount >= section.MaxCapacity) {
      throw new AppError(
        REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_FULL,
        {
          statusCode: 409,
          code: REGISTRATION_ERROR_CODES.REGISTRATION_CREATE_SECTION_FULL,
          details: businessErrorDetails(
            REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_FULL,
          ),
        },
      );
    }

    try {
      await tx.registration.create({
        data: {
          SectionID: section.SectionID,
          StudentProfileID: studentProfileId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_ALREADY_REGISTERED,
          {
            statusCode: 409,
            code: REGISTRATION_ERROR_CODES.REGISTRATION_CREATE_ALREADY_REGISTERED,
            details: businessErrorDetails(
              REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_ALREADY_REGISTERED,
            ),
          },
        );
      }

      throw error;
    }

    const incrementResult = await tx.section.updateMany({
      where: {
        SectionID: section.SectionID,
        status: OPEN_SECTION_STATUS,
        EnrollmentCount: {
          lt: section.MaxCapacity,
        },
      },
      data: {
        EnrollmentCount: {
          increment: 1,
        },
      },
    });

    if (incrementResult.count === 0) {
      const latestSection = await tx.section.findUnique({
        where: { SectionID: section.SectionID },
        select: {
          status: true,
          EnrollmentCount: true,
          MaxCapacity: true,
        },
      });

      if (!latestSection) {
        throw new AppError(
          REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_NOT_FOUND,
          {
            statusCode: 404,
            code: REGISTRATION_ERROR_CODES.REGISTRATION_CREATE_SECTION_NOT_FOUND,
            details: businessErrorDetails(
              REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_NOT_FOUND,
            ),
          },
        );
      }

      if (latestSection.status !== OPEN_SECTION_STATUS) {
        throw new AppError(
          REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_NOT_OPEN,
          {
            statusCode: 409,
            code: REGISTRATION_ERROR_CODES.REGISTRATION_CREATE_SECTION_NOT_OPEN,
            details: businessErrorDetails(
              REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_NOT_OPEN,
            ),
          },
        );
      }

      throw new AppError(
        REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_FULL,
        {
          statusCode: 409,
          code: REGISTRATION_ERROR_CODES.REGISTRATION_CREATE_SECTION_FULL,
          details: businessErrorDetails(
            REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_FULL,
          ),
        },
      );
    }

    return {
      sectionId: section.SectionID,
      studentProfileId,
    };
  });
};

export const getRegistrations = async (input: GetRegistrationsQueryInput) => {
  const skip = (input.page - 1) * input.limit;
  const where: Prisma.RegistrationWhereInput = {};

  if (input.sectionId !== undefined) {
    where.SectionID = input.sectionId;
  }

  if (input.studentProfileId !== undefined) {
    where.StudentProfileID = input.studentProfileId;
  }

  if (input.status !== undefined || input.year !== undefined) {
    const sectionFilter: Prisma.SectionWhereInput = {};

    if (input.status !== undefined) {
      sectionFilter.status = input.status;
    }

    if (input.year !== undefined) {
      sectionFilter.Year = input.year;
    }

    where.section = {
      is: sectionFilter,
    };
  }

  const [registrations, total] = await Promise.all([
    prisma.registration.findMany({
      where,
      skip,
      take: input.limit,
      orderBy: [
        { SectionID: "asc" },
        { StudentProfileID: "asc" },
      ],
      select: {
        SectionID: true,
        StudentProfileID: true,
        student: {
          select: {
            FullName: true,
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
    prisma.registration.count({ where }),
  ]);

  return {
    registrations: registrations.map((registration) => ({
      sectionId: registration.SectionID,
      studentProfileId: registration.StudentProfileID,
      studentName: registration.student.FullName ?? "",
      subjectName: registration.section.subject.SubjectName,
    })),
    total,
  };
};

export const getMyRegistrations = async (
  accountId: number,
  input: GetMyRegistrationsQueryInput,
) => {
  const studentProfileId = await getStudentProfileIdByAccount(accountId, {
    code: REGISTRATION_ERROR_CODES.REGISTRATION_LIST_STUDENT_PROFILE_NOT_FOUND,
    message: REGISTRATION_ERROR_MESSAGES.REGISTRATION_LIST_STUDENT_PROFILE_NOT_FOUND,
  });

  const skip = (input.page - 1) * input.limit;
  const where: Prisma.RegistrationWhereInput = {
    StudentProfileID: studentProfileId,
  };

  if (input.status !== undefined || input.year !== undefined) {
    const sectionFilter: Prisma.SectionWhereInput = {};

    if (input.status !== undefined) {
      sectionFilter.status = input.status;
    }

    if (input.year !== undefined) {
      sectionFilter.Year = input.year;
    }

    where.section = {
      is: sectionFilter,
    };
  }

  const [registrations, total] = await Promise.all([
    prisma.registration.findMany({
      where,
      skip,
      take: input.limit,
      orderBy: {
        SectionID: "asc",
      },
      select: {
        SectionID: true,
        section: {
          select: {
            Year: true,
            status: true,
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
        },
      },
    }),
    prisma.registration.count({ where }),
  ]);

  return {
    registrations: registrations.map((registration) => ({
      sectionId: registration.SectionID,
      subjectName: registration.section.subject.SubjectName,
      lecturerName: registration.section.lecturer.FullName ?? "",
      year: registration.section.Year,
      status: registration.section.status,
    })),
    total,
  };
};

export const cancelRegistration = async (
  accountId: number,
  sectionId: number,
): Promise<void> => {
  const studentProfileId = await getStudentProfileIdByAccount(accountId, {
    code: REGISTRATION_ERROR_CODES.REGISTRATION_CANCEL_STUDENT_PROFILE_NOT_FOUND,
    message:
      REGISTRATION_ERROR_MESSAGES.REGISTRATION_CANCEL_STUDENT_PROFILE_NOT_FOUND,
  });

  await prisma.$transaction(async (tx) => {
    const deleteResult = await tx.registration.deleteMany({
      where: {
        SectionID: sectionId,
        StudentProfileID: studentProfileId,
      },
    });

    if (deleteResult.count === 0) {
      throw new AppError(REGISTRATION_ERROR_MESSAGES.REGISTRATION_CANCEL_NOT_FOUND, {
        statusCode: 404,
        code: REGISTRATION_ERROR_CODES.REGISTRATION_CANCEL_NOT_FOUND,
        details: businessErrorDetails(
          REGISTRATION_ERROR_MESSAGES.REGISTRATION_CANCEL_NOT_FOUND,
        ),
      });
    }

    await tx.section.updateMany({
      where: {
        SectionID: sectionId,
        EnrollmentCount: {
          gt: 0,
        },
      },
      data: {
        EnrollmentCount: {
          decrement: 1,
        },
      },
    });
  });
};

export const getRegistrationsBySection = async (
  sectionId: number,
  input: GetSectionRegistrationsQueryInput,
) => {
  const section = await prisma.section.findUnique({
    where: { SectionID: sectionId },
    select: {
      SectionID: true,
      status: true,
    },
  });

  if (!section) {
    throw new AppError(
      REGISTRATION_ERROR_MESSAGES.REGISTRATION_SECTION_LIST_SECTION_NOT_FOUND,
      {
        statusCode: 404,
        code: REGISTRATION_ERROR_CODES.REGISTRATION_SECTION_LIST_SECTION_NOT_FOUND,
        details: businessErrorDetails(
          REGISTRATION_ERROR_MESSAGES.REGISTRATION_SECTION_LIST_SECTION_NOT_FOUND,
        ),
      },
    );
  }

  if (input.status !== undefined && section.status !== input.status) {
    return {
      registrations: [],
      total: 0,
    };
  }

  const skip = (input.page - 1) * input.limit;
  const normalizedSearch = input.search?.trim();
  const andClauses: Prisma.RegistrationWhereInput[] = [
    {
      SectionID: sectionId,
    },
  ];

  if (normalizedSearch) {
    andClauses.push({
      OR: [
        {
          student: {
            is: {
              FullName: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
          },
        },
        {
          student: {
            is: {
              account: {
                is: {
                  Email: {
                    contains: normalizedSearch,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        },
      ],
    });
  }

  const where: Prisma.RegistrationWhereInput =
    andClauses.length === 1 ? andClauses[0] : { AND: andClauses };

  const [registrations, total] = await Promise.all([
    prisma.registration.findMany({
      where,
      skip,
      take: input.limit,
      orderBy: {
        StudentProfileID: "asc",
      },
      select: {
        StudentProfileID: true,
        student: {
          select: {
            FullName: true,
            account: {
              select: {
                Email: true,
              },
            },
          },
        },
      },
    }),
    prisma.registration.count({ where }),
  ]);

  return {
    registrations: registrations.map((registration) => ({
      studentProfileId: registration.StudentProfileID,
      fullName: registration.student.FullName,
      email: registration.student.account.Email,
    })),
    total,
  };
};

