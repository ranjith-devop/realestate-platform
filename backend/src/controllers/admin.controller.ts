import { Request, Response, NextFunction } from "express";
import { AdminService } from "../services/admin.service";
import { ApiResponseHelper } from "../utils/apiResponse";
import { Role, PropertyStatus, LeadStatus } from "@prisma/client";

export class AdminController {
  static async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await AdminService.getPlatformStats();
      ApiResponseHelper.success(res, stats, "Platform statistics retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
      const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 20;
      const search = req.query.search ? String(req.query.search) : undefined;
      const role = req.query.role ? (String(req.query.role) as Role) : undefined;

      const result = await AdminService.getUsers({ page, limit, search, role });
      ApiResponseHelper.success(
        res,
        result.users,
        "Users retrieved successfully",
        200,
        {
          page: result.pagination.page,
          limit: result.pagination.limit,
          totalRecords: result.pagination.totalRecords,
          totalPages: result.pagination.totalPages,
          hasNextPage: result.pagination.page < result.pagination.totalPages,
          hasPrevPage: result.pagination.page > 1,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetUserId = String(req.params.id);
      const newRole = req.body.role as Role;
      const adminId = req.user?.userId;

      if (!adminId) {
        ApiResponseHelper.unauthorized(res);
        return;
      }

      if (!Object.values(Role).includes(newRole)) {
        ApiResponseHelper.badRequest(res, `Invalid role. Allowed: ${Object.values(Role).join(", ")}`);
        return;
      }

      const updated = await AdminService.updateUserRole(targetUserId, newRole, adminId);
      ApiResponseHelper.success(res, updated, `User role updated to ${newRole}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes("demote your own")) {
        ApiResponseHelper.badRequest(res, error.message);
        return;
      }
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetUserId = String(req.params.id);
      const adminId = req.user?.userId;

      if (!adminId) {
        ApiResponseHelper.unauthorized(res);
        return;
      }

      const result = await AdminService.deleteUser(targetUserId, adminId);
      ApiResponseHelper.success(res, result, "User deleted successfully");
    } catch (error) {
      if (error instanceof Error && error.message.includes("delete your own")) {
        ApiResponseHelper.badRequest(res, error.message);
        return;
      }
      next(error);
    }
  }

  static async getProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
      const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 20;
      const search = req.query.search ? String(req.query.search) : undefined;
      const status = req.query.status ? (String(req.query.status) as PropertyStatus) : undefined;

      const result = await AdminService.getAllProperties({ page, limit, search, status });
      ApiResponseHelper.success(
        res,
        result.properties,
        "Properties retrieved successfully",
        200,
        {
          page: result.pagination.page,
          limit: result.pagination.limit,
          totalRecords: result.pagination.totalRecords,
          totalPages: result.pagination.totalPages,
          hasNextPage: result.pagination.page < result.pagination.totalPages,
          hasPrevPage: result.pagination.page > 1,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const propertyId = String(req.params.id);
      const result = await AdminService.deleteProperty(propertyId);
      ApiResponseHelper.success(res, result, "Property removed by SuperAdmin");
    } catch (error) {
      next(error);
    }
  }

  static async getLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
      const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 20;
      const status = req.query.status ? (String(req.query.status) as LeadStatus) : undefined;

      const result = await AdminService.getAllLeads({ page, limit, status });
      ApiResponseHelper.success(
        res,
        result.leads,
        "Inquiries retrieved successfully",
        200,
        {
          page: result.pagination.page,
          limit: result.pagination.limit,
          totalRecords: result.pagination.totalRecords,
          totalPages: result.pagination.totalPages,
          hasNextPage: result.pagination.page < result.pagination.totalPages,
          hasPrevPage: result.pagination.page > 1,
        }
      );
    } catch (error) {
      next(error);
    }
  }
}
