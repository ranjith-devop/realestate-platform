"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PropertyCard } from "../components/property/PropertyCard";
import { PropertySkeleton } from "../components/property/PropertySkeleton";
import { Property } from "../types";
import { api } from "../lib/api";
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

const CITIES = [
  {
    name: "Bangalore",
    state: "Karnataka",
    image:
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Mumbai",
    state: "Maharashtra",
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Delhi-NCR",
    state: "Haryana / Delhi",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Hyderabad",
    state: "Telangana",
    image:
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Pune",
    state: "Maharashtra",
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"SALE" | "RENT">("SALE");
  const [selectedCity, setSelectedCity] = useState("Bangalore");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBhk, setSelectedBhk] = useState<number | null>(null);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [cityStats, setCityStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [propsRes, statsRes] = await Promise.allSettled([
          api.searchProperties({ limit: 6, sortBy: "popularity" }),
          api.getCityStats(),
        ]);

        if (propsRes.status === "fulfilled") {
          setFeaturedProperties(propsRes.value.data || []);
        }

        if (statsRes.status === "fulfilled") {
          const map: Record<string, number> = {};
          (statsRes.value.data || []).forEach((item) => {
            map[item.city] = item.count;
          });
          setCityStats(map);
        }
      } catch (err) {
        console.error("Failed to load home page data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("listingType", activeTab);
    if (selectedCity) params.set("city", selectedCity);
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedBhk) params.set("bedrooms", String(selectedBhk));

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section with 99acres / NoBroker Style Search Bar */}
      <section className="relative bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>India&apos;s Leading Zero-Brokerage Property Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Find Your Dream Home With <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Zero Brokerage Fees
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Direct connections between genuine buyers, tenants, and verified property owners. Search across 50,000+ verified listings in India.
          </p>

          {/* Search Card */}
          <div className="pt-4 max-w-4xl mx-auto text-left">
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-2xl text-gray-800 border border-gray-100">
              {/* Buy / Rent Tabs */}
              <div className="flex items-center space-x-3 mb-4 border-b border-gray-100 pb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("SALE")}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                    activeTab === "SALE"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Buy Residential
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("RENT")}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                    activeTab === "RENT"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Rent Home
                </button>
              </div>

              {/* Main Inputs Form */}
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  {/* City Selector */}
                  <div className="md:col-span-4 relative">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      City
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {CITIES.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Locality or Keyword Search */}
                  <div className="md:col-span-8 relative">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Search Locality, Landmark, or Project
                    </label>
                    <div className="relative flex items-center">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3" />
                      <input
                        type="text"
                        placeholder="e.g. Whitefield, Indiranagar, Luxury Villa, 3 BHK..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* BHK Filter Pills & Submit Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
                    <span className="text-xs text-gray-400 font-semibold mr-1 shrink-0">BHK:</span>
                    {[1, 2, 3, 4].map((bhk) => {
                      const isSelected = selectedBhk === bhk;
                      return (
                        <button
                          key={bhk}
                          type="button"
                          onClick={() => setSelectedBhk(isSelected ? null : bhk)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                            isSelected
                              ? "bg-blue-100 text-blue-700 border border-blue-300"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent"
                          }`}
                        >
                          {bhk} BHK
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all shrink-0"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Properties</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Top Metro Cities Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Explore Top Indian Metros
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Browse residential and commercial real estate in high-growth corridors
            </p>
          </div>
          <Link
            href="/properties"
            className="hidden sm:inline-flex items-center space-x-1.5 text-sm font-bold text-blue-600 hover:text-blue-800"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CITIES.map((city) => (
            <Link
              key={city.name}
              href={`/properties?city=${encodeURIComponent(city.name)}`}
              className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <Image
                src={city.image}
                alt={city.name}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider block">
                  {cityStats[city.name] !== undefined
                    ? `${cityStats[city.name].toLocaleString("en-IN")} Properties`
                    : "Explore Properties"}
                </span>
                <h3 className="text-lg font-black tracking-tight">{city.name}</h3>
                <p className="text-xs text-gray-300 mt-0.5">{city.state}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured / Trending Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Featured Verified Properties
            </h2>
          </div>
          <Link
            href="/properties?sortBy=popularity"
            className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>Explore More</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <PropertySkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>

      {/* Post Property Banner for Owners (NoBroker Inspired) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-left">
            <span className="text-xs font-extrabold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-white inline-block">
              For Property Owners
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Are You a Property Owner? <br />
              Post Your Listing For Free
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              Connect directly with verified buyers and tenants without paying any brokerage fees. Get inquiries directly on your dashboard.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-white/90 pt-1">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Zero Brokerage</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>50k+ Active Inquirers</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Fast Lead Delivery</span>
              </span>
            </div>
          </div>

          <Link
            href="/properties/new"
            className="px-8 py-4 rounded-2xl bg-white text-blue-700 font-extrabold text-sm sm:text-base hover:bg-gray-100 shadow-lg transition-transform hover:scale-105 shrink-0"
          >
            Post Property Free
          </Link>
        </div>
      </section>
    </div>
  );
}
