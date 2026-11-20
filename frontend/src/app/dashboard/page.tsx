"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { Property, Lead } from "../../types";
import { formatIndianCurrency, formatDate } from "../../lib/utils";
import { AgentBrandHeader } from "../../components/dashboard/AgentBrandHeader";
import { OwnerAvailabilityWidget } from "../../components/dashboard/OwnerAvailabilityWidget";
import {
  Building2,
  Inbox,
  PlusCircle,
  Eye,
  Trash2,
  Edit,
  ExternalLink,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  Search,
} from "lucide-react";

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const isBuyer = user?.role === "BUYER";
  const [activeTab, setActiveTab] = useState<"listings" | "received_leads" | "sent_leads">("listings");

  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [receivedLeads, setReceivedLeads] = useState<Lead[]>([]);
  const [sentLeads, setSentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Set default tab based on user role
  useEffect(() => {
    if (user?.role === "BUYER") {
      setActiveTab("sent_leads");
    } else {
      setActiveTab("listings");
    }
  }, [user]);

  useEffect(() => {
    async function loadData() {
      if (!isAuthenticated) return;
      try {
        setLoading(true);
        // Buyers only query sent leads; Owners/Agents query listings & received leads
        if (user?.role === "BUYER") {
          const sentRes = await api.getSentLeads();
          setSentLeads(sentRes.data || []);
        } else {
          const [propsRes, recLeadsRes, sentLeadsRes] = await Promise.allSettled([
            api.getMyListings(),
            api.getReceivedLeads(),
            api.getSentLeads(),
          ]);
          if (propsRes.status === "fulfilled") setMyProperties(propsRes.value.data || []);
          if (recLeadsRes.status === "fulfilled") setReceivedLeads(recLeadsRes.value.data || []);
          if (sentLeadsRes.status === "fulfilled") setSentLeads(sentLeadsRes.value.data || []);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && isAuthenticated) {
      loadData();
    }
  }, [authLoading, isAuthenticated, user]);

  const handleDeleteProperty = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this listing?")) return;
    try {
      await api.deleteProperty(id);
      setMyProperties((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete property listing");
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, status: "NEW" | "CONTACTED" | "CLOSED") => {
    try {
      await api.updateLeadStatus(leadId, status);
      setReceivedLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status } : l))
      );
    } catch {
      alert("Failed to update status");
    }
  };

  if (authLoading || loading) {
    return <div className="max-w-7xl mx-auto p-12 text-center text-sm">Loading dashboard...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-gray-200 text-center space-y-4">
        <Building2 className="w-12 h-12 text-blue-600 mx-auto" />
        <h2 className="text-xl font-extrabold text-gray-900">Sign In Required</h2>
        <p className="text-xs text-gray-500">Please sign in to access your dashboard and manage inquiries.</p>
        <Link
          href="/login?redirect=/dashboard"
          className="inline-block w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const totalPortfolioValue = myProperties.reduce(
    (acc, curr) => acc + (curr.price || 0),
    0
  );
  const newLeadsCount = receivedLeads.filter((l) => l.status === "NEW").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner - Role-Isolated Experience */}
      {user?.role === "AGENT" ? (
        <AgentBrandHeader
          user={user}
          propertiesCount={myProperties.length}
          totalPortfolioValue={totalPortfolioValue}
          totalLeadsCount={receivedLeads.length}
          newLeadsCount={newLeadsCount}
        />
      ) : user?.role === "OWNER" ? (
        <OwnerAvailabilityWidget
          user={user}
          propertiesCount={myProperties.length}
          leadsCount={receivedLeads.length}
        />
      ) : (
        /* Buyer Header */
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Buyer Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              Welcome, {user?.name}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Verified Buyer Account • {user?.email}
            </p>
          </div>

          <Link
            href="/properties"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shrink-0 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Browse Properties</span>
          </Link>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 space-x-6 text-sm font-bold">
        {!isBuyer && (
          <>
            <button
              onClick={() => setActiveTab("listings")}
              className={`pb-3 border-b-2 flex items-center space-x-2 transition-all ${
                activeTab === "listings"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>My Listings ({myProperties.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("received_leads")}
              className={`pb-3 border-b-2 flex items-center space-x-2 transition-all ${
                activeTab === "received_leads"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Received Inquiries ({receivedLeads.length})</span>
            </button>
          </>
        )}

        <button
          onClick={() => setActiveTab("sent_leads")}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-all ${
            activeTab === "sent_leads"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>My Inquiries Sent ({sentLeads.length})</span>
        </button>
      </div>

      {/* Tab 1: My Listings (Only for Owner / Agent) */}
      {!isBuyer && activeTab === "listings" && (
        <div className="space-y-4">
          {myProperties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-800">No properties listed yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                List your residential or commercial property for free and start receiving direct inquiries.
              </p>
              <Link
                href="/properties/new"
                className="inline-block px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
              >
                Post Your First Property
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProperties.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-600 uppercase tracking-wider">
                        {p.listingType === "RENT" ? "For Rent" : "For Sale"}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700">
                        {p.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-base line-clamp-1">{p.title}</h3>
                    <p className="text-xs text-gray-500 truncate">{p.locality}, {p.city}</p>

                    <div className="pt-2 text-xl font-extrabold text-gray-900">
                      {formatIndianCurrency(p.price, p.listingType === "RENT")}
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                        <span>{p.viewsCount} views</span>
                      </span>
                      <span>•</span>
                      <span>{formatDate(p.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                    <Link
                      href={`/properties/${p.id}`}
                      className="p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center justify-center space-x-1 flex-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>

                    <Link
                      href={`/properties/${p.id}/edit`}
                      className="p-2 rounded-lg border border-gray-200 text-blue-600 hover:bg-blue-50 text-xs font-semibold flex items-center justify-center space-x-1 flex-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>

                    <button
                      onClick={() => handleDeleteProperty(p.id)}
                      className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Received Inquiries (Only for Owner / Agent) */}
      {!isBuyer && activeTab === "received_leads" && (
        <div className="space-y-4">
          {receivedLeads.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-xs text-gray-500">
              No buyer or tenant inquiries received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {receivedLeads.map((lead) => (
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
                        handleUpdateLeadStatus(
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
          )}
        </div>
      )}

      {/* Tab 3: My Inquiries Sent (Available to Buyers, Owners, Agents) */}
      {activeTab === "sent_leads" && (
        <div className="space-y-4">
          {sentLeads.length === 0 ? (
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
              {sentLeads.map((lead) => (
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
      )}
    </div>
  );
}
