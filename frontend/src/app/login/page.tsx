"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Validation } from "../../lib/validation";
import {
  Building2,
  Lock,
  Mail,
  AlertCircle,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Field-level error messages
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Live validate on blur
  const validateField = (field: "email" | "password", value: string) => {
    const errs = { ...fieldErrors };
    if (field === "email") {
      if (!value.trim()) {
        errs.email = "Email address is required.";
      } else if (!Validation.isValidEmail(value)) {
        errs.email = "Please enter a valid email address (e.g. name@example.com).";
      } else {
        delete errs.email;
      }
    }
    if (field === "password") {
      if (!value) {
        errs.password = "Password is required.";
      } else if (value.length < 6) {
        errs.password = "Password must be at least 6 characters long.";
      } else {
        delete errs.password;
      }
    }
    setFieldErrors(errs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Run complete validation
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errs.email = "Email address is required.";
    } else if (!Validation.isValidEmail(email)) {
      errs.email = "Please enter a valid email address (e.g. name@example.com).";
    }

    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters long.";
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    try {
      setSubmitting(true);
      await login({ email: email.trim(), password });
      router.push(redirect);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid email or password. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Password@123");
    setFieldErrors({});
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Sign In to PropNest
          </h1>
          <p className="text-xs text-gray-500">
            Access your property listings, inquiries, and saved favorites
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) validateField("email", e.target.value);
                }}
                onBlur={(e) => validateField("email", e.target.value)}
                className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all ${
                  fieldErrors.email
                    ? "bg-red-50/50 border-2 border-red-400 focus:bg-white focus:ring-2 focus:ring-red-400 text-red-900"
                    : "bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 text-gray-800"
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[11px] font-semibold text-red-600 mt-1 flex items-center space-x-1">
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) validateField("password", e.target.value);
                }}
                onBlur={(e) => validateField("password", e.target.value)}
                className={`w-full pl-9 pr-10 py-2.5 text-sm rounded-xl outline-none transition-all ${
                  fieldErrors.password
                    ? "bg-red-50/50 border-2 border-red-400 focus:bg-white focus:ring-2 focus:ring-red-400 text-red-900"
                    : "bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 text-gray-800"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-[11px] font-semibold text-red-600 mt-1 flex items-center space-x-1">
                <span>{fieldErrors.password}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Demo Fast Fill Buttons */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 text-center">
            Quick 1-Click Demo Logins
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillDemoAccount("owner@realestate.com")}
              className="py-2 px-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 font-semibold text-gray-700 transition-colors"
            >
              Demo Owner
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("buyer@realestate.com")}
              className="py-2 px-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 font-semibold text-gray-700 transition-colors"
            >
              Demo Buyer
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
