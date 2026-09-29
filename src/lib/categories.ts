// src/lib/categories.ts

/* ---------- Types ---------- */

export type ServiceVariant = {
  id: string;
  name: string;         // e.g., "1 Bathroom"
  price: number;        // 499
  description?: string; // e.g., "Tiles, fixtures and surfaces"
};

export type SubCategory = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  basePrice: number;
  duration: string;
  variants: ServiceVariant[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  active: boolean;
  subcategories: SubCategory[];
};

/* ---------- Static fallback list ---------- */
/* Legacy pages that import CATEGORIES still work.
   The admin panel controls the real list via CategoriesContext. */

export const CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Cleaning",
    slug: "cleaning",
    image: "",
    active: true,
    subcategories: [
      {
        id: "s1",
        name: "Full Home Cleaning",
        slug: "full-home-cleaning",
        image: "",
        description: "Complete home deep cleaning",
        basePrice: 2499,
        duration: "4 hrs",
        variants: [
          { id: "v1", name: "1 BHK", price: 2499 },
          { id: "v2", name: "2 BHK", price: 3499 },
          { id: "v3", name: "3 BHK", price: 4499 },
        ],
      },
      {
        id: "s2",
        name: "Bathroom Cleaning",
        slug: "bathroom-cleaning",
        image: "",
        description: "Tiles, fixtures and surfaces",
        basePrice: 499,
        duration: "60 min",
        variants: [
          { id: "v4", name: "1 Bathroom", price: 499 },
          { id: "v5", name: "2 Bathrooms", price: 799 },
          { id: "v6", name: "3 Bathrooms", price: 1099 },
        ],
      },
      {
        id: "s3",
        name: "Kitchen Cleaning",
        slug: "kitchen-cleaning",
        image: "",
        description: "Counters, chimney, sink and tiles",
        basePrice: 999,
        duration: "90 min",
        variants: [
          { id: "v7", name: "Standard", price: 999 },
          { id: "v8", name: "Deep Clean", price: 1499 },
        ],
      },
      {
        id: "s4",
        name: "Sofa Cleaning",
        slug: "sofa-cleaning",
        image: "",
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
    image: "",
    active: true,
    subcategories: [
      {
        id: "s5",
        name: "Cockroach Control",
        slug: "cockroach-control",
        image: "",
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
        image: "",
        description: "Drill-fill-seal treatment with warranty",
        basePrice: 2999,
        duration: "2 hrs",
        variants: [
          { id: "v13", name: "Basic (1 year)", price: 2999 },
          { id: "v14", name: "Extended (3 year)", price: 5499 },
        ],
      },
    ],
  },
];


export type ServicePackage = {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  optionsCount?: number;
};

export type ServiceSection = {
  id: string;
  name: string;
  packages: ServicePackage[];
};