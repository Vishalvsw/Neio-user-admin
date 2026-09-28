"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  Save,
  CheckCircle2,
  CalendarCheck,
  Mail,
  Lock,
  Unlock,
  Phone,
  Building2,
  ChevronDown,
  Layers,
  Megaphone,
  Users,
  Star,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

type Settings = {
  // Business Info
  businessName: string;
  supportPhone: string;
  supportEmail: string;
  whatsappNumber: string;

  // Booking Controls
  bookingsEnabled: boolean;
  allowSameDayBooking: boolean;
  maxBookingsPerDay: number;
  advanceBookingDays: number;

  // Homepage Content Sections
  showServicesGrid: boolean;      // Category grid
  showBanners: boolean;           // Offer slider
  showMostBooked: boolean;        // Most Booked Services
  showTeamHighlights: boolean;    // Team/staff highlight section
};

const DEFAULT_SETTINGS: Settings = {
  businessName: "Neoi Home Services",
  supportPhone: "+91 90000 00000",
  supportEmail: "support@neoi.in",
  whatsappNumber: "+91 90000 00000",

  bookingsEnabled: true,
  allowSameDayBooking: true,
  maxBookingsPerDay: 50,
  advanceBookingDays: 30,

  showServicesGrid: true,
  showBanners: true,
  showMostBooked: true,
  showTeamHighlights: true,
};

const STORAGE_KEY = "neoi_settings";

/* ------------------------------------------------------------------ */
/* Page                                                              */
/* ------------------------------------------------------------------ */

export default function SettingsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  /* Collapsible sections — first open by default */
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    business: true,
    booking: false,
    homepage: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({
          businessName: parsed.businessName ?? DEFAULT_SETTINGS.businessName,
          supportPhone: parsed.supportPhone ?? DEFAULT_SETTINGS.supportPhone,
          supportEmail: parsed.supportEmail ?? DEFAULT_SETTINGS.supportEmail,
          whatsappNumber:
            parsed.whatsappNumber ?? DEFAULT_SETTINGS.whatsappNumber,
          bookingsEnabled:
            parsed.bookingsEnabled ?? DEFAULT_SETTINGS.bookingsEnabled,
          allowSameDayBooking:
            parsed.allowSameDayBooking ?? DEFAULT_SETTINGS.allowSameDayBooking,
          maxBookingsPerDay:
            parsed.maxBookingsPerDay ?? DEFAULT_SETTINGS.maxBookingsPerDay,
          advanceBookingDays:
            parsed.advanceBookingDays ?? DEFAULT_SETTINGS.advanceBookingDays,
          showServicesGrid:
            parsed.showServicesGrid ?? DEFAULT_SETTINGS.showServicesGrid,
          showBanners: parsed.showBanners ?? DEFAULT_SETTINGS.showBanners,
          showMostBooked:
            parsed.showMostBooked ?? DEFAULT_SETTINGS.showMostBooked,
          showTeamHighlights:
            parsed.showTeamHighlights ?? DEFAULT_SETTINGS.showTeamHighlights,
        });
      } catch {}
    }
    setLoading(false);
  }, []);

  const handleChange = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Reset all settings to defaults?")) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
        Loading settings…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="min-w-0 flex-1">
        <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <AdminPageHeader
            title="Settings"
            description="Business info, booking rules and homepage content."
          />

          {saved && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              <CheckCircle2 size={16} />
              Settings saved.
            </div>
          )}

          <form onSubmit={handleSave} className="mt-6 space-y-4">
            {/* ============ BUSINESS INFO ============ */}
            <CollapsibleSection
              icon={Building2}
              title="Business Info"
              description="Contact details shown to customers."
              open={openSections.business}
              onToggle={() => toggleSection("business")}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Business Name">
                  <input
                    type="text"
                    value={settings.businessName}
                    onChange={(e) =>
                      handleChange("businessName", e.target.value)
                    }
                    placeholder="Neoi Home Services"
                    className={inputClass}
                  />
                </Field>

                <Field label="Support Phone">
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="tel"
                      value={settings.supportPhone}
                      onChange={(e) =>
                        handleChange("supportPhone", e.target.value)
                      }
                      placeholder="+91 90000 00000"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </Field>

                <Field label="Support Email">
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) =>
                        handleChange("supportEmail", e.target.value)
                      }
                      placeholder="support@neoi.in"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </Field>

                <Field label="WhatsApp Number">
                  <input
                    type="tel"
                    value={settings.whatsappNumber}
                    onChange={(e) =>
                      handleChange("whatsappNumber", e.target.value)
                    }
                    placeholder="+91 90000 00000"
                    className={inputClass}
                  />
                </Field>
              </div>
            </CollapsibleSection>

            {/* ============ BOOKING CONTROLS ============ */}
            <CollapsibleSection
              icon={CalendarCheck}
              title="Booking Controls"
              description="Rules for how customers can place bookings."
              open={openSections.booking}
              onToggle={() => toggleSection("booking")}
            >
              <div className="space-y-3">
                <Toggle
                  icon={settings.bookingsEnabled ? Unlock : Lock}
                  label="Accept New Bookings"
                  description="Pause this to stop new bookings without taking the site offline."
                  checked={settings.bookingsEnabled}
                  onChange={(v) => handleChange("bookingsEnabled", v)}
                />
                <Toggle
                  label="Allow Same-Day Booking"
                  description="Customers can book a slot for today."
                  checked={settings.allowSameDayBooking}
                  onChange={(v) => handleChange("allowSameDayBooking", v)}
                />

                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <Field label="Max Bookings Per Day">
                    <input
                      type="number"
                      min={1}
                      value={settings.maxBookingsPerDay}
                      onChange={(e) =>
                        handleChange(
                          "maxBookingsPerDay",
                          Number(e.target.value)
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Advance Booking Window (days)">
                    <input
                      type="number"
                      min={1}
                      value={settings.advanceBookingDays}
                      onChange={(e) =>
                        handleChange(
                          "advanceBookingDays",
                          Number(e.target.value)
                        )
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            </CollapsibleSection>

            {/* ============ HOMEPAGE SECTIONS ============ */}
            <CollapsibleSection
              icon={Layers}
              title="Homepage Sections"
              description="Choose which sections appear on the customer homepage."
              open={openSections.homepage}
              onToggle={() => toggleSection("homepage")}
            >
              <div className="space-y-3">
                <Toggle
                  icon={Layers}
                  label="Services Grid"
                  description="The 'What are you looking for?' category grid."
                  checked={settings.showServicesGrid}
                  onChange={(v) => handleChange("showServicesGrid", v)}
                />
                <Toggle
                  icon={Megaphone}
                  label="Banners / Offers"
                  description="Auto-sliding promotional banners."
                  checked={settings.showBanners}
                  onChange={(v) => handleChange("showBanners", v)}
                />
                <Toggle
                  icon={Star}
                  label="Most Booked Services"
                  description="Popular services section with prices."
                  checked={settings.showMostBooked}
                  onChange={(v) => handleChange("showMostBooked", v)}
                />
                <Toggle
                  icon={Users}
                  label="Team Highlights"
                  description="Showcase your staff or trust section on the homepage."
                  checked={settings.showTeamHighlights}
                  onChange={(v) => handleChange("showTeamHighlights", v)}
                />
              </div>
            </CollapsibleSection>

            {/* Actions */}
            <div className="sticky bottom-4 z-10 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Reset Defaults
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-indigo-700"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reusable UI                                                        */
/* ------------------------------------------------------------------ */

const inputClass =
  "w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

/* ---------- Collapsible Section ---------- */

function CollapsibleSection({
  icon: Icon,
  title,
  description,
  open,
  onToggle,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start gap-3 text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Icon size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            <p className="mt-0.5 text-xs text-gray-500">{description}</p>
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`transition-all duration-200 overflow-hidden ${
          open ? "max-h-[2000px] border-t border-gray-100" : "max-h-0"
        }`}
      >
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Toggle ---------- */

function Toggle({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50/60 px-4 py-3 cursor-pointer hover:bg-gray-50">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-gray-600 border border-gray-200">
            <Icon size={14} />
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-800">{label}</p>
          {description && (
            <p className="mt-0.5 text-xs text-gray-500">{description}</p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-indigo-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </label>
  );
}