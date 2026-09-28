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

interface PricingPageProps {
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
      const areas = getAreasForService(
        city.slug,
        service.slug
      );

      if (areas.length === 0) {
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
}: PricingPageProps): Promise<Metadata> {
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
    title: `${serviceData.name} Price in ${cityData.name}`,
    description:
      `Check ${serviceData.name.toLowerCase()} prices in ` +
      `${cityData.name}. Explore starting prices, what's included, ` +
      `service options and booking information.`,
    alternates: {
      canonical: `https://neoi.in/${city}/pricing/${service}`,
    },
  };
}

export default async function PricingPage({
  params,
}: PricingPageProps) {
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

  const serviceUrl =
    availableAreas.length > 0
      ? `/${city}/${availableAreas[0]}/${service}`
      : undefined;

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
                {cityData.name} · Pricing
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
                {serviceData.name} Price in{" "}
                {cityData.name}
              </h1>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                Explore the starting price for{" "}
                {serviceData.name.toLowerCase()} in{" "}
                {cityData.name}, along with service details,
                inclusions and available booking options.
              </p>
            </div>
          </div>
        </section>

        {/* Starting price */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-8">
                <p className="text-sm font-medium text-gray-500">
                  Starting price
                </p>

                <div className="mt-3">
                  <span className="text-4xl font-semibold text-gray-900">
                    ₹{serviceData.basePrice}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-600">
                  This is the starting price listed for the
                  service. The final price can depend on the
                  service option and requirements selected
                  during booking.
                </p>

                {serviceUrl && (
                  <Link
                    href={serviceUrl}
                    className="mt-6 inline-block rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    View Service & Book
                  </Link>
                )}
              </div>

              <div className="rounded-xl border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900">
                  What can affect the price?
                </h2>

                <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-600">
                  <li>
                    • Service option or package selected
                  </li>
                  <li>
                    • Size or condition of the property or
                    area being serviced
                  </li>
                  <li>
                    • Additional requirements selected during
                    booking
                  </li>
                  <li>
                    • Availability of the selected service at
                    the location
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="border-t border-gray-100 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold text-gray-900">
                What is included in{" "}
                {serviceData.name.toLowerCase()}?
              </h2>

              <p className="mt-4 text-gray-600">
                The service includes the items listed below.
                Exact inclusions can vary depending on the
                service option selected.
              </p>
            </div>

            {serviceData.includes.length > 0 && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {serviceData.includes.map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-gray-200 p-5"
                  >
                    <p className="text-sm text-gray-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Service information */}
        <section className="border-t border-gray-100 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  About the service
                </h2>

                <p className="mt-4 leading-7 text-gray-600">
                  {serviceData.description}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Service duration
                </h2>

                <p className="mt-4 leading-7 text-gray-600">
                  The listed service duration is{" "}
                  <strong className="font-medium text-gray-900">
                    {serviceData.duration}
                  </strong>
                  . Actual time may vary depending on the
                  selected service option and requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Areas */}
        <section className="border-t border-gray-100 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {serviceData.name} available areas in{" "}
              {cityData.name}
            </h2>

            <p className="mt-4 max-w-3xl text-gray-600">
              This service is currently listed for the
              following areas. Availability depends on the
              customer's exact location.
            </p>

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
                    className="rounded-lg border border-gray-200 p-5 transition hover:border-black"
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

        {/* CTA */}
        {serviceUrl && (
          <section className="border-t border-gray-100 py-20">
            <div className="mx-auto max-w-3xl px-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                Ready to book{" "}
                {serviceData.name.toLowerCase()}?
              </h2>

              <p className="mt-4 text-gray-600">
                View the service details and available options
                for your location.
              </p>

              <Link
                href={serviceUrl}
                className="mt-8 inline-block rounded-md bg-black px-8 py-3 font-medium text-white transition hover:opacity-90"
              >
                View Service & Book
              </Link>
            </div>
          </section>
        )}
      </main>
    </>
  );
}