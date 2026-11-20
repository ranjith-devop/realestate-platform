"use client";

import React from "react";
import Link from "next/link";
import { User } from "../../types";
import { ShieldCheck, ArrowRight } from "lucide-react";

interface SuperAdminBannerProps {
  user: User;
}

export const SuperAdminBanner: React.FC<SuperAdminBannerProps> = ({ user }) => {
  return (
    <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div className="flex items-start sm:items-center space-x-4">
        <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-400 flex items-center justify-center shrink-0 shadow-inner">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-300 bg-purple-900/60 border border-purple-700/50 px-2.5 py-0.5 rounded-full">
              SuperAdmin Control
            </span>
            <span className="text-xs text-purple-200">System Administrator</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Welcome, {user.name}
          </h1>
          <p className="text-xs text-slate-300">
            {user.email} • Full platform moderation & governance privileges
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/admin"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all group"
        >
          <span>Open SuperAdmin Console</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
