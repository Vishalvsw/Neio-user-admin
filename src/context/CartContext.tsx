"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

import { COUPONS } from "@/lib/coupons";
import { calculatePayment } from "@/lib/payment";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];

  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  clearCart: () => void;

  total: number;

  discount: number;
  platformFee: number;
  gst: number;
  finalTotal: number;

  applyCoupon: (code: string) => string;
  removeCoupon: () => void;
  appliedCoupon: string | null;
}

const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] =
    useState<string | null>(null);

  const { user } = useAuth();

  /* ============================================================
     LOAD CART
  ============================================================ */

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");

      if (!stored) return;

      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed.items)) {
        setItems(parsed.items);
      }

      if (typeof parsed.appliedCoupon === "string") {
        setAppliedCoupon(parsed.appliedCoupon);
      }
    } catch {
      localStorage.removeItem("cart");
      setItems([]);
      setAppliedCoupon(null);
    }
  }, []);

  /* ============================================================
     SAVE CART
  ============================================================ */

  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify({
        items,
        appliedCoupon,
      }),
    );
  }, [items, appliedCoupon]);

  /* ============================================================
     CART OPERATIONS
  ============================================================ */

  function addItem(item: Omit<CartItem, "quantity">) {
    setItems((prev) => {
      const existing = prev.find(
        (current) => current.id === item.id,
      );

      if (existing) {
        return prev.map((current) =>
          current.id === item.id
            ? {
                ...current,
                quantity: current.quantity + 1,
              }
            : current,
        );
      }

      return [
        ...prev,
        {
          ...item,
          quantity: 1,
        },
      ];
    });
  }

  function removeItem(id: string) {
    setItems((prev) =>
      prev.filter((item) => item.id !== id),
    );
  }

  function increase(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  }

  function decrease(id: string) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function clearCart() {
    setItems([]);
    setAppliedCoupon(null);

    localStorage.setItem(
      "cart",
      JSON.stringify({
        items: [],
        appliedCoupon: null,
      }),
    );
  }

  /* ============================================================
     TOTAL
  ============================================================ */

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0,
      ),
    [items],
  );

  /* ============================================================
     VALIDATE STORED / APPLIED COUPON
  ============================================================ */

  useEffect(() => {
    if (!appliedCoupon) return;

    const coupon = COUPONS.find(
      (item) => item.code === appliedCoupon,
    );

    if (!coupon) {
      setAppliedCoupon(null);
      return;
    }

    if (
      coupon.minAmount !== undefined &&
      total < coupon.minAmount
    ) {
      setAppliedCoupon(null);
    }
  }, [total, appliedCoupon]);

  /* ============================================================
     PAYMENT CALCULATION
  ============================================================ */

  const payment = useMemo(
    () =>
      calculatePayment(
        total,
        appliedCoupon,
      ),
    [total, appliedCoupon],
  );

  /* ============================================================
     APPLY COUPON
  ============================================================ */

  function applyCoupon(code: string) {
    if (!user) {
      return "Login to use coupons";
    }

    const normalizedCode = code
      .trim()
      .toUpperCase();

    if (!normalizedCode) {
      return "Enter coupon code";
    }

    const coupon = COUPONS.find(
      (item) => item.code === normalizedCode,
    );

    if (!coupon) {
      return "Invalid coupon code";
    }

    if (
      coupon.minAmount !== undefined &&
      total < coupon.minAmount
    ) {
      return `Minimum order ₹${coupon.minAmount} required`;
    }

    setAppliedCoupon(coupon.code);

    return "Coupon applied successfully";
  }

  /* ============================================================
     REMOVE COUPON
  ============================================================ */

  function removeCoupon() {
    setAppliedCoupon(null);
  }

  /* ============================================================
     PROVIDER
  ============================================================ */

  return (
    <CartContext.Provider
      value={{
        items,

        addItem,
        removeItem,
        increase,
        decrease,
        clearCart,

        total,

        discount: payment.discount,
        platformFee: payment.platformFee,
        gst: payment.gst,
        finalTotal: payment.finalTotal,

        applyCoupon,
        removeCoupon,
        appliedCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ==============================================================
   HOOK
============================================================== */

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider",
    );
  }

  return context;
}