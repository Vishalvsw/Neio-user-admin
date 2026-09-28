"use client";

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

  /* ----------------------------------------------------------------
     Registry lookup (static config, with graceful fallback)

     If SERVICE_REGISTRY has a hand-crafted layout for this service,
     use it. Otherwise render a fallback built from admin data.
     ---------------------------------------------------------------- */

  const registryData = SERVICE_REGISTRY[params.subcategory];

  if (registryData?.sections?.length) {
    return (
      <SubcategoryLayout
        city={params.city}
        subcategory={subcategoryData}
        sections={registryData.sections}
        banner={registryData.banner}
      />
    );
  }

  /* ---------- Fallback: build layout from admin data ---------- */
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
      banner={undefined}
    />
  );
}