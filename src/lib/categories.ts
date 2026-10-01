// src/lib/categories.ts

export type ServiceVariant = {
  id: string;
  name: string;
  price: number;
  description?: string;
};

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

export type SubCategory = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  basePrice: number;
  duration: string;
  variants: ServiceVariant[];
  sections: ServiceSection[];
  banner?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  active: boolean;
  subcategories: SubCategory[];
};

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
        sections: [],
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
        sections: [],
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
        sections: [],
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
        sections: [],
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
        sections: [],
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
        sections: [],
      },
    ],
  },
  {
    id: "3",
    name: "Painting",
    slug: "painting",
    image: "",
    active: true,
    subcategories: [
      {
        id: "s7",
        name: "Interior Wall Painting",
        slug: "interior-wall-painting",
        image: "",
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
            ],
          },
        ],
      },
    ],
  },
];
