"use client";

import { useState } from "react";
import { useCategories } from "@/context/CategoriesContext";
import type { Category } from "@/lib/categories";
import CategoryModal from "./CategoryModal";

/* ---------- Icon with fallback ---------- */

function CategoryIcon({
  name,
  image,
}: {
  name: string;
  image: string;
}) {
  const [broken, setBroken] = useState(false);

  const showFallback = !image || broken;

  return (
    <div className="relative flex h-14 w-14 items-center justify-center">
      {/* Letter badge — hidden when a valid image is shown */}
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-xl font-bold transition-opacity ${
          showFallback ? "opacity-100" : "opacity-0"
        }`}
      >
        {name.charAt(0)}
      </div>

      {/* Image — overlays the badge when it loads successfully */}
      {!broken && image && (
        <img
          src={image}
          alt={name}
          className="absolute inset-0 h-14 w-14 object-contain group-hover:scale-105 transition-transform"
          onError={() => setBroken(true)}
        />
      )}
    </div>
  );
}

/* ---------- Grid ---------- */

export default function CategoryGrid() {
  const { categories, loading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-4 md:grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="h-14 w-14 rounded-full bg-gray-100 animate-pulse" />
            <div className="mt-2 h-3 w-16 rounded bg-gray-100 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  const active = categories.filter((c) => c.active);

  if (active.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
        No categories available right now.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-6">
        {active.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category)}
            className="flex flex-col items-center text-center group"
          >
            <CategoryIcon name={category.name} image={category.image} />
            <span className="text-sm mt-2 text-gray-700 group-hover:text-indigo-700">
              {category.name}
            </span>
          </button>
        ))}
      </div>

      <CategoryModal
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />
    </>
  );
}