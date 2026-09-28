"use client";

import { COUPONS } from "@/lib/coupons";
import { useCart } from "@/context/CartContext";

interface Props {
  onClose: () => void;
}

export default function CouponModal({ onClose }: Props) {
  const { applyCoupon, appliedCoupon, total, discount } = useCart();

  function handleApply(code: string) {
    const result = applyCoupon(code);

    if (result === "Coupon applied successfully") {
      setTimeout(() => {
        onClose();
      }, 600);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50">

      <div className="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-2xl p-6 animate-slideUp">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">
            Available Coupons
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">

          {COUPONS.map((coupon) => {
            const disabled =
              coupon.minAmount !== undefined && total < coupon.minAmount;

            return (
              <div
                key={coupon.code}
                className="border rounded-xl p-4 hover:shadow-sm transition"
              >
                <div className="flex justify-between items-center">

                  <div>
                    <div className="font-medium text-gray-900">
                      {coupon.code}
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      {coupon.description}
                    </div>

                    {coupon.minAmount && (
                      <div className="text-xs text-gray-400 mt-1">
                        Min order ₹{coupon.minAmount}
                      </div>
                    )}
                  </div>

                  <button
                    disabled={disabled}
                    onClick={() => handleApply(coupon.code)}
                    className={`px-4 py-2 text-sm rounded-lg transition ${
                      appliedCoupon === coupon.code
                        ? "bg-green-600 text-white"
                        : disabled
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {appliedCoupon === coupon.code
                      ? "Applied"
                      : "Apply"}
                  </button>

                </div>
              </div>
            );
          })}
        </div>

        {discount > 0 && (
          <div className="mt-6 text-green-600 text-sm font-medium animate-pulse">
            🎉 You saved ₹{discount} on this order!
          </div>
        )}

      </div>
    </div>
  );
}