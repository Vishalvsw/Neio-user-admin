
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { LOCATIONS } from "@/lib/locations";
import { SERVICE_REGISTRY } from "@/lib/serviceRegistry";
import { useCategories } from "@/context/CategoriesContext";

import SubcategoryLayout from "@/components/service/SubcategoryLayout";

/* ============================================================
   NOT FOUND SCREEN
   ============================================================ */

function NotFoundScreen({ title = "Service not found" }: { title?: string }) {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-3 text-sm text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Back to Home
      </Link>
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function SubcategoryPage() {
  const params = useParams<{
    city: string;
    category: string;
    subcategory: string;
  }>();

  const { categories, loading } = useCategories();
  const [activeChipIdx, setActiveChipIdx] = useState(0);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16 text-center text-sm text-gray-500">
        Loading…
      </div>
    );
  }

  /* ---------- City ---------- */
  const cityData = LOCATIONS.find((c) => c.slug === params.city);
  if (!cityData) {
    return <NotFoundScreen title="City not available" />;
  }

  /* ---------- Category (from ADMIN) ---------- */
  const categoryData = categories.find((c) => c.slug === params.category);
  if (!categoryData) {
    return <NotFoundScreen title="Category not found" />;
  }

  /* ---------- Subcategory (from ADMIN) ---------- */
  const subcategoryData = categoryData.subcategories.find(
    (s) => s.slug === params.subcategory
  );
  if (!subcategoryData) {
    return <NotFoundScreen title="Service not found" />;
  }

  /* ============================================================
     ✅ FIX: Resolve the banner ONCE — admin banner preferred
     ============================================================ */
  const adminBanner = (subcategoryData as any).banner as string | undefined;
  const registryData = SERVICE_REGISTRY[params.subcategory];
  const resolvedBanner = adminBanner || registryData?.banner || undefined;

  /* ============================================================
     If admin has chips defined → render chips bar + SubcategoryLayout
     ============================================================ */
  const adminSections = subcategoryData.sections ?? [];

  if (adminSections.length > 0) {
    const activeSection = adminSections[activeChipIdx] || adminSections[0];

    // Convert the active chip's packages into the sections shape
    // that SubcategoryLayout already expects.
    const layoutSections = [
      {
        id: `chip-${activeSection.id}`,
        title: activeSection.name,
        services: (activeSection.packages || []).map((pkg: any) => ({
          id: pkg.id,
          title: pkg.title,
          description: pkg.description || "",
          duration: pkg.duration || "",
          image: pkg.image || "",
          optionsCount: pkg.optionsCount ?? 0,
          variants:
            pkg.price > 0
              ? [{ name: "Standard", price: pkg.price }]
              : [],
        })),
      },
    ];

    return (
      <div>
        {/* Chips bar */}
        <div className="mx-auto max-w-5xl px-6 pt-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            What service do you need?
          </h2>
          <div className="flex flex-wrap gap-3">
            {adminSections.map((section: any, idx: number) => (
              <button
                key={section.id}
                onClick={() => setActiveChipIdx(idx)}
                className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                  idx === activeChipIdx
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>

        {/* ✅ FIX: was banner={undefined} → now passes resolvedBanner */}
        <SubcategoryLayout
          city={params.city}
          subcategory={subcategoryData}
          sections={layoutSections}
          banner={resolvedBanner}
        />
      </div>
    );
  }

  /* ============================================================
     Registry branch
     ============================================================ */
  if (registryData?.sections?.length) {
    return (
      <SubcategoryLayout
        city={params.city}
        subcategory={subcategoryData}
        sections={registryData.sections}
        banner={resolvedBanner}
      />
    );
  }

  /* ============================================================
     Fallback branch
     ============================================================ */
  const fallbackSections = [
    {
      id: "default",
      title: subcategoryData.name,
      services: [
        {
          id: "default-service",
          title: subcategoryData.name,
          description: subcategoryData.description,
          duration: subcategoryData.duration,
          variants:
            subcategoryData.variants.length > 0
              ? subcategoryData.variants.map((v) => ({
                  name: v.name,
                  price: v.price,
                }))
              : [
                  {
                    name: "Standard",
                    price: subcategoryData.basePrice,
                  },
                ],
        },
      ],
    },
  ];

  return (
    <SubcategoryLayout
      city={params.city}
      subcategory={subcategoryData}
      sections={fallbackSections}
      banner={resolvedBanner}
    />
  );
}