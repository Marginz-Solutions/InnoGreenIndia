"use client";

import { useState } from "react";
import EnquiriesClient from "./EnquiriesClient";
import ReviewedDealersClient from "./ReviewedClient";
import type { Enquiry, Dealer } from "./types";
import { Breadcrumb } from "@/components/website-customization/shared/Breadcrumb";

type Tab = "enquiries" | "reviewed";

type DealerForm = {
    firmName: string;
    gstNumber: string;
    mobileNo: string;
    district: string;
    categoryInterest: string;
    monthlyVolume: string;
};

const emptyForm: DealerForm = {
    firmName: "",
    gstNumber: "",
    mobileNo: "",
    district: "",
    categoryInterest: "",
    monthlyVolume: "",
};

export default function DealersHubClient({
    enquiries,
    dealers,
}: {
    enquiries: Enquiry[];
    dealers: Dealer[];
}) {
    const [tab, setTab] = useState<Tab>("enquiries");
    const [fetchedEnquiries, setFetchedEnquiries] = useState<Enquiry[]>(enquiries);
    const [fetchedDealers, setFetchedDealers] = useState<Dealer[]>(dealers);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState<DealerForm>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        const res = await fetch("/api/v1/dealers/requests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, status: "new" }),
        });

        const result = await res.json(); // 👈 IMPORTANT

        console.log("API response:", result); // Debug log

        setFetchedEnquiries((prev) => [...prev, result.data]);
    

        setSaving(false);

        if (!res.ok) {
            const { error } = await res.json();
            setError(error ?? "Something went wrong");
            return;
        }

        setModalOpen(false);
        setForm(emptyForm);
    };

    const closeModal = () => {
        setModalOpen(false);
        setForm(emptyForm);
        setError(null);
    };

    return (
        <div className="min-h-screen font-sans relative">
            <Breadcrumb section="Dealers" />

            {/* Tab bar */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 pt-4">
                <div className="flex items-center gap-1">
                    {/* Enquiries tab */}
                    <button
                        onClick={() => setTab("enquiries")}
                        className={`relative pb-3 px-4 text-sm font-medium transition-colors ${tab === "enquiries" ? "text-[#2d5a27]" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        New Enquiries
                        <span className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${tab === "enquiries" ? "bg-[#EAF3DE] text-[#2d5a27]" : "bg-gray-100 text-gray-500"
                            }`}>
                            {fetchedEnquiries.filter((e) => e.status === "new").length}
                        </span>
                        {tab === "enquiries" && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#2d5a27]" />
                        )}
                    </button>

                    {/* Reviewed tab */}
                    <button
                        onClick={() => setTab("reviewed")}
                        className={`relative pb-3 px-4 text-sm font-medium transition-colors ${tab === "reviewed" ? "text-[#2d5a27]" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Reviewed Dealers
                        <span className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${tab === "reviewed" ? "bg-[#E6F1FB] text-[#185FA5]" : "bg-gray-100 text-gray-500"
                            }`}>
                            {fetchedDealers.length}
                        </span>
                        {tab === "reviewed" && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#2d5a27]" />
                        )}
                    </button>
                </div>

                {/* Add dealer button */}
                <button
                    onClick={() => setModalOpen(true)}
                    className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#2d5a27] px-4 py-2 text-xs font-medium text-white hover:bg-[#234820] transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Dealer
                </button>
            </div>

            {/* Tab content */}
            {tab === "enquiries" && <EnquiriesClient enquiries={fetchedEnquiries} setEnquiries={setFetchedEnquiries} setFetchedDealers={setFetchedDealers}/>}
            {tab === "reviewed" && <ReviewedDealersClient dealers={fetchedDealers} setFetchedDealers={setFetchedDealers}/>}

            {/* Add Dealer Modal */}
            {modalOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">

                            {/* Modal header */}
                            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">Add Dealer</h2>
                                    <p className="text-xs text-gray-400 mt-0.5">Fill in the dealer details below</p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                                    aria-label="Close"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                <div className="px-6 py-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">

                                    {/* Firm Name */}
                                    <div>
                                        <label className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1 block">
                                            Firm Name <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            name="firmName"
                                            value={form.firmName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Firm / Shop"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27]"
                                        />
                                    </div>

                                    {/* GST Number */}
                                    <div>
                                        <label className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1 block">
                                            GST Number
                                        </label>
                                        <input
                                            name="gstNumber"
                                            value={form.gstNumber}
                                            onChange={handleChange}
                                            placeholder="GST"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-mono text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27]"
                                        />
                                    </div>

                                    {/* Mobile No */}
                                    <div>
                                        <label className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1 block">
                                            Mobile No <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            name="mobileNo"
                                            value={form.mobileNo}
                                            onChange={handleChange}
                                            required
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27]"
                                        />
                                    </div>

                                    {/* District */}
                                    <div>
                                        <label className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1 block">
                                            District <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            name="district"
                                            value={form.district}
                                            onChange={handleChange}
                                            required
                                            placeholder="District"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27]"
                                        />
                                    </div>

                                    {/* Category Interest */}
                                    <div>
                                        <label className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1 block">
                                            Category Interest <span className="text-red-400">*</span>
                                        </label>
                                        <select
                                            name="categoryInterest"
                                            value={form.categoryInterest}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27]"
                                        >
                                            <option value="" disabled>Select category</option>
                                            <option>Water-Soluble Fertilizers</option>
                                            <option>Micronutrients</option>
                                            <option>Bio-Stimulants</option>
                                            <option>Crop Protection</option>
                                        </select>
                                    </div>

                                    {/* Monthly Volume */}
                                    <div>
                                        <label className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1 block">
                                            Monthly Volume <span className="text-gray-300">(optional)</span>
                                        </label>
                                        <input
                                            name="monthlyVolume"
                                            value={form.monthlyVolume}
                                            onChange={handleChange}
                                            placeholder="Approx. movement"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27]"
                                        />
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                                            {error}
                                        </p>
                                    )}
                                </div>

                                {/* Footer actions */}
                                <div className="px-6 py-4 border-t border-gray-100 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 rounded-full border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 rounded-full bg-[#2d5a27] py-2.5 text-sm font-medium text-white hover:bg-[#234820] transition disabled:opacity-60 flex items-center justify-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                                Saving…
                                            </>
                                        ) : "Add Dealer"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}