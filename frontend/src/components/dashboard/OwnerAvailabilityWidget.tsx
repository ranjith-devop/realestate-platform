"use client";

import React from "react";
import Link from "next/link";
import { User } from "../../types";
import {
  ShieldCheck,
  Clock,
  Phone,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  PlusCircle,
} from "lucide-react";

interface OwnerAvailabilityWidgetProps {
  user: User;
  propertiesCount: number;
  leadsCount: number;
}

export const OwnerAvailabilityWidget: React.FC<OwnerAvailabilityWidgetProps> = ({
  user,
  propertiesCount,
  leadsCount,
}) => {
  const ownerDetails = user.profileData?.ownerDetails;
  const contactTime = ownerDetails?.preferredContactTime || "Anytime (9 AM - 9 PM)";
  const whatsappNumber = ownerDetails?.whatsappNumber || user.phone || "Not configured";

  return (
    <div className="space-y-6">
      {/* Direct Owner Welcome Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Direct Owner Portal • Zero Brokerage</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            Welcome, {user.name}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Verified Individual Owner • {user.email}
          </p>
        </div>

        <Link
          href="/properties/new"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Property (Free)</span>
        </Link>
      </div>

      {/* Two-Card Grid: Zero Brokerage Shield & Calling Availability */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Zero Brokerage Shield Card */}
        <div className="md:col-span-7 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white rounded-3xl border border-emerald-100 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Owner Guarantee</span>
            </div>
            <h3 className="text-lg font-black text-gray-900">
              100% Zero Brokerage Listings
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your listings are highlighted with the verified <strong>&quot;Direct Owner&quot;</strong> shield.
              Prospective buyers and tenants can contact you directly without paying any middleman commission.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-emerald-100/70 text-xs">
            <div className="flex items-center space-x-2 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{propertiesCount} Listed Properties</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{leadsCount} Direct Inquiries</span>
            </div>
          </div>
        </div>

        {/* Personal Calling Availability Widget */}
        <div className="md:col-span-5 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Contact Availability</span>
              </h3>
              <Link
                href="/profile"
                className="text-[11px] font-bold text-blue-600 hover:underline flex items-center space-x-0.5"
              >
                <span>Edit</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Preferences shared with prospective buyers.
            </p>

            <div className="space-y-2.5 mt-4 text-xs">
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <span className="text-gray-500 font-medium">Calling Hours:</span>
                <span className="font-bold text-gray-800">{contactTime}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <span className="text-gray-500 font-medium">Direct WhatsApp:</span>
                <span className="font-bold text-gray-800 flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>{whatsappNumber}</span>
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 italic">
            Tip: Keep your availability updated to receive prompt visits.
          </p>
        </div>
      </div>
    </div>
  );
};
