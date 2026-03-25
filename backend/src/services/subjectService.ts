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

export const getSubjectById = async (subjectId: number) => {
  const subject = await prisma.subject.findUnique({
    where: {
      SubjectID: subjectId,
    },
  });

  if (!subject) {
    throw new AppError(SUBJECT_ERROR_MESSAGES.SUBJECT_GET_NOT_FOUND, {
      statusCode: 404,
      code: SUBJECT_ERROR_CODES.SUBJECT_GET_NOT_FOUND,
      details: {
        formErrors: [SUBJECT_ERROR_MESSAGES.SUBJECT_GET_NOT_FOUND],
        fieldErrors: {},
      },
    });
  }

  return subject;
};

export const updateSubject = async (
  subjectId: number,
  payload: {
    subjectName?: string;
    periods?: number;
  },
) => {
  const subject = await prisma.subject.findUnique({
    where: {
      SubjectID: subjectId,
    },
  });

  if (!subject) {
    throw new AppError(SUBJECT_ERROR_MESSAGES.SUBJECT_UPDATE_NOT_FOUND, {
      statusCode: 404,
      code: SUBJECT_ERROR_CODES.SUBJECT_UPDATE_NOT_FOUND,
      details: {
        formErrors: [SUBJECT_ERROR_MESSAGES.SUBJECT_UPDATE_NOT_FOUND],
        fieldErrors: {},
      },
    });
  }

  if (payload.subjectName !== undefined && payload.subjectName !== subject.SubjectName) {
    const existingSubject = await prisma.subject.findFirst({
      where: {
        SubjectName: payload.subjectName,
        NOT: {
          SubjectID: subjectId,
        },
      },
    });

    if (existingSubject) {
      throw new AppError(SUBJECT_ERROR_MESSAGES.SUBJECT_UPDATE_NAME_EXISTS, {
        statusCode: 409,
        code: SUBJECT_ERROR_CODES.SUBJECT_UPDATE_NAME_EXISTS,
        details: {
          formErrors: [],
          fieldErrors: {
            subjectName: [SUBJECT_ERROR_MESSAGES.SUBJECT_UPDATE_NAME_EXISTS],
          },
        },
      });
    }
  }

  const data: {
    SubjectName?: string;
    Periods?: number;
  } = {};

  if (payload.subjectName !== undefined) {
    data.SubjectName = payload.subjectName;
  }

  if (payload.periods !== undefined) {
    data.Periods = payload.periods;
  }

  return prisma.subject.update({
    where: {
      SubjectID: subjectId,
    },
    data,
  });
};

export const deleteSubject = async (subjectId: number): Promise<void> => {
  const subject = await prisma.subject.findUnique({
    where: {
      SubjectID: subjectId,
    },
    select: {
      SubjectID: true,
    },
  });

  if (!subject) {
    throw new AppError(SUBJECT_ERROR_MESSAGES.SUBJECT_DELETE_NOT_FOUND, {
      statusCode: 404,
      code: SUBJECT_ERROR_CODES.SUBJECT_DELETE_NOT_FOUND,
      details: {
        formErrors: [SUBJECT_ERROR_MESSAGES.SUBJECT_DELETE_NOT_FOUND],
        fieldErrors: {},
      },
    });
  }

  const linkedSectionCount = await prisma.section.count({
    where: {
      SubjectID: subjectId,
    },
  });

  if (linkedSectionCount > 0) {
    throw new AppError(SUBJECT_ERROR_MESSAGES.SUBJECT_DELETE_IN_USE, {
      statusCode: 409,
      code: SUBJECT_ERROR_CODES.SUBJECT_DELETE_IN_USE,
      details: {
        formErrors: [SUBJECT_ERROR_MESSAGES.SUBJECT_DELETE_IN_USE],
        fieldErrors: {},
      },
    });
  }

  await prisma.subject.delete({
    where: {
      SubjectID: subjectId,
    },
  });
};
