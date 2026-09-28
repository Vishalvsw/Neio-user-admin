export type AdminRole =
  | "super_admin"
  | "admin"
  | "operations_manager";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "technician_assigned"
  | "technician_on_the_way"
  | "service_started"
  | "service_completed"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AdminRole;
}

export interface AdminBooking {
  id: string;
  customerName: string;
  customerPhone: string;
  service: string;
  variant: string;
  area: string;
  city: string;
  address?: string;
  bookingDate: string;
  bookingTime: string;
  technician: string | null;
  amount: number;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
}

export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  todayBookings: number;
  completedBookings: number;
  totalRevenue: number;
}

/* ---------------- Locations ---------------- */

export interface AdminCity {
  id: string;
  name: string;
  slug: string;
  state: string;
  active: boolean;
  areaCount: number;
}

export interface AdminArea {
  id: string;
  cityId: string;
  name: string;
  slug: string;
  active: boolean;
  serviceIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminServiceOption {
  id: string;
  name: string;
  category: string;
}