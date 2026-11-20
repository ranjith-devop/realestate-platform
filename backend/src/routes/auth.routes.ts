import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validation.middleware";
import { registerSchema, loginSchema, refreshTokenSchema } from "../validators/auth.validator";
import { authenticate } from "../middlewares/auth.middleware";
import { authRateLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router();

router.post("/register", authRateLimiter, validateBody(registerSchema), AuthController.register);
router.post("/login", authRateLimiter, validateBody(loginSchema), AuthController.login);
router.post("/refresh", validateBody(refreshTokenSchema), AuthController.refreshTokens);
router.post("/logout", AuthController.logout);
router.get("/me", authenticate, AuthController.getProfile);

export default router;
