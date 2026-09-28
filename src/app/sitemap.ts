import type { MetadataRoute } from "next";

import { CATEGORIES } from "@/lib/categories";
import { LOCATIONS } from "@/lib/locations";
import { SERVICES } from "@/lib/services";
import {
  getAreasForService,
  getServicesForArea,
} from "@/lib/serviceAvailability";

const BASE_URL = "https://neoi.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [];

  /* ==========================================================
     HOMEPAGE
     ========================================================== */

  pages.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
  });

  /* ==========================================================
     CITY + AREA + SERVICE PAGES
     ========================================================== */

  for (const city of LOCATIONS) {
    /* --------------------------------------------------------
       City page
       -------------------------------------------------------- */

    pages.push({
      url: `${BASE_URL}/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });

    /* --------------------------------------------------------
       Area pages
       -------------------------------------------------------- */

    for (const area of city.areas) {
      pages.push({
        url:
          `${BASE_URL}/${city.slug}/${area.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
      });

      /* ------------------------------------------------------
         Available service pages for this area
         ------------------------------------------------------ */

      const availableServices =
        getServicesForArea(
          city.slug,
          area.slug
        );

      for (const serviceSlug of availableServices) {
        pages.push({
          url:
            `${BASE_URL}/${city.slug}` +
            `/${area.slug}/${serviceSlug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }

    /* ========================================================
       SERVICE-LEVEL SEO PAGES
       ======================================================== */

    for (const service of SERVICES) {
      const availableAreas =
        getAreasForService(
          city.slug,
          service.slug
        );

      /*
       * Do not publish pricing, near or guide pages
       * for services that have no configured coverage
       * in this city.
       */
      if (availableAreas.length === 0) {
        continue;
      }

      /* ------------------------------------------------------
         Pricing page
         ------------------------------------------------------ */

      pages.push({
        url:
          `${BASE_URL}/${city.slug}` +
          `/pricing/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.75,
      });

      /* ------------------------------------------------------
         Near-me / local discovery page
         ------------------------------------------------------ */

      pages.push({
        url:
          `${BASE_URL}/${city.slug}` +
          `/near/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.75,
      });

      /* ------------------------------------------------------
         Guide page
         ------------------------------------------------------ */

      pages.push({
        url:
          `${BASE_URL}/${city.slug}` +
          `/guides/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });

      /* ------------------------------------------------------
         Category / subcategory page
         ------------------------------------------------------ */

      if (
        !service.category ||
        !service.subcategory
      ) {
        continue;
      }

      const categoryData =
        CATEGORIES.find(
          (category) =>
            category.slug === service.category
        );

      if (!categoryData) {
        continue;
      }

      const subcategoryData =
        categoryData.subcategories.find(
          (subcategory) =>
            subcategory.slug ===
            service.subcategory
        );

      if (!subcategoryData) {
        continue;
      }

      pages.push({
        url:
          `${BASE_URL}/${city.slug}` +
          `/services/${categoryData.slug}` +
          `/${subcategoryData.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return pages;
}