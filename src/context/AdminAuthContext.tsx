"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { AdminUser } from "@/lib/admin/types";
import { ADMIN_CREDENTIALS } from "@/lib/admin/mockData";

interface AdminAuthResult {
  ok: boolean;
  message?: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoaded: boolean;
  login: (
    identifier: string,
    password: string,
  ) => AdminAuthResult;
  logout: () => void;
}

const AdminAuthContext =
  createContext<AdminAuthContextType | undefined>(
    undefined,
  );

const STORAGE_KEY = "neoi_admin";

export function AdminAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [admin, setAdmin] =
    useState<AdminUser | null>(null);

  const [isLoaded, setIsLoaded] =
    useState(false);

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (
          parsed &&
          typeof parsed === "object" &&
          parsed.id &&
          parsed.email &&
          parsed.role
        ) {
          setAdmin(parsed);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  function login(
    identifier: string,
    password: string,
  ): AdminAuthResult {
    const normalizedIdentifier =
      identifier.trim().toLowerCase();

    const validEmail =
      normalizedIdentifier ===
      ADMIN_CREDENTIALS.email;

    const validPhone =
      identifier.trim() ===
      ADMIN_CREDENTIALS.phone;

    if (!validEmail && !validPhone) {
      return {
        ok: false,
        message:
          "Invalid admin email or phone number.",
      };
    }

    if (
      password !==
      ADMIN_CREDENTIALS.password
    ) {
      return {
        ok: false,
        message: "Invalid password.",
      };
    }

    const adminUser: AdminUser = {
      id: "admin-001",
      name: "Neoi Admin",
      email: ADMIN_CREDENTIALS.email,
      phone: ADMIN_CREDENTIALS.phone,
      role: "super_admin",
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(adminUser),
    );

    setAdmin(adminUser);

    return { ok: true };
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setAdmin(null);
  }

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoaded,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context =
    useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      "useAdminAuth must be used inside AdminAuthProvider",
    );
  }

  return context;
}