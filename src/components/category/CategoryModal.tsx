"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCity } from "@/context/CityContext";
import type { Category } from "@/lib/categories";

interface Props {
  category: Category | null;
  onClose: () => void;
}

export default function CategoryModal({ category, onClose }: Props) {
  const { city } = useCity();
  const currentCity = city || "bangalore";

  useEffect(() => {
    if (!category) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = originalOverflow;
    };
  }, [category, onClose]);

  if (!category) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute bottom-0 left-0 right-0 md:relative md:mx-auto md:mt-40 md:max-w-xl bg-white rounded-t-2xl md:rounded-xl shadow-2xl h-[80vh] md:h-auto max-h-[85vh] flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="flex justify-center mb-4 md:hidden">
            <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {category.name} Services
            </h2>
            <button type="button" onClick={onClose} className="text-gray-500 hover:text-black text-lg">
              ✕
            </button>
          </div>

          {category.subcategories.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
              <p className="text-sm text-gray-600">
                No services have been added to this category yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {category.subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/${currentCity}/services/${category.slug}/${sub.slug}`}
                  onClick={onClose}
                  className="border border-gray-200 rounded-lg p-4 text-center hover:border-indigo-500 hover:shadow-sm transition"
                >
                  {sub.image ? (
                    <img src={sub.image} alt={sub.name} className="h-10 mx-auto object-contain" />
                  ) : (
                    <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-semibold">
                      {sub.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-sm mt-3 font-medium text-gray-900">{sub.name}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
