"use client";

import React, { useState, useCallback } from "react";
import {
  Phone,
  MapPin,
  Check,
  Edit2,
  X,
  Navigation,
  Mail,
  Globe,
  Clock,
  Users,
  Wifi,
  Save,
  AlertCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Breadcrumb } from "@/components/website-customization/shared/Breadcrumb";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);

/* ─── Fix default Leaflet marker icons ──────────────── */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ─── Map child components ───────────────────────────── */
function ClickHandler({
  isEditing,
  onPinMove,
}: {
  isEditing: boolean;
  onPinMove: (lat: number, lng: number) => void;
}) {
  const { useMapEvents } = require("react-leaflet") as typeof import("react-leaflet");
  useMapEvents({
    click(e: import("leaflet").LeafletMouseEvent) {
      if (isEditing) {
        onPinMove(
          parseFloat(e.latlng.lat.toFixed(6)),
          parseFloat(e.latlng.lng.toFixed(6))
        );
      }
    },
  });
  return null;
}

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const { useMap } = require("react-leaflet") as typeof import("react-leaflet");
  const map = useMap();
  React.useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), { duration: 0.8 });
  }, [lat, lng, map]);
  return null;
}

/* ─── Types ─────────────────────────────────────────── */
interface ContactData {
  phone: string;
  altPhone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  altitude: string;
  accuracy: string;
  operating_hours: string;
  timezone: string;
  commander_name: string;
  commander_contact: string;
}

/* ─── Required fields ────────────────────────────────── */
const REQUIRED_FIELDS: (keyof ContactData)[] = [
  "phone",
  "email",
  "address",
  "city",
  "state",
  "pincode",
  "operating_hours",
  "timezone",
  "commander_name",
  "commander_contact",
];

/* ─── Sub-components ─────────────────────────────────── */
function SectionHeader({
  icon: Icon,
  label,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 mb-5 pb-3.5 border-b text-[11px] font-mono uppercase tracking-[0.09em] ${accent
        ? "text-[#5DCAA5] border-[rgba(93,202,165,0.2)]"
        : "text-gray-400 border-black/[0.08]"
        }`}
    >
      <Icon size={14} />
      <span>{label}</span>
    </div>
  );
}

function Field({
  label,
  value,
  name,
  isEditing,
  onChange,
  mono = false,
  type = "text",
  dark = false,
  wide = false,
  error = false,
}: {
  label: string;
  value: string;
  name: string;
  isEditing: boolean;
  onChange: (n: string, v: string) => void;
  mono?: boolean;
  type?: string;
  dark?: boolean;
  wide?: boolean;
  error?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${wide ? "col-span-2" : ""}`}>
      <label
        className={`font-mono text-[10px] uppercase tracking-[0.1em] ${dark ? "text-white/30" : error ? "text-red-500" : "text-gray-400"
          }`}
      >
        {label}
        {error && <span className="ml-1 normal-case">— required</span>}
      </label>
      {isEditing ? (
        <input
          className={`w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors border ${dark
            ? `bg-white/[0.06] font-mono ${error
              ? "border-red-500/60 text-red-400 focus:border-red-400"
              : "border-[rgba(93,202,165,0.3)] text-[#9FE1CB] focus:border-[#5DCAA5]"
            }`
            : error
              ? "bg-red-50 border-red-400 text-gray-900 focus:border-red-500"
              : "bg-gray-50 border-[rgba(29,158,117,0.35)] text-gray-900 focus:border-[#1D9E75]"
            }`}
          type={type}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
        />
      ) : (
        <p
          className={`text-[15px] font-medium leading-tight ${mono ? "font-mono text-sm" : ""
            } ${dark ? "text-[#9FE1CB]" : "text-gray-900"}`}
        >
          {value}
        </p>
      )}
    </div>
  );
}

/* ─── Map ────────────────────────────────────────────── */
function LiveMap({
  lat,
  lng,
  isEditing,
  onPinMove,
}: {
  lat: number;
  lng: number;
  isEditing: boolean;
  onPinMove: (lat: number, lng: number) => void;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="h-full bg-[#e8e4dc] flex items-center justify-center text-gray-400 text-sm font-mono">
        Loading map…
      </div>
    );
  }

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Recenter lat={lat} lng={lng} />
      <ClickHandler isEditing={isEditing} onPinMove={onPinMove} />
      <Marker position={[lat, lng]} />
    </MapContainer>
  );
}

/* ─── Main Page ──────────────────────────────────────── */
export default function AdminContactClient({ contactData }: { contactData: ContactData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState<ContactData>(contactData);
  const [draft, setDraft] = useState<ContactData>(contactData);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactData, boolean>>>({});

  const handleChange = useCallback((name: string, value: string) => {
    value = value.trimStart();
    setDraft((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field as soon as the user types
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  }, []);

  const handlePinMove = useCallback((lat: number, lng: number) => {
    setDraft((prev) => ({ ...prev, lat, lng }));
  }, []);

  const handleSave = async () => {
    // Validate required fields
    const newErrors: Partial<Record<keyof ContactData, boolean>> = {};
    let hasError = false;

    for (const field of REQUIRED_FIELDS) {
      const val = String(draft[field] ?? "").trim();
      if (!val) {
        newErrors[field] = true;
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setData({ ...draft });

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/contact/admin`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const result = await res.json();
    console.log(result);

    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setDraft(data);
    setErrors({});
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setDraft(data);
    setErrors({});
    setIsEditing(true);
  };

  const d = isEditing ? draft : data;

  return (
    <div className="min-h-screen">
      <Breadcrumb section="Contact" />

      {/* Edit Banner */}
      {isEditing && (
        <div className="flex items-center gap-2 bg-[#FAEEDA] border-b border-[#FAC775] text-[#854F0B] text-sm px-7 py-2.5">
          <AlertCircle size={14} />
          <span>Edit mode active — changes are local until you commit.</span>
        </div>
      )}

      <main className="max-w-[1280px] mx-auto px-7 py-10 pb-20">

        {/* PAGE HERO */}
        <div className="flex items-start justify-between gap-6 mb-9 flex-wrap">
          <div>
            <p className="text-sm text-gray-400 max-w-[440px] leading-relaxed">
              Manage GPS coordinates, communication channels, and operational
              parameters for this command node.
            </p>
          </div>
          <div className="flex items-start gap-2 flex-wrap pt-1">
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0F6E56] bg-[#E1F5EE] px-3 py-1.5 rounded-full">
                <Check size={13} /> Saved
              </span>
            )}
            {!isEditing ? (
              <button
                className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors cursor-pointer border-none"
                onClick={handleStartEdit}
              >
                <Edit2 size={15} /> Edit Portal
              </button>
            ) : (
              <div className="flex gap-2.5 flex-wrap">
                <button
                  className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl bg-[#1D9E75] text-white hover:bg-[#0F6E56] transition-colors cursor-pointer border-none"
                  onClick={handleSave}
                >
                  <Save size={15} /> Commit Changes
                </button>
                <button
                  className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl bg-white text-[#D85A30] border border-[rgba(216,90,48,0.4)] hover:bg-[#FAECE7] transition-colors cursor-pointer"
                  onClick={handleCancel}
                >
                  <X size={15} /> Discard
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Validation summary banner */}
        {isEditing && Object.values(errors).some(Boolean) && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-3 rounded-xl mb-6">
            <AlertCircle size={14} className="shrink-0" />
            <span>Please fill in all required fields before saving.</span>
          </div>
        )}

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-6 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-4">

            {/* Communications */}
            <div className="bg-white border border-black/[0.08] rounded-[18px] p-6">
              <SectionHeader icon={Phone} label="Communications" />
              <div className="grid grid-cols-2 gap-[18px]">
                <Field label="Primary Contact" name="phone" value={d?.phone} isEditing={isEditing} onChange={handleChange} mono error={errors.phone} />
                <Field label="Alternate Contact" name="altPhone" value={d?.altPhone} isEditing={isEditing} onChange={handleChange} mono />
                <Field label="Email Address" name="email" value={d?.email} isEditing={isEditing} onChange={handleChange} type="email" wide error={errors.email} />
                <Field label="Web Portal" name="website" value={d?.website} isEditing={isEditing} onChange={handleChange} type="url" wide />
              </div>
            </div>

            {/* Address */}
            <div className="bg-white border border-black/[0.08] rounded-[18px] p-6">
              <SectionHeader icon={MapPin} label="Address & Location" />
              <div className="grid grid-cols-2 gap-[18px]">
                <Field label="Street Address" name="address" value={d?.address} isEditing={isEditing} onChange={handleChange} wide error={errors.address} />
                <Field label="City" name="city" value={d?.city} isEditing={isEditing} onChange={handleChange} error={errors.city} />
                <Field label="State" name="state" value={d?.state} isEditing={isEditing} onChange={handleChange} error={errors.state} />
                <Field label="PIN Code" name="pincode" value={d?.pincode} isEditing={isEditing} onChange={handleChange} mono error={errors.pincode} />
              </div>
            </div>

            {/* GPS */}
            <div className="bg-gradient-to-r from-[#242c26] to-[#1f7a36] border border-white/[0.07] rounded-[18px] p-6 text-white">
              <SectionHeader icon={Navigation} label="GPS Telemetry" accent />
              <div className="grid grid-cols-2 gap-[18px] text-white">
                <Field label="Latitude" name="lat" value={String(d?.lat)} isEditing={isEditing} onChange={handleChange} mono dark />
                <Field label="Longitude" name="lng" value={String(d?.lng)} isEditing={isEditing} onChange={handleChange} mono dark />
                <Field label="Altitude" name="altitude" value={d?.altitude} isEditing={isEditing} onChange={handleChange} mono dark />
                <Field label="GPS Accuracy" name="accuracy" value={d?.accuracy} isEditing={isEditing} onChange={handleChange} mono dark />
              </div>
              {isEditing && (
                <p className="flex items-center gap-1.5 text-[11px] font-mono text-white/25 mt-4">
                  <Wifi size={12} /> Tap the map to reposition the pin, or edit values above.
                </p>
              )}
            </div>

            {/* Operations */}
            <div className="bg-white border border-black/[0.08] rounded-[18px] p-6">
              <SectionHeader icon={Clock} label="Operational Details" />
              <div className="grid grid-cols-2 gap-[18px]">
                <Field label="Operating Hours" name="operating_hours" value={d?.operating_hours} isEditing={isEditing} onChange={handleChange} wide error={errors.operating_hours} />
                <Field label="Timezone" name="timezone" value={d?.timezone} isEditing={isEditing} onChange={handleChange} wide error={errors.timezone} />
              </div>
            </div>

            {/* Commander */}
            <div className="bg-white border border-black/[0.08] rounded-[18px] p-6">
              <SectionHeader icon={Users} label="Command Personnel" />
              <div className="grid grid-cols-2 gap-[18px]">
                <Field label="Commander Name" name="commander_name" value={d?.commander_name} isEditing={isEditing} onChange={handleChange} wide error={errors.commander_name} />
                <Field label="Commander Contact" name="commander_contact" value={d?.commander_contact} isEditing={isEditing} onChange={handleChange} mono error={errors.commander_contact} />
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-6">

            {/* Map */}
            <div className="bg-white border border-black/[0.08] rounded-[18px] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/[0.08]">
                <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-gray-500">
                  <Navigation size={14} /> Live Map
                </span>
                {isEditing && (
                  <span className="text-[11px] font-mono bg-[#E1F5EE] text-[#0F6E56] px-2.5 py-1 rounded-full">
                    Click to reposition
                  </span>
                )}
              </div>
              <div className="h-[420px] relative">
                <LiveMap
                  lat={d?.lat}
                  lng={d?.lng}
                  isEditing={isEditing}
                  onPinMove={handlePinMove}
                />
              </div>
              <div className="flex justify-between items-center px-5 py-3 bg-gray-50 border-t border-black/[0.08]">
                <span className="font-mono text-xs text-gray-400">
                  {Number(d?.lat).toFixed(6)}°N, {Number(d?.lng).toFixed(6)}°E
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  {d?.city}, {d?.state}
                </span>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white border border-black/[0.08] rounded-[18px] overflow-hidden">
              <a className="flex items-center gap-4 px-5 py-4 no-underline text-gray-900 border-b border-black/[0.08] hover:bg-gray-50 transition-colors" href={`tel:${d?.phone}`}>
                <Phone size={16} className="text-[#1D9E75] shrink-0" />
                <div>
                  <div className="text-[11px] font-mono text-gray-400 uppercase tracking-[0.06em] mb-0.5">Primary</div>
                  <div className="text-sm font-medium">{d?.phone}</div>
                </div>
              </a>
              <a className="flex items-center gap-4 px-5 py-4 no-underline text-gray-900 border-b border-black/[0.08] hover:bg-gray-50 transition-colors" href={`mailto:${d?.email}`}>
                <Mail size={16} className="text-[#1D9E75] shrink-0" />
                <div>
                  <div className="text-[11px] font-mono text-gray-400 uppercase tracking-[0.06em] mb-0.5">Email</div>
                  <div className="text-sm font-medium">{d?.email}</div>
                </div>
              </a>
              <a className="flex items-center gap-4 px-5 py-4 no-underline text-gray-900 hover:bg-gray-50 transition-colors" href={d?.website} target="_blank" rel="noreferrer">
                <Globe size={16} className="text-[#1D9E75] shrink-0" />
                <div>
                  <div className="text-[11px] font-mono text-gray-400 uppercase tracking-[0.06em] mb-0.5">Portal</div>
                  <div className="text-sm font-medium">{d?.website?.replace("https://", "")}</div>
                </div>
              </a>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}