"use client";

import { Home, Grid, Package, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Home", icon: Home, path: "/", key: "home" },
    { label: "Categories", icon: Grid, path: "/categories", key: "categories" },
    { label: "Orders", icon: Package, path: "/orders", key: "orders" },
    { label: "Account", icon: User, path: "/account", key: "account" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">

      <div className="flex justify-around items-center py-2 relative">

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);

          return (
            <button
              key={item.key}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center text-xs relative"
            >
              <div
                className={`p-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-indigo-100 scale-110"
                    : ""
                }`}
              >
                <Icon
                  size={20}
                  className={
                    isActive
                      ? "text-indigo-600"
                      : "text-gray-500"
                  }
                />
              </div>

              <span
                className={`mt-1 transition-colors duration-300 ${
                  isActive
                    ? "text-indigo-600"
                    : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

      </div>
    </div>
  );
}