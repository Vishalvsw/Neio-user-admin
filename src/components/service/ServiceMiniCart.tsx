"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

function CartIcon() {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 4H5L7.2 14.2C7.43 15.25 8.36 16 9.44 16H17.2C18.14 16 18.97 15.4 19.25 14.5L21 9H6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="9.5"
        cy="20"
        r="1.3"
        fill="currentColor"
      />
      <circle
        cx="17"
        cy="20"
        r="1.3"
        fill="currentColor"
      />
    </svg>
  );
}

function WhyNeoi() {
  const points = [
    "Easy Booking",
    "Clear Pricing",
    "Flexible Options",
  ];

  return (
    <div className="border-t border-gray-200 px-5 py-5">
      <h3 className="text-sm font-semibold text-gray-900">
        Why Neoi?
      </h3>

      <div className="mt-4 space-y-3">
        {points.map((point) => (
          <div
            key={point}
            className="flex items-center gap-2.5"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">
              ✓
            </span>

            <span className="text-sm text-gray-600">
              {point}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ServiceMiniCart() {
  const router = useRouter();

  const {
    items,
    increase,
    decrease,
    removeItem,
  } = useCart();

  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <aside className="w-full">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {items.length === 0 ? (
          <>
            {/* Empty cart */}
            <div className="px-5 py-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                <CartIcon />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-gray-900">
                Your cart is empty
              </h2>

              <p className="mx-auto mt-2 max-w-[260px] text-sm leading-5 text-gray-500">
                Add a service from the options to get started.
              </p>
            </div>

            <WhyNeoi />
          </>
        ) : (
          <>
            {/* Cart header */}
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Selected Services
              </h2>

              <p className="mt-0.5 text-xs text-gray-500">
                {itemCount} item
                {itemCount !== 1 ? "s" : ""} in your cart
              </p>
            </div>

            {/* Selected services */}
            <div className="px-4 py-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold leading-5 text-gray-900">
                          {item.title}
                        </div>

                        <div className="mt-1 text-xs text-gray-500">
                          ₹{item.price} each
                        </div>
                      </div>

                      <span className="shrink-0 text-sm font-semibold text-gray-900">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => decrease(item.id)}
                          aria-label={`Decrease ${item.title}`}
                          className="h-8 w-8 rounded-lg border border-gray-300 text-gray-700 transition hover:bg-gray-50"
                        >
                          −
                        </button>

                        <span className="min-w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => increase(item.id)}
                          aria-label={`Increase ${item.title}`}
                          className="h-8 w-8 rounded-lg border border-gray-300 text-gray-700 transition hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs font-medium text-red-500 transition hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart total */}
            <div className="border-t border-gray-200 bg-white px-4 py-4">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-semibold text-gray-900">
                  ₹{subtotal}
                </span>
              </div>

              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="w-full rounded-xl bg-black py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Proceed to Checkout
              </button>
            </div>

            {/* Why Neoi */}
            <WhyNeoi />
          </>
        )}
      </div>
    </aside>
  );
}