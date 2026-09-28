import type { Metadata } from "next";
import OrdersClient from "./OrdersClient";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderDetailsPage() {
  return <OrdersClient />;
}