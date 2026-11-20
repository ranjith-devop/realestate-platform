import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText, UserCheck, Bell, Mail } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | PropNest Real Estate Platform",
  description:
    "Review PropNest's privacy policy and data governance practices compliant with India's Digital Personal Data Protection (DPDP) Act.",
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: UserCheck,
      title: "1. Information We Collect",
      content: (
        <>
          <p className="text-xs text-gray-600 leading-relaxed">
            We collect information necessary to provide verified property search and inquiry services across India:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-gray-600">
            <li><strong>Account Identity:</strong> Full Name, Email Address, Phone Number, and Profile Avatar provided during registration.</li>
            <li><strong>Role-Specific Data:</strong> Direct Owner verification details, Agency Name, and State RERA Registration Numbers for Certified Agents.</li>
            <li><strong>Property Listings:</strong> Geo-coordinates, property titles, pricing, carpet area, furnishings, and uploaded property photographs.</li>
            <li><strong>Inquiry Interactions:</strong> Direct messages, scheduled visit inquiries, and communication history between buyers and listing owners.</li>
          </ul>
        </>
      ),
    },
    {
      icon: Eye,
      title: "2. How We Use Your Information",
      content: (
        <>
          <p className="text-xs text-gray-600 leading-relaxed">
            Your personal information is strictly utilized to operate and safeguard the PropNest ecosystem:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-gray-600">
            <li>Connecting buyers and tenants directly with verified homeowners and certified agents.</li>
            <li>Displaying role-specific dashboards, portfolio counters, and lead status notifications.</li>
            <li>Detecting fraudulent listings, unauthorized broker representations, and automated bots.</li>
            <li>Transmitting transactional notifications regarding inquiry status, listing views, and account security alerts.</li>
          </ul>
        </>
      ),
    },
    {
      icon: Lock,
      title: "3. Role Isolation & Anti-Spam Guarantee",
      content: (
        <>
          <p className="text-xs text-gray-600 leading-relaxed">
            We understand the frustration of unsolicited sales calls. PropNest enforces strict role isolation:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-gray-600">
            <li><strong>Zero Data Selling:</strong> We never sell, rent, or lease your contact information to third-party telemarketers, loan distributors, or advertising networks.</li>
            <li><strong>Gated Contact Exchange:</strong> Your contact number is only disclosed to an owner or certified agent when you explicitly send a property inquiry.</li>
            <li><strong>SuperAdmin Moderation:</strong> Platform administrators actively monitor and suspend accounts exhibiting aggressive spamming or unverified listing behaviors.</li>
          </ul>
        </>
      ),
    },
    {
      icon: ShieldCheck,
      title: "4. Data Storage, Security & Encryption",
      content: (
        <>
          <p className="text-xs text-gray-600 leading-relaxed">
            All database transactions are securely executed with modern encryption standards:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-gray-600">
            <li><strong>Transit Encryption:</strong> All platform traffic is guarded using Transport Layer Security (TLS 1.3).</li>
            <li><strong>Credential Protection:</strong> Passwords are one-way hashed using industry-standard bcrypt with cryptographic salt rounds.</li>
            <li><strong>Cloud Infrastructure:</strong> Cloud database and asset storage comply with ISO 27001 and SOC 2 Type II data safety frameworks.</li>
          </ul>
        </>
      ),
    },
    {
      icon: FileText,
      title: "5. Compliance with Indian DPDP Act (2023)",
      content: (
        <>
          <p className="text-xs text-gray-600 leading-relaxed">
            In compliance with the Digital Personal Data Protection Act (DPDP Act 2023) and the Information Technology Act 2000, you retain complete sovereignty over your personal data:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-gray-600">
            <li><strong>Right to Access:</strong> Inspect your profile information and active listings at any time via your Account Profile.</li>
            <li><strong>Right to Correction:</strong> Edit your phone number, avatar, city, and biography directly from the profile console.</li>
            <li><strong>Right to Erasure:</strong> Delete your properties or submit an account termination request directly to our grievance desk.</li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-xs space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Data Protection & Transparency</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-500">
            Last Updated: November 2026 • Effective Date: January 1, 2026
          </p>
          <p className="text-xs text-gray-600 leading-relaxed pt-2">
            At PropNest, we treat your privacy with the highest standard of care. This policy describes how we collect, process, and safeguard personal and property data across our portal, in strict compliance with the laws of India.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <div className="pt-1">{section.content}</div>
              </div>
            );
          })}
        </div>

        {/* Grievance Officer Card */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 shadow-lg border border-indigo-900/40 space-y-4">
          <div className="flex items-center space-x-3 text-blue-400">
            <Mail className="w-6 h-6" />
            <h3 className="text-lg font-black text-white">Grievance Redressal & Contact</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the contact details of our Data Protection & Grievance Officer are provided below:
          </p>
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 text-xs space-y-1.5 text-slate-200">
            <p><strong>Grievance Officer:</strong> Legal & Privacy Compliance Team</p>
            <p><strong>Email:</strong> <a href="mailto:privacy@propnest.in" className="text-blue-400 hover:underline">privacy@propnest.in</a></p>
            <p><strong>Entity:</strong> PropNest Technologies India Pvt. Ltd.</p>
            <p><strong>Registered Address:</strong> Koramangala 5th Block, Outer Ring Road, Bangalore, Karnataka - 560095</p>
          </div>
        </div>
      </div>
    </div>
  );
}
