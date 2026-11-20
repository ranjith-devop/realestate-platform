import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { ApiResponseHelper } from "../utils/apiResponse";

export const verifyPropertyOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const propertyId = String(req.params.id);
    const currentUserId = req.user?.userId;
    const userRole = req.user?.role;

    if (!currentUserId) {
      ApiResponseHelper.unauthorized(res, "Authentication required");
      return;
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, ownerId: true },
    });

    if (!property) {
      ApiResponseHelper.notFound(res, "Property not found");
      return;
    }

    if (property.ownerId !== currentUserId && userRole !== "ADMIN") {
      ApiResponseHelper.forbidden(res, "You do not have permission to modify this property");
      return;
    }

    next();
  } catch (error) {
    ApiResponseHelper.error(res, "Error verifying property ownership", 500, error);
  }
};
