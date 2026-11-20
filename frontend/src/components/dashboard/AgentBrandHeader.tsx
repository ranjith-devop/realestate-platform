"use client";

import React from "react";
import Link from "next/link";
import { User } from "../../types";
import { formatIndianCurrency } from "../../lib/utils";
import {
  Briefcase,
  Award,
  PlusCircle,
  TrendingUp,
  Building2,
  Users,
  Clock,
  ArrowUpRight,
} from "lucide-react";

interface AgentBrandHeaderProps {
  user: User;
  propertiesCount: number;
  totalPortfolioValue: number;
  totalLeadsCount: number;
  newLeadsCount: number;
}

export const AgentBrandHeader: React.FC<AgentBrandHeaderProps> = ({
  user,
  propertiesCount,
  totalPortfolioValue,
  totalLeadsCount,
  newLeadsCount,
}) => {
  const agentDetails = user.profileData?.agentDetails;
  const agencyName = agentDetails?.agencyName || `${user.name} Realty Agency`;
  const licenseNumber = agentDetails?.licenseNumber || "RERA / License Registered";
  const experienceYears = agentDetails?.experienceYears;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/50 space-y-6">
      {/* Top Row: Agency Brand & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-indigo-800/40">
        <div className="flex items-start sm:items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
            <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {agencyName}
              </h1>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/30">
                <Award className="w-3 h-3 text-amber-400" />
                <span>{licenseNumber}</span>
              </span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-1">
              Lead Broker: <strong className="text-white">{user.name}</strong> • {user.email}
              {agentDetails?.officeAddress && ` • ${agentDetails.officeAddress}`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/profile"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white border border-white/15 transition-all"
          >
            <span>Agency Profile</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/properties/new"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Listing</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row: Agency Performance */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <span className="text-[11px] font-semibold text-indigo-200/70 uppercase block tracking-wider">
            Total Portfolio Value
          </span>
          <p className="text-xl sm:text-2xl font-black text-amber-300 mt-1 flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 mr-1 text-amber-400 shrink-0" />
            <span>{formatIndianCurrency(totalPortfolioValue)}</span>
          </p>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <span className="text-[11px] font-semibold text-indigo-200/70 uppercase block tracking-wider">
            Active Client Listings
          </span>
          <p className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center space-x-1">
            <Building2 className="w-4 h-4 mr-1 text-indigo-400 shrink-0" />
            <span>{propertiesCount} Properties</span>
          </p>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-indigo-200/70 uppercase tracking-wider">
              Client Leads Pipeline
            </span>
            {newLeadsCount > 0 && (
              <span className="text-[10px] font-extrabold bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full">
                {newLeadsCount} New
              </span>
            )}
          </div>
          <p className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center space-x-1">
            <Users className="w-4 h-4 mr-1 text-emerald-400 shrink-0" />
            <span>{totalLeadsCount} Inquiries</span>
          </p>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <span className="text-[11px] font-semibold text-indigo-200/70 uppercase block tracking-wider">
            Industry Credential
          </span>
          <p className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center space-x-1">
            <Clock className="w-4 h-4 mr-1 text-blue-400 shrink-0" />
            <span>
              {experienceYears ? `${experienceYears} Yrs Experience` : "Certified Agency"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
