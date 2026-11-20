import { z } from "zod";

const imageSchema = z.object({
  url: z.string().url("Image URL must be valid"),
  isCover: z.boolean().optional().default(false),
  caption: z.string().max(100).optional(),
});

export const createPropertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().min(20, "Description must be at least 20 characters").max(5000),
  listingType: z.enum(["SALE", "RENT"]).default("SALE"),
  propertyType: z.enum([
    "APARTMENT",
    "INDEPENDENT_HOUSE",
    "VILLA",
    "PLOT",
    "COMMERCIAL",
  ]),
  price: z.number().positive("Price must be a positive number"),
  pricePerSqFt: z.number().positive().optional(),
  bedrooms: z.number().int().min(0).default(0),
  bathrooms: z.number().int().min(0).default(0),
  balconies: z.number().int().min(0).default(0),
  superAreaSqFt: z.number().positive("Super area must be a positive number"),
  carpetAreaSqFt: z.number().positive().optional(),
  furnishing: z
    .enum(["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"])
    .default("SEMI_FURNISHED"),
  totalFloors: z.number().int().min(1).optional(),
  floorNumber: z.number().int().optional(),
  address: z.string().min(5, "Address must be at least 5 characters").max(300),
  locality: z.string().min(2, "Locality is required").max(100),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(2, "State is required").max(100),
  pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be 6 digits"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  amenities: z.array(z.string()).default([]),
  images: z.array(imageSchema).max(15, "Maximum 15 images allowed").default([]),
});

export const updatePropertySchema = createPropertySchema.partial().extend({
  status: z.enum(["AVAILABLE", "UNDER_OFFER", "SOLD", "RENTED"]).optional(),
});

export const propertyQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  cursor: z.string().optional(),
  city: z.string().optional(),
  locality: z.string().optional(),
  search: z.string().optional(),
  listingType: z.enum(["SALE", "RENT"]).optional(),
  propertyType: z
    .union([
      z.enum(["APARTMENT", "INDEPENDENT_HOUSE", "VILLA", "PLOT", "COMMERCIAL"]),
      z.array(z.enum(["APARTMENT", "INDEPENDENT_HOUSE", "VILLA", "PLOT", "COMMERCIAL"])),
    ])
    .optional(),
  bedrooms: z
    .union([z.coerce.number().int().min(0), z.array(z.coerce.number().int().min(0))])
    .optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  furnishing: z.enum(["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"]).optional(),
  sortBy: z.enum(["price_asc", "price_desc", "newest", "popularity"]).default("newest"),
});

export type CreatePropertyDto = z.infer<typeof createPropertySchema>;
export type UpdatePropertyDto = z.infer<typeof updatePropertySchema>;
export type PropertyQueryParams = z.infer<typeof propertyQuerySchema>;
