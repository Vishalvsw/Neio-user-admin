import { Suspense } from "react";
import LoginClient from "./LoginClient";

import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  );
}