import React from "react";
import Link from "next/link";
import { Building2, ShieldCheck, HeartHandshake, Award } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 text-sm">
      {/* Platform Features / Trust Badges */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-900/40 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">100% Verified Listings</h4>
              <p className="text-xs text-gray-400 mt-0.5">Every property checked by our ground verification team.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-900/40 text-emerald-400 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Zero Brokerage Options</h4>
              <p className="text-xs text-gray-400 mt-0.5">Connect directly with verified owners and save lakhs.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-900/40 text-purple-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">50,000+ Active Properties</h4>
              <p className="text-xs text-gray-400 mt-0.5">High-speed indexing across top metro cities in India.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 text-white mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg">PropNest</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              India&apos;s fastest growing real-estate search portal inspired by 99acres and NoBroker.
            </p>
            <div className="text-xs text-gray-500">
              API Docs:{" "}
              <a
                href="http://localhost:5000/api-docs"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline"
              >
                /api-docs (Swagger)
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-3">Popular Cities</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/properties?city=Bangalore" className="hover:text-white transition-colors">Properties in Bangalore</Link></li>
              <li><Link href="/properties?city=Mumbai" className="hover:text-white transition-colors">Properties in Mumbai</Link></li>
              <li><Link href="/properties?city=Delhi-NCR" className="hover:text-white transition-colors">Properties in Delhi-NCR</Link></li>
              <li><Link href="/properties?city=Hyderabad" className="hover:text-white transition-colors">Properties in Hyderabad</Link></li>
              <li><Link href="/properties?city=Pune" className="hover:text-white transition-colors">Properties in Pune</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-3">Property Types</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/properties?propertyType=APARTMENT" className="hover:text-white transition-colors">Apartments & Flats</Link></li>
              <li><Link href="/properties?propertyType=VILLA" className="hover:text-white transition-colors">Luxury Villas</Link></li>
              <li><Link href="/properties?propertyType=INDEPENDENT_HOUSE" className="hover:text-white transition-colors">Independent Houses</Link></li>
              <li><Link href="/properties?propertyType=PLOT" className="hover:text-white transition-colors">Residential Plots</Link></li>
              <li><Link href="/properties?propertyType=COMMERCIAL" className="hover:text-white transition-colors">Commercial Spaces</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-3">For Owners & Agents</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/properties/new" className="hover:text-white transition-colors">Post Free Property Listing</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Owner Lead Management</Link></li>
              <li><Link href="/register?role=AGENT" className="hover:text-white transition-colors">Agent Partner Program</Link></li>
              <li><Link href="/register?role=OWNER" className="hover:text-white transition-colors">Owner Registration</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} PropNest Real Estate Platform. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>RERA Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
