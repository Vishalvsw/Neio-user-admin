"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getBookingById } from "@/lib/bookings";
import type { Booking } from "@/types/booking";

export default function OrdersIdClient() {
  const params = useParams<{ id: string }>();
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const bookingId = Array.isArray(params.id) ? params.id[0] : params.id;
    const found = getBookingById(decodeURIComponent(bookingId || ""));

    if (found?.userId === user.id) {
      setBooking(found);
    }
  }, [isLoaded, user, params.id]);

  if (!isLoaded) return null;

  if (!user || !booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center">

          <h1 className="text-xl font-semibold">Booking not found</h1>
          <p className="mt-2 text-sm text-gray-500">
            This booking is unavailable or does not belong to the signed-in
            account.
          </p>

          
          <Link
            href="/orders"
            className="mt-6 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
          >
            My Bookings
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 pb-24">
      <div className="mx-auto max-w-3xl space-y-8 px-6">
        <button
          type="button"
          onClick={() => router.push('/orders')}
          className="mb-6 inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
        >
          ← Back to My Bookings
        </button>

        <div>
          <h1 className="text-2xl font-semibold">Booking Details</h1>
          <p className="mt-1 text-sm text-gray-500">Booking ID: {booking.id}</p>
        </div>

        <section className="rounded-xl border bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-medium">Booking Status</h2>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              {booking.status}
            </span>
          </div>

          <p className="mt-3 text-sm text-gray-600">
            Your booking has been recorded. Service status will be updated here
            when the booking workflow is connected to the service backend.
          </p>
        </section>

        <section className="rounded-xl border bg-white p-6">
          <h2 className="font-medium">Services</h2>
          <div className="mt-4 space-y-3">
            {booking.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 text-sm">
                <span className="text-gray-600">
                  {item.title} × {item.quantity}
                </span>
                <span className="font-medium">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border bg-white p-6">
          <h2 className="font-medium">Schedule & Address</h2>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-500">Service date</p>
              <p className="mt-1 text-sm font-medium">{booking.date}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Time slot</p>
              <p className="mt-1 text-sm font-medium">{booking.slot}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-gray-500">Address</p>
              <p className="mt-1 text-sm font-medium">{booking.address}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border bg-white p-6">
          <h2 className="font-medium">Payment Summary</h2>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Item Total</span>
              <span>₹{booking.itemTotal}</span>
            </div>
            {booking.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{booking.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span>₹{booking.platformFee}</span>
            </div>
            <div className="flex justify-between">
              <span>GST</span>
              <span>₹{booking.gst}</span>
            </div>
            <div className="flex justify-between border-t pt-3 font-semibold">
              <span>Total</span>
              <span>₹{booking.finalTotal}</span>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/orders"
            className="flex-1 rounded-xl border border-gray-300 bg-white px-5 py-3 text-center text-sm font-semibold"
          >
            My Bookings
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-xl bg-black px-5 py-3 text-center text-sm font-semibold text-white"
          >
            Explore Services
          </Link>
        </div>
      </div>
    </main>
  );
}
