"use client";

import CartPanel from "@/components/service/CartPanel";

export default function CartClient() {
  return (
    <main className="min-h-screen bg-indigo-50 py-16">
      <div className="mx-auto max-w-4xl px-6">
        <CartPanel sticky={false} />
      </div>
    </main>
  );
}