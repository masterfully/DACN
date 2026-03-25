import { Request, Response } from "express";
import { ATTENDANCE_ERROR_CODES } from "../constants/errors/attendance/codes";
import {
  ATTENDANCE_ERROR_MESSAGES,
  ATTENDANCE_FIELD_ERROR_MESSAGES,
} from "../constants/errors/attendance/messages";
import {
  createAttendance,
  createAttendanceSchema,
  deleteAttendance,
  getAttendanceDetail,
  getAttendances,
  getAttendancesBySection,
  getAttendancesBySectionQuerySchema,
  getAttendancesQuerySchema,
  updateAttendance,
  updateAttendanceSchema,
} from "../services/attendanceService";
import { sendSuccess } from "../utils/response";
import { parseOrThrow, parsePositiveIntParamOrThrow } from "../utils/validation";

export const getAttendancesHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const query = parseOrThrow(getAttendancesQuerySchema, req.query, {
    code: ATTENDANCE_ERROR_CODES.ATTENDANCE_LIST_INVALID_QUERY,
    message: ATTENDANCE_ERROR_MESSAGES.ATTENDANCE_LIST_INVALID_QUERY,
  });

  const result = await getAttendances(query);
  sendSuccess(res, result.attendances, 200, {
    page: query.page,
    limit: query.limit,
    total: result.total,
  });
};

export const createAttendanceHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const payload = parseOrThrow(createAttendanceSchema, req.body, {
    code: ATTENDANCE_ERROR_CODES.ATTENDANCE_CREATE_INVALID_INPUT,
    message: ATTENDANCE_ERROR_MESSAGES.ATTENDANCE_CREATE_INVALID_INPUT,
  });

  await createAttendance(payload);
  sendSuccess(res, null, 201);
};

export const getAttendanceDetailHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const attendanceId = parsePositiveIntParamOrThrow(req.params.attendanceId, {
    code: ATTENDANCE_ERROR_CODES.ATTENDANCE_PARAM_INVALID_ID,
    message: ATTENDANCE_ERROR_MESSAGES.ATTENDANCE_PARAM_INVALID_ID,
    fieldName: "attendanceId",
    fieldMessage: ATTENDANCE_FIELD_ERROR_MESSAGES.ATTENDANCE_ID_INVALID,
  });

  const attendance = await getAttendanceDetail(attendanceId);
  sendSuccess(res, attendance, 200);
};

export const updateAttendanceHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const attendanceId = parsePositiveIntParamOrThrow(req.params.attendanceId, {
    code: ATTENDANCE_ERROR_CODES.ATTENDANCE_PARAM_INVALID_ID,
    message: ATTENDANCE_ERROR_MESSAGES.ATTENDANCE_PARAM_INVALID_ID,
    fieldName: "attendanceId",
    fieldMessage: ATTENDANCE_FIELD_ERROR_MESSAGES.ATTENDANCE_ID_INVALID,
  });

  const payload = parseOrThrow(updateAttendanceSchema, req.body, {
    code: ATTENDANCE_ERROR_CODES.ATTENDANCE_UPDATE_INVALID_INPUT,
    message: ATTENDANCE_ERROR_MESSAGES.ATTENDANCE_UPDATE_INVALID_INPUT,
  });

  const attendance = await updateAttendance(attendanceId, payload);
  sendSuccess(res, attendance, 200);
};

export const deleteAttendanceHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const attendanceId = parsePositiveIntParamOrThrow(req.params.attendanceId, {
    code: ATTENDANCE_ERROR_CODES.ATTENDANCE_PARAM_INVALID_ID,
    message: ATTENDANCE_ERROR_MESSAGES.ATTENDANCE_PARAM_INVALID_ID,
    fieldName: "attendanceId",
    fieldMessage: ATTENDANCE_FIELD_ERROR_MESSAGES.ATTENDANCE_ID_INVALID,
  });

  await deleteAttendance(attendanceId);
  sendSuccess(res, null, 200);
};

export const getAttendancesBySectionHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const sectionId = parsePositiveIntParamOrThrow(req.params.sectionId, {
    code: ATTENDANCE_ERROR_CODES.ATTENDANCE_SECTION_PARAM_INVALID_ID,
    message: ATTENDANCE_ERROR_MESSAGES.ATTENDANCE_SECTION_PARAM_INVALID_ID,
    fieldName: "sectionId",
    fieldMessage: ATTENDANCE_FIELD_ERROR_MESSAGES.SECTION_PARAM_ID_INVALID,
  });

  const query = parseOrThrow(getAttendancesBySectionQuerySchema, req.query, {
    code: ATTENDANCE_ERROR_CODES.ATTENDANCE_SECTION_LIST_INVALID_QUERY,
    message: ATTENDANCE_ERROR_MESSAGES.ATTENDANCE_SECTION_LIST_INVALID_QUERY,
  });

  const result = await getAttendancesBySection(sectionId, query);
  sendSuccess(res, result.attendances, 200, {
    page: query.page,
    limit: query.limit,
    total: result.total,
  });
};
