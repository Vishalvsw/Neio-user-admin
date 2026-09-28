"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function SuccessClient() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-6">
        <h1 className="text-4xl font-semibold text-gray-900">
          Booking Confirmed 🎉
        </h1>

        <p className="mt-6 text-gray-600">
          Our team will contact you shortly to confirm your appointment.
        </p>

        <a
          href="/"
          className="inline-block mt-10 bg-black text-white px-8 py-3 rounded-md hover:opacity-90 transition"
        >
          Back to Home
        </a>
      </div>
    </main>
  );
}