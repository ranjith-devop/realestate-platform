import { Response } from "express";
import { PaginationMeta } from "../types";

export class ApiResponseHelper {
  static success<T>(
    res: Response,
    data: T,
    message = "Success",
    statusCode = 200,
    meta?: PaginationMeta
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(meta && { meta }),
    });
  }

  static created<T>(res: Response, data: T, message = "Resource created successfully"): Response {
    return this.success(res, data, message, 201);
  }

  static error(
    res: Response,
    message = "An error occurred",
    statusCode = 500,
    error: unknown = null
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(error !== null && error !== undefined ? { error } : {}),
    });
  }

  static notFound(res: Response, message = "Resource not found"): Response {
    return this.error(res, message, 404);
  }

  static badRequest(res: Response, message = "Bad Request", error: unknown = null): Response {
    return this.error(res, message, 400, error);
  }

  static unauthorized(res: Response, message = "Unauthorized access"): Response {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message = "Forbidden - insufficient permissions"): Response {
    return this.error(res, message, 403);
  }
}
