"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { SERVICE_REGISTRY } from "@/lib/serviceRegistry";
import { useCity } from "@/context/CityContext";

const SERVICE_META: Record<
  string,
  {
    title: string;
    category: string;
    keywords: string[];
  }
> = {
  "full-home-cleaning": {
    title: "Full Home Cleaning",
    category: "cleaning",
    keywords: [
      "home",
      "home cleaning",
      "house",
      "house cleaning",
      "deep cleaning",
      "full home",
      "full house",
      "apartment",
      "villa",
      "residential cleaning",
      "post construction",
    ],
  },

  "bathroom-cleaning": {
    title: "Bathroom Cleaning",
    category: "cleaning",
    keywords: [
      "bathroom",
      "bath",
      "toilet",
      "washroom",
      "bathroom cleaning",
    ],
  },

  "kitchen-cleaning": {
    title: "Kitchen Cleaning",
    category: "cleaning",
    keywords: [
      "kitchen",
      "kitchen cleaning",
      "grease cleaning",
      "kitchen deep cleaning",
    ],
  },

  "sofa-cleaning": {
    title: "Sofa Cleaning",
    category: "cleaning",
    keywords: [
      "sofa",
      "couch",
      "sofa cleaning",
      "upholstery",
    ],
  },

  "cockroach-control": {
    title: "Cockroach Control",
    category: "pest-control",
    keywords: [
      "cockroach",
      "cockroach control",
      "pest",
      "pest control",
      "insect control",
    ],
  },

  "termite-control": {
    title: "Termite Control",
    category: "pest-control",
    keywords: [
      "termite",
      "termite control",
      "pest",
      "pest control",
      "wood pest",
    ],
  },
};

const suggestions = [
  "Search for Home Cleaning",
  "Search for Bathroom Cleaning",
  "Search for Pest Control",
];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export default function HeaderSearch() {
  const router = useRouter();
  const { city } = useCity();

  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState(suggestions[0]);
  const [index, setIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  /*
   * Rotate placeholder text.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) =>
        prev === suggestions.length - 1 ? 0 : prev + 1
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setPlaceholder(suggestions[index]);
  }, [index]);

  /*
   * Close dropdown when clicking outside.
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
   * Build searchable service list from SERVICE_REGISTRY.
   */
  const searchableServices = useMemo(() => {
    return Object.entries(SERVICE_REGISTRY).map(
      ([serviceId, service]) => {
        const meta = SERVICE_META[serviceId];

        const sectionText =
          service.sections
            ?.map((section) => {
              const servicesText =
                section.services
                  ?.map(
                    (item) =>
                      `${item.title} ${item.description ?? ""}`
                  )
                  .join(" ") ?? "";

              return `${section.title} ${servicesText}`;
            })
            .join(" ") ?? "";

        return {
          id: serviceId,
          title: meta?.title ?? serviceId,
          category: meta?.category ?? "cleaning",
          keywords: meta?.keywords ?? [],
          searchText: normalize(
            `${meta?.title ?? ""} ${
              meta?.keywords?.join(" ") ?? ""
            } ${sectionText}`
          ),
        };
      }
    );
  }, []);

  /*
   * Find matching services.
   */
  const results = useMemo(() => {
    const search = normalize(query);

    if (!search) {
      return [];
    }

    return searchableServices.filter((service) => {
      const title = normalize(service.title);

      if (title.includes(search)) {
        return true;
      }

      if (
        service.keywords.some((keyword) =>
          normalize(keyword).includes(search)
        )
      ) {
        return true;
      }

      return service.searchText.includes(search);
    });
  }, [query, searchableServices]);

  const showDropdown =
    isFocused && query.trim().length > 0;

  function openService(serviceId: string, category: string) {
    const selectedCity = city || "bangalore";

    setIsFocused(false);
    setQuery("");

    router.push(
      `/${selectedCity}/services/${category}/${serviceId}`
    );
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    if (results.length > 0) {
      const firstResult = results[0];

      openService(
        firstResult.id,
        firstResult.category
      );
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full"
    >
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsFocused(true);
        }}
        onKeyDown={handleKeyDown}
        className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-2 outline-none transition"
        autoComplete="off"
      />

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          {results.length > 0 ? (
            <div className="py-2">
              <p className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                Services
              </p>

              {results.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    openService(
                      service.id,
                      service.category
                    );
                  }}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-gray-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    {service.category === "pest-control"
                      ? "🛡️"
                      : "✨"}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {service.title}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      {service.category === "pest-control"
                        ? "Pest Control"
                        : "Home Cleaning"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-5">
              <p className="text-sm font-medium text-gray-900">
                No services found
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Try searching for home, bathroom,
                kitchen, sofa, pest, cockroach or termite.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}