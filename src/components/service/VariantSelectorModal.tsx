"use client";

import { useCart } from "@/context/CartContext";
import { useEffect } from "react";
import { useCity } from "@/context/CityContext";

interface Variant {
  name: string;
  price: number;
  originalPrice?: number;
}

interface Service {
  id: string;
  title: string;
  variants: Variant[];
}

interface Props {
  service: Service | null;
  onClose: () => void;
}

export default function VariantSelectorModal({
  service,
  onClose,
}: Props) {
  const { items, addItem, increase, decrease } = useCart();
  const { area } = useCity();

  /* Lock body scroll when modal is open */
  useEffect(() => {
    if (!service) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [service]);

  /*
   * Nothing to render when no service is selected.
   */
  if (!service) {
    return null;
  }

  /*
   * Add a selected variant to the cart.
   */
  function handleAdd(variant: Variant) {
    /*
     * Explicit null check keeps TypeScript happy
     * because handleAdd is a nested function.
     */
    if (!service) {
      return;
    }

    if (!area) {
      alert("Please select your area before booking service");
      return;
    }

    const itemId = `${service.id}-${variant.name}`;

    addItem({
      id: itemId,
      title: `${service.title} (${variant.name})`,
      price: variant.price,
    });
  }

  /*
   * Check whether any variant belonging to this
   * service is already in the cart.
   */
  const selectedVariants = service.variants.filter((variant) => {
    const variantId = `${service.id}-${variant.name}`;

    return items.some(
      (item) =>
        item.id === variantId &&
        item.quantity > 0
    );
  });

  const hasSelection = selectedVariants.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* MODAL CONTAINER */}
      <div
        className="
          relative
          flex
          h-[80vh]
          w-full
          flex-col
          rounded-t-2xl
          bg-white
          shadow-2xl
          animate-modalSlide
          md:h-auto
          md:max-h-[85vh]
          md:max-w-md
          md:rounded-xl
          md:animate-modalFade
        "
      >
        {/* DRAG HANDLE - MOBILE */}
        <div className="flex shrink-0 justify-center pt-3 md:hidden">
          <div className="h-1.5 w-10 rounded-full bg-indigo-200" />
        </div>

        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-indigo-100 px-6 pb-3 pt-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Choose Option
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-lg text-slate-400 transition hover:text-slate-800"
          >
            ✕
          </button>
        </div>

        {/* SERVICE NAME */}
        <div className="shrink-0 border-b border-indigo-100 bg-indigo-50/50 px-6 py-3 text-sm font-medium text-indigo-900">
          {service.title}
        </div>

        {/* SCROLLABLE OPTIONS */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {service.variants.map((variant) => {
              const variantId = `${service.id}-${variant.name}`;

              const cartItem = items.find(
                (item) => item.id === variantId
              );

              const quantity = cartItem
                ? cartItem.quantity
                : 0;

              const isSelected = quantity > 0;

              return (
                <div
                  key={variant.name}
                  className={`
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    p-4
                    transition-colors
                    ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50/50"
                        : "border-indigo-100 hover:border-indigo-300"
                    }
                  `}
                >
                  {/* LEFT SIDE */}
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900">
                      {variant.name}
                    </div>

                    <div className="mt-1 flex gap-2 text-sm">
                      <span className="font-semibold text-slate-900">
                        ₹{variant.price}
                      </span>

                      {variant.originalPrice !== undefined && (
                        <span className="text-slate-400 line-through">
                          ₹{variant.originalPrice}
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <div className="mt-1.5 text-xs font-medium text-indigo-600">
                        ✓ Added
                      </div>
                    )}
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex shrink-0 flex-col items-center">
                    <img
                      src="/images/service-variant.png"
                      alt={variant.name}
                      className="mb-2 h-16 w-16 rounded-lg border border-indigo-100/60 object-cover"
                    />

                    {/* QUANTITY CONTROL */}
                    {quantity > 0 ? (
                      <div className="flex w-20 items-center justify-between rounded-lg border border-indigo-600 bg-indigo-50 px-1 py-1 text-sm font-bold text-indigo-700 shadow-xs">
                        <button
                          type="button"
                          onClick={() => decrease(variantId)}
                          className="flex h-5 w-5 items-center justify-center rounded transition hover:bg-indigo-200/60 active:scale-95"
                          aria-label={`Decrease ${variant.name}`}
                        >
                          −
                        </button>

                        <span className="select-none font-bold text-indigo-950">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => increase(variantId)}
                          className="flex h-5 w-5 items-center justify-center rounded transition hover:bg-indigo-200/60 active:scale-95"
                          aria-label={`Increase ${variant.name}`}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAdd(variant)}
                        className="
                          rounded-lg
                          bg-indigo-600
                          px-5
                          py-1.5
                          text-sm
                          font-semibold
                          text-white
                          shadow-xs
                          transition
                          hover:bg-indigo-700
                          active:bg-indigo-800
                        "
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DONE BUTTON */}
        {hasSelection && (
          <div className="shrink-0 border-t border-gray-200 bg-white px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="
                w-full
                rounded-xl
                bg-indigo-600
                py-3.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-indigo-700
                active:bg-indigo-800
              "
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}