import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),
  phone: z
    .string()
    .regex(/^[0-9+ -]{10,15}$/, "Invalid phone number format")
    .optional(),
  role: z.enum(["BUYER", "AGENT", "OWNER"]).default("BUYER"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  phone: z
    .string()
    .regex(/^[0-9+ -]{10,15}$/, "Invalid phone number format")
    .optional()
    .nullable(),
  avatar: z.string().url("Invalid avatar URL").optional().nullable().or(z.literal("")),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  profileData: z.record(z.any()).optional().nullable(),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
