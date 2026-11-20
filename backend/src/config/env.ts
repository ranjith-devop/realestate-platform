import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5433/realestate?schema=public",
  JWT_SECRET: process.env.JWT_SECRET || "super_secure_access_token_secret_key_99acres_nobroker",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "super_secure_refresh_token_secret_key_99acres_nobroker",
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY || "public_wvoMdRqQww3W896FUJhVm8QEKuw=",
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY || "private_Mvene6ylZ3j2YL//qqcdq8ymOns=",
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/o3wtwhqstr",
} as const;
