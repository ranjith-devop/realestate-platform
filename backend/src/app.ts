import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { ENV } from "./config/env";
import { setupSwagger } from "./config/swagger";
import apiRoutes from "./routes";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { apiRateLimiter } from "./middlewares/rateLimiter.middleware";
import { ApiResponseHelper } from "./utils/apiResponse";

export const createApp = (): express.Application => {
  const app = express();

  // Basic security and request parsing
  app.use(helmet({ contentSecurityPolicy: false })); // CSP disabled for swagger-ui assets
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile/curl/server-to-server)
        if (!origin) return callback(null, true);
        if (
          ENV.CORS_ORIGIN === "*" ||
          origin === ENV.CORS_ORIGIN ||
          origin.endsWith(".pages.dev") ||
          origin.endsWith(".vercel.app") ||
          origin.includes("localhost") ||
          origin.includes("127.0.0.1")
        ) {
          return callback(null, true);
        }
        return callback(null, true); // Permissive for preview and production deployments
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  if (ENV.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  // Swagger Documentation mounted at /api-docs
  setupSwagger(app);

  // Apply general rate limiter to API routes
  app.use("/api", apiRateLimiter);

  // Mount API routes
  app.use("/api", apiRoutes);

  // Root redirect/landing
  app.get("/", (_req, res) => {
    res.json({
      message: "Real Estate Listing Platform Backend API",
      documentation: "/api-docs",
      healthCheck: "/api/health",
      version: "1.0.0",
    });
  });

  // 404 handler
  app.use((_req, res) => {
    ApiResponseHelper.notFound(res, "Endpoint not found");
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
