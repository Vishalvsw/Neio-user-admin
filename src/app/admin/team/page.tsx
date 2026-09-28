"use client";

import { useState, useEffect, useMemo } from "react";
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
  Search,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

type Staff = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  skills: string[];
  available: boolean;
  joinedAt: string;
};

const STORAGE_KEY = "neoi_team";

const CITIES = ["Bangalore", "Hyderabad", "Chennai", "Mumbai", "Pune"];

const ALL_SKILLS = [
  "Bathroom Cleaning",
  "Kitchen Cleaning",
  "Full Home Cleaning",
  "Sofa Cleaning",
  "Cockroach Control",
  "Termite Control",
  "Plumbing",
  "Electrical",
  "Painting",
  "AC Service",
  "Deep Cleaning",
  "Pest Control",
];

const DEFAULT_STAFF: Staff[] = [
  {
    id: "1",
    name: "Ravi Kumar",
    phone: "+91 98765 43210",
    email: "ravi@neoi.in",
    city: "Bangalore",
    area: "Koramangala",
    skills: ["Bathroom Cleaning", "Kitchen Cleaning"],
    available: true,
    joinedAt: "2025-06-15",
  },
  {
    id: "2",
    name: "Suresh Patel",
    phone: "+91 98765 43211",
    email: "suresh@neoi.in",
    city: "Bangalore",
    area: "Indiranagar",
    skills: ["Cockroach Control", "Termite Control"],
    available: true,
    joinedAt: "2025-08-02",
  },
  {
    id: "3",
    name: "Mahesh Reddy",
    phone: "+91 98765 43212",
    email: "mahesh@neoi.in",
    city: "Hyderabad",
    area: "Gachibowli",
    skills: ["Full Home Cleaning", "Sofa Cleaning"],
    available: false,
    joinedAt: "2026-01-10",
  },
];

const EMPTY_FORM: Omit<Staff, "id"> = {
  name: "",
  phone: "",
  email: "",
  city: "Bangalore",
  area: "",
  skills: [],
  available: true,
  joinedAt: new Date().toISOString().split("T")[0],
};

/* ------------------------------------------------------------------ */
/* Drawer                                                             */
/* ------------------------------------------------------------------ */

function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-xl bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="h-[calc(100%-65px)] overflow-y-auto p-6">{children}</div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                              */
/* ------------------------------------------------------------------ */

export default function AdminTeamPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [staff, setStaff] = useState<Staff[]>(DEFAULT_STAFF);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");

  /* Load / persist */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setStaff(
          parsed.map((s: any) => ({
            id: s.id,
            name: s.name,
            phone: s.phone,
            email: s.email ?? "",
            city: s.city ?? "",
            area: s.area ?? "",
            skills: s.skills ?? [],
            available: s.available ?? true,
            joinedAt: s.joinedAt ?? new Date().toISOString().split("T")[0],
          }))
        );
      } catch {}
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) localStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
  }, [staff, loading]);

  /* Filter */
  const filtered = useMemo(() => {
    if (!search) return staff;
    const q = search.toLowerCase();
    return staff.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.phone.includes(search) ||
        s.city.toLowerCase().includes(q) ||
        s.area.toLowerCase().includes(q) ||
        s.skills.some((sk) => sk.toLowerCase().includes(q))
    );
  }, [staff, search]);

  /* Handlers */
  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditing(null);
    setShowDrawer(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;

    if (editing) {
      setStaff((prev) =>
        prev.map((s) => (s.id === editing.id ? { ...s, ...form } : s))
      );
    } else {
      setStaff((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    }
    resetForm();
  };

  const startEdit = (s: Staff) => {
    setEditing(s);
    setForm({
      name: s.name,
      phone: s.phone,
      email: s.email,
      city: s.city,
      area: s.area,
      skills: s.skills,
      available: s.available,
      joinedAt: s.joinedAt,
    });
    setShowDrawer(true);
  };

  const deleteStaff = (id: string) => {
    if (confirm("Remove this staff member?")) {
      setStaff((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const toggleAvailable = (id: string) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, available: !s.available } : s))
    );
  };

  const toggleSkill = (skill: string) => {
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter((s) => s !== skill)
        : [...f.skills, skill],
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
        Loading team…
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
            title="Team"
            description="Manage staff, their skills and availability."
          />

          {/* Toolbar */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px] flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name, phone, city or skill…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${inputClass} pl-9`}
              />
            </div>

            <button
              onClick={() => {
                resetForm();
                setShowDrawer(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Plus size={16} /> Add Staff
            </button>
          </div>

          {/* ============ SIMPLE LIST ============ */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Contact</th>
                    <th className="px-5 py-3">Location</th>
                    <th className="px-5 py-3">Skills</th>
                    <th className="px-5 py-3">Available</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold">
                            {s.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {s.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Joined {s.joinedAt}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700">{s.phone}</p>
                        {s.email && (
                          <p className="text-xs text-gray-500 truncate max-w-[180px]">
                            {s.email}
                          </p>
                        )}
                      </td>

                      {/* Location */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700">{s.area}</p>
                        <p className="text-xs text-gray-500">{s.city}</p>
                      </td>

                      {/* Skills */}
                      <td className="px-5 py-4">
                        {s.skills.length === 0 ? (
                          <span className="text-xs text-gray-400">—</span>
                        ) : (
                          <div className="flex flex-wrap gap-1 max-w-[280px]">
                            {s.skills.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700"
                              >
                                {skill}
                              </span>
                            ))}
                            {s.skills.length > 3 && (
                              <span className="text-[10px] text-gray-500 self-center">
                                +{s.skills.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Available */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => toggleAvailable(s.id)}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            s.available
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {s.available ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          {s.available ? "Available" : "Busy"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(s)}
                            className="rounded p-1.5 text-indigo-600 hover:bg-indigo-50"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteStaff(s.id)}
                            className="rounded p-1.5 text-red-600 hover:bg-red-50"
                            title="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-16 text-center text-sm text-gray-500"
                      >
                        No staff match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* ============ DRAWER ============ */}
      <Drawer
        open={showDrawer}
        onClose={resetForm}
        title={editing ? "Edit Staff" : "Add Staff"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ravi Kumar"
                className={inputClass}
              />
            </Field>

            <Field label="Phone">
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className={inputClass}
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="ravi@neoi.in"
                className={inputClass}
              />
            </Field>

            <Field label="City">
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={inputClass}
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Area">
              <input
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                placeholder="Koramangala"
                className={inputClass}
              />
            </Field>

            <Field label="Joined Date">
              <input
                type="date"
                value={form.joinedAt}
                onChange={(e) =>
                  setForm({ ...form, joinedAt: e.target.value })
                }
                className={inputClass}
              />
            </Field>
          </div>

          {/* ============ SKILLS ============ */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-900">Skills</h4>
              <p className="text-xs text-gray-500">
                Tap to assign or remove skills.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {ALL_SKILLS.map((skill) => {
                const on = form.skills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      on
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300"
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>

            {form.skills.length > 0 && (
              <p className="mt-3 text-[11px] text-gray-500">
                <span className="font-semibold text-gray-700">
                  {form.skills.length}
                </span>{" "}
                skill{form.skills.length === 1 ? "" : "s"} selected
              </p>
            )}
          </div>

          <Toggle
            label="Available for new jobs"
            checked={form.available}
            onChange={(v) => setForm({ ...form, available: v })}
          />

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {editing ? "Update Staff" : "Add Staff"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reusable UI                                                        */
/* ------------------------------------------------------------------ */

const inputClass =
  "w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50/60 px-4 py-3 cursor-pointer hover:bg-gray-50">
      <span className="text-sm text-gray-800">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          checked ? "bg-indigo-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </label>
  );
}