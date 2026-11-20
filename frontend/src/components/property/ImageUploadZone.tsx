"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { api } from "../../lib/api";
import {
  UploadCloud,
  X,
  Star,
  Loader2,
  AlertCircle,
  Plus,
  Images,
} from "lucide-react";

interface ImageUploadZoneProps {
  images: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  images,
  onChange,
  maxFiles = 10,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const files = Array.from(fileList);
    const remainingSlots = maxFiles - images.length;

    if (remainingSlots <= 0) {
      setError(`Maximum limit of ${maxFiles} images reached.`);
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);

    // Validate size (max 10MB each)
    for (const f of filesToUpload) {
      if (f.size > 10 * 1024 * 1024) {
        setError(`"${f.name}" exceeds the 10MB size limit.`);
        return;
      }
    }

    try {
      setUploading(true);
      const res = await api.uploadImages(filesToUpload);
      const newUrls = (res.data || []).map((item) => item.url);
      onChange([...images, ...newUrls]);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload images. Please try again."
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (images.length >= maxFiles) {
      setError(`Maximum limit of ${maxFiles} images reached.`);
      return;
    }
    onChange([...images, urlInput.trim()]);
    setUrlInput("");
    setError(null);
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const item = images[index];
    const rest = images.filter((_, i) => i !== index);
    onChange([item, ...rest]);
  };

  return (
    <div className="space-y-4">
      {/* Photos Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Property Photos
          </h3>
          <p className="text-xs text-gray-500">
            Upload from your device or paste a photo link. Supported: JPG, PNG, WEBP (up to 10MB each).
          </p>
        </div>
        <span className="inline-flex items-center space-x-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          <Images className="w-3.5 h-3.5" />
          <span>Up to {maxFiles} photos</span>
        </span>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          uploading
            ? "border-blue-400 bg-blue-50/50 cursor-not-allowed"
            : "border-gray-300 hover:border-blue-500 hover:bg-blue-50/30 bg-gray-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/jpg"
          className="hidden"
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
        />

        {uploading ? (
          <div className="flex flex-col items-center justify-center space-y-2 py-2">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm font-semibold text-blue-700">
              Uploading your photos...
            </p>
            <p className="text-xs text-gray-500">
              Please wait a moment while we process your pictures
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 py-2">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-200 flex items-center justify-center text-blue-600">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">
                Click to browse or drag and drop photos here
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Up to {maxFiles} images • First photo will be the main cover
              </p>
            </div>
          </div>
        )}
      </div>

      {/* URL Input Fallback */}
      <div className="flex gap-2 pt-1">
        <input
          type="url"
          placeholder="Or paste a photo link (e.g. https://example.com/photo.jpg)..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddUrl();
            }
          }}
          className="flex-1 px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleAddUrl}
          className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl bg-gray-800 text-white text-xs font-bold hover:bg-gray-900 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Photo</span>
        </button>
      </div>

      {/* Photo Previews Grid */}
      {images.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-semibold">
              {images.length} of {maxFiles} photos uploaded
            </span>
            <span className="text-[11px] text-gray-400">
              Click ★ to set any photo as cover
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {images.map((url, idx) => (
              <div
                key={idx}
                className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 group bg-gray-100 ${
                  idx === 0
                    ? "border-blue-600 shadow-md ring-2 ring-blue-600/20"
                    : "border-gray-200"
                }`}
              >
                <Image
                  src={url}
                  alt={`Upload ${idx + 1}`}
                  fill
                  sizes="160px"
                  className="object-cover"
                />

                {/* Cover badge */}
                {idx === 0 ? (
                  <span className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow">
                    Cover
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetCover(idx)}
                    title="Set as cover photo"
                    className="absolute top-1.5 left-1.5 bg-black/60 hover:bg-blue-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  title="Remove image"
                  className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-600 text-white p-1 rounded-md transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
