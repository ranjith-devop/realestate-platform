"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[40vh] flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-extrabold text-gray-900">
              Something went wrong
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              {this.state.error?.message || "An unexpected error occurred. Please refresh the page or go back home."}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
              <a
                href="/"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Go Home</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
