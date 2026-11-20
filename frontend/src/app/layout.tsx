import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { ErrorBoundary } from "../components/ErrorBoundary";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | PropNest - Zero Brokerage Real Estate",
    default: "PropNest - Buy, Rent, Sell Residential & Commercial Properties in India",
  },
  description:
    "Explore 50,000+ verified real estate listings with zero brokerage. Find apartments, villas, plots, and commercial spaces across Bangalore, Mumbai, Delhi-NCR, Hyderabad, and Pune.",
  keywords: [
    "real estate india",
    "zero brokerage flats",
    "99acres alternative",
    "nobroker alternative",
    "buy apartments bangalore",
    "rent flats mumbai",
    "luxury villas gurgaon",
  ],
  authors: [{ name: "PropNest Real Estate" }],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <AuthProvider>
          <div className="min-h-screen flex flex-col justify-between">
            <Navbar />
            <main className="flex-1">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
