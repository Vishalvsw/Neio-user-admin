import { City } from "@/types/location";

export const LOCATIONS: City[] = [
  {
    slug: "bangalore",
    name: "Bangalore",
    areas: [
      { slug: "indiranagar", name: "Indiranagar" },
      { slug: "whitefield", name: "Whitefield" },
      { slug: "koramangala", name: "Koramangala" },
      { slug: "hsr-layout", name: "HSR Layout" },
      { slug: "electronic-city", name: "Electronic City" },
      { slug: "jayanagar", name: "Jayanagar" },
      { slug: "banashankari", name: "Banashankari" }
    ],
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    areas: [
      { slug: "gachibowli", name: "Gachibowli" },
      { slug: "madhapur", name: "Madhapur" },
      { slug: "kondapur", name: "Kondapur" },
      { slug: "banjara-hills", name: "Banjara Hills" },
      { slug: "jubilee-hills", name: "Jubilee Hills" },
      { slug: "hitech-city", name: "Hitech City" }
    ],
  },
];