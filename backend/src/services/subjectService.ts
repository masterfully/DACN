import { prisma } from "../prisma/prismaClient";
import { AppError } from "../middleware/errorHandler";
import { SUBJECT_ERROR_CODES } from "../constants/errors/subject/codes";
import { SUBJECT_ERROR_MESSAGES } from "../constants/errors/subject/messages";

export const getSubjects = async (
  page: number = 1,
  limit: number = 10,
  search?: string
) => {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        SubjectName: {
          contains: search,
          mode: "insensitive" as const,
        },
      }
    : {};

  const [subjects, total] = await Promise.all([
    prisma.subject.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        SubjectID: "asc",
      },
    }),
    prisma.subject.count({ where }),
  ]);

  return {
    subjects,
    total,
  };
};

export const createSubject = async (subjectName: string, periods: number) => {
  // Check if subject with same name already exists
  const existingSubject = await prisma.subject.findFirst({
    where: {
      SubjectName: subjectName,
    },
  });

  if (existingSubject) {
    throw new AppError(SUBJECT_ERROR_MESSAGES.SUBJECT_CREATE_NAME_EXISTS, {
      statusCode: 409,
      code: SUBJECT_ERROR_CODES.SUBJECT_CREATE_NAME_EXISTS,
      details: {
        formErrors: [],
        fieldErrors: {
          subjectName: [SUBJECT_ERROR_MESSAGES.SUBJECT_CREATE_NAME_EXISTS],
        },
      },
    });
  }

  const subject = await prisma.subject.create({
    data: {
      SubjectName: subjectName,
      Periods: periods,
    },
  });

  return subject;
};
