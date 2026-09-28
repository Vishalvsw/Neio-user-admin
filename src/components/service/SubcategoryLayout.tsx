"use client";

import { useEffect, useState } from "react";
import type { SubCategory } from "@/lib/categories";
import type { ServicePackage, ServiceSection } from "@/types/service";

import ServiceSectionComponent from "./ServiceSection";
import VariantSelectorModal from "./VariantSelectorModal";
import ServiceNavigation from "./ServiceNavigation";
import ServiceBanner from "./ServiceBanner";
import ServiceDetailsDrawer from "./ServiceDetailsDrawer";
import ServiceMiniCart from "./ServiceMiniCart";
import LocationPopup from "../layout/LocationPopup";

import { useCity } from "@/context/CityContext";

interface Props {
  city: string;
  subcategory: SubCategory;
  sections: ServiceSection[];
  banner?: string;
}

export default function SubcategoryLayout({
  city,
  subcategory,
  sections,
  banner,
}: Props) {
  const { area } = useCity();

  const [selectedService, setSelectedService] =
    useState<ServicePackage | null>(null);

  const [detailsService, setDetailsService] =
    useState<ServicePackage | null>(null);

  const [showLocationPopup, setShowLocationPopup] =
    useState(false);

  const [pendingService, setPendingService] =
    useState<ServicePackage | null>(null);

  useEffect(() => {
    if (!area || !pendingService) return;

    setSelectedService(pendingService);
    setPendingService(null);
    setShowLocationPopup(false);
  }, [area, pendingService]);

  function handleAdd(service: ServicePackage) {
    if (!area) {
      setPendingService(service);
      setShowLocationPopup(true);
      return;
    }

    setSelectedService(service);
  }

  return (
    <main className="w-full bg-white">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-8 px-4 py-6 md:px-6 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_400px]">
        {/* SERVICES */}
        <div className="min-w-0">
          <div className="mb-5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
            >
              ← Back
            </button>
          </div>

          <div className="min-w-0 space-y-6 pb-10">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                {subcategory.name}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Choose an available service option and add it to your booking.
              </p>
            </div>

            <ServiceBanner
              title={subcategory.name}
              image={banner}
            />

            {sections.length > 0 && (
              <div className="border-b bg-white py-2">
                <ServiceNavigation
                  sections={sections.map((section) => ({
                    id: section.id,
                    title: section.title,
                  }))}
                />
              </div>
            )}

            <div className="space-y-8">
              {sections.map((section) => (
                <ServiceSectionComponent
                  key={section.id}
                  id={section.id}
                  title={section.title}
                  services={section.services}
                  onAdd={handleAdd}
                  onViewDetails={(service) =>
                    setDetailsService(service)
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <ServiceMiniCart />
          </div>
        </aside>
      </div>

      <VariantSelectorModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />

      <ServiceDetailsDrawer
        service={detailsService}
        onClose={() => setDetailsService(null)}
      />

      {showLocationPopup && (
        <LocationPopup
          onClose={() => setShowLocationPopup(false)}
        />
      )}
    </main>
  );
}