import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  createSubject,
  deleteSubject,
  getSubjectById,
  getSubjects,
  updateSubject,
} from "../services/subjectService";
import { sendSuccess } from "../utils/response";
import { parseOrThrow, parsePositiveIntParamOrThrow } from "../utils/validation";
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

// Validation schema for updating subject
const updateSubjectSchema = z
  .object({
    subjectName: z
      .string({
        error: SUBJECT_FIELD_ERROR_MESSAGES.SUBJECT_NAME_INVALID_TYPE,
      })
      .trim()
      .min(1, SUBJECT_FIELD_ERROR_MESSAGES.SUBJECT_NAME_REQUIRED)
      .optional(),
    periods: z
      .number({
        error: SUBJECT_FIELD_ERROR_MESSAGES.PERIODS_INVALID_TYPE,
      })
      .int(SUBJECT_FIELD_ERROR_MESSAGES.PERIODS_INVALID_INTEGER)
      .positive(SUBJECT_FIELD_ERROR_MESSAGES.PERIODS_INVALID_POSITIVE)
      .optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: SUBJECT_FIELD_ERROR_MESSAGES.UPDATE_AT_LEAST_ONE_FIELD,
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

export async function getSubjectDetailHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const subjectId = parsePositiveIntParamOrThrow(req.params.subjectId, {
      code: SUBJECT_ERROR_CODES.SUBJECT_PARAM_INVALID_ID,
      message: SUBJECT_ERROR_MESSAGES.SUBJECT_PARAM_INVALID_ID,
      fieldName: "subjectId",
      fieldMessage: SUBJECT_FIELD_ERROR_MESSAGES.SUBJECT_ID_INVALID,
    });

    const subject = await getSubjectById(subjectId);
    sendSuccess(res, subject, 200);
  } catch (error) {
    next(error);
  }
}

export async function updateSubjectHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const subjectId = parsePositiveIntParamOrThrow(req.params.subjectId, {
      code: SUBJECT_ERROR_CODES.SUBJECT_PARAM_INVALID_ID,
      message: SUBJECT_ERROR_MESSAGES.SUBJECT_PARAM_INVALID_ID,
      fieldName: "subjectId",
      fieldMessage: SUBJECT_FIELD_ERROR_MESSAGES.SUBJECT_ID_INVALID,
    });

    const payload = parseOrThrow(updateSubjectSchema, req.body, {
      code: SUBJECT_ERROR_CODES.SUBJECT_UPDATE_INVALID_INPUT,
      message: SUBJECT_ERROR_MESSAGES.SUBJECT_UPDATE_INVALID_INPUT,
    });

    const updatedSubject = await updateSubject(subjectId, payload);
    sendSuccess(res, updatedSubject, 200);
  } catch (error) {
    next(error);
  }
}

export async function deleteSubjectHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const subjectId = parsePositiveIntParamOrThrow(req.params.subjectId, {
      code: SUBJECT_ERROR_CODES.SUBJECT_PARAM_INVALID_ID,
      message: SUBJECT_ERROR_MESSAGES.SUBJECT_PARAM_INVALID_ID,
      fieldName: "subjectId",
      fieldMessage: SUBJECT_FIELD_ERROR_MESSAGES.SUBJECT_ID_INVALID,
    });

    await deleteSubject(subjectId);
    sendSuccess(res, null, 200);
  } catch (error) {
    next(error);
  }
}
