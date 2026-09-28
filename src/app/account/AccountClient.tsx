"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  MapPin,
  Package,
  FileText,
  Shield,
  Wallet,
  Phone,
  Info,
  ChevronRight,
} from "lucide-react";

export default function AccountClient() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const storedName =
    typeof window !== "undefined"
      ? localStorage.getItem("userName")
      : "";

  function MenuItem({
    icon: Icon,
    label,
    href,
  }: {
    icon: React.ElementType;
    label: string;
    href: string;
  }) {
    return (
      <button
        type="button"
        onClick={() => router.push(href)}
        className="flex w-full items-center justify-between border-b py-4"
      >
        <div className="flex items-center gap-3">
          <Icon
            size={20}
            className="text-gray-600"
          />

          <span className="text-sm text-gray-800">
            {label}
          </span>
        </div>

        <ChevronRight
          size={18}
          className="text-gray-400"
        />
      </button>
    );
  }

  /*
   * Display a useful contact value without trying
   * to render the complete AuthUser object.
   */
  const userContact =
    user?.phone ||
    user?.email ||
    "";

  return (
    <main className="min-h-screen bg-white pb-24">
      <div className="mx-auto max-w-md px-6">
        {/* HEADER */}
        <div className="border-b py-6">
          {!user ? (
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/login?redirect=/account"
                )
              }
              className="w-full rounded-lg bg-black py-3 text-white transition hover:opacity-90"
            >
              Login / Sign up
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-gray-100 p-3">
                <User size={22} />
              </div>

              <div className="min-w-0">
                <div className="font-medium text-gray-900">
                  {storedName ||
                    user.name ||
                    "User"}
                </div>

                {userContact && (
                  <div className="text-sm text-gray-500">
                    {userContact}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* USER SECTION */}
        {user && (
          <div className="mt-4">
            <MenuItem
              icon={MapPin}
              label="Saved Address"
              href="/address"
            />

            <MenuItem
              icon={Package}
              label="My Orders"
              href="/orders"
            />
          </div>
        )}

        {/* INFO SECTION */}
        <div className="mt-6">
          <MenuItem
            icon={FileText}
            label="Terms of Use"
            href="/terms"
          />

          <MenuItem
            icon={Shield}
            label="Privacy Policy"
            href="/privacy-policy"
          />

          <MenuItem
            icon={Wallet}
            label="Refund Policy"
            href="/refund-policy"
          />

          <MenuItem
            icon={Phone}
            label="Contact Us"
            href="/contact"
          />

          <MenuItem
            icon={Info}
            label="About Neoi"
            href="/about"
          />
        </div>

        {/* LOGOUT */}
        {user && (
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="mt-8 text-sm text-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </main>
  );
}