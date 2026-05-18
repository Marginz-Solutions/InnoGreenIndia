"use client";

import React, { useState } from "react";
import {
    X, Phone, MapPin, Leaf, Clock, Tag, User,
    CheckCircle, XCircle, Loader2, ChevronRight,
} from "lucide-react";
import type { SmartEnquiryResponse } from "./page";
import { api } from "@/lib/axiosInstance";

// ── Types ──────────────────────────────────────────────────────────────────────

type Enquiry = SmartEnquiryResponse["data"][number];

export interface SmartEnquiryDrawerProps {
    enquiry: Enquiry | null;
    onClose: () => void;
    /** Called after a successful status update so the parent can refresh its list */
    onStatusChange?: (id: string, status: "reviewed" | "closed") => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "Just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d}d ago`;
    return `${Math.floor(d / 30)}mo ago`;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// ── Sub-components ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { pill: string; dot: string; label: string }> = {
    new: { pill: "bg-[#EAF3DE] text-[#2d5a27] border-[#c2ddb5]", dot: "bg-[#4a8f42]", label: "New" },
    reviewed: { pill: "bg-[#E6F1FB] text-[#185FA5] border-[#b3d4f5]", dot: "bg-[#185FA5]", label: "Reviewed" },
    closed: { pill: "bg-gray-100  text-gray-500  border-gray-200", dot: "bg-gray-400", label: "Closed" },
};

const SENDER_COLORS: Record<string, string> = {
    "Farmer": "bg-amber-50  text-amber-700  border-amber-200",
    "Dealer": "bg-blue-50   text-blue-700   border-blue-200",
    "Consultant/Other": "bg-purple-50 text-purple-700 border-purple-200",
};

function StatusBadge({ status }: { status: string }) {
    const s = STATUS_STYLES[status] ?? STATUS_STYLES.new;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${s.pill}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {s.label}
        </span>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
            <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5 text-sm text-gray-800">
                {children}
            </div>
        </div>
    );
}

function Divider() {
    return <div className="h-px bg-gray-100 my-1" />;
}

// ── Main Drawer ────────────────────────────────────────────────────────────────

export default function SmartEnquiryDrawer({
    enquiry,
    onClose,
    onStatusChange,
}: SmartEnquiryDrawerProps) {
    const [actionLoading, setActionLoading] = useState<"reviewed" | "closed" | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!enquiry) return null;

    const isTerminal = enquiry.status === "reviewed" || enquiry.status === "closed";

    // ── API call ─────────────────────────────────────────────────────────────────

    const handleStatusUpdate = async (status: "reviewed" | "closed") => {
        setActionLoading(status);
        setError(null);

        try {
            await api.patch("/smart-enquiries", {
                id: enquiry.id,
                status,
            });

            onStatusChange?.(enquiry.id, status);
            onClose();
        } catch (err: any) {
            setError(err?.message || "Something went wrong. Please try again.");

            if (err?.details) {
                console.error("Details:", err.details);
            }
        } finally {
            setActionLoading(null);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────────

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer panel */}
            <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl bg-white shadow-2xl max-h-[92vh]
        md:inset-x-auto md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-[26rem]
        md:max-h-full md:rounded-none md:rounded-l-3xl">

                {/* ── Header ── */}
                <div className="shrink-0 px-5 pt-4 pb-3 md:px-6 md:pt-5 border-b border-gray-100">
                    {/* Mobile drag handle */}
                    <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200 md:hidden" />

                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-base font-semibold text-gray-900 leading-tight truncate">{enquiry.need}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{enquiry.categories?.name ?? "—"}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <StatusBadge status={enquiry.status ?? "new"} />
                            <button
                                onClick={onClose}
                                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Scrollable body ── */}
                <div className="flex-1 overflow-y-auto px-5 py-4 md:px-6 space-y-3">

                    {/* Sender + time */}
                    <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border
              ${SENDER_COLORS[enquiry.senderType] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
                            <User size={10} className="mr-1" />
                            {enquiry.senderType}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                            <Clock size={11} />
                            {timeAgo(enquiry.createdAt ?? new Date().toISOString())}
                        </span>
                    </div>

                    <Divider />

                    {/* Contact */}
                    <Field label="Mobile">
                        <a href={`tel:${enquiry.mobileNo}`}
                            className="flex items-center justify-between text-[#2d5a27] font-medium hover:underline">
                            <span className="flex items-center gap-1.5"><Phone size={13} />{enquiry.mobileNo}</span>
                            <span className="text-[10px] font-semibold bg-[#EAF3DE] text-[#2d5a27] px-2.5 py-1 rounded-full">
                                Call
                            </span>
                        </a>
                    </Field>

                    {/* Location */}
                    <Field label="District">
                        <span className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-gray-400" />
                            {enquiry.district}
                        </span>
                    </Field>

                    <Divider />

                    {/* Category + Brand */}
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Category">
                            <span className="flex items-center gap-1.5">
                                <Tag size={12} className="text-gray-400" />
                                {enquiry.categories?.name ?? "—"}
                            </span>
                        </Field>
                        <Field label="Brand">
                            {enquiry.brands?.name ?? <span className="italic text-gray-400">—</span>}
                        </Field>
                    </div>

                    {/* Crop info */}
                    {(enquiry.crop || enquiry.cropStage) && (
                        <Field label="Crop">
                            <span className="flex items-center gap-1.5">
                                <Leaf size={12} className="text-green-500" />
                                {enquiry.crop}
                                {enquiry.cropStage && (
                                    <span className="ml-1 text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                        {enquiry.cropStage}
                                    </span>
                                )}
                            </span>
                        </Field>
                    )}

                    <Divider />

                    {/* Message */}
                    {enquiry.message && (
                        <Field label="Message">
                            <p className="text-gray-600 leading-relaxed text-xs whitespace-pre-wrap">{enquiry.message}</p>
                        </Field>
                    )}

                    {/* Submitted at */}
                    <Field label="Submitted">
                        <span className="text-gray-500 text-xs">
                            {formatDate(enquiry.createdAt ?? new Date().toISOString())}
                        </span>
                    </Field>

                    {/* Error */}
                    {error && (
                        <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 text-xs text-red-600">
                            {error}
                        </div>
                    )}
                </div>

                {/* ── Footer actions ── */}
                {!isTerminal && (
                    <div className="shrink-0 border-t border-gray-100 px-5 py-4 md:px-6 md:py-5 space-y-2">
                        {/* Mark as Reviewed */}
                        <button
                            onClick={() => handleStatusUpdate("reviewed")}
                            disabled={!!actionLoading}
                            className="w-full flex items-center justify-center gap-2 rounded-full bg-[#2d5a27]
                py-2.5 text-sm font-medium text-white hover:bg-[#234820] transition
                disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none"
                        >
                            {actionLoading === "reviewed"
                                ? <Loader2 size={15} className="animate-spin" />
                                : <CheckCircle size={15} />}
                            Mark as Reviewed
                        </button>

                        {/* Close enquiry */}
                        <button
                            onClick={() => handleStatusUpdate("closed")}
                            disabled={!!actionLoading}
                            className="w-full flex items-center justify-center gap-2 rounded-full
                border border-gray-200 py-2.5 text-sm font-medium text-gray-600
                hover:bg-gray-50 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {actionLoading === "closed"
                                ? <Loader2 size={15} className="animate-spin" />
                                : <XCircle size={15} className="text-gray-400" />}
                            Close Enquiry
                        </button>
                    </div>
                )}

                {/* Already actioned footer */}
                {isTerminal && (
                    <div className="shrink-0 border-t border-gray-100 px-5 py-4 md:px-6 text-center">
                        <p className="text-xs text-gray-400">
                            This enquiry has been{" "}
                            <span className="font-semibold text-gray-600">{enquiry.status}</span> and cannot be
                            actioned further.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}