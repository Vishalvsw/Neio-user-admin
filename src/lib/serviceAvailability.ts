import { LOCATIONS } from "@/lib/locations";
import { SERVICES } from "@/lib/services";

export const SERVICE_AVAILABILITY: Record<
  string,
  Record<string, string[]>
> = {
  bangalore: {
    indiranagar: [
      "full-home-cleaning",
      "bathroom-cleaning",
      "kitchen-cleaning",
      "sofa-cleaning",
      "cockroach-control",
      "termite-control",
    ],

    whitefield: [
      "full-home-cleaning",
      "bathroom-cleaning",
      "kitchen-cleaning",
      "sofa-cleaning",
      "cockroach-control",
      "termite-control",
    ],

    koramangala: [
      "full-home-cleaning",
      "bathroom-cleaning",
      "kitchen-cleaning",
      "sofa-cleaning",
      "cockroach-control",
      "termite-control",
    ],

    "hsr-layout": [
      "full-home-cleaning",
      "bathroom-cleaning",
      "kitchen-cleaning",
      "sofa-cleaning",
      "cockroach-control",
      "termite-control",
    ],

    "electronic-city": [
      "full-home-cleaning",
      "bathroom-cleaning",
      "kitchen-cleaning",
      "sofa-cleaning",
      "cockroach-control",
      "termite-control",
    ],

    jayanagar: [
      "full-home-cleaning",
      "bathroom-cleaning",
      "kitchen-cleaning",
      "sofa-cleaning",
      "cockroach-control",
      "termite-control",
    ],

    banashankari: [
      "full-home-cleaning",
      "bathroom-cleaning",
      "kitchen-cleaning",
      "sofa-cleaning",
      "cockroach-control",
      "termite-control",
    ],
  },

  hyderabad: {},
};

export function isServiceAvailable(
  citySlug: string,
  areaSlug: string,
  serviceSlug: string
): boolean {
  return (
    SERVICE_AVAILABILITY[citySlug]?.[areaSlug]?.includes(
      serviceSlug
    ) ?? false
  );
}

export function getServicesForArea(
  citySlug: string,
  areaSlug: string
): string[] {
  return SERVICE_AVAILABILITY[citySlug]?.[areaSlug] ?? [];
}

export function getAreasForService(
  citySlug: string,
  serviceSlug: string
): string[] {
  const cityAvailability =
    SERVICE_AVAILABILITY[citySlug] ?? {};

  return Object.entries(cityAvailability)
    .filter(([, services]) =>
      services.includes(serviceSlug)
    )
    .map(([areaSlug]) => areaSlug);
}

export function validateServiceAvailability(): string[] {
  const errors: string[] = [];

  const citySlugs = new Set(
    LOCATIONS.map((city) => city.slug)
  );

  const serviceSlugs = new Set(
    SERVICES.map((service) => service.slug)
  );

  for (const [citySlug, areas] of Object.entries(
    SERVICE_AVAILABILITY
  )) {
    if (!citySlugs.has(citySlug)) {
      errors.push(
        `Unknown city in service availability: ${citySlug}`
      );
      continue;
    }

    const city = LOCATIONS.find(
      (location) => location.slug === citySlug
    );

    const areaSlugs = new Set(
      city?.areas.map((area) => area.slug) ?? []
    );

    for (const [areaSlug, services] of Object.entries(
      areas
    )) {
      if (!areaSlugs.has(areaSlug)) {
        errors.push(
          `Unknown area "${areaSlug}" under city "${citySlug}"`
        );
      }

      for (const serviceSlug of services) {
        if (!serviceSlugs.has(serviceSlug)) {
          errors.push(
            `Unknown service "${serviceSlug}" under ${citySlug}/${areaSlug}`
          );
        }
      }
    }
  }

  return errors;
}