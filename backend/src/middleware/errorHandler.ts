import { NextFunction, Request, Response } from "express";

const LOG_FORMAT = process.env.LOG_FORMAT ?? "pretty";

const logErrorEvent = (
  level: "WARN" | "ERROR",
  event: "request_failed" | "request_crashed",
  data: Record<string, unknown>,
): void => {
  if (LOG_FORMAT === "json") {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        event,
        ...data,
      }),
    );
    return;
  }

  const requestId = String(data.requestId ?? "unknown").slice(0, 8);
  const method = String(data.method ?? "UNKNOWN");
  const path = String(data.path ?? "/");
  const statusCode = String(data.statusCode ?? "-");
  const code = String(data.code ?? "UNKNOWN_ERROR");
  const message = String(data.message ?? "Unknown error");
  console.error(
    `[${new Date().toISOString()}] ${level} ${requestId} !! ${method} ${path} | status=${statusCode} | code=${code} | message=${JSON.stringify(message)}`,
  );
};

interface AppErrorOptions {
  statusCode: number;
  code: string;
  details?: unknown;
}

const toErrorDetails = (details: unknown): { formErrors: string[]; fieldErrors: Record<string, string[]> } => {
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

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, options: AppErrorOptions) {
    super(message);
    this.name = "AppError";
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.details = options.details;
  }
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const requestId =
    (req as Request & { requestId?: string }).requestId ?? "unknown";

  if (err instanceof AppError) {
    logErrorEvent("WARN", "request_failed", {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: err.statusCode,
      code: err.code,
      message: err.message,
      details: err.details,
    });

    res.status(err.statusCode).json({
      success: false,
      data: null,
      error: {
        code: err.code,
        message: err.message,
        details: toErrorDetails(err.details),
      },
      meta: null,
    });
    return;
  }

  const unknownError = err as Error;

  logErrorEvent("ERROR", "request_crashed", {
    requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: unknownError?.message ?? "Unknown error",
    stack: process.env.NODE_ENV !== "production" ? unknownError?.stack : undefined,
  });

  res.status(500).json({
    success: false,
    data: null,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    },
    meta: null,
  });
};
