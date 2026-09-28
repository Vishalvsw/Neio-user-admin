export default function TrustSection() {
  const points = [
    {
      title: "Clear Service Details",
      description:
        "Review service information and listed inclusions before booking.",
    },
    {
      title: "Listed Starting Prices",
      description:
        "See the starting price shown for each available service.",
    },
    {
      title: "Location-Based Availability",
      description:
        "Services are shown according to the configured service coverage.",
    },
    {
      title: "Online Booking",
      description:
        "Choose a service and continue through the online booking flow.",
    },
  ];

  return (
    <section className="border-b border-gray-100 py-10">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-5 md:grid-cols-4">
          {points.map((point) => (
            <div
              key={point.title}
              className="rounded-lg border border-gray-200 p-5"
            >
              <h3 className="font-medium text-gray-900">
                {point.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}