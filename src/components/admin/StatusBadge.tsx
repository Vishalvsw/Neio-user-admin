import type {
  BookingStatus,
  PaymentStatus,
} from "@/lib/admin/types";

interface Props {
  status: BookingStatus | PaymentStatus;
}

const labels: Record<
  BookingStatus | PaymentStatus,
  string
> = {
  pending: "Pending",
  confirmed: "Confirmed",
  technician_assigned: "Technician Assigned",
  technician_on_the_way:
    "Technician On The Way",
  service_started: "Service Started",
  service_completed: "Completed",
  cancelled: "Cancelled",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

const styles: Record<
  BookingStatus | PaymentStatus,
  string
> = {
  pending:
    "bg-amber-50 text-amber-700",
  confirmed:
    "bg-blue-50 text-blue-700",
  technician_assigned:
    "bg-indigo-50 text-indigo-700",
  technician_on_the_way:
    "bg-purple-50 text-purple-700",
  service_started:
    "bg-cyan-50 text-cyan-700",
  service_completed:
    "bg-green-50 text-green-700",
  cancelled:
    "bg-red-50 text-red-700",
  paid:
    "bg-green-50 text-green-700",
  failed:
    "bg-red-50 text-red-700",
  refunded:
    "bg-gray-100 text-gray-700",
};

export default function StatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}