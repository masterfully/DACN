import { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";

type RequestWithContext = Request & {
  requestId?: string;
  user?: {
    accountId: number;
    role: "ADMIN" | "LECTURER" | "STUDENT";
    username?: string;
  };
};

const getLogLevel = (statusCode: number): "INFO" | "WARN" | "ERROR" => {
  if (statusCode >= 500) {
    return "ERROR";
  }

  if (statusCode >= 400) {
    return "WARN";
  }

  return "INFO";
};

const SENSITIVE_KEYS = new Set([
  "password",
  "newpassword",
  "currentpassword",
  "confirmpassword",
  "accesstoken",
  "refreshtoken",
  "token",
  "authorization",
]);

const SLOW_REQUEST_THRESHOLD_MS = Number(process.env.SLOW_REQUEST_MS ?? 1000);
const ENABLE_PAYLOAD_LOGS = process.env.LOG_REQUEST_PAYLOAD === "true";
const LOG_FORMAT = process.env.LOG_FORMAT ?? "pretty";

const truncateString = (value: string, maxLength = 200): string => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
};

const sanitizeValue = (value: unknown): unknown => {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (typeof value === "object") {
    const inputRecord = value as Record<string, unknown>;
    const sanitized: Record<string, unknown> = {};

    for (const [key, itemValue] of Object.entries(inputRecord)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        sanitized[key] = "***REDACTED***";
        continue;
      }

      sanitized[key] = sanitizeValue(itemValue);
    }

    return sanitized;
  }

  if (typeof value === "string") {
    return truncateString(value);
  }

  return value;
};

const createRequestId = (): string => {
  return randomUUID();
};

const isEmptyObject = (value: unknown): boolean => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return Object.keys(value as Record<string, unknown>).length === 0;
};

const compactJson = (value: unknown): string => {
  return JSON.stringify(value);
};

const formatPrettyLog = (
  event: "request_started" | "request_completed",
  data: Record<string, unknown>,
): string => {
  const prefix = `[${data.timestamp}] ${data.level} ${String(data.requestId).slice(0, 8)}`;

  if (event === "request_started") {
    const parts = [
      `${prefix} --> ${data.method} ${data.path}`,
      `ip=${data.ip}`,
      `ua=${JSON.stringify(data.userAgent)}`,
    ];

    if (data.user) {
      parts.push(`user=${compactJson(data.user)}`);
    }

    if (!isEmptyObject(data.query)) {
      parts.push(`query=${compactJson(data.query)}`);
    }

    if (data.payload) {
      parts.push(`payload=${compactJson(data.payload)}`);
    }

    return parts.join(" | ");
  }

  const parts = [
    `${prefix} <-- ${data.method} ${data.path}`,
    `status=${data.statusCode}`,
    `time=${data.durationMs}ms`,
    `size=${data.responseSizeBytes ?? "-"}`,
  ];

  if (data.slowRequest === true) {
    parts.push("slow=true");
  }

  return parts.join(" | ");
};

const logEvent = (
  event: "request_started" | "request_completed",
  data: Record<string, unknown>,
): void => {
  if (LOG_FORMAT === "json") {
    console.log(JSON.stringify({ event, ...data }));
    return;
  }

  console.log(formatPrettyLog(event, data));
};

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const request = req as RequestWithContext;
  const startTime = process.hrtime.bigint();
  const requestId = createRequestId();
  request.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  const requestContext = {
    requestId,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip || req.socket.remoteAddress || "unknown",
    userAgent: req.get("user-agent") || "unknown",
    user: request.user
      ? {
          accountId: request.user.accountId,
          role: request.user.role,
        }
      : null,
    query: sanitizeValue(req.query),
    payload:
      ENABLE_PAYLOAD_LOGS && Object.keys(req.body ?? {}).length > 0
        ? sanitizeValue(req.body)
        : undefined,
  };

  logEvent("request_started", {
    timestamp: new Date().toISOString(),
    level: "INFO",
    ...requestContext,
  });

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startTime) / 1_000_000;
    const { statusCode } = res;

    const level =
      durationMs >= SLOW_REQUEST_THRESHOLD_MS && statusCode < 400
        ? "WARN"
        : getLogLevel(statusCode);

    const responseSizeHeader = res.getHeader("content-length");
    const responseSizeBytes =
      typeof responseSizeHeader === "string"
        ? Number(responseSizeHeader)
        : typeof responseSizeHeader === "number"
          ? responseSizeHeader
          : null;

    logEvent("request_completed", {
      timestamp: new Date().toISOString(),
      level,
      ...requestContext,
      statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      responseSizeBytes,
      slowRequest: durationMs >= SLOW_REQUEST_THRESHOLD_MS,
    });
  });

  next();
};
