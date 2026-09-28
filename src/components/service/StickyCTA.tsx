"use client";

import Link from "next/link";

interface StickyCTAProps {
  city: string;
  area: string;
  service: string;
  price: number;
  serviceName: string;
}

export default function StickyCTA({
  price,
  serviceName,
}: StickyCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden border-t border-gray-200 bg-white p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-500">Starting from</p>
          <p className="font-semibold text-gray-900">₹{price}</p>
        </div>

        <Link
          href="/checkout"
          className="flex-1 text-center rounded-md bg-black py-3 text-white font-medium hover:opacity-90 transition"
        >
          Book {serviceName}
        </Link>
      </div>
    </div>
  );
}
