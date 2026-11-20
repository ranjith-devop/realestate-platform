import rateLimit from "express-rate-limit";
import { ApiResponseHelper } from "../utils/apiResponse";

// Rate limiter for lead/inquiry form submission: prevents spam bots and duplicate flood
export const leadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 inquiries per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    ApiResponseHelper.error(
      res,
      "Too many inquiries sent from this IP. Please wait 15 minutes before submitting again.",
      429
    );
  },
});

// Rate limiter for authentication endpoints: protects against brute force attacks
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login/register attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    ApiResponseHelper.error(
      res,
      "Too many authentication attempts. Please try again after 15 minutes.",
      429
    );
  },
});

// General API rate limiter
export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300, // Limit each IP to 300 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    ApiResponseHelper.error(res, "Rate limit exceeded. Please slow down.", 429);
  },
});
