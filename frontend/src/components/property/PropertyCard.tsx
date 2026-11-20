"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Property } from "../../types";
import {
  formatIndianCurrency,
  formatArea,
  getPropertyCoverImage,
  getPropertyFallbackImages,
} from "../../lib/utils";
import {
  BedDouble,
  Bath,
  Maximize2,
  MapPin,
  ShieldCheck,
  Eye,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

interface PropertyCardProps {
  property: Property;
  onContactClick?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onContactClick,
}) => {
  const router = useRouter();
  const isRent = property.listingType === "RENT";
  const coverImage = getPropertyCoverImage(property.images, property.propertyType);
  const fallback = getPropertyFallbackImages(property.propertyType)[0];

  // Reactive fallback to category Unsplash photo if missing or load error
  const [imgError, setImgError] = useState(false);
  const imgSrc = imgError ? fallback : coverImage;

  const handleContactClick = () => {
    if (onContactClick) {
      onContactClick(property);
    } else {
      router.push(`/properties/${property.id}#contact`);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
          <Image
            src={imgSrc}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span
              className={`text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-md text-white uppercase shadow-sm ${
                isRent ? "bg-amber-600" : "bg-blue-600"
              }`}
            >
              {isRent ? "For Rent" : "For Sale"}
            </span>
            <span className="inline-flex items-center space-x-1 text-[11px] font-semibold px-2 py-1 rounded-md bg-emerald-500/90 text-white backdrop-blur-sm shadow-sm">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified</span>
            </span>
          </div>

          {/* Views count */}
          <div className="absolute top-3 right-3 text-[11px] font-medium text-white/90 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{property.viewsCount ?? 0}</span>
          </div>

          {/* Price on image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between text-white">
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight drop-shadow-md">
                {formatIndianCurrency(property.price, isRent)}
              </span>
              {property.pricePerSqFt && !isRent && (
                <span className="text-xs text-gray-200 ml-2 drop-shadow">
                  (₹{property.pricePerSqFt.toLocaleString("en-IN")}/sq.ft)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          {/* Location */}
          <div className="flex items-center text-xs font-semibold text-blue-600 mb-1.5 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
            <span className="truncate">
              {property.locality}, {property.city}
            </span>
          </div>

          {/* Title */}
          <Link href={`/properties/${property.id}`}>
            <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
              {property.title}
            </h3>
          </Link>

          {/* Key specs */}
          <div className="grid grid-cols-3 gap-2 py-3 mt-3 border-y border-gray-100 text-gray-600 text-xs">
            <div className="flex items-center space-x-1.5">
              <BedDouble className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-semibold text-gray-800">
                {property.bedrooms > 0
                  ? `${property.bedrooms} BHK`
                  : property.propertyType}
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <Bath className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{property.bathrooms} Baths</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <Maximize2 className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate">{formatArea(property.superAreaSqFt)}</span>
            </div>
          </div>

          {/* Furnishing & Owner tag */}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span className="capitalize px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
              {property.furnishing?.toLowerCase().replace(/_/g, " ") ?? "-"}
            </span>

            {property.owner && (
              <span className="flex items-center space-x-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Brokerage</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 flex items-center space-x-2">
        <Link
          href={`/properties/${property.id}`}
          className="flex-1 text-center py-2 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-blue-300 transition-all"
        >
          View Details
        </Link>
        <button
          type="button"
          onClick={handleContactClick}
          className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Contact Owner</span>
        </button>
      </div>
    </div>
  );
};
