export interface Coupon {
  code: string;
  type: "percentage" | "flat";
  value: number;
  minAmount?: number;
  description: string;
}

export const COUPONS: Coupon[] = [
  {
    code: "SAVE10",
    type: "percentage",
    value: 10,
    minAmount: 1000,
    description: "Get 10% off on orders above ₹1000",
  },
  {
    code: "NEW15",
    type: "percentage",
    value: 15,
    description: "15% off for new users",
  },
  {
    code: "FLAT200",
    type: "flat",
    value: 200,
    minAmount: 1500,
    description: "Flat ₹200 off on orders above ₹1500",
  },
];