import bcrypt from "bcrypt";
import { Prisma, RoleEnum } from "@prisma/client";
import { prisma } from "../prisma/prismaClient";
import { AppError } from "../middleware/errorHandler";
import { ACCOUNT_ERROR_CODES } from "../constants/errors/account/codes";
import {
  ACCOUNT_ERROR_MESSAGES,
  ACCOUNT_FIELD_ERROR_MESSAGES,
} from "../constants/errors/account/messages";

export interface GetAccountsInput {
  page: number;
  limit: number;
  search?: string;
  role?: RoleEnum;
  status?: "ACTIVE" | "INACTIVE" | "BANNED";
}

export interface CreateAccountInput {
  username: string;
  email: string;
  password: string;
  role: RoleEnum;
}

export const getAccounts = async (input: GetAccountsInput) => {
  const skip = (input.page - 1) * input.limit;
  const andClauses: Prisma.AccountWhereInput[] = [];

  const normalizedSearch = input.search?.trim();
  if (normalizedSearch) {
    andClauses.push({
      OR: [
        {
          Username: {
            contains: normalizedSearch,
            mode: "insensitive",
          },
        },
        {
          Email: {
            contains: normalizedSearch,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (input.role) {
    andClauses.push({
      Role: input.role,
    });
  }

  if (input.status) {
    andClauses.push({
      OR: [
        {
          profile: {
            is: {
              Status: input.status,
            },
          },
        },
        {
          profile: {
            is: null,
          },
        },
      ],
    });
  }

  const where: Prisma.AccountWhereInput =
    andClauses.length > 0
      ? {
          AND: andClauses,
        }
      : {};

  const [accounts, total] = await Promise.all([
    prisma.account.findMany({
      where,
      skip,
      take: input.limit,
      orderBy: {
        AccountID: "asc",
      },
      select: {
        AccountID: true,
        Username: true,
        Email: true,
        Role: true,
        profile: {
          select: {
            ProfileID: true,
            FullName: true,
            Avatar: true,
            Status: true,
          },
        },
      },
    }),
    prisma.account.count({ where }),
  ]);

  return {
    accounts: accounts.map((account) => ({
      accountId: account.AccountID,
      username: account.Username,
      email: account.Email,
      role: account.Role,
      profile: account.profile
        ? {
            profileId: account.profile.ProfileID,
            fullName: account.profile.FullName,
            avatar: account.profile.Avatar,
            status: account.profile.Status,
          }
        : null,
    })),
    total,
  };
};

export const createAccount = async (input: CreateAccountInput) => {
  const normalizedUsername = input.username.trim();
  const normalizedEmail = input.email.trim().toLowerCase();

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
    throw new AppError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_CREATE_USERNAME_EXISTS, {
      statusCode: 409,
      code: ACCOUNT_ERROR_CODES.ACCOUNT_CREATE_USERNAME_EXISTS,
      details: {
        formErrors: [],
        fieldErrors: {
          username: [ACCOUNT_FIELD_ERROR_MESSAGES.USERNAME_EXISTS],
        },
      },
    });
  }

  if (existingAccount?.Email === normalizedEmail) {
    throw new AppError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_CREATE_EMAIL_EXISTS, {
      statusCode: 409,
      code: ACCOUNT_ERROR_CODES.ACCOUNT_CREATE_EMAIL_EXISTS,
      details: {
        formErrors: [],
        fieldErrors: {
          email: [ACCOUNT_FIELD_ERROR_MESSAGES.EMAIL_EXISTS],
        },
      },
    });
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  try {
    const account = await prisma.account.create({
      data: {
        Username: normalizedUsername,
        Email: normalizedEmail,
        Password: hashedPassword,
        Role: input.role,
      },
      select: {
        AccountID: true,
        Username: true,
        Email: true,
        Role: true,
      },
    });

    return {
      accountId: account.AccountID,
      username: account.Username,
      email: account.Email,
      role: account.Role,
      profile: null,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = Array.isArray(error.meta?.target)
        ? error.meta.target.join(",")
        : "";

      const duplicateIsEmail = target.includes("Email");
      throw new AppError(
        duplicateIsEmail
          ? ACCOUNT_ERROR_MESSAGES.ACCOUNT_CREATE_EMAIL_EXISTS
          : ACCOUNT_ERROR_MESSAGES.ACCOUNT_CREATE_USERNAME_EXISTS,
        {
          statusCode: 409,
          code: duplicateIsEmail
            ? ACCOUNT_ERROR_CODES.ACCOUNT_CREATE_EMAIL_EXISTS
            : ACCOUNT_ERROR_CODES.ACCOUNT_CREATE_USERNAME_EXISTS,
          details: {
            formErrors: [],
            fieldErrors: duplicateIsEmail
              ? { email: [ACCOUNT_FIELD_ERROR_MESSAGES.EMAIL_EXISTS] }
              : { username: [ACCOUNT_FIELD_ERROR_MESSAGES.USERNAME_EXISTS] },
          },
        },
      );
    }

    throw error;
  }
};
