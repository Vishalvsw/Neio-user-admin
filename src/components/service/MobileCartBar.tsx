"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import AuthModal from "@/components/auth/AuthModal";

export default function MobileCartBar() {
  const { items, total } = useCart();
  const { user } = useAuth();

  const pathname = usePathname();
  const router = useRouter();

  const [showAuthModal, setShowAuthModal] = useState(false);

  if (items.length === 0) {
    return null;
  }

  /*
   * Hide the mobile cart bar on pages where the cart/checkout
   * is already being displayed.
   */
  if (
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/order-success") ||
    pathname.startsWith("/cart")
  ) {
    return null;
  }

  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  function handleViewCart() {
    /*
     * Logged-in users can continue directly to checkout.
     */
    if (user) {
      router.push("/checkout");
      return;
    }

    /*
     * Logged-out users must authenticate first.
     */
    setShowAuthModal(true);
  }

  return (
    <>
      {/* MOBILE CART BAR */}
      <div className="fixed bottom-16 left-0 right-0 z-50 animate-slideUp md:hidden">
        <div className="mx-3 mb-2 overflow-hidden rounded-xl bg-black text-white shadow-xl">
          <button
            type="button"
            onClick={handleViewCart}
            className="flex w-full items-center justify-between px-5 py-3.5 text-left"
          >
            <div>
              <div className="text-xs text-gray-300">
                {itemCount} item
                {itemCount !== 1 ? "s" : ""}
              </div>

              <div className="mt-0.5 text-base font-semibold">
                ₹{total}
              </div>
            </div>

            <div className="text-sm font-semibold">
              {user
                ? "Proceed to Checkout →"
                : "Login / Sign up →"}
            </div>
          </button>
        </div>
      </div>

      {/* LOGIN / SIGN UP MODAL */}
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}