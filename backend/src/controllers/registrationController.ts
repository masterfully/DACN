import { Request, Response } from "express";
import { AUTH_ERROR_CODES } from "../constants/errors/auth/codes";
import { AUTH_ERROR_MESSAGES } from "../constants/errors/auth/messages";
import { REGISTRATION_ERROR_CODES } from "../constants/errors/registration/codes";
import { REGISTRATION_ERROR_MESSAGES } from "../constants/errors/registration/messages";
import { AppError } from "../middleware/errorHandler";
import {
  cancelRegistration,
  createRegistrationSchema,
  getMyRegistrations,
  getMyRegistrationsQuerySchema,
  getRegistrations,
  getRegistrationsBySection,
  getRegistrationsQuerySchema,
  getSectionRegistrationsQuerySchema,
  registerSection,
} from "../services/registrationService";
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

export const getRegistrationsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const query = parseOrThrow(getRegistrationsQuerySchema, req.query, {
    code: REGISTRATION_ERROR_CODES.REGISTRATION_LIST_INVALID_QUERY,
    message: REGISTRATION_ERROR_MESSAGES.REGISTRATION_LIST_INVALID_QUERY,
  });

  const result = await getRegistrations(query);
  sendSuccess(res, result.registrations, 200, {
    page: query.page,
    limit: query.limit,
    total: result.total,
  });
};

export const createRegistrationHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const payload = parseOrThrow(createRegistrationSchema, req.body, {
    code: REGISTRATION_ERROR_CODES.REGISTRATION_CREATE_INVALID_INPUT,
    message: REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_INVALID_INPUT,
  });

  const user = requireUser(req);
  await registerSection(user.accountId, payload);
  sendSuccess(res, null, 201);
};

export const getMyRegistrationsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const query = parseOrThrow(getMyRegistrationsQuerySchema, req.query, {
    code: REGISTRATION_ERROR_CODES.REGISTRATION_MY_LIST_INVALID_QUERY,
    message: REGISTRATION_ERROR_MESSAGES.REGISTRATION_MY_LIST_INVALID_QUERY,
  });

  const user = requireUser(req);
  const result = await getMyRegistrations(user.accountId, query);

  sendSuccess(res, result.registrations, 200, {
    page: query.page,
    limit: query.limit,
    total: result.total,
  });
};

export const deleteRegistrationHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const sectionId = parsePositiveIntParamOrThrow(req.params.sectionId, {
    code: REGISTRATION_ERROR_CODES.REGISTRATION_PARAM_INVALID_SECTION_ID,
    message: REGISTRATION_ERROR_MESSAGES.REGISTRATION_PARAM_INVALID_SECTION_ID,
    fieldName: "sectionId",
    fieldMessage: REGISTRATION_ERROR_MESSAGES.REGISTRATION_PARAM_INVALID_SECTION_ID,
  });

  const user = requireUser(req);
  await cancelRegistration(user.accountId, sectionId);
  sendSuccess(res, null, 200);
};

export const getRegistrationsBySectionHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const sectionId = parsePositiveIntParamOrThrow(req.params.sectionId, {
    code: REGISTRATION_ERROR_CODES.REGISTRATION_PARAM_INVALID_SECTION_ID,
    message: REGISTRATION_ERROR_MESSAGES.REGISTRATION_PARAM_INVALID_SECTION_ID,
    fieldName: "sectionId",
    fieldMessage: REGISTRATION_ERROR_MESSAGES.REGISTRATION_PARAM_INVALID_SECTION_ID,
  });

  const query = parseOrThrow(getSectionRegistrationsQuerySchema, req.query, {
    code: REGISTRATION_ERROR_CODES.REGISTRATION_SECTION_LIST_INVALID_QUERY,
    message: REGISTRATION_ERROR_MESSAGES.REGISTRATION_SECTION_LIST_INVALID_QUERY,
  });

  const result = await getRegistrationsBySection(sectionId, query);
  sendSuccess(res, result.registrations, 200, {
    page: query.page,
    limit: query.limit,
    total: result.total,
  });
};

