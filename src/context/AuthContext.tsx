"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface AuthUser {
  id: string;
  phone: string;
  name: string;
  email?: string;
  provider: "phone" | "google";
}

interface StoredAccount {
  id: string;
  phone: string;
  name: string;
  email?: string;
  provider: "phone" | "google";
  pinHash: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoaded: boolean;
  register: (input: {
    name: string;
    phone: string;
    pin: string;
  }) => Promise<{ ok: boolean; message?: string }>;
  loginWithPin: (
    phone: string,
    pin: string,
  ) => Promise<{ ok: boolean; message?: string }>;
  login: (user: AuthUser | string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCOUNTS_KEY = "neoi_auth_accounts";
const SESSION_KEY = "authUser";

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

async function hashPin(pin: string) {
  const data = new TextEncoder().encode(pin);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function readAccounts(): StoredAccount[] {
  try {
    const stored = localStorage.getItem(ACCOUNTS_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function toUser(account: StoredAccount): AuthUser {
  return {
    id: account.id,
    phone: account.phone,
    name: account.name,
    email: account.email,
    provider: account.provider,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.phone && parsed?.name) {
          setUser(parsed);
        }
      } else {
        // Backward compatibility with the previous localStorage session shape.
        const phone = localStorage.getItem("user");
        const name = localStorage.getItem("userName");

        if (phone) {
          const migrated: AuthUser = {
            id: `legacy-${phone}`,
            phone: normalizePhone(phone),
            name: name || "Customer",
            provider: "phone",
          };

          setUser(migrated);
          localStorage.setItem(SESSION_KEY, JSON.stringify(migrated));
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  async function register(input: {
    name: string;
    phone: string;
    pin: string;
  }) {
    const name = input.name.trim();
    const phone = normalizePhone(input.phone);
    const pin = input.pin.trim();

    if (name.length < 2) {
      return { ok: false, message: "Enter your full name." };
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return { ok: false, message: "Enter a valid 10 digit mobile number." };
    }

    if (!/^\d{4}$/.test(pin)) {
      return { ok: false, message: "PIN must be exactly 4 digits." };
    }

    const accounts = readAccounts();

    if (accounts.some((account) => account.phone === phone)) {
      return {
        ok: false,
        message: "An account already exists for this mobile number. Please log in.",
      };
    }

    const account: StoredAccount = {
      id: crypto.randomUUID(),
      phone,
      name,
      provider: "phone",
      pinHash: await hashPin(pin),
    };

    accounts.push(account);
    writeAccounts(accounts);

    const nextUser = toUser(account);
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
    localStorage.setItem("user", nextUser.phone);
    localStorage.setItem("userName", nextUser.name);
    setUser(nextUser);

    return { ok: true };
  }

  async function loginWithPin(phoneInput: string, pinInput: string) {
    const phone = normalizePhone(phoneInput);
    const pin = pinInput.trim();

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return { ok: false, message: "Enter a valid 10 digit mobile number." };
    }

    if (!/^\d{4}$/.test(pin)) {
      return { ok: false, message: "Enter your 4 digit PIN." };
    }

    const account = readAccounts().find((item) => item.phone === phone);

    if (!account) {
      return {
        ok: false,
        message: "No account found for this mobile number. Please sign up first.",
      };
    }

    const pinHash = await hashPin(pin);

    if (pinHash !== account.pinHash) {
      return { ok: false, message: "Incorrect PIN. Please try again." };
    }

    const nextUser = toUser(account);
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
    localStorage.setItem("user", nextUser.phone);
    localStorage.setItem("userName", nextUser.name);
    setUser(nextUser);

    return { ok: true };
  }

  // Compatibility helper for existing code paths. New login UI should use loginWithPin.
  function login(nextUser: AuthUser | string, fallbackName = "Customer") {
    const normalizedUser: AuthUser =
      typeof nextUser === "string"
        ? {
            id: `legacy-${normalizePhone(nextUser)}`,
            phone: normalizePhone(nextUser),
            name: fallbackName,
            provider: "phone",
          }
        : nextUser;

    localStorage.setItem(SESSION_KEY, JSON.stringify(normalizedUser));
    localStorage.setItem("user", normalizedUser.phone);
    localStorage.setItem("userName", normalizedUser.name);
    setUser(normalizedUser);
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoaded,
        register,
        loginWithPin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be inside AuthProvider");
  }

  return context;
}
