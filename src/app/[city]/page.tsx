import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { LOCATIONS } from "@/lib/locations";
import { SERVICES } from "@/lib/services";
import { getServicesForArea } from "@/lib/serviceAvailability";

interface CityPageProps {
  params: Promise<{
    city: string;
  }>;
}

const BASE_URL = "https://neoi.in";

export async function generateStaticParams() {
  return LOCATIONS.map((city) => ({
    city: city.slug,
  }));
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { city } = await params;

  const cityData = LOCATIONS.find((item) => item.slug === city);

  if (!cityData) {
    return {};
  }

  const availableServiceSlugs = new Set(
    cityData.areas.flatMap((area) =>
      getServicesForArea(cityData.slug, area.slug)
    )
  );

  if (availableServiceSlugs.size === 0) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const serviceNames = SERVICES.filter((service) =>
    availableServiceSlugs.has(service.slug)
  )
    .slice(0, 4)
    .map((service) => service.name.toLowerCase())
    .join(", ");

  return {
    title: `Home Services in ${cityData.name}`,
    description:
      `Explore ${serviceNames} and other home services available in ` +
      `${cityData.name}. View service details, starting prices and ` +
      `available locations.`,
    alternates: {
      canonical: `${BASE_URL}/${city}`,
    },
  };
}

export default async function CityPage({
  params,
}: CityPageProps) {
  const { city } = await params;

  const cityData = LOCATIONS.find((item) => item.slug === city);

  if (!cityData) {
    notFound();
  }

  const availableServiceSlugs = new Set(
    cityData.areas.flatMap((area) =>
      getServicesForArea(cityData.slug, area.slug)
    )
  );

  if (availableServiceSlugs.size === 0) {
    notFound();
  }

  const availableServices = SERVICES.filter((service) =>
    availableServiceSlugs.has(service.slug)
  );

  const availableAreas = cityData.areas.filter(
    (area) =>
      getServicesForArea(cityData.slug, area.slug).length > 0
  );

  const serviceLinks = availableServices.map((service) => {
    const firstAvailableArea = availableAreas.find((area) =>
      getServicesForArea(cityData.slug, area.slug).includes(
        service.slug
      )
    );

    return {
      service,
      area: firstAvailableArea,
    };
  });

  const primaryService = serviceLinks.find(
    (item) => item.area
  );

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="border-b border-gray-100 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-sm font-medium text-gray-500">
            Neoi Home Services
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
            Home Services in {cityData.name}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Explore home cleaning and pest control services
            available in selected areas of {cityData.name}.
            View service details, pricing and availability before
            booking.
          </p>

          {primaryService?.area && (
            <div className="mt-8">
              <Link
                href={`/${city}/${primaryService.area.slug}/${primaryService.service.slug}`}
                className="inline-flex rounded-md bg-black px-7 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Explore {primaryService.service.name}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl">
              Services Available in {cityData.name}
            </h2>

            <p className="mt-3 text-gray-600">
              Browse the services currently available in supported
              areas of {cityData.name}.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {serviceLinks.map(({ service, area }) => {
              if (!area) return null;

              return (
                <Link
                  key={service.slug}
                  href={`/${city}/${area.slug}/${service.slug}`}
                  className="rounded-xl border border-gray-200 p-6 transition hover:border-gray-400 hover:shadow-sm"
                >
                  <h3 className="font-medium text-gray-900">
                    {service.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {service.description}
                  </p>

                  <p className="mt-4 text-sm font-medium text-gray-900">
                    Starting from ₹{service.basePrice}
                  </p>

                  <span className="mt-4 inline-block text-sm font-medium text-gray-700">
                    View service →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* AREAS */}
      <section className="border-t border-gray-100 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl">
              Areas We Serve in {cityData.name}
            </h2>

            <p className="mt-3 text-gray-600">
              Services are listed only for areas with configured
              availability.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {availableAreas.map((area) => (
              <Link
                key={area.slug}
                href={`/${city}/${area.slug}`}
                className="rounded-xl border border-gray-200 p-6 transition hover:border-gray-400 hover:shadow-sm"
              >
                <h3 className="font-medium text-gray-900">
                  Home Services in {area.name}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {getServicesForArea(city, area.slug).length}{" "}
                  service
                  {getServicesForArea(city, area.slug).length === 1
                    ? ""
                    : "s"}{" "}
                  available
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE INFORMATION */}
      <section className="border-t border-gray-100 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Home Services in {cityData.name}
          </h2>

          <div className="mt-6 space-y-4 text-gray-600 leading-7">
            <p>
              Neoi Home Services lists residential cleaning and pest
              control services in selected areas of {cityData.name}.
              Service availability depends on the area and the
              service selected.
            </p>

            <p>
              Each service page provides information about the
              service, inclusions, estimated duration and listed
              starting price. Customers can review the available
              details before continuing to the booking process.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}