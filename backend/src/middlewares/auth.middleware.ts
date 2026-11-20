import { Request, Response, NextFunction } from "express";
import { JwtUtils } from "../utils/jwt.utils";
import { ApiResponseHelper } from "../utils/apiResponse";
import { Role } from "@prisma/client";

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ApiResponseHelper.unauthorized(res, "Missing or invalid authorization header");
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = JwtUtils.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err: unknown) {
    ApiResponseHelper.unauthorized(res, "Access token expired or invalid");
  }
};

export const optionalAuthenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const payload = JwtUtils.verifyAccessToken(token);
      req.user = payload;
    } catch {
      // Ignore invalid token in optional auth
    }
  }

  next();
};

export const authorizeRoles = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ApiResponseHelper.unauthorized(res, "Authentication required");
      return;
    }

    if (!roles.includes(req.user.role)) {
      ApiResponseHelper.forbidden(res, `Requires one of roles: ${roles.join(", ")}`);
      return;
    }

    next();
  };
};
