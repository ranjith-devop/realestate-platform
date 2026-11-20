import React from "react";
import Link from "next/link";
import { FileText, CheckCircle2, AlertTriangle, ShieldCheck, Scale, Compass } from "lucide-react";

export const metadata = {
  title: "Terms of Service | PropNest Real Estate Platform",
  description:
    "Review the terms, conditions, and user guidelines governing property listings and inquiries on PropNest.",
};

export default function TermsOfServicePage() {
  const termsList = [
    {
      title: "1. Acceptance of Terms & Eligibility",
      content:
        "By accessing or registering an account on PropNest, you agree to be bound by these Terms of Service and all applicable laws of the Republic of India. You must be at least 18 years of age and legally competent to enter into binding contracts under the Indian Contract Act, 1872.",
    },
    {
      title: "2. User Roles & Account Responsibilities",
      content:
        "PropNest supports distinct account classifications with unique operational parameters: (a) Buyers may browse and submit property inquiries for genuine search requirements; (b) Property Owners warrant that they are the rightful title holders or authorized family members, committing to zero-brokerage direct dealings; (c) Certified Agents warrant that they hold valid State RERA registration and clearly disclose agency representation; (d) SuperAdmins retain the mandate to moderate, edit, or purge fraudulent listings and accounts.",
    },
    {
      title: "3. Accuracy of Property Information & Photographs",
      content:
        "Users posting listings agree that all published data—including asking price, maintenance charges, built-up area, carpet area, possession date, and photographs—are authentic, current, and non-deceptive. Uploading copyrighted photos belonging to third parties or other portals without written permission is strictly prohibited.",
    },
    {
      title: "4. Prohibited Conduct & Platform Integrity",
      content:
        "Users shall not: (a) employ automated scraping tools, crawlers, or bots to harvest property records or phone numbers; (b) publish duplicate, fictitious, or bait-and-switch listings; (c) demand upfront booking advances without formal documentation; (d) circulate abusive, discriminatory, or unsolicited commercial messages to portal members.",
    },
    {
      title: "5. Intermediary Status & Buyer Due Diligence",
      content:
        "PropNest operates as an electronic intermediary under Section 79 of the Information Technology Act, 2000. While we employ rigorous automated and manual verification protocols, prospective buyers and tenants are strongly advised to independently verify physical title deeds, encumbrance certificates (EC), approved municipal building plans, and occupancy certificates (OC) before entering into financial agreements.",
    },
    {
      title: "6. Intellectual Property",
      content:
        "The PropNest logo, platform user interface, codebase, graphic designs, and brand collateral are the exclusive intellectual property of PropNest Technologies India Pvt. Ltd. By submitting content or property photos, you grant PropNest a non-exclusive, royalty-free license to index, display, and promote your listing across the platform.",
    },
    {
      title: "7. Termination & Account Suspension",
      content:
        "We reserve the right to suspend or permanently terminate access to any user account that violates these terms, misrepresents RERA credentials, or generates substantiated complaints from buyers, sellers, or regulatory bodies.",
    },
    {
      title: "8. Governing Law & Dispute Resolution",
      content:
        "These terms shall be governed by and construed in accordance with the laws of India. Any legal dispute or claim arising out of the use of this portal shall be subject to the exclusive jurisdiction of the competent courts located in Bangalore, Karnataka, India.",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-xs space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            <Scale className="w-4 h-4 text-blue-600" />
            <span>Legal Framework</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-gray-500">
            Last Updated: November 2026 • Effective Date: January 1, 2026
          </p>
          <p className="text-xs text-gray-600 leading-relaxed pt-2">
            Please read these terms carefully before utilizing PropNest. These rules ensure a transparent, fair, and reliable real estate marketplace for all buyers, homeowners, and real estate professionals.
          </p>
        </div>

        {/* Terms Cards */}
        <div className="space-y-4">
          {termsList.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-2 hover:border-gray-300 transition-colors"
            >
              <h2 className="text-sm sm:text-base font-extrabold text-gray-900">
                {item.title}
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </div>

        {/* Advisory Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start space-x-3.5 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h3 className="font-bold">Important Financial Safety Advisory</h3>
            <p className="text-amber-800 leading-relaxed">
              Never transfer booking deposits, token amounts, or inspection charges without physically visiting the property and verifying the owner&apos;s government-issued ID and registered title documents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
