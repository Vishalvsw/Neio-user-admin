"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useCity } from "@/context/CityContext";
import { LOCATIONS } from "@/lib/locations";

export default function CitySelectionModal() {
  const { city, setCity, setArea, isLoaded } = useCity();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const selectedCityData = LOCATIONS.find(
    (location) => location.slug === selectedCity,
  );

  const filteredAreas = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return selectedCityData?.areas ?? [];

    return (selectedCityData?.areas ?? []).filter((area) =>
      area.name.toLowerCase().includes(query),
    );
  }, [selectedCityData, search]);

  if (!isLoaded || city) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl">
        {!selectedCity ? (
          <>
            <h2 className="mb-5 text-xl font-semibold text-gray-900">
              Select Your City
            </h2>

            <div className="space-y-3">
              {LOCATIONS.map((location) => (
                <button
                  key={location.slug}
                  type="button"
                  onClick={() => {
                    setSelectedCity(location.slug);
                    setSearch("");
                  }}
                  className="w-full rounded-xl border border-gray-200 p-4 text-left transition hover:border-black"
                >
                  {location.name}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setSelectedCity(null);
                setSearch("");
              }}
              className="mb-4 text-sm text-gray-600 hover:text-black"
            >
              ← Change City
            </button>

            <h2 className="text-xl font-semibold text-gray-900">
              Select Your Area
            </h2>

            <div className="relative mt-4">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your area"
                className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-3 text-sm outline-none focus:border-black"
                autoFocus
              />
            </div>

            <div className="mt-4 max-h-72 space-y-2 overflow-y-auto">
              {filteredAreas.map((area) => (
                <button
                  key={area.slug}
                  type="button"
                  onClick={() => {
                    setCity(selectedCity);
                    setArea(area.slug);
                  }}
                  className="w-full rounded-xl border border-gray-200 p-3 text-left text-sm hover:border-black hover:bg-gray-50"
                >
                  {area.name}
                </button>
              ))}

              {filteredAreas.length === 0 && (
                <p className="py-6 text-center text-sm text-gray-500">
                  No matching area found.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
