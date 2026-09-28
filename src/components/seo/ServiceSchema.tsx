interface Props {
  city: string;
  serviceName: string;
  url: string;
  price?: string;
}

export default function ServiceSchema({
  city,
  serviceName,
  url,
  price,
}: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: serviceName,

    serviceType: serviceName,

    areaServed: {
      "@type": "City",
      name: city.charAt(0).toUpperCase() + city.slice(1),
    },

    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: "Neoi Home Services",
      url: "https://neoi.in",
    },

    offers: {
      "@type": "Offer",
      url,
      price: price ?? "",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}