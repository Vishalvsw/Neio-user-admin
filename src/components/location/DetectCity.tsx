"use client";

import { useEffect } from "react";

export default function DetectCity() {
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(() => {
      // Future: connect to reverse geocoding API
      // For now, we just log
      console.log("Location detected");
    });
  }, []);

  return null;
}