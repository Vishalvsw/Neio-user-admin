"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useCity } from "@/context/CityContext";

export default function UrlLocationSync() {
  const params = useParams();

  const {
    city,
    area,
    setCity,
    initializeLocation,
  } = useCity();

  const urlCity =
    typeof params.city === "string"
      ? params.city
      : undefined;

  const urlArea =
    typeof params.area === "string"
      ? params.area
      : undefined;

  useEffect(() => {
    if (!urlCity) return;

    /*
     * If the URL contains both city and area,
     * use the URL as the authoritative location.
     */
    if (urlArea) {
      if (city === urlCity && area === urlArea) {
        return;
      }

      initializeLocation(urlCity, urlArea);
      return;
    }

    /*
     * City-only URLs must NOT clear the user's
     * previously selected area.
     *
     * Example:
     * /bangalore/services/cleaning/bathroom-cleaning
     *
     * If the user already selected:
     * Bangalore → Indiranagar
     *
     * keep the selected area.
     */
    if (city !== urlCity) {
      setCity(urlCity);
    }
  }, [
    urlCity,
    urlArea,
    city,
    area,
    setCity,
    initializeLocation,
  ]);

  return null;
}