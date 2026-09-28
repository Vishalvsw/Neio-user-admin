"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  TicketPercent,
  MapPin,
  Users,
  Image,
  Layers3,
  Settings,
  X,
  LogOut,
} from "lucide-react";

import { useAdminAuth } from "@/context/AdminAuthContext";

interface Props {
  mobileOpen?: boolean;
  onClose?: () => void;
}

const navigation = [
  {
    section: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    section: "Operations",
    items: [
      {
        label: "Bookings",
        href: "/admin/bookings",
        icon: CalendarCheck,
      },
      {
        label: "Locations",
        href: "/admin/locations",
        icon: MapPin,
      },
      {
        label: "Team",
        href: "/admin/team",
        icon: Users,
      },
    ],
  },
  {
    section: "Catalogue",
    items: [
      {
        label: "Categories & Services",
        href: "/admin/categories",
        icon: Layers3,
      },
      {
        label: "Coupons",
        href: "/admin/coupons",
        icon: TicketPercent,
      },
      {
        label: "Banners",
        href: "/admin/banners",
        icon: Image,
      },
    ],
  },
  {
    section: "System",
    items: [
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export default function AdminSidebar({
  mobileOpen = false,
  onClose,
}: Props) {
  const pathname = usePathname();
  const { admin, logout } = useAdminAuth();

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function handleLogout() {
    logout();
    onClose?.();
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
            N
          </div>

          <div>
            <p className="text-base font-bold leading-tight text-gray-900">
              Neoi
            </p>

            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Mobile close */}
        <button
          type="button"
          onClick={onClose}
          className="ml-auto rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          aria-label="Close navigation"
        >
          <X size={19} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {navigation.map((group) => (
          <div key={group.section} className="mb-6">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
              {group.section}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      size={18}
                      strokeWidth={active ? 2.2 : 1.8}
                      className={
                        active
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-gray-600"
                      }
                    />

                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Admin account */}
      <div className="shrink-0 border-t border-gray-200 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
            {admin?.name?.charAt(0).toUpperCase() || "A"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">
              {admin?.name || "Admin"}
            </p>

            <p className="truncate text-[11px] capitalize text-gray-500">
              {admin?.role?.replaceAll("_", " ") || "Administrator"}
            </p>
          </div>

          
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex lg:sticky lg:top-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            onClick={onClose}
            className="absolute inset-0 bg-black/40"
            aria-label="Close navigation"
          />

          <aside className="relative z-10 flex h-full w-72 flex-col bg-white shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}