"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PropertyCard } from "../../components/property/PropertyCard";
import { PropertyFilters } from "../../components/property/PropertyFilters";
import { PropertySkeleton } from "../../components/property/PropertySkeleton";
import { Property, FilterState, PaginationMeta } from "../../types";
import { api } from "../../lib/api";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Building2,
} from "lucide-react";

/** Build a FilterState object from URLSearchParams */
function filtersFromParams(searchParams: URLSearchParams): FilterState {
  return {
    city: searchParams.get("city") || "",
    locality: searchParams.get("locality") || "",
    search: searchParams.get("search") || "",
    listingType: (searchParams.get("listingType") as "SALE" | "RENT") || "SALE",
    propertyType: (searchParams.get("propertyType") as any) || undefined,
    bedrooms: searchParams.get("bedrooms")
      ? Number(searchParams.get("bedrooms"))
      : undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    furnishing: (searchParams.get("furnishing") as any) || undefined,
    sortBy: (searchParams.get("sortBy") as any) || "newest",
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: 12,
  };
}

function PropertyListingContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Track whether a filter update originated internally (avoid loop)
  const internalUpdate = useRef(false);

  const [filters, setFilters] = useState<FilterState>(() =>
    filtersFromParams(searchParams)
  );

  const [properties, setProperties] = useState<Property[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // ─── KEY FIX: Sync URL → filters whenever searchParams changes ─────────────
  // This makes navbar Buy / Rent / Commercial links actually work:
  // when the URL changes externally, re-read search params and update filters.
  useEffect(() => {
    if (internalUpdate.current) {
      internalUpdate.current = false;
      return;
    }
    setFilters(filtersFromParams(searchParams));
  }, [searchParams]);
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const controller = new AbortController();

    async function doFetch() {
      try {
        setLoading(true);
        const res = await api.searchProperties(filters, {
          signal: controller.signal,
        });
        setProperties(res.data || []);
        if (res.meta) setPaginationMeta(res.meta);
      } catch (err: unknown) {
        // Do not reset state if the request was aborted due to newer filter change
        if (err instanceof Error && err.name === "AbortError") return;
        console.error("Error fetching properties:", err);
        setProperties([]);
        setPaginationMeta(null);
      } finally {
        setLoading(false);
      }
    }

    doFetch();

    return () => {
      controller.abort();
    };
  }, [filters]);

  /** Update filters AND push to URL */
  const updateFilters = useCallback(
    (newFilters: Partial<FilterState>) => {
      const updated: FilterState = {
        ...filters,
        ...newFilters,
        page: newFilters.page ?? 1,
      };
      internalUpdate.current = true; // mark as internal so the searchParams effect ignores it
      setFilters(updated);

      const params = new URLSearchParams();
      Object.entries(updated).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
          params.set(k, String(v));
        }
      });
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [filters, pathname, router]
  );

  const handleReset = useCallback(() => {
    const resetState: FilterState = {
      city: "",
      locality: "",
      search: "",
      listingType: "SALE",
      sortBy: "newest",
      page: 1,
      limit: 12,
    };
    internalUpdate.current = true;
    setFilters(resetState);
    router.push("/properties", { scroll: false });
  }, [router]);

  // ── Page title that reflects the active filter ──────────────────────────────
  const pageTitle = (() => {
    if (filters.propertyType === "COMMERCIAL") {
      return filters.city
        ? `Commercial Properties in ${filters.city}`
        : "Commercial Properties";
    }
    if (filters.listingType === "RENT") {
      return filters.city
        ? `Properties for Rent in ${filters.city}`
        : "Properties for Rent";
    }
    return filters.city
      ? `Properties for Sale in ${filters.city}`
      : "All Properties";
  })();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {paginationMeta?.totalRecords !== undefined
              ? `${paginationMeta.totalRecords.toLocaleString("en-IN")} verified listings`
              : "Searching verified listings..."}
          </p>
        </div>

        {/* Sort + Mobile filter trigger */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 font-semibold hidden sm:inline">
              Sort:
            </span>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
              className="px-3 py-2 text-xs font-semibold bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 shadow-sm"
            >
              <option value="newest">Newest Listed</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick-filter tabs: Buy / Rent / Commercial */}
      <div className="flex items-center space-x-2 border-b border-gray-200 pb-0">
        {[
          { label: "Buy", listingType: "SALE" as const, propertyType: undefined },
          { label: "Rent", listingType: "RENT" as const, propertyType: undefined },
          {
            label: "Commercial",
            listingType: "SALE" as const,
            propertyType: "COMMERCIAL" as const,
          },
        ].map((tab) => {
          const isActive =
            tab.propertyType === "COMMERCIAL"
              ? filters.propertyType === "COMMERCIAL"
              : filters.listingType === tab.listingType &&
                filters.propertyType !== "COMMERCIAL";
          return (
            <button
              key={tab.label}
              onClick={() =>
                updateFilters({
                  listingType: tab.listingType,
                  propertyType: tab.propertyType,
                  page: 1,
                })
              }
              className={`pb-3 px-1 text-sm font-bold border-b-2 transition-all ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Sidebar + Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <PropertyFilters
            filters={filters}
            onFilterChange={updateFilters}
            onReset={handleReset}
            totalRecords={paginationMeta?.totalRecords}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 p-4 flex justify-end">
            <div className="bg-white w-full max-w-sm rounded-2xl p-5 overflow-y-auto max-h-full">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg">Filter Properties</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-gray-500 hover:text-gray-900 font-bold p-1 text-lg leading-none"
                >
                  ✕
                </button>
              </div>
              <PropertyFilters
                filters={filters}
                onFilterChange={(newF) => {
                  updateFilters(newF);
                  setMobileFilterOpen(false);
                }}
                onReset={() => {
                  handleReset();
                  setMobileFilterOpen(false);
                }}
                totalRecords={paginationMeta?.totalRecords}
              />
            </div>
          </div>
        )}

        {/* Listings Grid */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <PropertySkeleton key={n} />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                No Properties Found
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No listings match your current filters. Try expanding your
                budget, changing the city, or clearing filters.
              </p>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {paginationMeta &&
            paginationMeta.totalPages &&
            paginationMeta.totalPages > 1 && (
              <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <button
                  disabled={!paginationMeta.hasPrevPage}
                  onClick={() =>
                    updateFilters({ page: (filters.page || 1) - 1 })
                  }
                  className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="text-xs font-semibold text-gray-600">
                  Page{" "}
                  <span className="text-blue-600 font-bold">
                    {paginationMeta.page}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold">{paginationMeta.totalPages}</span>
                </div>

                <button
                  disabled={!paginationMeta.hasNextPage}
                  onClick={() =>
                    updateFilters({ page: (filters.page || 1) + 1 })
                  }
                  className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <PropertySkeleton key={n} />
          ))}
        </div>
      }
    >
      <PropertyListingContent />
    </Suspense>
  );
}
