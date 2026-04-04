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

export interface GetProfileAttendanceSummaryInput {
  sectionId?: number;
}

export interface ListProfileCertificatesInput {
  page: number;
  limit: number;
  search?: string;
  certificateTypeId?: number;
  isVerified?: boolean;
}

interface ProfileActor {
  accountId: number;
  role: RoleEnum;
}

const toDateOnly = (input: string): Date => {
  return new Date(`${input}T00:00:00.000Z`);
};

const formatDateOnly = (value: Date | null): string | null => {
  return value ? value.toISOString().slice(0, 10) : null;
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

const isAllowedAttendanceSummaryActor = (
  actor: ProfileActor,
  targetAccountId: number,
): boolean => {
  return (
    actor.role === RoleEnum.ADMIN ||
    actor.role === RoleEnum.LECTURER ||
    actor.accountId === targetAccountId
  );
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

export const getProfileAttendanceSummary = async (
  profileId: number,
  actor: ProfileActor,
  input: GetProfileAttendanceSummaryInput,
) => {
  const profile = await findActiveProfileById(profileId);

  if (!profile || profile.account.Role !== RoleEnum.STUDENT) {
    throw new AppError(
      PROFILE_ERROR_MESSAGES.PROFILE_ATTENDANCE_SUMMARY_PROFILE_NOT_FOUND,
      {
        statusCode: 404,
        code: PROFILE_ERROR_CODES.PROFILE_ATTENDANCE_SUMMARY_PROFILE_NOT_FOUND,
        details: {
          formErrors: [
            PROFILE_ERROR_MESSAGES.PROFILE_ATTENDANCE_SUMMARY_PROFILE_NOT_FOUND,
          ],
          fieldErrors: {},
        },
      },
    );
  }

  if (!isAllowedAttendanceSummaryActor(actor, profile.AccountID)) {
    throw new AppError(PROFILE_ERROR_MESSAGES.PROFILE_ATTENDANCE_SUMMARY_FORBIDDEN, {
      statusCode: 403,
      code: PROFILE_ERROR_CODES.PROFILE_ATTENDANCE_SUMMARY_FORBIDDEN,
      details: {
        formErrors: [PROFILE_ERROR_MESSAGES.PROFILE_ATTENDANCE_SUMMARY_FORBIDDEN],
        fieldErrors: {},
      },
    });
  }

  let subjectName: string | null = null;
  if (input.sectionId !== undefined) {
    const section = await prisma.section.findUnique({
      where: {
        SectionID: input.sectionId,
      },
      select: {
        SectionID: true,
        subject: {
          select: {
            SubjectName: true,
          },
        },
      },
    });

    if (!section) {
      throw new AppError(
        PROFILE_ERROR_MESSAGES.PROFILE_ATTENDANCE_SUMMARY_SECTION_NOT_FOUND,
        {
          statusCode: 404,
          code: PROFILE_ERROR_CODES.PROFILE_ATTENDANCE_SUMMARY_SECTION_NOT_FOUND,
          details: {
            formErrors: [
              PROFILE_ERROR_MESSAGES.PROFILE_ATTENDANCE_SUMMARY_SECTION_NOT_FOUND,
            ],
            fieldErrors: {},
          },
        },
      );
    }

    subjectName = section.subject.SubjectName;
  }

  const details = await prisma.attendanceDetail.findMany({
    where: {
      StudentProfileID: profile.ProfileID,
      attendance:
        input.sectionId !== undefined
          ? {
              SectionID: input.sectionId,
            }
          : undefined,
    },
    select: {
      Status: true,
    },
  });

  const totalSessions = details.length;
  let present = 0;
  let absent = 0;
  let late = 0;

  for (const detail of details) {
    const normalizedStatus = detail.Status?.toUpperCase();
    if (normalizedStatus === "PRESENT") {
      present += 1;
      continue;
    }

    if (
      normalizedStatus === "ABSENT" ||
      normalizedStatus === "EXCUSED_ABSENCE"
    ) {
      absent += 1;
      continue;
    }

    if (normalizedStatus === "LATE") {
      late += 1;
    }
  }

  const attendanceRate =
    totalSessions > 0 ? Math.round((present / totalSessions) * 100) : 0;

  return {
    profileId: profile.ProfileID,
    studentName: profile.FullName ?? "",
    sectionId: input.sectionId ?? null,
    subjectName,
    totalSessions,
    present,
    absent,
    late,
    attendanceRate,
  };
};

export const listProfileCertificates = async (
  profileId: number,
  actor: ProfileActor,
  input: ListProfileCertificatesInput,
) => {
  const profile = await findActiveProfileById(profileId);

  if (!profile || profile.account.Role !== RoleEnum.STUDENT) {
    throw new AppError(PROFILE_ERROR_MESSAGES.PROFILE_CERTIFICATE_LIST_PROFILE_NOT_FOUND, {
      statusCode: 404,
      code: PROFILE_ERROR_CODES.PROFILE_CERTIFICATE_LIST_PROFILE_NOT_FOUND,
      details: {
        formErrors: [PROFILE_ERROR_MESSAGES.PROFILE_CERTIFICATE_LIST_PROFILE_NOT_FOUND],
        fieldErrors: {},
      },
    });
  }

  if (!isAllowedProfileActor(actor, profile.AccountID)) {
    throw new AppError(PROFILE_ERROR_MESSAGES.PROFILE_CERTIFICATE_LIST_FORBIDDEN, {
      statusCode: 403,
      code: PROFILE_ERROR_CODES.PROFILE_CERTIFICATE_LIST_FORBIDDEN,
      details: {
        formErrors: [PROFILE_ERROR_MESSAGES.PROFILE_CERTIFICATE_LIST_FORBIDDEN],
        fieldErrors: {},
      },
    });
  }

  const certificateWhere: Prisma.CertificateDetailWhereInput = {};
  const normalizedSearch = input.search?.trim();

  if (normalizedSearch) {
    certificateWhere.certificateType = {
      TypeName: {
        contains: normalizedSearch,
        mode: "insensitive",
      },
    };
  }

  if (input.certificateTypeId !== undefined) {
    certificateWhere.CertificateTypeID = input.certificateTypeId;
  }

  if (input.isVerified !== undefined) {
    certificateWhere.IsVerified = input.isVerified;
  }

  const where: Prisma.StudentCertificatesWhereInput = {
    StudentID: profile.ProfileID,
    certificate: certificateWhere,
  };

  const skip = (input.page - 1) * input.limit;

  const [rows, total] = await Promise.all([
    prisma.studentCertificates.findMany({
      where,
      skip,
      take: input.limit,
      orderBy: {
        CertificateID: "asc",
      },
      select: {
        CertificateID: true,
        certificate: {
          select: {
            CreatedByAccountID: true,
            Score: true,
            IssueDate: true,
            ExpiryDate: true,
            EvidenceURL: true,
            Metadata: true,
            IsVerified: true,
            certificateType: {
              select: {
                TypeName: true,
              },
            },
          },
        },
      },
    }),
    prisma.studentCertificates.count({ where }),
  ]);

  return {
    certificates: rows.map((row) => ({
      certificateId: row.CertificateID,
      typeName: row.certificate.certificateType.TypeName,
      createdByAccountId: row.certificate.CreatedByAccountID,
      score: row.certificate.Score,
      issueDate: formatDateOnly(row.certificate.IssueDate),
      expiryDate: formatDateOnly(row.certificate.ExpiryDate),
      evidenceURL: row.certificate.EvidenceURL,
      metadata: row.certificate.Metadata,
      isVerified: row.certificate.IsVerified,
    })),
    total,
  };
};

export const linkCertificateToProfile = async (
  profileId: number,
  certificateId: number,
) => {
  const profile = await findActiveProfileById(profileId);

  if (!profile || profile.account.Role !== RoleEnum.STUDENT) {
    throw new AppError(PROFILE_ERROR_MESSAGES.PROFILE_CERTIFICATE_LINK_PROFILE_NOT_FOUND, {
      statusCode: 404,
      code: PROFILE_ERROR_CODES.PROFILE_CERTIFICATE_LINK_PROFILE_NOT_FOUND,
      details: {
        formErrors: [PROFILE_ERROR_MESSAGES.PROFILE_CERTIFICATE_LINK_PROFILE_NOT_FOUND],
        fieldErrors: {},
      },
    });
  }

  const certificate = await prisma.certificateDetail.findUnique({
    where: {
      CertificateID: certificateId,
    },
    select: {
      CertificateID: true,
    },
  });

  if (!certificate) {
    throw new AppError(
      PROFILE_ERROR_MESSAGES.PROFILE_CERTIFICATE_LINK_CERTIFICATE_NOT_FOUND,
      {
        statusCode: 404,
        code: PROFILE_ERROR_CODES.PROFILE_CERTIFICATE_LINK_CERTIFICATE_NOT_FOUND,
        details: {
          formErrors: [
            PROFILE_ERROR_MESSAGES.PROFILE_CERTIFICATE_LINK_CERTIFICATE_NOT_FOUND,
          ],
          fieldErrors: {},
        },
      },
    );
  }

  try {
    await prisma.studentCertificates.create({
      data: {
        StudentID: profile.ProfileID,
        CertificateID: certificateId,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(PROFILE_ERROR_MESSAGES.PROFILE_CERTIFICATE_LINK_ALREADY_EXISTS, {
        statusCode: 409,
        code: PROFILE_ERROR_CODES.PROFILE_CERTIFICATE_LINK_ALREADY_EXISTS,
        details: {
          formErrors: [PROFILE_ERROR_MESSAGES.PROFILE_CERTIFICATE_LINK_ALREADY_EXISTS],
          fieldErrors: {},
        },
      });
    }

    throw error;
  }

  return {
    studentId: profile.ProfileID,
    certificateId,
  };
};

export const unlinkCertificateFromProfile = async (
  profileId: number,
  certificateId: number,
) => {
  const profile = await findActiveProfileById(profileId);

  if (!profile || profile.account.Role !== RoleEnum.STUDENT) {
    throw new AppError(
      PROFILE_ERROR_MESSAGES.PROFILE_CERTIFICATE_UNLINK_PROFILE_NOT_FOUND,
      {
        statusCode: 404,
        code: PROFILE_ERROR_CODES.PROFILE_CERTIFICATE_UNLINK_PROFILE_NOT_FOUND,
        details: {
          formErrors: [
            PROFILE_ERROR_MESSAGES.PROFILE_CERTIFICATE_UNLINK_PROFILE_NOT_FOUND,
          ],
          fieldErrors: {},
        },
      },
    );
  }

  const deleted = await prisma.studentCertificates.deleteMany({
    where: {
      StudentID: profile.ProfileID,
      CertificateID: certificateId,
    },
  });

  if (deleted.count === 0) {
    throw new AppError(PROFILE_ERROR_MESSAGES.PROFILE_CERTIFICATE_UNLINK_NOT_LINKED, {
      statusCode: 404,
      code: PROFILE_ERROR_CODES.PROFILE_CERTIFICATE_UNLINK_NOT_LINKED,
      details: {
        formErrors: [PROFILE_ERROR_MESSAGES.PROFILE_CERTIFICATE_UNLINK_NOT_LINKED],
        fieldErrors: {},
      },
    });
  }

  return null;
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
