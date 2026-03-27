import { Request, Response } from "express";
import { z } from "zod";
import { sendSuccess } from "../utils/response";
import { AppError } from "../middleware/errorHandler";
import {
  PROFILE_APPLICATION_ERROR_CODES,
} from "../constants/errors/profileApplication/codes";
import {
  PROFILE_APPLICATION_ERROR_MESSAGES,
} from "../constants/errors/profileApplication/messages";
import {
  PROFILE_APPLICATION_FIELD_ERROR_MESSAGES,
} from "../constants/errors/profileApplication/fieldMessages";
import * as service from "../services/profileApplicationService";
import type { AuthUser } from "../middleware/auth";

const getListSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().max(255).optional(),
  applicationStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  submissionFrom: z.string().optional(),
  submissionTo: z.string().optional(),
});

const reviewSchema = z.object({
  applicationStatus: z.enum(["APPROVED", "REJECTED"]),
  reviewNotes: z.string().max(1000).optional(),
});

export const getApplicationsListHandler = async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  
  const validated = getListSchema.parse(req.query);
  const result = await service.getApplicationsList(validated);
  
  sendSuccess(res, result, 200);
};

export const submitApplicationHandler = async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  
  const result = await service.submitApplication(user.accountId);
  sendSuccess(res, result, 201);
};

export const getMyApplicationsHandler = async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  
  const validated = getListSchema.parse(req.query);
  const result = await service.getMyApplications(user.accountId, validated);
  
  sendSuccess(res, result, 200);
};

export const getApplicationDetailHandler = async (req: Request, res: Response) => {
  const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const applicationId = parseInt(idParam, 10);
  
  if (isNaN(applicationId)) {
    throw new AppError(
      "ID hồ sơ không hợp lệ",
      {
        statusCode: 400,
        code: PROFILE_APPLICATION_ERROR_CODES.PROFILE_APPLICATION_DETAIL_NOT_FOUND,
        details: {
          formErrors: [],
          fieldErrors: { id: [PROFILE_APPLICATION_FIELD_ERROR_MESSAGES.APPLICATION_ID_INVALID] },
        },
      }
    );
  }
  
  const user = req.user as AuthUser;
  const result = await service.getApplicationDetail(applicationId, user.accountId);
  
  sendSuccess(res, result, 200);
};

export const updateApplicationHandler = async (req: Request, res: Response) => {
  const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const applicationId = parseInt(idParam, 10);
  
  if (isNaN(applicationId)) {
    throw new AppError(
      "ID hồ sơ không hợp lệ",
      {
        statusCode: 400,
        code: PROFILE_APPLICATION_ERROR_CODES.PROFILE_APPLICATION_UPDATE_NOT_FOUND,
        details: {
          formErrors: [],
          fieldErrors: { id: [PROFILE_APPLICATION_FIELD_ERROR_MESSAGES.APPLICATION_ID_INVALID] },
        },
      }
    );
  }
  
  const user = req.user as AuthUser;
  const result = await service.updateApplication(applicationId, user.accountId);
  
  sendSuccess(res, result, 200);
};

export const reviewApplicationHandler = async (req: Request, res: Response) => {
  const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const applicationId = parseInt(idParam, 10);
  
  if (isNaN(applicationId)) {
    throw new AppError(
      "ID hồ sơ không hợp lệ",
      {
        statusCode: 400,
        code: PROFILE_APPLICATION_ERROR_CODES.PROFILE_APPLICATION_REVIEW_NOT_FOUND,
        details: {
          formErrors: [],
          fieldErrors: { id: [PROFILE_APPLICATION_FIELD_ERROR_MESSAGES.APPLICATION_ID_INVALID] },
        },
      }
    );
  }
  
  const validated = reviewSchema.parse(req.body);
  const user = req.user as AuthUser;
  const result = await service.reviewApplication(applicationId, validated, user.accountId);
  
  sendSuccess(res, result, 200);
};

export const getApplicationCertificatesHandler = async (req: Request, res: Response) => {
  const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const applicationId = parseInt(idParam, 10);
  
  if (isNaN(applicationId)) {
    throw new AppError(
      "ID hồ sơ không hợp lệ",
      {
        statusCode: 400,
        code: PROFILE_APPLICATION_ERROR_CODES.PROFILE_APPLICATION_CERTIFICATES_NOT_FOUND,
        details: {
          formErrors: [],
          fieldErrors: { id: [PROFILE_APPLICATION_FIELD_ERROR_MESSAGES.APPLICATION_ID_INVALID] },
        },
      }
    );
  }
  
  const result = await service.getApplicationCertificates(applicationId);
  sendSuccess(res, result, 200);
};

