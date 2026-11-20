import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { ApiResponseHelper } from "../utils/apiResponse";
import { ENV } from "../config/env";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Unhandled Error Caught by Middleware:", err);

  // Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = (err.meta?.target as string[])?.join(", ") || "field";
      ApiResponseHelper.badRequest(res, `A record with this ${target} already exists.`);
      return;
    }

    if (err.code === "P2025") {
      ApiResponseHelper.notFound(res, "Requested record does not exist or was deleted.");
      return;
    }

    ApiResponseHelper.badRequest(res, "Database operation error", { code: err.code });
    return;
  }

  // Generic Error handling
  const message = err instanceof Error ? err.message : "Internal server error occurred";
  const details = ENV.NODE_ENV === "development" && err instanceof Error ? { stack: err.stack } : undefined;

  ApiResponseHelper.error(res, message, 500, details);
};
