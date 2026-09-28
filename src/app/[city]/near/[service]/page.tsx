import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LOCATIONS } from "@/lib/locations";
import { SERVICES } from "@/lib/services";
import {
  getAreasForService,
} from "@/lib/serviceAvailability";

import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";
import ServiceSchema from "@/components/seo/ServiceSchema";

interface NearServicePageProps {
  params: Promise<{
    city: string;
    service: string;
  }>;
}

export async function generateStaticParams() {
  const pages: {
    city: string;
    service: string;
  }[] = [];

  for (const city of LOCATIONS) {
    for (const service of SERVICES) {
      const availableAreas = getAreasForService(
        city.slug,
        service.slug
      );

      if (availableAreas.length === 0) {
        continue;
      }

      pages.push({
        city: city.slug,
        service: service.slug,
      });
    }
  }

  return pages;
}

export async function generateMetadata({
  params,
}: NearServicePageProps): Promise<Metadata> {
  const { city, service } = await params;

  const cityData = LOCATIONS.find(
    (item) => item.slug === city
  );

  const serviceData = SERVICES.find(
    (item) => item.slug === service
  );

  if (!cityData || !serviceData) {
    return {};
  }

  const availableAreas = getAreasForService(
    city,
    service
  );

  if (availableAreas.length === 0) {
    return {};
  }

  return {
    title: `${serviceData.name} Near Me in ${cityData.name}`,
    description:
      `Find ${serviceData.name.toLowerCase()} near you in ` +
      `${cityData.name}. Check available areas, service details, ` +
      `pricing and booking options with Neoi Home Services.`,
    alternates: {
      canonical: `https://neoi.in/${city}/near/${service}`,
    },
  };
}

export default async function NearServicePage({
  params,
}: NearServicePageProps) {
  const { city, service } = await params;

  const cityData = LOCATIONS.find(
    (item) => item.slug === city
  );

  const serviceData = SERVICES.find(
    (item) => item.slug === service
  );

  if (!cityData || !serviceData) {
    notFound();
  }

  const availableAreas = getAreasForService(
    city,
    service
  );

  if (availableAreas.length === 0) {
    notFound();
  }

  const primaryArea = availableAreas[0];

  const serviceUrl =
    primaryArea
      ? `/${city}/${primaryArea}/${service}`
      : undefined;

  const pricingUrl =
    `/${city}/pricing/${service}`;

  return (
    <>
      <LocalBusinessSchema city={city} />

      {serviceUrl && (
        <ServiceSchema
          city={city}
          serviceName={serviceData.name}
          url={`https://neoi.in${serviceUrl}`}
          price={String(serviceData.basePrice)}
        />
      )}

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="border-b border-gray-100 py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-gray-500">
                {cityData.name} · Local Service
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
                {serviceData.name} Near Me in{" "}
                {cityData.name}
              </h1>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                Looking for{" "}
                {serviceData.name.toLowerCase()} near you?
                Neoi Home Services currently lists this service
                in selected areas of {cityData.name}.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {serviceUrl && (
                  <Link
                    href={serviceUrl}
                    className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    View Service & Book
                  </Link>
                )}

                <Link
                  href={pricingUrl}
                  className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-900 transition hover:border-black"
                >
                  Check Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Local availability */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold text-gray-900">
                Where is {serviceData.name.toLowerCase()}{" "}
                available?
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                {serviceData.name} is currently listed in the
                following areas of {cityData.name}. Select your
                area to view the service details and continue
                with booking.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {availableAreas.map((areaSlug) => {
                const areaData = cityData.areas.find(
                  (area) => area.slug === areaSlug
                );

                if (!areaData) {
                  return null;
                }

                return (
                  <Link
                    key={areaSlug}
                    href={`/${city}/${areaSlug}/${service}`}
                    className="rounded-lg border border-gray-200 p-6 transition hover:border-black"
                  >
                    <h3 className="font-medium text-gray-900">
                      {serviceData.name} in{" "}
                      {areaData.name}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      View service details
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Service overview */}
        <section className="border-t border-gray-100 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  About {serviceData.name}
                </h2>

                <p className="mt-4 leading-7 text-gray-600">
                  {serviceData.description}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Starting price
                </h2>

                <p className="mt-4 text-3xl font-semibold text-gray-900">
                  ₹{serviceData.basePrice}
                </p>

                <p className="mt-3 leading-7 text-gray-600">
                  The listed price is a starting price. The
                  final price can depend on the service option
                  and requirements selected during booking.
                </p>

                <Link
                  href={pricingUrl}
                  className="mt-5 inline-block text-sm font-medium text-gray-900 underline underline-offset-4"
                >
                  View detailed pricing
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What is included */}
        {serviceData.includes.length > 0 && (
          <section className="border-t border-gray-100 py-16">
            <div className="mx-auto max-w-5xl px-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                What's included?
              </h2>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {serviceData.includes.map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-gray-200 p-5"
                  >
                    <p className="text-sm leading-6 text-gray-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How to book */}
        <section className="border-t border-gray-100 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              How to book {serviceData.name.toLowerCase()}
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 p-6">
                <span className="text-sm font-medium text-gray-500">
                  01
                </span>

                <h3 className="mt-3 font-medium text-gray-900">
                  Select your area
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Choose the area where you need the service.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-6">
                <span className="text-sm font-medium text-gray-500">
                  02
                </span>

                <h3 className="mt-3 font-medium text-gray-900">
                  Review the service
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Check the available service details,
                  inclusions and pricing.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-6">
                <span className="text-sm font-medium text-gray-500">
                  03
                </span>

                <h3 className="mt-3 font-medium text-gray-900">
                  Continue to booking
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Select an available option and continue with
                  the booking process.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        {serviceData.faqs.length > 0 && (
          <section className="border-t border-gray-100 py-16">
            <div className="mx-auto max-w-3xl px-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Frequently Asked Questions
              </h2>

              <div className="mt-8 divide-y divide-gray-200">
                {serviceData.faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group py-5"
                  >
                    <summary className="cursor-pointer list-none pr-8 font-medium text-gray-900">
                      {faq.question}
                    </summary>

                    <p className="mt-3 leading-7 text-gray-600">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="border-t border-gray-100 py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              Find {serviceData.name.toLowerCase()} near you
            </h2>

            <p className="mt-4 text-gray-600">
              Check the available areas in {cityData.name}
              and choose the location that matches your
              requirement.
            </p>

            {serviceUrl && (
              <Link
                href={serviceUrl}
                className="mt-8 inline-block rounded-md bg-black px-8 py-3 font-medium text-white transition hover:opacity-90"
              >
                View Service & Book
              </Link>
            )}
          </div>
        </section>
      </main>
    </>
  );
}