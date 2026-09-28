"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export type SiteSettings = {
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

  // Homepage Sections
  showServicesGrid: boolean;
  showBanners: boolean;
  showMostBooked: boolean;
  showTeamHighlights: boolean;
};

const DEFAULT_SETTINGS: SiteSettings = {
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

type Ctx = {
  settings: SiteSettings;
  loading: boolean;
  updateSettings: (patch: Partial<SiteSettings>) => void;
};

const SettingsContext = createContext<Ctx | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setSettings({
            businessName: parsed.businessName ?? DEFAULT_SETTINGS.businessName,
            supportPhone: parsed.supportPhone ?? DEFAULT_SETTINGS.supportPhone,
            supportEmail: parsed.supportEmail ?? DEFAULT_SETTINGS.supportEmail,
            whatsappNumber:
              parsed.whatsappNumber ?? DEFAULT_SETTINGS.whatsappNumber,
            bookingsEnabled:
              parsed.bookingsEnabled ?? DEFAULT_SETTINGS.bookingsEnabled,
            allowSameDayBooking:
              parsed.allowSameDayBooking ??
              DEFAULT_SETTINGS.allowSameDayBooking,
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
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const updateSettings = useCallback((patch: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}