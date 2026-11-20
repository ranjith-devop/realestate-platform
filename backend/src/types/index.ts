import { ListingType, PropertyType, Furnishing, PropertyStatus, LeadStatus, Role } from "@prisma/client";

export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginationMeta {
  page?: number;
  limit: number;
  totalRecords?: number;
  totalPages?: number;
  hasNextPage: boolean;
  hasPrevPage?: boolean;
  nextCursor?: string | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  error?: string | Record<string, unknown> | null;
}

export interface PropertyFilterParams extends PaginationParams {
  city?: string;
  locality?: string;
  search?: string;
  listingType?: ListingType;
  propertyType?: PropertyType | PropertyType[];
  bedrooms?: number | number[];
  minPrice?: number;
  maxPrice?: number;
  furnishing?: Furnishing;
  sortBy?: "price_asc" | "price_desc" | "newest" | "popularity";
}

export interface ImageObject {
  url: string;
  isCover?: boolean;
  caption?: string;
}

export { Role, ListingType, PropertyType, Furnishing, PropertyStatus, LeadStatus };
