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
  User,
  Phone,
  AlertCircle,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole =
    (searchParams.get("role") as "BUYER" | "OWNER" | "AGENT") || "BUYER";

  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"BUYER" | "OWNER" | "AGENT">(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field-level error messages
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validateField = (
    field: "name" | "email" | "phone" | "password" | "confirmPassword",
    val: string
  ) => {
    const errs = { ...fieldErrors };
    if (field === "name") {
      if (!val.trim()) {
        errs.name = "Full name is required.";
      } else if (val.trim().length < 2) {
        errs.name = "Name must be at least 2 characters long.";
      } else {
        delete errs.name;
      }
    }
    if (field === "email") {
      if (!val.trim()) {
        errs.email = "Email address is required.";
      } else if (!Validation.isValidEmail(val)) {
        errs.email = "Please enter a valid email address.";
      } else {
        delete errs.email;
      }
    }
    if (field === "phone") {
      if (val.trim() && !Validation.isValidPhone(val)) {
        errs.phone = "Please enter a valid 10-15 digit mobile number.";
      } else {
        delete errs.phone;
      }
    }
    if (field === "password") {
      if (!val) {
        errs.password = "Password is required.";
      } else if (val.length < 6) {
        errs.password = "Password must be at least 6 characters long.";
      } else {
        delete errs.password;
      }
      if (confirmPassword && val !== confirmPassword) {
        errs.confirmPassword = "Passwords do not match.";
      } else if (confirmPassword && val === confirmPassword) {
        delete errs.confirmPassword;
      }
    }
    if (field === "confirmPassword") {
      if (!val) {
        errs.confirmPassword = "Please confirm your password.";
      } else if (val !== password) {
        errs.confirmPassword = "Passwords do not match.";
      } else {
        delete errs.confirmPassword;
      }
    }
    setFieldErrors(errs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const errs: {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      errs.name = "Full name is required.";
    } else if (name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters long.";
    }

    if (!email.trim()) {
      errs.email = "Email address is required.";
    } else if (!Validation.isValidEmail(email)) {
      errs.email = "Please enter a valid email address.";
    }

    if (phone.trim() && !Validation.isValidPhone(phone)) {
      errs.phone = "Please enter a valid 10-15 digit mobile number.";
    }

    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters long.";
    }

    if (!confirmPassword) {
      errs.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      errs.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    try {
      setSubmitting(true);
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        role,
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs text-gray-500">
            Join thousands of property owners, buyers, and tenants
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Role selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              I want to:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Buy / Rent", val: "BUYER" },
                { label: "List Property", val: "OWNER" },
                { label: "Real Estate Agent", val: "AGENT" },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setRole(item.val as any)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                    role === item.val
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Rahul Sharma"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) validateField("name", e.target.value);
                }}
                onBlur={(e) => validateField("name", e.target.value)}
                className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all ${
                  fieldErrors.name
                    ? "bg-red-50/50 border-2 border-red-400 focus:bg-white focus:ring-2 focus:ring-red-400 text-red-900"
                    : "bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 text-gray-800"
                }`}
              />
            </div>
            {fieldErrors.name && (
              <p className="text-[11px] font-semibold text-red-600 mt-1">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="email"
                placeholder="rahul@example.com"
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
              <p className="text-[11px] font-semibold text-red-600 mt-1">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Mobile Number (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (fieldErrors.phone) validateField("phone", e.target.value);
                }}
                onBlur={(e) => validateField("phone", e.target.value)}
                className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all ${
                  fieldErrors.phone
                    ? "bg-red-50/50 border-2 border-red-400 focus:bg-white focus:ring-2 focus:ring-red-400 text-red-900"
                    : "bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 text-gray-800"
                }`}
              />
            </div>
            {fieldErrors.phone && (
              <p className="text-[11px] font-semibold text-red-600 mt-1">
                {fieldErrors.phone}
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
                placeholder="At least 6 characters"
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
              <p className="text-[11px] font-semibold text-red-600 mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword)
                    validateField("confirmPassword", e.target.value);
                }}
                onBlur={(e) => validateField("confirmPassword", e.target.value)}
                className={`w-full pl-9 pr-10 py-2.5 text-sm rounded-xl outline-none transition-all ${
                  fieldErrors.confirmPassword
                    ? "bg-red-50/50 border-2 border-red-400 focus:bg-white focus:ring-2 focus:ring-red-400 text-red-900"
                    : "bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 text-gray-800"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-[11px] font-semibold text-red-600 mt-1">
                {fieldErrors.confirmPassword}
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
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-blue-600 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading...</div>}>
      <RegisterFormContent />
    </Suspense>
  );
}
