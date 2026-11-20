import Link from "next/link";
import { Home, Search, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
          <AlertTriangle className="w-10 h-10" />
        </div>

        {/* 404 */}
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-1">
            Error 404
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed max-w-sm mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. It may also be a property listing that was sold or removed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>
          <Link
            href="/properties"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Browse Properties</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
