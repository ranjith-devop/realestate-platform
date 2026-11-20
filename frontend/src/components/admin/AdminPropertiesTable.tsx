"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "../../lib/api";
import { Property, PropertyStatus } from "../../types";
import { formatIndianCurrency, formatDate } from "../../lib/utils";
import {
  Search,
  Building2,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const AdminPropertiesTable: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminProperties({
        page,
        limit: 15,
        search: search.trim() || undefined,
        status: statusFilter || undefined,
      });
      setProperties(res.data || []);
      if (res.meta) {
        setTotalPages(res.meta.totalPages || 1);
        setTotalRecords(res.meta.totalRecords || 0);
      }
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        msg: err instanceof Error ? err.message : "Failed to load listings",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProperties();
  };

  const handleDeleteProperty = async (propertyId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently remove listing "${title}" from the platform?`)) {
      return;
    }

    try {
      setDeletingId(propertyId);
      setFeedback(null);
      await api.deleteAdminProperty(propertyId);
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      setTotalRecords((prev) => prev - 1);
      setFeedback({ type: "success", msg: `Listing "${title}" removed by SuperAdmin.` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        msg: err instanceof Error ? err.message : "Failed to delete property",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-black text-gray-900">Property Moderation</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Total {totalRecords} listings across all direct owners and agents
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search title, city, locality..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
          </form>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-gray-50 outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="UNDER_OFFER">Under Offer</option>
            <option value="SOLD">Sold</option>
            <option value="RENTED">Rented</option>
          </select>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Properties Table */}
      {loading ? (
        <div className="py-16 text-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
          <p className="text-xs text-gray-500 mt-2 font-medium">Loading properties...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="py-12 text-center text-xs text-gray-400">
          No property listings found matching your criteria.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-bold">Property Listing</th>
                <th className="pb-3 font-bold">Price</th>
                <th className="pb-3 font-bold">Owner / Agent</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold">Listed</th>
                <th className="pb-3 font-bold text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 pr-3 max-w-xs">
                    <Link
                      href={`/properties/${p.id}`}
                      className="font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1 block"
                    >
                      {p.title}
                    </Link>
                    <p className="text-[11px] text-gray-400">
                      {p.locality}, {p.city} • {p.propertyType}
                    </p>
                  </td>

                  <td className="py-3.5 pr-3 font-black text-gray-900">
                    {formatIndianCurrency(p.price, p.listingType === "RENT")}
                  </td>

                  <td className="py-3.5 pr-3">
                    <p className="font-bold text-gray-800">{p.owner?.name || "Unknown"}</p>
                    <span
                      className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        p.owner?.role === "AGENT"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {p.owner?.role || "OWNER"}
                    </span>
                  </td>

                  <td className="py-3.5 pr-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.status === "AVAILABLE"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : p.status === "UNDER_OFFER"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="py-3.5 pr-3 text-gray-400 text-[11px]">
                    {formatDate(p.createdAt)}
                  </td>

                  <td className="py-3.5 text-right space-x-1">
                    <Link
                      href={`/properties/${p.id}`}
                      className="p-1.5 inline-block rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="View Listing"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      disabled={deletingId === p.id}
                      onClick={() => handleDeleteProperty(p.id, p.title)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Force Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
