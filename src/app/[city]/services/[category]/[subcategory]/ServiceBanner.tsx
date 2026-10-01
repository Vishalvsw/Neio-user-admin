"use client";

import { useCategories } from "@/context/CategoriesContext";

export default function ServiceBanner({ serviceSlug }: { serviceSlug: string }) {
  const { categories, loading } = useCategories();

  console.log(
    "🎯 ServiceBanner",
    "slug:", serviceSlug,
    "loading:", loading,
    "categories:", categories.length
  );

  // Wait until localStorage has been read
  if (loading) {
    console.log("   ⏳ Still loading...");
    return null;
  }

  // Find matching service
  for (const cat of categories) {
    const sub = cat.subcategories.find((s) => s.slug === serviceSlug);
    if (sub?.banner) {
      console.log("   ✅ Found banner for", serviceSlug);
      return (
        <div className="mx-auto max-w-5xl px-6 pt-8">
          <div className="relative w-full aspect-[3/1] overflow-hidden rounded-2xl border border-indigo-100 shadow-sm">
            <img
              src={sub.banner}
              alt={sub.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      );
    }
  }

  console.log("   ❌ No banner found for", serviceSlug);
  return null;
}