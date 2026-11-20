"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { UserCircle, Upload, Trash2, Loader2 } from "lucide-react";

interface ProfilePhotoSectionProps {
  avatar: string;
  onAvatarChange: (url: string) => void;
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
}

export const ProfilePhotoSection: React.FC<ProfilePhotoSectionProps> = ({
  avatar,
  onAvatarChange,
  onUpload,
  uploading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="sm:col-span-2 space-y-3">
      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="relative w-14 h-14 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            {avatar ? (
              <Image src={avatar} alt="Profile photo" fill sizes="56px" className="object-cover" />
            ) : (
              <UserCircle className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">Profile Photo</p>
            <p className="text-[11px] text-gray-500">JPG, PNG, or WEBP up to 10MB</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
            disabled={uploading}
            onChange={handleFile}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
              </>
            )}
          </button>
          {avatar && (
            <button
              type="button"
              onClick={() => onAvatarChange("")}
              className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">Or Paste Photo Web Link</label>
        <input
          type="url"
          placeholder="https://example.com/avatar.jpg"
          value={avatar}
          onChange={(e) => onAvatarChange(e.target.value)}
          className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};
