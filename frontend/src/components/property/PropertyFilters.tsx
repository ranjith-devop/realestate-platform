"use client";

import React, { useState, useEffect } from "react";
import { FilterState, ListingType, PropertyType, Furnishing } from "../../types";
import { RotateCcw } from "lucide-react";

interface PropertyFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  totalRecords?: number;
}

const CITIES = ["All Cities", "Bangalore", "Mumbai", "Delhi-NCR", "Hyderabad", "Pune"];

const PROPERTY_TYPES: { label: string; value: PropertyType }[] = [
  { label: "Apartment", value: "APARTMENT" },
  { label: "Villa", value: "VILLA" },
  { label: "Independent House", value: "INDEPENDENT_HOUSE" },
  { label: "Residential Plot", value: "PLOT" },
  { label: "Commercial", value: "COMMERCIAL" },
];

const BHK_OPTIONS = [1, 2, 3, 4];

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalRecords,
}) => {
  // Local state to debounce budget inputs without any heavy external libraries
  const [localMin, setLocalMin] = useState(filters.minPrice ? String(filters.minPrice) : "");
  const [localMax, setLocalMax] = useState(filters.maxPrice ? String(filters.maxPrice) : "");

  // Sync when filters are reset or updated externally
  useEffect(() => {
    setLocalMin(filters.minPrice ? String(filters.minPrice) : "");
    setLocalMax(filters.maxPrice ? String(filters.maxPrice) : "");
  }, [filters.minPrice, filters.maxPrice]);

  // Debounce budget change by 350ms to prevent request spamming on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      const minVal = localMin.trim() ? Number(localMin) : undefined;
      const maxVal = localMax.trim() ? Number(localMax) : undefined;
      if (minVal !== filters.minPrice || maxVal !== filters.maxPrice) {
        onFilterChange({ minPrice: minVal, maxPrice: maxVal });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [localMin, localMax, filters.minPrice, filters.maxPrice, onFilterChange]);
  return (
    <aside className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-6">
      {/* Header with Result Count & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-bold text-gray-900">Filters</h2>
          {totalRecords !== undefined && (
            <p className="text-xs text-gray-500 mt-0.5">
              Showing {totalRecords.toLocaleString("en-IN")} properties
            </p>
          )}
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Listing Type: Buy / Rent Tabs */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
          Purpose
        </label>
        <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl">
          {(["SALE", "RENT"] as ListingType[]).map((type) => (
            <button
              key={type}
              onClick={() =>
                onFilterChange({ listingType: type, minPrice: undefined, maxPrice: undefined })
              }
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                filters.listingType === type
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {type === "SALE" ? "Buy" : "Rent"}
            </button>
          ))}
        </div>
      </div>

      {/* City Dropdown */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
          City
        </label>
        <select
          value={filters.city || ""}
          onChange={(e) => onFilterChange({ city: e.target.value === "All Cities" ? "" : e.target.value })}
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {CITIES.map((c) => (
            <option key={c} value={c === "All Cities" ? "" : c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* BHK Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
          Bedrooms (BHK)
        </label>
        <div className="grid grid-cols-4 gap-2">
          {BHK_OPTIONS.map((bhk) => {
            const isSelected = filters.bedrooms === bhk;
            return (
              <button
                key={bhk}
                onClick={() =>
                  onFilterChange({
                    bedrooms: isSelected ? undefined : bhk,
                  })
                }
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-gray-700 hover:border-gray-300 bg-white"
                }`}
              >
                {bhk} BHK
              </button>
            );
          })}
        </div>
      </div>

      {/* Property Type Radio / Pills */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
          Property Type
        </label>
        <div className="space-y-1.5">
          {PROPERTY_TYPES.map((type) => {
            const isSelected = filters.propertyType === type.value;
            return (
              <button
                key={type.value}
                onClick={() =>
                  onFilterChange({
                    propertyType: isSelected ? undefined : type.value,
                  })
                }
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  isSelected
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50 border border-transparent"
                }`}
              >
                <span>{type.label}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget Range Dropdowns */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
          Budget
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="number"
              placeholder="Min Price (₹)"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Max Price (₹)"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Furnishing */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
          Furnishing
        </label>
        <div className="space-y-1.5">
          {(["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"] as Furnishing[]).map(
            (furn) => {
              const isSelected = filters.furnishing === furn;
              return (
                <button
                  key={furn}
                  onClick={() =>
                    onFilterChange({
                      furnishing: isSelected ? undefined : furn,
                    })
                  }
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    isSelected
                      ? "bg-blue-50 text-blue-600 font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {furn.toLowerCase().replace("_", " ")}
                </button>
              );
            }
          )}
        </div>
      </div>
    </aside>
  );
};
