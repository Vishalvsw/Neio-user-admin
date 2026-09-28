"use client";

import { Menu } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

interface Props {
  onMenuClick: () => void;
}

export default function AdminHeader({
  onMenuClick,
}: Props) {
  const { admin } = useAdminAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-label="Open admin navigation"
        >
          <Menu size={21} />
        </button>

        <div className="lg:hidden">
          <p className="text-lg font-bold text-gray-900">
            Neoi
          </p>

          <p className="text-[10px] uppercase tracking-wide text-gray-400">
            Admin
          </p>
        </div>

        <div className="hidden lg:block">
          <p className="text-sm font-semibold text-gray-900">
            Administration
          </p>

          <p className="text-xs text-gray-500">
            Manage Neoi Home Services
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-gray-900">
            {admin?.name}
          </p>

          <p className="text-xs capitalize text-gray-500">
            {admin?.role?.replaceAll("_", " ")}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
          {admin?.name
            ?.charAt(0)
            .toUpperCase() || "A"}
        </div>
      </div>
    </header>
  );
}