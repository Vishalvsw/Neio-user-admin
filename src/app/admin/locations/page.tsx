"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Edit3,
  MapPin,
  Plus,
  Search,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

import {
  adminAreas,
  adminCities,
  adminServiceOptions,
} from "@/lib/admin/mockData";

import type { AdminArea } from "@/lib/admin/types";

const PAGE_SIZE = 20;

export default function AdminLocationsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [areas, setAreas] =
    useState<AdminArea[]>(adminAreas);

  const [selectedCityId, setSelectedCityId] =
    useState(adminCities[0]?.id ?? "");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<"all" | "active" | "inactive">(
      "all",
    );

  const [page, setPage] = useState(1);

  const [editingArea, setEditingArea] =
    useState<AdminArea | null>(null);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const selectedCity = adminCities.find(
    (city) => city.id === selectedCityId,
  );

  const filteredAreas = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return areas.filter((area) => {
      if (area.cityId !== selectedCityId) {
        return false;
      }

      const matchesSearch =
        !query ||
        area.name
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          area.active) ||
        (statusFilter === "inactive" &&
          !area.active);

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    areas,
    selectedCityId,
    search,
    statusFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredAreas.length / PAGE_SIZE,
    ),
  );

  const paginatedAreas = filteredAreas.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const activeCount = areas.filter(
    (area) =>
      area.cityId === selectedCityId &&
      area.active,
  ).length;

  const inactiveCount =
    areas.filter(
      (area) =>
        area.cityId === selectedCityId &&
        !area.active,
    ).length;

  function updateArea(
    areaId: string,
    updates: Partial<AdminArea>,
  ) {
    setAreas((current) =>
      current.map((area) =>
        area.id === areaId
          ? {
              ...area,
              ...updates,
              updatedAt: new Date()
                .toISOString()
                .slice(0, 10),
            }
          : area,
      ),
    );
  }

  function toggleArea(area: AdminArea) {
    updateArea(area.id, {
      active: !area.active,
    });
  }

  function handleSearch(
    value: string,
  ) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(
    value: "all" | "active" | "inactive",
  ) {
    setStatusFilter(value);
    setPage(1);
  }

  function saveNewArea(
    name: string,
  ) {
    const cleanName = name.trim();

    if (!cleanName) return;

    const duplicate = areas.some(
      (area) =>
        area.cityId === selectedCityId &&
        area.name.toLowerCase() ===
          cleanName.toLowerCase(),
    );

    if (duplicate) {
      return;
    }

    const newArea: AdminArea = {
      id: `area-${Date.now()}`,
      cityId: selectedCityId,
      name: cleanName,
      slug: cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      active: true,
      serviceIds:
        adminServiceOptions.map(
          (service) => service.id,
        ),
      createdAt: new Date()
        .toISOString()
        .slice(0, 10),
      updatedAt: new Date()
        .toISOString()
        .slice(0, 10),
    };

    setAreas((current) => [
      newArea,
      ...current,
    ]);

    setShowAddModal(false);
    setPage(1);
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
            title="Locations"
            description="Manage cities, service areas and service availability."
            action={
              <button
                type="button"
                onClick={() =>
                  setShowAddModal(true)
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <Plus size={17} />
                Add Area
              </button>
            }
          />

          {/* City + summary */}
          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                City
              </p>

              <div className="relative mt-3">
                <select
                  value={selectedCityId}
                  onChange={(e) => {
                    setSelectedCityId(
                      e.target.value,
                    );
                    setPage(1);
                  }}
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-3 py-3 pr-9 text-sm font-medium text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  {adminCities.map(
                    (city) => (
                      <option
                        key={city.id}
                        value={city.id}
                      >
                        {city.name}
                      </option>
                    ),
                  )}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              {selectedCity && (
                <div className="mt-4 flex items-start gap-2">
                  <MapPin
                    size={16}
                    className="mt-0.5 text-indigo-500"
                  />

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedCity.name},{" "}
                      {selectedCity.state}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      {selectedCity.areaCount} areas
                      configured
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <SummaryCard
                title="Total Areas"
                value={
                  activeCount +
                  inactiveCount
                }
                description="Configured in selected city"
              />

              <SummaryCard
                title="Active"
                value={activeCount}
                description="Currently accepting bookings"
              />

              <SummaryCard
                title="Inactive"
                value={inactiveCount}
                description="Not currently available"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px]">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(e) =>
                    handleSearch(
                      e.target.value,
                    )
                  }
                  placeholder="Search area..."
                  className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    handleStatusChange(
                      e.target.value as
                        | "all"
                        | "active"
                        | "inactive",
                    )
                  }
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-3 py-2.5 pr-9 text-sm outline-none focus:border-indigo-500"
                >
                  <option value="all">
                    All areas
                  </option>

                  <option value="active">
                    Active only
                  </option>

                  <option value="inactive">
                    Inactive only
                  </option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <section className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Service Areas
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {filteredAreas.length} matching
                  areas
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b bg-gray-50 text-left">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Area
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Slug
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Services
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Updated
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {paginatedAreas.map(
                    (area) => (
                      <tr
                        key={area.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                              <MapPin
                                size={17}
                              />
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {area.name}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-500">
                                Bengaluru
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <code className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                            {area.slug}
                          </code>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingArea(
                                area,
                              )
                            }
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                          >
                            {
                              area.serviceIds
                                .length
                            }{" "}
                            of{" "}
                            {
                              adminServiceOptions.length
                            }{" "}
                            services
                          </button>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              toggleArea(
                                area,
                              )
                            }
                            className="inline-flex items-center gap-2"
                          >
                            {area.active ? (
                              <>
                                <ToggleRight
                                  size={24}
                                  className="text-green-600"
                                />

                                <span className="text-xs font-medium text-green-700">
                                  Active
                                </span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft
                                  size={24}
                                  className="text-gray-400"
                                />

                                <span className="text-xs font-medium text-gray-500">
                                  Inactive
                                </span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-500">
                          {area.updatedAt}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingArea(
                                area,
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <Edit3
                              size={14}
                            />
                            Manage
                          </button>
                        </td>
                      </tr>
                    ),
                  )}

                  {paginatedAreas.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-16 text-center"
                      >
                        <MapPin
                          size={30}
                          className="mx-auto text-gray-300"
                        />

                        <p className="mt-3 text-sm font-medium text-gray-900">
                          No areas found
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Try another search or
                          add a new area.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredAreas.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500">
                  Page {page} of{" "}
                  {totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() =>
                      setPage(
                        (current) =>
                          current - 1,
                      )
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={
                      page === totalPages
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          current + 1,
                      )
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Add Area */}
      {showAddModal && (
        <AddAreaModal
          cityName={
            selectedCity?.name || "Bengaluru"
          }
          onClose={() =>
            setShowAddModal(false)
          }
          onSave={saveNewArea}
        />
      )}

      {/* Manage Area */}
      {editingArea && (
        <ManageAreaModal
          area={editingArea}
          onClose={() =>
            setEditingArea(null)
          }
          onSave={(updates) => {
            updateArea(
              editingArea.id,
              updates,
            );

            setEditingArea(null);
          }}
        />
      )}
    </div>
  );
}

/* ---------------- Summary Card ---------------- */

function SummaryCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}

/* ---------------- Add Area ---------------- */

function AddAreaModal({
  cityName,
  onClose,
  onSave,
}: {
  cityName: string;
  onClose: () => void;
  onSave: (name: string) => void;
}) {
  const [name, setName] =
    useState("");

  return (
    <Modal onClose={onClose}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Add Location
          </p>

          <h2 className="mt-1 text-xl font-bold text-gray-900">
            Add Service Area
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add an area under {cityName}.
          </p>
        </div>

        <CloseButton onClick={onClose} />
      </div>

      <div className="mt-6">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Area name
        </label>

        <input
          autoFocus
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="e.g. Bellandur"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={!name.trim()}
          onClick={() =>
            onSave(name)
          }
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add Area
        </button>
      </div>
    </Modal>
  );
}

/* ---------------- Manage Area ---------------- */

function ManageAreaModal({
  area,
  onClose,
  onSave,
}: {
  area: AdminArea;
  onClose: () => void;
  onSave: (
    updates: Partial<AdminArea>,
  ) => void;
}) {
  const [name, setName] =
    useState(area.name);

  const [active, setActive] =
    useState(area.active);

  const [selectedServices, setSelectedServices] =
    useState<string[]>(
      area.serviceIds,
    );

  function toggleService(
    serviceId: string,
  ) {
    setSelectedServices(
      (current) =>
        current.includes(serviceId)
          ? current.filter(
              (id) => id !== serviceId,
            )
          : [...current, serviceId],
    );
  }

  return (
    <Modal onClose={onClose}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Manage Area
          </p>

          <h2 className="mt-1 text-xl font-bold text-gray-900">
            {area.name}
          </h2>
        </div>

        <CloseButton onClick={onClose} />
      </div>

      {/* Name */}
      <div className="mt-6">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Area name
        </label>

        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Status */}
      <div className="mt-5 flex items-center justify-between rounded-xl border border-gray-200 p-4">
        <div>
          <p className="text-sm font-medium text-gray-900">
            Service availability
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Allow customers to book services
            in this area.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setActive(
              (current) => !current,
            )
          }
          className="shrink-0"
          aria-label="Toggle area availability"
        >
          {active ? (
            <ToggleRight
              size={34}
              className="text-green-600"
            />
          ) : (
            <ToggleLeft
              size={34}
              className="text-gray-400"
            />
          )}
        </button>
      </div>

      {/* Services */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Available Services
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Choose which services customers
              can book in this area.
            </p>
          </div>

          <span className="text-xs font-medium text-gray-500">
            {selectedServices.length}/
            {adminServiceOptions.length}
          </span>
        </div>

        <div className="mt-3 space-y-2">
          {adminServiceOptions.map(
            (service) => {
              const selected =
                selectedServices.includes(
                  service.id,
                );

              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() =>
                    toggleService(
                      service.id,
                    )
                  }
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                    selected
                      ? "border-indigo-200 bg-indigo-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {service.name}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      {service.category}
                    </p>
                  </div>

                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                      selected
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {selected && (
                      <Check size={13} />
                    )}
                  </div>
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={!name.trim()}
          onClick={() =>
            onSave({
              name: name.trim(),
              slug: name
                .trim()
                .toLowerCase()
                .replace(
                  /[^a-z0-9]+/g,
                  "-",
                )
                .replace(
                  /^-|-$/g,
                  "",
                ),
              active,
              serviceIds:
                selectedServices,
            })
          }
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
}

/* ---------------- Modal ---------------- */

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Close modal"
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        {children}
      </div>
    </div>
  );
}

function CloseButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
      aria-label="Close"
    >
      <X size={19} />
    </button>
  );
}