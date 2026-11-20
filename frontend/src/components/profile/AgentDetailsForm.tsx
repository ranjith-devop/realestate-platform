"use client";

import React from "react";
import { Briefcase } from "lucide-react";

interface AgentDetailsFormProps {
  agencyName: string;
  onAgencyNameChange: (val: string) => void;
  licenseNumber: string;
  onLicenseNumberChange: (val: string) => void;
  experienceYears: number | "";
  onExperienceYearsChange: (val: number | "") => void;
  agentWebsite: string;
  onAgentWebsiteChange: (val: string) => void;
  agentWhatsapp: string;
  onAgentWhatsappChange: (val: string) => void;
  agentOffice: string;
  onAgentOfficeChange: (val: string) => void;
  selectedCities: string[];
  onToggleCity: (city: string) => void;
}

const CITIES_LIST = ["Bangalore", "Mumbai", "Delhi-NCR", "Hyderabad", "Pune", "Chennai", "Kolkata"];

export const AgentDetailsForm: React.FC<AgentDetailsFormProps> = ({
  agencyName,
  onAgencyNameChange,
  licenseNumber,
  onLicenseNumberChange,
  experienceYears,
  onExperienceYearsChange,
  agentWebsite,
  onAgentWebsiteChange,
  agentWhatsapp,
  onAgentWhatsappChange,
  agentOffice,
  onAgentOfficeChange,
  selectedCities,
  onToggleCity,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-amber-600" />
          <span>Agent & Agency Credentials</span>
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Showcase your license and agency information to attract verified property buyers.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Agency / Firm Name</label>
          <input
            type="text"
            placeholder="e.g. Apex Realty Partners"
            value={agencyName}
            onChange={(e) => onAgencyNameChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">RERA / Registration Number</label>
          <input
            type="text"
            placeholder="e.g. PRM/KA/RERA/1251/..."
            value={licenseNumber}
            onChange={(e) => onLicenseNumberChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Years of Experience</label>
          <input
            type="number"
            placeholder="e.g. 8"
            value={experienceYears}
            onChange={(e) => onExperienceYearsChange(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp Business Number</label>
          <input
            type="tel"
            placeholder="+91 98765 43210"
            value={agentWhatsapp}
            onChange={(e) => onAgentWhatsappChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Agency Website</label>
          <input
            type="url"
            placeholder="https://apexrealty.com"
            value={agentWebsite}
            onChange={(e) => onAgentWebsiteChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Office Address</label>
          <input
            type="text"
            placeholder="Suite 402, Business Hub"
            value={agentOffice}
            onChange={(e) => onAgentOfficeChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-gray-700 mb-2">Operating Cities</label>
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
                      ? "bg-amber-50 text-amber-800 border-amber-300"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
