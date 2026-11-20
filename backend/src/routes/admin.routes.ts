import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

// Strict security: Every admin route requires authentication and ADMIN role
router.use(authenticate, authorizeRoles(Role.ADMIN));

router.get("/stats", AdminController.getStats);
router.get("/users", AdminController.getUsers);
router.patch("/users/:id/role", AdminController.updateUserRole);
router.delete("/users/:id", AdminController.deleteUser);
router.get("/properties", AdminController.getProperties);
router.delete("/properties/:id", AdminController.deleteProperty);
router.get("/leads", AdminController.getLeads);

export default router;
