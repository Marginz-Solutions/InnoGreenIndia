"use client";

import { useEffect } from "react";

import { Breadcrumb } from "@/components/website-customization/shared/Breadcrumb";
import PageError from "@/components/PageError";
import { ErrorProps } from "@/lib/global.types";

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

      <PageError 
        error={error}
        reset={reset}
        heading="Failed to load dealers"
        description="Something went wrong while fetching enquiries and dealer data. This is usually temporary — try again or go back."
      />
    </div>
  );
}