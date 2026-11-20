"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { PropertyImage } from "../../types";
import { getPropertyGalleryImages, getPropertyFallbackImages } from "../../lib/utils";
import { Images, ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
  propertyType?: string;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({
  images,
  title,
  propertyType,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // High-definition Unsplash fallback for this property category
  const fallback = useMemo(
    () => getPropertyFallbackImages(propertyType)[0],
    [propertyType]
  );

  // Build gallery: if user provided images, use them; if none, provide category Unsplash images
  const imageList = useMemo(
    () => getPropertyGalleryImages(images, propertyType, title),
    [images, propertyType, title]
  );

  const currentImage = imageList[selectedIndex] || imageList[0];

  const goTo = (idx: number) => {
    setSelectedIndex(Math.max(0, Math.min(idx, imageList.length - 1)));
  };

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm border border-gray-100">
        <Image
          src={currentImage.url}
          alt={currentImage.caption || title}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 800px"
          className="object-cover transition-all duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallback;
          }}
        />

        {/* Prev / Next arrows for multi-image */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={() => goTo(selectedIndex - 1)}
              disabled={selectedIndex === 0}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 disabled:opacity-30 transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => goTo(selectedIndex + 1)}
              disabled={selectedIndex === imageList.length - 1}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 disabled:opacity-30 transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter Badge */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-md">
          <Images className="w-3.5 h-3.5" />
          <span>
            {selectedIndex + 1} / {imageList.length} Photos
          </span>
        </div>

        {currentImage.caption && (
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-xl shadow-md max-w-[60%] truncate">
            {currentImage.caption}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {imageList.length > 1 && (
        <div className="flex items-center space-x-3 overflow-x-auto pb-1 scrollbar-none">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-16 w-24 sm:h-20 sm:w-32 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                selectedIndex === idx
                  ? "border-blue-600 scale-[1.02] shadow-sm"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
              aria-label={`View photo ${idx + 1}`}
            >
              <Image
                src={img.url}
                alt={img.caption || `Photo ${idx + 1}`}
                fill
                sizes="128px"
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallback;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
