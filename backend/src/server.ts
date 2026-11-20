import { createApp } from "./app";
import { ENV } from "./config/env";
import { prisma } from "./config/prisma";

const app = createApp();

const server = app.listen(ENV.PORT, () => {
  console.log(`🚀 Real Estate Backend running in [${ENV.NODE_ENV}] mode on port ${ENV.PORT}`);
  console.log(`📚 Swagger Documentation available at: http://localhost:${ENV.PORT}/api-docs`);
  console.log(`🏥 Health check at: http://localhost:${ENV.PORT}/api/health`);
});

// Graceful shutdown handling
const shutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log("Database disconnected. Server closed cleanly.");
      process.exit(0);
    } catch (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
