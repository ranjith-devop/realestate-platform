"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Lead } from "../../types";
import { formatDate } from "../../lib/utils";
import { Mail, Phone, Clock } from "lucide-react";

interface DashboardReceivedLeadsProps {
  leads: Lead[];
  onUpdateStatus: (leadId: string, status: "NEW" | "CONTACTED" | "CLOSED") => void;
}

export const DashboardReceivedLeads: React.FC<DashboardReceivedLeadsProps> = ({
  leads,
  onUpdateStatus,
}) => {
  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-xs text-gray-500">
        No buyer or tenant inquiries received yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {leads.map((lead) => (
        <div
          key={lead.id}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-4"
        >
          <div className="flex items-start space-x-3.5 flex-1 min-w-0">
            <div className="relative w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 border border-blue-200 shadow-xs">
              {lead.buyer?.avatar ? (
                <Image src={lead.buyer.avatar} alt={lead.name} fill sizes="40px" className="object-cover" />
              ) : (
                <span>{lead.name.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm text-gray-900">{lead.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    lead.status === "NEW"
                      ? "bg-blue-100 text-blue-800"
                      : lead.status === "CONTACTED"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {lead.status}
                </span>
              </div>

              <p className="text-xs text-gray-600 font-medium">
                Property:{" "}
                <Link
                  href={`/properties/${lead.propertyId}`}
                  className="text-blue-600 hover:underline font-bold"
                >
                  {lead.property?.title || "View Property"}
                </Link>
              </p>

              <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100 italic">
                &quot;{lead.message}&quot;
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                <span className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                </span>
                <span className="flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{formatDate(lead.createdAt)}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <select
              value={lead.status}
              onChange={(e) =>
                onUpdateStatus(
                  lead.id,
                  e.target.value as "NEW" | "CONTACTED" | "CLOSED"
                )
              }
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 outline-none cursor-pointer"
            >
              <option value="NEW">Mark NEW</option>
              <option value="CONTACTED">Mark CONTACTED</option>
              <option value="CLOSED">Mark CLOSED</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};
