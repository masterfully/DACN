import { Response } from "express";

export interface ResponseMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ErrorBody {
  code: string;
  message: string;
  details?: unknown;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: ResponseMeta,
): Response => {
  return res.status(statusCode).json({
    success: true,
    data,
    error: null,
    meta: meta ?? null,
  });
};

export const sendError = (
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown,
): Response => {
  return res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      code,
      message,
      details,
    },
    meta: null,
  });
};
