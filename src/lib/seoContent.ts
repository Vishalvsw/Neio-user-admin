
export interface ServiceContent {
  intro: string;
  quality: string;
  whyChoose: string[];
  coverage: string;
}

interface GenerateServiceContentOptions {
  service: string;
  city: string;
  area?: string;
  areas?: string[];
}

export function generateServiceContent({
  service,
  city,
  area,
  areas = [],
}: GenerateServiceContentOptions): ServiceContent {
  const serviceName = service.trim();
  const serviceLower = serviceName.toLowerCase();
  const cityName = city.trim();

  /*
   * ------------------------------------------------------------
   * AREA + SERVICE PAGE
   * ------------------------------------------------------------
   *
   * Example:
   * /bangalore/whitefield/home-cleaning
   */

  if (area) {
    const areaName = area.trim();

    return {
      intro:
        `${serviceName} services are available in ${areaName}, ${cityName} ` +
        `for homes and residential properties. ` +
        `Customers in ${areaName} can explore the available ${serviceLower} ` +
        `options, pricing and service details before booking.`,

      quality:
        `The ${serviceLower} service is selected according to the property, ` +
        `the areas that require attention and the service option chosen. ` +
        `Service details and pricing are shown before booking so customers ` +
        `can choose an option that suits their requirements.`,

      whyChoose: [
        `Service information and pricing available before booking`,
        `Multiple service options where available`,
        `Online booking for customers in ${areaName}`,
        `Local service coverage in ${cityName}`,
      ],

      coverage:
        `Neoi Home Services provides ${serviceLower} in selected parts of ` +
        `${areaName} and ${cityName}. Availability can vary depending on ` +
        `the exact location and service requirements.`,
    };
  }

  /*
   * ------------------------------------------------------------
   * CITY-LEVEL SERVICE PAGE
   * ------------------------------------------------------------
   *
   * Example:
   * /bangalore/services/cleaning/home-cleaning
   */

  if (areas.length > 0) {
    const areaText = areas
      .slice(0, 6)
      .map((item) => item.trim())
      .filter(Boolean)
      .join(", ");

    return {
      intro:
        `${serviceName} services are available in selected areas of ` +
        `${cityName} for homes and residential properties. ` +
        `Neoi Home Services helps customers explore ${serviceLower} ` +
        `options, service details and pricing before booking.`,

      quality:
        `Available ${serviceLower} options are presented with service ` +
        `details, inclusions and pricing so customers can understand what ` +
        `is offered before choosing a service.`,

      whyChoose: [
        `Clear service and pricing information`,
        `Online booking for available locations`,
        `Multiple service options where available`,
        `Coverage across selected areas of ${cityName}`,
      ],

      coverage:
        `${serviceName} is currently listed in selected areas of ` +
        `${cityName}, including ${areaText}. ` +
        `Availability depends on the customer's exact location and the ` +
        `service selected.`,
    };
  }

  /*
   * ------------------------------------------------------------
   * FALLBACK
   * ------------------------------------------------------------
   *
   * Used when no specific area information is supplied.
   */

  return {
    intro:
      `${serviceName} services are available in ${cityName} for homes ` +
      `and residential properties. Customers can explore available ` +
      `${serviceLower} options, pricing and service details before booking.`,

    quality:
      `Service options are presented with relevant details and pricing ` +
      `so customers can understand the service before making a booking.`,

    whyChoose: [
      `Clear service and pricing information`,
      `Easy online booking`,
      `Multiple service options where available`,
      `Local service coverage`,
    ],

    coverage:
      `Neoi Home Services offers ${serviceLower} in selected locations ` +
      `of ${cityName}. Availability depends on the customer's location ` +
      `and the service selected.`,
  };
}

