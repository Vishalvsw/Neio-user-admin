"use client";

import Image from "next/image";

interface Props {
  title: string;
  image?: string;
}

export default function ServiceBanner({ title, image }: Props) {
  return (
    <div className="rounded-2xl overflow-hidden border border-indigo-100 bg-gradient-to-r from-indigo-50/90 via-indigo-50/40 to-white shadow-sm">
      <div className="grid md:grid-cols-2 items-center">
        <div className="hidden md:block p-6 lg:p-8">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            {title}
          </h2>

          <p className="text-xs lg:text-sm text-slate-600 mt-2 leading-relaxed">
            Review the service details, available options and pricing before
            adding a service to your cart.
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-slate-700">
            <span className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-1.5">
              Service details
            </span>
            <span className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-1.5">
              Pricing shown before checkout
            </span>
          </div>
        </div>

        <div className="hidden md:block h-full relative min-h-[260px] border-l border-indigo-100/60">
          <Image
            src={image || "/images/banner-home.png"}
            alt={title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/30 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
