import { prisma } from "../prisma/prismaClient";

export interface ErrorDetails {
  formErrors: string[];
  fieldErrors: Record<string, string[]>;
}

export class SubjectError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: ErrorDetails;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    details: ErrorDetails
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

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
    throw new SubjectError(
      "Tên môn học đã tồn tại",
      409,
      "SUBJECT_NAME_EXISTED",
      {
        formErrors: [],
        fieldErrors: {
          subjectName: ["Tên môn học đã tồn tại"],
        },
      }
    );
  }

  const subject = await prisma.subject.create({
    data: {
      SubjectName: subjectName,
      Periods: periods,
    },
  });

  return subject;
};
