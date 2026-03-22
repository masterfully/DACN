import { Prisma } from "@prisma/client";
import { z } from "zod";
import { REGISTRATION_ERROR_CODES } from "../constants/errors/registration/codes";
import {
  REGISTRATION_ERROR_MESSAGES,
  REGISTRATION_FIELD_ERROR_MESSAGES,
} from "../constants/errors/registration/messages";
import { AppError } from "../middleware/errorHandler";
import { prisma } from "../prisma/prismaClient";

const OPEN_SECTION_STATUS = 1;

const businessErrorDetails = (message: string) => ({
  formErrors: [message],
  fieldErrors: {},
});

export const createRegistrationSchema = z.object({
  sectionId: z.coerce
    .number({
      error: (issue) =>
        issue.input === undefined
          ? REGISTRATION_FIELD_ERROR_MESSAGES.SECTION_ID_REQUIRED
          : REGISTRATION_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID,
    })
    .int(REGISTRATION_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID)
    .positive(REGISTRATION_FIELD_ERROR_MESSAGES.SECTION_ID_INVALID),
});

type CreateRegistrationInput = z.infer<typeof createRegistrationSchema>;

export const registerSection = async (
  accountId: number,
  input: CreateRegistrationInput,
): Promise<{ sectionId: number; studentProfileId: number }> => {
  const studentProfile = await prisma.userProfile.findUnique({
    where: { AccountID: accountId },
    select: { ProfileID: true },
  });

  if (!studentProfile) {
    throw new AppError(
      REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_STUDENT_PROFILE_NOT_FOUND,
      {
        statusCode: 404,
        code: REGISTRATION_ERROR_CODES.REGISTRATION_CREATE_STUDENT_PROFILE_NOT_FOUND,
        details: businessErrorDetails(
          REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_STUDENT_PROFILE_NOT_FOUND,
        ),
      },
    );
  }

  return prisma.$transaction(async (tx) => {
    const section = await tx.section.findUnique({
      where: { SectionID: input.sectionId },
      select: {
        SectionID: true,
        status: true,
        EnrollmentCount: true,
        MaxCapacity: true,
      },
    });

    if (!section) {
      throw new AppError(
        REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_NOT_FOUND,
        {
          statusCode: 404,
          code: REGISTRATION_ERROR_CODES.REGISTRATION_CREATE_SECTION_NOT_FOUND,
          details: businessErrorDetails(
            REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_NOT_FOUND,
          ),
        },
      );
    }

    if (section.status !== OPEN_SECTION_STATUS) {
      throw new AppError(
        REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_NOT_OPEN,
        {
          statusCode: 409,
          code: REGISTRATION_ERROR_CODES.REGISTRATION_CREATE_SECTION_NOT_OPEN,
          details: businessErrorDetails(
            REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_NOT_OPEN,
          ),
        },
      );
    }

    const existedRegistration = await tx.registration.findUnique({
      where: {
        SectionID_StudentProfileID: {
          SectionID: section.SectionID,
          StudentProfileID: studentProfile.ProfileID,
        },
      },
      select: {
        SectionID: true,
      },
    });

    if (existedRegistration) {
      throw new AppError(
        REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_ALREADY_REGISTERED,
        {
          statusCode: 409,
          code: REGISTRATION_ERROR_CODES.REGISTRATION_CREATE_ALREADY_REGISTERED,
          details: businessErrorDetails(
            REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_ALREADY_REGISTERED,
          ),
        },
      );
    }

    if (section.EnrollmentCount >= section.MaxCapacity) {
      throw new AppError(REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_FULL, {
        statusCode: 409,
        code: REGISTRATION_ERROR_CODES.REGISTRATION_CREATE_SECTION_FULL,
        details: businessErrorDetails(
          REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_FULL,
        ),
      });
    }

    try {
      await tx.registration.create({
        data: {
          SectionID: section.SectionID,
          StudentProfileID: studentProfile.ProfileID,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_ALREADY_REGISTERED,
          {
            statusCode: 409,
            code: REGISTRATION_ERROR_CODES.REGISTRATION_CREATE_ALREADY_REGISTERED,
            details: businessErrorDetails(
              REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_ALREADY_REGISTERED,
            ),
          },
        );
      }

      throw error;
    }

    const incrementResult = await tx.section.updateMany({
      where: {
        SectionID: section.SectionID,
        status: OPEN_SECTION_STATUS,
        EnrollmentCount: {
          lt: section.MaxCapacity,
        },
      },
      data: {
        EnrollmentCount: {
          increment: 1,
        },
      },
    });

    if (incrementResult.count === 0) {
      const latestSection = await tx.section.findUnique({
        where: { SectionID: section.SectionID },
        select: {
          status: true,
          EnrollmentCount: true,
          MaxCapacity: true,
        },
      });

      if (!latestSection) {
        throw new AppError(
          REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_NOT_FOUND,
          {
            statusCode: 404,
            code: REGISTRATION_ERROR_CODES.REGISTRATION_CREATE_SECTION_NOT_FOUND,
            details: businessErrorDetails(
              REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_NOT_FOUND,
            ),
          },
        );
      }

      if (latestSection.status !== OPEN_SECTION_STATUS) {
        throw new AppError(
          REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_NOT_OPEN,
          {
            statusCode: 409,
            code: REGISTRATION_ERROR_CODES.REGISTRATION_CREATE_SECTION_NOT_OPEN,
            details: businessErrorDetails(
              REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_NOT_OPEN,
            ),
          },
        );
      }

      throw new AppError(REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_FULL, {
        statusCode: 409,
        code: REGISTRATION_ERROR_CODES.REGISTRATION_CREATE_SECTION_FULL,
        details: businessErrorDetails(
          REGISTRATION_ERROR_MESSAGES.REGISTRATION_CREATE_SECTION_FULL,
        ),
      });
    }

    return {
      sectionId: section.SectionID,
      studentProfileId: studentProfile.ProfileID,
    };
  });
};
