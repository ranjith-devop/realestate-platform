"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Lead, User } from "../../types";
import { formatDate } from "../../lib/utils";
import { Mail, Clock, ExternalLink } from "lucide-react";

interface DashboardSentLeadsProps {
  leads: Lead[];
  user: User | null;
  isBuyer: boolean;
}

export const DashboardSentLeads: React.FC<DashboardSentLeadsProps> = ({
  leads,
  user,
  isBuyer,
}) => {
  return (
    <div className="space-y-4">
      {leads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4">
          <Mail className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-800">No inquiries sent yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Explore residential and commercial properties with zero brokerage and contact owners directly.
          </p>
          <Link
            href="/properties"
            className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md"
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="relative w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs overflow-hidden shrink-0 border border-blue-200 shadow-xs">
                    {user?.avatar ? (
                      <Image src={user.avatar} alt={user.name} fill sizes="36px" className="object-cover" />
                    ) : (
                      <span>{user?.name?.charAt(0)?.toUpperCase() ?? "U"}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                      Inquiry to Property Owner
                    </span>
                    <h4 className="font-extrabold text-gray-900 text-sm mt-0.5">
                      <Link
                        href={`/properties/${lead.propertyId}`}
                        className="hover:text-blue-600 hover:underline transition-colors"
                      >
                        {lead.property?.title || "Property Listing"}
                      </Link>
                    </h4>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full self-start sm:self-auto ${
                    lead.status === "NEW"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : lead.status === "CONTACTED"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Status: {lead.status}
                </span>
              </div>

              <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                &quot;{lead.message}&quot;
              </p>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-100">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Sent on {formatDate(lead.createdAt)}</span>
                </span>

                <Link
                  href={`/properties/${lead.propertyId}`}
                  className="font-bold text-blue-600 hover:underline flex items-center space-x-1"
                >
                  <span>View Property Details</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Banner for Buyers interested in listing */}
      {isBuyer && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Want to sell or rent out your own property?</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Register as a Property Owner to post verified listings free with zero brokerage.
            </p>
          </div>
          <Link
            href="/register?role=OWNER"
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm shrink-0"
          >
            Register as Owner
          </Link>
        </div>
      )}
    </div>
  );
};
