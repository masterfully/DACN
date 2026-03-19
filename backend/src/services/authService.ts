import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { Prisma, RoleEnum } from "@prisma/client";
import { prisma } from "../prisma/prismaClient";
import { AppError } from "../middleware/errorHandler";
import { AUTH_ERROR_CODES } from "../constants/errors/auth/codes";
import {
  AUTH_ERROR_MESSAGES,
  AUTH_FIELD_ERROR_MESSAGES,
} from "../constants/errors/auth/messages";

export interface RegisterInput {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface LogoutInput {
  refreshToken: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

interface AuthTokenPayload {
  accountId: number;
  role: RoleEnum;
  username: string;
}

type TokenExpiry = NonNullable<SignOptions["expiresIn"]>;

const isAuthTokenPayload = (value: unknown): value is AuthTokenPayload => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return (
    typeof payload.accountId === "number" &&
    typeof payload.username === "string" &&
    typeof payload.role === "string" &&
    [RoleEnum.ADMIN, RoleEnum.LECTURER, RoleEnum.STUDENT, RoleEnum.PARENT].includes(
      payload.role as RoleEnum,
    )
  );
};

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError(AUTH_ERROR_MESSAGES.SERVER_MISCONFIGURATION, {
      statusCode: 500,
      code: AUTH_ERROR_CODES.SERVER_MISCONFIGURATION,
    });
  }

  return secret;
};

const getAccessTokenExpiry = (): TokenExpiry => {
  return (process.env.JWT_ACCESS_EXPIRES_IN ?? "15m") as TokenExpiry;
};

const getRefreshTokenExpiry = (): TokenExpiry => {
  return (process.env.JWT_REFRESH_EXPIRES_IN ?? "7d") as TokenExpiry;
};

const parseExpiryToMs = (expiry: TokenExpiry): number => {
  if (typeof expiry === "number") {
    return expiry * 1000;
  }

  const raw = expiry.trim();
  if (/^\d+$/.test(raw)) {
    return Number(raw) * 1000;
  }

  const match = raw.match(/^(\d+)([smhd])$/i);
  if (!match) {
    throw new AppError(AUTH_ERROR_MESSAGES.SERVER_MISCONFIGURATION, {
      statusCode: 500,
      code: AUTH_ERROR_CODES.SERVER_MISCONFIGURATION,
    });
  }

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();

  const unitToMs: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * unitToMs[unit];
};

const signToken = (
  payload: AuthTokenPayload,
  expiresIn: TokenExpiry,
): string => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
};

export const login = async (input: LoginInput) => {
  const normalizedUsername = input.username.trim();

  const account = await prisma.account.findUnique({
    where: {
      Username: normalizedUsername,
    },
    select: {
      AccountID: true,
      Username: true,
      Email: true,
      Password: true,
      Role: true,
      profile: {
        select: {
          ProfileID: true,
          FullName: true,
          PhoneNumber: true,
          DateOfBirth: true,
          Gender: true,
          Avatar: true,
          CitizenID: true,
          Hometown: true,
          Status: true,
        },
      },
    },
  });

  if (!account) {
    throw new AppError(AUTH_ERROR_MESSAGES.AUTH_LOGIN_INVALID_CREDENTIALS, {
      statusCode: 401,
      code: AUTH_ERROR_CODES.AUTH_LOGIN_INVALID_CREDENTIALS,
      details: {
        formErrors: [AUTH_ERROR_MESSAGES.AUTH_LOGIN_INVALID_CREDENTIALS],
        fieldErrors: {},
      },
    });
  }

  const passwordMatched = await bcrypt.compare(input.password, account.Password);
  if (!passwordMatched) {
    throw new AppError(AUTH_ERROR_MESSAGES.AUTH_LOGIN_INVALID_CREDENTIALS, {
      statusCode: 401,
      code: AUTH_ERROR_CODES.AUTH_LOGIN_INVALID_CREDENTIALS,
      details: {
        formErrors: [AUTH_ERROR_MESSAGES.AUTH_LOGIN_INVALID_CREDENTIALS],
        fieldErrors: {},
      },
    });
  }

  const normalizedProfileStatus = account.profile?.Status?.trim().toUpperCase();
  if (normalizedProfileStatus === "INACTIVE" || normalizedProfileStatus === "BANNED") {
    throw new AppError(AUTH_ERROR_MESSAGES.AUTH_LOGIN_ACCOUNT_INACTIVE, {
      statusCode: 403,
      code: AUTH_ERROR_CODES.AUTH_LOGIN_ACCOUNT_INACTIVE,
      details: {
        formErrors: [AUTH_ERROR_MESSAGES.AUTH_LOGIN_ACCOUNT_INACTIVE],
        fieldErrors: {},
      },
    });
  }

  const accessExpiresIn = getAccessTokenExpiry();
  const refreshExpiresIn = getRefreshTokenExpiry();
  const refreshExpiresAt = new Date(Date.now() + parseExpiryToMs(refreshExpiresIn));

  const payload: AuthTokenPayload = {
    accountId: account.AccountID,
    role: account.Role,
    username: account.Username,
  };

  const accessToken = signToken(payload, accessExpiresIn);
  const refreshToken = signToken(payload, refreshExpiresIn);

  await prisma.refreshToken.create({
    data: {
      AccountID: account.AccountID,
      Token: refreshToken,
      ExpiresAt: refreshExpiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
    account: {
      accountId: account.AccountID,
      username: account.Username,
      email: account.Email,
      role: account.Role,
      profile: account.profile
        ? {
            profileId: account.profile.ProfileID,
            fullName: account.profile.FullName,
            phoneNumber: account.profile.PhoneNumber,
            dateOfBirth: account.profile.DateOfBirth,
            gender: account.profile.Gender,
            avatar: account.profile.Avatar,
            citizenId: account.profile.CitizenID,
            hometown: account.profile.Hometown,
            status: account.profile.Status,
          }
        : null,
    },
  };
};

export const register = async (input: RegisterInput) => {
  const normalizedUsername = input.username.trim();
  const normalizedEmail = input.email.trim().toLowerCase();
  const normalizedFullName = input.fullName.trim();

  const existingAccount = await prisma.account.findFirst({
    where: {
      OR: [{ Username: normalizedUsername }, { Email: normalizedEmail }],
    },
    select: {
      Username: true,
      Email: true,
    },
  });

  if (existingAccount?.Username === normalizedUsername) {
    throw new AppError(AUTH_ERROR_MESSAGES.AUTH_REGISTER_USERNAME_EXISTS, {
      statusCode: 409,
      code: AUTH_ERROR_CODES.AUTH_REGISTER_USERNAME_EXISTS,
      details: {
        formErrors: [],
        fieldErrors: {
          username: [AUTH_FIELD_ERROR_MESSAGES.USERNAME_EXISTS],
        },
      },
    });
  }

  if (existingAccount?.Email === normalizedEmail) {
    throw new AppError(AUTH_ERROR_MESSAGES.AUTH_REGISTER_EMAIL_EXISTS, {
      statusCode: 409,
      code: AUTH_ERROR_CODES.AUTH_REGISTER_EMAIL_EXISTS,
      details: {
        formErrors: [],
        fieldErrors: {
          email: [AUTH_FIELD_ERROR_MESSAGES.EMAIL_EXISTS],
        },
      },
    });
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const accessExpiresIn = getAccessTokenExpiry();
  const refreshExpiresIn = getRefreshTokenExpiry();
  const refreshExpiresAt = new Date(Date.now() + parseExpiryToMs(refreshExpiresIn));

  let result;
  try {
    result = await prisma.$transaction(async (tx) => {
      const account = await tx.account.create({
        data: {
          Role: RoleEnum.STUDENT,
          Username: normalizedUsername,
          Email: normalizedEmail,
          Password: hashedPassword,
        },
        select: {
          AccountID: true,
          Username: true,
          Email: true,
          Role: true,
        },
      });

      const profile = await tx.userProfile.create({
        data: {
          AccountID: account.AccountID,
          FullName: normalizedFullName,
        },
        select: {
          ProfileID: true,
          FullName: true,
          PhoneNumber: true,
          DateOfBirth: true,
          Gender: true,
          Avatar: true,
          CitizenID: true,
          Hometown: true,
          Status: true,
        },
      });

      const payload: AuthTokenPayload = {
        accountId: account.AccountID,
        role: account.Role,
        username: account.Username,
      };

      const accessToken = signToken(payload, accessExpiresIn);
      const refreshToken = signToken(payload, refreshExpiresIn);

      await tx.refreshToken.create({
        data: {
          AccountID: account.AccountID,
          Token: refreshToken,
          ExpiresAt: refreshExpiresAt,
        },
      });

      return {
        accessToken,
        refreshToken,
        account: {
          accountId: account.AccountID,
          username: account.Username,
          email: account.Email,
          role: account.Role,
          profile: {
            profileId: profile.ProfileID,
            fullName: profile.FullName,
            phoneNumber: profile.PhoneNumber,
            dateOfBirth: profile.DateOfBirth,
            gender: profile.Gender,
            avatar: profile.Avatar,
            citizenId: profile.CitizenID,
            hometown: profile.Hometown,
            status: profile.Status,
          },
        },
      };
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const target = Array.isArray(error.meta?.target) ? error.meta.target.join(",") : "";
      const code = target.includes("Email")
        ? AUTH_ERROR_CODES.AUTH_REGISTER_EMAIL_EXISTS
        : AUTH_ERROR_CODES.AUTH_REGISTER_USERNAME_EXISTS;
      const message =
        code === AUTH_ERROR_CODES.AUTH_REGISTER_EMAIL_EXISTS
          ? AUTH_ERROR_MESSAGES.AUTH_REGISTER_EMAIL_EXISTS
          : AUTH_ERROR_MESSAGES.AUTH_REGISTER_USERNAME_EXISTS;

      throw new AppError(message, {
        statusCode: 409,
        code,
        details: {
          formErrors: [],
          fieldErrors:
            code === AUTH_ERROR_CODES.AUTH_REGISTER_EMAIL_EXISTS
              ? { email: [AUTH_FIELD_ERROR_MESSAGES.EMAIL_EXISTS] }
              : { username: [AUTH_FIELD_ERROR_MESSAGES.USERNAME_EXISTS] },
        },
      });
    }

    throw error;
  }

  return result;
};

export const logout = async (input: LogoutInput) => {
  const normalizedRefreshToken = input.refreshToken.trim();

  const refreshTokenRecord = await prisma.refreshToken.findUnique({
    where: {
      Token: normalizedRefreshToken,
    },
    select: {
      RefreshTokenID: true,
      ExpiresAt: true,
      RevokedAt: true,
    },
  });

  const now = new Date();
  const isTokenInvalid =
    !refreshTokenRecord ||
    refreshTokenRecord.RevokedAt !== null ||
    refreshTokenRecord.ExpiresAt <= now;

  if (isTokenInvalid) {
    throw new AppError(AUTH_ERROR_MESSAGES.AUTH_LOGOUT_INVALID_TOKEN, {
      statusCode: 401,
      code: AUTH_ERROR_CODES.AUTH_LOGOUT_INVALID_TOKEN,
      details: {
        formErrors: [AUTH_ERROR_MESSAGES.AUTH_LOGOUT_INVALID_TOKEN],
        fieldErrors: {},
      },
    });
  }

  await prisma.refreshToken.update({
    where: {
      RefreshTokenID: refreshTokenRecord.RefreshTokenID,
    },
    data: {
      RevokedAt: now,
    },
  });

  return {
    message: AUTH_ERROR_MESSAGES.AUTH_LOGOUT_SUCCESS,
  };
};

export const refreshToken = async (input: RefreshTokenInput) => {
  const normalizedRefreshToken = input.refreshToken.trim();

  let decoded: unknown;
  try {
    decoded = jwt.verify(normalizedRefreshToken, getJwtSecret());
  } catch {
    throw new AppError(AUTH_ERROR_MESSAGES.AUTH_REFRESH_TOKEN_INVALID_TOKEN, {
      statusCode: 401,
      code: AUTH_ERROR_CODES.AUTH_REFRESH_TOKEN_INVALID_TOKEN,
      details: {
        formErrors: [AUTH_ERROR_MESSAGES.AUTH_REFRESH_TOKEN_INVALID_TOKEN],
        fieldErrors: {},
      },
    });
  }

  if (!isAuthTokenPayload(decoded)) {
    throw new AppError(AUTH_ERROR_MESSAGES.AUTH_REFRESH_TOKEN_INVALID_TOKEN, {
      statusCode: 401,
      code: AUTH_ERROR_CODES.AUTH_REFRESH_TOKEN_INVALID_TOKEN,
      details: {
        formErrors: [AUTH_ERROR_MESSAGES.AUTH_REFRESH_TOKEN_INVALID_TOKEN],
        fieldErrors: {},
      },
    });
  }

  const refreshTokenRecord = await prisma.refreshToken.findUnique({
    where: {
      Token: normalizedRefreshToken,
    },
    select: {
      RefreshTokenID: true,
      AccountID: true,
      ExpiresAt: true,
      RevokedAt: true,
    },
  });

  const now = new Date();
  const isTokenInvalid =
    !refreshTokenRecord ||
    refreshTokenRecord.RevokedAt !== null ||
    refreshTokenRecord.ExpiresAt <= now;

  if (isTokenInvalid || refreshTokenRecord.AccountID !== decoded.accountId) {
    throw new AppError(AUTH_ERROR_MESSAGES.AUTH_REFRESH_TOKEN_INVALID_TOKEN, {
      statusCode: 401,
      code: AUTH_ERROR_CODES.AUTH_REFRESH_TOKEN_INVALID_TOKEN,
      details: {
        formErrors: [AUTH_ERROR_MESSAGES.AUTH_REFRESH_TOKEN_INVALID_TOKEN],
        fieldErrors: {},
      },
    });
  }

  const account = await prisma.account.findUnique({
    where: {
      AccountID: refreshTokenRecord.AccountID,
    },
    select: {
      AccountID: true,
      Username: true,
      Role: true,
      profile: {
        select: {
          Status: true,
        },
      },
    },
  });

  if (!account) {
    throw new AppError(AUTH_ERROR_MESSAGES.AUTH_REFRESH_TOKEN_INVALID_TOKEN, {
      statusCode: 401,
      code: AUTH_ERROR_CODES.AUTH_REFRESH_TOKEN_INVALID_TOKEN,
      details: {
        formErrors: [AUTH_ERROR_MESSAGES.AUTH_REFRESH_TOKEN_INVALID_TOKEN],
        fieldErrors: {},
      },
    });
  }

  const normalizedProfileStatus = account.profile?.Status?.trim().toUpperCase();
  if (normalizedProfileStatus === "INACTIVE" || normalizedProfileStatus === "BANNED") {
    throw new AppError(AUTH_ERROR_MESSAGES.AUTH_LOGIN_ACCOUNT_INACTIVE, {
      statusCode: 403,
      code: AUTH_ERROR_CODES.AUTH_LOGIN_ACCOUNT_INACTIVE,
      details: {
        formErrors: [AUTH_ERROR_MESSAGES.AUTH_LOGIN_ACCOUNT_INACTIVE],
        fieldErrors: {},
      },
    });
  }

  const payload: AuthTokenPayload = {
    accountId: account.AccountID,
    role: account.Role,
    username: account.Username,
  };

  const accessExpiresIn = getAccessTokenExpiry();
  const refreshExpiresIn = getRefreshTokenExpiry();
  const newRefreshExpiresAt = new Date(Date.now() + parseExpiryToMs(refreshExpiresIn));

  const newAccessToken = signToken(payload, accessExpiresIn);
  const newRefreshToken = signToken(payload, refreshExpiresIn);

  await prisma.$transaction(async (tx) => {
    const revoked = await tx.refreshToken.updateMany({
      where: {
        RefreshTokenID: refreshTokenRecord.RefreshTokenID,
        RevokedAt: null,
      },
      data: {
        RevokedAt: now,
      },
    });

    if (revoked.count === 0) {
      throw new AppError(AUTH_ERROR_MESSAGES.AUTH_REFRESH_TOKEN_INVALID_TOKEN, {
        statusCode: 401,
        code: AUTH_ERROR_CODES.AUTH_REFRESH_TOKEN_INVALID_TOKEN,
        details: {
          formErrors: [AUTH_ERROR_MESSAGES.AUTH_REFRESH_TOKEN_INVALID_TOKEN],
          fieldErrors: {},
        },
      });
    }

    await tx.refreshToken.create({
      data: {
        AccountID: account.AccountID,
        Token: newRefreshToken,
        ExpiresAt: newRefreshExpiresAt,
      },
    });
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};
