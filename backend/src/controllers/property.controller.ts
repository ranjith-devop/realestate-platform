import { Request, Response, NextFunction } from "express";
import { PropertyService } from "../services/property.service";
import { ApiResponseHelper } from "../utils/apiResponse";
import { PropertyQueryParams } from "../validators/property.validator";

export class PropertyController {
  static async searchProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const queryParams = req.query as unknown as PropertyQueryParams;
      const { properties, meta } = await PropertyService.searchProperties(queryParams);
      ApiResponseHelper.success(res, properties, "Properties retrieved successfully", 200, meta);
    } catch (error) {
      next(error);
    }
  }

  static async getPropertyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const property = await PropertyService.getPropertyById(id);
      if (!property) {
        ApiResponseHelper.notFound(res, "Property not found");
        return;
      }
      ApiResponseHelper.success(res, property, "Property details retrieved");
    } catch (error) {
      next(error);
    }
  }

  static async getSimilarProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;
      const similar = await PropertyService.getSimilarProperties(id, limit);
      ApiResponseHelper.success(res, similar, "Similar properties retrieved");
    } catch (error) {
      next(error);
    }
  }

  static async createProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        ApiResponseHelper.unauthorized(res);
        return;
      }
      const property = await PropertyService.createProperty(req.body, userId);
      ApiResponseHelper.created(res, property, "Property listed successfully");
    } catch (error) {
      next(error);
    }
  }

  static async updateProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const property = await PropertyService.updateProperty(id, req.body);
      ApiResponseHelper.success(res, property, "Property updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async deleteProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      await PropertyService.deleteProperty(id);
      ApiResponseHelper.success(res, null, "Property deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getMyProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        ApiResponseHelper.unauthorized(res);
        return;
      }
      const properties = await PropertyService.getOwnerProperties(userId);
      ApiResponseHelper.success(res, properties, "User listings retrieved");
    } catch (error) {
      next(error);
    }
  }

  static async getCityStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await PropertyService.getCityStats();
      ApiResponseHelper.success(res, stats, "City statistics retrieved");
    } catch (error) {
      next(error);
    }
  }
}
