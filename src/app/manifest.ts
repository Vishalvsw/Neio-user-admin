import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Neoi Home Services",

    short_name: "Neoi",

    description:
      "Professional Home Cleaning, Painting, Pest Control and Home Maintenance Services.",

    start_url: "/",

    display: "standalone",

    background_color: "#ffffff",

    theme_color: "#ffffff",

    orientation: "portrait",

    lang: "en-IN",

    categories: [
      "business",
      "home",
      "lifestyle",
    ],

    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
  };
}