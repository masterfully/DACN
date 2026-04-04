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

export interface UpdateAccountInput {
  accountId: number;
  username?: string;
  email?: string;
  role?: RoleEnum;
  status?: "ACTIVE" | "INACTIVE" | "BANNED";
}

export interface DeleteAccountInput {
  accountId: number;
}

export interface DeleteAccountResult {
  accountId: number;
  username: string;
  email: string;
  role: RoleEnum;
  deleted: true;
  deletedAt: Date;
}

const accountSelect = {
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
} satisfies Prisma.AccountSelect;

type AccountWithProfile = Prisma.AccountGetPayload<{ select: typeof accountSelect }>;

const mapAccount = (account: AccountWithProfile) => {
  return {
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
  };
};

export const getAccounts = async (input: GetAccountsInput) => {
  const skip = (input.page - 1) * input.limit;
  const andClauses: Prisma.AccountWhereInput[] = [
    {
      IsDeleted: false,
    },
  ];

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
      select: accountSelect,
    }),
    prisma.account.count({ where }),
  ]);

  return {
    accounts: accounts.map(mapAccount),
    total,
  };
};

export const createAccount = async (input: CreateAccountInput) => {
  const normalizedUsername = input.username.trim();
  const normalizedEmail = input.email.trim().toLowerCase();

  const existingAccount = await prisma.account.findFirst({
    where: {
      AND: [
        { IsDeleted: false },
        {
          OR: [{ Username: normalizedUsername }, { Email: normalizedEmail }],
        },
      ],
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

export const getMyAccount = async (accountId: number) => {
  const account = await prisma.account.findFirst({
    where: {
      AccountID: accountId,
      IsDeleted: false,
    },
    select: accountSelect,
  });

  if (!account) {
    throw new AppError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_ME_NOT_FOUND, {
      statusCode: 404,
      code: ACCOUNT_ERROR_CODES.ACCOUNT_ME_NOT_FOUND,
      details: {
        formErrors: [ACCOUNT_ERROR_MESSAGES.ACCOUNT_ME_NOT_FOUND],
        fieldErrors: {},
      },
    });
  }

  return mapAccount(account);
};

export const getAccountDetail = async (accountId: number) => {
  const account = await prisma.account.findFirst({
    where: {
      AccountID: accountId,
      IsDeleted: false,
    },
    select: accountSelect,
  });

  if (!account) {
    throw new AppError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_DETAIL_NOT_FOUND, {
      statusCode: 404,
      code: ACCOUNT_ERROR_CODES.ACCOUNT_DETAIL_NOT_FOUND,
      details: {
        formErrors: [ACCOUNT_ERROR_MESSAGES.ACCOUNT_DETAIL_NOT_FOUND],
        fieldErrors: {},
      },
    });
  }

  return mapAccount(account);
};

export const updateAccount = async (input: UpdateAccountInput) => {
  const currentAccount = await prisma.account.findFirst({
    where: {
      AccountID: input.accountId,
      IsDeleted: false,
    },
    select: {
      AccountID: true,
      Username: true,
      Email: true,
    },
  });

  if (!currentAccount) {
    throw new AppError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_UPDATE_NOT_FOUND, {
      statusCode: 404,
      code: ACCOUNT_ERROR_CODES.ACCOUNT_UPDATE_NOT_FOUND,
      details: {
        formErrors: [ACCOUNT_ERROR_MESSAGES.ACCOUNT_UPDATE_NOT_FOUND],
        fieldErrors: {},
      },
    });
  }

  const data: Prisma.AccountUpdateInput = {};

  if (input.username !== undefined) {
    const normalizedUsername = input.username.trim();

    if (normalizedUsername !== currentAccount.Username) {
      const existing = await prisma.account.findFirst({
        where: {
          Username: normalizedUsername,
          IsDeleted: false,
          NOT: {
            AccountID: input.accountId,
          },
        },
        select: {
          AccountID: true,
        },
      });

      if (existing) {
        throw new AppError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_UPDATE_USERNAME_EXISTS, {
          statusCode: 409,
          code: ACCOUNT_ERROR_CODES.ACCOUNT_UPDATE_USERNAME_EXISTS,
          details: {
            formErrors: [],
            fieldErrors: {
              username: [ACCOUNT_FIELD_ERROR_MESSAGES.USERNAME_EXISTS],
            },
          },
        });
      }
    }

    data.Username = normalizedUsername;
  }

  if (input.email !== undefined) {
    const normalizedEmail = input.email.trim().toLowerCase();

    if (normalizedEmail !== currentAccount.Email.toLowerCase()) {
      const existing = await prisma.account.findFirst({
        where: {
          Email: normalizedEmail,
          IsDeleted: false,
          NOT: {
            AccountID: input.accountId,
          },
        },
        select: {
          AccountID: true,
        },
      });

      if (existing) {
        throw new AppError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_UPDATE_EMAIL_EXISTS, {
          statusCode: 409,
          code: ACCOUNT_ERROR_CODES.ACCOUNT_UPDATE_EMAIL_EXISTS,
          details: {
            formErrors: [],
            fieldErrors: {
              email: [ACCOUNT_FIELD_ERROR_MESSAGES.EMAIL_EXISTS],
            },
          },
        });
      }
    }

    data.Email = normalizedEmail;
  }

  if (input.role !== undefined) {
    data.Role = input.role;
  }

  if (input.status !== undefined) {
    data.profile = {
      upsert: {
        update: {
          Status: input.status,
        },
        create: {
          Status: input.status,
        },
      },
    };
  }

  try {
    const updated = await prisma.account.update({
      where: {
        AccountID: input.accountId,
      },
      data,
      select: accountSelect,
    });

    return mapAccount(updated);
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
          ? ACCOUNT_ERROR_MESSAGES.ACCOUNT_UPDATE_EMAIL_EXISTS
          : ACCOUNT_ERROR_MESSAGES.ACCOUNT_UPDATE_USERNAME_EXISTS,
        {
          statusCode: 409,
          code: duplicateIsEmail
            ? ACCOUNT_ERROR_CODES.ACCOUNT_UPDATE_EMAIL_EXISTS
            : ACCOUNT_ERROR_CODES.ACCOUNT_UPDATE_USERNAME_EXISTS,
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

export const deleteAccount = async (
  input: DeleteAccountInput,
): Promise<DeleteAccountResult> => {
  const account = await prisma.account.findFirst({
    where: {
      AccountID: input.accountId,
      IsDeleted: false,
    },
    select: {
      AccountID: true,
      Username: true,
      Email: true,
      Role: true,
    },
  });

  if (!account) {
    throw new AppError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_DELETE_NOT_FOUND, {
      statusCode: 404,
      code: ACCOUNT_ERROR_CODES.ACCOUNT_DELETE_NOT_FOUND,
      details: {
        formErrors: [ACCOUNT_ERROR_MESSAGES.ACCOUNT_DELETE_NOT_FOUND],
        fieldErrors: {},
      },
    });
  }

  const deletedAt = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.refreshToken.updateMany({
      where: {
        AccountID: input.accountId,
        RevokedAt: null,
      },
      data: {
        RevokedAt: deletedAt,
      },
    });

    await tx.userProfile.updateMany({
      where: {
        AccountID: input.accountId,
      },
      data: {
        Status: "INACTIVE",
      },
    });

    await tx.account.update({
      where: {
        AccountID: input.accountId,
      },
      data: {
        IsDeleted: true,
        DeletedAt: deletedAt,
      },
    });
  });

  return {
    accountId: account.AccountID,
    username: account.Username,
    email: account.Email,
    role: account.Role,
    deleted: true,
    deletedAt,
  };
};
