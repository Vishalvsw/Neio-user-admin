"use client";

import LocationSelector from "./LocationSelector";
import HeaderSearch from "./HeaderSearch";
import HeaderIcons from "./HeaderIcons";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-indigo-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-400" />

      <div className="mx-auto flex w-full max-w-[1440px] items-center gap-4 px-4 py-3 sm:px-6 lg:gap-6 lg:px-8">
        <div className="w-[185px] shrink-0 lg:w-[220px]">
          <LocationSelector />
        </div>

        <div className="hidden min-w-0 flex-1 md:block">
          <HeaderSearch />
        </div>

        <div className="ml-auto shrink-0">
          <HeaderIcons />
        </div>
      </div>

      <div className="px-4 pb-3 sm:px-6 md:hidden">
        <HeaderSearch />
      </div>
    </header>
  );
}
