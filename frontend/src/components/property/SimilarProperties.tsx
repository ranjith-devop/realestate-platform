"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Property } from "../../types";
import { api } from "../../lib/api";
import {
  formatIndianCurrency,
  formatArea,
  getPropertyCoverImage,
  getPropertyFallbackImages,
} from "../../lib/utils";
import { Sparkles, BedDouble, Maximize2, MapPin } from "lucide-react";

interface SimilarPropertiesProps {
  propertyId: string;
}

const FALLBACK =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80";

export const SimilarProperties: React.FC<SimilarPropertiesProps> = ({
  propertyId,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadSimilar() {
      try {
        setLoading(true);
        const res = await api.getSimilarProperties(propertyId, 6);
        if (isMounted) {
          setProperties(res.data || []);
        }
      } catch (err) {
        console.error("Error loading similar properties:", err);
        if (isMounted) setProperties([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSimilar();

    return () => {
      isMounted = false;
    };
  }, [propertyId]);

  if (loading) {
    return (
      <div className="pt-8 border-t border-gray-100 mt-10">
        <div className="h-6 w-56 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (properties.length === 0) return null;

  return (
    <section className="pt-10 border-t border-gray-100 mt-10">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Similar Properties You May Like
          </h2>
          <p className="text-xs text-gray-500">
            Recommendations matched by locality, budget &amp; configuration
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {properties.map((item) => {
          const isRent = item.listingType === "RENT";
          const cover = getPropertyCoverImage(item.images, item.propertyType);
          const fallback = getPropertyFallbackImages(item.propertyType)[0];

          return (
            <Link
              key={item.id}
              href={`/properties/${item.id}`}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                  <Image
                    src={cover}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallback;
                    }}
                  />
                  {item.similarityScore != null && (
                    <div className="absolute top-2.5 right-2.5 bg-emerald-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{item.similarityScore}% Match</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 text-white font-extrabold text-lg drop-shadow">
                    {formatIndianCurrency(item.price, isRent)}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center text-xs text-blue-600 font-semibold mb-1 truncate">
                    <MapPin className="w-3 h-3 mr-1 shrink-0" />
                    <span>
                      {item.locality}, {item.city}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>

                  <div className="flex items-center space-x-3 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-1">
                      <BedDouble className="w-3.5 h-3.5 text-gray-400" />
                      <span>{item.bedrooms > 0 ? `${item.bedrooms} BHK` : item.propertyType}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
                      <span>{formatArea(item.superAreaSqFt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
