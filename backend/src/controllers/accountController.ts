import { NextFunction, Request, Response } from "express";
import { RoleEnum } from "@prisma/client";
import { z } from "zod";
import { AppError } from "../middleware/errorHandler";
import { sendSuccess } from "../utils/response";
import { parseOrThrow } from "../utils/validation";
import {
  createAccount,
  getAccounts,
} from "../services/accountService";
import { ACCOUNT_ERROR_CODES } from "../constants/errors/account/codes";
import {
  ACCOUNT_ERROR_MESSAGES,
  ACCOUNT_FIELD_ERROR_MESSAGES,
} from "../constants/errors/account/messages";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const ACCOUNT_ROLE_VALUES = ["ADMIN", "LECTURER", "STUDENT", "PARENT"] as const;
const PROFILE_STATUS_VALUES = ["ACTIVE", "INACTIVE", "BANNED"] as const;

const requiredString = (
  requiredMessage: string,
  invalidTypeMessage: string,
) =>
  z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return requiredMessage;
      }
      return invalidTypeMessage;
    },
  });

const getAccountsQuerySchema = z.object({
  page: z.coerce
    .number()
    .int(ACCOUNT_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_INTEGER)
    .positive(ACCOUNT_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_POSITIVE)
    .default(1),
  limit: z.coerce
    .number()
    .int(ACCOUNT_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_INTEGER)
    .positive(ACCOUNT_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_POSITIVE)
    .default(10),
  search: z
    .string({
      error: ACCOUNT_FIELD_ERROR_MESSAGES.USERNAME_INVALID_TYPE,
    })
    .optional(),
  role: z
    .enum(ACCOUNT_ROLE_VALUES, {
      error: ACCOUNT_FIELD_ERROR_MESSAGES.QUERY_ROLE_INVALID,
    })
    .optional(),
  status: z
    .enum(PROFILE_STATUS_VALUES, {
      error: ACCOUNT_FIELD_ERROR_MESSAGES.QUERY_STATUS_INVALID,
    })
    .optional(),
});

const createAccountSchema = z.object({
  username: requiredString(
    ACCOUNT_FIELD_ERROR_MESSAGES.USERNAME_REQUIRED,
    ACCOUNT_FIELD_ERROR_MESSAGES.USERNAME_INVALID_TYPE,
  )
    .trim()
    .min(1, ACCOUNT_FIELD_ERROR_MESSAGES.USERNAME_REQUIRED)
    .max(255, ACCOUNT_FIELD_ERROR_MESSAGES.USERNAME_MAX_LENGTH),
  email: requiredString(
    ACCOUNT_FIELD_ERROR_MESSAGES.EMAIL_REQUIRED,
    ACCOUNT_FIELD_ERROR_MESSAGES.EMAIL_INVALID_TYPE,
  )
    .trim()
    .email(ACCOUNT_FIELD_ERROR_MESSAGES.EMAIL_INVALID_FORMAT)
    .max(255, ACCOUNT_FIELD_ERROR_MESSAGES.EMAIL_MAX_LENGTH),
  password: requiredString(
    ACCOUNT_FIELD_ERROR_MESSAGES.PASSWORD_REQUIRED,
    ACCOUNT_FIELD_ERROR_MESSAGES.PASSWORD_INVALID_TYPE,
  )
    .min(8, ACCOUNT_FIELD_ERROR_MESSAGES.PASSWORD_MIN_LENGTH)
    .regex(passwordRegex, ACCOUNT_FIELD_ERROR_MESSAGES.PASSWORD_WEAK),
  role: z.enum(ACCOUNT_ROLE_VALUES, {
    error: (issue) => {
      if (issue.input === undefined) {
        return ACCOUNT_FIELD_ERROR_MESSAGES.ROLE_REQUIRED;
      }
      return ACCOUNT_FIELD_ERROR_MESSAGES.ROLE_INVALID;
    },
  }),
});

export async function getAccountsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (Object.prototype.hasOwnProperty.call(req.query, "roles")) {
      throw new AppError(
        ACCOUNT_ERROR_MESSAGES.ACCOUNT_LIST_LEGACY_ROLE_FILTER_UNSUPPORTED,
        {
          statusCode: 400,
          code: ACCOUNT_ERROR_CODES.ACCOUNT_LIST_LEGACY_ROLE_FILTER_UNSUPPORTED,
          details: {
            formErrors: [],
            fieldErrors: {
              roles: [
                ACCOUNT_ERROR_MESSAGES.ACCOUNT_LIST_LEGACY_ROLE_FILTER_UNSUPPORTED,
              ],
            },
          },
        },
      );
    }

    const { page, limit, search, role, status } = parseOrThrow(
      getAccountsQuerySchema,
      req.query,
      {
        code: ACCOUNT_ERROR_CODES.ACCOUNT_LIST_INVALID_QUERY,
        message: ACCOUNT_ERROR_MESSAGES.ACCOUNT_LIST_INVALID_QUERY,
      },
    );

    const result = await getAccounts({
      page,
      limit,
      search,
      role: role as RoleEnum | undefined,
      status,
    });

    sendSuccess(res, result.accounts, 200, {
      page,
      limit,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}

export async function createAccountHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = parseOrThrow(createAccountSchema, req.body, {
      code: ACCOUNT_ERROR_CODES.ACCOUNT_CREATE_INVALID_INPUT,
      message: ACCOUNT_ERROR_MESSAGES.ACCOUNT_CREATE_INVALID_INPUT,
    });

    const result = await createAccount({
      username: parsed.username,
      email: parsed.email,
      password: parsed.password,
      role: parsed.role as RoleEnum,
    });

    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}
