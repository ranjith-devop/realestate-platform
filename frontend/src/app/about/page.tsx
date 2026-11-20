import React from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  HeartHandshake,
  Award,
  Users,
  Compass,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "About Us | PropNest Real Estate Platform",
  description:
    "Learn how PropNest is transforming real estate across India with verified direct owner listings, zero-brokerage options, and RERA-compliant agents.",
};

export default function AboutPage() {
  const stats = [
    { label: "Active Verified Listings", value: "50,000+" },
    { label: "Top Metro Cities Covered", value: "12+" },
    { label: "Brokerage Saved by Users", value: "₹25 Cr+" },
    { label: "Verified Direct Owners", value: "15,000+" },
  ];

  const pillars = [
    {
      icon: HeartHandshake,
      title: "Zero Brokerage Direct Connect",
      desc: "Connect directly with verified residential and commercial property owners without paying hefty mediator commissions or hidden service fees.",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
      icon: ShieldCheck,
      title: "100% Verified Listings",
      desc: "Every property goes through automated and ground verification checks to ensure authentic dimensions, genuine photos, and verified ownership records.",
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      icon: Award,
      title: "Certified RERA Agent Network",
      desc: "For complex transactions and premium developments, work with vetted agents carrying official State RERA registration numbers and verified track records.",
      color: "bg-amber-50 text-amber-600 border-amber-200",
    },
    {
      icon: Compass,
      title: "Role Isolation & Data Privacy",
      desc: "Dedicated buyer and seller workflows ensure your phone number and email are guarded against unsolicited telemarketing calls and lead scrapers.",
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 text-blue-800 text-xs font-bold border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Redefining Indian Real Estate</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Transparent, Zero-Brokerage Real Estate for Modern India
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            PropNest was built to eliminate the opacity, aggressive commission markups, and fake listings that have plagued property transactions. Whether buying your first apartment or leasing commercial space, experience search built on trust.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-gray-200 p-6 text-center shadow-xs space-y-1"
            >
              <div className="text-2xl sm:text-4xl font-black text-blue-600">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission & Story Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 text-blue-600">
            <Building2 className="w-7 h-7" />
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">Our Mission</h2>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            Founded with the philosophy that finding a place to live or invest should be as straightforward as booking a train or ordering groceries, PropNest bridges the gap between verified homeowners and discerning buyers. 
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            By combining high-speed cloud search, responsive geo-filtering, direct buyer-seller messaging, and stringent RERA compliance for certified agents, we empower every user with the information they need to negotiate with complete confidence.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              Why Home Seekers Choose PropNest
            </h2>
            <p className="text-xs text-gray-500">
              Designed from the ground up to solve the real problems of Indian property markets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-3.5 hover:border-blue-300 transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${pillar.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black">
              Ready to find your next home?
            </h3>
            <p className="text-xs text-blue-200 max-w-md">
              Explore thousands of verified flats, luxury villas, and commercial spaces across India.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/properties"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-md transition-all"
            >
              <span>Explore Listings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/properties/new"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-xs text-white border border-white/20 transition-all"
            >
              <span>Post Free Listing</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
