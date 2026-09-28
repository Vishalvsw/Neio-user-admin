import type { Metadata } from "next";
import OrdersIdClient from "./OrderIdClient";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderDetailsPage() {
  return <OrdersIdClient />;
}
