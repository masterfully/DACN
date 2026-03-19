import { NextFunction, Request, Response } from "express";
import { RoleEnum } from "@prisma/client";
import { z } from "zod";
import { AppError } from "../middleware/errorHandler";
import { parseOrThrow } from "../utils/validation";
import { sendSuccess } from "../utils/response";
import {
  createProfile,
  getMyProfile,
  listLecturerProfiles,
  listProfiles,
  listStudentProfiles,
} from "../services/profileService";
import { PROFILE_ERROR_CODES } from "../constants/errors/profile/codes";
import {
  PROFILE_ERROR_MESSAGES,
  PROFILE_FIELD_ERROR_MESSAGES,
} from "../constants/errors/profile/messages";

const ACCOUNT_ROLE_VALUES = ["ADMIN", "LECTURER", "STUDENT", "PARENT"] as const;
const PROFILE_STATUS_VALUES = ["ACTIVE", "INACTIVE", "BANNED"] as const;
const PROFILE_GENDER_VALUES = ["MALE", "FEMALE"] as const;

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

const optionalShortString = (invalidTypeMessage: string, maxLengthMessage: string) =>
  z
    .string({
      error: invalidTypeMessage,
    })
    .trim()
    .max(255, maxLengthMessage)
    .optional();

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

const listProfilesQuerySchema = z.object({
  page: z.coerce
    .number()
    .int(PROFILE_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_INTEGER)
    .positive(PROFILE_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_POSITIVE)
    .default(1),
  limit: z.coerce
    .number()
    .int(PROFILE_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_INTEGER)
    .positive(PROFILE_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_POSITIVE)
    .default(10),
  search: z
    .string({
      error: PROFILE_FIELD_ERROR_MESSAGES.SEARCH_INVALID_TYPE,
    })
    .optional(),
  role: z
    .enum(ACCOUNT_ROLE_VALUES, {
      error: PROFILE_FIELD_ERROR_MESSAGES.QUERY_ROLE_INVALID,
    })
    .optional(),
  status: z
    .enum(PROFILE_STATUS_VALUES, {
      error: PROFILE_FIELD_ERROR_MESSAGES.QUERY_STATUS_INVALID,
    })
    .optional(),
  gender: z
    .enum(PROFILE_GENDER_VALUES, {
      error: PROFILE_FIELD_ERROR_MESSAGES.QUERY_GENDER_INVALID,
    })
    .optional(),
});

const createProfileSchema = z.object({
  accountId: z.coerce
    .number({
      error: (issue) => {
        if (issue.input === undefined) {
          return PROFILE_FIELD_ERROR_MESSAGES.ACCOUNT_ID_REQUIRED;
        }
        return PROFILE_FIELD_ERROR_MESSAGES.ACCOUNT_ID_INVALID_TYPE;
      },
    })
    .int(PROFILE_FIELD_ERROR_MESSAGES.ACCOUNT_ID_INVALID_INTEGER)
    .positive(PROFILE_FIELD_ERROR_MESSAGES.ACCOUNT_ID_INVALID_POSITIVE),
  fullName: requiredString(
    PROFILE_FIELD_ERROR_MESSAGES.FULL_NAME_REQUIRED,
    PROFILE_FIELD_ERROR_MESSAGES.FULL_NAME_INVALID_TYPE,
  )
    .trim()
    .min(1, PROFILE_FIELD_ERROR_MESSAGES.FULL_NAME_REQUIRED)
    .max(255, PROFILE_FIELD_ERROR_MESSAGES.FULL_NAME_MAX_LENGTH),
  phoneNumber: optionalShortString(
    PROFILE_FIELD_ERROR_MESSAGES.PHONE_NUMBER_INVALID_TYPE,
    PROFILE_FIELD_ERROR_MESSAGES.PHONE_NUMBER_MAX_LENGTH,
  ),
  dateOfBirth: z
    .string({
      error: PROFILE_FIELD_ERROR_MESSAGES.DATE_OF_BIRTH_INVALID_TYPE,
    })
    .regex(dateOnlyRegex, PROFILE_FIELD_ERROR_MESSAGES.DATE_OF_BIRTH_INVALID_FORMAT)
    .optional(),
  gender: z
    .enum(PROFILE_GENDER_VALUES, {
      error: PROFILE_FIELD_ERROR_MESSAGES.GENDER_INVALID,
    })
    .optional(),
  avatar: optionalShortString(
    PROFILE_FIELD_ERROR_MESSAGES.AVATAR_INVALID_TYPE,
    PROFILE_FIELD_ERROR_MESSAGES.AVATAR_MAX_LENGTH,
  ),
  citizenId: optionalShortString(
    PROFILE_FIELD_ERROR_MESSAGES.CITIZEN_ID_INVALID_TYPE,
    PROFILE_FIELD_ERROR_MESSAGES.CITIZEN_ID_MAX_LENGTH,
  ),
  hometown: optionalShortString(
    PROFILE_FIELD_ERROR_MESSAGES.HOMETOWN_INVALID_TYPE,
    PROFILE_FIELD_ERROR_MESSAGES.HOMETOWN_MAX_LENGTH,
  ),
  status: z
    .enum(PROFILE_STATUS_VALUES, {
      error: PROFILE_FIELD_ERROR_MESSAGES.STATUS_INVALID,
    })
    .optional(),
});

const listQueryOptions = {
  code: PROFILE_ERROR_CODES.PROFILE_LIST_INVALID_QUERY,
  message: PROFILE_ERROR_MESSAGES.PROFILE_LIST_INVALID_QUERY,
};

export async function getProfilesHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (Object.prototype.hasOwnProperty.call(req.query, "roles")) {
      throw new AppError(
        PROFILE_ERROR_MESSAGES.PROFILE_LIST_LEGACY_ROLE_FILTER_UNSUPPORTED,
        {
          statusCode: 400,
          code: PROFILE_ERROR_CODES.PROFILE_LIST_LEGACY_ROLE_FILTER_UNSUPPORTED,
          details: {
            formErrors: [],
            fieldErrors: {
              roles: [
                PROFILE_ERROR_MESSAGES.PROFILE_LIST_LEGACY_ROLE_FILTER_UNSUPPORTED,
              ],
            },
          },
        },
      );
    }

    const parsed = parseOrThrow(listProfilesQuerySchema, req.query, listQueryOptions);

    const result = await listProfiles({
      page: parsed.page,
      limit: parsed.limit,
      search: parsed.search,
      role: parsed.role as RoleEnum | undefined,
      status: parsed.status,
      gender: parsed.gender,
    });

    sendSuccess(res, result.profiles, 200, {
      page: parsed.page,
      limit: parsed.limit,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}

export async function createProfileHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = parseOrThrow(createProfileSchema, req.body, {
      code: PROFILE_ERROR_CODES.PROFILE_CREATE_INVALID_INPUT,
      message: PROFILE_ERROR_MESSAGES.PROFILE_CREATE_INVALID_INPUT,
    });

    const profile = await createProfile(parsed);
    sendSuccess(res, profile, 201);
  } catch (error) {
    next(error);
  }
}

export async function getMyProfileHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const accountId = req.user!.accountId;
    const profile = await getMyProfile(accountId);
    sendSuccess(res, profile, 200);
  } catch (error) {
    next(error);
  }
}

export async function getStudentProfilesHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = parseOrThrow(listProfilesQuerySchema.omit({ role: true }), req.query, listQueryOptions);

    const result = await listStudentProfiles({
      page: parsed.page,
      limit: parsed.limit,
      search: parsed.search,
      status: parsed.status,
      gender: parsed.gender,
    });

    sendSuccess(res, result.profiles, 200, {
      page: parsed.page,
      limit: parsed.limit,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLecturerProfilesHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = parseOrThrow(listProfilesQuerySchema.omit({ role: true }), req.query, listQueryOptions);

    const result = await listLecturerProfiles({
      page: parsed.page,
      limit: parsed.limit,
      search: parsed.search,
      status: parsed.status,
      gender: parsed.gender,
    });

    sendSuccess(res, result.profiles, 200, {
      page: parsed.page,
      limit: parsed.limit,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}
