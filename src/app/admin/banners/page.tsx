"use client";

import { useState, useRef } from "react";
import { useBanners, Banner } from "@/context/BannerContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  X,
  UploadCloud,
} from "lucide-react";

export default function BannersPage() {
  const { banners, addBanner, updateBanner, deleteBanner, toggleBannerStatus } =
    useBanners();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [form, setForm] = useState({ title: "", image: "", link: "" });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------- Handlers ---------- */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.image) {
      setUploadError("Please upload a banner image.");
      return;
    }

    if (editing) {
      updateBanner(editing.id, form);
    } else {
      addBanner({ ...form, active: true });
    }
    resetForm();
  };

  const resetForm = () => {
    setForm({ title: "", image: "", link: "" });
    setEditing(null);
    setShowForm(false);
    setUploadError(null);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startEdit = (b: Banner) => {
    setEditing(b);
    setForm({ title: b.title, image: b.image, link: b.link });
    setShowForm(true);
  };

  /* ---------- File Upload with Compression ---------- */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File too large. Max 10MB original.");
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        // Downscale to max 1600px on the long edge
        const MAX_DIM = 1600;
        const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setUploadError("Canvas not supported.");
          setUploading(false);
          return;
        }

        ctx.drawImage(img, 0, 0, w, h);

        const compressed = canvas.toDataURL("image/jpeg", 0.8);
        const sizeKB = Math.round(compressed.length / 1024);

        console.log(
          `🎨 Banner compressed: ${img.width}×${img.height} → ${w}×${h}, ${sizeKB} KB`
        );

        if (sizeKB > 500) {
          setUploadError(
            `Image is ${sizeKB}KB after compression. Please use a smaller/simpler image.`
          );
          setUploading(false);
          return;
        }

        setForm((prev) => ({ ...prev, image: compressed }));
        setUploading(false);
      };
      img.onerror = () => {
        setUploadError("Failed to read the image.");
        setUploading(false);
      };
      img.src = reader.result as string;
    };
    reader.onerror = () => {
      setUploadError("Failed to read the file. Try again.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setForm((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUploadError(null);
  };

  /* ---------- Render ---------- */

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
            title="Banner Management"
            description="Control the banners displayed on the website homepage."
          />

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              <Plus size={16} /> Add Banner
            </button>
          </div>

          {/* ---------- FORM ---------- */}
          {showForm && (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editing ? "Edit Banner" : "Create New Banner"}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Banner Title
                    </label>
                    <input
                      required
                      placeholder="e.g., Summer Sale"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Link */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Redirect Link (optional)
                    </label>
                    <input
                      placeholder="/offers/summer"
                      value={form.link}
                      onChange={(e) =>
                        setForm({ ...form, link: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Banner Image
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {!form.image ? (
                    <label
                      htmlFor="banner-file-upload"
                      className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadCloud size={28} className="text-indigo-600" />
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload a banner image
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG or WEBP. Images are auto-compressed.
                      </p>
                    </label>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative overflow-hidden rounded-lg border border-gray-200">
                        <img
                          src={form.image}
                          alt="Banner preview"
                          className="w-full max-h-52 object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <UploadCloud size={12} /> Replace
                        </button>
                        <button
                          type="button"
                          onClick={clearImage}
                          className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                        >
                          <X size={12} /> Remove
                        </button>
                        <span className="text-[11px] text-gray-500">
                          {Math.round((form.image.length || 0) / 1024)} KB
                        </span>
                      </div>
                    </div>
                  )}

                  {uploadError && (
                    <p className="mt-2 text-xs text-red-600">{uploadError}</p>
                  )}

                  {uploading && (
                    <p className="mt-2 text-xs text-indigo-600">
                      Compressing image…
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t">
                  <button
                    type="submit"
                    disabled={uploading || !form.image}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editing ? "Update Banner" : "Create Banner"}
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

          {/* ---------- BANNERS LIST ---------- */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-3">Preview</th>
                    <th className="px-5 py-3">Title</th>
                    <th className="px-5 py-3">Link</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {banners.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <img
                          src={b.image}
                          alt={b.title}
                          className="h-12 w-20 rounded-md object-cover border border-gray-200 bg-gray-100"
                        />
                      </td>
                      <td className="px-5 py-4 font-medium text-gray-900">
                        {b.title}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 font-mono truncate max-w-[200px]">
                        {b.link || <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => toggleBannerStatus(b.id)}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            b.active
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {b.active ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          {b.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(b)}
                            className="rounded p-1.5 text-indigo-600 hover:bg-indigo-50"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteBanner(b.id)}
                            className="rounded p-1.5 text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {banners.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-10 text-center text-sm text-gray-500"
                      >
                        No banners yet. Click &quot;Add Banner&quot; to create
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