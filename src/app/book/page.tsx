import { redirect } from "next/navigation";

/**
 * Compatibility route for older links.
 * Booking now happens through cart -> checkout -> confirmation.
 */
export default function BookPage() {
  redirect("/checkout");
}
