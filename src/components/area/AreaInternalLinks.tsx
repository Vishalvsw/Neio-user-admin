import Link from "next/link";

import { SERVICES } from "@/lib/services";
import { LOCATIONS } from "@/lib/locations";
import { getServicesForArea } from "@/lib/serviceAvailability";

interface AreaInternalLinksProps {
  citySlug: string;
  areaSlug: string;
}

export default function AreaInternalLinks({
  citySlug,
  areaSlug,
}: AreaInternalLinksProps) {
  const city = LOCATIONS.find(
    (item) => item.slug === citySlug
  );

  if (!city) {
    return null;
  }

  const currentArea = city.areas.find(
    (item) => item.slug === areaSlug
  );

  if (!currentArea) {
    return null;
  }

  const availableServiceSlugs = getServicesForArea(
    citySlug,
    areaSlug
  );

  const availableServices = SERVICES.filter((service) =>
    availableServiceSlugs.includes(service.slug)
  );

  const nearbyAreas = city.areas
    .filter((area) => area.slug !== areaSlug)
    .filter(
      (area) =>
        getServicesForArea(citySlug, area.slug).length > 0
    )
    .slice(0, 6);

  if (
    availableServices.length === 0 &&
    nearbyAreas.length === 0
  ) {
    return null;
  }

  return (
    <section className="border-t border-gray-100 py-16">
      <div className="mx-auto max-w-5xl px-6">
        {availableServices.length > 1 && (
          <div className="mb-14">
            <h2 className="text-xl font-semibold text-gray-900">
              Other Services in {currentArea.name}
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {availableServices.map((service) => (
                <Link
                  key={service.slug}
                  href={`/${citySlug}/${areaSlug}/${service.slug}`}
                  className="rounded-lg border border-gray-200 p-4 text-sm transition hover:border-gray-400 hover:shadow-sm"
                >
                  {service.name} in {currentArea.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {nearbyAreas.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Home Services in Nearby Areas
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {nearbyAreas.map((area) => (
                <Link
                  key={area.slug}
                  href={`/${citySlug}/${area.slug}`}
                  className="rounded-lg border border-gray-200 p-4 text-sm transition hover:border-gray-400 hover:shadow-sm"
                >
                  Home Services in {area.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}