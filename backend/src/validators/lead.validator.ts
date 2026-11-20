import { z } from "zod";

export const createLeadSchema = z.object({
  propertyId: z.string().uuid("Invalid property ID"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^[0-9+ -]{10,15}$/, "Please provide a valid 10-15 digit phone number"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
  // Honeypot field for bot detection: bots usually fill hidden fields!
  website: z.string().max(0, "Bot detected").optional().or(z.literal("")),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CLOSED"]),
});

export type CreateLeadDto = z.infer<typeof createLeadSchema>;
export type UpdateLeadStatusDto = z.infer<typeof updateLeadStatusSchema>;
