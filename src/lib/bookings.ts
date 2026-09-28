import type { Booking, BookingItem } from "@/types/booking";

export const BOOKINGS_STORAGE_KEY = "neoi_bookings";
export const LAST_BOOKING_ID_KEY = "neoi_last_booking_id";

interface CreateBookingInput {
  userId: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  area?: string;
  address: string;
  date: string;
  slot: string;
  items: BookingItem[];
  itemTotal: number;
  discount: number;
  platformFee: number;
  gst: number;
  finalTotal: number;
}

function canUseStorage() {
  return typeof window !== "undefined";
}

function readRawBookings(): Booking[] {
  if (!canUseStorage()) return [];

  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeBookings(bookings: Booking[]) {
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
}

function createBookingId() {
  const year = new Date().getFullYear();

  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()
      : `${Date.now().toString(36).toUpperCase()}${Math.random()
          .toString(36)
          .slice(2, 6)
          .toUpperCase()}`;

  return `NEO-${year}-${suffix}`;
}

/**
 * Reads the new booking store and performs a one-time compatibility migration
 * from the old `orders` localStorage key used by the previous checkout flow.
 */
export function getBookings(): Booking[] {
  if (!canUseStorage()) return [];

  const current = readRawBookings();
  if (current.length > 0) return current;

  try {
    const legacyRaw = localStorage.getItem("orders");
    if (!legacyRaw) return [];

    const legacy = JSON.parse(legacyRaw);
    if (!Array.isArray(legacy) || legacy.length === 0) return [];

    const migrated: Booking[] = legacy.map((order) => ({
      id: String(order.id),
      userId: String(order.userId || "legacy"),
      name: String(order.name || "Customer"),
      phone: String(order.phone || ""),
      email: order.email || undefined,
      city: order.city || undefined,
      area: order.area || undefined,
      address: String(order.address || ""),
      date: String(order.date || ""),
      slot: String(order.slot || ""),
      items: Array.isArray(order.items) ? order.items : [],
      itemTotal: Number(order.itemTotal || 0),
      discount: Number(order.discount || 0),
      platformFee: Number(order.platformFee || 0),
      gst: Number(order.gst || 0),
      finalTotal: Number(order.finalTotal || 0),
      status: "Confirmed",
      createdAt: String(order.createdAt || new Date().toISOString()),
    }));

    writeBookings(migrated);
    return migrated;
  } catch {
    return [];
  }
}

export function getBookingsForUser(userId: string): Booking[] {
  return getBookings()
    .filter((booking) => booking.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function getBookingById(id: string): Booking | null {
  return getBookings().find((booking) => booking.id === id) || null;
}

export function createBooking(input: CreateBookingInput): Booking {
  if (!canUseStorage()) {
    throw new Error("Booking storage is unavailable.");
  }

  const booking: Booking = {
    id: createBookingId(),
    userId: input.userId,
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || undefined,
    city: input.city?.trim() || undefined,
    area: input.area?.trim() || undefined,
    address: input.address.trim(),
    date: input.date,
    slot: input.slot,
    items: input.items.map((item) => ({ ...item })),
    itemTotal: input.itemTotal,
    discount: input.discount,
    platformFee: input.platformFee,
    gst: input.gst,
    finalTotal: input.finalTotal,
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  };

  const bookings = getBookings();
  writeBookings([...bookings, booking]);
  localStorage.setItem(LAST_BOOKING_ID_KEY, booking.id);

  return booking;
}

export function getLastBookingForUser(userId: string): Booking | null {
  const lastId = canUseStorage()
    ? localStorage.getItem(LAST_BOOKING_ID_KEY)
    : null;

  if (lastId) {
    const booking = getBookingById(lastId);
    if (booking?.userId === userId) return booking;
  }

  return getBookingsForUser(userId)[0] || null;
}
