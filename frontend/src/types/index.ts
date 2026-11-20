export type Role = "BUYER" | "AGENT" | "OWNER" | "ADMIN";

export type ListingType = "SALE" | "RENT";

export type PropertyType =
  | "APARTMENT"
  | "INDEPENDENT_HOUSE"
  | "VILLA"
  | "PLOT"
  | "COMMERCIAL";

export type Furnishing = "UNFURNISHED" | "SEMI_FURNISHED" | "FULLY_FURNISHED";

export type PropertyStatus = "AVAILABLE" | "UNDER_OFFER" | "SOLD" | "RENTED";

export type LeadStatus = "NEW" | "CONTACTED" | "CLOSED";

export interface BuyerPreferences {
  preferredCities?: string[];
  propertyTypes?: PropertyType[];
  minBudget?: number;
  maxBudget?: number;
  purpose?: "BUY" | "RENT";
  possessionStatus?: "READY" | "UNDER_CONSTRUCTION" | "ANY";
}

export interface OwnerDetails {
  address?: string;
  state?: string;
  pincode?: string;
  idType?: string;
  idNumber?: string;
  preferredContactTime?: string;
  whatsappNumber?: string;
}

export interface AgentDetails {
  agencyName?: string;
  licenseNumber?: string;
  experienceYears?: number;
  operatingCities?: string[];
  operatingTypes?: PropertyType[];
  website?: string;
  whatsappNumber?: string;
  officeAddress?: string;
}

export interface ProfileData {
  buyerPreferences?: BuyerPreferences;
  ownerDetails?: OwnerDetails;
  agentDetails?: AgentDetails;
  [key: string]: unknown;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  avatar?: string | null;
  bio?: string | null;
  city?: string | null;
  profileData?: ProfileData | null;
  createdAt: string;
  _count?: {
    properties?: number;
    leadsSent?: number;
  };
}

export interface PropertyImage {
  url: string;
  isCover?: boolean;
  caption?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  listingType: ListingType;
  propertyType: PropertyType;
  price: number;
  pricePerSqFt?: number | null;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  superAreaSqFt: number;
  carpetAreaSqFt?: number | null;
  furnishing: Furnishing;
  totalFloors?: number | null;
  floorNumber?: number | null;
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number | null;
  longitude?: number | null;
  status: PropertyStatus;
  amenities: string[];
  images: PropertyImage[];
  viewsCount: number;
  ownerId: string;
  owner?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    role: Role;
    avatar?: string | null;
  };
  createdAt: string;
  updatedAt: string;
  similarityScore?: number;
}

export interface Lead {
  id: string;
  propertyId: string;
  buyerId?: string | null;
  buyer?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    avatar?: string | null;
  };
  name: string;
  email: string;
  phone: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
  property?: {
    id: string;
    title: string;
    locality: string;
    city: string;
    price: number;
    images?: PropertyImage[];
  };
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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
  error?: string | Record<string, unknown> | null;
}

export interface FilterState {
  city: string;
  locality?: string;
  search?: string;
  listingType: ListingType;
  propertyType?: PropertyType;
  bedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  furnishing?: Furnishing;
  sortBy: "price_asc" | "price_desc" | "newest" | "popularity";
  page: number;
  limit: number;
}
