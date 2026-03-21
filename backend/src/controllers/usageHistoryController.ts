import { Request, Response } from 'express';
import * as usageHistoryService from '../services/usageHistoryService';
import { sendSuccess } from '../utils/response';
import { parseOrThrow, parsePositiveIntParamOrThrow } from '../utils/validation';
import { USAGE_ERROR_MESSAGES, USAGE_SUCCESS_MESSAGES } from '../constants/errors/usageHistory/messages';
import { 
  createSchema, 
  updateSchema, 
  listSchema 
} from '../services/usageHistoryService';

/* ================= LIST ================= */
export const listUsageHistories = async (req: Request, res: Response) => {
  const validatedQuery = parseOrThrow(listSchema, req.query, {
    code: USAGE_ERROR_MESSAGES.USAGE_LIST_INVALID_QUERY,
    message: USAGE_ERROR_MESSAGES.USAGE_LIST_INVALID_QUERY,
  });

  const result = await usageHistoryService.listUsageHistories(validatedQuery);
  sendSuccess(res, result.data, 200, result.meta);
};

/* ================= CREATE ================= */
export const createUsageHistory = async (req: Request, res: Response) => {
  const data = parseOrThrow(createSchema, req.body, {
    code: USAGE_ERROR_MESSAGES.USAGE_CREATE_INVALID_INPUT,
    message: USAGE_ERROR_MESSAGES.USAGE_CREATE_INVALID_INPUT,
  });

  const result = await usageHistoryService.createUsageHistory(data);
  sendSuccess(res, result, 201);
};

/* ================= GET DETAIL ================= */
export const getUsageHistory = async (req: Request, res: Response) => {
  const usageHistoryId = parsePositiveIntParamOrThrow(req.params.usageHistoryId, {
    code: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_ID,
    message: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_ID,
    fieldName: 'usageHistoryId',
    fieldMessage: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_ID,
  });

  const result = await usageHistoryService.getUsageHistory(usageHistoryId);
  sendSuccess(res, result, 200);
};

/* ================= UPDATE ================= */
export const updateUsageHistory = async (req: Request, res: Response) => {
  const usageHistoryId = parsePositiveIntParamOrThrow(req.params.usageHistoryId, {
    code: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_ID,
    message: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_ID,
    fieldName: 'usageHistoryId',
    fieldMessage: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_ID,
  });

  const data = parseOrThrow(updateSchema, req.body, {
    code: USAGE_ERROR_MESSAGES.USAGE_UPDATE_INVALID_INPUT,
    message: USAGE_ERROR_MESSAGES.USAGE_UPDATE_INVALID_INPUT,
  });

  const result = await usageHistoryService.updateUsageHistory(usageHistoryId, data);
  sendSuccess(res, result, 200);
};

/* ================= DELETE ================= */
export const deleteUsageHistory = async (req: Request, res: Response) => {
  const usageHistoryId = parsePositiveIntParamOrThrow(req.params.usageHistoryId, {
    code: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_ID,
    message: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_ID,
    fieldName: 'usageHistoryId',
    fieldMessage: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_ID,
  });

  await usageHistoryService.deleteUsageHistory(usageHistoryId);
  sendSuccess(res, { message: USAGE_SUCCESS_MESSAGES.USAGE_DELETE_SUCCESS }, 200);
};

/* ================= LINK SECTION ================= */
export const linkSection = async (req: Request, res: Response) => {
  const usageHistoryId = parsePositiveIntParamOrThrow(req.params.usageHistoryId, {
    code: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_ID,
    message: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_ID,
    fieldName: 'usageHistoryId',
    fieldMessage: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_ID,
  });

  const sectionId = parsePositiveIntParamOrThrow(req.params.sectionId, {
    code: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_SECTION_ID,
    message: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_SECTION_ID,
    fieldName: 'sectionId',
    fieldMessage: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_SECTION_ID,
  });

  const result = await usageHistoryService.linkSection(usageHistoryId, sectionId);
  sendSuccess(res, result, 201);
};

/* ================= UNLINK SECTION ================= */
export const unlinkSection = async (req: Request, res: Response) => {
  const usageHistoryId = parsePositiveIntParamOrThrow(req.params.usageHistoryId, {
    code: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_ID,
    message: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_ID,
    fieldName: 'usageHistoryId',
    fieldMessage: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_ID,
  });

  const sectionId = parsePositiveIntParamOrThrow(req.params.sectionId, {
    code: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_SECTION_ID,
    message: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_SECTION_ID,
    fieldName: 'sectionId',
    fieldMessage: USAGE_ERROR_MESSAGES.USAGE_PARAM_INVALID_SECTION_ID,
  });

  const result = await usageHistoryService.unlinkSection(usageHistoryId, sectionId);
  sendSuccess(res, result, 200);
};