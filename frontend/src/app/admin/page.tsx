"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { AdminPlatformStats } from "../../types";
import { AdminStatsOverview } from "../../components/admin/AdminStatsOverview";
import { AdminUsersTable } from "../../components/admin/AdminUsersTable";
import { AdminPropertiesTable } from "../../components/admin/AdminPropertiesTable";
import { AdminLeadsTable } from "../../components/admin/AdminLeadsTable";
import {
  ShieldAlert,
  BarChart3,
  Users,
  Building2,
  MessageSquare,
  Lock,
  Loader2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export default function AdminConsolePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "users" | "properties" | "leads">("overview");
  const [stats, setStats] = useState<AdminPlatformStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.getAdminStats();
      if (res.data) {
        setStats(res.data);
      }
    } catch {
      // Handled silently
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "ADMIN") {
      fetchStats();
    }
  }, [isAuthenticated, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  // Access Guard: Block non-admins
  if (!isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-gray-900">
            SuperAdmin Clearance Required
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            This module is strictly restricted to platform administrators. If you are an administrator, please sign in with your administrative credentials.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <Link
              href="/login?redirect=/admin"
              className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Admin Sign In
            </Link>
            <Link
              href="/"
              className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-all"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* SuperAdmin Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-900/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-purple-400/20 text-purple-300 border border-purple-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                <span>SuperAdmin Console</span>
              </span>
              <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <span>System Operational</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Platform Master Governance
            </h1>
            <p className="text-xs text-purple-200/80">
              Welcome, <strong className="text-white">{user.name}</strong> • Global administrative permissions active
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={fetchStats}
              disabled={loadingStats}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white border border-white/15 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingStats ? "animate-spin" : ""}`} />
              <span>Refresh Metrics</span>
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-1 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all"
            >
              <span>User Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Console Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === "overview"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Platform Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === "users"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Management</span>
          </button>

          <button
            onClick={() => setActiveTab("properties")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === "properties"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Property Moderation</span>
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === "leads"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inquiries Audit</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          loadingStats ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
              <p className="text-xs text-gray-500 mt-2 font-medium">Aggregating platform metrics...</p>
            </div>
          ) : stats ? (
            <AdminStatsOverview stats={stats} />
          ) : (
            <div className="py-12 text-center text-xs text-gray-400">Failed to load platform stats.</div>
          )
        )}

        {activeTab === "users" && <AdminUsersTable />}
        {activeTab === "properties" && <AdminPropertiesTable />}
        {activeTab === "leads" && <AdminLeadsTable />}
      </div>
    </div>
  );
}
