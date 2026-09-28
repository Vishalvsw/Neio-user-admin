export interface BookingItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

export type BookingStatus = "Confirmed";

export interface Booking {
  id: string;
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
  status: BookingStatus;
  createdAt: string;
}
