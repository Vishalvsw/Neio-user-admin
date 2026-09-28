"use client";

import Image from "next/image";

interface Props {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;

  rating?: number;
  reviews?: number;

  description?: string;
  duration?: string;
  image?: string;

  optionsCount?: number;
  selectedVariantName?: string; // e.g. "1 BHK"
  quantity?: number; // Total units in cart for this service

  onAdd?: () => void;
  onIncrease?: () => void;
  onDecrease?: () => void;
  onOpenOptions?: () => void;
  onViewDetails?: () => void;
}

export default function ServiceCard({
  title,
  price,
  originalPrice,
  rating,
  reviews,
  description,
  duration,
  image,
  optionsCount,
  selectedVariantName,
  quantity = 0,
  onAdd,
  onIncrease,
  onDecrease,
  onOpenOptions,
  onViewDetails,
}: Props) {
  // Calculate discount percentage if original price is provided
  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  const hasVariants = Boolean(optionsCount && optionsCount > 0);

  return (
    <div className="group border border-slate-100 hover:border-indigo-200 rounded-2xl p-5 md:p-6 bg-white shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex gap-4 justify-between items-start">
        {/* LEFT SIDE */}
        <div className="flex-1 min-w-0 pr-2">
          {/* TITLE */}
          <h3 className="font-semibold text-slate-900 text-base md:text-lg leading-snug group-hover:text-indigo-950 transition-colors">
            {title}
          </h3>

          {/* RATING */}
          {rating !== undefined && (
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-100">
                <svg
                  className="w-3.5 h-3.5 fill-indigo-600"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {rating.toFixed(1)}
              </span>
              {reviews !== undefined && (
                <span className="text-slate-500 font-normal">
                  ({reviews.toLocaleString()} reviews)
                </span>
              )}
            </div>
          )}

          {/* DESCRIPTION */}
          {description && (
            <p className="text-xs md:text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* DURATION */}
          {duration && (
            <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-medium mt-2.5">
              <svg
                className="w-3.5 h-3.5 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{duration}</span>
            </div>
          )}

          {/* PRICE */}
          <div className="mt-3.5 flex items-baseline gap-2">
            <span className="text-lg md:text-xl font-bold text-slate-900">
              ₹{price}
            </span>

            {originalPrice !== undefined && (
              <span className="text-xs md:text-sm text-slate-400 line-through">
                ₹{originalPrice}
              </span>
            )}

            {discountPercent && (
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* VIEW DETAILS */}
          <button
            type="button"
            onClick={onViewDetails}
            className="mt-3 text-xs md:text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors block"
          >
            View Details & Reviews
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col items-center shrink-0">
          {/* IMAGE */}
          <div className="w-24 h-24 md:w-28 md:h-28 relative rounded-xl overflow-hidden bg-slate-100 border border-indigo-100/50">
            <Image
              src={image || "/images/reg-home.jpg"}
              alt={title}
              fill
              sizes="112px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* ACTION CONTROL */}
          {hasVariants ? (
            /* VARIANT FLOW: Opens variant modal to manage multi-option selections */
            <button
              type="button"
              onClick={onOpenOptions || onAdd}
              className={`mt-3 w-full border font-medium px-3 py-2 rounded-lg text-xs md:text-sm transition shadow-xs flex items-center justify-center gap-1 ${
                quantity > 0
                  ? "border-indigo-600 bg-indigo-50 text-indigo-800 hover:bg-indigo-100"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 border-transparent"
              }`}
            >
              {quantity > 0 ? (
                <>
                  <span>
                    {selectedVariantName ? selectedVariantName : "Edit"}
                  </span>
                  <span className="bg-indigo-700 text-white rounded-full text-[10px] w-4 h-4 inline-flex items-center justify-center font-bold ml-0.5">
                    {quantity}
                  </span>
                </>
              ) : (
                "Add"
              )}
            </button>
          ) : quantity > 0 ? (
            /* NON-VARIANT STEPPER: Direct counter control */
            <div className="mt-3 flex items-center justify-between bg-indigo-50 border border-indigo-600 rounded-lg w-20 md:w-24 px-1.5 py-1 text-indigo-700 font-bold text-xs md:text-sm shadow-xs">
              <button
                type="button"
                onClick={onDecrease}
                className="w-5 h-5 flex items-center justify-center hover:bg-indigo-200/60 rounded transition active:scale-95"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="select-none text-indigo-950 font-bold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={onIncrease || onAdd}
                className="w-5 h-5 flex items-center justify-center hover:bg-indigo-200/60 rounded transition active:scale-95"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            /* DIRECT ADD BUTTON */
            <button
              type="button"
              onClick={onAdd}
              className="mt-3 w-full bg-indigo-600 text-white font-medium px-5 py-2 rounded-lg text-xs md:text-sm hover:bg-indigo-700 active:scale-[0.98] transition shadow-sm hover:shadow-md"
            >
              Add
            </button>
          )}

          {/* DYNAMIC OPTIONS / SELECTED BADGE */}
          {hasVariants && (
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full mt-2 text-center border transition-colors ${
                quantity > 0
                  ? "bg-indigo-100 text-indigo-900 border-indigo-300 font-semibold"
                  : "bg-indigo-50 text-indigo-800 border-indigo-100/60"
              }`}
            >
              {quantity > 0
                ? selectedVariantName
                  ? `${selectedVariantName} selected`
                  : `${quantity} selected`
                : `${optionsCount} options`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}