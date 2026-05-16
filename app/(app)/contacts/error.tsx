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
    // Log to your error reporting service if needed
    console.error("[AdminContact] Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen">
      <Breadcrumb section="Contact" />

      <main className="max-w-[1280px] mx-auto px-7 py-10 pb-20">

        {/* PAGE HERO — mirrors real page header spacing */}
        <div className="mb-9">
          <p className="text-sm text-gray-400 leading-relaxed">
            Manage GPS coordinates, communication channels, and operational
            parameters for this command node.
          </p>
        </div>

        {/* Error card */}
        <div className="max-w-[540px]">
          <div className="bg-white border border-black/[0.08] rounded-[18px] overflow-hidden">

            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[#D85A30] via-[#e07a58] to-[#f0a080]" />

            <div className="p-8">
              {/* Icon + title */}
              <div className="flex items-start gap-4 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FAECE7] shrink-0 mt-0.5">
                  <AlertTriangle size={18} className="text-[#D85A30]" />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900 mb-1">
                    Failed to load contact data
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Something went wrong while fetching this page. This is
                    usually a temporary issue — try again or go back.
                  </p>
                </div>
              </div>

              {/* Error detail box */}
              {(error?.message || error?.digest) && (
                <div className="bg-gray-50 border border-black/[0.07] rounded-xl px-4 py-3 mb-6 font-mono text-xs text-gray-500 space-y-1">
                  {error.message && (
                    <p className="truncate">
                      <span className="text-gray-400">message: </span>
                      {error.message}
                    </p>
                  )}
                  {error.digest && (
                    <p>
                      <span className="text-gray-400">digest:&nbsp;</span>
                      {error.digest}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors cursor-pointer border-none"
                >
                  <RefreshCw size={14} />
                  Try again
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl bg-white text-gray-600 border border-black/[0.12] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={14} />
                  Go back
                </button>
              </div>
            </div>
          </div>

          {/* Soft hint below card */}
          <p className="mt-4 text-xs text-gray-400 font-mono px-1">
            If this keeps happening, check the server logs or contact your
            system administrator.
          </p>
        </div>

      </main>
    </div>
  );
}