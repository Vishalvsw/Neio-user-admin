"use client";

import { useState } from "react";
import { useCity } from "@/context/CityContext";
import { LOCATIONS } from "@/lib/locations";
import { MapPin } from "lucide-react";



function formatLocation(text: string) {
  return text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function CitySelectorDropdown() {
  const { city, area, setCity } = useCity();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border border-indigo-200 rounded-xl px-4 py-2 text-sm hover:border-indigo-400 transition"
      >
        <MapPin size={16} className="text-indigo-600" />

        <span className="font-medium text-gray-800">
          {city
            ? area
              ? `${formatLocation(area)}, ${formatLocation(city)}`
              : formatLocation(city)
            : "Select Location"}
        </span>
      </button>

      {open && (
        <div className="absolute mt-3 w-72 bg-white border border-indigo-100 rounded-xl p-4 shadow-xl z-50">
          <input
            type="text"
            placeholder="Search city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-indigo-200 rounded-lg px-3 py-2 mb-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
          />

          <button className="text-indigo-600 text-sm mb-3">
            📍 Use Current Location
          </button>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {filtered.map((loc) => (
              <button
                key={loc.slug}
                onClick={() => {
                  setCity(loc.slug);
                  setOpen(false);
                }}
                className="w-full text-left text-sm hover:bg-indigo-50 p-2 rounded"
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}