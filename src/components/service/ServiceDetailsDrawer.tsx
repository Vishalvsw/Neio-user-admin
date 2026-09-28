"use client";

import type { ServicePackage } from "@/types/service";

interface Props {
  service: ServicePackage | null;
  onClose: () => void;
}

export default function ServiceDetailsDrawer({
  service,
  onClose,
}: Props) {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* DRAWER */}
      <div
        className="
          relative
          bg-white
          w-full
          max-h-[85vh]
          rounded-t-2xl
          shadow-2xl
          flex
          flex-col
          animate-modalSlide
        "
      >
        {/* DRAG HANDLE */}
        <div className="flex justify-center pt-3">
          <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {service.title}
          </h2>

          <button
            onClick={onClose}
            aria-label="Close service details"
            className="text-gray-500 text-lg hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-20">
          {/* DESCRIPTION */}
          {service.description && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                About This Service
              </h4>

              <p className="text-sm text-gray-600 leading-6">
                {service.description}
              </p>
            </div>
          )}

          {/* INCLUDED */}
          {service.includes && service.includes.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                What's Included
              </h4>

              <ul className="space-y-1 text-sm text-gray-600">
                {service.includes.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* EXCLUDED */}
          {service.excludes && service.excludes.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                What's Not Included
              </h4>

              <ul className="space-y-1 text-sm text-gray-600">
                {service.excludes.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* VARIANTS */}
          {service.variants.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Available Options
              </h4>

              <div className="space-y-2">
                {service.variants.map((variant) => (
                  <div
                    key={variant.name}
                    className="
                      flex
                      items-center
                      justify-between
                      border
                      border-gray-200
                      rounded-lg
                      px-4
                      py-3
                    "
                  >
                    <span className="text-sm text-gray-700">
                      {variant.name}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        ₹{variant.price}
                      </span>

                      {variant.originalPrice !== undefined && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{variant.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RATINGS */}
          {service.ratingsBreakdown && service.ratingsBreakdown.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Ratings</h4>

              <div className="space-y-2 text-sm">
                {service.ratingsBreakdown.map((rating) => (
                  <div key={rating.stars} className="flex items-center gap-2">
                    <span className="w-7">{rating.stars}★</span>

                    <div className="flex-1 bg-gray-200 h-2 rounded">
                      <div
                        className="bg-green-500 h-2 rounded"
                        style={{
                          width: `${rating.percent}%`,
                        }}
                      />
                    </div>

                    <span className="w-10 text-right text-gray-500">
                      {rating.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}