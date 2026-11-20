import { Request, Response, NextFunction } from "express";
import { LeadService } from "../services/lead.service";
import { ApiResponseHelper } from "../utils/apiResponse";

export class LeadController {
  static async createLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const buyerId = req.user?.userId;
      const ip = req.ip || req.socket.remoteAddress;
      const lead = await LeadService.createLead(req.body, buyerId, ip);
      ApiResponseHelper.created(res, lead, "Inquiry submitted successfully! The owner will contact you.");
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("already sent") ||
          error.message.includes("Spam") ||
          error.message.includes("own property"))
      ) {
        ApiResponseHelper.badRequest(res, error.message);
        return;
      }
      next(error);
    }
  }

  static async getMyReceivedLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        ApiResponseHelper.unauthorized(res);
        return;
      }
      const leads = await LeadService.getLeadsForOwner(userId);
      ApiResponseHelper.success(res, leads, "Received inquiries retrieved");
    } catch (error) {
      next(error);
    }
  }

  static async getMySentLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        ApiResponseHelper.unauthorized(res);
        return;
      }
      const leads = await LeadService.getLeadsSentByBuyer(userId);
      ApiResponseHelper.success(res, leads, "Sent inquiries retrieved");
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const { status } = req.body;
      const userId = req.user?.userId;
      if (!userId) {
        ApiResponseHelper.unauthorized(res);
        return;
      }
      const updated = await LeadService.updateLeadStatus(id, status, userId);
      ApiResponseHelper.success(res, updated, "Inquiry status updated");
    } catch (error) {
      if (error instanceof Error && error.message.includes("permission")) {
        ApiResponseHelper.forbidden(res, error.message);
        return;
      }
      next(error);
    }
  }
}
