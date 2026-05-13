"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export type Enquiry = {
    id: number;
    firmName: string;
    gstNumber: string;
    mobileNo: string;
    district: string;
    categoryInterest: string;
    monthlyVolume?: string;
    submittedAt: string;
    status: "new" | "reviewed" | "closed";
};

const mockEnquiries: Enquiry[] = [
    {
        id: 1,
        firmName: "Agro Inputs Pvt Ltd",
        gstNumber: "33AABCA1234A1Z5",
        mobileNo: "+91 98401 12345",
        district: "Coimbatore",
        categoryInterest: "Water-Soluble Fertilizers",
        monthlyVolume: "18 MT",
        submittedAt: "Today, 10:21 AM",
        status: "new",
    },
    {
        id: 2,
        firmName: "Krishnam Agro Center",
        gstNumber: "32XYZAB9900C3Z1",
        mobileNo: "+91 94470 67890",
        district: "Thrissur",
        categoryInterest: "Water-Soluble Fertilizers",
        submittedAt: "Today, 08:44 AM",
        status: "new",
    },
    {
        id: 3,
        firmName: "Pioneer Seeds Hub",
        gstNumber: "36DEFGH1122F6Z7",
        mobileNo: "+91 91234 55678",
        district: "Hyderabad",
        categoryInterest: "Crop Protection",
        monthlyVolume: "5 MT",
        submittedAt: "Yesterday, 4:10 PM",
        status: "new",
    },
];

export default function EnquiriesClient({ enquiries1 }: { enquiries1: Enquiry[] }) {
    const [enquiries, setEnquiries] = useState<Enquiry[]>(enquiries1);
    const [selected, setSelected] = useState<Enquiry | null>(null);
    const supabase = createClient();

    const markAs = async (id: number, status: Enquiry["status"]) => {
        // Optimistic update
        setEnquiries((prev) =>
            prev.map((e) => (e.id === id ? { ...e, status } : e))
        );

        const res = await fetch("/api/v1/dealers/requests", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
        });

        if (!res.ok) {
            // Revert optimistic update on failure
            const { error } = await res.json();
            console.error("Update failed:", error);
            setEnquiries((prev) =>
                prev.map((e) => (e.id === id ? { ...e, status: "new" } : e))
            );
            return;
        }

        // Remove reviewed entries from the list
        setEnquiries((prev) => prev.filter((e) => e.status !== "reviewed"));
        setSelected(null);
    };

    return (
        <div className="min-h-screen bg-[#f5f5f0] p-6 font-sans">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">New Enquiries</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {enquiries?.length} unreviewed submission
                        {enquiries?.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF3DE] px-3 py-1 text-xs font-medium text-[#3B6D11]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3B6D11]" />
                    {enquiries?.filter(e => e.status === "new").length} New
                </span>
            </div>

            {/* Empty state */}
            {enquiries?.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
                    <div className="mb-3 text-4xl">📭</div>
                    <p className="text-sm font-medium text-gray-700">All caught up!</p>
                    <p className="text-xs text-gray-400 mt-1">No new enquiries at the moment.</p>
                </div>
            )}

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5 ms-10 me-10 xl:grid-cols-3">
                {enquiries?.map((enquiry) => (
                    <div
                        key={enquiry.id}
                        onClick={() => setSelected(enquiry)}
                        className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-gray-300"
                    >
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    {enquiry.firmName}
                                </p>
                                <p className="text-xs font-mono text-gray-400 mt-0.5">
                                    GST No.: {enquiry.gstNumber}
                                </p>
                            </div>
                            <span className="shrink-0 rounded-full bg-[#EAF3DE] px-2.5 py-1 text-[11px] font-medium text-[#3B6D11]">
                                {enquiry.status}
                            </span>
                        </div>

                        {/* Fields grid */}
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs mb-4">
                            <div>
                                <p className="text-gray-400 uppercase tracking-wide text-[10px] font-medium mb-0.5">
                                    District
                                </p>
                                <p className="text-gray-700">{enquiry.district}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 uppercase tracking-wide text-[10px] font-medium mb-0.5">
                                    Mobile No
                                </p>
                                <a
                                    href={`tel:${enquiry.mobileNo}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[#2d5a27] font-medium hover:underline"
                                >
                                    {enquiry.mobileNo}
                                </a>
                            </div>
                            <div>
                                <p className="text-gray-400 uppercase tracking-wide text-[10px] font-medium mb-0.5">
                                    Monthly Volume
                                </p>
                                <p className="text-gray-700">
                                    {enquiry.monthlyVolume ?? (
                                        <span className="italic text-gray-300">Not provided</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Category tag */}
                        <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200">
                                🌿 {enquiry.categoryInterest}
                            </span>
                            <p className="text-[11px] text-gray-400">{enquiry.submittedAt}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Drawer */}
            {selected && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                        onClick={() => setSelected(null)}
                    />

                    {/* Panel */}
                    <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white px-5 pt-5 pb-8 shadow-2xl md:bottom-auto md:right-0 md:top-0 md:left-auto md:h-full md:w-120 md:rounded-none md:rounded-l-3xl md:px-6 md:pt-6 md:pb-10">
                        {/* Handle */}
                        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 md:hidden" />

                        {/* Drawer header */}
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-semibold text-gray-900">
                                {selected.firmName}
                            </h2>
                            <button
                                onClick={() => setSelected(null)}
                                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Fields */}
                        <div className="flex flex-col gap-4">
                            {[
                                { label: "Firm Name", value: selected.firmName },
                                { label: "GST Number", value: selected.gstNumber, mono: true },
                                { label: "Mobile No", value: selected.mobileNo, mono: true, phone: true },
                                { label: "District", value: selected.district },
                                {
                                    label: "Category Interest",
                                    value: selected.categoryInterest,
                                },
                                {
                                    label: "Monthly Volume (optional)",
                                    value: selected.monthlyVolume ?? "Not provided",
                                    muted: !selected.monthlyVolume,
                                },
                            ].map(({ label, value, mono, muted, phone }) => (
                                <div key={label}>
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1">
                                        {label}
                                    </p>
                                    <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5 flex items-center justify-between">
                                        <p
                                            className={`text-sm ${mono ? "font-mono" : ""} ${muted ? "italic text-gray-300" : "text-gray-800"
                                                }`}
                                        >
                                            {value}
                                        </p>
                                        {phone && (
                                            <a
                                                href={`tel:${value}`}
                                                className="ml-2 shrink-0 rounded-full bg-[#EAF3DE] px-2.5 py-1 text-[11px] font-medium text-[#3B6D11] hover:bg-[#d4ebbc] transition"
                                            >
                                                Call
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="text-[11px] text-gray-400 mt-4">
                            Submitted: {selected.submittedAt}
                        </p>

                        {/* Actions */}
                        <div className="mt-6 flex gap-2">
                            <button
                                onClick={() => markAs(selected.id, "reviewed")}
                                className="flex-1 rounded-full bg-[#2d5a27] py-2.5 text-sm font-medium text-white hover:bg-[#234820] transition"
                            >
                                Mark as Reviewed
                            </button>
                            {selected.status === "new" && (
                                <button
                                    onClick={() => markAs(selected.id, "closed")}
                                    className="flex-1 rounded-full border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel request
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}