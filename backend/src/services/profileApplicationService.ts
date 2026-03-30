import { z } from "zod";
import {
  PROFILE_APPLICATION_ERROR_CODES,
  type ProfileApplicationErrorCode,
} from "../constants/errors/profileApplication/codes";
import { PROFILE_APPLICATION_FIELD_ERROR_MESSAGES } from "../constants/errors/profileApplication/fieldMessages";
import { PROFILE_APPLICATION_ERROR_MESSAGES } from "../constants/errors/profileApplication/messages";
import { AppError } from "../middleware/errorHandler";
import { prisma } from "../prisma/prismaClient";
import type {
  GetApplicationsListParams,
  GetMyApplicationsParams,
  PaginatedProfileApplicationListItem,
  ProfileApplicationDetail,
  ProfileApplicationListItem,
  ReviewApplicationInput,
} from "../types/profileApplication";

const PENDING_STATUS = "PENDING";
const APPROVED_STATUS = "APPROVED";
const REJECTED_STATUS = "REJECTED";

const businessErrorDetails = (message: string) => ({
  formErrors: [message],
  fieldErrors: {},
});

const getListSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().max(255).optional(),
  applicationStatus: z
    .enum([PENDING_STATUS, APPROVED_STATUS, REJECTED_STATUS])
    .optional(),
  submissionFrom: z.string().optional(),
  submissionTo: z.string().optional(),
});

const reviewSchema = z.object({
  applicationStatus: z.enum([APPROVED_STATUS, REJECTED_STATUS]),
  reviewNotes: z
    .string()
    .max(1000, PROFILE_APPLICATION_FIELD_ERROR_MESSAGES.REVIEW_NOTES_TOO_LONG)
    .optional(),
});

export const getApplicationsList = async (
  params: GetApplicationsListParams,
): Promise<PaginatedProfileApplicationListItem> => {
  const validated = getListSchema.parse(params);

  const where: any = {
    student: {
      FullName: validated.search
        ? { contains: validated.search, mode: "insensitive" }
        : undefined,
    },
  };

  if (validated.applicationStatus) {
    where.ApplicationStatus = validated.applicationStatus;
  }

  if (validated.submissionFrom) {
    where.SubmissionDate = { gte: new Date(validated.submissionFrom) };
  }

  if (validated.submissionTo) {
    where.SubmissionDate = {
      ...where.SubmissionDate,
      lte: new Date(validated.submissionTo),
    };
  }

  const [list, total] = await Promise.all([
    prisma.profileApplication.findMany({
      where,
      include: {
        student: {
          select: {
            ProfileID: true,
            FullName: true,
          },
        },
      },
      skip: (validated.page - 1) * validated.limit,
      take: validated.limit,
      orderBy: { SubmissionDate: "desc" },
    }),
    prisma.profileApplication.count({ where }),
  ]);

  const items: ProfileApplicationListItem[] = list.map((app) => ({
    ApplicationID: app.ApplicationID,
    StudentProfileID: app.StudentProfileID,
    FullName: app.student.FullName ?? "",
    ApplicationStatus: app.ApplicationStatus ?? "",
    SubmissionDate: app.SubmissionDate?.toISOString() ?? null,
    ReviewedByProfileID: app.ReviewedByProfileID ?? null,
    ReviewDate: app.ReviewDate?.toISOString() ?? null,
  }));

  return {
    data: items,
    meta: {
      page: validated.page,
      limit: validated.limit,
      total,
    },
  };
};

export const submitApplication = async (studentAccountId: number) => {
  const studentProfile = await prisma.userProfile.findUnique({
    where: { AccountID: studentAccountId },
    select: { ProfileID: true },
  });

  if (!studentProfile) {
    throw new AppError(
      PROFILE_APPLICATION_ERROR_MESSAGES.PROFILE_APPLICATION_SUBMIT_STUDENT_PROFILE_NOT_FOUND,
      {
        statusCode: 404,
        code: PROFILE_APPLICATION_ERROR_CODES.PROFILE_APPLICATION_SUBMIT_STUDENT_PROFILE_NOT_FOUND,
        details: businessErrorDetails(
          PROFILE_APPLICATION_ERROR_MESSAGES.PROFILE_APPLICATION_SUBMIT_STUDENT_PROFILE_NOT_FOUND,
        ),
      },
    );
  }

  const pendingApp = await prisma.profileApplication.findFirst({
    where: {
      StudentProfileID: studentProfile.ProfileID,
      ApplicationStatus: PENDING_STATUS,
    },
  });

  if (pendingApp) {
    throw new AppError(
      PROFILE_APPLICATION_ERROR_MESSAGES.PROFILE_APPLICATION_SUBMIT_ALREADY_PENDING,
      {
        statusCode: 409,
        code: PROFILE_APPLICATION_ERROR_CODES.PROFILE_APPLICATION_SUBMIT_ALREADY_PENDING,
        details: businessErrorDetails(
          PROFILE_APPLICATION_ERROR_MESSAGES.PROFILE_APPLICATION_SUBMIT_ALREADY_PENDING,
        ),
      },
    );
  }

  return prisma.profileApplication.create({
    data: {
      StudentProfileID: studentProfile.ProfileID,
      ApplicationStatus: PENDING_STATUS,
      SubmissionDate: new Date(),
    },
    select: {
      ApplicationID: true,
      StudentProfileID: true,
      ApplicationStatus: true,
      SubmissionDate: true,
    },
  });
};

export const getMyApplications = async (
  studentAccountId: number,
  params: GetMyApplicationsParams,
): Promise<PaginatedProfileApplicationListItem> => {
  const validated = getListSchema.parse({ ...params, page: params.page ?? 1 });

  const studentProfile = await prisma.userProfile.findUnique({
    where: { AccountID: studentAccountId },
    select: { ProfileID: true },
  });

  if (!studentProfile) {
    throw new AppError(
      PROFILE_APPLICATION_ERROR_MESSAGES.PROFILE_APPLICATION_SUBMIT_STUDENT_PROFILE_NOT_FOUND,
      {
        statusCode: 404,
        code: PROFILE_APPLICATION_ERROR_CODES.PROFILE_APPLICATION_SUBMIT_STUDENT_PROFILE_NOT_FOUND,
        details: businessErrorDetails(
          PROFILE_APPLICATION_ERROR_MESSAGES.PROFILE_APPLICATION_SUBMIT_STUDENT_PROFILE_NOT_FOUND,
        ),
      },
    );
  }

  const [list, total] = await Promise.all([
    prisma.profileApplication.findMany({
      where: { StudentProfileID: studentProfile.ProfileID },
      skip: (validated.page - 1) * validated.limit,
      take: validated.limit,
      orderBy: { SubmissionDate: "desc" },
    }),
    prisma.profileApplication.count({
      where: { StudentProfileID: studentProfile.ProfileID },
    }),
  ]);

  const items: ProfileApplicationListItem[] = list.map((app) => ({
    ApplicationID: app.ApplicationID,
    StudentProfileID: app.StudentProfileID,
    FullName: "",
    ApplicationStatus: app.ApplicationStatus ?? "",
    SubmissionDate: app.SubmissionDate?.toISOString() ?? null,
    ReviewedByProfileID: app.ReviewedByProfileID ?? null,
    ReviewDate: app.ReviewDate?.toISOString() ?? null,
  }));

  return {
    data: items,
    meta: {
      page: validated.page,
      limit: validated.limit,
      total,
    },
  };
};

export const getApplicationDetail = async (
  applicationId: number,
  reviewerAccountId?: number,
) => {
  const app = await prisma.profileApplication.findUnique({
    where: { ApplicationID: applicationId },
    include: {
      student: {
        select: {
          ProfileID: true,
          FullName: true,
        },
      },
      reviewer: {
        select: {
          ProfileID: true,
          FullName: true,
        },
      },
    },
  });

  if (!app) {
    throw new AppError(
      PROFILE_APPLICATION_ERROR_MESSAGES.PROFILE_APPLICATION_DETAIL_NOT_FOUND,
      {
        statusCode: 404,
        code: PROFILE_APPLICATION_ERROR_CODES.PROFILE_APPLICATION_DETAIL_NOT_FOUND,
        details: businessErrorDetails(
          PROFILE_APPLICATION_ERROR_MESSAGES.PROFILE_APPLICATION_DETAIL_NOT_FOUND,
        ),
      },
    );
  }

  if (reviewerAccountId && app.StudentProfileID !== reviewerAccountId) {
    // TODO: implement permission check for reviewer
  }

  const certCount = await prisma.certificateDetail.count({
    where: { ApplicationID: applicationId },
  });

  return {
    ApplicationID: app.ApplicationID,
    StudentProfileID: app.StudentProfileID,
    StudentFullName: app.student.FullName ?? "",
    ApplicationStatus: app.ApplicationStatus ?? "",
    SubmissionDate: app.SubmissionDate?.toISOString() ?? null,
    ReviewedByProfileID: app.ReviewedByProfileID ?? null,
    ReviewedByFullName: app.reviewer?.FullName ?? null,
    ReviewDate: app.ReviewDate?.toISOString() ?? null,
    ReviewNotes: app.ReviewNotes ?? null,
    CertificatesCount: certCount,
  } as ProfileApplicationDetail;
};

export const updateApplication = async (
  applicationId: number,
  studentAccountId: number,
) => {
  const studentProfile = await prisma.userProfile.findUnique({
    where: { AccountID: studentAccountId },
    select: { ProfileID: true },
  });

  if (!studentProfile) {
    throw new AppError(
      PROFILE_APPLICATION_ERROR_MESSAGES.PROFILE_APPLICATION_UPDATE_NOT_OWNER,
      {
        statusCode: 403,
        code: PROFILE_APPLICATION_ERROR_CODES.PROFILE_APPLICATION_UPDATE_NOT_OWNER,
        details: businessErrorDetails(
          PROFILE_APPLICATION_ERROR_MESSAGES.PROFILE_APPLICATION_UPDATE_NOT_OWNER,
        ),
      },
    );
  }

  const app = await prisma.profileApplication.findFirst({
    where: {
      ApplicationID: applicationId,
      StudentProfileID: studentProfile.ProfileID,
      ApplicationStatus: PENDING_STATUS,
    },
  });

  if (!app) {
    if (!studentProfile) {
      throw new AppError(
        PROFILE_APPLICATION_ERROR_MESSAGES.PROFILE_APPLICATION_UPDATE_NOT_OWNER,
        {
          statusCode: 403,
          code: PROFILE_APPLICATION_ERROR_CODES.PROFILE_APPLICATION_UPDATE_NOT_OWNER,
          details: businessErrorDetails(
            PROFILE_APPLICATION_ERROR_MESSAGES.PROFILE_APPLICATION_UPDATE_NOT_OWNER,
          ),
        },
      );
    }

    throw new AppError(
      PROFILE_APPLICATION_ERROR_MESSAGES.PROFILE_APPLICATION_UPDATE_NOT_PENDING,
      {
        statusCode: 409,
        code: PROFILE_APPLICATION_ERROR_CODES.PROFILE_APPLICATION_UPDATE_NOT_PENDING,
        details: businessErrorDetails(
          PROFILE_APPLICATION_ERROR_MESSAGES.PROFILE_APPLICATION_UPDATE_NOT_PENDING,
        ),
      },
    );
  }

  return prisma.profileApplication.update({
    where: { ApplicationID: applicationId },
    data: {
      SubmissionDate: new Date(),
    },
    select: {
      ApplicationID: true,
      StudentProfileID: true,
      ApplicationStatus: true,
      SubmissionDate: true,
    },
  });
};

export const reviewApplication = async (
  applicationId: number,
  input: ReviewApplicationInput,
  reviewerAccountId: number,
) => {
  const validated = reviewSchema.parse(input);

  const reviewerProfile = await prisma.userProfile.findUnique({
    where: { AccountID: reviewerAccountId },
    select: { ProfileID: true },
  });

  if (!reviewerProfile) {
    throw new AppError("Người xét duyệt không tồn tại", {
      statusCode: 404,
      code: "REVIEWER_NOT_FOUND" as ProfileApplicationErrorCode,
      details: businessErrorDetails("Người xét duyệt không tồn tại"),
    });
  }

  const app = await prisma.profileApplication.findFirst({
    where: {
      ApplicationID: applicationId,
      ApplicationStatus: PENDING_STATUS,
    },
  });

  if (!app) {
    throw new AppError(
      PROFILE_APPLICATION_ERROR_MESSAGES.PROFILE_APPLICATION_REVIEW_ALREADY_REVIEWED,
      {
        statusCode: 409,
        code: PROFILE_APPLICATION_ERROR_CODES.PROFILE_APPLICATION_REVIEW_ALREADY_REVIEWED,
        details: businessErrorDetails(
          PROFILE_APPLICATION_ERROR_MESSAGES.PROFILE_APPLICATION_REVIEW_ALREADY_REVIEWED,
        ),
      },
    );
  }

  return prisma.profileApplication.update({
    where: { ApplicationID: applicationId },
    data: {
      ApplicationStatus: validated.applicationStatus,
      ReviewedByProfileID: reviewerProfile.ProfileID,
      ReviewDate: new Date(),
      ReviewNotes: validated.reviewNotes,
    },
    select: {
      ApplicationID: true,
      StudentProfileID: true,
      ApplicationStatus: true,
      ReviewedByProfileID: true,
      ReviewDate: true,
      ReviewNotes: true,
    },
  });
};

export const getApplicationCertificates = async (applicationId: number) => {
  const certificates = await prisma.certificateDetail.findMany({
    where: { ApplicationID: applicationId },
    include: {
      certificateType: {
        select: {
          CertificateTypeID: true,
          TypeName: true,
        },
      },
    },
  });

  if (certificates.length === 0) {
    throw new AppError(
      PROFILE_APPLICATION_ERROR_MESSAGES.PROFILE_APPLICATION_CERTIFICATES_NOT_FOUND,
      {
        statusCode: 404,
        code: PROFILE_APPLICATION_ERROR_CODES.PROFILE_APPLICATION_CERTIFICATES_NOT_FOUND,
        details: businessErrorDetails(
          PROFILE_APPLICATION_ERROR_MESSAGES.PROFILE_APPLICATION_CERTIFICATES_NOT_FOUND,
        ),
      },
    );
  }

  return certificates;
};
