"use client";

export default function ServiceBanner({
  title,
  image,
}: {
  title?: string;
  image?: string;
}) {
  // No image passed → render nothing
  if (!image) return null;

  return (
    <div className="mx-auto w-full px-0 py-4">
      <div className="relative w-full aspect-[3/1] overflow-hidden rounded-2xl border border-indigo-100 shadow-sm bg-indigo-50/40">
        <img
          src={image}
          alt={title || "Service banner"}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}