import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponseHelper } from "../utils/apiResponse";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      ApiResponseHelper.created(res, result, "User registered successfully");
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        ApiResponseHelper.badRequest(res, error.message);
        return;
      }
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      ApiResponseHelper.success(res, result, "Login successful");
    } catch (error) {
      if (error instanceof Error && error.message.includes("Invalid")) {
        ApiResponseHelper.unauthorized(res, error.message);
        return;
      }
      next(error);
    }
  }

  static async refreshTokens(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const tokens = await AuthService.refreshTokens(refreshToken);
      ApiResponseHelper.success(res, tokens, "Tokens refreshed successfully");
    } catch (error) {
      ApiResponseHelper.unauthorized(res, error instanceof Error ? error.message : "Invalid refresh token");
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      await AuthService.logout(refreshToken);
      ApiResponseHelper.success(res, null, "Logged out successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        ApiResponseHelper.unauthorized(res);
        return;
      }
      const user = await AuthService.getCurrentUser(userId);
      ApiResponseHelper.success(res, user, "User profile retrieved");
    } catch (error) {
      next(error);
    }
  }
}
