"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Category, SubCategory } from "@/lib/categories";

export type { Category, SubCategory };

const STORAGE_KEY = "neoi_categories";

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Cleaning",
    slug: "cleaning",
    image: "/icons/cleaning-staff.png",
    active: true,
    subcategories: [
      {
        id: "s1",
        name: "Bathroom Cleaning",
        slug: "bathroom-cleaning",
        image: "/icons/plunger.png",
        description: "Tiles, fixtures and surfaces",
        basePrice: 499,
        duration: "60 min",
        variants: [
          { id: "v1", name: "1 Bathroom", price: 499, description: "Tiles, fixtures and surfaces" },
          { id: "v2", name: "2 Bathrooms", price: 799, description: "Tiles, fixtures and surfaces" },
          { id: "v3", name: "3 Bathrooms", price: 1099, description: "Tiles, fixtures and surfaces" },
        ],
      },
      {
        id: "s2",
        name: "Kitchen Cleaning",
        slug: "kitchen-cleaning",
        image: "/icons/kitchen.png",
        description: "Counters, chimney, sink and tiles",
        basePrice: 999,
        duration: "90 min",
        variants: [
          { id: "v4", name: "Standard Kitchen", price: 999, description: "Counters, chimney, sink" },
          { id: "v5", name: "Deep Kitchen", price: 1499, description: "Includes chimney degreasing" },
        ],
      },
      {
        id: "s3",
        name: "Full Home Cleaning",
        slug: "full-home-cleaning",
        image: "/icons/house.png",
        description: "Complete home deep cleaning",
        basePrice: 2499,
        duration: "4 hrs",
        variants: [
          { id: "v6", name: "1 BHK", price: 2499 },
          { id: "v7", name: "2 BHK", price: 3499 },
          { id: "v8", name: "3 BHK", price: 4499 },
        ],
      },
      {
        id: "s4",
        name: "Sofa Cleaning",
        slug: "sofa-cleaning",
        image: "/icons/sofa_8633977.png",
        description: "Fabric and upholstery shampooing",
        basePrice: 599,
        duration: "45 min",
        variants: [
          { id: "v9", name: "1 Seater", price: 599 },
          { id: "v10", name: "3 Seater", price: 1199 },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Pest Control",
    slug: "pest-control",
    image: "/icons/insecticide.png",
    active: true,
    subcategories: [
      {
        id: "s5",
        name: "Cockroach Control",
        slug: "cockroach-control",
        image: "/icons/cockroach-clean.png",
        description: "Gel-based treatment for kitchens",
        basePrice: 699,
        duration: "45 min",
        variants: [
          { id: "v11", name: "1 BHK", price: 699 },
          { id: "v12", name: "2 BHK", price: 999 },
        ],
      },
      {
        id: "s6",
        name: "Termite Control",
        slug: "termite-control",
        image: "/icons/termite-clean.png",
        description: "Drill-fill-seal treatment with warranty",
        basePrice: 2999,
        duration: "2 hrs",
        variants: [
          { id: "v13", name: "Basic (1 year warranty)", price: 2999 },
          { id: "v14", name: "Extended (3 year warranty)", price: 5499 },
        ],
      },
    ],
  },
];

type Ctx = {
  categories: Category[];
  loading: boolean;
  addCategory: (cat: Omit<Category, "id">) => void;
  updateCategory: (id: string, patch: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  toggleActive: (id: string) => void;
  addSubcategory: (categoryId: string, sub: Omit<SubCategory, "id">) => void;
  updateSubcategory: (
    categoryId: string,
    subId: string,
    patch: Partial<SubCategory>
  ) => void;
  deleteSubcategory: (categoryId: string, subId: string) => void;
};

const CategoriesContext = createContext<Ctx | undefined>(undefined);

export function CategoriesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, setCategories] =
    useState<Category[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCategories(JSON.parse(stored));
      } catch {}
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    }
  }, [categories, loading]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setCategories(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const addCategory = useCallback((cat: Omit<Category, "id">) => {
    setCategories((prev) => [
      ...prev,
      { ...cat, id: Date.now().toString() },
    ]);
  }, []);

  const updateCategory = useCallback(
    (id: string, patch: Partial<Category>) => {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
      );
    },
    []
  );

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const toggleActive = useCallback((id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  }, []);

  const addSubcategory = useCallback(
    (categoryId: string, sub: Omit<SubCategory, "id">) => {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                subcategories: [
                  ...c.subcategories,
                  { ...sub, id: Date.now().toString() },
                ],
              }
            : c
        )
      );
    },
    []
  );

  const updateSubcategory = useCallback(
    (categoryId: string, subId: string, patch: Partial<SubCategory>) => {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                subcategories: c.subcategories.map((s) =>
                  s.id === subId ? { ...s, ...patch } : s
                ),
              }
            : c
        )
      );
    },
    []
  );

  const deleteSubcategory = useCallback(
    (categoryId: string, subId: string) => {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                subcategories: c.subcategories.filter(
                  (s) => s.id !== subId
                ),
              }
            : c
        )
      );
    },
    []
  );

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        loading,
        addCategory,
        updateCategory,
        deleteCategory,
        toggleActive,
        addSubcategory,
        updateSubcategory,
        deleteSubcategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) {
    throw new Error("useCategories must be used within CategoriesProvider");
  }
  return ctx;
}