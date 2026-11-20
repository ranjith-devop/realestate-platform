"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import { api } from "../../../../lib/api";
import { Validation } from "../../../../lib/validation";
import { getPropertyFallbackImages } from "../../../../lib/utils";
import { ArrowLeft, Save, Clock, AlertCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { ImageUploadZone } from "../../../../components/property/ImageUploadZone";

export default function EditPropertyPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [propertyType, setPropertyType] = useState<string>("APARTMENT");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    status: "AVAILABLE",
    furnishing: "SEMI_FURNISHED",
    bedrooms: "",
    bathrooms: "",
    superAreaSqFt: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await api.getPropertyById(id);
        const p = res.data;

        // Check ownership
        if (user && p.ownerId !== user.id && user.role !== "ADMIN") {
          setError("You do not have permission to edit this property.");
          return;
        }

        setPropertyType(p.propertyType || "APARTMENT");
        setFormData({
          title: p.title,
          description: p.description,
          price: String(p.price),
          status: p.status,
          furnishing: p.furnishing,
          bedrooms: String(p.bedrooms),
          bathrooms: String(p.bathrooms),
          superAreaSqFt: String(p.superAreaSqFt),
        });

        // Populate existing images
        if (Array.isArray(p.images)) {
          setImageUrls(
            p.images
              .map((img: any) => (typeof img === "string" ? img : img?.url))
              .filter(Boolean)
          );
        }
      } catch (err) {
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    }

    if (id && !authLoading) {
      loadData();
    }
  }, [id, user, authLoading]);

  const validateField = (field: string, val: string): string | undefined => {
    switch (field) {
      case "title":
        return !val.trim() ? "Listing title is required." : !Validation.isValidTitle(val) ? "Title must be at least 5 characters." : undefined;
      case "price":
        return !val || !Validation.isPositiveNumber(val) ? "Enter a valid positive price." : undefined;
      case "superAreaSqFt":
        return !val || !Validation.isPositiveNumber(val) ? "Enter a valid super area (sq.ft)." : undefined;
      case "description":
        return !val.trim() ? "Description is required." : !Validation.isValidDescription(val, 20) ? "Description must be at least 20 characters." : undefined;
      default:
        return undefined;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (error) setError(null);
  };

  const handleInputBlur = (field: string, value: string) => {
    const err = validateField(field, value);
    if (err) {
      setFieldErrors((prev) => ({ ...prev, [field]: err }));
    }
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

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please correct the errors before saving.");
      return;
    }

    // Auto fallback to curated Unsplash images if no images uploaded
    const finalImages =
      imageUrls.length > 0
        ? imageUrls.map((url, idx) => ({ url, isCover: idx === 0 }))
        : getPropertyFallbackImages(propertyType).map((url, idx) => ({
            url,
            isCover: idx === 0,
          }));

    try {
      setSubmitting(true);
      await api.updateProperty(id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        status: formData.status as any,
        furnishing: formData.furnishing as any,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        superAreaSqFt: Number(formData.superAreaSqFt),
        images: finalImages,
      });

      router.push(`/properties/${id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update property");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return <div className="max-w-2xl mx-auto p-8 text-center text-sm">Loading property...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <Link
        href={`/properties/${id}`}
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel and return</span>
      </Link>

      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Edit Property Listing
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Update listing pricing, availability status, or description.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-gray-700">Title *</label>
            {fieldErrors.title && (
              <span className="text-[11px] text-red-600 font-medium">{fieldErrors.title}</span>
            )}
          </div>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            onBlur={(e) => handleInputBlur("title", e.target.value)}
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-colors ${
              fieldErrors.title
                ? "bg-red-50/50 border-2 border-red-400 text-red-900 focus:border-red-500"
                : "bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"
            }`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700">Price (₹) *</label>
              {fieldErrors.price && (
                <span className="text-[11px] text-red-600 font-medium">{fieldErrors.price}</span>
              )}
            </div>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              onBlur={(e) => handleInputBlur("price", e.target.value)}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-colors ${
                fieldErrors.price
                  ? "bg-red-50/50 border-2 border-red-400 text-red-900 focus:border-red-500"
                  : "bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Listing Status *</label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-gray-800"
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="UNDER_OFFER">UNDER OFFER</option>
              <option value="SOLD">SOLD</option>
              <option value="RENTED">RENTED</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Furnishing</label>
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700">Super Area (Sq.Ft) *</label>
              {fieldErrors.superAreaSqFt && (
                <span className="text-[11px] text-red-600 font-medium">{fieldErrors.superAreaSqFt}</span>
              )}
            </div>
            <input
              type="number"
              value={formData.superAreaSqFt}
              onChange={(e) => handleInputChange("superAreaSqFt", e.target.value)}
              onBlur={(e) => handleInputBlur("superAreaSqFt", e.target.value)}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-colors ${
                fieldErrors.superAreaSqFt
                  ? "bg-red-50/50 border-2 border-red-400 text-red-900 focus:border-red-500"
                  : "bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"
              }`}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-gray-700">Description *</label>
            {fieldErrors.description && (
              <span className="text-[11px] text-red-600 font-medium">{fieldErrors.description}</span>
            )}
          </div>
          <textarea
            rows={5}
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            onBlur={(e) => handleInputBlur("description", e.target.value)}
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl outline-none resize-none transition-colors ${
              fieldErrors.description
                ? "bg-red-50/50 border-2 border-red-400 text-red-900 focus:border-red-500"
                : "bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"
            }`}
          />
        </div>

        {/* Photos & Media (ImageKit Cloud with Unsplash fallback) */}
        <div className="pt-2 border-t border-gray-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">Property Photos</span>
            {imageUrls.length === 0 && (
              <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                <Sparkles className="w-3 h-3" />
                <span>Auto-Fallback Active</span>
              </span>
            )}
          </div>
          <ImageUploadZone
            images={imageUrls}
            onChange={setImageUrls}
            maxFiles={10}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
        >
          {submitting ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save & Update Listing</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
