import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiResponseHelper } from "../utils/apiResponse";

export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        ApiResponseHelper.badRequest(res, "Validation failed", { issues });
        return;
      }
      ApiResponseHelper.badRequest(res, "Invalid input data");
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = (await schema.parseAsync(req.query)) as Request["query"];
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        ApiResponseHelper.badRequest(res, "Query parameter validation failed", { issues });
        return;
      }
      ApiResponseHelper.badRequest(res, "Invalid query parameters");
    }
  };
};
