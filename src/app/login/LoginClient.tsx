  "use client";

  import { useState } from "react";
  import { useRouter, useSearchParams } from "next/navigation";
  import { useAuth } from "@/context/AuthContext";

  export default function LoginClient() {
    const router = useRouter();
    const { login } = useAuth();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect");

    const [isSignup, setIsSignup] = useState(false);
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [error, setError] = useState("");

    function isValidPhone(phone: string) {
      return /^[6-9]\d{9}$/.test(phone);
    }

    function isValidPin(pin: string) {
      return /^\d{4}$/.test(pin);
    }

    function handleSubmit() {
      setError("");

      if (!isValidPhone(phone)) {
        setError("Enter valid 10-digit mobile number");
        return;
      }

      if (isSignup && name.trim().length < 3) {
        setError("Enter valid full name (at least 3 characters)");
        return;
      }

      if (!isValidPin(pin)) {
        setError("Enter a valid 4-digit PIN");
        return;
      }

      if (isSignup && pin !== confirmPin) {
        setError("PINs do not match");
        return;
      }

      login(phone);

      if (name) {
        localStorage.setItem("userName", name);
      }

      if (redirect) {
        router.push(redirect);
      } else {
        router.push("/checkout");
      }
    }

    function handleGoogleLogin() {
      // Add your Google OAuth logic here
      console.log("Google Login Clicked");
    }

    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50/80 via-white to-emerald-50/50 px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 w-full max-w-md">

          <h1 className="text-2xl font-bold text-gray-900 text-center tracking-tight">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>

          <p className="text-sm text-gray-500 text-center mt-2">
            {isSignup
              ? "Sign up to continue booking services"
              : "Login to continue"}
          </p>

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            onClick={handleGoogleLogin}
            className="mt-6 w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-3 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative my-6 flex items-center justify-center">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-xs text-gray-400 font-medium uppercase absolute">
              Or
            </span>
          </div>

          <div className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                maxLength={10}
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              />
            </div>

            <div className={isSignup ? "grid grid-cols-2 gap-3" : ""}>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isSignup ? "Create 4-Digit PIN" : "4-Digit PIN"}
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-center tracking-widest text-base font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                />
              </div>

              {isSignup && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Confirm PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="••••"
                    value={confirmPin}
                    onChange={(e) =>
                      setConfirmPin(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-center tracking-widest text-base font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  />
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="text-xs font-medium text-red-500 bg-red-50 border border-red-200 rounded-lg p-3 mt-4 text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-black text-white font-semibold py-3.5 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition shadow-md"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>

          <div className="mt-6 text-center text-sm text-gray-600">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setIsSignup(false);
                    setError("");
                  }}
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                First time here?{" "}
                <button
                  onClick={() => {
                    setIsSignup(true);
                    setError("");
                  }}
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

        </div>
      </main>
    );
  }