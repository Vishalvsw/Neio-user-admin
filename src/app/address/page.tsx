import type { Metadata } from "next";
import AddressClient from "./AddressClient";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AddressPage() {
  return <AddressClient />;
}