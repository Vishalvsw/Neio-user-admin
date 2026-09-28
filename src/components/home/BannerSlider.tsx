"use client";

import { useState, useEffect } from "react";
import { useBanners } from "@/context/BannerContext";
import Image from "next/image";
import Link from "next/link";

export default function BannerSlider() {
  const { banners } = useBanners();

  // Only show active banners
  const activeBanners = banners.filter((b) => b.active);

  const [index, setIndex] = useState(0);

  // Reset index if banners shrink (e.g., admin deletes one)
  useEffect(() => {
    if (index >= activeBanners.length) setIndex(0);
  }, [activeBanners.length, index]);

  // Auto-slide every 4s
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev === activeBanners.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  // Empty state
  if (activeBanners.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-indigo-200 bg-white p-8 text-center text-sm text-slate-500">
        No active offers right now. Check back soon!
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* SLIDES */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {activeBanners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.link}
            className="relative min-w-full block"
          >
            <div className="relative aspect-[3/1] w-full bg-indigo-100">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
                className="object-cover"
                unoptimized={banner.image.startsWith("data:")}
              />
            </div>

            {/* Overlay title */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4 md:p-6 pointer-events-none">
              <h3 className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">
                {banner.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* DOTS */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {activeBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === i ? "bg-white w-5" : "bg-white/50 w-2"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}