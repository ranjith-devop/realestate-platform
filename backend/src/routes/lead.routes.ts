import { Router } from "express";
import { LeadController } from "../controllers/lead.controller";
import { authenticate, optionalAuthenticate } from "../middlewares/auth.middleware";
import { leadRateLimiter } from "../middlewares/rateLimiter.middleware";
import { validateBody } from "../middlewares/validation.middleware";
import { createLeadSchema, updateLeadStatusSchema } from "../validators/lead.validator";

const router = Router();

// Public lead submission with rate limiter, honeypot & optional authentication
router.post(
  "/",
  leadRateLimiter,
  optionalAuthenticate,
  validateBody(createLeadSchema),
  LeadController.createLead
);

// Protected routes: Property owner inquiries dashboard & Buyer inquiries tracking
router.get("/received", authenticate, LeadController.getMyReceivedLeads);
router.get("/sent", authenticate, LeadController.getMySentLeads);
router.patch("/:id/status", authenticate, validateBody(updateLeadStatusSchema), LeadController.updateStatus);

export default router;
