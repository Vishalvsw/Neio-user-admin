interface Props {
  city: string;
}

export default function LocalBusinessSchema({
  city,
}: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",

    "@id": `https://neoi.in/${city}#business`,

    name: "Neoi Home Services",

    url: `https://neoi.in/${city}`,

    image: "https://neoi.in/og-image.jpg",

    logo: "https://neoi.in/logo.png",

    description:
      "Professional home cleaning, painting, pest control and maintenance services.",

    telephone: "+91-XXXXXXXXXX", // Replace after launch

    priceRange: "₹₹",

    areaServed: {
      "@type": "City",
      name: city.charAt(0).toUpperCase() + city.slice(1),
    },

    address: {
      "@type": "PostalAddress",
      addressLocality:
        city.charAt(0).toUpperCase() + city.slice(1),

      addressRegion: "Karnataka",

      addressCountry: "IN",
    },

    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "08:00",
        closes: "20:00",
      },
    ],
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