"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLoginPage() {
  const router = useRouter();

  const {
    admin,
    isLoaded,
    login,
  } = useAdminAuth();

  const [identifier, setIdentifier] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    if (isLoaded && admin) {
      router.replace("/admin");
    }
  }, [
    admin,
    isLoaded,
    router,
  ]);

  function handleSubmit(
    e: FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    const result = login(
      identifier,
      password,
    );

    if (!result.ok) {
      setError(
        result.message ||
          "Unable to login.",
      );
      setSubmitting(false);
      return;
    }

    router.replace("/admin");
  }

  if (!isLoaded || admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-lg">
            N
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Neoi Admin
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage Neoi Home Services
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
              <LockKeyhole size={19} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              Admin Login
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Use your admin email or phone number.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="identifier"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Email or Phone
              </label>

              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) =>
                  setIdentifier(
                    e.target.value,
                  )
                }
                placeholder="admin@neoi.in or 9999999999"
                autoComplete="username"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value,
                    )
                  }
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-11 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-500 hover:bg-gray-100"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Signing in..."
                : "Sign In"}
            </button>
          </form>

          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold text-gray-700">
              Development credentials
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Email: admin@neoi.in
            </p>

            <p className="text-xs text-gray-500">
              Phone: 9999999999
            </p>

            <p className="text-xs text-gray-500">
              Password: admin123
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}