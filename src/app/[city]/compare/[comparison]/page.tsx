import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { LOCATIONS } from "@/lib/locations";

/* -------------------------- */
/* Comparison Data            */
/* -------------------------- */

const COMPARISONS = [
  {
    slug: "deep-cleaning-vs-regular-cleaning",
    title: "Deep Cleaning vs Regular Cleaning",
    serviceSlug: "home-cleaning",
    intro:
      "Choosing between deep cleaning and regular cleaning depends on your home's condition and maintenance needs.",
    table: [
      { feature: "Cleaning Depth", a: "Thorough deep cleaning", b: "Basic surface cleaning" },
      { feature: "Time Required", a: "4–6 hours", b: "1–2 hours" },
      { feature: "Best For", a: "Moving in/out, seasonal cleaning", b: "Weekly maintenance" },
      { feature: "Equipment", a: "Professional machines", b: "Basic tools" },
    ],
  },

  {
    slug: "pest-control-gel-vs-spray",
    title: "Pest Control Gel vs Spray Treatment",
    serviceSlug: "pest-control",
    intro:
      "Both gel and spray pest control methods target pests effectively but work differently depending on infestation level.",
    table: [
      { feature: "Application Method", a: "Gel bait placement", b: "Liquid spray treatment" },
      { feature: "Odor", a: "Odorless", b: "Slight chemical smell" },
      { feature: "Best For", a: "Cockroach infestations", b: "General pest treatment" },
      { feature: "Duration", a: "Long-lasting control", b: "Immediate results" },
    ],
  },
];

/* -------------------------- */
/* Static Params              */
/* -------------------------- */

export async function generateStaticParams() {

  const params: { city: string; comparison: string }[] = [];

  LOCATIONS.forEach((city) => {
    COMPARISONS.forEach((comp) => {
      params.push({
        city: city.slug,
        comparison: comp.slug,
      });
    });
  });

  return params;
}

/* -------------------------- */
/* SEO Metadata               */
/* -------------------------- */

interface PageProps {
  params: Promise<{
    city: string;
    comparison: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {

  const { city, comparison } = await params;

  const cityData = LOCATIONS.find((c) => c.slug === city);
  const comparisonData = COMPARISONS.find((c) => c.slug === comparison);

  if (!cityData || !comparisonData) {
    return { title: "Service Comparison" };
  }

  return {
    title: `${comparisonData.title} in ${cityData.name}`,
    description: `Compare ${comparisonData.title.toLowerCase()} to decide the best option in ${cityData.name}.`,
    alternates: {
      canonical: `https://neoi.in/${city}/compare/${comparison}`,
    },
  };
}

/* -------------------------- */
/* Page                       */
/* -------------------------- */

export default async function ComparisonPage({
  params,
}: PageProps) {

  const { city, comparison } = await params;

  const cityData = LOCATIONS.find((c) => c.slug === city);
  if (!cityData) notFound();

  const comparisonData = COMPARISONS.find((c) => c.slug === comparison);
  if (!comparisonData) notFound();

  const areas = cityData.areas.slice(0, 8);

  /* -------------------------- */
  /* FAQ                        */
  /* -------------------------- */

  const faqs = [
    {
      question: `Which is better: ${comparisonData.title}?`,
      answer:
        "The best option depends on your home condition and the type of service required.",
    },
    {
      question: "How do I book the service?",
      answer:
        "You can easily book the service online and choose your preferred time slot.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-white pb-24">

      {/* FAQ Schema */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* HERO */}

        <section className="border-b pb-12">

          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            {comparisonData.title} in {cityData.name}
          </h1>

          <p className="mt-4 text-gray-600 max-w-2xl">
            {comparisonData.intro}
          </p>

          <div className="mt-6 text-sm text-gray-500">
            ⭐ 4.9 Rating • 12,000+ Bookings
          </div>

        </section>

        {/* COMPARISON TABLE */}

        <section className="py-12">

          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Comparison
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full border border-gray-200 rounded-lg">

              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Feature</th>
                  <th className="text-left p-4">Option A</th>
                  <th className="text-left p-4">Option B</th>
                </tr>
              </thead>

              <tbody>

                {comparisonData.table.map((row, index) => (

                  <tr key={index} className="border-t">

                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4">{row.a}</td>
                    <td className="p-4">{row.b}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>

        {/* CTA */}

        <section className="py-10 border rounded-xl p-8 text-center">

          <h3 className="text-xl font-semibold text-gray-900">
            Book Professional Service
          </h3>

          <p className="text-gray-600 mt-2">
            Verified professionals • Pay after service
          </p>

          <Link
            href={`/${city}`}
            className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
          >
            Explore Services
          </Link>

        </section>

        {/* AREAS */}

        <section className="py-12 border-t">

          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Areas We Serve in {cityData.name}
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">

            {areas.map((area) => (

              <Link
                key={area.slug}
                href={`/${city}/${area.slug}`}
                className="border rounded-lg p-4 hover:border-black transition"
              >
                Services in {area.name}
              </Link>

            ))}

          </div>

        </section>

      </div>

    </main>
  );
}