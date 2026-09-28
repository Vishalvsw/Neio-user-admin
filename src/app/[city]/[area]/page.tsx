import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Link from "next/link";

import { LOCATIONS } from "@/lib/locations";
import { SERVICES } from "@/lib/services";
import { getServicesForArea } from "@/lib/serviceAvailability";

interface AreaPageProps {
  params: Promise<{
    city: string;
    area: string;
  }>;
}

const BASE_URL = "https://neoi.in";

export async function generateStaticParams() {
  return LOCATIONS.flatMap((city) =>
    city.areas.map((area) => ({
      city: city.slug,
      area: area.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: AreaPageProps): Promise<Metadata> {
  const { city, area } = await params;

  const cityData = LOCATIONS.find((item) => item.slug === city);
  const areaData = cityData?.areas.find(
    (item) => item.slug === area
  );

  if (!cityData || !areaData) {
    return {};
  }

  const availableServiceSlugs = getServicesForArea(
    city,
    area
  );

  if (availableServiceSlugs.length === 0) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const serviceNames = SERVICES.filter((service) =>
    availableServiceSlugs.includes(service.slug)
  )
    .slice(0, 4)
    .map((service) => service.name.toLowerCase())
    .join(", ");

  return {
    title: `Home Services in ${areaData.name}, ${cityData.name}`,
    description:
      `Explore ${serviceNames} and other home services available ` +
      `in ${areaData.name}, ${cityData.name}. View service details, ` +
      `starting prices and availability.`,
    alternates: {
      canonical: `${BASE_URL}/${city}/${area}`,
    },
  };
}

export default async function AreaPage({
  params,
}: AreaPageProps) {
  const { city, area } = await params;

  const cityData = LOCATIONS.find((item) => item.slug === city);

  if (!cityData) {
    notFound();
  }

  const areaData = cityData.areas.find(
    (item) => item.slug === area
  );

  if (!areaData) {
    notFound();
  }

  const availableServiceSlugs = getServicesForArea(
    city,
    area
  );

  if (availableServiceSlugs.length === 0) {
    notFound();
  }

  const availableServices = SERVICES.filter((service) =>
    availableServiceSlugs.includes(service.slug)
  );

  const nearbyAreas = cityData.areas
    .filter((item) => item.slug !== area)
    .filter(
      (item) =>
        getServicesForArea(city, item.slug).length > 0
    )
    .slice(0, 6);

  const primaryService = availableServices[0];

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="border-b border-gray-100 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 text-sm text-gray-500"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>

              <span>/</span>

              <Link
                href={`/${city}`}
                className="hover:text-gray-900"
              >
                {cityData.name}
              </Link>

              <span>/</span>

              <span className="text-gray-900">
                {areaData.name}
              </span>
            </div>
          </nav>

          <div className="max-w-3xl">
            <p className="text-sm font-medium text-gray-500">
              {cityData.name} · {areaData.name}
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
              Home Services in {areaData.name},{" "}
              {cityData.name}
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Explore the home services currently available in{" "}
              {areaData.name}. Review service details, starting
              prices and estimated duration before booking.
            </p>

            {primaryService && (
              <div className="mt-8">
                <Link
                  href={`/${city}/${area}/${primaryService.slug}`}
                  className="inline-flex rounded-md bg-black px-7 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Explore {primaryService.name}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl">
              Services Available in {areaData.name}
            </h2>

            <p className="mt-3 max-w-2xl text-gray-600">
              Browse the services currently configured for this
              area.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {availableServices.map((service) => (
              <Link
                key={service.slug}
                href={`/${city}/${area}/${service.slug}`}
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

                <p className="mt-2 text-sm text-gray-500">
                  Estimated duration: {service.duration}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT THE AREA */}
      <section className="border-t border-gray-100 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Home Services in {areaData.name}
          </h2>

          <div className="mt-6 space-y-4 text-gray-600 leading-7">
            <p>
              Neoi currently lists {availableServices.length}{" "}
              service
              {availableServices.length === 1 ? "" : "s"} in{" "}
              {areaData.name}, {cityData.name}.
            </p>

            <p>
              Service availability can vary by location and service
              requirements. Open the relevant service page to review
              its listed inclusions, pricing and estimated duration.
            </p>
          </div>
        </div>
      </section>

      {/* NEARBY AREAS */}
      {nearbyAreas.length > 0 && (
        <section className="border-t border-gray-100 py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Nearby Areas in {cityData.name}
            </h2>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {nearbyAreas.map((nearbyArea) => (
                <Link
                  key={nearbyArea.slug}
                  href={`/${city}/${nearbyArea.slug}`}
                  className="rounded-xl border border-gray-200 p-5 transition hover:border-gray-400 hover:shadow-sm"
                >
                  <h3 className="font-medium text-gray-900">
                    Home Services in {nearbyArea.name}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    View available services →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {primaryService && (
        <section className="border-t border-gray-100 py-16 text-center">
          <Link
            href={`/${city}/${area}/${primaryService.slug}`}
            className="inline-flex rounded-md bg-black px-8 py-3 font-medium text-white transition hover:opacity-90"
          >
            View {primaryService.name}
          </Link>
        </section>
      )}
    </main>
  );
}