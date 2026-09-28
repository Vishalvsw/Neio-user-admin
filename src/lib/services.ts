
import { Service } from "@/types/service";

export const SERVICES: Service[] = [
  // ============================================================
  // CLEANING
  // ============================================================

  {
    slug: "full-home-cleaning",
    name: "Full Home Cleaning",
    category: "cleaning",
    subcategory: "full-home-cleaning",

    description:
      "Professional full home cleaning for apartments and houses, including floor cleaning, bathroom cleaning, kitchen cleaning and dust removal.",

    basePrice: 2499,
    duration: "3-4 hours",

    includes: [
      "Full home dusting",
      "Floor scrubbing",
      "Bathroom deep cleaning",
      "Kitchen degreasing",
    ],

    faqs: [
      {
        question: "How long does full home cleaning take?",
        answer:
          "Full home cleaning typically takes 3 to 4 hours depending on the size and condition of the home.",
      },
      {
        question: "Do you bring cleaning equipment?",
        answer:
          "Yes. Our cleaning professionals bring the necessary cleaning equipment and cleaning solutions for the service.",
      },
    ],
  },

  {
    slug: "bathroom-cleaning",
    name: "Bathroom Cleaning",
    category: "cleaning",
    subcategory: "bathroom-cleaning",

    description:
      "Professional bathroom cleaning including tile scrubbing, toilet cleaning, stain removal and surface sanitization.",

    basePrice: 499,
    duration: "1 hour",

    includes: [
      "Tile scrubbing",
      "WC deep cleaning",
      "Fittings stain removal",
      "Surface sanitization",
    ],

    faqs: [
      {
        question: "Is hard water stain removal included?",
        answer:
          "Yes. Mild to moderate hard water stains on suitable tiles and bathroom fittings are treated as part of the cleaning service.",
      },
    ],
  },

  {
    slug: "kitchen-cleaning",
    name: "Kitchen Cleaning",
    category: "cleaning",
    subcategory: "kitchen-cleaning",

    description:
      "Professional kitchen cleaning covering grease, tiles, countertops, cabinets and other suitable kitchen surfaces.",

    basePrice: 799,
    duration: "1-2 hours",

    includes: [
      "Kitchen surface cleaning",
      "Tile cleaning",
      "Grease removal",
      "Countertop cleaning",
    ],

    faqs: [
      {
        question: "Does kitchen cleaning include grease removal?",
        answer:
          "Yes. The service includes treatment of normal kitchen grease and buildup from suitable surfaces.",
      },
    ],
  },

  {
    slug: "sofa-cleaning",
    name: "Sofa Cleaning",
    category: "cleaning",
    subcategory: "sofa-cleaning",

    description:
      "Professional sofa cleaning for fabric and suitable upholstery using appropriate cleaning and vacuuming methods.",

    basePrice: 999,
    duration: "1-2 hours",

    includes: [
      "Dry vacuuming",
      "Foam shampooing",
      "Stain treatment",
      "Odor removal",
    ],

    faqs: [
      {
        question: "How long does sofa cleaning take?",
        answer:
          "Sofa cleaning typically takes 1 to 2 hours depending on the number and condition of the seats.",
      },
    ],
  },

  // ============================================================
  // PEST CONTROL
  // ============================================================

  {
    slug: "cockroach-control",
    name: "Cockroach Control",
    category: "pest-control",
    subcategory: "cockroach-control",

    description:
      "Professional cockroach control treatment for homes and apartments to help reduce cockroach activity.",

    basePrice: 699,
    duration: "1 hour",

    includes: [
      "Inspection",
      "Targeted treatment",
      "Kitchen and bathroom treatment",
      "Basic follow-up guidance",
    ],

    faqs: [
      {
        question: "How long does cockroach control take?",
        answer:
          "A typical cockroach control treatment takes around one hour, depending on the size and condition of the property.",
      },
    ],
  },

  {
    slug: "termite-control",
    name: "Termite Control",
    category: "pest-control",
    subcategory: "termite-control",

    description:
      "Professional termite control treatment for residential properties affected by termite activity.",

    basePrice: 1499,
    duration: "1-2 hours",

    includes: [
      "Property inspection",
      "Termite activity assessment",
      "Targeted treatment",
      "Treatment guidance",
    ],

    faqs: [
      {
        question: "How does termite control work?",
        answer:
          "The service begins with an inspection to identify termite activity, followed by an appropriate treatment based on the property and infestation.",
      },
    ],
  },
];

