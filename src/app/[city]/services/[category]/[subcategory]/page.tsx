// // // "use client";

// // // import { useParams } from "next/navigation";
// // // import Link from "next/link";

// // // import { LOCATIONS } from "@/lib/locations";
// // // import { SERVICE_REGISTRY } from "@/lib/serviceRegistry";
// // // import { useCategories } from "@/context/CategoriesContext";

// // // import SubcategoryLayout from "@/components/service/SubcategoryLayout";

// // // /* ============================================================
// // //    NOT FOUND SCREEN
// // //    ============================================================ */

// // // function NotFoundScreen({ title = "Service not found" }: { title?: string }) {
// // //   return (
// // //     <div className="mx-auto max-w-xl px-6 py-24 text-center">
// // //       <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
// // //       <p className="mt-3 text-sm text-slate-500">
// // //         The page you&apos;re looking for doesn&apos;t exist or has moved.
// // //       </p>
// // //       <Link
// // //         href="/"
// // //         className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
// // //       >
// // //         Back to Home
// // //       </Link>
// // //     </div>
// // //   );
// // // }

// // // /* ============================================================
// // //    PAGE
// // //    ============================================================ */

// // // export default function SubcategoryPage() {
// // //   const params = useParams<{
// // //     city: string;
// // //     category: string;
// // //     subcategory: string;
// // //   }>();

// // //   const { categories, loading } = useCategories();

// // //   if (loading) {
// // //     return (
// // //       <div className="mx-auto max-w-6xl px-6 py-16 text-center text-sm text-gray-500">
// // //         Loading…
// // //       </div>
// // //     );
// // //   }

// // //   /* ---------- City ---------- */
// // //   const cityData = LOCATIONS.find((c) => c.slug === params.city);
// // //   if (!cityData) {
// // //     return <NotFoundScreen title="City not available" />;
// // //   }

// // //   /* ---------- Category (from ADMIN) ---------- */
// // //   const categoryData = categories.find((c) => c.slug === params.category);
// // //   if (!categoryData) {
// // //     return <NotFoundScreen title="Category not found" />;
// // //   }

// // //   /* ---------- Subcategory (from ADMIN) ---------- */
// // //   const subcategoryData = categoryData.subcategories.find(
// // //     (s) => s.slug === params.subcategory
// // //   );
// // //   if (!subcategoryData) {
// // //     return <NotFoundScreen title="Service not found" />;
// // //   }

// // //   /* ----------------------------------------------------------------
// // //      Registry lookup (static config, with graceful fallback)

// // //      If SERVICE_REGISTRY has a hand-crafted layout for this service,
// // //      use it. Otherwise render a fallback built from admin data.
// // //      ---------------------------------------------------------------- */

// // //   const registryData = SERVICE_REGISTRY[params.subcategory];

// // //   if (registryData?.sections?.length) {
// // //     return (
// // //       <SubcategoryLayout
// // //         city={params.city}
// // //         subcategory={subcategoryData}
// // //         sections={registryData.sections}
// // //         banner={registryData.banner}
// // //       />
// // //     );
// // //   }

// // //   /* ---------- Fallback: build layout from admin data ---------- */
// // //   const fallbackSections = [
// // //     {
// // //       id: "default",
// // //       title: subcategoryData.name,
// // //       services: [
// // //         {
// // //           id: "default-service",
// // //           title: subcategoryData.name,
// // //           description: subcategoryData.description,
// // //           duration: subcategoryData.duration,
// // //           variants:
// // //             subcategoryData.variants.length > 0
// // //               ? subcategoryData.variants.map((v) => ({
// // //                   name: v.name,
// // //                   price: v.price,
// // //                 }))
// // //               : [
// // //                   {
// // //                     name: "Standard",
// // //                     price: subcategoryData.basePrice,
// // //                   },
// // //                 ],
// // //         },
// // //       ],
// // //     },
// // //   ];

// // //   return (
// // //     <SubcategoryLayout
// // //       city={params.city}
// // //       subcategory={subcategoryData}
// // //       sections={fallbackSections}
// // //       banner={undefined}
// // //     />
// // //   );
// // // }



// // "use client";

// // import { useState } from "react";
// // import { useParams } from "next/navigation";
// // import Link from "next/link";

// // import { LOCATIONS } from "@/lib/locations";
// // import { SERVICE_REGISTRY } from "@/lib/serviceRegistry";
// // import { useCategories } from "@/context/CategoriesContext";

// // import SubcategoryLayout from "@/components/service/SubcategoryLayout";

// // /* ============================================================
// //    NOT FOUND SCREEN
// //    ============================================================ */

// // function NotFoundScreen({ title = "Service not found" }: { title?: string }) {
// //   return (
// //     <div className="mx-auto max-w-xl px-6 py-24 text-center">
// //       <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
// //       <p className="mt-3 text-sm text-slate-500">
// //         The page you&apos;re looking for doesn&apos;t exist or has moved.
// //       </p>
// //       <Link
// //         href="/"
// //         className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
// //       >
// //         Back to Home
// //       </Link>
// //     </div>
// //   );
// // }

// // /* ============================================================
// //    CHIPS VIEW — uses the SAME layout structure as SubcategoryLayout
// //    ============================================================ */

// // function ChipsLayout({
// //   city,
// //   subcategoryData,
// // }: {
// //   city: string;
// //   subcategoryData: any;
// // }) {
// //   const [activeIdx, setActiveIdx] = useState(0);
// //   const sections = subcategoryData.sections ?? [];
// //   const activeSection = sections[activeIdx];

// //   if (!activeSection) return null;

// //   return (
// //     <main className="min-h-screen bg-white pb-24">
// //       <div className="mx-auto max-w-5xl px-6 py-10">
// //         {/* Back */}
// //         <Link
// //           href={`/${city}`}
// //           className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
// //         >
// //           ← Back
// //         </Link>

// //         {/* HERO — same as SubcategoryLayout */}
// //         <section className="mt-6 border-b border-gray-100 pb-12">
// //           <h1 className="text-3xl font-semibold text-gray-900">
// //             {subcategoryData.name}
// //           </h1>
// //           <p className="mt-2 text-sm text-gray-600">
// //             Choose an available service option and add it to your booking.
// //           </p>

// //           <div className="mt-6 grid gap-0 rounded-2xl border border-indigo-100 overflow-hidden md:grid-cols-2">
// //             {/* Left panel */}
// //             <div className="bg-indigo-50/40 p-8">
// //               <h2 className="text-2xl font-bold text-gray-900">
// //                 {subcategoryData.name}
// //               </h2>
// //               <p className="mt-3 text-sm text-gray-700">
// //                 {subcategoryData.description ||
// //                   "Review the service details, available options and pricing before adding a service to your cart."}
// //               </p>

// //               <div className="mt-5 flex flex-wrap gap-2">
// //                 <span className="rounded-md border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700">
// //                   Service details
// //                 </span>
// //                 <span className="rounded-md border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700">
// //                   Pricing shown before checkout
// //                 </span>
// //               </div>
// //             </div>

// //             {/* Right panel — gradient card */}
// //             <div className="relative bg-gradient-to-br from-indigo-100 via-indigo-50 to-purple-100 p-8 flex items-center justify-center min-h-[220px]">
// //               <div className="text-center">
// //                 <div className="text-lg font-semibold text-indigo-700">
// //                   {subcategoryData.name}
// //                 </div>
// //                 <div className="mt-2 h-1 w-16 bg-indigo-400/60 rounded-full mx-auto" />
// //                 {subcategoryData.duration && (
// //                   <div className="mt-4 text-xs text-indigo-600/70">
// //                     {subcategoryData.duration}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </section>

// //         {/* CHIPS */}
// //         <section className="border-b border-gray-100 pb-8 mt-10">
// //           <h2 className="text-base font-semibold text-gray-900 mb-4">
// //             What service do you need?
// //           </h2>
// //           <div className="flex flex-wrap gap-3">
// //             {sections.map((section: any, idx: number) => (
// //               <button
// //                 key={section.id}
// //                 onClick={() => setActiveIdx(idx)}
// //                 className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
// //                   idx === activeIdx
// //                     ? "border-indigo-600 bg-indigo-50 text-indigo-700"
// //                     : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
// //                 }`}
// //               >
// //                 {section.name}
// //               </button>
// //             ))}
// //           </div>
// //         </section>

// //         {/* PACKAGES */}
// //         <section className="pt-10">
// //           <h2 className="text-xl font-bold text-gray-900 mb-6">
// //             {activeSection.name}
// //           </h2>

// //           {activeSection.packages.length === 0 ? (
// //             <p className="text-sm text-gray-500">
// //               No packages available in this section yet.
// //             </p>
// //           ) : (
// //             <div className="space-y-4">
// //               {activeSection.packages.map((pkg: any) => (
// //                 <div
// //                   key={pkg.id}
// //                   className="rounded-2xl border-2 border-indigo-100 bg-white p-6 hover:border-indigo-300 transition"
// //                 >
// //                   <div className="flex flex-col sm:flex-row gap-6">
// //                     <div className="flex-1 min-w-0">
// //                       <h3 className="text-lg font-semibold text-gray-900">
// //                         {pkg.title}
// //                       </h3>
// //                       {pkg.description && (
// //                         <p className="mt-1 text-sm text-gray-600">
// //                           {pkg.description}
// //                         </p>
// //                       )}
// //                       {pkg.duration && (
// //                         <p className="mt-3 text-sm text-gray-500">
// //                           ⏱ {pkg.duration}
// //                         </p>
// //                       )}
// //                       {pkg.price > 0 && (
// //                         <p className="mt-4 text-2xl font-bold text-gray-900">
// //                           ₹{pkg.price}
// //                         </p>
// //                       )}
// //                       <Link
// //                         href={`/book?city=${city}&service=${subcategoryData.slug}&package=${pkg.id}`}
// //                         className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700"
// //                       >
// //                         View Details &amp; Reviews
// //                       </Link>
// //                     </div>

// //                     <div className="flex flex-col items-center sm:items-end gap-3 shrink-0 sm:w-40">
// //                       {pkg.image ? (
// //                         <img
// //                           src={pkg.image}
// //                           alt={pkg.title}
// //                           className="h-24 w-32 rounded-xl object-cover"
// //                         />
// //                       ) : (
// //                         <div className="h-24 w-32 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-indigo-300 text-xs">
// //                           No image
// //                         </div>
// //                       )}

// //                       <Link
// //                         href={`/book?city=${city}&service=${subcategoryData.slug}&package=${pkg.id}`}
// //                         className="w-full sm:w-32 text-center rounded-full border-2 border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:border-indigo-500 hover:bg-indigo-50 transition"
// //                       >
// //                         Add
// //                       </Link>

// //                       {(pkg.optionsCount ?? 0) > 0 && (
// //                         <span className="text-[11px] rounded-full px-2 py-0.5 bg-indigo-50 text-indigo-700">
// //                           {pkg.optionsCount} option
// //                           {pkg.optionsCount === 1 ? "" : "s"}
// //                         </span>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </section>
// //       </div>
// //     </main>
// //   );
// // }

// // /* ============================================================
// //    PAGE
// //    ============================================================ */

// // export default function SubcategoryPage() {
// //   const params = useParams<{
// //     city: string;
// //     category: string;
// //     subcategory: string;
// //   }>();

// //   const { categories, loading } = useCategories();

// //   if (loading) {
// //     return (
// //       <div className="mx-auto max-w-6xl px-6 py-16 text-center text-sm text-gray-500">
// //         Loading…
// //       </div>
// //     );
// //   }

// //   /* ---------- City ---------- */
// //   const cityData = LOCATIONS.find((c) => c.slug === params.city);
// //   if (!cityData) {
// //     return <NotFoundScreen title="City not available" />;
// //   }

// //   /* ---------- Category (from ADMIN) ---------- */
// //   const categoryData = categories.find((c) => c.slug === params.category);
// //   if (!categoryData) {
// //     return <NotFoundScreen title="Category not found" />;
// //   }

// //   /* ---------- Subcategory (from ADMIN) ---------- */
// //   const subcategoryData = categoryData.subcategories.find(
// //     (s) => s.slug === params.subcategory
// //   );
// //   if (!subcategoryData) {
// //     return <NotFoundScreen title="Service not found" />;
// //   }

// //   /* ============================================================
// //      NEW: If admin has chips defined → render ChipsLayout
// //      ============================================================ */
// //   const adminSections = subcategoryData.sections ?? [];
// //   if (adminSections.length > 0) {
// //     return (
// //       <ChipsLayout
// //         city={params.city}
// //         subcategoryData={subcategoryData}
// //       />
// //     );
// //   }

// //   /* ============================================================
// //      EXISTING behavior — unchanged
// //      ============================================================ */
// //   const registryData = SERVICE_REGISTRY[params.subcategory];

// //   if (registryData?.sections?.length) {
// //     return (
// //       <SubcategoryLayout
// //         city={params.city}
// //         subcategory={subcategoryData}
// //         sections={registryData.sections}
// //         banner={registryData.banner}
// //       />
// //     );
// //   }

// //   const fallbackSections = [
// //     {
// //       id: "default",
// //       title: subcategoryData.name,
// //       services: [
// //         {
// //           id: "default-service",
// //           title: subcategoryData.name,
// //           description: subcategoryData.description,
// //           duration: subcategoryData.duration,
// //           variants:
// //             subcategoryData.variants.length > 0
// //               ? subcategoryData.variants.map((v) => ({
// //                   name: v.name,
// //                   price: v.price,
// //                 }))
// //               : [
// //                   {
// //                     name: "Standard",
// //                     price: subcategoryData.basePrice,
// //                   },
// //                 ],
// //         },
// //       ],
// //     },
// //   ];

// //   return (
// //     <SubcategoryLayout
// //       city={params.city}
// //       subcategory={subcategoryData}
// //       sections={fallbackSections}
// //       banner={undefined}
// //     />
// //   );
// // }


// "use client";

// import { useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";

// import { LOCATIONS } from "@/lib/locations";
// import { SERVICE_REGISTRY } from "@/lib/serviceRegistry";
// import { useCategories } from "@/context/CategoriesContext";

// import SubcategoryLayout from "@/components/service/SubcategoryLayout";

// /* ============================================================
//    NOT FOUND SCREEN
//    ============================================================ */

// function NotFoundScreen({ title = "Service not found" }: { title?: string }) {
//   return (
//     <div className="mx-auto max-w-xl px-6 py-24 text-center">
//       <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
//       <p className="mt-3 text-sm text-slate-500">
//         The page you&apos;re looking for doesn&apos;t exist or has moved.
//       </p>
//       <Link
//         href="/"
//         className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
//       >
//         Back to Home
//       </Link>
//     </div>
//   );
// }

// /* ============================================================
//    CHIPS WRAPPER
//    Renders SubcategoryLayout with chips-driven sections
//    ============================================================ */

// function ChipsLayout({
//   city,
//   subcategoryData,
// }: {
//   city: string;
//   subcategoryData: any;
// }) {
//   const [activeIdx, setActiveIdx] = useState(0);
//   const sections = subcategoryData.sections ?? [];
//   const activeSection = sections[activeIdx];

//   if (!activeSection) return null;

//   // Convert admin chips into the `sections` shape that
//   // SubcategoryLayout already expects
//   const layoutSections = [
//     {
//       id: `chip-${activeSection.id}`,
//       title: activeSection.name,
//       services: activeSection.packages.map((pkg: any) => ({
//         id: pkg.id,
//         title: pkg.title,
//         description: pkg.description,
//         duration: pkg.duration,
//         image: pkg.image,
//         optionsCount: pkg.optionsCount,
//         variants:
//           pkg.price > 0
//             ? [
//                 {
//                   name: "Standard",
//                   price: pkg.price,
//                 },
//               ]
//             : [],
//       })),
//     },
//   ];

//   return (
//     <div className="relative">
//       {/* Chips bar — sits ABOVE SubcategoryLayout, same width */}
//       <div className="mx-auto max-w-5xl px-6 pt-8">
//         <h2 className="text-base font-semibold text-gray-900 mb-4">
//           What service do you need?
//         </h2>
//         <div className="flex flex-wrap gap-3">
//           {sections.map((section: any, idx: number) => (
//             <button
//               key={section.id}
//               onClick={() => setActiveIdx(idx)}
//               className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
//                 idx === activeIdx
//                   ? "border-indigo-600 bg-indigo-50 text-indigo-700"
//                   : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               {section.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Existing layout — cart sidebar, hero card, and package design all preserved */}
//       <SubcategoryLayout
//         city={city}
//         subcategory={subcategoryData}
//         sections={layoutSections}
//         banner={undefined}
//       />
//     </div>
//   );
// }

// /* ============================================================
//    PAGE
//    ============================================================ */

// export default function SubcategoryPage() {
//   const params = useParams<{
//     city: string;
//     category: string;
//     subcategory: string;
//   }>();

//   const { categories, loading } = useCategories();

//   if (loading) {
//     return (
//       <div className="mx-auto max-w-6xl px-6 py-16 text-center text-sm text-gray-500">
//         Loading…
//       </div>
//     );
//   }

//   /* ---------- City ---------- */
//   const cityData = LOCATIONS.find((c) => c.slug === params.city);
//   if (!cityData) {
//     return <NotFoundScreen title="City not available" />;
//   }

//   /* ---------- Category (from ADMIN) ---------- */
//   const categoryData = categories.find((c) => c.slug === params.category);
//   if (!categoryData) {
//     return <NotFoundScreen title="Category not found" />;
//   }

//   /* ---------- Subcategory (from ADMIN) ---------- */
//   const subcategoryData = categoryData.subcategories.find(
//     (s) => s.slug === params.subcategory
//   );
//   if (!subcategoryData) {
//     return <NotFoundScreen title="Service not found" />;
//   }

//   /* ============================================================
//      If admin has chips → render ChipsLayout
//      (which wraps SubcategoryLayout, so design is identical)
//      ============================================================ */
//   const adminSections = subcategoryData.sections ?? [];
//   if (adminSections.length > 0) {
//     return (
//       <ChipsLayout
//         city={params.city}
//         subcategoryData={subcategoryData}
//       />
//     );
//   }

//   /* ============================================================
//      EXISTING behavior — unchanged
//      ============================================================ */
//   const registryData = SERVICE_REGISTRY[params.subcategory];

//   if (registryData?.sections?.length) {
//     return (
//       <SubcategoryLayout
//         city={params.city}
//         subcategory={subcategoryData}
//         sections={registryData.sections}
//         banner={registryData.banner}
//       />
//     );
//   }

//   const fallbackSections = [
//     {
//       id: "default",
//       title: subcategoryData.name,
//       services: [
//         {
//           id: "default-service",
//           title: subcategoryData.name,
//           description: subcategoryData.description,
//           duration: subcategoryData.duration,
//           variants:
//             subcategoryData.variants.length > 0
//               ? subcategoryData.variants.map((v) => ({
//                   name: v.name,
//                   price: v.price,
//                 }))
//               : [
//                   {
//                     name: "Standard",
//                     price: subcategoryData.basePrice,
//                   },
//                 ],
//         },
//       ],
//     },
//   ];

//   return (
//     <SubcategoryLayout
//       city={params.city}
//       subcategory={subcategoryData}
//       sections={fallbackSections}
//       banner={undefined}
//     />
//   );
// }


"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { LOCATIONS } from "@/lib/locations";
import { SERVICE_REGISTRY } from "@/lib/serviceRegistry";
import { useCategories } from "@/context/CategoriesContext";

import SubcategoryLayout from "@/components/service/SubcategoryLayout";

/* ============================================================
   NOT FOUND SCREEN
   ============================================================ */

function NotFoundScreen({ title = "Service not found" }: { title?: string }) {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-3 text-sm text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Back to Home
      </Link>
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function SubcategoryPage() {
  const params = useParams<{
    city: string;
    category: string;
    subcategory: string;
  }>();

  const { categories, loading } = useCategories();
  const [activeChipIdx, setActiveChipIdx] = useState(0);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16 text-center text-sm text-gray-500">
        Loading…
      </div>
    );
  }

  /* ---------- City ---------- */
  const cityData = LOCATIONS.find((c) => c.slug === params.city);
  if (!cityData) {
    return <NotFoundScreen title="City not available" />;
  }

  /* ---------- Category (from ADMIN) ---------- */
  const categoryData = categories.find((c) => c.slug === params.category);
  if (!categoryData) {
    return <NotFoundScreen title="Category not found" />;
  }

  /* ---------- Subcategory (from ADMIN) ---------- */
  const subcategoryData = categoryData.subcategories.find(
    (s) => s.slug === params.subcategory
  );
  if (!subcategoryData) {
    return <NotFoundScreen title="Service not found" />;
  }

  /* ============================================================
     If admin has chips defined → render chips bar + SubcategoryLayout
     ============================================================ */
  const adminSections = subcategoryData.sections ?? [];

  if (adminSections.length > 0) {
    const activeSection =
      adminSections[activeChipIdx] || adminSections[0];

    // Convert the active chip's packages into the sections shape
    // that SubcategoryLayout already expects.
    const layoutSections = [
      {
        id: `chip-${activeSection.id}`,
        title: activeSection.name,
        services: (activeSection.packages || []).map((pkg: any) => ({
          id: pkg.id,
          title: pkg.title,
          description: pkg.description || "",
          duration: pkg.duration || "",
          image: pkg.image || "",
          optionsCount: pkg.optionsCount ?? 0,
          variants:
            pkg.price > 0
              ? [{ name: "Standard", price: pkg.price }]
              : [],
        })),
      },
    ];

    return (
      <div>
        {/* Chips bar — sits above the existing layout */}
        <div className="mx-auto max-w-5xl px-6 pt-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            What service do you need?
          </h2>
          <div className="flex flex-wrap gap-3">
            {adminSections.map((section: any, idx: number) => (
              <button
                key={section.id}
                onClick={() => setActiveChipIdx(idx)}
                className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                  idx === activeChipIdx
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>

        {/* Existing layout — cart sidebar, hero, packages all preserved */}
        <SubcategoryLayout
          city={params.city}
          subcategory={subcategoryData}
          sections={layoutSections}
          banner={undefined}
        />
      </div>
    );
  }

  /* ============================================================
     EXISTING behavior — unchanged
     ============================================================ */
  const registryData = SERVICE_REGISTRY[params.subcategory];

  if (registryData?.sections?.length) {
    return (
      <SubcategoryLayout
        city={params.city}
        subcategory={subcategoryData}
        sections={registryData.sections}
        banner={registryData.banner}
      />
    );
  }

  const fallbackSections = [
    {
      id: "default",
      title: subcategoryData.name,
      services: [
        {
          id: "default-service",
          title: subcategoryData.name,
          description: subcategoryData.description,
          duration: subcategoryData.duration,
          variants:
            subcategoryData.variants.length > 0
              ? subcategoryData.variants.map((v) => ({
                  name: v.name,
                  price: v.price,
                }))
              : [
                  {
                    name: "Standard",
                    price: subcategoryData.basePrice,
                  },
                ],
        },
      ],
    },
  ];

  return (
    <SubcategoryLayout
      city={params.city}
      subcategory={subcategoryData}
      sections={fallbackSections}
      banner={undefined}
    />
  );
}