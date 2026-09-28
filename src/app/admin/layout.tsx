"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { useAdminAuth } from "@/context/AdminAuthContext";

function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { admin, isLoaded } =
    useAdminAuth();

  const isLoginPage =
    pathname === "/admin/login";

  useEffect(() => {
    if (!isLoaded) return;

    if (!admin && !isLoginPage) {
      router.replace("/admin/login");
      return;
    }

    if (admin && isLoginPage) {
      router.replace("/admin");
    }
  }, [
    admin,
    isLoaded,
    isLoginPage,
    router,
  ]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-500">
          Loading admin...
        </div>
      </div>
    );
  }

  if (!admin && !isLoginPage) {
    return null;
  }

  if (admin && isLoginPage) {
    return null;
  }

  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminGuard>
        {children}
      </AdminGuard>
    </AdminAuthProvider>
  );
}