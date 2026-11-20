"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "../../lib/api";
import { Lead } from "../../types";
import { formatDate } from "../../lib/utils";
import {
  MessageSquare,
  Mail,
  Phone,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export const AdminLeadsTable: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminLeads({
        page,
        limit: 15,
        status: statusFilter || undefined,
      });
      setLeads(res.data || []);
      if (res.meta) {
        setTotalPages(res.meta.totalPages || 1);
        setTotalRecords(res.meta.totalRecords || 0);
      }
    } catch {
      // Ignore lead fetch error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, statusFilter]);

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-black text-gray-900">Platform Inquiries Audit</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Total {totalRecords} inquiries submitted by prospective buyers &amp; tenants
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3.5 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-gray-50 outline-none cursor-pointer"
        >
          <option value="">All Inquiry Statuses</option>
          <option value="NEW">NEW</option>
          <option value="CONTACTED">CONTACTED</option>
          <option value="CLOSED">CLOSED</option>
        </select>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
          <p className="text-xs text-gray-500 mt-2 font-medium">Loading platform inquiries...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="py-12 text-center text-xs text-gray-400">
          No inquiries found.
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-gray-100/70 transition-colors"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-sm text-gray-900">{lead.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
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
                  {lead.property?.city && ` (${lead.property.city})`}
                </p>

                <p className="text-xs text-gray-700 bg-white p-2.5 rounded-xl border border-gray-200/60 italic">
                  &quot;{lead.message}&quot;
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                  <span className="flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>{lead.email}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{lead.phone}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{formatDate(lead.createdAt)}</span>
                  </span>
                </div>
              </div>

              <div className="shrink-0">
                <Link
                  href={`/properties/${lead.propertyId}`}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-[11px] font-bold text-gray-700 hover:bg-gray-50"
                >
                  <span>Property</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs">
          <span className="text-gray-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
