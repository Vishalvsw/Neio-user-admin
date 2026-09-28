"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getBookingsForUser } from "@/lib/bookings";
import type { Booking } from "@/types/booking";

export default function OrdersClient() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!isLoaded || !user) return;
    setBookings(getBookingsForUser(user.id));
  }, [isLoaded, user]);

  if (!isLoaded) return null;

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 py-10 pb-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <h1 className="text-2xl font-semibold">My Bookings</h1>
            <p className="mt-2 text-sm text-gray-500">
              Please log in to view your bookings.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 pb-24">
      <div className="mx-auto max-w-4xl px-6">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="mb-6 inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
        >
          ← Back to Home
        </button>
        <h1 className="mb-8 text-2xl font-semibold">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="mt-20 text-center text-gray-500">
            <p>No bookings yet.</p>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
            >
              Explore Services
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="font-medium">Booking ID: {booking.id}</div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                    {booking.status}
                  </span>
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  📅 {booking.date} • {booking.slot}
                </div>

                <div className="mt-1 text-sm text-gray-600">
                  📍 {booking.address}
                </div>

                <div className="mt-3 font-semibold">₹{booking.finalTotal}</div>

                <button
                  type="button"
                  onClick={() =>
                    router.push(`/orders/${encodeURIComponent(booking.id)}`)
                  }
                  className="mt-4 text-sm font-medium text-indigo-600"
                >
                  View Details →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
