"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Banner = {
  id: string;
  title: string;
  image: string;
  link: string;
  active: boolean;
};

type Ctx = {
  banners: Banner[];
  addBanner: (banner: Omit<Banner, "id">) => void;
  updateBanner: (id: string, updated: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  toggleBannerStatus: (id: string) => void;
};

const BannerContext = createContext<Ctx | undefined>(undefined);
const STORAGE_KEY = "neoi_banners";

const DEFAULT_BANNERS: Banner[] = [
  {
    id: "1",
    title: "Summer Sale — 30% Off",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=600&fit=crop",
    link: "/offers/summer",
    active: true,
  },
  {
    id: "2",
    title: "Deep Cleaning Special",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&h=600&fit=crop",
    link: "/services/cleaning",
    active: true,
  },
];

export function BannerProvider({ children }: { children: React.ReactNode }) {
  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setBanners(JSON.parse(stored)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try { setBanners(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const addBanner = (b: Omit<Banner, "id">) =>
    setBanners((prev) => [...prev, { ...b, id: Date.now().toString() }]);

  const updateBanner = (id: string, u: Partial<Banner>) =>
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...u } : b)));

  const deleteBanner = (id: string) =>
    setBanners((prev) => prev.filter((b) => b.id !== id));

  const toggleBannerStatus = (id: string) =>
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b)));

  return (
    <BannerContext.Provider value={{ banners, addBanner, updateBanner, deleteBanner, toggleBannerStatus }}>
      {children}
    </BannerContext.Provider>
  );
}

export function useBanners() {
  const ctx = useContext(BannerContext);
  if (!ctx) throw new Error("useBanners must be used within BannerProvider");
  return ctx;
}
