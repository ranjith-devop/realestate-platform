import React from "react";

export const PropertySkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[16/10] bg-gray-200 w-full" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-8 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
};
