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
  Link as LinkIcon,
  ImageIcon,
} from "lucide-react";

type ImageMode = "url" | "upload";

export default function BannersPage() {
  const { banners, addBanner, updateBanner, deleteBanner, toggleBannerStatus } =
    useBanners();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [form, setForm] = useState({ title: "", image: "", link: "" });
  const [imageMode, setImageMode] = useState<ImageMode>("url");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------- Handlers ---------- */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.image) {
      setUploadError("Please provide an image (URL or upload).");
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
    setImageMode("url");
    setUploadError(null);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startEdit = (b: Banner) => {
    setEditing(b);
    setForm({ title: b.title, image: b.image, link: b.link });

    // Detect if the existing image is a base64 upload or a URL
    setImageMode(b.image.startsWith("data:") ? "upload" : "url");
    setShowForm(true);
  };

  /* ---------- File Upload Handling ---------- */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    // Validate size (max 2MB to keep localStorage happy)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image is too large. Max size is 2MB.");
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: reader.result as string }));
      setUploading(false);
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

              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3">
                {/* Title */}
                <div className="sm:col-span-1">
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
                    className="w-full rounded-lg border p-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Link */}
                <div className="sm:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Redirect Link
                  </label>
                  <input
                    required
                    placeholder="/offers/summer"
                    value={form.link}
                    onChange={(e) =>
                      setForm({ ...form, link: e.target.value })
                    }
                    className="w-full rounded-lg border p-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Image Mode Toggle */}
                <div className="sm:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Image Source
                  </label>
                  <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setImageMode("url");
                        setUploadError(null);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        imageMode === "url"
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      <LinkIcon size={14} /> URL
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageMode("upload");
                        setUploadError(null);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        imageMode === "upload"
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      <UploadCloud size={14} /> Upload
                    </button>
                  </div>
                </div>

                {/* Conditional Image Input */}
                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {imageMode === "url" ? "Image URL" : "Upload from Device"}
                  </label>

                  {imageMode === "url" ? (
                    <input
                      type="text"
                      placeholder="/images/banner.png  or  https://cdn.example.com/banner.jpg"
                      value={form.image.startsWith("data:") ? "" : form.image}
                      onChange={(e) =>
                        setForm({ ...form, image: e.target.value })
                      }
                      className="w-full rounded-lg border p-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  ) : (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-700 file:cursor-pointer"
                      />
                      <p className="mt-1 text-[11px] text-gray-500">
                        PNG, JPG or WEBP. Max 2MB.
                      </p>
                    </div>
                  )}

                  {uploadError && (
                    <p className="mt-2 text-xs text-red-600">{uploadError}</p>
                  )}

                  {uploading && (
                    <p className="mt-2 text-xs text-indigo-600">
                      Processing image…
                    </p>
                  )}

                  {/* Live Preview */}
                  {form.image && (
                    <div className="mt-3 flex items-start gap-3">
                      <div className="relative h-20 w-32 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                        <img
                          src={form.image}
                          alt="Banner preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs font-medium text-gray-700">
                          Preview
                        </p>
                        <p className="text-[11px] text-gray-500 truncate max-w-xs">
                          {form.image.startsWith("data:")
                            ? "Local upload (base64)"
                            : form.image}
                        </p>
                        <button
                          type="button"
                          onClick={clearImage}
                          className="mt-1 inline-flex w-fit items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-medium text-red-600 hover:bg-red-100"
                        >
                          <X size={12} /> Remove image
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="sm:col-span-3 flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={uploading}
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
                    <th className="px-5 py-3">Source</th>
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
                        {b.link}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            b.image.startsWith("data:")
                              ? "bg-purple-50 text-purple-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {b.image.startsWith("data:") ? (
                            <>
                              <UploadCloud size={11} /> Uploaded
                            </>
                          ) : (
                            <>
                              <LinkIcon size={11} /> URL
                            </>
                          )}
                        </span>
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
                        colSpan={6}
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