"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
  Building2,
  PlusCircle,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  MapPin,
  ChevronDown,
} from "lucide-react";

const TOP_CITIES = ["Bangalore", "Mumbai", "Delhi-NCR", "Hyderabad", "Pune"];

function DesktopNavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isProperties = pathname.startsWith("/properties");
  const activeListing = searchParams.get("listingType");
  const activePropertyType = searchParams.get("propertyType");

  const links = [
    {
      label: "Buy",
      href: "/properties?listingType=SALE",
      isActive:
        isProperties &&
        (activeListing === "SALE" || !activeListing) &&
        activePropertyType !== "COMMERCIAL",
    },
    {
      label: "Rent",
      href: "/properties?listingType=RENT",
      isActive: isProperties && activeListing === "RENT",
    },
    {
      label: "Commercial",
      href: "/properties?propertyType=COMMERCIAL",
      isActive: isProperties && activePropertyType === "COMMERCIAL",
    },
  ];

  return (
    <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium text-gray-700">
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
            link.isActive
              ? "bg-blue-50 text-blue-600"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          {link.label}
        </Link>
      ))}
      <a
        href="http://localhost:5000/api-docs"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
      >
        API Docs
      </a>
    </nav>
  );
}

function NavLinksFallback() {
  return (
    <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium text-gray-700">
      <Link
        href="/properties?listingType=SALE"
        className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        Buy
      </Link>
      <Link
        href="/properties?listingType=RENT"
        className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        Rent
      </Link>
      <Link
        href="/properties?propertyType=COMMERCIAL"
        className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        Commercial
      </Link>
      <a
        href="http://localhost:5000/api-docs"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
      >
        API Docs
      </a>
    </nav>
  );
}

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Bangalore");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const router = useRouter();

  // Refs for click-outside detection to prevent dropdown staying open and crashing
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target as Node)
      ) {
        setCityDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCityDropdownOpen(false);
    router.push(`/properties?city=${encodeURIComponent(city)}`);
  };

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    try {
      await logout();
    } catch {
      // Tokens are cleared regardless
    }
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & City Selector */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-gray-900 leading-none">
                  Prop<span className="text-blue-600">Nest</span>
                </span>
                <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase">
                  Zero Brokerage
                </span>
              </div>
            </Link>

            {/* City Dropdown - with click-outside ref */}
            <div className="relative hidden md:block" ref={cityDropdownRef}>
              <button
                onClick={() => setCityDropdownOpen((prev) => !prev)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl bg-white shadow-lg border border-gray-100 py-1.5 z-50">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Select City
                  </div>
                  {TOP_CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                        selectedCity === city
                          ? "text-blue-600 font-semibold bg-blue-50/50"
                          : "text-gray-700"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Nav Links wrapped in Suspense so useSearchParams does not de-opt static pages */}
          <Suspense fallback={<NavLinksFallback />}>
            <DesktopNavLinks />
          </Suspense>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/properties/new"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Property</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                Free
              </span>
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen((prev) => !prev)}
                  className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-full border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-800 max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                        {user?.role}
                      </span>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-gray-400" />
                      <span>Owner Dashboard</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/properties?listingType=SALE"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-50"
          >
            Buy Properties
          </Link>
          <Link
            href="/properties?listingType=RENT"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-50"
          >
            Rent Properties
          </Link>
          <Link
            href="/properties?propertyType=COMMERCIAL"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-50"
          >
            Commercial Properties
          </Link>

          {/* Mobile City Pills */}
          <div className="px-3 py-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Browse by City
            </p>
            <div className="flex flex-wrap gap-2">
              {TOP_CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push(
                      `/properties?city=${encodeURIComponent(city)}`
                    );
                  }}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <Link
            href="/properties/new"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-emerald-600 hover:bg-emerald-50"
          >
            + Post Property (Free)
          </Link>

          {isAuthenticated ? (
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-50"
              >
                <LayoutDashboard className="w-5 h-5 text-gray-400" />
                <span>My Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 text-left"
              >
                <LogOut className="w-5 h-5 text-red-500" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="border-t border-gray-100 pt-3 flex flex-col space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 px-4 rounded-lg border border-gray-300 font-semibold text-gray-700"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 px-4 rounded-lg bg-blue-600 font-semibold text-white"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
