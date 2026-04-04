import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  listCertificateTypes,
  createCertificateType,
  getCertificateType,
  updateCertificateType,
  deleteCertificateType,
} from "../services/certificateTypeService";
import { sendSuccess } from "../utils/response";
import { parseOrThrow, parsePositiveIntParamOrThrow } from "../utils/validation";
import { CERTIFICATE_TYPE_ERROR_CODES } from "../constants/errors/certificateType/codes";
import {
  CERTIFICATE_TYPE_ERROR_MESSAGES,
  CERTIFICATE_TYPE_FIELD_ERROR_MESSAGES,
} from "../constants/errors/certificateType/index";

// Validation schemas
const listSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});

const createSchema = z.object({
  TypeName: z.string().min(1).max(255),
  Description: z.string().max(1000).optional(),
});

const updateSchema = z.object({
  TypeName: z.string().min(1).max(255).optional(),
  Description: z.string().max(1000).optional(),
}).refine((data) => Object.values(data).some((value) => value !== undefined), {
  message: "Phải cung cấp ít nhất một trường để cập nhật",
});

export async function listCertificateTypesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validated = parseOrThrow(listSchema, req.query, {
      code: CERTIFICATE_TYPE_ERROR_CODES.CERTIFICATE_TYPE_LIST_INVALID_QUERY,
      message: CERTIFICATE_TYPE_ERROR_MESSAGES.CERTIFICATE_TYPE_LIST_INVALID_QUERY,
    });

    const { rows, total } = await listCertificateTypes(validated);
    const meta = {
      page: validated.page,
      limit: validated.limit,
      total,
    };
    sendSuccess(res, rows, 200, meta);
  } catch (error) {
    next(error);
  }
}

export async function createCertificateTypeHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validated = parseOrThrow(createSchema, req.body, {
      code: CERTIFICATE_TYPE_ERROR_CODES.CERTIFICATE_TYPE_CREATE_NAME_REQUIRED,
      message: CERTIFICATE_TYPE_ERROR_MESSAGES.CERTIFICATE_TYPE_CREATE_NAME_REQUIRED,
    });

    const result = await createCertificateType(validated);
    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}

export async function getCertificateTypeHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const typeId = parsePositiveIntParamOrThrow(req.params.typeId, {
      code: CERTIFICATE_TYPE_ERROR_CODES.CERTIFICATE_TYPE_DETAIL_NOT_FOUND,
      message: CERTIFICATE_TYPE_ERROR_MESSAGES.CERTIFICATE_TYPE_DETAIL_NOT_FOUND,
      fieldName: "typeId",
      fieldMessage: "ID loại chứng chỉ không hợp lệ",
    });

    const result = await getCertificateType(typeId);
    sendSuccess(res, result, 200);
  } catch (error) {
    next(error);
  }
}

export async function updateCertificateTypeHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const typeId = parsePositiveIntParamOrThrow(req.params.typeId, {
      code: CERTIFICATE_TYPE_ERROR_CODES.CERTIFICATE_TYPE_UPDATE_NOT_FOUND,
      message: CERTIFICATE_TYPE_ERROR_MESSAGES.CERTIFICATE_TYPE_UPDATE_NOT_FOUND,
      fieldName: "typeId",
      fieldMessage: "ID loại chứng chỉ không hợp lệ",
    });

    const validated = parseOrThrow(updateSchema, req.body, {
      code: CERTIFICATE_TYPE_ERROR_CODES.CERTIFICATE_TYPE_UPDATE_NOT_FOUND,
      message: "Dữ liệu cập nhật loại chứng chỉ không hợp lệ",
    });

    const result = await updateCertificateType(typeId, validated);
    sendSuccess(res, result, 200);
  } catch (error) {
    next(error);
  }
}

export async function deleteCertificateTypeHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const typeId = parsePositiveIntParamOrThrow(req.params.typeId, {
      code: CERTIFICATE_TYPE_ERROR_CODES.CERTIFICATE_TYPE_DELETE_NOT_FOUND,
      message: CERTIFICATE_TYPE_ERROR_MESSAGES.CERTIFICATE_TYPE_DELETE_NOT_FOUND,
      fieldName: "typeId",
      fieldMessage: "ID loại chứng chỉ không hợp lệ",
    });

    await deleteCertificateType(typeId);
    sendSuccess(res, { deleted: true }, 200);
  } catch (error) {
    next(error);
  }
}

