

import Link from "next/link";
import { LOCATIONS } from "@/lib/locations";
import { SERVICES } from "@/lib/services";
import { getAreasForService } from "@/lib/serviceAvailability";

const getFirstAvailableArea = (citySlug: string, serviceSlug: string) => {
  const city = LOCATIONS?.find((item) => item.slug === citySlug);
  if (!city) return undefined;

  return city.areas?.find((area) =>
    getAreasForService(citySlug, serviceSlug)?.includes(area.slug)
  );
};

export default function Footer() {
  // Safe filtering for cities with available services
  const citiesWithServices = (LOCATIONS || []).filter((city) =>
    city.areas?.some(
      (area) => getAreasForService(city.slug, area.slug)?.length > 0
    )
  );

  // Map services to valid links or fallback routes
  const servicesWithLinks = (SERVICES || []).map((service) => {
    for (const city of citiesWithServices) {
      const area = getFirstAvailableArea(city.slug, service.slug);
      if (area) {
        return {
          service,
          city,
          area,
          href: `/${city.slug}/${area.slug}/${service.slug}`,
        };
      }
    }
    return {
      service,
      city: null,
      area: null,
      href: "/bangalore",
    };
  });

  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600 text-sm">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        {/* Brand Summary Header */}
        <div className="mb-10 pb-8 border-b border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              Neoi<span className="text-indigo-600">.</span>
            </span>
            <p className="text-xs text-slate-500 mt-1 max-w-sm font-medium">
              Home services with clear service details and online booking.
            </p>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* SERVICES */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">
              Our Services
            </h3>
            <ul className="space-y-2.5">
              {servicesWithLinks.length > 0 ? (
                servicesWithLinks.map(({ service, href }) => (
                  <li key={service.slug}>
                    <Link
                      href={href}
                      className="hover:text-indigo-600 transition-colors duration-150"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/bangalore" className="hover:text-indigo-600 transition-colors">
                      Cleaning Services
                    </Link>
                  </li>
                  <li>
                    <Link href="/bangalore" className="hover:text-indigo-600 transition-colors">
                      Pest Control
                    </Link>
                  </li>
                  <li>
                    <Link href="/bangalore" className="hover:text-indigo-600 transition-colors">
                      Appliance Repair
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* CITIES */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">
              Cities We Serve
            </h3>
            <ul className="space-y-2.5">
              {citiesWithServices.length > 0 ? (
                citiesWithServices.map((city) => (
                  <li key={city.slug}>
                    <Link
                      href={`/${city.slug}`}
                      className="hover:text-indigo-600 transition-colors duration-150"
                    >
                      Home Services in {city.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/bangalore" className="hover:text-indigo-600 transition-colors">
                      Bengaluru
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="hover:text-indigo-600 transition-colors duration-150"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/investors"
                  className="hover:text-indigo-600 transition-colors duration-150"
                >
                  Investor Relations
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-indigo-600 transition-colors duration-150"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-indigo-600 transition-colors duration-150"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/anti-discrimination"
                  className="hover:text-indigo-600 transition-colors duration-150"
                >
                  Anti-Discrimination Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* CUSTOMER AREA */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">
              Customer Area
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/orders"
                  className="hover:text-indigo-600 transition-colors duration-150"
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="hover:text-indigo-600 transition-colors duration-150"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-indigo-600 transition-colors duration-150"
                >
                  Login / Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT & FOOTNOTE */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 text-center text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© {new Date().getFullYear()} Neoi Home Services. All rights reserved.</p>
          <p className="font-medium text-slate-500">Made with quality & care.</p>
        </div>
      </div>
    </footer>
  );
}


