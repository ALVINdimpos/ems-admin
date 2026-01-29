"use client";

import { BellIcon, SearchIcon, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

function generateBreadcrumbs(
  pathname: string
): { label: string; path?: string }[] {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: { label: string; path?: string }[] = [{ label: "🏡" }];

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toLocaleUpperCase() + word.slice(1))
      .join(" ");
    breadcrumbs.push({ label, path: currentPath });
  }

  return breadcrumbs;
}

export default function Header() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-2">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.path || "home"} className="flex items-center gap-2">
            <span
              className={`text-sm ${
                index === breadcrumbs.length - 1
                  ? "font-semibold text-slate-700"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {crumb.label}
            </span>
            {index < breadcrumbs.length - 1 && (
              <ChevronRight className="h-4 w-4 text-slate-400" />
            )}
          </div>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative w-[360px]">
          <input
            type="text"
            placeholder="Search for something"
            className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 shadow-[0_8px_20px_rgba(15,23,42,0.05)] focus:border-[#0f6ca6] focus:bg-white focus:outline-none"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon width={16} height={16} />
          </span>
        </div>

        {/* Notification */}
        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF5FF] text-slate-500 "
        >
          <BellIcon width={18} height={18} className="text-[#7a8bb3]" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold text-white shadow-sm">
            3
          </span>
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
            {/* Placeholder avatar */}
          </div>
          <div className="leading-tight text-right">
            <p className="text-sm font-semibold text-slate-800">John Doe</p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
