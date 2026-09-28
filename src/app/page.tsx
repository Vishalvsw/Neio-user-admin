import type { Metadata } from "next";
import HomePage from "@/components/home/Homepage";

export const metadata: Metadata = {
  title: "Home Cleaning, Painting & Pest Control Services",
  description:
    "Book professional home cleaning, painting, pest control, plumbing, electrical and appliance repair services with Neoi. Verified experts, transparent pricing and easy online booking.",

  keywords: [
    "home cleaning",
    "deep cleaning",
    "pest control",
    "painting services",
    "home services",
    "Bangalore home cleaning",
    "Hyderabad home cleaning",
    "Neoi",
  ],

  alternates: {
    canonical: "https://neoi.in",
  },

  openGraph: {
    title: "Neoi Home Services",
    description:
      "Professional home services at your doorstep.",
    url: "https://neoi.in",
    siteName: "Neoi",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://neoi.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Neoi Home Services",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Neoi Home Services",
    description:
      "Professional home services at your doorstep.",
    images: ["https://neoi.in/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <HomePage />;
}