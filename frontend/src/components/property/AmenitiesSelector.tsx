"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

export const ALL_AMENITIES = [
  "24x7 Security",
  "Power Backup",
  "Covered Car Parking",
  "Clubhouse",
  "Gymnasium",
  "Swimming Pool",
  "High Speed Lift",
  "Children Play Area",
  "Intercom Facility",
  "Gas Pipeline",
  "Rain Water Harvesting",
  "Jogging Track",
];

interface AmenitiesSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export const AmenitiesSelector: React.FC<AmenitiesSelectorProps> = ({
  selected,
  onChange,
}) => {
  const toggleAmenity = (amenity: string) => {
    onChange(
      selected.includes(amenity)
        ? selected.filter((a) => a !== amenity)
        : [...selected, amenity]
    );
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {ALL_AMENITIES.map((amenity) => {
        const checked = selected.includes(amenity);
        return (
          <button
            type="button"
            key={amenity}
            onClick={() => toggleAmenity(amenity)}
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
              checked
                ? "border-blue-600 bg-blue-50/50 text-blue-700"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span>{amenity}</span>
            {checked && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
};
