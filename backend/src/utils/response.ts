import { Response } from "express";

export interface ResponseMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ErrorBody {
  code: string;
  message: string;
  details: {
    formErrors: string[];
    fieldErrors: Record<string, string[]>;
  };
}

const toErrorDetails = (details: unknown): ErrorBody["details"] => {
  if (
    details &&
    typeof details === "object" &&
    "formErrors" in (details as Record<string, unknown>) &&
    "fieldErrors" in (details as Record<string, unknown>)
  ) {
    const safe = details as {
      formErrors?: unknown;
      fieldErrors?: unknown;
    };

    return {
      formErrors: Array.isArray(safe.formErrors)
        ? safe.formErrors.filter((item): item is string => typeof item === "string")
        : [],
      fieldErrors:
        safe.fieldErrors && typeof safe.fieldErrors === "object"
          ? Object.fromEntries(
              Object.entries(safe.fieldErrors as Record<string, unknown>).map(([key, value]) => [
                key,
                Array.isArray(value)
                  ? value.filter((item): item is string => typeof item === "string")
                  : [],
              ]),
            )
          : {},
    };
  }

  return {
    formErrors: [],
    fieldErrors: {},
  };
};

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
      details: toErrorDetails(details),
    },
    meta: null,
  });
};
