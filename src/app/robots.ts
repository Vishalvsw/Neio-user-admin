import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/account/",
        "/cart/",
        "/checkout/",
        "/orders/",
        "/login/",
        "/address/",
        "/book/",
        "/success/",
      ],
    },
    sitemap: "https://neoi.in/sitemap.xml",
  };
}