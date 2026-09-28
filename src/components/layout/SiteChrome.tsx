"use client";

import { usePathname } from "next/navigation";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UrlLocationSync from "@/components/location/UrlLocationSync";
import CitySelectionModal from "@/components/location/CitySelectionModal";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import MobileCartBar from "@/components/service/MobileCartBar";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  /*
   * Admin has its own complete layout.
   *
   * Do not render any customer-facing UI here:
   * - Header
   * - Footer
   * - MobileBottomNav
   * - MobileCartBar
   * - CitySelectionModal
   * - UrlLocationSync
   */
  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <UrlLocationSync />

      <Header />

      <main className="pb-28 md:pb-16">
        {children}
      </main>

      <Footer />

      <MobileBottomNav />

      <MobileCartBar />

      <CitySelectionModal />
    </>
  );
}