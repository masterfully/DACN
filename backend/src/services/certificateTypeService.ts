import { prisma } from "../prisma/prismaClient";
import { z } from "zod";
import { AppError } from "../middleware/errorHandler";
import {
  CERTIFICATE_TYPE_ERROR_CODES,
  type CertificateTypeErrorCode,
} from "../constants/errors/certificateType";
import {
  CERTIFICATE_TYPE_ERROR_MESSAGES,
} from "../constants/errors/certificateType";
import {
  CERTIFICATE_TYPE_FIELD_ERROR_MESSAGES,
} from "../constants/errors/certificateType";

const businessErrorDetails = (message: string) => ({
  formErrors: [message],
  fieldErrors: {},
});

const listSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});

const createSchema = z.object({
  TypeName: z.string().min(1, CERTIFICATE_TYPE_FIELD_ERROR_MESSAGES.TYPE_NAME_REQUIRED).max(255, CERTIFICATE_TYPE_FIELD_ERROR_MESSAGES.TYPE_NAME_TOO_LONG),
  Description: z.string().max(1000, CERTIFICATE_TYPE_FIELD_ERROR_MESSAGES.DESCRIPTION_TOO_LONG).optional(),
});

const updateSchema = z.object({
  TypeName: z.string().min(1).max(255).optional(),
  Description: z.string().max(1000).optional(),
});

export interface CertificateTypeListItem {
  certificateTypeId: number;
  typeName: string;
  description: string | null;
}

export interface PaginatedCertificateTypeList {
  data: CertificateTypeListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export const listCertificateTypes = async (params: z.infer<typeof listSchema>): Promise<PaginatedCertificateTypeList> => {
  const validated = listSchema.parse(params);
  const where: any = {};

  if (validated.search) {
    where.TypeName = { contains: validated.search, mode: "insensitive" };
  }

  const [items, total] = await Promise.all([
    prisma.certificateType.findMany({
      where,
      skip: (validated.page - 1) * validated.limit,
      take: validated.limit,
      orderBy: { CertificateTypeID: "desc" },
      select: {
        CertificateTypeID: true,
        TypeName: true,
        Description: true,
      },
    }),
    prisma.certificateType.count({ where }),
  ]);

  const data: CertificateTypeListItem[] = items.map(item => ({
    certificateTypeId: item.CertificateTypeID,
    typeName: item.TypeName,
    description: item.Description,
  }));

  return {
    data,
    meta: {
      page: validated.page,
      limit: validated.limit,
      total,
    },
  };
};

export const createCertificateType = async (input: z.infer<typeof createSchema>) => {
  const validated = createSchema.parse(input);

  // Check if type name exists (findFirst since TypeName not @@unique)
  const existing = await prisma.certificateType.findFirst({
    where: { TypeName: validated.TypeName },
  });

  if (existing) {
    throw new AppError(
      CERTIFICATE_TYPE_ERROR_MESSAGES.CERTIFICATE_TYPE_CREATE_NAME_EXISTS,
      {
        statusCode: 409,
        code: CERTIFICATE_TYPE_ERROR_CODES.CERTIFICATE_TYPE_CREATE_NAME_EXISTS,
        details: businessErrorDetails(CERTIFICATE_TYPE_ERROR_MESSAGES.CERTIFICATE_TYPE_CREATE_NAME_EXISTS),
      }
    );
  }

  const type = await prisma.certificateType.create({
    data: {
      TypeName: validated.TypeName,
      Description: validated.Description,
    },
    select: {
      CertificateTypeID: true,
      TypeName: true,
      Description: true,
    },
  });

  return {
    certificateTypeId: type.CertificateTypeID,
    typeName: type.TypeName,
    description: type.Description,
  };
};

export const getCertificateType = async (typeId: number) => {
  const type = await prisma.certificateType.findUnique({
    where: { CertificateTypeID: typeId },
  });

  if (!type) {
    throw new AppError(
      CERTIFICATE_TYPE_ERROR_MESSAGES.CERTIFICATE_TYPE_DETAIL_NOT_FOUND,
      {
        statusCode: 404,
        code: CERTIFICATE_TYPE_ERROR_CODES.CERTIFICATE_TYPE_DETAIL_NOT_FOUND,
        details: businessErrorDetails(CERTIFICATE_TYPE_ERROR_MESSAGES.CERTIFICATE_TYPE_DETAIL_NOT_FOUND),
      }
    );
  }

  return {
    certificateTypeId: type.CertificateTypeID,
    typeName: type.TypeName,
    description: type.Description,
  };
};

export const updateCertificateType = async (typeId: number, input: z.infer<typeof updateSchema>) => {
  const validated = updateSchema.parse(input);

  const type = await prisma.certificateType.findUnique({
    where: { CertificateTypeID: typeId },
  });

  if (!type) {
    throw new AppError(
      CERTIFICATE_TYPE_ERROR_MESSAGES.CERTIFICATE_TYPE_UPDATE_NOT_FOUND,
      {
        statusCode: 404,
        code: CERTIFICATE_TYPE_ERROR_CODES.CERTIFICATE_TYPE_UPDATE_NOT_FOUND,
        details: businessErrorDetails(CERTIFICATE_TYPE_ERROR_MESSAGES.CERTIFICATE_TYPE_UPDATE_NOT_FOUND),
      }
    );
  }

  if (validated.TypeName && validated.TypeName !== type.TypeName) {
    // Check name conflict with findFirst
    const existing = await prisma.certificateType.findFirst({
      where: { 
        TypeName: validated.TypeName,
        NOT: { CertificateTypeID: typeId }
      },
    });

    if (existing) {
      throw new AppError(
        CERTIFICATE_TYPE_ERROR_MESSAGES.CERTIFICATE_TYPE_UPDATE_NAME_EXISTS,
        {
          statusCode: 409,
          code: CERTIFICATE_TYPE_ERROR_CODES.CERTIFICATE_TYPE_UPDATE_NAME_EXISTS,
          details: businessErrorDetails(CERTIFICATE_TYPE_ERROR_MESSAGES.CERTIFICATE_TYPE_UPDATE_NAME_EXISTS),
        }
      );
    }
  }

  const data: any = {};
  if (validated.TypeName !== undefined) data.TypeName = validated.TypeName;
  if (validated.Description !== undefined) data.Description = validated.Description;

  const updated = await prisma.certificateType.update({
    where: { CertificateTypeID: typeId },
    data,
    select: {
      CertificateTypeID: true,
      TypeName: true,
      Description: true,
    },
  });

  return {
    certificateTypeId: updated.CertificateTypeID,
    typeName: updated.TypeName,
    description: updated.Description,
  };
};

export const deleteCertificateType = async (typeId: number) => {
  const usageCount = await prisma.certificateDetail.count({
    where: { CertificateTypeID: typeId },
  });

  if (usageCount > 0) {
    throw new AppError(
      CERTIFICATE_TYPE_ERROR_MESSAGES.CERTIFICATE_TYPE_DELETE_IN_USE,
      {
        statusCode: 409,
        code: CERTIFICATE_TYPE_ERROR_CODES.CERTIFICATE_TYPE_DELETE_IN_USE,
        details: businessErrorDetails(CERTIFICATE_TYPE_ERROR_MESSAGES.CERTIFICATE_TYPE_DELETE_IN_USE),
      }
    );
  }

  const type = await prisma.certificateType.findUnique({
    where: { CertificateTypeID: typeId },
  });

  if (!type) {
    throw new AppError(
      CERTIFICATE_TYPE_ERROR_MESSAGES.CERTIFICATE_TYPE_DELETE_NOT_FOUND,
      {
        statusCode: 404,
        code: CERTIFICATE_TYPE_ERROR_CODES.CERTIFICATE_TYPE_DELETE_NOT_FOUND,
        details: businessErrorDetails(CERTIFICATE_TYPE_ERROR_MESSAGES.CERTIFICATE_TYPE_DELETE_NOT_FOUND),
      }
    );
  }

  await prisma.certificateType.delete({
    where: { CertificateTypeID: typeId },
  });

  return { deleted: true };
};

