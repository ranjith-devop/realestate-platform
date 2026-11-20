import React from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Building,
  FileCheck,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export const metadata = {
  title: "RERA Guidelines & Compliance | PropNest Real Estate Platform",
  description:
    "Comprehensive guide to RERA (Real Estate Regulatory Authority) compliance, buyer safeguards, mandatory agent registration, and state portal links.",
};

export default function ReraGuidelinesPage() {
  const statePortals = [
    {
      state: "Maharashtra (MahaRERA)",
      url: "https://maharera.maharashtra.gov.in",
      code: "MahaRERA",
    },
    {
      state: "Karnataka (K-RERA)",
      url: "https://rera.karnataka.gov.in",
      code: "K-RERA",
    },
    {
      state: "Uttar Pradesh (UP RERA)",
      url: "https://www.up-rera.in",
      code: "UP RERA",
    },
    {
      state: "Delhi (D-RERA)",
      url: "https://rera.delhi.gov.in",
      code: "D-RERA",
    },
    {
      state: "Tamil Nadu (TNRERA)",
      url: "https://www.rera.tn.gov.in",
      code: "TNRERA",
    },
    {
      state: "Telangana (TGRERA)",
      url: "https://rera.telangana.gov.in",
      code: "TGRERA",
    },
  ];

  const coreProvisions = [
    {
      title: "Standardized Carpet Area Calculation",
      desc: "RERA mandates that property prices be quoted based on net usable floor area (carpet area) rather than inflated super built-up terms, ensuring buyers pay only for usable space.",
    },
    {
      title: "70% Escrow Account Requirement",
      desc: "Promoters are required to deposit 70% of collected buyer funds into a dedicated scheduled bank escrow account, usable only for land cost and ongoing construction.",
    },
    {
      title: "Mandatory Agent Registration",
      desc: "Real estate brokers and agents must hold an active State RERA Registration Number to market or facilitate sales. On PropNest, certified agents must present this registration.",
    },
    {
      title: "5-Year Structural Defect Liability",
      desc: "Builders are legally obligated to rectify structural defects or poor workmanship identified within 5 years from possession date at no cost to the allottee.",
    },
  ];

  const buyerChecklist = [
    "Verify the project's unique RERA registration number directly on your state's official portal.",
    "Inspect the sanctioned architectural layout plan, environmental clearance, and Commencement Certificate (CC).",
    "Confirm the promised possession timeline and ensure the penalty interest clause for delays matches RERA rules.",
    "Verify the title deed to ensure the land is free of encumbrances or unresolved mortgage claims.",
    "Make all payments strictly via banking channels payable to the project's official RERA designated escrow account.",
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-xs space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            <Award className="w-4 h-4 text-blue-600" />
            <span>Buyer Protection & Transparency</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            RERA Guidelines & Compliance
          </h1>
          <p className="text-xs text-gray-600 leading-relaxed">
            The Real Estate (Regulation and Development) Act, 2016 (RERA) was established by the Parliament of India to protect homebuyers and encourage transparency and accountability across the property sector. PropNest is committed to full transparency under these standards.
          </p>
        </div>

        {/* Core RERA Provisions */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            Key Buyer Protections Under RERA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {coreProvisions.map((provision, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-2 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-center space-x-2 text-blue-600">
                  <FileCheck className="w-5 h-5 shrink-0" />
                  <h3 className="font-bold text-gray-900 text-sm">{provision.title}</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed pl-7">
                  {provision.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Point Buyer Checklist */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
            <h2 className="text-lg sm:text-xl font-black text-gray-900">
              5-Point Due Diligence Checklist for Buyers
            </h2>
          </div>
          <p className="text-xs text-gray-500">
            Before signing any booking agreement or paying an advance, review these mandatory steps:
          </p>
          <div className="space-y-2.5 pt-2">
            {buyerChecklist.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Official State RERA Portals */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Official State RERA Portals
            </h2>
          </div>
          <p className="text-xs text-gray-500">
            Search official state portals to verify promoter licenses, project approvals, and agent credentials:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {statePortals.map((portal, idx) => (
              <a
                key={idx}
                href={portal.url}
                target="_blank"
                rel="noreferrer"
                className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {portal.state}
                  </h4>
                  <p className="text-[11px] text-gray-400">{portal.code}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* Complaint Process Card */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 shadow-lg space-y-3">
          <div className="flex items-center space-x-2 text-blue-300">
            <HelpCircle className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">How to File a RERA Complaint</h3>
          </div>
          <p className="text-xs text-blue-100 leading-relaxed">
            If a promoter or agent violates RERA provisions, buyers can lodge a formal complaint online under Section 31 of the RERA Act directly with their respective State Real Estate Regulatory Authority. Most states require a nominal fee (e.g. ₹1,000) and resolve disputes within an expedited 60-day window.
          </p>
        </div>
      </div>
    </div>
  );
}
