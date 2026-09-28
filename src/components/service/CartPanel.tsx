"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import CouponModal from "../cart/CouponModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Props {
  sticky?: boolean;
}

export default function CartPanel({ sticky = true }: Props) {
  const {
    items,
    increase,
    decrease,
    removeItem,
    total,
    discount,
    platformFee,
    gst,
    finalTotal,
    applyCoupon,
    appliedCoupon,
  } = useCart();

  const { user } = useAuth();
  const router = useRouter();

  const [coupon, setCoupon] = useState("");
  const [message, setMessage] = useState("");
  const [showCoupons, setShowCoupons] = useState(false);

  /* ============================================================
     COUPON
     ============================================================ */

  function handleApply() {
    if (!coupon.trim()) {
      setMessage("Enter coupon code");
      return;
    }

    const result = applyCoupon(coupon);

    setMessage(result);

    /*
     * Clear the input only after successful application.
     */
    if (result === "Coupon applied successfully") {
      setCoupon("");
    }
  }

  /* ============================================================
     CHECKOUT
     ============================================================ */

  function proceedCheckout() {
    if (items.length === 0) {
      return;
    }

    if (!appliedCoupon && discount === 0) {
      const shouldContinue = window.confirm(
        "You're missing best offers. Continue without applying coupon?",
      );

      if (!shouldContinue) {
        return;
      }
    }

    router.push("/checkout");
  }

  return (
    <>
      <div
        className={`border border-gray-200 rounded-xl p-6 bg-white ${
          sticky ? "sticky top-20" : ""
        }`}
      >
        <h2 className="font-semibold text-gray-900 mb-6">
          Your Cart
        </h2>

        {items.length === 0 ? (
          <p className="text-sm text-gray-500">
            No services added yet.
          </p>
        ) : (
          <>
            {/* ==================================================
                ITEMS
                ================================================== */}

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border-b pb-4"
                >
                  <div className="font-medium text-sm">
                    {item.title}
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          decrease(item.id)
                        }
                        aria-label={`Decrease quantity of ${item.title}`}
                        className="border px-2"
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          increase(item.id)
                        }
                        aria-label={`Increase quantity of ${item.title}`}
                        className="border px-2"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-sm font-medium">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(item.id)
                    }
                    className="text-xs text-red-500 mt-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* ==================================================
                COUPON SECTION
                ================================================== */}

            <div className="mt-6">
              <div className="text-sm font-medium mb-2">
                Apply Coupon
              </div>

              {!user ? (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-sm text-gray-700">
                  <p>
                    🔐{" "}
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/login?redirect=${encodeURIComponent(
                            window.location.pathname,
                          )}`,
                        )
                      }
                      className="text-indigo-600 font-medium underline"
                    >
                      Login or Sign up
                    </button>{" "}
                    to unlock best coupons.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) =>
                        setCoupon(e.target.value)
                      }
                      placeholder="Enter code"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />

                    <button
                      type="button"
                      onClick={handleApply}
                      className={`px-4 py-2 rounded-md text-sm ${
                        appliedCoupon
                          ? "bg-green-600 text-white"
                          : "bg-indigo-600 text-white"
                      }`}
                    >
                      {appliedCoupon
                        ? "Applied"
                        : "Apply"}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowCoupons(true)
                    }
                    className="mt-3 text-sm text-green-700 hover:text-green-800 flex items-center gap-1"
                  >
                    🎟 View Coupons
                  </button>

                  {message && (
                    <div className="text-xs mt-2 text-gray-600">
                      {message}
                    </div>
                  )}

                  {discount > 0 && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium animate-fadeIn">
                      🎉 You saved ₹{discount} with{" "}
                      {appliedCoupon}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ==================================================
                PAYMENT SUMMARY
                ================================================== */}

            <div className="mt-8 border-t pt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span>₹{total}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>−₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹{platformFee}</span>
              </div>

              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹{gst}</span>
              </div>
            </div>

            {/* ==================================================
                FINAL TOTAL
                ================================================== */}

            <div className="mt-6 border-t pt-4 flex justify-between font-semibold text-gray-900">
              <span>Total Amount</span>
              <span>₹{finalTotal}</span>
            </div>

            {/* ==================================================
                TRUST NOTE
                ================================================== */}

            <div className="mt-4 text-xs text-gray-500">
              You pay only after service completion.
              No advance payment required.
            </div>

            {/* ==================================================
                DESKTOP CHECKOUT
                ================================================== */}

            <button
              type="button"
              onClick={proceedCheckout}
              className="hidden md:block mt-6 w-full bg-black text-white py-3 rounded-md hover:opacity-90 transition"
            >
              Proceed to Checkout
            </button>
          </>
        )}

        {showCoupons && (
          <CouponModal
            onClose={() =>
              setShowCoupons(false)
            }
          />
        )}
      </div>

      {/* ========================================================
          MOBILE CHECKOUT BAR
          ======================================================== */}

      {items.length > 0 && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div>
              <div className="text-xs text-gray-500">
                Total
              </div>

              <div className="font-semibold text-gray-900">
                ₹{finalTotal}
              </div>
            </div>

            <button
              type="button"
              onClick={proceedCheckout}
              className="bg-black text-white px-6 py-2 rounded-md text-sm"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </>
  );
}