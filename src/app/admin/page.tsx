"use client";

import {
  CalendarCheck,
  CheckCircle2,
  Clock3,
  IndianRupee,
} from "lucide-react";

import { dashboardStats, recentBookings } from "@/lib/admin/mockData";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";

import { useState } from "react";

export default function AdminDashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

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
            title="Overview"
            description="Monitor bookings, operations and business activity."
          />

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Bookings"
              value={dashboardStats.totalBookings}
              description="All bookings"
              icon={CalendarCheck}
            />

            <StatCard
              title="Pending Bookings"
              value={dashboardStats.pendingBookings}
              description="Require attention"
              icon={Clock3}
            />

            <StatCard
              title="Today's Bookings"
              value={dashboardStats.todayBookings}
              description="Scheduled today"
              icon={CalendarCheck}
            />

            <StatCard
              title="Revenue"
              value={`₹${dashboardStats.totalRevenue.toLocaleString("en-IN")}`}
              description="Current dashboard period"
              icon={IndianRupee}
            />
          </div>

          {/* Secondary summary */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <CheckCircle2 size={20} />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Completed Bookings
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {dashboardStats.completedBookings}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent bookings */}
          <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Recent Bookings
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Latest customer bookings
                </p>
              </div>

              <a
                href="/admin/bookings"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                View all
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
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
                      Location
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
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {recentBookings.map(
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
                            {booking.bookingDate}
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
                          <p className="text-sm text-gray-700">
                            {booking.area}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {booking.city}
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

                          <p className="mt-1 text-xs text-gray-500">
                            {booking.paymentStatus}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={booking.status}
                          />
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}