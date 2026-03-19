import { Request, Response } from "express";
import { z } from "zod";
import { sendSuccess } from "../utils/response";
import * as authService from "../services/authService";
import { parseOrThrow } from "../utils/validation";
import { AUTH_ERROR_CODES } from "../constants/errors/auth/codes";
import {
  AUTH_ERROR_MESSAGES,
  AUTH_FIELD_ERROR_MESSAGES,
} from "../constants/errors/auth/messages";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const requiredString = (requiredMessage: string) =>
  z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return requiredMessage;
      }
      return AUTH_FIELD_ERROR_MESSAGES.STRING_INVALID_TYPE;
    },
  });

const loginSchema = z.object({
  username: requiredString(AUTH_FIELD_ERROR_MESSAGES.USERNAME_REQUIRED)
    .trim()
    .min(1, AUTH_FIELD_ERROR_MESSAGES.USERNAME_REQUIRED)
    .max(255, AUTH_FIELD_ERROR_MESSAGES.USERNAME_MAX_LENGTH),
  password: requiredString(AUTH_FIELD_ERROR_MESSAGES.PASSWORD_REQUIRED)
    .min(1, AUTH_FIELD_ERROR_MESSAGES.PASSWORD_REQUIRED),
});

const logoutSchema = z.object({
  refreshToken: requiredString(AUTH_FIELD_ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED)
    .trim()
    .min(1, AUTH_FIELD_ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED),
});

const refreshTokenSchema = z.object({
  refreshToken: requiredString(AUTH_FIELD_ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED)
    .trim()
    .min(1, AUTH_FIELD_ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED),
});

const registerSchema = z
  .object({
    fullName: requiredString(AUTH_FIELD_ERROR_MESSAGES.FULL_NAME_REQUIRED)
      .trim()
      .min(1, AUTH_FIELD_ERROR_MESSAGES.FULL_NAME_REQUIRED)
      .max(255, AUTH_FIELD_ERROR_MESSAGES.FULL_NAME_MAX_LENGTH),
    username: requiredString(AUTH_FIELD_ERROR_MESSAGES.USERNAME_REQUIRED)
      .trim()
      .min(1, AUTH_FIELD_ERROR_MESSAGES.USERNAME_REQUIRED)
      .max(255, AUTH_FIELD_ERROR_MESSAGES.USERNAME_MAX_LENGTH),
    email: requiredString(AUTH_FIELD_ERROR_MESSAGES.EMAIL_REQUIRED)
      .trim()
      .email(AUTH_FIELD_ERROR_MESSAGES.EMAIL_INVALID_FORMAT)
      .max(255, AUTH_FIELD_ERROR_MESSAGES.EMAIL_MAX_LENGTH),
    password: requiredString(AUTH_FIELD_ERROR_MESSAGES.PASSWORD_REQUIRED)
      .min(8, AUTH_FIELD_ERROR_MESSAGES.PASSWORD_MIN_LENGTH)
      .regex(
        passwordRegex,
        AUTH_FIELD_ERROR_MESSAGES.PASSWORD_WEAK,
      ),
    confirmPassword: requiredString(
      AUTH_FIELD_ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED,
    ).min(
      1,
      AUTH_FIELD_ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED,
    ),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: AUTH_FIELD_ERROR_MESSAGES.CONFIRM_PASSWORD_MISMATCH,
      });
    }
  });

export const register = async (req: Request, res: Response): Promise<void> => {
  const parsed = parseOrThrow(registerSchema, req.body, {
    code: AUTH_ERROR_CODES.AUTH_REGISTER_INVALID_INPUT,
    message: AUTH_ERROR_MESSAGES.AUTH_REGISTER_INVALID_INPUT,
  });

  const result = await authService.register({
    fullName: parsed.fullName,
    username: parsed.username,
    email: parsed.email,
    password: parsed.password,
  });

  sendSuccess(res, result, 201);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const parsed = parseOrThrow(loginSchema, req.body, {
    code: AUTH_ERROR_CODES.AUTH_LOGIN_INVALID_INPUT,
    message: AUTH_ERROR_MESSAGES.AUTH_LOGIN_INVALID_INPUT,
  });

  const result = await authService.login({
    username: parsed.username,
    password: parsed.password,
  });

  sendSuccess(res, result, 200);
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const parsed = parseOrThrow(logoutSchema, req.body, {
    code: AUTH_ERROR_CODES.AUTH_LOGOUT_INVALID_INPUT,
    message: AUTH_ERROR_MESSAGES.AUTH_LOGOUT_INVALID_INPUT,
  });

  const result = await authService.logout({
    refreshToken: parsed.refreshToken,
  });

  sendSuccess(res, result, 200);
};

export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const parsed = parseOrThrow(refreshTokenSchema, req.body, {
    code: AUTH_ERROR_CODES.AUTH_REFRESH_TOKEN_INVALID_INPUT,
    message: AUTH_ERROR_MESSAGES.AUTH_REFRESH_TOKEN_INVALID_INPUT,
  });

  const result = await authService.refreshToken({
    refreshToken: parsed.refreshToken,
  });

  sendSuccess(res, result, 200);
};
