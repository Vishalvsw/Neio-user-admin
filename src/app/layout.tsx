import "./globals.css";

import type { Metadata, Viewport } from "next";

import { AuthProvider } from "@/context/AuthContext";
import { CityProvider } from "@/context/CityContext";
import { CartProvider } from "@/context/CartContext";
import { BannerProvider } from "@/context/BannerContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { CategoriesProvider } from "@/context/CategoriesContext";

import SiteChrome from "@/components/layout/SiteChrome";

export const metadata: Metadata = {
  metadataBase: new URL("https://neoi.in"),
  title: {
    default: "Neoi Home Services",
    template: "%s | Neoi Home Services",
  },
  description:
    "Professional home cleaning, bathroom cleaning, kitchen cleaning, pest control, painting and home maintenance services in Bangalore.",
  applicationName: "Neoi",
  creator: "Neoi",
  publisher: "Neoi",
  category: "Home Services",
  alternates: { canonical: "https://neoi.in" },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Neoi Home Services",
    url: "https://neoi.in",
    logo: "https://neoi.in/logo.png",
    sameAs: ["https://instagram.com/neoi", "https://facebook.com/neoi"],
  };

  return (
    <html lang="en-IN" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body
        className="min-h-screen bg-white text-gray-900 antialiased"
        suppressHydrationWarning
      >
        <AuthProvider>
          <CityProvider>
            <CartProvider>
              <BannerProvider>
                <SettingsProvider>
                  <CategoriesProvider>
                    <SiteChrome>{children}</SiteChrome>
                  </CategoriesProvider>
                </SettingsProvider>
              </BannerProvider>
            </CartProvider>
          </CityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
