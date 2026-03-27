import { Request, Response } from "express";
import { AUTH_ERROR_CODES } from "../constants/errors/auth/codes";
import { AUTH_ERROR_MESSAGES } from "../constants/errors/auth/messages";
import { SECTION_ERROR_CODES } from "../constants/errors/section/codes";
import {
  SECTION_ERROR_MESSAGES,
  SECTION_FIELD_ERROR_MESSAGES,
} from "../constants/errors/section/messages";
import { AppError } from "../middleware/errorHandler";
import {
  createSection,
  createSectionSchema,
  deleteSection,
  getMySections,
  getMySectionsQuerySchema,
  getSectionDetail,
  getSectionStudents,
  getSectionStudentsQuerySchema,
  getSections,
  getSectionsQuerySchema,
  updateSection,
  updateSectionSchema,
  updateSectionStatus,
  updateSectionStatusSchema,
  updateSectionVisibility,
  updateSectionVisibilitySchema,
} from "../services/sectionService";
import { sendSuccess } from "../utils/response";
import { parseOrThrow, parsePositiveIntParamOrThrow } from "../utils/validation";

const requireUser = (req: Request): { accountId: number } => {
  if (!req.user) {
    throw new AppError(AUTH_ERROR_MESSAGES.LOGIN_REQUIRED, {
      statusCode: 401,
      code: AUTH_ERROR_CODES.UNAUTHORIZED,
      details: {
        formErrors: [AUTH_ERROR_MESSAGES.LOGIN_REQUIRED],
        fieldErrors: {},
      },
    });
  }

  return {
    accountId: req.user.accountId,
  };
};

export const getSectionsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const query = parseOrThrow(getSectionsQuerySchema, req.query, {
    code: SECTION_ERROR_CODES.SECTION_LIST_INVALID_QUERY,
    message: SECTION_ERROR_MESSAGES.SECTION_LIST_INVALID_QUERY,
  });

  const result = await getSections(query);
  sendSuccess(res, result.sections, 200, {
    page: query.page,
    limit: query.limit,
    total: result.total,
  });
};

export const createSectionHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const payload = parseOrThrow(createSectionSchema, req.body, {
    code: SECTION_ERROR_CODES.SECTION_CREATE_INVALID_INPUT,
    message: SECTION_ERROR_MESSAGES.SECTION_CREATE_INVALID_INPUT,
  });

  const section = await createSection(payload);
  sendSuccess(res, section, 201);
};

export const getMySectionsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const query = parseOrThrow(getMySectionsQuerySchema, req.query, {
    code: SECTION_ERROR_CODES.SECTION_MY_LIST_INVALID_QUERY,
    message: SECTION_ERROR_MESSAGES.SECTION_MY_LIST_INVALID_QUERY,
  });

  const user = requireUser(req);
  const result = await getMySections(user.accountId, query);
  sendSuccess(res, result.sections, 200, {
    page: query.page,
    limit: query.limit,
    total: result.total,
  });
};

export const getSectionDetailHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const sectionId = parsePositiveIntParamOrThrow(req.params.sectionId, {
    code: SECTION_ERROR_CODES.SECTION_PARAM_INVALID_ID,
    message: SECTION_ERROR_MESSAGES.SECTION_PARAM_INVALID_ID,
    fieldName: "sectionId",
    fieldMessage: SECTION_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID,
  });

  const section = await getSectionDetail(sectionId);
  sendSuccess(res, section, 200);
};

export const updateSectionHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const sectionId = parsePositiveIntParamOrThrow(req.params.sectionId, {
    code: SECTION_ERROR_CODES.SECTION_PARAM_INVALID_ID,
    message: SECTION_ERROR_MESSAGES.SECTION_PARAM_INVALID_ID,
    fieldName: "sectionId",
    fieldMessage: SECTION_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID,
  });

  const payload = parseOrThrow(updateSectionSchema, req.body, {
    code: SECTION_ERROR_CODES.SECTION_UPDATE_INVALID_INPUT,
    message: SECTION_ERROR_MESSAGES.SECTION_UPDATE_INVALID_INPUT,
  });

  const section = await updateSection(sectionId, payload);
  sendSuccess(res, section, 200);
};

export const deleteSectionHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const sectionId = parsePositiveIntParamOrThrow(req.params.sectionId, {
    code: SECTION_ERROR_CODES.SECTION_PARAM_INVALID_ID,
    message: SECTION_ERROR_MESSAGES.SECTION_PARAM_INVALID_ID,
    fieldName: "sectionId",
    fieldMessage: SECTION_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID,
  });

  await deleteSection(sectionId);
  sendSuccess(res, null, 200);
};

export const getSectionStudentsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const sectionId = parsePositiveIntParamOrThrow(req.params.sectionId, {
    code: SECTION_ERROR_CODES.SECTION_PARAM_INVALID_ID,
    message: SECTION_ERROR_MESSAGES.SECTION_PARAM_INVALID_ID,
    fieldName: "sectionId",
    fieldMessage: SECTION_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID,
  });

  const query = parseOrThrow(getSectionStudentsQuerySchema, req.query, {
    code: SECTION_ERROR_CODES.SECTION_STUDENTS_INVALID_QUERY,
    message: SECTION_ERROR_MESSAGES.SECTION_STUDENTS_INVALID_QUERY,
  });

  const result = await getSectionStudents(sectionId, query);
  sendSuccess(res, result.students, 200, {
    page: query.page,
    limit: query.limit,
    total: result.total,
  });
};

export const updateSectionStatusHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const sectionId = parsePositiveIntParamOrThrow(req.params.sectionId, {
    code: SECTION_ERROR_CODES.SECTION_PARAM_INVALID_ID,
    message: SECTION_ERROR_MESSAGES.SECTION_PARAM_INVALID_ID,
    fieldName: "sectionId",
    fieldMessage: SECTION_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID,
  });

  const payload = parseOrThrow(updateSectionStatusSchema, req.body, {
    code: SECTION_ERROR_CODES.SECTION_STATUS_INVALID_INPUT,
    message: SECTION_ERROR_MESSAGES.SECTION_STATUS_INVALID_INPUT,
  });

  await updateSectionStatus(sectionId, payload.status);
  sendSuccess(res, null, 200);
};

export const updateSectionVisibilityHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const sectionId = parsePositiveIntParamOrThrow(req.params.sectionId, {
    code: SECTION_ERROR_CODES.SECTION_PARAM_INVALID_ID,
    message: SECTION_ERROR_MESSAGES.SECTION_PARAM_INVALID_ID,
    fieldName: "sectionId",
    fieldMessage: SECTION_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID,
  });

  const payload = parseOrThrow(updateSectionVisibilitySchema, req.body, {
    code: SECTION_ERROR_CODES.SECTION_VISIBILITY_INVALID_INPUT,
    message: SECTION_ERROR_MESSAGES.SECTION_VISIBILITY_INVALID_INPUT,
  });

  await updateSectionVisibility(sectionId, payload.visibility);
  sendSuccess(res, null, 200);
};

