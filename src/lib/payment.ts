import { COUPONS } from "@/lib/coupons";

export interface PaymentBreakdown {
  itemTotal: number;
  discount: number;
  subtotalAfterDiscount: number;
  platformFee: number;
  gst: number;
  finalTotal: number;
}

const PLATFORM_FEE = 49;
const GST_RATE = 0.18;

export function calculatePayment(
  itemTotal: number,
  couponCode?: string | null,
): PaymentBreakdown {
  const safeItemTotal = Math.max(0, itemTotal);

  let discount = 0;

  if (couponCode) {
    const normalizedCode = couponCode.trim().toUpperCase();

    const coupon = COUPONS.find(
      (item) => item.code === normalizedCode,
    );

    if (coupon) {
      const meetsMinimum =
        coupon.minAmount === undefined ||
        safeItemTotal >= coupon.minAmount;

      if (meetsMinimum) {
        if (coupon.type === "percentage") {
          discount = Math.round(
            (safeItemTotal * coupon.value) / 100,
          );
        } else {
          discount = coupon.value;
        }
      }
    }
  }

  /*
   * Never allow a discount to exceed the item total.
   */
  discount = Math.min(discount, safeItemTotal);

  const subtotalAfterDiscount =
    safeItemTotal - discount;

  const platformFee =
    safeItemTotal > 0 ? PLATFORM_FEE : 0;

  /*
   * Current application rule:
   * GST is calculated on the discounted subtotal
   * plus the platform fee.
   *
   * Confirm the final GST treatment with your CA
   * before production.
   */
  const gst =
    subtotalAfterDiscount + platformFee > 0
      ? Math.round(
          (subtotalAfterDiscount + platformFee) *
            GST_RATE,
        )
      : 0;

  const finalTotal =
    subtotalAfterDiscount +
    platformFee +
    gst;

  return {
    itemTotal: safeItemTotal,
    discount,
    subtotalAfterDiscount,
    platformFee,
    gst,
    finalTotal,
  };
}