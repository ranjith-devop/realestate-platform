import { Router } from "express";
import authRoutes from "./auth.routes";
import propertyRoutes from "./property.routes";
import leadRoutes from "./lead.routes";
import uploadRoutes from "./upload.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/properties", propertyRoutes);
router.use("/leads", leadRoutes);
router.use("/upload", uploadRoutes);

// Health check endpoint
router.get("/health", (_req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

export default router;
