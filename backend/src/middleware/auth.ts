import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AUTH_ERROR_CODES } from "../constants/errors/auth/codes";
import { AUTH_ERROR_MESSAGES } from "../constants/errors/auth/messages";

type UserRole = "ADMIN" | "LECTURER" | "STUDENT";

export interface AuthUser {
  accountId: number;
  role: UserRole;
  username?: string;
}

interface JwtPayload {
  accountId: number;
  role: UserRole;
  username?: string;
}

const getBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

const getJwtSecret = (): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("Missing JWT_SECRET environment variable");
  }

  return jwtSecret;
};

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    res.status(401).json({
      success: false,
      data: null,
      error: {
        code: AUTH_ERROR_CODES.UNAUTHORIZED,
        message: AUTH_ERROR_MESSAGES.MISSING_OR_INVALID_BEARER_TOKEN,
      },
      meta: null,
    });
    return;
  }

  let jwtSecret: string;
  try {
    jwtSecret = getJwtSecret();
  } catch {
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: AUTH_ERROR_CODES.SERVER_MISCONFIGURATION,
        message: AUTH_ERROR_MESSAGES.SERVER_MISCONFIGURATION,
      },
      meta: null,
    });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as JwtPayload;
    req.user = {
      accountId: payload.accountId,
      role: payload.role,
      username: payload.username,
    };
    next();
  } catch {
    res.status(401).json({
      success: false,
      data: null,
      error: {
        code: AUTH_ERROR_CODES.UNAUTHORIZED,
        message: AUTH_ERROR_MESSAGES.TOKEN_INVALID_OR_EXPIRED,
      },
      meta: null,
    });
  }
};

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        data: null,
        error: {
          code: AUTH_ERROR_CODES.UNAUTHORIZED,
          message: AUTH_ERROR_MESSAGES.LOGIN_REQUIRED,
        },
        meta: null,
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        data: null,
        error: {
          code: AUTH_ERROR_CODES.FORBIDDEN,
          message: AUTH_ERROR_MESSAGES.FORBIDDEN,
        },
        meta: null,
      });
      return;
    }

    next();
  };
};
