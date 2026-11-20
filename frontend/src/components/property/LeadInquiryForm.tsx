"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Property } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { Validation } from "../../lib/validation";
import {
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  ShieldCheck,
  UserCheck,
  Phone,
  Lock,
} from "lucide-react";

interface LeadInquiryFormProps {
  property: Property;
}

export const LeadInquiryForm: React.FC<LeadInquiryFormProps> = ({
  property,
}) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Hi, I am interested in "${property.title}". Please share visit details and availability.`,
    website: "", // Honeypot
  });

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  }>({});

  // Sync form with logged-in user data once auth resolves
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required.";
        if (!Validation.isValidName(value)) return "Name must be at least 2 characters.";
        return undefined;
      case "email":
        if (!value.trim()) return "Email address is required.";
        if (!Validation.isValidEmail(value)) return "Enter a valid email address.";
        return undefined;
      case "phone":
        if (!value.trim()) return "Mobile number is required.";
        if (!Validation.isValidPhone(value)) return "Enter a valid 10-15 digit mobile number.";
        return undefined;
      case "message":
        if (!value.trim()) return "Message cannot be empty.";
        if (value.trim().length < 10) return "Message must be at least 10 characters.";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (errorMessage) setErrorMessage(null);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setFieldErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const errors: {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    } = {};

    const nameErr = validateField("name", formData.name);
    if (nameErr) errors.name = nameErr;

    const emailErr = validateField("email", formData.email);
    if (emailErr) errors.email = emailErr;

    const phoneErr = validateField("phone", formData.phone);
    if (phoneErr) errors.phone = phoneErr;

    const msgErr = validateField("message", formData.message);
    if (msgErr) errors.message = msgErr;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage("Please fix the errors below before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      await api.submitLead({
        propertyId: property.id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        website: formData.website,
      });
      setSuccess(true);
      setFieldErrors({});
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to submit inquiry.";
      setErrorMessage(
        msg.includes("401") || msg.includes("Authentication")
          ? "Please sign in to send an inquiry to this owner."
          : msg
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-24">
      {/* Header */}
      <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Brokerage Contact</span>
          </span>
          <h3 className="text-lg font-extrabold text-gray-900 mt-0.5">
            Contact Property Owner
          </h3>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
          <UserCheck className="w-5 h-5" />
        </div>
      </div>

      {/* Owner Info Badge */}
      <div className="bg-gray-50 rounded-xl p-3 my-4 flex items-center justify-between text-xs">
        <div>
          <p className="font-bold text-gray-800">
            {property.owner?.name || "Verified Property Owner"}
          </p>
          <p className="text-gray-500 capitalize">
            Role: {property.owner?.role?.toLowerCase() ?? "owner"}
          </p>
        </div>
        <div className="flex items-center space-x-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
          <Phone className="w-3 h-3" />
          <span>Phone Verified</span>
        </div>
      </div>

      {/* Success State */}
      {success ? (
        <div className="py-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-gray-900 text-base">
            Inquiry Sent Successfully!
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
            The owner has received your contact details and will reach out to
            you shortly.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setErrorMessage(null);
            }}
            className="text-xs font-semibold text-blue-600 hover:underline pt-2 inline-block"
          >
            Send another message
          </button>
        </div>
      ) : authLoading ? (
        // Loading state — don't flash form before auth is resolved
        <div className="py-8 flex items-center justify-center">
          <Clock className="w-5 h-5 text-gray-400 animate-spin" />
        </div>
      ) : !isAuthenticated ? (
        /* Guest Mode: Require login/signup to contact owner */
        <div className="py-6 px-4 bg-gradient-to-b from-blue-50/60 to-white rounded-2xl border border-blue-100 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-gray-900 text-base">
              Sign In to Contact Owner
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
              Please sign in or create a free account to view verified owner contact details and send direct zero-brokerage inquiries.
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <Link
              href={`/login?redirect=/properties/${property.id}`}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <span>Sign In to Continue</span>
            </Link>
            <Link
              href={`/register?redirect=/properties/${property.id}&role=BUYER`}
              className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center space-x-2"
            >
              <span>Create Free Account</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-3 text-[11px] text-gray-400">
            <span>• 100% Free Contact</span>
            <span>• Direct Owner Phone</span>
          </div>
        </div>
      ) : user && property.ownerId === user.id ? (
        /* Owner viewing their own property */
        <div className="py-6 px-4 bg-gray-50 rounded-2xl border border-gray-200 text-center space-y-3">
          <p className="text-xs font-bold text-gray-800">You are the owner of this listing</p>
          <p className="text-xs text-gray-500">View inquiries or make updates to your listing.</p>
          <Link
            href={`/properties/${property.id}/edit`}
            className="inline-block py-2.5 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
          >
            Edit This Listing
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Honeypot */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700">
                Your Name *
              </label>
              {fieldErrors.name && (
                <span className="text-[11px] text-red-600 font-medium">
                  {fieldErrors.name}
                </span>
              )}
            </div>
            <input
              type="text"
              name="name"
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl outline-none transition-colors ${
                fieldErrors.name
                  ? "bg-red-50/50 border-2 border-red-400 text-red-900 focus:border-red-500"
                  : "bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"
              }`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700">
                Email Address *
              </label>
              {fieldErrors.email && (
                <span className="text-[11px] text-red-600 font-medium">
                  {fieldErrors.email}
                </span>
              )}
            </div>
            <input
              type="email"
              name="email"
              placeholder="rahul@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl outline-none transition-colors ${
                fieldErrors.email
                  ? "bg-red-50/50 border-2 border-red-400 text-red-900 focus:border-red-500"
                  : "bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"
              }`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700">
                Mobile Number *
              </label>
              {fieldErrors.phone && (
                <span className="text-[11px] text-red-600 font-medium">
                  {fieldErrors.phone}
                </span>
              )}
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl outline-none transition-colors ${
                fieldErrors.phone
                  ? "bg-red-50/50 border-2 border-red-400 text-red-900 focus:border-red-500"
                  : "bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"
              }`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700">
                Message *
              </label>
              {fieldErrors.message && (
                <span className="text-[11px] text-red-600 font-medium">
                  {fieldErrors.message}
                </span>
              )}
            </div>
            <textarea
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl outline-none resize-none transition-colors ${
                fieldErrors.message
                  ? "bg-red-50/50 border-2 border-red-400 text-red-900 focus:border-red-500"
                  : "bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"
              }`}
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry to Owner</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-gray-400 text-center leading-relaxed">
            Protected by anti-spam rate limiting &amp; duplicate detection.
          </p>
        </form>
      )}
    </div>
  );
};
