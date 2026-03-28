import { Request, Response } from "express";
import { ATTENDANCE_DETAIL_ERROR_CODES } from "../constants/errors/attendanceDetail/codes";
import {
  ATTENDANCE_DETAIL_ERROR_MESSAGES,
  ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES,
} from "../constants/errors/attendanceDetail/messages";
import {
  createAttendanceDetails,
  createAttendanceDetailsSchema,
  getAttendanceDetails,
  getAttendanceDetailsQuerySchema,
  updateAttendanceDetail,
  updateAttendanceDetailSchema,
} from "../services/attendanceDetailService";
import { sendSuccess } from "../utils/response";
import { parseOrThrow, parsePositiveIntParamOrThrow } from "../utils/validation";

export const getAttendanceDetailsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const attendanceId = parsePositiveIntParamOrThrow(req.params.attendanceId, {
    code: ATTENDANCE_DETAIL_ERROR_CODES.ATTENDANCE_DETAIL_PARAM_INVALID_ATTENDANCE_ID,
    message:
      ATTENDANCE_DETAIL_ERROR_MESSAGES.ATTENDANCE_DETAIL_PARAM_INVALID_ATTENDANCE_ID,
    fieldName: "attendanceId",
    fieldMessage: ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.ATTENDANCE_ID_INVALID,
  });

  const query = parseOrThrow(getAttendanceDetailsQuerySchema, req.query, {
    code: ATTENDANCE_DETAIL_ERROR_CODES.ATTENDANCE_DETAIL_LIST_INVALID_QUERY,
    message: ATTENDANCE_DETAIL_ERROR_MESSAGES.ATTENDANCE_DETAIL_LIST_INVALID_QUERY,
  });

  const result = await getAttendanceDetails(attendanceId, query);
  sendSuccess(res, result.details, 200, {
    page: query.page,
    limit: query.limit,
    total: result.total,
  });
};

export const createAttendanceDetailsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const attendanceId = parsePositiveIntParamOrThrow(req.params.attendanceId, {
    code: ATTENDANCE_DETAIL_ERROR_CODES.ATTENDANCE_DETAIL_PARAM_INVALID_ATTENDANCE_ID,
    message:
      ATTENDANCE_DETAIL_ERROR_MESSAGES.ATTENDANCE_DETAIL_PARAM_INVALID_ATTENDANCE_ID,
    fieldName: "attendanceId",
    fieldMessage: ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.ATTENDANCE_ID_INVALID,
  });

  const payload = parseOrThrow(createAttendanceDetailsSchema, req.body, {
    code: ATTENDANCE_DETAIL_ERROR_CODES.ATTENDANCE_DETAIL_CREATE_INVALID_INPUT,
    message: ATTENDANCE_DETAIL_ERROR_MESSAGES.ATTENDANCE_DETAIL_CREATE_INVALID_INPUT,
  });

  const result = await createAttendanceDetails(attendanceId, payload);
  sendSuccess(res, result, 201);
};

export const updateAttendanceDetailHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const attendanceId = parsePositiveIntParamOrThrow(req.params.attendanceId, {
    code: ATTENDANCE_DETAIL_ERROR_CODES.ATTENDANCE_DETAIL_PARAM_INVALID_ATTENDANCE_ID,
    message:
      ATTENDANCE_DETAIL_ERROR_MESSAGES.ATTENDANCE_DETAIL_PARAM_INVALID_ATTENDANCE_ID,
    fieldName: "attendanceId",
    fieldMessage: ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.ATTENDANCE_ID_INVALID,
  });

  const detailId = parsePositiveIntParamOrThrow(req.params.detailId, {
    code: ATTENDANCE_DETAIL_ERROR_CODES.ATTENDANCE_DETAIL_PARAM_INVALID_DETAIL_ID,
    message:
      ATTENDANCE_DETAIL_ERROR_MESSAGES.ATTENDANCE_DETAIL_PARAM_INVALID_DETAIL_ID,
    fieldName: "detailId",
    fieldMessage: ATTENDANCE_DETAIL_FIELD_ERROR_MESSAGES.DETAIL_ID_INVALID,
  });

  const payload = parseOrThrow(updateAttendanceDetailSchema, req.body, {
    code: ATTENDANCE_DETAIL_ERROR_CODES.ATTENDANCE_DETAIL_UPDATE_INVALID_INPUT,
    message: ATTENDANCE_DETAIL_ERROR_MESSAGES.ATTENDANCE_DETAIL_UPDATE_INVALID_INPUT,
  });

  const result = await updateAttendanceDetail(attendanceId, detailId, payload);
  sendSuccess(res, result, 200);
};
