"use client";

import React from "react";
import { Compass } from "lucide-react";
import { PropertyType } from "../../types";
import { formatIndianCurrency } from "../../lib/utils";

interface BuyerPreferencesFormProps {
  purpose: "BUY" | "RENT";
  onPurposeChange: (purpose: "BUY" | "RENT") => void;
  selectedCities: string[];
  onToggleCity: (city: string) => void;
  selectedTypes: PropertyType[];
  onToggleType: (type: PropertyType) => void;
  minBudget: number | "";
  onMinBudgetChange: (val: number | "") => void;
  maxBudget: number | "";
  onMaxBudgetChange: (val: number | "") => void;
}

const CITIES_LIST = ["Bangalore", "Mumbai", "Delhi-NCR", "Hyderabad", "Pune", "Chennai", "Kolkata"];
const PROPERTY_TYPES: { label: string; value: PropertyType }[] = [
  { label: "Apartment", value: "APARTMENT" },
  { label: "Villa", value: "VILLA" },
  { label: "Independent House", value: "INDEPENDENT_HOUSE" },
  { label: "Plot / Land", value: "PLOT" },
  { label: "Commercial", value: "COMMERCIAL" },
];

export const BuyerPreferencesForm: React.FC<BuyerPreferencesFormProps> = ({
  purpose,
  onPurposeChange,
  selectedCities,
  onToggleCity,
  selectedTypes,
  onToggleType,
  minBudget,
  onMinBudgetChange,
  maxBudget,
  onMaxBudgetChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
          <Compass className="w-5 h-5 text-indigo-600" />
          <span>Buyer Property Preferences</span>
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Customize your search criteria to get personalized recommendations.</p>
      </div>

      {/* Purpose */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2">Looking To</label>
        <div className="grid grid-cols-2 gap-3 max-w-xs">
          <button
            type="button"
            onClick={() => onPurposeChange("BUY")}
            className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
              purpose === "BUY"
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
            }`}
          >
            Buy Property
          </button>
          <button
            type="button"
            onClick={() => onPurposeChange("RENT")}
            className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
              purpose === "RENT"
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
            }`}
          >
            Rent Property
          </button>
        </div>
      </div>

      {/* Preferred Cities */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2">Preferred Cities</label>
        <div className="flex flex-wrap gap-2">
          {CITIES_LIST.map((c) => {
            const active = selectedCities.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => onToggleCity(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  active
                    ? "bg-blue-50 text-blue-700 border-blue-300"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preferred Property Types */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2">Property Types of Interest</label>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((t) => {
            const active = selectedTypes.includes(t.value);
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => onToggleType(t.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  active
                    ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Minimum Budget (₹) {minBudget !== "" && `• ${formatIndianCurrency(Number(minBudget), purpose === "RENT")}`}
          </label>
          <input
            type="number"
            placeholder="e.g. 2500000"
            value={minBudget}
            onChange={(e) => onMinBudgetChange(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Maximum Budget (₹) {maxBudget !== "" && `• ${formatIndianCurrency(Number(maxBudget), purpose === "RENT")}`}
          </label>
          <input
            type="number"
            placeholder="e.g. 15000000"
            value={maxBudget}
            onChange={(e) => onMaxBudgetChange(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
