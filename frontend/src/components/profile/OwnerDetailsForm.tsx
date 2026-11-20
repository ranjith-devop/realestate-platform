"use client";

import React from "react";
import { Building2 } from "lucide-react";

interface OwnerDetailsFormProps {
  address: string;
  onAddressChange: (val: string) => void;
  state: string;
  onStateChange: (val: string) => void;
  pincode: string;
  onPincodeChange: (val: string) => void;
  whatsapp: string;
  onWhatsappChange: (val: string) => void;
  contactTime: string;
  onContactTimeChange: (val: string) => void;
}

export const OwnerDetailsForm: React.FC<OwnerDetailsFormProps> = ({
  address,
  onAddressChange,
  state,
  onStateChange,
  pincode,
  onPincodeChange,
  whatsapp,
  onWhatsappChange,
  contactTime,
  onContactTimeChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-emerald-600" />
          <span>Property Owner Details & Inquiries</span>
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Help buyers contact you quickly with accurate location and availability preferences.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-gray-700 mb-1">Primary Address</label>
          <input
            type="text"
            placeholder="Flat / Building, Street name"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
          <input
            type="text"
            placeholder="e.g. Karnataka, Maharashtra"
            value={state}
            onChange={(e) => onStateChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Pincode</label>
          <input
            type="text"
            placeholder="e.g. 560001"
            value={pincode}
            onChange={(e) => onPincodeChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp Number (For Inquiries)</label>
          <input
            type="tel"
            placeholder="+91 98765 43210"
            value={whatsapp}
            onChange={(e) => onWhatsappChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Time to Receive Calls</label>
          <select
            value={contactTime}
            onChange={(e) => onContactTimeChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Anytime">Anytime (9 AM - 9 PM)</option>
            <option value="Morning">Morning (9 AM - 12 PM)</option>
            <option value="Afternoon">Afternoon (12 PM - 5 PM)</option>
            <option value="Evening">Evening (5 PM - 9 PM)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
