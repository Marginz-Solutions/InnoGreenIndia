"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ChevronLeft } from "lucide-react";
import { Breadcrumb } from "@/components/website-customization/shared/Breadcrumb";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[DealersHub] Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen font-sans">
      <Breadcrumb section="Dealers" />

      {/* Tab bar shell — keeps chrome consistent with real page */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 pt-4 flex-wrap gap-y-2">
        <div className="flex items-center gap-1">
          {["New Enquiries", "Reviewed Dealers"].map((label, i) => (
            <div
              key={label}
              className={`relative px-4 pb-3 text-sm font-medium ${
                i === 0 ? "text-[#2d5a27]" : "text-gray-400"
              }`}
            >
              {label}
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#2d5a27]" />
              )}
            </div>
          ))}
        </div>
        <button
          disabled
          className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#2d5a27]/30 px-4 py-2 text-xs font-medium text-white cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Dealer
        </button>
      </div>

      {/* Error card */}
      <div className="p-6">
        <div className="max-w-[500px]">
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
                    Failed to load dealers
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Something went wrong while fetching enquiries and dealer
                    data. This is usually temporary — try again or go back.
                  </p>
                </div>
              </div>

              {/* Error detail box */}
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
            If this keeps happening, check the server logs or contact your
            system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}