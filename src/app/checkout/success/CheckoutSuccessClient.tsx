"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getBookingById, getLastBookingForUser } from "@/lib/bookings";
import type { Booking } from "@/types/booking";

export default function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const { user, isLoaded } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const bookingId = searchParams.get("booking");

    if (bookingId) {
      const found = getBookingById(bookingId);
      if (found?.userId === user.id) {
        setBooking(found);
        return;
      }
    }

    setBooking(getLastBookingForUser(user.id));
  }, [isLoaded, user, searchParams]);

  if (!isLoaded) return null;

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">
            Booking Confirmation
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            Please log in to view your booking confirmation.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white"
          >
            Explore Services
          </Link>
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">
            Booking Not Found
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            We couldn't find the booking confirmation for this page.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/orders"
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900"
            >
              My Bookings
            </Link>
            <Link
              href="/"
              className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
            ✓
          </div>

          <div className="mt-5 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Booking Confirmed
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Your service booking has been created successfully.
            </p>
          </div>

          <div className="mt-8 rounded-xl bg-gray-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500">Booking ID</span>
              <span className="text-sm font-semibold text-gray-900">
                {booking.id}
              </span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">Service date</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {booking.date}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Time slot</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {booking.slot}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-500">Service address</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {booking.address}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-500">Total</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  ₹{booking.finalTotal}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/orders/${encodeURIComponent(booking.id)}`}
              className="flex-1 rounded-xl bg-black px-5 py-3 text-center text-sm font-semibold text-white"
            >
              View Booking
            </Link>
            <Link
              href="/orders"
              className="flex-1 rounded-xl border border-gray-300 px-5 py-3 text-center text-sm font-semibold text-gray-900"
            >
              My Bookings
            </Link>
            <Link
              href="/"
              className="flex-1 rounded-xl border border-gray-300 px-5 py-3 text-center text-sm font-semibold text-gray-900"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
