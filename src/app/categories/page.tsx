"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { useCity } from "@/context/CityContext";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {

  const router = useRouter();
  const { city } = useCity();
  const currentCity = city || "bangalore";

  const [activeCategory, setActiveCategory] =
    useState(CATEGORIES[0]);

  return (
    <main className="min-h-screen bg-white">

      <div className="flex h-screen">

        {/* LEFT CATEGORY LIST */}
        <div className="w-[22%] bg-gray-50 border-r overflow-y-auto">

          {CATEGORIES.map((cat) => (

            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat)}
              className={`w-full flex flex-col items-center gap-2 py-4 px-2 text-xs border-b ${
                activeCategory.slug === cat.slug
                  ? "bg-white text-indigo-600 font-semibold"
                  : "text-gray-600"
              }`}
            >

              {/* CATEGORY IMAGE */}
              <img
                src={cat.image}
                alt={cat.name}
                className="h-8 w-8 object-contain"
              />

              {/* CATEGORY TEXT */}
              <span className="text-center leading-tight">
                {cat.name}
              </span>

            </button>

          ))}

        </div>


        {/* RIGHT SUBCATEGORY GRID */}
        <div className="flex-1 p-4 overflow-y-auto">

          <h2 className="font-semibold mb-4">
            {activeCategory.name}
          </h2>

          <div className="grid grid-cols-2 gap-4">

            {activeCategory.subcategories.map((sub) => (

              <button
                key={sub.slug}
                onClick={() =>
                  router.push(
                    `/${currentCity}/services/${activeCategory.slug}/${sub.slug}`
                  )
                }
                className="border rounded-lg p-4 flex flex-col items-center hover:border-indigo-500 transition"
              >

                <img
                  src={sub.image}
                  alt={sub.name}
                  className="h-10 mb-2"
                />

                <span className="text-sm text-center">
                  {sub.name}
                </span>

              </button>

            ))}

          </div>

        </div>

      </div>

    </main>
  );
}