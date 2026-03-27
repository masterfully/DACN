import { Request, Response } from "express";
import { AUTH_ERROR_CODES } from "../constants/errors/auth/codes";
import { AUTH_ERROR_MESSAGES } from "../constants/errors/auth/messages";
import { SCHEDULE_ERROR_CODES } from "../constants/errors/schedule/codes";
import { SCHEDULE_ERROR_MESSAGES, SCHEDULE_FIELD_ERROR_MESSAGES } from "../constants/errors/schedule/messages";
import { AppError } from "../middleware/errorHandler";
import {
  createSchedule,
  createScheduleSchema,
  deleteSchedule,
  getMySchedule,
  getMyScheduleQuerySchema,
  getScheduleDetail,
  getSchedules,
  getSchedulesBySection,
  getSchedulesQuerySchema,
  updateSchedule,
  updateScheduleSchema,
} from "../services/scheduleService";
import { sendSuccess } from "../utils/response";
import { parseOrThrow, parsePositiveIntParamOrThrow } from "../utils/validation";

const requireUser = (req: Request): { accountId: number; role: "ADMIN" | "LECTURER" | "STUDENT" | "PARENT" } => {
  if (!req.user) {
    throw new AppError(AUTH_ERROR_MESSAGES.LOGIN_REQUIRED, {
      statusCode: 401,
      code: AUTH_ERROR_CODES.UNAUTHORIZED,
      details: {
        formErrors: [AUTH_ERROR_MESSAGES.LOGIN_REQUIRED],
        fieldErrors: {},
      },
    });
  }

  return {
    accountId: req.user.accountId,
    role: req.user.role,
  };
};

export const getSchedulesHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const query = parseOrThrow(getSchedulesQuerySchema, req.query, {
    code: SCHEDULE_ERROR_CODES.SCHEDULE_LIST_INVALID_QUERY,
    message: SCHEDULE_ERROR_MESSAGES.SCHEDULE_LIST_INVALID_QUERY,
  });

  const result = await getSchedules(query);
  sendSuccess(res, result.schedules, 200, {
    page: query.page,
    limit: query.limit,
    total: result.total,
  });
};

export const createScheduleHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const payload = parseOrThrow(createScheduleSchema, req.body, {
    code: SCHEDULE_ERROR_CODES.SCHEDULE_CREATE_INVALID_INPUT,
    message: SCHEDULE_ERROR_MESSAGES.SCHEDULE_CREATE_INVALID_INPUT,
  });

  await createSchedule(payload);
  sendSuccess(res, null, 201);
};

export const getMyScheduleHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const query = parseOrThrow(getMyScheduleQuerySchema, req.query, {
    code: SCHEDULE_ERROR_CODES.SCHEDULE_MY_LIST_INVALID_QUERY,
    message: SCHEDULE_ERROR_MESSAGES.SCHEDULE_MY_LIST_INVALID_QUERY,
  });

  const user = requireUser(req);
  const schedules = await getMySchedule(user.accountId, user.role, query);
  sendSuccess(res, schedules, 200);
};

export const getScheduleDetailHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const scheduleId = parsePositiveIntParamOrThrow(req.params.scheduleId, {
    code: SCHEDULE_ERROR_CODES.SCHEDULE_PARAM_INVALID_ID,
    message: SCHEDULE_ERROR_MESSAGES.SCHEDULE_PARAM_INVALID_ID,
    fieldName: "scheduleId",
    fieldMessage: SCHEDULE_FIELD_ERROR_MESSAGES.SCHEDULE_ID_INVALID,
  });

  const schedule = await getScheduleDetail(scheduleId);
  sendSuccess(res, schedule, 200);
};

export const updateScheduleHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const scheduleId = parsePositiveIntParamOrThrow(req.params.scheduleId, {
    code: SCHEDULE_ERROR_CODES.SCHEDULE_PARAM_INVALID_ID,
    message: SCHEDULE_ERROR_MESSAGES.SCHEDULE_PARAM_INVALID_ID,
    fieldName: "scheduleId",
    fieldMessage: SCHEDULE_FIELD_ERROR_MESSAGES.SCHEDULE_ID_INVALID,
  });

  const payload = parseOrThrow(updateScheduleSchema, req.body, {
    code: SCHEDULE_ERROR_CODES.SCHEDULE_UPDATE_INVALID_INPUT,
    message: SCHEDULE_ERROR_MESSAGES.SCHEDULE_UPDATE_INVALID_INPUT,
  });

  const schedule = await updateSchedule(scheduleId, payload);
  sendSuccess(res, schedule, 200);
};

export const deleteScheduleHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const scheduleId = parsePositiveIntParamOrThrow(req.params.scheduleId, {
    code: SCHEDULE_ERROR_CODES.SCHEDULE_PARAM_INVALID_ID,
    message: SCHEDULE_ERROR_MESSAGES.SCHEDULE_PARAM_INVALID_ID,
    fieldName: "scheduleId",
    fieldMessage: SCHEDULE_FIELD_ERROR_MESSAGES.SCHEDULE_ID_INVALID,
  });

  await deleteSchedule(scheduleId);
  sendSuccess(res, null, 200);
};

export const getSchedulesBySectionHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const sectionId = parsePositiveIntParamOrThrow(req.params.sectionId, {
    code: SCHEDULE_ERROR_CODES.SCHEDULE_SECTION_PARAM_INVALID_ID,
    message: SCHEDULE_ERROR_MESSAGES.SCHEDULE_SECTION_PARAM_INVALID_ID,
    fieldName: "sectionId",
    fieldMessage: SCHEDULE_FIELD_ERROR_MESSAGES.SECTION_PARAM_ID_INVALID,
  });

  const schedules = await getSchedulesBySection(sectionId);
  sendSuccess(res, schedules, 200);
};

