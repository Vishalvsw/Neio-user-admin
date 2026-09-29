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
          { id: "v1", name: "1 Bathroom", price: 499 },
          { id: "v2", name: "2 Bathrooms", price: 799 },
          { id: "v3", name: "3 Bathrooms", price: 1099 },
        ],
        sections: [],
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
          { id: "v4", name: "Standard Kitchen", price: 999 },
          { id: "v5", name: "Deep Kitchen", price: 1499 },
        ],
        sections: [],
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
        sections: [
          {
            id: "sec1",
            name: "Apartment",
            packages: [
              {
                id: "pkg1",
                title: "Furnished Apartment Cleaning",
                description: "Complete cleaning for occupied furnished apartments.",
                duration: "2-3 hours",
                price: 1799,
                image: "",
                optionsCount: 3,
              },
              {
                id: "pkg2",
                title: "Unfurnished Apartment Cleaning",
                description: "Deep cleaning for empty apartments before move-in.",
                duration: "2 hours",
                price: 1299,
                image: "",
                optionsCount: 2,
              },
            ],
          },
          {
            id: "sec2",
            name: "Villa",
            packages: [
              {
                id: "pkg3",
                title: "Villa Deep Cleaning",
                description: "Complete villa cleaning with exterior surfaces.",
                duration: "4-5 hours",
                price: 3499,
                image: "",
                optionsCount: 3,
              },
            ],
          },
          {
            id: "sec3",
            name: "Post Construction",
            packages: [
              {
                id: "pkg4",
                title: "Post Construction Cleaning",
                description: "Removes paint stains, cement marks and debris.",
                duration: "5 hours",
                price: 4499,
                image: "",
                optionsCount: 2,
              },
            ],
          },
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
        sections: [],
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
        sections: [],
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
        sections: [],
      },
    ],
  },
  {
    id: "3",
    name: "Painting",
    slug: "painting",
    image: "/icons/paint-roller.png",
    active: true,
    subcategories: [
      {
        id: "s7",
        name: "Interior Wall Painting",
        slug: "interior-wall-painting",
        image: "/icons/painting.png",
        description: "Interior wall painting with premium emulsion",
        basePrice: 15000,
        duration: "2-4 days",
        variants: [],
        sections: [
          {
            id: "sec-1bhk",
            name: "1 BHK",
            packages: [
              {
                id: "pkg-1bhk-basic",
                title: "1 BHK Basic Painting",
                description: "2 coats of emulsion paint on all interior walls.",
                duration: "2 days",
                price: 15000,
                image: "",
                optionsCount: 2,
              },
              {
                id: "pkg-1bhk-premium",
                title: "1 BHK Premium Painting",
                description: "2 coats of premium emulsion + primer.",
                duration: "3 days",
                price: 22000,
                image: "",
                optionsCount: 2,
              },
            ],
          },
          {
            id: "sec-2bhk",
            name: "2 BHK",
            packages: [
              {
                id: "pkg-2bhk-basic",
                title: "2 BHK Basic Painting",
                description: "2 coats of emulsion paint on all interior walls.",
                duration: "3 days",
                price: 24000,
                image: "",
                optionsCount: 2,
              },
              {
                id: "pkg-2bhk-premium",
                title: "2 BHK Premium Painting",
                description: "2 coats of premium emulsion + primer.",
                duration: "4 days",
                price: 34000,
                image: "",
                optionsCount: 2,
              },
            ],
          },
          {
            id: "sec-3bhk",
            name: "3 BHK",
            packages: [
              {
                id: "pkg-3bhk-basic",
                title: "3 BHK Basic Painting",
                description: "2 coats of emulsion paint on all interior walls.",
                duration: "4 days",
                price: 32000,
                image: "",
                optionsCount: 2,
              },
              {
                id: "pkg-3bhk-premium",
                title: "3 BHK Premium Painting",
                description: "2 coats of premium emulsion + primer.",
                duration: "5 days",
                price: 44000,
                image: "",
                optionsCount: 2,
              },
            ],
          },
          {
            id: "sec-villa",
            name: "Villa",
            packages: [
              {
                id: "pkg-villa-interior",
                title: "Villa Interior Painting",
                description: "Complete interior painting with premium finish.",
                duration: "6 days",
                price: 65000,
                image: "",
                optionsCount: 3,
              },
              {
                id: "pkg-villa-full",
                title: "Villa Full Painting",
                description: "Interior + exterior with weatherproof paint.",
                duration: "10 days",
                price: 110000,
                image: "",
                optionsCount: 3,
              },
            ],
          },
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

function normalize(cats: Category[]): Category[] {
  return cats.map((c) => ({
    ...c,
    subcategories: (c.subcategories ?? []).map((s) => ({
      ...s,
      variants: s.variants ?? [],
      sections: s.sections ?? [],
    })),
  }));
}

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
        setCategories(normalize(JSON.parse(stored)));
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
          setCategories(normalize(JSON.parse(e.newValue)));
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
                  {
                    ...sub,
                    id: Date.now().toString(),
                    variants: sub.variants ?? [],
                    sections: sub.sections ?? [],
                  },
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