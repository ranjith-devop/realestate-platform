"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { PropertyType } from "../../types";
import { BuyerPreferencesForm } from "../../components/profile/BuyerPreferencesForm";
import { OwnerDetailsForm } from "../../components/profile/OwnerDetailsForm";
import { AgentDetailsForm } from "../../components/profile/AgentDetailsForm";
import {
  UserCircle,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, updateUser } = useAuth();

  // Basic Details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  // Buyer Isolated Fields
  const [buyerPurpose, setBuyerPurpose] = useState<"BUY" | "RENT">("BUY");
  const [buyerCities, setBuyerCities] = useState<string[]>([]);
  const [buyerTypes, setBuyerTypes] = useState<PropertyType[]>([]);
  const [minBudget, setMinBudget] = useState<number | "">("");
  const [maxBudget, setMaxBudget] = useState<number | "">("");

  // Owner Isolated Fields
  const [ownerAddress, setOwnerAddress] = useState("");
  const [ownerState, setOwnerState] = useState("");
  const [ownerPincode, setOwnerPincode] = useState("");
  const [ownerContactTime, setOwnerContactTime] = useState("Anytime");
  const [ownerWhatsapp, setOwnerWhatsapp] = useState("");

  // Agent Isolated Fields
  const [agencyName, setAgencyName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [experienceYears, setExperienceYears] = useState<number | "">("");
  const [agentWebsite, setAgentWebsite] = useState("");
  const [agentWhatsapp, setAgentWhatsapp] = useState("");
  const [agentOffice, setAgentOffice] = useState("");
  const [agentCities, setAgentCities] = useState<string[]>([]);

  // State feedback
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load user data on mount
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
      return;
    }

    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setCity(user.city || "");
      setBio(user.bio || "");
      setAvatar(user.avatar || "");

      const pData = user.profileData || {};

      if (user.role === "BUYER") {
        const bp = pData.buyerPreferences || {};
        setBuyerPurpose(bp.purpose || "BUY");
        setBuyerCities(bp.preferredCities || []);
        setBuyerTypes(bp.propertyTypes || []);
        setMinBudget(bp.minBudget ?? "");
        setMaxBudget(bp.maxBudget ?? "");
      } else if (user.role === "OWNER") {
        const od = pData.ownerDetails || {};
        setOwnerAddress(od.address || "");
        setOwnerState(od.state || "");
        setOwnerPincode(od.pincode || "");
        setOwnerContactTime(od.preferredContactTime || "Anytime");
        setOwnerWhatsapp(od.whatsappNumber || "");
      } else if (user.role === "AGENT") {
        const ad = pData.agentDetails || {};
        setAgencyName(ad.agencyName || "");
        setLicenseNumber(ad.licenseNumber || "");
        setExperienceYears(ad.experienceYears ?? "");
        setAgentWebsite(ad.website || "");
        setAgentWhatsapp(ad.whatsappNumber || "");
        setAgentOffice(ad.officeAddress || "");
        setAgentCities(ad.operatingCities || []);
      }
    }
  }, [user, isAuthenticated, authLoading, router]);

  // Handle Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const payload: {
        name: string;
        phone: string | null;
        city: string | null;
        bio: string | null;
        avatar: string | null;
        profileData: Record<string, unknown>;
      } = {
        name,
        phone: phone || null,
        city: city || null,
        bio: bio || null,
        avatar: avatar || null,
        profileData: {},
      };

      if (user?.role === "BUYER") {
        payload.profileData = {
          buyerPreferences: {
            purpose: buyerPurpose,
            preferredCities: buyerCities,
            propertyTypes: buyerTypes,
            minBudget: minBudget === "" ? null : Number(minBudget),
            maxBudget: maxBudget === "" ? null : Number(maxBudget),
          },
        };
      } else if (user?.role === "OWNER") {
        payload.profileData = {
          ownerDetails: {
            address: ownerAddress,
            state: ownerState,
            pincode: ownerPincode,
            preferredContactTime: ownerContactTime,
            whatsappNumber: ownerWhatsapp,
          },
        };
      } else if (user?.role === "AGENT") {
        payload.profileData = {
          agentDetails: {
            agencyName,
            licenseNumber,
            experienceYears: experienceYears === "" ? null : Number(experienceYears),
            website: agentWebsite,
            whatsappNumber: agentWhatsapp,
            officeAddress: agentOffice,
            operatingCities: agentCities,
          },
        };
      }

      const res = await api.updateProfile(payload);
      if (res.data) {
        updateUser(res.data);
      }
      setSuccessMsg("Your profile details have been saved successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleBuyerCity = (c: string) => {
    setBuyerCities((prev) => (prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]));
  };

  const toggleBuyerType = (t: PropertyType) => {
    setBuyerTypes((prev) => (prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]));
  };

  const toggleAgentCity = (c: string) => {
    setAgentCities((prev) => (prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50/70 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header with Role Pill */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center overflow-hidden shrink-0">
                {avatar ? (
                  <Image src={avatar} alt={name} fill sizes="64px" className="object-cover" />
                ) : (
                  <UserCircle className="w-10 h-10 text-blue-600" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900">{user.name}</h1>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{user.role}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <Link
                href="/dashboard"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
                <UserCircle className="w-5 h-5 text-blue-600" />
                <span>Personal Information</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Your core contact information shared on inquiries and listings.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address (Verified)</label>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Current City / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Bangalore, Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Profile Photo Web Link</label>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">About / Bio</label>
                <textarea
                  rows={2}
                  placeholder="Tell others a little about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Role-Isolated Section */}
          {user.role === "BUYER" && (
            <BuyerPreferencesForm
              purpose={buyerPurpose}
              onPurposeChange={setBuyerPurpose}
              selectedCities={buyerCities}
              onToggleCity={toggleBuyerCity}
              selectedTypes={buyerTypes}
              onToggleType={toggleBuyerType}
              minBudget={minBudget}
              onMinBudgetChange={setMinBudget}
              maxBudget={maxBudget}
              onMaxBudgetChange={setMaxBudget}
            />
          )}

          {user.role === "OWNER" && (
            <OwnerDetailsForm
              address={ownerAddress}
              onAddressChange={setOwnerAddress}
              state={ownerState}
              onStateChange={setOwnerState}
              pincode={ownerPincode}
              onPincodeChange={setOwnerPincode}
              whatsapp={ownerWhatsapp}
              onWhatsappChange={setOwnerWhatsapp}
              contactTime={ownerContactTime}
              onContactTimeChange={setOwnerContactTime}
            />
          )}

          {user.role === "AGENT" && (
            <AgentDetailsForm
              agencyName={agencyName}
              onAgencyNameChange={setAgencyName}
              licenseNumber={licenseNumber}
              onLicenseNumberChange={setLicenseNumber}
              experienceYears={experienceYears}
              onExperienceYearsChange={setExperienceYears}
              agentWebsite={agentWebsite}
              onAgentWebsiteChange={setAgentWebsite}
              agentWhatsapp={agentWhatsapp}
              onAgentWhatsappChange={setAgentWhatsapp}
              agentOffice={agentOffice}
              onAgentOfficeChange={setAgentOffice}
              selectedCities={agentCities}
              onToggleCity={toggleAgentCity}
            />
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-2">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
