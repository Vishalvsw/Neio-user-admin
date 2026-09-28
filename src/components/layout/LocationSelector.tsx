"use client";

import { MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";
import LocationPopup from "./LocationPopup";
import { useCity } from "@/context/CityContext";
import { LOCATIONS } from "@/lib/locations";

export default function LocationSelector() {
  const { city, area } = useCity();
  const [open, setOpen] = useState(false);

  const cityName =
    LOCATIONS.find((c) => c.slug === city)?.name || "Select City";

  const areaName = area
    ? area.replace("-", " ")
    : "Select your area";

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer flex items-start gap-2"
      >
        <MapPin size={20} className="text-indigo-600 mt-1" />

        <div className="flex flex-col leading-tight">

          <span className="font-semibold text-gray-900 text-sm">
            {cityName}
          </span>

          <span className="text-xs text-gray-500 capitalize">
            {areaName}
          </span>

        </div>

        <ChevronDown size={16} className="text-gray-500 mt-1" />
      </div>

      {open && <LocationPopup onClose={() => setOpen(false)} />}
    </>
  );
}