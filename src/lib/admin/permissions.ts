import type { AdminRole } from "./types";

export type AdminPermission =
  | "dashboard.view"
  | "bookings.view"
  | "bookings.manage"
  | "coupons.manage"
  | "locations.manage"
  | "team.manage"
  | "banners.manage"
  | "categories.manage"
  | "settings.manage";

const ROLE_PERMISSIONS: Record<
  AdminRole,
  AdminPermission[]
> = {
  super_admin: [
    "dashboard.view",
    "bookings.view",
    "bookings.manage",
    "coupons.manage",
    "locations.manage",
    "team.manage",
    "banners.manage",
    "categories.manage",
    "settings.manage",
  ],

  admin: [
    "dashboard.view",
    "bookings.view",
    "bookings.manage",
    "coupons.manage",
    "locations.manage",
    "team.manage",
    "banners.manage",
    "categories.manage",
  ],

  operations_manager: [
    "dashboard.view",
    "bookings.view",
    "bookings.manage",
    "locations.manage",
    "team.manage",
  ],
};

export function hasPermission(
  role: AdminRole,
  permission: AdminPermission,
) {
  return ROLE_PERMISSIONS[role].includes(permission);
}