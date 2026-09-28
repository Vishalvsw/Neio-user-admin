"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  fallback?: string;
  label?: string;
  className?: string;
}

export default function BackButton({
  fallback = "/",
  label = "Back",
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallback);
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-gray-900 ${className}`}
    >
      <ArrowLeft size={16} aria-hidden="true" />
      {label}
    </button>
  );
}
