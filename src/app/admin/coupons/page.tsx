"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
  Tag,
  Copy,
  Calendar,
  Percent,
  IndianRupee,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

type DiscountType = "percent" | "flat";

type Coupon = {
  id: string;
  code: string;
  description: string;
  type: DiscountType;
  value: number;
  minOrder: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  expiryDate: string;
  active: boolean;
};

const STORAGE_KEY = "neoi_coupons";

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: "1",
    code: "SAVE10",
    description: "Get 10% off on any service",
    type: "percent",
    value: 10,
    minOrder: 499,
    maxDiscount: 200,
    usageLimit: 1000,
    usedCount: 142,
    expiryDate: "2026-12-31",
    active: true,
  },
  {
    id: "2",
    code: "NEWUSER",
    description: "Flat ₹150 off for first-time users",
    type: "flat",
    value: 150,
    minOrder: 699,
    maxDiscount: 0,
    usageLimit: 500,
    usedCount: 87,
    expiryDate: "2026-06-30",
    active: true,
  },
];

const EMPTY_FORM: Omit<Coupon, "id" | "usedCount"> = {
  code: "",
  description: "",
  type: "percent",
  value: 10,
  minOrder: 0,
  maxDiscount: 0,
  usageLimit: 100,
  expiryDate: "",
  active: true,
};

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function AdminCouponsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>(DEFAULT_COUPONS);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  /* ---------- Load / save ---------- */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCoupons(JSON.parse(stored));
      } catch {}
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
    }
  }, [coupons, loading]);

  /* ---------- Handlers ---------- */
  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editing) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editing.id
            ? { ...c, ...form, code: form.code.toUpperCase() }
            : c
        )
      );
    } else {
      const newCoupon: Coupon = {
        ...form,
        code: form.code.toUpperCase(),
        id: Date.now().toString(),
        usedCount: 0,
      };
      setCoupons((prev) => [...prev, newCoupon]);
    }
    resetForm();
  };

  const startEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      description: c.description,
      type: c.type,
      value: c.value,
      minOrder: c.minOrder,
      maxDiscount: c.maxDiscount,
      usageLimit: c.usageLimit,
      expiryDate: c.expiryDate,
      active: c.active,
    });
    setShowForm(true);
  };

  const deleteCoupon = (id: string) => {
    if (confirm("Delete this coupon?")) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  /* ---------- Render ---------- */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
        Loading coupons…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="min-w-0 flex-1">
        <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <AdminPageHeader
            title="Coupons"
            description="Create and manage discount codes offered on the customer website."
          />

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Plus size={16} /> Create Coupon
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editing ? "Edit Coupon" : "Create Coupon"}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid gap-4 sm:grid-cols-3"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Coupon Code
                  </label>
                  <input
                    required
                    value={form.code}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        code: e.target.value.toUpperCase().replace(/\s+/g, ""),
                      })
                    }
                    placeholder="SAVE10"
                    className={`${inputClass} font-mono uppercase`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    required
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Get 10% off on any service"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value as DiscountType })
                    }
                    className={inputClass}
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {form.type === "percent"
                      ? "Discount (%)"
                      : "Discount (₹)"}
                  </label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={form.value}
                    onChange={(e) =>
                      setForm({ ...form, value: Number(e.target.value) })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.minOrder}
                    onChange={(e) =>
                      setForm({ ...form, minOrder: Number(e.target.value) })
                    }
                    className={inputClass}
                  />
                </div>

                {form.type === "percent" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Max Discount (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.maxDiscount}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          maxDiscount: Number(e.target.value),
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.usageLimit}
                    onChange={(e) =>
                      setForm({ ...form, usageLimit: Number(e.target.value) })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    required
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) =>
                      setForm({ ...form, expiryDate: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-3 flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    {editing ? "Update Coupon" : "Create Coupon"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Coupons table */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-3">Code</th>
                    <th className="px-5 py-3">Description</th>
                    <th className="px-5 py-3">Discount</th>
                    <th className="px-5 py-3">Min Order</th>
                    <th className="px-5 py-3">Usage</th>
                    <th className="px-5 py-3">Expiry</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <button
                          onClick={() => copyCode(c.id, c.code)}
                          className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 font-mono text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                        >
                          <Tag size={11} />
                          {c.code}
                          {copiedId === c.id && (
                            <span className="text-[10px] text-green-600 ml-1">
                              Copied!
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">
                        {c.description}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-900">
                          {c.type === "percent" ? (
                            <>
                              <Percent size={12} /> {c.value}%
                            </>
                          ) : (
                            <>
                              <IndianRupee size={12} /> {c.value}
                            </>
                          )}
                        </span>
                        {c.type === "percent" && c.maxDiscount > 0 && (
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            up to ₹{c.maxDiscount}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">
                        ₹{c.minOrder}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">
                        {c.usedCount} / {c.usageLimit}
                        <div className="mt-1 h-1 w-20 rounded-full bg-gray-100">
                          <div
                            className="h-1 rounded-full bg-indigo-500"
                            style={{
                              width: `${Math.min(
                                100,
                                (c.usedCount / c.usageLimit) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={12} />
                          {c.expiryDate}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => toggleActive(c.id)}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            c.active
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {c.active ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          {c.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(c)}
                            className="rounded p-1.5 text-indigo-600 hover:bg-indigo-50"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteCoupon(c.id)}
                            className="rounded p-1.5 text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {coupons.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-5 py-10 text-center text-sm text-gray-500"
                      >
                        No coupons yet. Click &quot;Create Coupon&quot; to add
                        one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white";