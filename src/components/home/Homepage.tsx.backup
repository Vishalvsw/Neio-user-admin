"use client";

import CategoryGrid from "@/components/category/CategoryGrid";
import BannerSlider from "@/components/home/BannerSlider";
import Link from "next/link";
import { useCity } from "@/context/CityContext";
import { useSettings } from "@/context/SettingsContext";
import Image from "next/image";
import { ShieldCheck, IndianRupee, Award, Zap } from "lucide-react";

export default function HomePage() {
  const { city } = useCity();
  const currentCity = city || "bangalore";
  const { settings } = useSettings();

  return (
    <div className="bg-white">
      {/* DESKTOP HERO — hardcoded, not admin-controlled */}
      <section className="hidden md:block relative bg-gradient-to-b from-indigo-100/70 via-indigo-50/30 to-white pt-12 pb-14 overflow-hidden">
        <div className="absolute -top-20 left-1/3 w-[450px] h-[450px] bg-indigo-300/30 opacity-40 blur-3xl rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-6 grid grid-cols-12 gap-6 items-center">
          <div className="col-span-7 text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-semibold text-indigo-900 bg-indigo-100 rounded-full">
              <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              Local home services
            </span>

            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Expert Home Services <br />
              <span className="text-indigo-600">On Demand.</span>
            </h1>

            <p className="mt-3 text-slate-600 text-base font-medium max-w-md">
              Clear service details and upfront pricing.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <Link
                href="#categories"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200"
              >
                Browse a Service
              </Link>
            </div>
          </div>

          <div className="col-span-5 relative">
            <div className="relative mx-auto w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white shadow-xl group">
              <Image
                src="/images/cleaning-neoi.png"
                alt="Neoi Professional Cleaning Team"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 480px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-indigo-100 shadow-md flex items-center gap-2">
                <span className="text-xs font-extrabold text-indigo-600">
                  Service details
                </span>
                <span className="text-[11px] font-semibold text-slate-700">
                  See available options
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY GRID — admin-controlled via CategoriesContext */}
      <section id="categories" className="py-10 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="border-l-4 border-indigo-600 pl-4 mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              What are you looking for?
            </h2>
          </div>

          <CategoryGrid />
        </div>
      </section>

      {/* OFFER SLIDER — respects admin's "Show Offers Banner" toggle */}
      {settings.showBanners !== false && (
        <section className="relative bg-gradient-to-b from-indigo-100/60 via-indigo-50/40 to-white py-12 border-y border-indigo-200/60 overflow-hidden">
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-3 w-3 rounded-full bg-indigo-600 animate-pulse" />
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                Best Offers Available Now
              </h2>
            </div>

            <BannerSlider />
          </div>
        </section>
      )}

      {/* MOST BOOKED SERVICES — hardcoded for now */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="border-l-4 border-indigo-600 pl-4 mb-8">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Most Booked Services
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                title: "Bathroom Cleaning",
                price: "Starting ₹799",
                image: "/images/bathroom-cleaning-1.png",
                href: `/${currentCity}/services/cleaning/bathroom-cleaning`,
              },
              {
                title: "Kitchen Cleaning",
                price: "Starting ₹999",
                image: "/icons/kitchen.png",
                href: `/${currentCity}/services/cleaning/kitchen-cleaning`,
              },
              {
                title: "Full Home Cleaning",
                price: "Starting ₹2499",
                image: "/icons/house.png",
                href: `/${currentCity}/services/cleaning/full-home-cleaning`,
              },
              {
                title: "Cockroach Control",
                price: "Starting ₹699",
                image: "/icons/cockroach-clean.png",
                href: `/${currentCity}/services/pest-control/cockroach-control`,
              },
            ].map((service, i) => (
              <Link
                key={i}
                href={service.href}
                className="group bg-white rounded-2xl border-2 border-indigo-100 shadow-sm hover:border-indigo-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 p-5 text-center"
              >
                <div className="p-3 rounded-xl bg-indigo-50/80 group-hover:bg-indigo-100/80 transition-colors w-20 h-20 mx-auto flex items-center justify-center mb-4">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-14 w-14 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>

                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-900 transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs font-bold text-indigo-700 mt-1.5 bg-indigo-50 inline-block px-2.5 py-1 rounded-md border border-indigo-200/60">
                  {service.price}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="py-12 md:py-16 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase">
              Why Choose Neoi
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              Built on Quality & Trust
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: ShieldCheck,
                title: "Service information",
                desc: "View service details, inclusions and pricing before booking",
              },
              {
                icon: IndianRupee,
                title: "Transparent Pricing",
                desc: "Fixed upfront rates with zero hidden fees",
              },
              {
                icon: Award,
                title: "Clear service details",
                desc: "Review what is included before you book",
              },
              {
                icon: Zap,
                title: "Flexible scheduling",
                desc: "Choose an available date and time during checkout",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="group bg-slate-50/60 hover:bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm text-slate-900 group-hover:text-indigo-900 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs font-normal text-slate-500 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CUSTOMER STORIES — respects admin toggle */}
      {settings.showTeamHighlights !== false && (
        <section className="py-16 md:py-20 bg-white">
          <div className="mx-auto max-w-6xl px-6">
            <div className="border-l-4 border-indigo-600 pl-4 mb-8">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                Customer Stories
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Festive Home Makeover",
                  image: "/stories/story-1.png",
                },
                {
                  title: "Deep Clean Before Moving",
                  image: "/stories/story-2.png",
                },
                {
                  title: "Pest-Free Home Transformation",
                  image: "/stories/story-3.png",
                },
              ].map((story, i) => (
                <Link
                  key={i}
                  href="#"
                  className="group rounded-2xl overflow-hidden border-2 border-slate-100 hover:border-indigo-600 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/600x400/eeeeee/cccccc?text=Story";
                      }}
                    />
                  </div>

                  <div className="p-5 bg-white">
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-600 mt-2">
                      See how Neoi transformed this home.
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}