import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Curated high-resolution Unsplash photos categorized by property type.
 * Used whenever a listing has no uploaded images or an image fails to load.
 */
export const PROPERTY_TYPE_FALLBACKS: Record<string, string[]> = {
  APARTMENT: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
  ],
  VILLA: [
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  ],
  INDEPENDENT_HOUSE: [
    "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  ],
  PLOT: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80",
  ],
  COMMERCIAL: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  ],
};

export const DEFAULT_PROPERTY_FALLBACK =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80";

export function getPropertyFallbackImages(propertyType?: string): string[] {
  if (propertyType && PROPERTY_TYPE_FALLBACKS[propertyType.toUpperCase()]) {
    return PROPERTY_TYPE_FALLBACKS[propertyType.toUpperCase()];
  }
  return [DEFAULT_PROPERTY_FALLBACK];
}

/**
 * Format Indian currency with Lakhs and Crores abbreviations.
 */
export function formatIndianCurrency(amount: number, isRent = false): string {
  if (amount === undefined || amount === null || isNaN(amount)) return "₹0";

  if (isRent) {
    return `₹${amount.toLocaleString("en-IN")}/mo`;
  }

  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2).replace(/\.00$/, "");
    return `₹${cr} Cr`;
  }

  if (amount >= 100000) {
    const lakh = (amount / 100000).toFixed(2).replace(/\.00$/, "");
    return `₹${lakh} Lac`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatArea(sqFt: number): string {
  if (!sqFt) return "-";
  return `${sqFt.toLocaleString("en-IN")} sq.ft.`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Safely extracts image URLs whether stored as strings or { url: string } objects.
 */
export function getPropertyImages(images: unknown): string[] {
  if (!images || !Array.isArray(images) || images.length === 0) return [];
  return images
    .map((img: unknown) => {
      if (typeof img === "string") return img;
      if (
        img &&
        typeof img === "object" &&
        "url" in img &&
        typeof (img as { url: unknown }).url === "string"
      ) {
        return (img as { url: string }).url;
      }
      return "";
    })
    .filter((url) => Boolean(url && url.trim().length > 0));
}

/**
 * Gets cover image for a property. If empty or invalid, falls back to an Unsplash image matching the property type.
 */
export function getPropertyCoverImage(images: unknown, propertyType?: string): string {
  const list = getPropertyImages(images);
  if (list.length > 0) return list[0];
  const fallbacks = getPropertyFallbackImages(propertyType);
  return fallbacks[0];
}

/**
 * Returns full gallery array. If property has no images, provides multiple angle Unsplash fallbacks.
 */
export function getPropertyGalleryImages(
  images: unknown,
  propertyType?: string,
  title?: string
): Array<{ url: string; caption?: string }> {
  if (Array.isArray(images) && images.length > 0) {
    const valid = images
      .map((img) => {
        if (typeof img === "string" && img.trim()) return { url: img };
        if (
          img &&
          typeof img === "object" &&
          "url" in img &&
          typeof (img as { url: unknown }).url === "string" &&
          (img as { url: string }).url.trim()
        ) {
          return {
            url: (img as { url: string }).url,
            caption:
              typeof (img as { caption?: unknown }).caption === "string"
                ? (img as { caption?: string }).caption
                : undefined,
          };
        }
        return null;
      })
      .filter((x): x is { url: string; caption?: string } => x !== null);

    if (valid.length > 0) return valid;
  }

  // Curated multi-image fallbacks from Unsplash based on property type
  const fallbacks = getPropertyFallbackImages(propertyType);
  return fallbacks.map((url, i) => ({
    url,
    caption: i === 0 ? `${title || "Property"} (Overview)` : undefined,
  }));
}
