import React, { cache } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { PropertyGallery } from "../../../components/property/PropertyGallery";
import { LeadInquiryForm } from "../../../components/property/LeadInquiryForm";
import { SimilarProperties } from "../../../components/property/SimilarProperties";
import { Property } from "../../../types";
import {
  formatIndianCurrency,
  formatArea,
  formatDate,
  getPropertyCoverImage,
} from "../../../lib/utils";
import {
  BedDouble,
  Bath,
  Maximize2,
  MapPin,
  Calendar,
  Eye,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const fetchPropertyData = cache(async (id: string): Promise<Property | null> => {
  try {
    const res = await fetch(`${API_URL}/properties/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await fetchPropertyData(id);

  if (!property) {
    return {
      title: "Property Not Found | PropNest",
      description: "The requested property listing could not be found.",
    };
  }

  const isRent = property.listingType === "RENT";
  const formattedPrice = formatIndianCurrency(property.price, isRent);
  const title = `${property.bedrooms > 0 ? `${property.bedrooms} BHK ` : ""}${property.propertyType} for ${
    isRent ? "Rent" : "Sale"
  } in ${property.locality}, ${property.city} - ${formattedPrice} | PropNest`;

  const description = `${property.title}. Located in ${property.locality}, ${property.city}. Super area ${formatArea(
    property.superAreaSqFt
  )}. Direct owner contact with zero brokerage on PropNest.`;

  const coverUrl = getPropertyCoverImage(property.images, property.propertyType);

  return {
    title,
    description,
    keywords: [
      `${property.locality} real estate`,
      `${property.city} properties`,
      `${property.bedrooms} BHK in ${property.city}`,
      isRent ? "flats for rent" : "apartments for sale",
      "zero brokerage",
    ],
    openGraph: {
      title,
      description,
      images: [{ url: coverUrl, width: 1200, height: 630, alt: property.title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [coverUrl],
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = await fetchPropertyData(id);

  // Graceful not-found UI (instead of bare Next.js error page)
  if (!property) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-gray-900">Property Not Found</h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
          This listing may have been removed, sold, or the backend server is not
          running. Please check back or browse other properties.
        </p>
        <Link
          href="/properties"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Properties</span>
        </Link>
      </div>
    );
  }

  const isRent = property.listingType === "RENT";

  // Normalize images in case backend returns null
  const safeImages = Array.isArray(property.images) ? property.images : [];
  const safeAmenities = Array.isArray(property.amenities) ? property.amenities : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/properties/${property.id}`,
    datePosted: property.createdAt,
    price: property.price,
    priceCurrency: "INR",
    category: property.propertyType,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.locality,
      addressRegion: property.state,
      postalCode: property.pincode,
      addressCountry: "IN",
    },
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "INR",
      businessFunction: isRent
        ? "http://purl.org/goodrelations/v1#LeaseOut"
        : "http://purl.org/goodrelations/v1#Sell",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumbs */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/properties?city=${encodeURIComponent(property.city)}`}
              className="hover:text-blue-600 transition-colors"
            >
              {property.city}
            </Link>
            <span>/</span>
            <span>{property.locality}</span>
            <span>/</span>
            <span className="text-gray-900 truncate max-w-xs">{property.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md text-white uppercase ${
                    isRent ? "bg-amber-600" : "bg-blue-600"
                  }`}
                >
                  {isRent ? "For Rent" : "For Sale"}
                </span>
                <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Listing</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
                {property.title}
              </h1>
              <p className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                <MapPin className="w-4 h-4 text-blue-600 mr-1 shrink-0" />
                <span>
                  {property.address}, {property.locality}, {property.city} -{" "}
                  {property.pincode}
                </span>
              </p>
            </div>

            <div className="text-left md:text-right bg-blue-50/60 p-4 rounded-2xl border border-blue-100 shrink-0">
              <span className="text-2xl sm:text-4xl font-black text-blue-900 block">
                {formatIndianCurrency(property.price, isRent)}
              </span>
              {property.pricePerSqFt && !isRent && (
                <span className="text-xs text-gray-500 font-medium">
                  ₹{property.pricePerSqFt.toLocaleString("en-IN")} / sq.ft
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Two-column: Gallery+Details (left), Sticky Inquiry Form (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            {/* Gallery */}
            <PropertyGallery
              images={safeImages}
              title={property.title}
              propertyType={property.propertyType}
            />

            {/* Key Specs */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-base font-extrabold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Property Overview &amp; Key Highlights
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">
                    Configuration
                  </span>
                  <span className="text-sm font-bold text-gray-900 mt-0.5 flex items-center space-x-1">
                    <BedDouble className="w-4 h-4 text-blue-600 mr-1" />
                    {property.bedrooms > 0
                      ? `${property.bedrooms} BHK`
                      : property.propertyType}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold block uppercase">
                    Super Area
                  </span>
                  <span className="text-sm font-bold text-gray-900 mt-0.5 flex items-center space-x-1">
                    <Maximize2 className="w-4 h-4 text-blue-600 mr-1" />
                    {formatArea(property.superAreaSqFt)}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold block uppercase">
                    Bathrooms
                  </span>
                  <span className="text-sm font-bold text-gray-900 mt-0.5 flex items-center space-x-1">
                    <Bath className="w-4 h-4 text-blue-600 mr-1" />
                    {property.bathrooms} Baths
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold block uppercase">
                    Furnishing
                  </span>
                  <span className="text-sm font-bold text-gray-900 mt-0.5 block capitalize">
                    {property.furnishing.toLowerCase().replace(/_/g, " ")}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold block uppercase">
                    Floor
                  </span>
                  <span className="text-sm font-bold text-gray-900 mt-0.5 block">
                    {property.floorNumber
                      ? `${property.floorNumber} of ${property.totalFloors ?? "-"}`
                      : "Ground Floor"}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold block uppercase">
                    Property Type
                  </span>
                  <span className="text-sm font-bold text-gray-900 mt-0.5 block">
                    {property.propertyType.replace(/_/g, " ")}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold block uppercase">
                    Listed On
                  </span>
                  <span className="text-sm font-bold text-gray-900 mt-0.5 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 mr-1" />
                    {formatDate(property.createdAt)}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold block uppercase">
                    Views
                  </span>
                  <span className="text-sm font-bold text-gray-900 mt-0.5 flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-gray-400 mr-1" />
                    {property.viewsCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-3">
              <h2 className="text-base font-extrabold text-gray-900 pb-3 border-b border-gray-100">
                Detailed Property Description
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {safeAmenities.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
                <h2 className="text-base font-extrabold text-gray-900 pb-3 border-b border-gray-100">
                  Amenities &amp; Facilities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {safeAmenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-800"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Inquiry Form */}
          <div className="lg:col-span-4" id="contact">
            <LeadInquiryForm property={property} />
          </div>
        </div>

        {/* Similar Properties */}
        <SimilarProperties propertyId={property.id} />
      </div>
    </>
  );
}
