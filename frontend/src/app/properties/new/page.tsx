"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../lib/api";
import { Validation } from "../../../lib/validation";
import { getPropertyFallbackImages } from "../../../lib/utils";
import { Building2, Plus, AlertCircle, Clock, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { ImageUploadZone } from "../../../components/property/ImageUploadZone";
import { AmenitiesSelector } from "../../../components/property/AmenitiesSelector";

const CITIES = ["Bangalore", "Mumbai", "Delhi-NCR", "Hyderabad", "Pune"];

export default function NewPropertyPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    listingType: "SALE",
    propertyType: "APARTMENT",
    price: "",
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    superAreaSqFt: "",
    carpetAreaSqFt: "",
    furnishing: "SEMI_FURNISHED",
    totalFloors: "",
    floorNumber: "",
    address: "",
    locality: "",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const validateField = (field: string, val: string): string | undefined => {
    switch (field) {
      case "title":
        return !val.trim() ? "Listing title is required." : !Validation.isValidTitle(val) ? "Title must be at least 5 characters." : undefined;
      case "price":
        return !val || !Validation.isPositiveNumber(val) ? "Enter a valid price greater than 0." : undefined;
      case "superAreaSqFt":
        return !val || !Validation.isPositiveNumber(val) ? "Enter a valid super area (sq.ft)." : undefined;
      case "description":
        return !val.trim() ? "Description is required." : !Validation.isValidDescription(val, 20) ? "Description must be at least 20 characters." : undefined;
      case "locality":
        return !val.trim() ? "Locality is required." : !Validation.isValidLocality(val) ? "Locality must be at least 2 characters." : undefined;
      case "address":
        return !val.trim() ? "Street address is required." : !Validation.isValidAddress(val) ? "Address must be at least 5 characters." : undefined;
      case "pincode":
        return !val.trim() ? "Pincode is required." : !Validation.isValidPincode(val) ? "Enter a valid 6-digit Indian pincode." : undefined;
      default:
        return undefined;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    if (error) setError(null);
  };

  const handleInputBlur = (field: string, value: string) => {
    const err = validateField(field, value);
    if (err) setFieldErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const errors: Record<string, string> = {};
    const titleErr = validateField("title", formData.title);
    if (titleErr) errors.title = titleErr;
    const priceErr = validateField("price", formData.price);
    if (priceErr) errors.price = priceErr;
    const areaErr = validateField("superAreaSqFt", formData.superAreaSqFt);
    if (areaErr) errors.superAreaSqFt = areaErr;
    const descErr = validateField("description", formData.description);
    if (descErr) errors.description = descErr;
    const locErr = validateField("locality", formData.locality);
    if (locErr) errors.locality = locErr;
    const addrErr = validateField("address", formData.address);
    if (addrErr) errors.address = addrErr;
    const pinErr = validateField("pincode", formData.pincode);
    if (pinErr) errors.pincode = pinErr;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fix the validation errors before publishing.");
      return;
    }

    // Auto fallback to curated Unsplash images if no images uploaded by user
    const finalImages =
      imageUrls.length > 0
        ? imageUrls.map((url, idx) => ({ url, isCover: idx === 0 }))
        : getPropertyFallbackImages(formData.propertyType).map((url, idx) => ({
            url,
            isCover: idx === 0,
          }));

    try {
      setSubmitting(true);
      const res = await api.createProperty({
        title: formData.title.trim(),
        description: formData.description.trim(),
        listingType: formData.listingType as any,
        propertyType: formData.propertyType as any,
        price: Number(formData.price),
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : 0,
        balconies: formData.balconies ? Number(formData.balconies) : 0,
        superAreaSqFt: Number(formData.superAreaSqFt),
        carpetAreaSqFt: formData.carpetAreaSqFt ? Number(formData.carpetAreaSqFt) : undefined,
        furnishing: formData.furnishing as any,
        totalFloors: formData.totalFloors ? Number(formData.totalFloors) : undefined,
        floorNumber: formData.floorNumber ? Number(formData.floorNumber) : undefined,
        address: formData.address.trim(),
        locality: formData.locality.trim(),
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode.trim(),
        amenities: selectedAmenities,
        images: finalImages,
      });

      router.push(`/properties/${res.data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create listing");
    } finally {
      setSubmitting(false);
    }
  };

  if (!loading && !isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-gray-200 shadow-sm text-center space-y-4">
        <Building2 className="w-12 h-12 text-blue-600 mx-auto" />
        <h2 className="text-xl font-extrabold text-gray-900">Sign In Required</h2>
        <p className="text-xs text-gray-500">You must be signed in to post property listings on PropNest.</p>
        <Link href="/login?redirect=/properties/new" className="inline-block w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700">
          Sign In to Continue
        </Link>
      </div>
    );
  }

  // Role Isolation: Prevent Buyer role from posting listings
  if (!loading && user?.role === "BUYER") {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-gray-200 shadow-sm text-center space-y-4">
        <Building2 className="w-12 h-12 text-blue-600 mx-auto" />
        <h2 className="text-xl font-extrabold text-gray-900">Owner Account Required</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          You are currently signed in with a <strong>Buyer Account</strong> (<span className="text-gray-700 font-semibold">{user.email}</span>).
          Posting property listings is reserved for verified Property Owners and Real Estate Agents.
        </p>
        <div className="space-y-2 pt-2">
          <Link
            href="/properties"
            className="inline-block w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-md"
          >
            Explore Properties to Buy or Rent
          </Link>
          <Link
            href="/register?role=OWNER"
            className="inline-block w-full py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50"
          >
            Register as an Owner
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <Link href="/properties" className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to listings</span>
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Post Your Property Listing Free</h1>
        <p className="text-xs sm:text-sm text-gray-500">Reach 50,000+ prospective buyers and tenants with zero brokerage</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        {/* Section 1: Property Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-blue-600">1. Property Details</h2>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700">Listing Title *</label>
              {fieldErrors.title && <span className="text-[11px] text-red-600 font-medium">{fieldErrors.title}</span>}
            </div>
            <input
              type="text"
              placeholder="e.g. 3 BHK Luxury Apartment with Balcony in Whitefield"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              onBlur={(e) => handleInputBlur("title", e.target.value)}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-colors ${
                fieldErrors.title ? "bg-red-50/50 border-2 border-red-400 text-red-900" : "bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Listing Type *</label>
              <select
                value={formData.listingType}
                onChange={(e) => handleInputChange("listingType", e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="SALE">For Sale</option>
                <option value="RENT">For Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Property Type *</label>
              <select
                value={formData.propertyType}
                onChange={(e) => handleInputChange("propertyType", e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
                <option value="INDEPENDENT_HOUSE">Independent House</option>
                <option value="PLOT">Residential Plot</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Furnishing *</label>
              <select
                value={formData.furnishing}
                onChange={(e) => handleInputChange("furnishing", e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="UNFURNISHED">Unfurnished</option>
                <option value="SEMI_FURNISHED">Semi-Furnished</option>
                <option value="FULLY_FURNISHED">Fully Furnished</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                placeholder="e.g. 12500000"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                onBlur={(e) => handleInputBlur("price", e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-colors ${
                  fieldErrors.price ? "bg-red-50/50 border-2 border-red-400 text-red-900" : "bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"
                }`}
              />
              {fieldErrors.price && <p className="text-[11px] text-red-600 mt-1">{fieldErrors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Bedrooms</label>
              <input
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Bathrooms</label>
              <input
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Super Area (Sq.Ft) *</label>
              <input
                type="number"
                placeholder="e.g. 1450"
                value={formData.superAreaSqFt}
                onChange={(e) => handleInputChange("superAreaSqFt", e.target.value)}
                onBlur={(e) => handleInputBlur("superAreaSqFt", e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-colors ${
                  fieldErrors.superAreaSqFt ? "bg-red-50/50 border-2 border-red-400 text-red-900" : "bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"
                }`}
              />
              {fieldErrors.superAreaSqFt && <p className="text-[11px] text-red-600 mt-1">{fieldErrors.superAreaSqFt}</p>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700">Description *</label>
              {fieldErrors.description && <span className="text-[11px] text-red-600 font-medium">{fieldErrors.description}</span>}
            </div>
            <textarea
              rows={4}
              placeholder="Highlight special features, nearby metro stations, natural light, ventilation, modular kitchen, amenities..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              onBlur={(e) => handleInputBlur("description", e.target.value)}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl outline-none resize-none transition-colors ${
                fieldErrors.description ? "bg-red-50/50 border-2 border-red-400 text-red-900" : "bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"
              }`}
            />
          </div>
        </div>

        {/* Section 2: Location Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-blue-600">2. Location Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">City *</label>
              <select
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">Locality *</label>
                {fieldErrors.locality && <span className="text-[11px] text-red-600 font-medium">{fieldErrors.locality}</span>}
              </div>
              <input
                type="text"
                placeholder="e.g. Indiranagar, Whitefield, Bandra"
                value={formData.locality}
                onChange={(e) => handleInputChange("locality", e.target.value)}
                onBlur={(e) => handleInputBlur("locality", e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-colors ${
                  fieldErrors.locality ? "bg-red-50/50 border-2 border-red-400 text-red-900" : "bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">Street Address *</label>
                {fieldErrors.address && <span className="text-[11px] text-red-600 font-medium">{fieldErrors.address}</span>}
              </div>
              <input
                type="text"
                placeholder="e.g. Tower B, Flat 402, Prestige Lakeside"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                onBlur={(e) => handleInputBlur("address", e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-colors ${
                  fieldErrors.address ? "bg-red-50/50 border-2 border-red-400 text-red-900" : "bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">Pincode *</label>
                {fieldErrors.pincode && <span className="text-[11px] text-red-600 font-medium">{fieldErrors.pincode}</span>}
              </div>
              <input
                type="text"
                maxLength={6}
                placeholder="e.g. 560066"
                value={formData.pincode}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
                onBlur={(e) => handleInputBlur("pincode", e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-colors ${
                  fieldErrors.pincode ? "bg-red-50/50 border-2 border-red-400 text-red-900" : "bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Amenities */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-blue-600">3. Amenities & Facilities</h2>
          <AmenitiesSelector selected={selectedAmenities} onChange={setSelectedAmenities} />
        </div>

        {/* Section 4: ImageKit Cloud Photo Upload with Unsplash Fallback */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-blue-600">4. Photos & Media</h2>
              <p className="text-xs text-gray-500 mt-0.5">Upload real photos of your property to increase buyer inquiries.</p>
            </div>
            {imageUrls.length === 0 && (
              <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sample photos ready</span>
              </span>
            )}
          </div>

          {imageUrls.length === 0 && (
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-800 text-xs flex items-center space-x-2">
              <Sparkles className="w-4 h-4 shrink-0 text-blue-600" />
              <span>
                No photos? No problem! A curated high-definition photo matching your <strong>{formData.propertyType.toLowerCase()}</strong> will be automatically displayed.
              </span>
            </div>
          )}

          <ImageUploadZone images={imageUrls} onChange={(imgs) => setImageUrls(imgs)} maxFiles={10} />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base shadow-xl shadow-blue-600/30 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
        >
          {submitting ? (
            <>
              <Clock className="w-5 h-5 animate-spin" />
              <span>Publishing Listing...</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Publish Property Listing Free</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
