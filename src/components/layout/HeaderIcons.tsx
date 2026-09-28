"use client";

import { ShoppingCart, UserRound } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthModal from "../auth/AuthModal";

export default function HeaderIcons() {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  function handleCartClick() {
    // No services selected yet
    if (items.length === 0) {
      router.push("/cart");
      return;
    }

    // Already logged in → continue to checkout
    if (user) {
      router.push("/checkout");
      return;
    }

    // Has cart items but is not logged in
    // → authenticate before checkout
    setAuthOpen(true);
  }

  return (
    <>
      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        {/* CART */}
        <button
          type="button"
          onClick={handleCartClick}
          className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-50"
          aria-label={`Cart${itemCount ? `, ${itemCount} items` : ""}`}
        >
          <ShoppingCart size={22} />

          {itemCount > 0 && (
            <span className="absolute right-0 top-0 min-w-5 rounded-full bg-indigo-600 px-1.5 py-0.5 text-center text-[11px] font-medium leading-4 text-white">
              {itemCount}
            </span>
          )}
        </button>

        {/* USER */}
        {user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((value) => !value)}
              className="flex max-w-[170px] items-center gap-2 rounded-full border border-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              <UserRound
                size={17}
                className="shrink-0"
              />

              <span className="hidden truncate sm:inline">
                {user.name}
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 z-[60] w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                <div className="border-b px-3 py-2">
                  <p className="truncate text-sm font-semibold">
                    {user.name}
                  </p>

                  <p className="truncate text-xs text-gray-500">
                    {user.phone}
                  </p>

                  {user.email && (
                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    router.push("/orders");
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  My Bookings
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setProfileOpen(false);
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="whitespace-nowrap rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:px-5"
          >
            <span className="hidden sm:inline">
              Login / Signup
            </span>

            <span className="sm:hidden">
              Login
            </span>
          </button>
        )}
      </div>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {
          setAuthOpen(false);
          router.push("/checkout");
        }}
      />
    </>
  );
}