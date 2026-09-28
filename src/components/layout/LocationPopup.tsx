"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { useCity } from "@/context/CityContext";
import { LOCATIONS } from "@/lib/locations";

interface Props {
  onClose: () => void;
}

export default function LocationPopup({ onClose }: Props) {

  const { city, setCity, area, setArea } = useCity();
  const [search, setSearch] = useState("");
  const selectedCity = LOCATIONS.find(
    (c) => c.slug === city
  );

  const filteredAreas =
    selectedCity?.areas.filter((a) =>
      a.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-start pt-24">

      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4"
        >
          <X size={18} />
        </button>

        <h3 className="font-semibold text-gray-900 text-lg">
          {selectedCity?.name || "Select City"}
        </h3>

        {/* CITY SWITCH */}
        <div className="flex gap-2 mt-2">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.slug}
              onClick={() => setCity(loc.slug)}
              className={`px-3 py-1 rounded text-sm ${
                city === loc.slug
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>

        {/* AREA SEARCH */}
        <input
          type="text"
          placeholder="Search your area"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-4 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />

        {/* AREA LIST */}
        <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">

          {filteredAreas.map((a) => (
            <button
              key={a.slug}
              onClick={() => {
                setArea(a.slug);
                onClose();
              }}
              className={`block w-full text-left p-2 rounded ${
                area === a.slug
                  ? "bg-indigo-100"
                  : "hover:bg-gray-100"
              }`}
            >
              {a.name}
            </button>
          ))}

        </div>

      </div>

    </div>
  );
}