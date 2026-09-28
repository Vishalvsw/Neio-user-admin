import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { LOCATIONS } from "@/lib/locations";

interface PageProps {
  params: Promise<{
    city: string;
  }>;
}

/* -------------------------- */
/* Static Params              */
/* -------------------------- */

export async function generateStaticParams() {
  return LOCATIONS.map((city) => ({
    city: city.slug,
  }));
}

/* -------------------------- */
/* Metadata                   */
/* -------------------------- */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {

  const { city } = await params;

  const cityData = LOCATIONS.find((c) => c.slug === city);

  if (!cityData) return {};

  return {
    title: `Areas We Serve in ${cityData.name}`,
    description: `Explore all areas where Neoi provides home services in ${cityData.name}. Book professional cleaning, pest control and more.`,
    alternates: {
      canonical: `https://neoi.in/${city}/areas`,
    },
  };
}

/* -------------------------- */
/* Page                       */
/* -------------------------- */

export default async function AreasPage({
  params,
}: PageProps) {

  const { city } = await params;

  const cityData = LOCATIONS.find((c) => c.slug === city);

  if (!cityData) notFound();

  const areas = cityData.areas;

  return (
    <main className="min-h-screen bg-white">

      <section className="py-20 border-b border-gray-100">

        <div className="mx-auto max-w-5xl px-6 text-center">

          <h1 className="text-4xl font-semibold text-gray-900">
            Areas We Serve in {cityData.name}
          </h1>

          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Professional home cleaning, pest control and other home services
            available across multiple neighborhoods in {cityData.name}.
          </p>

        </div>

      </section>

      {/* AREAS GRID */}

      <section className="py-20">

        <div className="mx-auto max-w-5xl px-6">

          <h2 className="text-2xl font-semibold text-gray-900 mb-10 text-center">
            Home Services Available In These Areas
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

            {areas.map((area) => (

              <Link
                key={area.slug}
                href={`/${city}/${area.slug}`}
                className="border border-gray-200 rounded-lg p-6 hover:border-black transition"
              >

                <h3 className="font-medium text-gray-900">
                  Home Services in {area.name}
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Cleaning • Pest Control • Repair
                </p>

              </Link>

            ))}

          </div>

        </div>

      </section>

      {/* TRUST SECTION */}

      <section className="py-16 border-t border-gray-100">

        <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-4 gap-6 text-center">

          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Verified Professionals
            </h3>
            <p className="text-sm text-gray-600">
              Background checked experts
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Pay After Service
            </h3>
            <p className="text-sm text-gray-600">
              No advance payment required
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Transparent Pricing
            </h3>
            <p className="text-sm text-gray-600">
              No hidden charges
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Service Warranty
            </h3>
            <p className="text-sm text-gray-600">
              Free revisit guarantee
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}