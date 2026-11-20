import { Router } from "express";
import { PropertyController } from "../controllers/property.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { Role } from "@prisma/client";
import { verifyPropertyOwnership } from "../middlewares/ownership.middleware";
import { validateBody, validateQuery } from "../middlewares/validation.middleware";
import {
  createPropertySchema,
  updatePropertySchema,
  propertyQuerySchema,
} from "../validators/property.validator";

const router = Router();

// Public routes
router.get("/", validateQuery(propertyQuerySchema), PropertyController.searchProperties);
router.get("/meta/city-stats", PropertyController.getCityStats);
router.get("/user/my-listings", authenticate, PropertyController.getMyProperties);
router.get("/:id", PropertyController.getPropertyById);
router.get("/:id/similar", PropertyController.getSimilarProperties);

// Protected routes (Create, Edit, Delete)
router.post(
  "/",
  authenticate,
  authorizeRoles(Role.OWNER, Role.AGENT, Role.ADMIN),
  validateBody(createPropertySchema),
  PropertyController.createProperty
);
router.put(
  "/:id",
  authenticate,
  verifyPropertyOwnership,
  validateBody(updatePropertySchema),
  PropertyController.updateProperty
);
router.delete("/:id", authenticate, verifyPropertyOwnership, PropertyController.deleteProperty);

export default router;
