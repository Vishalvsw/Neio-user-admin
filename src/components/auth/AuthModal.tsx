"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Chrome, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Mode = "login" | "signup";

export default function AuthModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const { loginWithPin, register } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setError("");
      setPin("");
      setConfirmPin("");
      setShowPin(false);
      setShowConfirmPin(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open || typeof document === "undefined") return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setError("");
    setPin("");
    setConfirmPin("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      if (mode === "signup") {
        if (!name.trim()) {
          setError("Please enter your full name.");
          return;
        }

        if (phone.length !== 10) {
          setError(
            "Please enter a valid 10 digit mobile number.",
          );
          return;
        }

        if (pin.length !== 4) {
          setError("PIN must be exactly 4 digits.");
          return;
        }

        if (pin !== confirmPin) {
          setError("PIN and confirm PIN do not match.");
          return;
        }

        const result = await register({
          name,
          phone,
          pin,
        });

        if (!result.ok) {
          setError(
            result.message ||
              "Unable to create your account.",
          );
          return;
        }
      } else {
        if (phone.length !== 10) {
          setError(
            "Please enter a valid 10 digit mobile number.",
          );
          return;
        }

        if (pin.length !== 4) {
          setError("PIN must be exactly 4 digits.");
          return;
        }

        const result = await loginWithPin(
          phone,
          pin,
        );

        if (!result.ok) {
          setError(
            result.message ||
              "Unable to log in.",
          );
          return;
        }
      }

      // Authentication succeeded.
      onClose();
      onSuccess?.();
    } finally {
      setSubmitting(false);
    }
  }

  function continueGoogle() {
    setError(
      "Google sign-in is not configured yet. Please use your mobile number and 4 digit PIN.",
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/50 px-4 py-6 sm:py-10">
      <div className="flex min-h-full items-start justify-center sm:items-center">
        <div className="relative my-auto max-h-[calc(100vh-3rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:max-h-[calc(100vh-5rem)] sm:p-7">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="pr-8">
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === "login"
                ? "Welcome back"
                : "Create your account"}
            </h2>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              {mode === "login"
                ? "Log in with your mobile number and 4 digit PIN."
                : "Create your account with your name, mobile number and 4 digit PIN."}
            </p>
          </div>

          {/* Login / Signup switch */}
          <div className="mt-5 grid grid-cols-2 rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                mode === "login"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                mode === "signup"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={continueGoogle}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            <Chrome size={18} />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-xs text-gray-400">
              OR
            </span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Form */}
          <form
            onSubmit={submit}
            className="space-y-3"
          >
            {/* Name */}
            {mode === "signup" && (
              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Full Name"
                autoComplete="name"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            )}

            {/* Phone */}
            <input
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10),
                )
              }
              placeholder="Mobile Number"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            {/* PIN */}
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) =>
                  setPin(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 4),
                  )
                }
                placeholder="4 digit PIN"
                inputMode="numeric"
                autoComplete={
                  mode === "login"
                    ? "current-password"
                    : "new-password"
                }
                maxLength={4}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-11 text-sm tracking-[0.2em] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPin((value) => !value)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label={
                  showPin
                    ? "Hide PIN"
                    : "Show PIN"
                }
              >
                {showPin ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {/* Confirm PIN */}
            {mode === "signup" && (
              <div className="relative">
                <input
                  type={
                    showConfirmPin
                      ? "text"
                      : "password"
                  }
                  value={confirmPin}
                  onChange={(e) =>
                    setConfirmPin(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 4),
                    )
                  }
                  placeholder="Confirm 4 digit PIN"
                  inputMode="numeric"
                  autoComplete="new-password"
                  maxLength={4}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-11 text-sm tracking-[0.2em] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPin(
                      (value) => !value,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  aria-label={
                    showConfirmPin
                      ? "Hide PIN"
                      : "Show PIN"
                  }
                >
                  {showConfirmPin ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs leading-5 text-red-600">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Please wait..."
                : mode === "login"
                  ? "Login"
                  : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}