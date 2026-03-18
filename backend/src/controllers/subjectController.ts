import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { createSubject, getSubjects } from "../services/subjectService";
import { sendSuccess } from "../utils/response";
import { parseOrThrow } from "../utils/validation";
import { SUBJECT_ERROR_CODES } from "../constants/errors/subject/codes";
import {
  SUBJECT_ERROR_MESSAGES,
  SUBJECT_FIELD_ERROR_MESSAGES,
} from "../constants/errors/subject/messages";

// Validation schema for creating subject
const createSubjectSchema = z.object({
  subjectName: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) {
          return SUBJECT_FIELD_ERROR_MESSAGES.SUBJECT_NAME_REQUIRED;
        }
        return SUBJECT_FIELD_ERROR_MESSAGES.SUBJECT_NAME_INVALID_TYPE;
      },
    })
    .trim()
    .min(1, SUBJECT_FIELD_ERROR_MESSAGES.SUBJECT_NAME_REQUIRED),
  periods: z
    .number({
      error: (issue) => {
        if (issue.input === undefined) {
          return SUBJECT_FIELD_ERROR_MESSAGES.PERIODS_REQUIRED;
        }
        return SUBJECT_FIELD_ERROR_MESSAGES.PERIODS_INVALID_TYPE;
      },
    })
    .int(SUBJECT_FIELD_ERROR_MESSAGES.PERIODS_INVALID_INTEGER)
    .positive(SUBJECT_FIELD_ERROR_MESSAGES.PERIODS_INVALID_POSITIVE),
});

// Validation schema for query params
const getSubjectsQuerySchema = z.object({
  page: z.coerce
    .number()
    .int(SUBJECT_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_INTEGER)
    .positive(SUBJECT_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_POSITIVE)
    .default(1),
  limit: z.coerce
    .number()
    .int(SUBJECT_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_INTEGER)
    .positive(SUBJECT_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_POSITIVE)
    .default(10),
  search: z.string().optional(),
});

export async function getSubjectsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { page, limit, search } = parseOrThrow(getSubjectsQuerySchema, req.query, {
      code: SUBJECT_ERROR_CODES.SUBJECT_LIST_INVALID_QUERY,
      message: SUBJECT_ERROR_MESSAGES.SUBJECT_LIST_INVALID_QUERY,
    });

    const { subjects, total } = await getSubjects(page, limit, search);

    sendSuccess(res, subjects, 200, {
      page,
      limit,
      total,
    });
  } catch (error) {
    next(error);
  }
}

export async function createSubjectHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { subjectName, periods } = parseOrThrow(createSubjectSchema, req.body, {
      code: SUBJECT_ERROR_CODES.SUBJECT_CREATE_INVALID_INPUT,
      message: SUBJECT_ERROR_MESSAGES.SUBJECT_CREATE_INVALID_INPUT,
    });

    // Create subject
    const subject = await createSubject(subjectName, periods);

    sendSuccess(res, subject, 201);
  } catch (error) {
    next(error);
  }
}