import { Prisma, RoleEnum } from "@prisma/client";
import { prisma } from "../prisma/prismaClient";
import { AppError } from "../middleware/errorHandler";
import { PROFILE_ERROR_CODES } from "../constants/errors/profile/codes";
import { PROFILE_ERROR_MESSAGES } from "../constants/errors/profile/messages";

export interface ListProfilesInput {
  page: number;
  limit: number;
  search?: string;
  role?: RoleEnum;
  status?: "ACTIVE" | "INACTIVE" | "BANNED";
  gender?: "MALE" | "FEMALE";
}

export interface CreateProfileInput {
  accountId: number;
  fullName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE";
  avatar?: string;
  citizenId?: string;
  hometown?: string;
  status?: "ACTIVE" | "INACTIVE" | "BANNED";
}

export interface UpdateMyProfileInput {
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE";
  avatar?: string;
  citizenId?: string;
  hometown?: string;
}

export interface UpdateProfileByIdInput extends UpdateMyProfileInput {
  status?: "ACTIVE" | "INACTIVE" | "BANNED";
}

interface ProfileActor {
  accountId: number;
  role: RoleEnum;
}

const toDateOnly = (input: string): Date => {
  return new Date(`${input}T00:00:00.000Z`);
};

const profileSelect = {
  ProfileID: true,
  AccountID: true,
  FullName: true,
  PhoneNumber: true,
  DateOfBirth: true,
  Gender: true,
  Avatar: true,
  CitizenID: true,
  Hometown: true,
  Status: true,
  account: {
    select: {
      Email: true,
      Role: true,
    },
  },
} satisfies Prisma.UserProfileSelect;

type ProfileWithAccount = Prisma.UserProfileGetPayload<{ select: typeof profileSelect }>;

const mapProfile = (profile: ProfileWithAccount) => {
  return {
    profileId: profile.ProfileID,
    accountId: profile.AccountID,
    role: profile.account.Role,
    fullName: profile.FullName,
    email: profile.account.Email,
    phoneNumber: profile.PhoneNumber,
    dateOfBirth: profile.DateOfBirth,
    gender: profile.Gender,
    avatar: profile.Avatar,
    citizenId: profile.CitizenID,
    hometown: profile.Hometown,
    status: profile.Status ?? "ACTIVE",
  };
};

const buildProfileWhere = (input: ListProfilesInput): Prisma.UserProfileWhereInput => {
  const andClauses: Prisma.UserProfileWhereInput[] = [
    {
      account: {
        is: {
          IsDeleted: false,
        },
      },
    },
  ];

  const normalizedSearch = input.search?.trim();
  if (normalizedSearch) {
    andClauses.push({
      OR: [
        {
          FullName: {
            contains: normalizedSearch,
            mode: "insensitive",
          },
        },
        {
          account: {
            is: {
              Email: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    });
  }

  if (input.role) {
    andClauses.push({
      account: {
        is: {
          Role: input.role,
        },
      },
    });
  }

  if (input.status) {
    andClauses.push({
      Status: input.status,
    });
  }

  if (input.gender) {
    andClauses.push({
      Gender: input.gender,
    });
  }

  if (andClauses.length === 0) {
    return {};
  }

  return {
    AND: andClauses,
  };
};

const buildProfileUpdateData = (
  data: UpdateMyProfileInput,
): Prisma.UserProfileUpdateInput => {
  const updateData: Prisma.UserProfileUpdateInput = {};

  if (data.fullName !== undefined) {
    updateData.FullName = data.fullName.trim();
  }

  if (data.phoneNumber !== undefined) {
    updateData.PhoneNumber = data.phoneNumber;
  }

  if (data.dateOfBirth !== undefined) {
    updateData.DateOfBirth = data.dateOfBirth
      ? toDateOnly(data.dateOfBirth)
      : undefined;
  }

  if (data.gender !== undefined) {
    updateData.Gender = data.gender;
  }

  if (data.avatar !== undefined) {
    updateData.Avatar = data.avatar;
  }

  if (data.citizenId !== undefined) {
    updateData.CitizenID = data.citizenId;
  }

  if (data.hometown !== undefined) {
    updateData.Hometown = data.hometown;
  }

  return updateData;
};

const findActiveProfileById = async (profileId: number) => {
  return prisma.userProfile.findFirst({
    where: {
      ProfileID: profileId,
      account: {
        is: {
          IsDeleted: false,
        },
      },
    },
    select: profileSelect,
  });
};

const isAllowedProfileActor = (actor: ProfileActor, targetAccountId: number): boolean => {
  return actor.role === RoleEnum.ADMIN || actor.accountId === targetAccountId;
};

export const listProfiles = async (input: ListProfilesInput) => {
  const skip = (input.page - 1) * input.limit;
  const where = buildProfileWhere(input);

  const [profiles, total] = await Promise.all([
    prisma.userProfile.findMany({
      where,
      skip,
      take: input.limit,
      orderBy: {
        ProfileID: "asc",
      },
      select: profileSelect,
    }),
    prisma.userProfile.count({ where }),
  ]);

  return {
    profiles: profiles.map(mapProfile),
    total,
  };
};

export const createProfile = async (input: CreateProfileInput) => {
  const account = await prisma.account.findFirst({
    where: {
      AccountID: input.accountId,
      IsDeleted: false,
    },
    select: {
      AccountID: true,
    },
  });

  if (!account) {
    throw new AppError(PROFILE_ERROR_MESSAGES.PROFILE_CREATE_ACCOUNT_NOT_FOUND, {
      statusCode: 404,
      code: PROFILE_ERROR_CODES.PROFILE_CREATE_ACCOUNT_NOT_FOUND,
      details: {
        formErrors: [PROFILE_ERROR_MESSAGES.PROFILE_CREATE_ACCOUNT_NOT_FOUND],
        fieldErrors: {},
      },
    });
  }

  const existingProfile = await prisma.userProfile.findUnique({
    where: {
      AccountID: input.accountId,
    },
    select: {
      ProfileID: true,
    },
  });

  if (existingProfile) {
    throw new AppError(PROFILE_ERROR_MESSAGES.PROFILE_CREATE_ALREADY_EXISTS, {
      statusCode: 409,
      code: PROFILE_ERROR_CODES.PROFILE_CREATE_ALREADY_EXISTS,
      details: {
        formErrors: [PROFILE_ERROR_MESSAGES.PROFILE_CREATE_ALREADY_EXISTS],
        fieldErrors: {},
      },
    });
  }

  const profile = await prisma.userProfile.create({
    data: {
      AccountID: input.accountId,
      FullName: input.fullName.trim(),
      PhoneNumber: input.phoneNumber,
      DateOfBirth: input.dateOfBirth ? toDateOnly(input.dateOfBirth) : undefined,
      Gender: input.gender,
      Avatar: input.avatar,
      CitizenID: input.citizenId,
      Hometown: input.hometown,
      Status: input.status ?? "ACTIVE",
    },
    select: profileSelect,
  });

  return mapProfile(profile);
};

export const getMyProfile = async (accountId: number) => {
  const profile = await prisma.userProfile.findFirst({
    where: {
      AccountID: accountId,
      account: {
        is: {
          IsDeleted: false,
        },
      },
    },
    select: profileSelect,
  });

  if (!profile) {
    throw new AppError(PROFILE_ERROR_MESSAGES.PROFILE_ME_NOT_FOUND, {
      statusCode: 404,
      code: PROFILE_ERROR_CODES.PROFILE_ME_NOT_FOUND,
      details: {
        formErrors: [PROFILE_ERROR_MESSAGES.PROFILE_ME_NOT_FOUND],
        fieldErrors: {},
      },
    });
  }

  return mapProfile(profile);
};

export const updateMyProfile = async (accountId: number, data: UpdateMyProfileInput) => {
  const profile = await prisma.userProfile.findFirst({
    where: {
      AccountID: accountId,
      account: {
        is: {
          IsDeleted: false,
        },
      },
    },
    select: { ProfileID: true },
  });

  if (!profile) {
    throw new AppError(PROFILE_ERROR_MESSAGES.PROFILE_ME_NOT_FOUND, {
      statusCode: 404,
      code: PROFILE_ERROR_CODES.PROFILE_ME_NOT_FOUND,
      details: {
        formErrors: [PROFILE_ERROR_MESSAGES.PROFILE_ME_NOT_FOUND],
        fieldErrors: {},
      },
    });
  }

  const updateData = buildProfileUpdateData(data);
  const updated = await prisma.userProfile.update({
    where: { ProfileID: profile.ProfileID },
    data: updateData,
    select: profileSelect,
  });

  return mapProfile(updated);
};

export const getProfileDetailById = async (
  profileId: number,
  actor: ProfileActor,
) => {
  const profile = await findActiveProfileById(profileId);

  if (!profile) {
    throw new AppError(PROFILE_ERROR_MESSAGES.PROFILE_DETAIL_NOT_FOUND, {
      statusCode: 404,
      code: PROFILE_ERROR_CODES.PROFILE_DETAIL_NOT_FOUND,
      details: {
        formErrors: [PROFILE_ERROR_MESSAGES.PROFILE_DETAIL_NOT_FOUND],
        fieldErrors: {},
      },
    });
  }

  if (!isAllowedProfileActor(actor, profile.AccountID)) {
    throw new AppError(PROFILE_ERROR_MESSAGES.PROFILE_DETAIL_FORBIDDEN, {
      statusCode: 403,
      code: PROFILE_ERROR_CODES.PROFILE_DETAIL_FORBIDDEN,
      details: {
        formErrors: [PROFILE_ERROR_MESSAGES.PROFILE_DETAIL_FORBIDDEN],
        fieldErrors: {},
      },
    });
  }

  return mapProfile(profile);
};

export const updateProfileById = async (
  profileId: number,
  actor: ProfileActor,
  input: UpdateProfileByIdInput,
) => {
  const profile = await findActiveProfileById(profileId);

  if (!profile) {
    throw new AppError(PROFILE_ERROR_MESSAGES.PROFILE_UPDATE_BY_ID_NOT_FOUND, {
      statusCode: 404,
      code: PROFILE_ERROR_CODES.PROFILE_UPDATE_BY_ID_NOT_FOUND,
      details: {
        formErrors: [PROFILE_ERROR_MESSAGES.PROFILE_UPDATE_BY_ID_NOT_FOUND],
        fieldErrors: {},
      },
    });
  }

  if (!isAllowedProfileActor(actor, profile.AccountID)) {
    throw new AppError(PROFILE_ERROR_MESSAGES.PROFILE_UPDATE_BY_ID_FORBIDDEN, {
      statusCode: 403,
      code: PROFILE_ERROR_CODES.PROFILE_UPDATE_BY_ID_FORBIDDEN,
      details: {
        formErrors: [PROFILE_ERROR_MESSAGES.PROFILE_UPDATE_BY_ID_FORBIDDEN],
        fieldErrors: {},
      },
    });
  }

  if (input.status !== undefined && actor.role !== RoleEnum.ADMIN) {
    throw new AppError(PROFILE_ERROR_MESSAGES.PROFILE_UPDATE_BY_ID_FORBIDDEN_FIELD, {
      statusCode: 400,
      code: PROFILE_ERROR_CODES.PROFILE_UPDATE_BY_ID_FORBIDDEN_FIELD,
      details: {
        formErrors: [],
        fieldErrors: {
          status: [PROFILE_ERROR_MESSAGES.PROFILE_UPDATE_BY_ID_FORBIDDEN_FIELD],
        },
      },
    });
  }

  const updateData = buildProfileUpdateData(input);
  if (input.status !== undefined) {
    updateData.Status = input.status;
  }

  const updated = await prisma.userProfile.update({
    where: {
      ProfileID: profile.ProfileID,
    },
    data: updateData,
    select: profileSelect,
  });

  return mapProfile(updated);
};

export const listStudentProfiles = async (
  input: Omit<ListProfilesInput, "role">,
) => {
  return listProfiles({
    ...input,
    role: RoleEnum.STUDENT,
  });
};

export const listLecturerProfiles = async (
  input: Omit<ListProfilesInput, "role">,
) => {
  return listProfiles({
    ...input,
    role: RoleEnum.LECTURER,
  });
};
