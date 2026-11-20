"use client";

import React from "react";
import Link from "next/link";
import { AdminPlatformStats } from "../../types";
import { formatIndianCurrency, formatDate } from "../../lib/utils";
import {
  Users,
  Building2,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  Briefcase,
  Home,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from "lucide-react";

interface AdminStatsOverviewProps {
  stats: AdminPlatformStats;
}

export const AdminStatsOverview: React.FC<AdminStatsOverviewProps> = ({ stats }) => {
  return (
    <div className="space-y-8">
      {/* 4 Hero KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-3xl p-6 shadow-lg border border-purple-800/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Total Platform Assets
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-2 text-white">
            {formatIndianCurrency(stats.properties.totalAssetValue)}
          </p>
          <p className="text-xs text-purple-200/70 mt-1">
            Avg: {formatIndianCurrency(stats.properties.averagePrice)} / listing
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Registered Users
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-2 text-gray-900">
            {stats.users.total}
          </p>
          <div className="flex items-center space-x-2 text-[11px] font-semibold text-gray-500 mt-1">
            <span className="text-blue-600">{stats.users.buyers} Buyers</span>
            <span>•</span>
            <span className="text-emerald-600">{stats.users.owners} Owners</span>
            <span>•</span>
            <span className="text-amber-600">{stats.users.agents} Agents</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Property Listings
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-2 text-gray-900">
            {stats.properties.total}
          </p>
          <div className="flex items-center space-x-2 text-[11px] font-semibold text-gray-500 mt-1">
            <span className="text-emerald-600">{stats.properties.available} Active</span>
            <span>•</span>
            <span className="text-blue-600">{stats.properties.sold + stats.properties.rented} Completed</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Buyer Inquiries
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-2 text-gray-900">
            {stats.leads.total}
          </p>
          <div className="flex items-center space-x-2 text-[11px] font-semibold text-gray-500 mt-1">
            <span className="text-blue-600">{stats.leads.new} New</span>
            <span>•</span>
            <span className="text-emerald-600">{stats.leads.contacted + stats.leads.closed} Resolved</span>
          </div>
        </div>
      </div>

      {/* Recent Activity: Users & Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-sm font-black text-gray-900 flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Recent User Signups</span>
            </h3>
            <span className="text-xs text-gray-400">Latest 5 users</span>
          </div>

          <div className="space-y-3">
            {stats.recentUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100/80 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{u.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      u.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : u.role === "AGENT"
                        ? "bg-amber-100 text-amber-800"
                        : u.role === "OWNER"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {u.role}
                  </span>
                  <span className="text-[10px] text-gray-400">{formatDate(u.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Listings */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-sm font-black text-gray-900 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Recent Property Listings</span>
            </h3>
            <span className="text-xs text-gray-400">Latest 5 listings</span>
          </div>

          <div className="space-y-3">
            {stats.recentProperties.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100/80 transition-colors"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <Link
                    href={`/properties/${p.id}`}
                    className="text-xs font-bold text-gray-900 hover:text-blue-600 transition-colors truncate block"
                  >
                    {p.title}
                  </Link>
                  <p className="text-[11px] text-gray-500">
                    {p.city} • Owner: {p.owner.name} ({p.owner.role})
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-blue-900">{formatIndianCurrency(p.price)}</p>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
