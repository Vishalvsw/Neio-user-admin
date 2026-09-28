import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getAreasForService,
  getServicesForArea,
  isServiceAvailable,
} from "@/lib/serviceAvailability";
import { LOCATIONS } from "@/lib/locations";
import { SERVICES } from "@/lib/services";
import { generateServiceContent } from "@/lib/seoContent";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import TrustSection from "@/components/service/TrustSection";
import StickyCTA from "@/components/service/StickyCTA";
import AreaInternalLinks from "@/components/area/AreaInternalLinks";

import ServiceSchema from "@/components/seo/ServiceSchema";
interface ServicePageProps {
  params: Promise<{
    city: string;
    area: string;
    service: string;
  }>;
}

/* -------------------------------- */
/* Generate all static combinations */
/* -------------------------------- */

export async function generateStaticParams() {
  return LOCATIONS.flatMap((city) =>
    city.areas.flatMap((area) =>
      getServicesForArea(city.slug, area.slug).map(
        (service) => ({
          city: city.slug,
          area: area.slug,
          service,
        })
      )
    )
  );
}


/* ----------------------- */
/* Dynamic SEO Metadata    */
/* ----------------------- */

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { city, area, service } = await params;

  const cityData = LOCATIONS.find((c) => c.slug === city);
  const areaData = cityData?.areas.find((a) => a.slug === area);
  const serviceData = SERVICES.find((s) => s.slug === service);

  

  if (!cityData || !areaData || !serviceData) {
    return {
      title: "Service",
    };
  }

  if (!isServiceAvailable(city, area, service)) {
    notFound();
  }

  return {
    title: `${serviceData.name} in ${areaData.name}, ${cityData.name}`,
    description: `Book ${serviceData.name.toLowerCase()} in ${areaData.name}, ${cityData.name}. Starting at ₹${serviceData.basePrice}. Pay after service.`,
    alternates: {
      canonical: `https://neoi.in/${city}/${area}/${service}`,
    },
  };
}

/* ----------------------- */
/* Page Component          */
/* ----------------------- */

export default async function ServicePage({
  params,
}: ServicePageProps) {
  const { city, area, service } = await params;

  const cityData = LOCATIONS.find((c) => c.slug === city);
  if (!cityData) notFound();

  const areaData = cityData.areas.find((a) => a.slug === area);
  if (!areaData) notFound();

  const serviceData = SERVICES.find((s) => s.slug === service);
  if (!serviceData) notFound();

  const content = generateServiceContent({
    service: serviceData.name,
    city: cityData.name,
    area: areaData.name,
    areas: cityData.areas.map((item) => item.name),
  });

  if (!isServiceAvailable(city, area, service)) {
    notFound();
  }

  /* ----------------------- */
  /* Structured Data         */
  /* ----------------------- */

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://neoi.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: cityData.name,
        item: `https://neoi.in/${city}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: areaData.name,
        item: `https://neoi.in/${city}/${area}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: serviceData.name,
      },
    ],
  };

  const faqSchema =
    serviceData.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: serviceData.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <ServiceSchema
        city={city}
        serviceName={serviceData.name}
        url={`https://neoi.in/${city}/${area}/${service}`}
        price={String(serviceData.basePrice)}
      />

      <main className="min-h-screen bg-white pb-24">
        {/* JSON-LD Structured Data */}
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbSchema),
            }}
          />

          {faqSchema && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(faqSchema),
              }}
            />
          )}
        </>

        <div className="mx-auto max-w-5xl px-6 py-10">
          {/* Breadcrumb */}
          <Breadcrumbs
            items={[
              { name: 'Home', href: '/' },
              { name: cityData.name, href: `/${city}` },
              { name: areaData.name, href: `/${city}/${area}` },
              { name: serviceData.name },
            ]}
          />

          {/* HERO */}
          <section className="border-b border-gray-100 pb-12">
            <h1 className="text-3xl font-semibold text-gray-900">
              {serviceData.name} in {areaData.name}, {cityData.name}
            </h1>

            <p className="mt-3 text-gray-600">{content.intro}</p>

            <p className="mt-4 text-lg font-medium text-gray-900">
              Starting from ₹{serviceData.basePrice}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Estimated duration: {serviceData.duration}
            </p>
          </section>

          <section className="py-12 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              About {serviceData.name} in {areaData.name}
            </h2>

            <p className="text-gray-600 leading-7">{content.quality}</p>
          </section>

          <section className="py-12 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Why Choose Neoi in {areaData.name}?
            </h2>

            <ul className="grid md:grid-cols-2 gap-4">
              {content.whyChoose.map((item) => (
                <li
                  key={item}
                  className="border border-gray-200 rounded-lg p-4 text-sm text-gray-600"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <TrustSection />

          {/* INCLUDES */}
          <section className="py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              What's Included
            </h2>

            <ul className="space-y-3">
              {serviceData.includes.map((item, index) => (
                <li
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ */}
          {serviceData.faqs.length > 0 && (
            <section className="py-12 border-t border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                {serviceData.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <h3 className="font-medium text-gray-900">
                      {faq.question}
                    </h3>

                    <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <AreaInternalLinks citySlug={city} areaSlug={area} />

          <section className="py-12 border-t border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Service Availability in {areaData.name}
            </h2>

            <p className="text-gray-600 leading-7">{content.coverage}</p>
          </section>

          {/* CTA */}
          <section className="border-t border-gray-100 py-16 text-center">
            <Link
              href={`/book?city=${city}&area=${area}&service=${service}`}
              className="inline-flex rounded-lg bg-black px-7 py-3 font-medium text-white transition hover:opacity-90"
            >
              Book {serviceData.name}
            </Link>
          </section>
        </div>

        <StickyCTA
          city={city}
          area={area}
          service={service}
          price={serviceData.basePrice}
          serviceName={serviceData.name}
        />
      </main>
    </>
  );
}