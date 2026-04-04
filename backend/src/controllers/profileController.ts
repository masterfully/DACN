import { NextFunction, Request, Response } from "express";
import { RoleEnum } from "@prisma/client";
import { z } from "zod";
import { AppError } from "../middleware/errorHandler";
import { parseOrThrow, parsePositiveIntParamOrThrow } from "../utils/validation";
import { sendSuccess } from "../utils/response";
import {
  createProfile,
  getProfileAttendanceSummary,
  linkCertificateToProfile,
  listProfileCertificates,
  getMyProfile,
  getProfileDetailById,
  listLecturerProfiles,
  listProfiles,
  listStudentProfiles,
  unlinkCertificateFromProfile,
  updateMyProfile,
  updateProfileById,
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

const optionalShortString = (
  invalidTypeMessage: string,
  maxLengthMessage: string,
) =>
  z
    .string({
      error: invalidTypeMessage,
    })
    .trim()
    .max(255, maxLengthMessage)
    .optional();

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
const vietnamPhoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

const updateMyProfileSchema = z.object({
  fullName: requiredString(
    PROFILE_FIELD_ERROR_MESSAGES.FULL_NAME_REQUIRED,
    PROFILE_FIELD_ERROR_MESSAGES.FULL_NAME_INVALID_TYPE,
  )
    .trim()
    .min(1, PROFILE_FIELD_ERROR_MESSAGES.FULL_NAME_REQUIRED)
    .max(255, PROFILE_FIELD_ERROR_MESSAGES.FULL_NAME_MAX_LENGTH)
    .optional(),
  phoneNumber: z
    .string({ error: PROFILE_FIELD_ERROR_MESSAGES.PHONE_NUMBER_INVALID_TYPE })
    .regex(
      vietnamPhoneRegex,
      PROFILE_FIELD_ERROR_MESSAGES.PHONE_NUMBER_INVALID_TYPE,
    )
    .max(255, PROFILE_FIELD_ERROR_MESSAGES.PHONE_NUMBER_MAX_LENGTH)
    .optional(),
  dateOfBirth: z
    .string({
      error: PROFILE_FIELD_ERROR_MESSAGES.DATE_OF_BIRTH_INVALID_TYPE,
    })
    .regex(
      dateOnlyRegex,
      PROFILE_FIELD_ERROR_MESSAGES.DATE_OF_BIRTH_INVALID_FORMAT,
    )
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
});

const updateProfileByIdSchema = updateMyProfileSchema
  .extend({
    status: z
      .enum(PROFILE_STATUS_VALUES, {
        error: PROFILE_FIELD_ERROR_MESSAGES.STATUS_INVALID,
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Cần ít nhất một trường để cập nhật",
    path: ["form"],
  });

const FORBIDDEN_FIELDS_UPDATE_MY = [
  "email",
  "status",
  "role",
  "accountId",
  "profileId",
] as const;

const FORBIDDEN_FIELDS_UPDATE_BY_ID = [
  "email",
  "role",
  "accountId",
  "profileId",
  "avatars",
] as const;

const getProfileIdFromParams = (
  req: Request,
  options: {
    code: string;
    message: string;
  },
): number => {
  return parsePositiveIntParamOrThrow(req.params.profileId, {
    code: options.code,
    message: options.message,
    fieldName: "profileId",
    fieldMessage: PROFILE_FIELD_ERROR_MESSAGES.PROFILE_ID_INVALID,
  });
};

const getCertificateIdFromParams = (
  req: Request,
  options: {
    code: string;
    message: string;
  },
): number => {
  return parsePositiveIntParamOrThrow(req.params.certificateId, {
    code: options.code,
    message: options.message,
    fieldName: "certificateId",
    fieldMessage: PROFILE_FIELD_ERROR_MESSAGES.CERTIFICATE_ID_INVALID_POSITIVE,
  });
};

const parseBooleanQueryValue = (value: unknown): unknown => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }

    if (normalized === "false") {
      return false;
    }
  }

  return value;
};

const listProfilesQuerySchema = z.object({
  page: z.coerce
    .number({
      error: PROFILE_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_INTEGER,
    })
    .int(PROFILE_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_INTEGER)
    .positive(PROFILE_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_POSITIVE)
    .default(1),
  limit: z.coerce
    .number({
      error: PROFILE_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_INTEGER,
    })
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
    .regex(
      dateOnlyRegex,
      PROFILE_FIELD_ERROR_MESSAGES.DATE_OF_BIRTH_INVALID_FORMAT,
    )
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

const attendanceSummaryQuerySchema = z.object({
  sectionId: z.coerce
    .number({
      error: PROFILE_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID,
    })
    .int(PROFILE_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID)
    .positive(PROFILE_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID)
    .optional(),
});

const profileCertificatesListQuerySchema = z.object({
  page: z.coerce
    .number({
      error: PROFILE_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_INTEGER,
    })
    .int(PROFILE_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_INTEGER)
    .positive(PROFILE_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_POSITIVE)
    .default(1),
  limit: z.coerce
    .number({
      error: PROFILE_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_INTEGER,
    })
    .int(PROFILE_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_INTEGER)
    .positive(PROFILE_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_POSITIVE)
    .default(10),
  search: z
    .string({
      error: PROFILE_FIELD_ERROR_MESSAGES.SEARCH_INVALID_TYPE,
    })
    .optional(),
  certificateTypeId: z.coerce
    .number({
      error: PROFILE_FIELD_ERROR_MESSAGES.QUERY_CERTIFICATE_TYPE_ID_INVALID,
    })
    .int(PROFILE_FIELD_ERROR_MESSAGES.QUERY_CERTIFICATE_TYPE_ID_INVALID)
    .positive(PROFILE_FIELD_ERROR_MESSAGES.QUERY_CERTIFICATE_TYPE_ID_INVALID)
    .optional(),
  isVerified: z
    .preprocess(
      parseBooleanQueryValue,
      z.boolean({
        error: PROFILE_FIELD_ERROR_MESSAGES.QUERY_IS_VERIFIED_INVALID,
      }),
    )
    .optional(),
});

const linkCertificateSchema = z.object({
  certificateId: z.coerce
    .number({
      error: (issue) => {
        if (issue.input === undefined) {
          return PROFILE_FIELD_ERROR_MESSAGES.CERTIFICATE_ID_REQUIRED;
        }

        return PROFILE_FIELD_ERROR_MESSAGES.CERTIFICATE_ID_INVALID_TYPE;
      },
    })
    .int(PROFILE_FIELD_ERROR_MESSAGES.CERTIFICATE_ID_INVALID_INTEGER)
    .positive(PROFILE_FIELD_ERROR_MESSAGES.CERTIFICATE_ID_INVALID_POSITIVE),
});

const listQueryOptions = {
  code: PROFILE_ERROR_CODES.PROFILE_LIST_INVALID_QUERY,
  message: PROFILE_ERROR_MESSAGES.PROFILE_LIST_INVALID_QUERY,
};

export async function updateMyProfileHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const forbidden = Object.keys(req.body).find((key) =>
      FORBIDDEN_FIELDS_UPDATE_MY.includes(
        key as (typeof FORBIDDEN_FIELDS_UPDATE_MY)[number],
      ),
    );

    if (forbidden) {
      return next(
        new AppError(PROFILE_ERROR_MESSAGES.PROFILE_UPDATE_FORBIDDEN_FIELD, {
          statusCode: 400,
          code: PROFILE_ERROR_CODES.PROFILE_UPDATE_FORBIDDEN_FIELD,
          details: {
            formErrors: [],
            fieldErrors: {
              [forbidden]: [PROFILE_ERROR_MESSAGES.PROFILE_UPDATE_FORBIDDEN_FIELD],
            },
          },
        }),
      );
    }

    const parsed = parseOrThrow(updateMyProfileSchema, req.body, {
      code: PROFILE_ERROR_CODES.PROFILE_CREATE_INVALID_INPUT,
      message: PROFILE_ERROR_MESSAGES.PROFILE_CREATE_INVALID_INPUT,
    });

    const accountId = req.user!.accountId;
    const updated = await updateMyProfile(accountId, parsed);
    sendSuccess(res, updated, 200);
  } catch (error) {
    next(error);
  }
}

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
    const parsed = parseOrThrow(
      listProfilesQuerySchema.omit({ role: true }),
      req.query,
      listQueryOptions,
    );

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
    const parsed = parseOrThrow(
      listProfilesQuerySchema.omit({ role: true }),
      req.query,
      listQueryOptions,
    );

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

export async function getProfileDetailHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profileId = getProfileIdFromParams(req, {
      code: PROFILE_ERROR_CODES.PROFILE_DETAIL_INVALID_PARAMS,
      message: PROFILE_ERROR_MESSAGES.PROFILE_DETAIL_INVALID_PARAMS,
    });

    const profile = await getProfileDetailById(profileId, {
      accountId: req.user!.accountId,
      role: req.user!.role as RoleEnum,
    });

    sendSuccess(res, profile, 200);
  } catch (error) {
    next(error);
  }
}

export async function updateProfileByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profileId = getProfileIdFromParams(req, {
      code: PROFILE_ERROR_CODES.PROFILE_UPDATE_BY_ID_INVALID_PARAMS,
      message: PROFILE_ERROR_MESSAGES.PROFILE_UPDATE_BY_ID_INVALID_PARAMS,
    });

    const forbidden = Object.keys(req.body).find((key) =>
      FORBIDDEN_FIELDS_UPDATE_BY_ID.includes(
        key as (typeof FORBIDDEN_FIELDS_UPDATE_BY_ID)[number],
      ),
    );

    if (forbidden) {
      return next(
        new AppError(PROFILE_ERROR_MESSAGES.PROFILE_UPDATE_BY_ID_FORBIDDEN_FIELD, {
          statusCode: 400,
          code: PROFILE_ERROR_CODES.PROFILE_UPDATE_BY_ID_FORBIDDEN_FIELD,
          details: {
            formErrors: [],
            fieldErrors: {
              [forbidden]: [
                PROFILE_ERROR_MESSAGES.PROFILE_UPDATE_BY_ID_FORBIDDEN_FIELD,
              ],
            },
          },
        }),
      );
    }

    const actorRole = req.user!.role as RoleEnum;
    if (actorRole !== RoleEnum.ADMIN && "status" in req.body) {
      return next(
        new AppError(PROFILE_ERROR_MESSAGES.PROFILE_UPDATE_BY_ID_FORBIDDEN_FIELD, {
          statusCode: 400,
          code: PROFILE_ERROR_CODES.PROFILE_UPDATE_BY_ID_FORBIDDEN_FIELD,
          details: {
            formErrors: [],
            fieldErrors: {
              status: [
                PROFILE_ERROR_MESSAGES.PROFILE_UPDATE_BY_ID_FORBIDDEN_FIELD,
              ],
            },
          },
        }),
      );
    }

    const parsed = parseOrThrow(updateProfileByIdSchema, req.body, {
      code: PROFILE_ERROR_CODES.PROFILE_UPDATE_BY_ID_INVALID_INPUT,
      message: PROFILE_ERROR_MESSAGES.PROFILE_UPDATE_BY_ID_INVALID_INPUT,
    });

    const updated = await updateProfileById(profileId, {
      accountId: req.user!.accountId,
      role: actorRole,
    }, parsed);

    sendSuccess(res, updated, 200);
  } catch (error) {
    next(error);
  }
}

export async function getProfileAttendanceSummaryHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profileId = getProfileIdFromParams(req, {
      code: PROFILE_ERROR_CODES.PROFILE_ATTENDANCE_SUMMARY_INVALID_PARAMS,
      message: PROFILE_ERROR_MESSAGES.PROFILE_ATTENDANCE_SUMMARY_INVALID_PARAMS,
    });

    const query = parseOrThrow(attendanceSummaryQuerySchema, req.query, {
      code: PROFILE_ERROR_CODES.PROFILE_ATTENDANCE_SUMMARY_INVALID_QUERY,
      message: PROFILE_ERROR_MESSAGES.PROFILE_ATTENDANCE_SUMMARY_INVALID_QUERY,
    });

    const summary = await getProfileAttendanceSummary(
      profileId,
      {
        accountId: req.user!.accountId,
        role: req.user!.role as RoleEnum,
      },
      query,
    );

    sendSuccess(res, summary, 200);
  } catch (error) {
    next(error);
  }
}

export async function getProfileCertificatesHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profileId = getProfileIdFromParams(req, {
      code: PROFILE_ERROR_CODES.PROFILE_CERTIFICATE_LIST_INVALID_PARAMS,
      message: PROFILE_ERROR_MESSAGES.PROFILE_CERTIFICATE_LIST_INVALID_PARAMS,
    });

    const query = parseOrThrow(profileCertificatesListQuerySchema, req.query, {
      code: PROFILE_ERROR_CODES.PROFILE_CERTIFICATE_LIST_INVALID_QUERY,
      message: PROFILE_ERROR_MESSAGES.PROFILE_CERTIFICATE_LIST_INVALID_QUERY,
    });

    const result = await listProfileCertificates(
      profileId,
      {
        accountId: req.user!.accountId,
        role: req.user!.role as RoleEnum,
      },
      query,
    );

    sendSuccess(res, result.certificates, 200, {
      page: query.page,
      limit: query.limit,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}

export async function addProfileCertificateHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profileId = getProfileIdFromParams(req, {
      code: PROFILE_ERROR_CODES.PROFILE_CERTIFICATE_LINK_INVALID_PARAMS,
      message: PROFILE_ERROR_MESSAGES.PROFILE_CERTIFICATE_LINK_INVALID_PARAMS,
    });

    const payload = parseOrThrow(linkCertificateSchema, req.body, {
      code: PROFILE_ERROR_CODES.PROFILE_CERTIFICATE_LINK_INVALID_INPUT,
      message: PROFILE_ERROR_MESSAGES.PROFILE_CERTIFICATE_LINK_INVALID_INPUT,
    });

    const result = await linkCertificateToProfile(profileId, payload.certificateId);
    sendSuccess(res, result, 200);
  } catch (error) {
    next(error);
  }
}

export async function removeProfileCertificateHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profileId = getProfileIdFromParams(req, {
      code: PROFILE_ERROR_CODES.PROFILE_CERTIFICATE_UNLINK_INVALID_PARAMS,
      message: PROFILE_ERROR_MESSAGES.PROFILE_CERTIFICATE_UNLINK_INVALID_PARAMS,
    });

    const certificateId = getCertificateIdFromParams(req, {
      code: PROFILE_ERROR_CODES.PROFILE_CERTIFICATE_UNLINK_INVALID_PARAMS,
      message: PROFILE_ERROR_MESSAGES.PROFILE_CERTIFICATE_UNLINK_INVALID_PARAMS,
    });

    await unlinkCertificateFromProfile(profileId, certificateId);
    sendSuccess(res, null, 200);
  } catch (error) {
    next(error);
  }
}
