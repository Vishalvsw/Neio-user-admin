"use client";

interface Props {
  sections: {
    id: string;
    title: string;
  }[];
}

export default function ServiceNavigation({ sections }: Props) {

  function scrollToSection(id: string) {
    const el = document.getElementById(id);

    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="sticky top-[72px] z-20 bg-white border-b border-gray-200">

      <div className="mx-auto max-w-6xl px-4 py-4 md:px-6">

        <div className="text-sm font-medium text-gray-900 mb-3">
          What service do you need?
        </div>

        {/* SCROLLABLE NAV */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar">

          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="
              whitespace-nowrap
              border
              border-gray-300
              rounded-full
              px-5
              py-2.5
              text-sm
              bg-white
              hover:border-indigo-500
              hover:text-indigo-600
              transition
              "
            >
              {section.title}
            </button>
          ))}

        </div>

      </div>

    </div>
  );
}