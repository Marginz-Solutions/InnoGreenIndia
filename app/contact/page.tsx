"use client";

import React, { useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { Topbar } from "@/components/topbar";
import { Footer } from "@/components/footer";
import {
  Phone,
  MapPin,
  Check,
  Edit2,
  X,
  Navigation,
  LucideIcon,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface ContactCardProps {
  title: string;
  icon: LucideIcon;
  isEditing: boolean;
  value: string;
  name: string;
  onChange: (name: string, value: string) => void;
  dark?: boolean;
  children?: React.ReactNode;
}
function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  React.useEffect(() => {
    // flyTo provides a smooth animation to the new center
    map.flyTo([lat, lng], map.getZoom());
  }, [lat, lng, map]);

  return null;
}
const ContactCard = ({
  title,
  icon: Icon,
  isEditing,
  value,
  name,
  onChange,
  dark,
  children,
}: ContactCardProps) => {
  /**
   * Component that automatically pans the map when coordinates change
   */

  const content =
    children ??
    (isEditing ? (
      <input
        className="edit-input" /* Using the new enhanced class */
        placeholder={`Enter ${title.toLowerCase()}...`}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
      />
    ) : (
      <p
        className={name === "phone" ? "value" : ""}
        style={{
          fontSize: name === "phone" ? "20px" : "18px",
          fontWeight: name === "phone" ? 700 : 400,
          marginTop: "8px",
        }}
      >
        {value}
      </p>
    ));

  return (
    <div
      className={`panel item ${dark ? "dark-panel" : ""}`}
      style={
        dark ? { background: "var(--bg2)", color: "white", border: "none" } : {}
      }
    >
      <h2
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: dark ? "var(--brand2)" : "inherit",
        }}
      >
        <Icon size={18} color={dark ? "var(--brand2)" : "var(--brand)"} />{" "}
        {title}
      </h2>

      {content}
    </div>
  );
};

export default function ContactPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [contactData, setContactData] = useState({
    phone: "+91 98765 43210",
    address: "123 Field Route, Erode, Tamil Nadu",
    lat: 11.341,
    lng: 77.7172,
  });

  const handleUpdate = (name: string, value: string) => {
    setContactData((prev) => ({ ...prev, [name]: value }));
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        if (isEditing) {
          setContactData((prev) => ({
            ...prev,
            lat: parseFloat(e.latlng.lat.toFixed(6)),
            lng: parseFloat(e.latlng.lng.toFixed(6)),
          }));
        }
      },
    });
    return (
      <Marker position={[contactData.lat, contactData.lng]} icon={markerIcon} />
    );
  }

  const handleSave = () => {
    console.log("Updating DB with:", contactData);
    setIsEditing(false);
  };

  return (
    <AuthGuard>
      <Topbar />

      <div className="container">
        <div
          className="hero"
          style={{ alignItems: "center", marginBottom: "32px" }}
        >
          <div>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: 900,
                color: "var(--brand)",
                margin: 0,
              }}
            >
              Location <span style={{ color: "var(--text)" }}>Hub</span>
            </h1>
            <p className="muted">
              Manage operational command center details and GPS coordinates.
            </p>
          </div>

          <div style={{ justifySelf: "end" }}>
            {!isEditing ? (
              <button className="btn" onClick={() => setIsEditing(true)}>
                <Edit2 size={16} /> Edit Portal
              </button>
            ) : (
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="btn primary" onClick={handleSave}>
                  <Check size={16} /> Commit Changes
                </button>
                <button
                  className="btn"
                  onClick={() => setIsEditing(false)}
                  style={{ color: "#ef4444" }}
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid">
          <div className="col-5">
            <div className="list">
              <ContactCard
                title="Operations Contact"
                icon={Phone}
                name="phone"
                value={contactData.phone}
                isEditing={isEditing}
                onChange={handleUpdate}
              />

              <ContactCard
                title="Primary Command Center"
                icon={MapPin}
                name="address"
                value={contactData.address}
                isEditing={isEditing}
                onChange={handleUpdate}
              />

              <ContactCard
                title="GPS Coordinates"
                icon={Navigation}
                name="gps"
                value=""
                isEditing={isEditing}
                onChange={handleUpdate}
                dark
              >
                <div className="grid" style={{ marginTop: "15px" }}>
                  <div className="col-6">
                    <label
                      className="muted"
                      style={{ fontSize: "11px", textTransform: "uppercase" }}
                    >
                      Latitude
                    </label>
                    {isEditing ? (
                      <input
                        className="edit-input"
                        value={contactData.lat}
                        onChange={(e) => handleUpdate("lat", e.target.value)}
                      />
                    ) : (
                      <p
                        style={{
                          fontFamily: "monospace",
                          fontSize: "18px",
                          marginTop: "4px",
                        }}
                      >
                        {contactData.lat}
                      </p>
                    )}
                  </div>
                  <div className="col-6">
                    <label
                      className="muted"
                      style={{ fontSize: "11px", textTransform: "uppercase" }}
                    >
                      Longitude
                    </label>
                    {isEditing ? (
                      <input
                        className="edit-input"
                        value={contactData.lng}
                        onChange={(e) => handleUpdate("lng", e.target.value)}
                      />
                    ) : (
                      <p
                        style={{
                          fontFamily: "monospace",
                          fontSize: "18px",
                          marginTop: "4px",
                        }}
                      >
                        {contactData.lng}
                      </p>
                    )}
                  </div>
                </div>
                <p
                  style={{ fontSize: "11px", marginTop: "15px", opacity: 0.6 }}
                >
                  {isEditing
                    ? "Tap on the map or type above to update coordinates."
                    : "Switch to Edit Mode to move the pin."}
                </p>
              </ContactCard>
            </div>
          </div>

          <div className="col-7">
            <div
              className="map-frame"
              style={{ height: "600px", overflow: "hidden" }}
            >
              <MapContainer
                center={[contactData.lat, contactData.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* This will handle the auto-focus/move behavior */}
                <MapRecenter lat={contactData.lat} lng={contactData.lng} />

                <LocationMarker />
              </MapContainer>
            </div>

            <div
              style={{
                marginTop: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="badge">Status: Active Node</div>
              <div
                className="muted"
                style={{ fontSize: "12px", fontFamily: "monospace" }}
              >
                Live Feed: {contactData.lat}, {contactData.lng}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </AuthGuard>
  );
}
