"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  X,
  Tag,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useCity } from "@/context/CityContext";
import AuthModal from "@/components/auth/AuthModal";
import { createBooking } from "@/lib/bookings";
import { COUPONS } from "@/lib/coupons";

export default function CheckoutClient() {
  const router = useRouter();

  const { user, isLoaded } = useAuth();
  const { city, area } = useCity();

  const {
    items,
    total,
    discount,
    platformFee,
    gst,
    finalTotal,
    clearCart,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
  } = useCart();

  const [authOpen, setAuthOpen] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  /* ============================================================
     COUPON STATE
  ============================================================ */

  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] =
    useState("");

  const [couponError, setCouponError] =
    useState(false);

  const [showCoupons, setShowCoupons] =
    useState(false);

  /* ============================================================
     TODAY
  ============================================================ */

  const today = useMemo(() => {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(
      now.getMonth() + 1,
    ).padStart(2, "0");

    const day = String(
      now.getDate(),
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  /* ============================================================
     USER DETAILS
  ============================================================ */

  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setPhone(user.phone || "");
  }, [user]);

  /* ============================================================
     BOOKING VALIDATION
  ============================================================ */

  const bookingReady = useMemo(() => {
    return Boolean(
      user &&
        name.trim().length >= 2 &&
        /^[6-9]\d{9}$/.test(
          phone.trim(),
        ) &&
        address.trim().length >= 6 &&
        date >= today &&
        slot &&
        items.length > 0,
    );
  }, [
    user,
    name,
    phone,
    address,
    date,
    slot,
    items.length,
    today,
  ]);

  /* ============================================================
     APPLY COUPON
  ============================================================ */

  function handleApplyCoupon(code?: string) {
    const codeToApply =
      code !== undefined
        ? code
        : couponCode;

    const message =
      applyCoupon(codeToApply);

    const success =
      message ===
      "Coupon applied successfully";

    setCouponError(!success);
    setCouponMessage(message);

    if (success) {
      setCouponCode(
        codeToApply.trim().toUpperCase(),
      );

      setShowCoupons(false);
    }
  }

  /* ============================================================
     REMOVE COUPON
  ============================================================ */

  function handleRemoveCoupon() {
    removeCoupon();

    setCouponCode("");
    setCouponMessage("");
    setCouponError(false);
  }

  /* ============================================================
     COUPON ELIGIBILITY
  ============================================================ */

  function isCouponEligible(
    coupon: (typeof COUPONS)[number],
  ) {
    if (
      coupon.minAmount !== undefined &&
      total < coupon.minAmount
    ) {
      return false;
    }

    return true;
  }

  /* ============================================================
     CONFIRM BOOKING
  ============================================================ */

  function handleConfirm() {
    if (!user) {
      setAuthOpen(true);
      return;
    }

    if (!bookingReady || isSubmitting) {
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const booking = createBooking({
        userId: user.id,
        name,
        phone,
        email: user.email,
        city: city || undefined,
        area: area || undefined,
        address,
        date,
        slot,
        items,
        itemTotal: total,
        discount,
        platformFee,
        gst,
        finalTotal,
      });

      clearCart();

      router.push(
        `/checkout/success?booking=${encodeURIComponent(
          booking.id,
        )}`,
      );
    } catch {
      setIsSubmitting(false);
      setSubmitError(
        "We couldn't confirm the booking. Please try again.",
      );
    }
  }

  /* ============================================================
     EMPTY CART
  ============================================================ */

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="rounded-2xl border border-gray-200 p-8 text-center">
            <h1 className="text-xl font-semibold">
              Your cart is empty
            </h1>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
            >
              Explore Services
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-white pb-32">
        <div className="mx-auto max-w-6xl px-6 py-8">
          {/* BACK */}
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* ==================================================
                LEFT
            ================================================== */}

            <section className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Checkout
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Review your cart and complete your booking details.
                </p>
              </div>

              {!isLoaded ? null : !user ? (
                <div className="rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold">
                    Login to continue
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Log in with your mobile number and 4 digit PIN.
                  </p>

                  <button
                    type="button"
                    onClick={() => setAuthOpen(true)}
                    className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
                  >
                    Login / Sign Up
                  </button>
                </div>
              ) : (
                <section className="rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold">
                    Booking Details
                  </h2>

                  <div className="mt-5 grid gap-4">
                    {/* NAME */}
                    <label className="text-sm">
                      <span className="mb-1.5 block font-medium">
                        Full Name
                      </span>

                      <input
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                      />
                    </label>

                    {/* PHONE */}
                    <label className="text-sm">
                      <span className="mb-1.5 block font-medium">
                        Mobile Number
                      </span>

                      <input
                        value={phone}
                        onChange={(e) =>
                          setPhone(
                            e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10),
                          )
                        }
                        inputMode="numeric"
                        maxLength={10}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                      />
                    </label>

                    {/* EMAIL */}
                    {user.email && (
                      <div className="text-sm">
                        <span className="mb-1.5 block font-medium">
                          Email
                        </span>

                        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-600">
                          {user.email}
                        </div>
                      </div>
                    )}

                    {/* ADDRESS */}
                    <label className="text-sm">
                      <span className="mb-1.5 block font-medium">
                        Service Address
                      </span>

                      <textarea
                        value={address}
                        onChange={(e) =>
                          setAddress(e.target.value)
                        }
                        rows={3}
                        placeholder="Enter the complete address where the service is required"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                      />
                    </label>

                    {/* DATE */}
                    <label className="text-sm">
                      <span className="mb-1.5 block font-medium">
                        Date
                      </span>

                      <input
                        type="date"
                        min={today}
                        value={date}
                        onChange={(e) =>
                          setDate(e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                      />
                    </label>

                    {/* SLOT */}
                    <label className="text-sm">
                      <span className="mb-1.5 block font-medium">
                        Select Time Slot
                      </span>

                      <select
                        value={slot}
                        onChange={(e) =>
                          setSlot(e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                      >
                        <option value="">
                          Select Time Slot
                        </option>

                        <option>
                          9 AM - 12 PM
                        </option>

                        <option>
                          12 PM - 3 PM
                        </option>

                        <option>
                          3 PM - 6 PM
                        </option>
                      </select>
                    </label>
                  </div>

                  {submitError && (
                    <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                      {submitError}
                    </p>
                  )}
                </section>
              )}
            </section>

            {/* ==================================================
                ORDER SUMMARY
            ================================================== */}

            <aside className="h-fit rounded-2xl border border-gray-200 p-6 lg:sticky lg:top-20">
              <h2 className="text-lg font-semibold">
                Order Summary
              </h2>

              {/* ITEMS */}
              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <span className="text-gray-600">
                      {item.title} × {item.quantity}
                    </span>

                    <span className="shrink-0 font-medium">
                      ₹
                      {item.price *
                        item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* =================================================
                  COUPON
              ================================================= */}

              <div className="mt-6 border-t pt-5">
                <div className="flex items-center gap-2">
                  <Tag
                    size={17}
                    className="text-gray-600"
                  />

                  <span className="text-sm font-medium text-gray-900">
                    Have a coupon?
                  </span>
                </div>

                {!appliedCoupon ? (
                  <>
                    <div className="mt-3 flex gap-2">
                      <input
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(
                            e.target.value
                              .toUpperCase(),
                          );

                          setCouponMessage("");
                          setCouponError(false);
                        }}
                        placeholder="Enter coupon code"
                        className="min-w-0 flex-1 rounded-xl border border-gray-300 px-3 py-2.5 text-sm uppercase outline-none focus:border-black"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleApplyCoupon()
                        }
                        className="rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                      >
                        Apply
                      </button>
                    </div>

                    {couponMessage && (
                      <p
                        className={`mt-2 text-xs ${
                          couponError
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {couponMessage}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setShowCoupons(true)
                      }
                      className="mt-3 w-full rounded-xl border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      View Available Coupons
                    </button>
                  </>
                ) : (
                  <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-green-700">
                          <Check size={16} />
                          {appliedCoupon} applied
                        </div>

                        <p className="mt-1 text-xs text-green-700">
                          You saved ₹{discount}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={
                          handleRemoveCoupon
                        }
                        className="text-xs font-medium text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* TOTALS */}
              <div className="mt-5 space-y-2 border-t pt-5 text-sm">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span>₹{total}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>
                      -₹{discount}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>₹{platformFee}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST</span>
                  <span>₹{gst}</span>
                </div>

                <div className="flex justify-between border-t pt-3 text-base font-semibold">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              {/* BOOK */}
              <button
                type="button"
                onClick={handleConfirm}
                disabled={
                  !bookingReady ||
                  isSubmitting
                }
                className={`mt-6 w-full rounded-xl py-3.5 text-sm font-semibold transition ${
                  bookingReady &&
                  !isSubmitting
                    ? "bg-black text-white hover:opacity-90"
                    : "cursor-not-allowed bg-gray-200 text-gray-500"
                }`}
              >
                {isSubmitting
                  ? "Confirming Booking..."
                  : "Book Service"}
              </button>

              {!user && (
                <p className="mt-3 text-center text-xs text-gray-500">
                  Login or sign up and complete all required booking details to continue.
                </p>
              )}
            </aside>
          </div>
        </div>
      </main>

      {/* ========================================================
          COUPON MODAL
      ======================================================== */}

      {showCoupons && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 px-4 py-6"
          onMouseDown={() =>
            setShowCoupons(false)
          }
        >
          <div
            className="max-h-[85vh] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Available Coupons
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Choose a coupon for your order
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCoupons(false)
                }
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
                aria-label="Close coupons"
              >
                <X size={19} />
              </button>
            </div>

            {/* COUPON LIST */}
            <div className="max-h-[calc(85vh-90px)] overflow-y-auto p-4">
              <div className="space-y-3">
                {COUPONS.map((coupon) => {
                  const eligible =
                    isCouponEligible(
                      coupon,
                    );

                  return (
                    <div
                      key={coupon.code}
                      className={`rounded-xl border p-4 ${
                        eligible
                          ? "border-gray-200"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="rounded-md border border-dashed border-indigo-300 bg-indigo-50 px-2 py-1 text-sm font-bold tracking-wide text-indigo-700">
                              {coupon.code}
                            </span>
                          </div>

                          <p className="mt-2 text-sm font-medium text-gray-900">
                            {coupon.description}
                          </p>

                          {!eligible &&
                            coupon.minAmount !==
                              undefined && (
                              <p className="mt-1 text-xs text-red-600">
                                Minimum order ₹
                                {
                                  coupon.minAmount
                                }{" "}
                                required
                              </p>
                            )}

                          {eligible && (
                            <p className="mt-1 text-xs text-green-600">
                              Eligible for this order
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          disabled={!eligible}
                          onClick={() =>
                            handleApplyCoupon(
                              coupon.code,
                            )
                          }
                          className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                            eligible
                              ? "bg-black text-white hover:opacity-90"
                              : "cursor-not-allowed bg-gray-200 text-gray-400"
                          }`}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      <AuthModal
        open={authOpen}
        onClose={() =>
          setAuthOpen(false)
        }
      />
    </>
  );
}