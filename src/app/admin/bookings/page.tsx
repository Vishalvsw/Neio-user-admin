"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Eye,
  Filter,
  Search,
  UserRound,
  X,
} from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StatusBadge from "@/components/admin/StatusBadge";

import {
  adminTeamMembers,
  recentBookings,
} from "@/lib/admin/mockData";

import type {
  AdminBooking,
  BookingStatus,
  PaymentStatus,
} from "@/lib/admin/types";

const statusOptions: {
  value: BookingStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  {
    value: "technician_assigned",
    label: "Technician Assigned",
  },
  {
    value: "technician_on_the_way",
    label: "Technician On The Way",
  },
  {
    value: "service_started",
    label: "Service Started",
  },
  {
    value: "service_completed",
    label: "Completed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

const paymentOptions: {
  value: PaymentStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "All payments" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

const transitions: Record<
  BookingStatus,
  BookingStatus[]
> = {
  pending: ["confirmed", "cancelled"],

  confirmed: [
    "technician_assigned",
    "cancelled",
  ],

  technician_assigned: [
    "technician_on_the_way",
    "cancelled",
  ],

  technician_on_the_way: [
    "service_started",
    "cancelled",
  ],

  service_started: [
    "service_completed",
  ],

  service_completed: [],

  cancelled: [],
};

export default function AdminBookingsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [bookings, setBookings] =
    useState<AdminBooking[]>(
      recentBookings,
    );

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<BookingStatus | "all">("all");

  const [paymentFilter, setPaymentFilter] =
    useState<PaymentStatus | "all">("all");

  const [selectedBooking, setSelectedBooking] =
    useState<AdminBooking | null>(null);

  const filteredBookings = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        !query ||
        booking.id
          .toLowerCase()
          .includes(query) ||
        booking.customerName
          .toLowerCase()
          .includes(query) ||
        booking.customerPhone.includes(query) ||
        booking.service
          .toLowerCase()
          .includes(query) ||
        booking.area
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        booking.status === statusFilter;

      const matchesPayment =
        paymentFilter === "all" ||
        booking.paymentStatus ===
          paymentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment
      );
    });
  }, [
    bookings,
    search,
    statusFilter,
    paymentFilter,
  ]);

  function updateStatus(
    bookingId: string,
    status: BookingStatus,
  ) {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status,
            }
          : booking,
      ),
    );

    setSelectedBooking((current) =>
      current?.id === bookingId
        ? {
            ...current,
            status,
          }
        : current,
    );
  }

  function assignTechnician(
    bookingId: string,
    technician: string,
  ) {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              technician,
              status:
                booking.status === "confirmed"
                  ? "technician_assigned"
                  : booking.status,
            }
          : booking,
      ),
    );

    setSelectedBooking((current) =>
      current?.id === bookingId
        ? {
            ...current,
            technician,
            status:
              current.status === "confirmed"
                ? "technician_assigned"
                : current.status,
          }
        : current,
    );
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("all");
    setPaymentFilter("all");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onClose={() =>
          setMobileMenuOpen(false)
        }
      />

      <div className="min-w-0 flex-1">
        <AdminHeader
          onMenuClick={() =>
            setMobileMenuOpen(true)
          }
        />

        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <AdminPageHeader
            title="Bookings"
            description="Manage customer bookings, technicians and service progress."
          />

          {/* Filters */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_200px_auto]">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search booking, customer, phone, service or area..."
                  className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as
                        | BookingStatus
                        | "all",
                    )
                  }
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-3 py-2.5 pr-9 text-sm outline-none focus:border-indigo-500"
                >
                  {statusOptions.map(
                    (option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ),
                  )}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <div className="relative">
                <select
                  value={paymentFilter}
                  onChange={(e) =>
                    setPaymentFilter(
                      e.target.value as
                        | PaymentStatus
                        | "all",
                    )
                  }
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-3 py-2.5 pr-9 text-sm outline-none focus:border-indigo-500"
                >
                  {paymentOptions.map(
                    (option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ),
                  )}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Filter size={16} />
                Reset
              </button>
            </div>
          </div>

          {/* Result count */}
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredBookings.length}
              </span>{" "}
              bookings
            </p>
          </div>

          {/* Table */}
          <section className="mt-3 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b bg-gray-50 text-left">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Booking
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Customer
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Service
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Schedule
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Technician
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Amount
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map(
                    (booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-gray-900">
                            {booking.id}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {booking.area},{" "}
                            {booking.city}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {booking.customerName}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {booking.customerPhone}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {booking.service}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {booking.variant}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <CalendarDays
                              size={15}
                              className="text-gray-400"
                            />

                            {booking.bookingDate}
                          </div>

                          <p className="mt-1 text-xs text-gray-500">
                            {booking.bookingTime}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-700">
                          {booking.technician ||
                            "Not assigned"}
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-gray-900">
                            ₹
                            {booking.amount.toLocaleString(
                              "en-IN",
                            )}
                          </p>

                          <p className="mt-1 text-xs capitalize text-gray-500">
                            {booking.paymentStatus}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={booking.status}
                          />
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedBooking(
                                booking,
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <Eye size={15} />
                            View
                          </button>
                        </td>
                      </tr>
                    ),
                  )}

                  {filteredBookings.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-5 py-16 text-center"
                      >
                        <Search
                          size={28}
                          className="mx-auto text-gray-300"
                        />

                        <p className="mt-3 text-sm font-medium text-gray-900">
                          No bookings found
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Try changing your
                          search or filters.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {selectedBooking && (
        <BookingDetails
          booking={selectedBooking}
          onClose={() =>
            setSelectedBooking(null)
          }
          onStatusChange={updateStatus}
          onAssignTechnician={
            assignTechnician
          }
        />
      )}
    </div>
  );
}

function BookingDetails({
  booking,
  onClose,
  onStatusChange,
  onAssignTechnician,
}: {
  booking: AdminBooking;
  onClose: () => void;
  onStatusChange: (
    bookingId: string,
    status: BookingStatus,
  ) => void;
  onAssignTechnician: (
    bookingId: string,
    technician: string,
  ) => void;
}) {
  const nextStatuses =
    transitions[booking.status];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Close booking details"
      />

      <aside className="relative z-10 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <p className="text-xs text-gray-500">
              Booking
            </p>

            <h2 className="text-lg font-bold text-gray-900">
              {booking.id}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Status */}
          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Booking Status
              </h3>

              <StatusBadge
                status={booking.status}
              />
            </div>

            {nextStatuses.length > 0 && (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {nextStatuses.map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        onStatusChange(
                          booking.id,
                          status,
                        )
                      }
                      className="rounded-xl border border-gray-300 px-3 py-2.5 text-left text-xs font-medium text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
                    >
                      Move to{" "}
                      <span className="font-semibold">
                        {formatStatus(status)}
                      </span>
                    </button>
                  ),
                )}
              </div>
            )}
          </section>

          {/* Customer */}
          <section className="mt-5 rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <UserRound
                size={17}
                className="text-gray-400"
              />

              <h3 className="text-sm font-semibold text-gray-900">
                Customer
              </h3>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Info
                label="Name"
                value={booking.customerName}
              />

              <Info
                label="Phone"
                value={booking.customerPhone}
              />

              <Info
                label="Area"
                value={`${booking.area}, ${booking.city}`}
              />

              {booking.address && (
                <Info
                  label="Address"
                  value={booking.address}
                />
              )}
            </div>
          </section>

          {/* Service */}
          <section className="mt-4 rounded-2xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Service Details
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Info
                label="Service"
                value={booking.service}
              />

              <Info
                label="Variant"
                value={booking.variant}
              />

              <Info
                label="Booking Date"
                value={booking.bookingDate}
              />

              <Info
                label="Time"
                value={booking.bookingTime}
              />
            </div>
          </section>

          {/* Technician */}
          <section className="mt-4 rounded-2xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Technician Assignment
            </h3>

            <select
              value={booking.technician || ""}
              onChange={(e) => {
                if (!e.target.value) {
                  return;
                }

                onAssignTechnician(
                  booking.id,
                  e.target.value,
                );
              }}
              className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">
                Select technician
              </option>

              {adminTeamMembers
                .filter(
                  (member) =>
                    member.role ===
                      "technician" ||
                    member.role ===
                      "team_lead",
                )
                .map((member) => (
                  <option
                    key={member.id}
                    value={member.name}
                  >
                    {member.name} —{" "}
                    {formatStatus(
                      member.status,
                    )}
                  </option>
                ))}
            </select>

            <p className="mt-2 text-xs text-gray-500">
              Assigning a technician to a confirmed
              booking changes its status to
              Technician Assigned.
            </p>
          </section>

          {/* Payment */}
          <section className="mt-4 rounded-2xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Payment
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Info
                label="Amount"
                value={`₹${booking.amount.toLocaleString(
                  "en-IN",
                )}`}
              />

              <Info
                label="Payment Status"
                value={formatStatus(
                  booking.paymentStatus,
                )}
              />
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium leading-5 text-gray-900">
        {value}
      </p>
    </div>
  );
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}