// "use client";

// import { useState, useRef } from "react";
// import AdminSidebar from "@/components/admin/AdminSidebar";
// import AdminHeader from "@/components/admin/AdminHeader";
// import AdminPageHeader from "@/components/admin/AdminPageHeader";
// import { useCategories } from "@/context/CategoriesContext";
// import type {
//   Category,
//   SubCategory,
//   ServiceVariant,
//   ServiceSection,
//   ServicePackage,
// } from "@/lib/categories";
// import {
//   Plus,
//   Trash2,
//   Edit2,
//   X,
//   CheckCircle2,
//   XCircle,
//   UploadCloud,
//   FolderTree,
//   Layers,
// } from "lucide-react";

// const inputClass =
//   "w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white";

// /* ---------------- Image uploader ---------------- */

// function ImageUploader({
//   value,
//   onChange,
//   label = "Image",
// }: {
//   value: string;
//   onChange: (url: string) => void;
//   label?: string;
// }) {
//   const ref = useRef<HTMLInputElement>(null);

//   const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     if (!f.type.startsWith("image/")) return alert("Only images");
//     if (f.size > 2 * 1024 * 1024) return alert("Max 2MB");
//     const r = new FileReader();
//     r.onload = () => onChange(r.result as string);
//     r.readAsDataURL(f);
//   };

//   return (
//     <div>
//       <label className="block text-xs font-medium text-gray-700 mb-1">
//         {label}
//       </label>
//       <div className="flex items-center gap-3">
//         <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
//           <UploadCloud size={14} />
//           Upload
//           <input
//             ref={ref}
//             type="file"
//             accept="image/png,image/jpeg,image/webp"
//             className="hidden"
//             onChange={pick}
//           />
//         </label>
//         {value && (
//           <>
//             <div className="h-10 w-10 overflow-hidden rounded border bg-gray-50">
//               <img
//                 src={value}
//                 alt="preview"
//                 className="h-full w-full object-contain"
//               />
//             </div>
//             <button
//               type="button"
//               onClick={() => {
//                 onChange("");
//                 if (ref.current) ref.current.value = "";
//               }}
//               className="text-xs text-red-600 hover:underline"
//             >
//               Remove
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ---------------- Drawer ---------------- */

// function Drawer({
//   open,
//   onClose,
//   title,
//   children,
// }: {
//   open: boolean;
//   onClose: () => void;
//   title: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <>
//       <div
//         className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
//           open ? "opacity-100" : "pointer-events-none opacity-0"
//         }`}
//         onClick={onClose}
//       />
//       <div
//         className={`fixed right-0 top-0 z-50 h-full w-full max-w-2xl bg-white shadow-2xl transition-transform duration-300 ${
//           open ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//           <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
//           <button
//             onClick={onClose}
//             className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
//           >
//             <X size={20} />
//           </button>
//         </div>
//         <div className="h-[calc(100%-65px)] overflow-y-auto p-6">{children}</div>
//       </div>
//     </>
//   );
// }

// /* ---------------- Page ---------------- */

// const EMPTY_SUB_FORM = {
//   name: "",
//   slug: "",
//   image: "",
//   description: "",
//   basePrice: 0,
//   duration: "",
//   banner: "", // ← NEW
// };

// export default function AdminCategoriesPage() {
//   const {
//     categories,
//     loading,
//     addCategory,
//     updateCategory,
//     deleteCategory,
//     toggleActive,
//     addSubcategory,
//     updateSubcategory,
//     deleteSubcategory,
//   } = useCategories();

//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   /* Category drawer */
//   const [showCatDrawer, setShowCatDrawer] = useState(false);
//   const [editingCat, setEditingCat] = useState<Category | null>(null);
//   const [catForm, setCatForm] = useState({ name: "", slug: "", image: "" });

//   /* Subcategory drawer */
//   const [subDrawerFor, setSubDrawerFor] = useState<string | null>(null);
//   const [editingSub, setEditingSub] = useState<SubCategory | null>(null);
//   const [subForm, setSubForm] = useState(EMPTY_SUB_FORM);
//   const [variants, setVariants] = useState<ServiceVariant[]>([]);
//   const [sections, setSections] = useState<ServiceSection[]>([]);

//   /* ---------------- Category handlers ---------------- */

//   const resetCatForm = () => {
//     setCatForm({ name: "", slug: "", image: "" });
//     setEditingCat(null);
//     setShowCatDrawer(false);
//   };

//   const handleCatSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!catForm.name || !catForm.slug) return;

//     if (editingCat) {
//       updateCategory(editingCat.id, catForm);
//     } else {
//       addCategory({
//         name: catForm.name,
//         slug: catForm.slug,
//         image: catForm.image,
//         active: true,
//         subcategories: [],
//       });
//     }
//     resetCatForm();
//   };

//   const startEditCat = (c: Category) => {
//     setEditingCat(c);
//     setCatForm({ name: c.name, slug: c.slug, image: c.image });
//     setShowCatDrawer(true);
//   };

//   /* ---------------- Subcategory handlers ---------------- */

//   const openSubDrawer = (categoryId: string) => {
//     setSubForm(EMPTY_SUB_FORM);
//     setVariants([]);
//     setSections([]);
//     setEditingSub(null);
//     setSubDrawerFor(categoryId);
//   };

//   const closeSubDrawer = () => {
//     setSubForm(EMPTY_SUB_FORM);
//     setVariants([]);
//     setSections([]);
//     setEditingSub(null);
//     setSubDrawerFor(null);
//   };

//   const handleSubSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!subDrawerFor) {
//       alert("Error: no category selected.");
//       return;
//     }
//     if (!subForm.name) {
//       alert("Please enter a Service Name.");
//       return;
//     }
//     if (!subForm.slug) {
//       alert("Please enter a Slug.");
//       return;
//     }

//     const payload = {
//       name: subForm.name,
//       slug: subForm.slug,
//       image: subForm.image,
//       description: subForm.description,
//       basePrice: subForm.basePrice,
//       duration: subForm.duration,
//       banner: subForm.banner, // ← NEW
//       variants: variants.filter((v) => v.name.trim() && v.price > 0),
//       sections: sections
//         .filter((s) => s.name.trim())
//         .map((s) => ({
//           ...s,
//           packages: s.packages.filter((p) => p.title.trim()),
//         })),
//     };

//     if (editingSub) {
//       updateSubcategory(subDrawerFor, editingSub.id, payload);
//     } else {
//       addSubcategory(subDrawerFor, payload);
//     }

//     closeSubDrawer();
//   };

//   const startEditSub = (catId: string, s: SubCategory) => {
//     setSubDrawerFor(catId);
//     setEditingSub(s);
//     setSubForm({
//       name: s.name,
//       slug: s.slug,
//       image: s.image,
//       description: s.description ?? "",
//       basePrice: s.basePrice ?? 0,
//       duration: s.duration ?? "",
//       banner: (s as any).banner ?? "", // ← NEW
//     });
//     setVariants(s.variants ?? []);
//     setSections(s.sections ?? []);
//   };

//   /* ---------------- Variant handlers ---------------- */

//   const addVariant = () => {
//     setVariants((prev) => [
//       ...prev,
//       { id: Date.now().toString(), name: "", price: 0, description: "" },
//     ]);
//   };

//   const updateVariant = (id: string, patch: Partial<ServiceVariant>) => {
//     setVariants((prev) =>
//       prev.map((v) => (v.id === id ? { ...v, ...patch } : v))
//     );
//   };

//   const removeVariant = (id: string) => {
//     setVariants((prev) => prev.filter((v) => v.id !== id));
//   };

//   /* ---------------- Section handlers ---------------- */

//   const addSection = () => {
//     setSections((prev) => [
//       ...prev,
//       { id: Date.now().toString(), name: "", packages: [] },
//     ]);
//   };

//   const updateSection = (id: string, patch: Partial<ServiceSection>) => {
//     setSections((prev) =>
//       prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
//     );
//   };

//   const removeSection = (id: string) => {
//     setSections((prev) => prev.filter((s) => s.id !== id));
//   };

//   const addPackage = (sectionId: string) => {
//     setSections((prev) =>
//       prev.map((s) =>
//         s.id === sectionId
//           ? {
//               ...s,
//               packages: [
//                 ...s.packages,
//                 {
//                   id: Date.now().toString(),
//                   title: "",
//                   description: "",
//                   duration: "",
//                   price: 0,
//                   image: "",
//                   optionsCount: 0,
//                 },
//               ],
//             }
//           : s
//       )
//     );
//   };

//   const updatePackage = (
//     sectionId: string,
//     pkgId: string,
//     patch: Partial<ServicePackage>
//   ) => {
//     setSections((prev) =>
//       prev.map((s) =>
//         s.id === sectionId
//           ? {
//               ...s,
//               packages: s.packages.map((p) =>
//                 p.id === pkgId ? { ...p, ...patch } : p
//               ),
//             }
//           : s
//       )
//     );
//   };

//   const removePackage = (sectionId: string, pkgId: string) => {
//     setSections((prev) =>
//       prev.map((s) =>
//         s.id === sectionId
//           ? { ...s, packages: s.packages.filter((p) => p.id !== pkgId) }
//           : s
//       )
//     );
//   };

//   /* ---------------- Render ---------------- */

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
//         Loading categories…
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <AdminSidebar
//         mobileOpen={mobileMenuOpen}
//         onClose={() => setMobileMenuOpen(false)}
//       />

//       <div className="min-w-0 flex-1">
//         <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />

//         <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
//           <AdminPageHeader
//             title="Categories & Services"
//             description="Manage categories, services, pricing and options shown on the customer website."
//           />

//           <div className="mt-6 flex justify-end">
//             <button
//               onClick={() => {
//                 resetCatForm();
//                 setShowCatDrawer(true);
//               }}
//               className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
//             >
//               <Plus size={16} /> Add Category
//             </button>
//           </div>

//           {/* CATEGORY CARDS */}
//           <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//             {categories.map((cat) => (
//               <div
//                 key={cat.id}
//                 className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
//               >
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
//                     {cat.image ? (
//                       <img
//                         src={cat.image}
//                         alt={cat.name}
//                         className="h-10 w-10 object-contain"
//                       />
//                     ) : (
//                       <FolderTree size={20} className="text-indigo-600" />
//                     )}
//                   </div>

//                   <div className="min-w-0 flex-1">
//                     <div className="flex items-start justify-between gap-2">
//                       <div className="min-w-0">
//                         <h3 className="font-semibold text-gray-900 truncate">
//                           {cat.name}
//                         </h3>
//                         <p className="text-xs text-gray-500 font-mono truncate">
//                           /{cat.slug}
//                         </p>
//                       </div>
//                       <button
//                         onClick={() => toggleActive(cat.id)}
//                         className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
//                           cat.active
//                             ? "bg-green-50 text-green-700"
//                             : "bg-gray-100 text-gray-500"
//                         }`}
//                       >
//                         {cat.active ? (
//                           <CheckCircle2 size={11} />
//                         ) : (
//                           <XCircle size={11} />
//                         )}
//                         {cat.active ? "Active" : "Hidden"}
//                       </button>
//                     </div>

//                     <p className="mt-2 text-xs text-gray-500">
//                       {cat.subcategories.length} service
//                       {cat.subcategories.length === 1 ? "" : "s"}
//                     </p>

//                     <div className="mt-3 flex flex-wrap gap-2">
//                       <button
//                         onClick={() => startEditCat(cat)}
//                         className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
//                       >
//                         <Edit2 size={12} /> Edit
//                       </button>
//                       <button
//                         onClick={() => openSubDrawer(cat.id)}
//                         className="inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
//                       >
//                         <Plus size={12} /> Add Service
//                       </button>
//                       <button
//                         onClick={() => {
//                           if (
//                             confirm(
//                               "Delete this category and all its services?"
//                             )
//                           ) {
//                             deleteCategory(cat.id);
//                           }
//                         }}
//                         className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
//                       >
//                         <Trash2 size={12} /> Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {cat.subcategories.length > 0 && (
//                   <div className="mt-4 border-t pt-3">
//                     <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-2">
//                       Services
//                     </p>
//                     <div className="flex flex-col gap-1.5">
//                       {cat.subcategories.map((sub) => (
//                         <div
//                           key={sub.id}
//                           className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2 py-1.5"
//                         >
//                           <div className="flex items-center gap-2 min-w-0">
//                             {sub.image ? (
//                               <img
//                                 src={sub.image}
//                                 alt={sub.name}
//                                 className="h-5 w-5 shrink-0 object-contain"
//                               />
//                             ) : (
//                               <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-700">
//                                 {sub.name.charAt(0)}
//                               </div>
//                             )}
//                             <div className="min-w-0">
//                               <span className="text-xs text-gray-700 truncate block">
//                                 {sub.name}
//                               </span>
//                               <span className="text-[10px] text-gray-500">
//                                 {sub.sections?.length ?? 0} chips ·{" "}
//                                 {sub.variants?.length ?? 0} variants
//                               </span>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-1 shrink-0">
//                             <button
//                               onClick={() => startEditSub(cat.id, sub)}
//                               className="rounded p-1 text-gray-500 hover:bg-white hover:text-indigo-600"
//                               title="Edit"
//                             >
//                               <Edit2 size={12} />
//                             </button>
//                             <button
//                               onClick={() => {
//                                 if (confirm(`Delete "${sub.name}"?`)) {
//                                   deleteSubcategory(cat.id, sub.id);
//                                 }
//                               }}
//                               className="rounded p-1 text-gray-500 hover:bg-white hover:text-red-600"
//                               title="Delete"
//                             >
//                               <Trash2 size={12} />
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {categories.length === 0 && (
//               <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
//                 <FolderTree size={32} className="mx-auto text-gray-400 mb-2" />
//                 <p className="text-sm text-gray-500">
//                   No categories yet. Click &quot;Add Category&quot; to create one.
//                 </p>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>

//       {/* CATEGORY DRAWER */}
//       <Drawer
//         open={showCatDrawer}
//         onClose={resetCatForm}
//         title={editingCat ? "Edit Category" : "Create Category"}
//       >
//         <form onSubmit={handleCatSubmit} className="space-y-4">
//           <div>
//             <label className="block text-xs font-medium text-gray-700 mb-1">
//               Category Name
//             </label>
//             <input
//               required
//               value={catForm.name}
//               onChange={(e) =>
//                 setCatForm({
//                   ...catForm,
//                   name: e.target.value,
//                   slug:
//                     !editingCat && !catForm.slug
//                       ? e.target.value
//                           .toLowerCase()
//                           .replace(/\s+/g, "-")
//                           .replace(/[^a-z0-9-]/g, "")
//                       : catForm.slug,
//                 })
//               }
//               placeholder="e.g., Painting"
//               className={inputClass}
//             />
//           </div>

//           <div>
//             <label className="block text-xs font-medium text-gray-700 mb-1">
//               Slug
//             </label>
//             <input
//               required
//               value={catForm.slug}
//               onChange={(e) =>
//                 setCatForm({
//                   ...catForm,
//                   slug: e.target.value
//                     .toLowerCase()
//                     .replace(/\s+/g, "-")
//                     .replace(/[^a-z0-9-]/g, ""),
//                 })
//               }
//               placeholder="painting"
//               className={`${inputClass} font-mono`}
//             />
//           </div>

//           <ImageUploader
//             label="Category Icon"
//             value={catForm.image}
//             onChange={(url) => setCatForm((f) => ({ ...f, image: url }))}
//           />

//           <div className="flex gap-3 pt-4 border-t">
//             <button
//               type="submit"
//               className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
//             >
//               {editingCat ? "Update Category" : "Create Category"}
//             </button>
//             <button
//               type="button"
//               onClick={resetCatForm}
//               className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </Drawer>

//       {/* SUBCATEGORY DRAWER */}
//       <Drawer
//         open={!!subDrawerFor}
//         onClose={closeSubDrawer}
//         title={editingSub ? "Edit Service" : "Add Service"}
//       >
//         <form onSubmit={handleSubSubmit} className="space-y-5">
//           <div className="grid gap-4 sm:grid-cols-2">
//             <div>
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Service Name
//               </label>
//               <input
//                 required
//                 value={subForm.name}
//                 onChange={(e) => {
//                   const name = e.target.value;
//                   const autoSlug = name
//                     .toLowerCase()
//                     .replace(/\s+/g, "-")
//                     .replace(/[^a-z0-9-]/g, "");
//                   setSubForm({
//                     ...subForm,
//                     name,
//                     slug: editingSub ? subForm.slug : autoSlug,
//                   });
//                 }}
//                 placeholder="Wall Painting"
//                 className={inputClass}
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Slug
//               </label>
//               <input
//                 required
//                 value={subForm.slug}
//                 onChange={(e) =>
//                   setSubForm({
//                     ...subForm,
//                     slug: e.target.value
//                       .toLowerCase()
//                       .replace(/\s+/g, "-")
//                       .replace(/[^a-z0-9-]/g, ""),
//                   })
//                 }
//                 placeholder="wall-painting"
//                 className={`${inputClass} font-mono`}
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Base Price (₹)
//               </label>
//               <input
//                 type="number"
//                 min={0}
//                 value={subForm.basePrice}
//                 onChange={(e) =>
//                   setSubForm({
//                     ...subForm,
//                     basePrice: Number(e.target.value),
//                   })
//                 }
//                 className={inputClass}
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Duration
//               </label>
//               <input
//                 value={subForm.duration}
//                 onChange={(e) =>
//                   setSubForm({ ...subForm, duration: e.target.value })
//                 }
//                 placeholder="e.g., 2-4 days"
//                 className={inputClass}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-medium text-gray-700 mb-1">
//               Description
//             </label>
//             <textarea
//               rows={3}
//               value={subForm.description}
//               onChange={(e) =>
//                 setSubForm({
//                   ...subForm,
//                   description: e.target.value,
//                 })
//               }
//               placeholder="Interior wall painting with premium emulsion"
//               className={`${inputClass} resize-none`}
//             />
//           </div>

//           <ImageUploader
//             label="Service Icon"
//             value={subForm.image}
//             onChange={(url) => setSubForm((f) => ({ ...f, image: url }))}
//           />

//           {/* ============ SERVICE BANNER (NEW) ============ */}
//           <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-4">
//             <h4 className="text-sm font-semibold text-gray-900 mb-1">
//               Service Banner (optional)
//             </h4>
//             <p className="text-xs text-gray-500 mb-3">
//               Upload a large banner image for this service. Shown at the top of
//               the customer service page.
//             </p>
//             <ImageUploader
//               label="Banner Image"
//               value={subForm.banner}
//               onChange={(url) => setSubForm((f) => ({ ...f, banner: url }))}
//             />
//           </div>

//           {/* ============ CHIPS ============ */}
//           <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-4">
//             <div className="flex items-center justify-between mb-3">
//               <div>
//                 <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
//                   <Layers size={14} />
//                   "What service do you need?" Chips
//                 </h4>
//                 <p className="text-xs text-gray-500">
//                   Add property types (Apartment, Villa, etc.). Each holds its
//                   own packages.
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={addSection}
//                 className="inline-flex items-center gap-1 rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
//               >
//                 <Plus size={12} /> Add Chip
//               </button>
//             </div>

//             {sections.length === 0 && (
//               <p className="py-4 text-center text-xs text-gray-400">
//                 No chips yet. Add at least one (e.g., "1 BHK").
//               </p>
//             )}

//             <div className="space-y-3">
//               {sections.map((section) => (
//                 <div
//                   key={section.id}
//                   className="rounded-lg border border-gray-200 bg-white p-3"
//                 >
//                   <div className="flex items-center gap-2 mb-3">
//                     <input
//                       className={inputClass}
//                       placeholder="Chip name (e.g., 1 BHK)"
//                       value={section.name}
//                       onChange={(e) =>
//                         updateSection(section.id, { name: e.target.value })
//                       }
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeSection(section.id)}
//                       className="rounded p-2 text-red-600 hover:bg-red-50"
//                     >
//                       <Trash2 size={14} />
//                     </button>
//                   </div>

//                   <div className="pl-4 border-l-2 border-indigo-100">
//                     <div className="flex items-center justify-between mb-2">
//                       <p className="text-[11px] uppercase tracking-wide text-gray-400">
//                         Packages in this chip
//                       </p>
//                       <button
//                         type="button"
//                         onClick={() => addPackage(section.id)}
//                         className="text-xs text-indigo-600 hover:underline font-medium"
//                       >
//                         + Add package
//                       </button>
//                     </div>

//                     {section.packages.length === 0 && (
//                       <p className="text-xs text-gray-400 py-2">
//                         No packages yet.
//                       </p>
//                     )}

//                     <div className="space-y-2">
//                       {section.packages.map((pkg) => (
//                         <div
//                           key={pkg.id}
//                           className="rounded-md border border-gray-100 bg-gray-50 p-2 space-y-2"
//                         >
//                           <div className="flex gap-2">
//                             <input
//                               className={`${inputClass} flex-1`}
//                               placeholder="Package title"
//                               value={pkg.title}
//                               onChange={(e) =>
//                                 updatePackage(section.id, pkg.id, {
//                                   title: e.target.value,
//                                 })
//                               }
//                             />
//                             <input
//                               type="number"
//                               min={0}
//                               className={`${inputClass} w-24`}
//                               placeholder="₹"
//                               value={pkg.price}
//                               onChange={(e) =>
//                                 updatePackage(section.id, pkg.id, {
//                                   price: Number(e.target.value),
//                                 })
//                               }
//                             />
//                             <button
//                               type="button"
//                               onClick={() => removePackage(section.id, pkg.id)}
//                               className="rounded p-1 text-red-600 hover:bg-red-50"
//                             >
//                               <Trash2 size={12} />
//                             </button>
//                           </div>
//                           <div className="flex gap-2">
//                             <input
//                               className={`${inputClass} flex-1`}
//                               placeholder="Description"
//                               value={pkg.description}
//                               onChange={(e) =>
//                                 updatePackage(section.id, pkg.id, {
//                                   description: e.target.value,
//                                 })
//                               }
//                             />
//                             <input
//                               className={`${inputClass} w-32`}
//                               placeholder="Duration"
//                               value={pkg.duration}
//                               onChange={(e) =>
//                                 updatePackage(section.id, pkg.id, {
//                                   duration: e.target.value,
//                                 })
//                               }
//                             />
//                             <input
//                               type="number"
//                               min={0}
//                               className={`${inputClass} w-24`}
//                               placeholder="Options"
//                               value={pkg.optionsCount ?? 0}
//                               onChange={(e) =>
//                                 updatePackage(section.id, pkg.id, {
//                                   optionsCount: Number(e.target.value),
//                                 })
//                               }
//                             />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ============ VARIANTS ============ */}
//           <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
//             <div className="flex items-center justify-between mb-3">
//               <div>
//                 <h4 className="text-sm font-semibold text-gray-900">
//                   Service Variants (optional)
//                 </h4>
//                 <p className="text-xs text-gray-500">
//                   Simple quantity-based options like "1 Bathroom ₹499".
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={addVariant}
//                 className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
//               >
//                 <Plus size={12} /> Add Variant
//               </button>
//             </div>

//             {variants.length === 0 && (
//               <p className="py-4 text-center text-xs text-gray-400">
//                 No variants. (OK — chips can replace these.)
//               </p>
//             )}

//             <div className="space-y-2">
//               {variants.map((v) => (
//                 <div
//                   key={v.id}
//                   className="grid grid-cols-12 gap-2 rounded-lg border border-gray-200 bg-white p-2"
//                 >
//                   <input
//                     className={`${inputClass} col-span-5`}
//                     placeholder="Name"
//                     value={v.name}
//                     onChange={(e) =>
//                       updateVariant(v.id, { name: e.target.value })
//                     }
//                   />
//                   <input
//                     type="number"
//                     min={0}
//                     className={`${inputClass} col-span-3`}
//                     placeholder="Price"
//                     value={v.price}
//                     onChange={(e) =>
//                       updateVariant(v.id, { price: Number(e.target.value) })
//                     }
//                   />
//                   <input
//                     className={`${inputClass} col-span-3`}
//                     placeholder="Note"
//                     value={v.description ?? ""}
//                     onChange={(e) =>
//                       updateVariant(v.id, { description: e.target.value })
//                     }
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeVariant(v.id)}
//                     className="col-span-1 flex items-center justify-center rounded-md text-red-600 hover:bg-red-50"
//                   >
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex gap-3 pt-4 border-t">
//             <button
//               type="submit"
//               className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
//             >
//               {editingSub ? "Update Service" : "Add Service"}
//             </button>
//             <button
//               type="button"
//               onClick={closeSubDrawer}
//               className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </Drawer>
//     </div>
//   );
// }




"use client";

import { useState, useRef } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useCategories } from "@/context/CategoriesContext";
import type {
  Category,
  SubCategory,
  ServiceVariant,
  ServiceSection,
  ServicePackage,
} from "@/lib/categories";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  CheckCircle2,
  XCircle,
  UploadCloud,
  FolderTree,
  Layers,
} from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white";

/* ---------------- Image uploader (canvas-compressed) ---------------- */

function ImageUploader({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      alert("Only images allowed");
      return;
    }

    if (f.size > 10 * 1024 * 1024) {
      alert("Original file must be under 10MB");
      return;
    }

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
          alert("Canvas not supported");
          return;
        }

        ctx.drawImage(img, 0, 0, w, h);

        // Export as JPEG at 80% quality
        const compressed = canvas.toDataURL("image/jpeg", 0.8);
        const sizeKB = Math.round(compressed.length / 1024);

        console.log(
          `🎨 Image compressed: ${img.width}×${img.height} → ${w}×${h}, ${sizeKB} KB`
        );

        // Warn if still huge — protection against storage quota issues
        if (sizeKB > 500) {
          if (
            !confirm(
              `Compressed image is ${sizeKB}KB. ` +
                `Large images may fill browser storage. Continue?`
            )
          ) {
            return;
          }
        }

        onChange(compressed);
      };

      img.onerror = () => alert("Failed to read the image");
      img.src = reader.result as string;
    };

    reader.onerror = () => alert("Failed to read the file");
    reader.readAsDataURL(f);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
          <UploadCloud size={14} />
          Upload
          <input
            ref={ref}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={pick}
          />
        </label>
        {value && (
          <>
            <div className="h-10 w-16 overflow-hidden rounded border bg-gray-50">
              <img
                src={value}
                alt="preview"
                className="h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                onChange("");
                if (ref.current) ref.current.value = "";
              }}
              className="text-xs text-red-600 hover:underline"
            >
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- Drawer ---------------- */

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
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-2xl bg-white shadow-2xl transition-transform duration-300 ${
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

/* ---------------- Page ---------------- */

const EMPTY_SUB_FORM = {
  name: "",
  slug: "",
  image: "",
  description: "",
  basePrice: 0,
  duration: "",
  banner: "",
};

export default function AdminCategoriesPage() {
  const {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleActive,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
  } = useCategories();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* Category drawer */
  const [showCatDrawer, setShowCatDrawer] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState({ name: "", slug: "", image: "" });

  /* Subcategory drawer */
  const [subDrawerFor, setSubDrawerFor] = useState<string | null>(null);
  const [editingSub, setEditingSub] = useState<SubCategory | null>(null);
  const [subForm, setSubForm] = useState(EMPTY_SUB_FORM);
  const [variants, setVariants] = useState<ServiceVariant[]>([]);
  const [sections, setSections] = useState<ServiceSection[]>([]);

  /* ---------------- Category handlers ---------------- */

  const resetCatForm = () => {
    setCatForm({ name: "", slug: "", image: "" });
    setEditingCat(null);
    setShowCatDrawer(false);
  };

  const handleCatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name || !catForm.slug) return;

    if (editingCat) {
      updateCategory(editingCat.id, catForm);
    } else {
      addCategory({
        name: catForm.name,
        slug: catForm.slug,
        image: catForm.image,
        active: true,
        subcategories: [],
      });
    }
    resetCatForm();
  };

  const startEditCat = (c: Category) => {
    setEditingCat(c);
    setCatForm({ name: c.name, slug: c.slug, image: c.image });
    setShowCatDrawer(true);
  };

  /* ---------------- Subcategory handlers ---------------- */

  const openSubDrawer = (categoryId: string) => {
    setSubForm(EMPTY_SUB_FORM);
    setVariants([]);
    setSections([]);
    setEditingSub(null);
    setSubDrawerFor(categoryId);
  };

  const closeSubDrawer = () => {
    setSubForm(EMPTY_SUB_FORM);
    setVariants([]);
    setSections([]);
    setEditingSub(null);
    setSubDrawerFor(null);
  };

  const handleSubSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subDrawerFor) {
      alert("Error: no category selected.");
      return;
    }
    if (!subForm.name) {
      alert("Please enter a Service Name.");
      return;
    }
    if (!subForm.slug) {
      alert("Please enter a Slug.");
      return;
    }

    const payload = {
      name: subForm.name,
      slug: subForm.slug,
      image: subForm.image,
      description: subForm.description,
      basePrice: subForm.basePrice,
      duration: subForm.duration,
      banner: subForm.banner,
      variants: variants.filter((v) => v.name.trim() && v.price > 0),
      sections: sections
        .filter((s) => s.name.trim())
        .map((s) => ({
          ...s,
          packages: s.packages.filter((p) => p.title.trim()),
        })),
    };

    if (editingSub) {
      updateSubcategory(subDrawerFor, editingSub.id, payload);
    } else {
      addSubcategory(subDrawerFor, payload);
    }

    closeSubDrawer();
  };

  const startEditSub = (catId: string, s: SubCategory) => {
    setSubDrawerFor(catId);
    setEditingSub(s);
    setSubForm({
      name: s.name,
      slug: s.slug,
      image: s.image,
      description: s.description ?? "",
      basePrice: s.basePrice ?? 0,
      duration: s.duration ?? "",
      banner: s.banner ?? "",
    });
    setVariants(s.variants ?? []);
    setSections(s.sections ?? []);
  };

  /* ---------------- Variant handlers ---------------- */

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", price: 0, description: "" },
    ]);
  };

  const updateVariant = (id: string, patch: Partial<ServiceVariant>) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...patch } : v))
    );
  };

  const removeVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  /* ---------------- Section handlers ---------------- */

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", packages: [] },
    ]);
  };

  const updateSection = (id: string, patch: Partial<ServiceSection>) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
  };

  const removeSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const addPackage = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              packages: [
                ...s.packages,
                {
                  id: Date.now().toString(),
                  title: "",
                  description: "",
                  duration: "",
                  price: 0,
                  image: "",
                  optionsCount: 0,
                },
              ],
            }
          : s
      )
    );
  };

  const updatePackage = (
    sectionId: string,
    pkgId: string,
    patch: Partial<ServicePackage>
  ) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              packages: s.packages.map((p) =>
                p.id === pkgId ? { ...p, ...patch } : p
              ),
            }
          : s
      )
    );
  };

  const removePackage = (sectionId: string, pkgId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, packages: s.packages.filter((p) => p.id !== pkgId) }
          : s
      )
    );
  };

  /* ---------------- Render ---------------- */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
        Loading categories…
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
            title="Categories & Services"
            description="Manage categories, services, pricing and options shown on the customer website."
          />

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                resetCatForm();
                setShowCatDrawer(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Plus size={16} /> Add Category
            </button>
          </div>

          {/* CATEGORY CARDS */}
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      <FolderTree size={20} className="text-indigo-600" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono truncate">
                          /{cat.slug}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleActive(cat.id)}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          cat.active
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {cat.active ? (
                          <CheckCircle2 size={11} />
                        ) : (
                          <XCircle size={11} />
                        )}
                        {cat.active ? "Active" : "Hidden"}
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      {cat.subcategories.length} service
                      {cat.subcategories.length === 1 ? "" : "s"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => startEditCat(cat)}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => openSubDrawer(cat.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                      >
                        <Plus size={12} /> Add Service
                      </button>
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              "Delete this category and all its services?"
                            )
                          ) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>

                {cat.subcategories.length > 0 && (
                  <div className="mt-4 border-t pt-3">
                    <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-2">
                      Services
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {cat.subcategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2 py-1.5"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {sub.image ? (
                              <img
                                src={sub.image}
                                alt={sub.name}
                                className="h-5 w-5 shrink-0 object-contain"
                              />
                            ) : (
                              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-700">
                                {sub.name.charAt(0)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="text-xs text-gray-700 truncate block">
                                {sub.name}
                              </span>
                              <span className="text-[10px] text-gray-500">
                                {sub.sections?.length ?? 0} chips ·{" "}
                                {sub.variants?.length ?? 0} variants
                                {sub.banner ? " · 🎨 banner" : ""}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => startEditSub(cat.id, sub)}
                              className="rounded p-1 text-gray-500 hover:bg-white hover:text-indigo-600"
                              title="Edit"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete "${sub.name}"?`)) {
                                  deleteSubcategory(cat.id, sub.id);
                                }
                              }}
                              className="rounded p-1 text-gray-500 hover:bg-white hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {categories.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
                <FolderTree size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  No categories yet. Click &quot;Add Category&quot; to create one.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* CATEGORY DRAWER */}
      <Drawer
        open={showCatDrawer}
        onClose={resetCatForm}
        title={editingCat ? "Edit Category" : "Create Category"}
      >
        <form onSubmit={handleCatSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              required
              value={catForm.name}
              onChange={(e) =>
                setCatForm({
                  ...catForm,
                  name: e.target.value,
                  slug:
                    !editingCat && !catForm.slug
                      ? e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, "")
                      : catForm.slug,
                })
              }
              placeholder="e.g., Painting"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              required
              value={catForm.slug}
              onChange={(e) =>
                setCatForm({
                  ...catForm,
                  slug: e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, ""),
                })
              }
              placeholder="painting"
              className={`${inputClass} font-mono`}
            />
          </div>

          <ImageUploader
            label="Category Icon"
            value={catForm.image}
            onChange={(url) => setCatForm((f) => ({ ...f, image: url }))}
          />

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {editingCat ? "Update Category" : "Create Category"}
            </button>
            <button
              type="button"
              onClick={resetCatForm}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </Drawer>

      {/* SUBCATEGORY DRAWER */}
      <Drawer
        open={!!subDrawerFor}
        onClose={closeSubDrawer}
        title={editingSub ? "Edit Service" : "Add Service"}
      >
        <form onSubmit={handleSubSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Service Name
              </label>
              <input
                required
                value={subForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  const autoSlug = name
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "");
                  setSubForm({
                    ...subForm,
                    name,
                    slug: editingSub ? subForm.slug : autoSlug,
                  });
                }}
                placeholder="Wall Painting"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                required
                value={subForm.slug}
                onChange={(e) =>
                  setSubForm({
                    ...subForm,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, ""),
                  })
                }
                placeholder="wall-painting"
                className={`${inputClass} font-mono`}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Base Price (₹)
              </label>
              <input
                type="number"
                min={0}
                value={subForm.basePrice}
                onChange={(e) =>
                  setSubForm({
                    ...subForm,
                    basePrice: Number(e.target.value),
                  })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Duration
              </label>
              <input
                value={subForm.duration}
                onChange={(e) =>
                  setSubForm({ ...subForm, duration: e.target.value })
                }
                placeholder="e.g., 2-4 days"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={subForm.description}
              onChange={(e) =>
                setSubForm({
                  ...subForm,
                  description: e.target.value,
                })
              }
              placeholder="Interior wall painting with premium emulsion"
              className={`${inputClass} resize-none`}
            />
          </div>

          <ImageUploader
            label="Service Icon"
            value={subForm.image}
            onChange={(url) => setSubForm((f) => ({ ...f, image: url }))}
          />

          {/* ============ SERVICE BANNER ============ */}
          <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              Service Banner (optional)
            </h4>
            <p className="text-xs text-gray-500 mb-3">
              Upload a large banner image for this service. Shown at the top of
              the customer service page. Images are automatically compressed.
            </p>
            <ImageUploader
              label="Banner Image"
              value={subForm.banner}
              onChange={(url) => setSubForm((f) => ({ ...f, banner: url }))}
            />
          </div>

          {/* ============ CHIPS ============ */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Layers size={14} />
                  &quot;What service do you need?&quot; Chips
                </h4>
                <p className="text-xs text-gray-500">
                  Add property types (Apartment, Villa, etc.). Each holds its
                  own packages.
                </p>
              </div>
              <button
                type="button"
                onClick={addSection}
                className="inline-flex items-center gap-1 rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
              >
                <Plus size={12} /> Add Chip
              </button>
            </div>

            {sections.length === 0 && (
              <p className="py-4 text-center text-xs text-gray-400">
                No chips yet. Add at least one (e.g., &quot;1 BHK&quot;).
              </p>
            )}

            <div className="space-y-3">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="rounded-lg border border-gray-200 bg-white p-3"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      className={inputClass}
                      placeholder="Chip name (e.g., 1 BHK)"
                      value={section.name}
                      onChange={(e) =>
                        updateSection(section.id, { name: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeSection(section.id)}
                      className="rounded p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="pl-4 border-l-2 border-indigo-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] uppercase tracking-wide text-gray-400">
                        Packages in this chip
                      </p>
                      <button
                        type="button"
                        onClick={() => addPackage(section.id)}
                        className="text-xs text-indigo-600 hover:underline font-medium"
                      >
                        + Add package
                      </button>
                    </div>

                    {section.packages.length === 0 && (
                      <p className="text-xs text-gray-400 py-2">
                        No packages yet.
                      </p>
                    )}

                    <div className="space-y-2">
                      {section.packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className="rounded-md border border-gray-100 bg-gray-50 p-2 space-y-2"
                        >
                          <div className="flex gap-2">
                            <input
                              className={`${inputClass} flex-1`}
                              placeholder="Package title"
                              value={pkg.title}
                              onChange={(e) =>
                                updatePackage(section.id, pkg.id, {
                                  title: e.target.value,
                                })
                              }
                            />
                            <input
                              type="number"
                              min={0}
                              className={`${inputClass} w-24`}
                              placeholder="₹"
                              value={pkg.price}
                              onChange={(e) =>
                                updatePackage(section.id, pkg.id, {
                                  price: Number(e.target.value),
                                })
                              }
                            />
                            <button
                              type="button"
                              onClick={() => removePackage(section.id, pkg.id)}
                              className="rounded p-1 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <input
                              className={`${inputClass} flex-1`}
                              placeholder="Description"
                              value={pkg.description}
                              onChange={(e) =>
                                updatePackage(section.id, pkg.id, {
                                  description: e.target.value,
                                })
                              }
                            />
                            <input
                              className={`${inputClass} w-32`}
                              placeholder="Duration"
                              value={pkg.duration}
                              onChange={(e) =>
                                updatePackage(section.id, pkg.id, {
                                  duration: e.target.value,
                                })
                              }
                            />
                            <input
                              type="number"
                              min={0}
                              className={`${inputClass} w-24`}
                              placeholder="Options"
                              value={pkg.optionsCount ?? 0}
                              onChange={(e) =>
                                updatePackage(section.id, pkg.id, {
                                  optionsCount: Number(e.target.value),
                                })
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ============ VARIANTS ============ */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  Service Variants (optional)
                </h4>
                <p className="text-xs text-gray-500">
                  Simple quantity-based options like &quot;1 Bathroom ₹499&quot;.
                </p>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
              >
                <Plus size={12} /> Add Variant
              </button>
            </div>

            {variants.length === 0 && (
              <p className="py-4 text-center text-xs text-gray-400">
                No variants. (OK — chips can replace these.)
              </p>
            )}

            <div className="space-y-2">
              {variants.map((v) => (
                <div
                  key={v.id}
                  className="grid grid-cols-12 gap-2 rounded-lg border border-gray-200 bg-white p-2"
                >
                  <input
                    className={`${inputClass} col-span-5`}
                    placeholder="Name"
                    value={v.name}
                    onChange={(e) =>
                      updateVariant(v.id, { name: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    min={0}
                    className={`${inputClass} col-span-3`}
                    placeholder="Price"
                    value={v.price}
                    onChange={(e) =>
                      updateVariant(v.id, { price: Number(e.target.value) })
                    }
                  />
                  <input
                    className={`${inputClass} col-span-3`}
                    placeholder="Note"
                    value={v.description ?? ""}
                    onChange={(e) =>
                      updateVariant(v.id, { description: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(v.id)}
                    className="col-span-1 flex items-center justify-center rounded-md text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {editingSub ? "Update Service" : "Add Service"}
            </button>
            <button
              type="button"
              onClick={closeSubDrawer}
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