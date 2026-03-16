import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

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
        code: "UNAUTHORIZED",
        message: "Missing or invalid bearer token",
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
        code: "SERVER_MISCONFIGURATION",
        message: "Server authentication is not configured correctly",
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
        code: "UNAUTHORIZED",
        message: "Token is invalid or expired",
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
          code: "UNAUTHORIZED",
          message: "Please log in to continue",
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
          code: "FORBIDDEN",
          message: "You do not have permission to access this resource",
        },
        meta: null,
      });
      return;
    }

    next();
  };
};
