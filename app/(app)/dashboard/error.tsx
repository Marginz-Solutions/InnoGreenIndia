"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ChevronLeft } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[ProductsDashboard] Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen p-6 font-sans space-y-5">

      {/* Page header — mirrors real page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Overview of products, brands, dealers and categories
          </p>
        </div>
      </div>

      {/* KPI row — ghosted to preserve layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: "📦", label: "Total Products" },
          { icon: "🏷️", label: "Brands" },
          { icon: "🗂️", label: "Categories" },
          { icon: "⭐", label: "Featured" },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex items-start justify-between gap-3 opacity-40"
          >
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">
                {k.label}
              </p>
              <p className="text-3xl font-semibold text-gray-200 leading-none">—</p>
            </div>
            <span className="text-2xl grayscale opacity-50">{k.icon}</span>
          </div>
        ))}
      </div>

      {/* Error card */}
      <div className="max-w-[520px]">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

          {/* Accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-red-400 via-orange-400 to-amber-300" />

          <div className="p-7">
            {/* Icon + message */}
            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-red-50 shrink-0 mt-0.5">
                <AlertTriangle size={18} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-gray-900 mb-1">
                  Failed to load dashboard
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Something went wrong while fetching products, brands, and
                  category data. This is usually temporary — try again or go
                  back.
                </p>
              </div>
            </div>

            {/* Error detail */}
            {(error?.message || error?.digest) && (
              <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 mb-6 font-mono text-xs text-gray-500 space-y-1">
                {error.message && (
                  <p className="truncate">
                    <span className="text-gray-400">message: </span>
                    {error.message}
                  </p>
                )}
                {error.digest && (
                  <p>
                    <span className="text-gray-400">digest: </span>
                    {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-full bg-[#2d5a27] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#234820] transition cursor-pointer border-none"
              >
                <RefreshCw size={14} />
                Try again
              </button>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition cursor-pointer"
              >
                <ChevronLeft size={14} />
                Go back
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-400 px-1">
          If this keeps happening, check the server logs or contact your system
          administrator.
        </p>
      </div>
    </div>
  );
}