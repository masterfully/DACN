import { Request, Response } from "express";
import { AUTH_ERROR_CODES } from "../constants/errors/auth/codes";
import { AUTH_ERROR_MESSAGES } from "../constants/errors/auth/messages";
import { REGISTRATION_ERROR_CODES } from "../constants/errors/registration/codes";
import { REGISTRATION_ERROR_MESSAGES } from "../constants/errors/registration/messages";
import { AppError } from "../middleware/errorHandler";
import {
  createRegistrationSchema,
  registerSection,
} from "../services/registrationService";
import { sendSuccess } from "../utils/response";
import { parseOrThrow } from "../utils/validation";

export const createRegistrationHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const payload = parseOrThrow(createRegistrationSchema, req.body, {
    code: REGISTRATION_ERROR_CODES.REGISTRATION_CREATE_INVALID_INPUT,
    message: REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_INVALID_INPUT,
  });

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

  await registerSection(req.user.accountId, payload);
  sendSuccess(res, null, 201);
};
