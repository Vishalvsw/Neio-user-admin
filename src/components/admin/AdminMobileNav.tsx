"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminMobileNav() {
  const [open, setOpen] =
    useState(false);

  return (
    <AdminSidebar
      mobileOpen={open}
      onClose={() => setOpen(false)}
    />
  );
}