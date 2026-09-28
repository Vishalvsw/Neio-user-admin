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

interface GuidePageProps {
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
}: GuidePageProps): Promise<Metadata> {
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
    title:
      `${serviceData.name}: Guide, Process & Tips in ` +
      `${cityData.name}`,
    description:
      `Learn about ${serviceData.name.toLowerCase()} in ` +
      `${cityData.name}. Understand the service, what it includes, ` +
      `how to prepare and what to consider before booking.`,
    alternates: {
      canonical: `https://neoi.in/${city}/guides/${service}`,
    },
  };
}

export default async function GuidePage({
  params,
}: GuidePageProps) {
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

  const serviceUrl = primaryArea
    ? `/${city}/${primaryArea}/${service}`
    : undefined;

  const pricingUrl =
    `/${city}/pricing/${service}`;

  const nearUrl =
    `/${city}/near/${service}`;

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
                {cityData.name} · Service Guide
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
                {serviceData.name} Guide in{" "}
                {cityData.name}
              </h1>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                Learn how{" "}
                {serviceData.name.toLowerCase()} works,
                what the service includes, how to prepare and
                what to consider before booking in{" "}
                {cityData.name}.
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              What is {serviceData.name.toLowerCase()}?
            </h2>

            <p className="mt-5 text-base leading-8 text-gray-600">
              {serviceData.description}
            </p>

            <p className="mt-5 text-base leading-8 text-gray-600">
              The exact service can vary depending on the
              option selected and the requirements of the
              property. Reviewing the available service
              details before booking helps you choose an
              option that matches your needs.
            </p>
          </div>
        </section>

        {/* What is included */}
        {serviceData.includes.length > 0 && (
          <section className="border-t border-gray-100 py-16">
            <div className="mx-auto max-w-5xl px-6">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold text-gray-900">
                  What does the service include?
                </h2>

                <p className="mt-4 leading-7 text-gray-600">
                  The following items are listed as part of
                  this service.
                </p>
              </div>

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

        {/* Before booking */}
        <section className="border-t border-gray-100 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              What should you consider before booking?
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900">
                  Service requirements
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Consider the type of work required and
                  select a service option that matches your
                  property and requirements.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900">
                  Service inclusions
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Review the listed inclusions so you know
                  what is covered by the selected service.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900">
                  Location availability
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Check whether the service is available in
                  your area before continuing with a booking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service duration */}
        <section className="border-t border-gray-100 py-16">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              How long does {serviceData.name.toLowerCase()}{" "}
              take?
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              The listed duration for this service is{" "}
              <strong className="font-medium text-gray-900">
                {serviceData.duration}
              </strong>
              . The actual time can vary depending on the
              selected option, property and service
              requirements.
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section className="border-t border-gray-100 py-16">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              How much does {serviceData.name.toLowerCase()}{" "}
              cost?
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              The listed starting price for{" "}
              {serviceData.name.toLowerCase()} in{" "}
              {cityData.name} is:
            </p>

            <p className="mt-4 text-3xl font-semibold text-gray-900">
              ₹{serviceData.basePrice}
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              The final price can depend on the service option
              and requirements selected during booking.
            </p>

            <Link
              href={pricingUrl}
              className="mt-6 inline-block text-sm font-medium text-gray-900 underline underline-offset-4"
            >
              View detailed pricing
            </Link>
          </div>
        </section>

        {/* Local availability */}
        <section className="border-t border-gray-100 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold text-gray-900">
                Where is {serviceData.name.toLowerCase()}{" "}
                available in {cityData.name}?
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                Neoi currently lists this service in the
                following areas. Availability depends on the
                customer's exact location.
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

        {/* Related pages */}
        <section className="border-t border-gray-100 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Explore {serviceData.name}
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {serviceUrl && (
                <Link
                  href={serviceUrl}
                  className="rounded-lg border border-gray-200 p-6 transition hover:border-black"
                >
                  <h3 className="font-medium text-gray-900">
                    View Service
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    See service details and booking options.
                  </p>
                </Link>
              )}

              <Link
                href={pricingUrl}
                className="rounded-lg border border-gray-200 p-6 transition hover:border-black"
              >
                <h3 className="font-medium text-gray-900">
                  View Pricing
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Check the starting price and pricing
                  information.
                </p>
              </Link>

              <Link
                href={nearUrl}
                className="rounded-lg border border-gray-200 p-6 transition hover:border-black"
              >
                <h3 className="font-medium text-gray-900">
                  Find Near You
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Explore areas where the service is
                  available.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        {serviceUrl && (
          <section className="border-t border-gray-100 py-20">
            <div className="mx-auto max-w-3xl px-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                Ready to book {serviceData.name.toLowerCase()}?
              </h2>

              <p className="mt-4 text-gray-600">
                Check the available service options for your
                location and continue to booking.
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