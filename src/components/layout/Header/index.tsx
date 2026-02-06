"use client"

import { useEffect, useState } from "react";
import { BellIcon, SearchIcon } from "lucide-react";

import { STORAGE_KEYS } from "@/lib/constants";

type StoredUser = {
  first_name?: string;
  last_name?: string;
  email?: string;
  status?: string;
};

function getInitials(first?: string, last?: string) {
  const name = `${first ?? ""} ${last ?? ""}`.trim();
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0][0] ?? "";
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`;
}

export default function Header() {
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredUser;
      setUser(parsed);
    } catch {
      // ignore parse errors and keep default user
    }
  }, []);

  const displayName =
    (user?.first_name || user?.last_name)
      ? `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()
      : "User";

  const role = user?.status === "ACTIVE" ? "Active user" : user?.status || "Admin";

  const initials = getInitials(user?.first_name, user?.last_name) || "U";

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      {/* Page title */}
      <div>
        <h1 className="text-sm font-semibold tracking-[0.18em] text-slate-500">
          Users
        </h1>
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
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
            {initials}
          </div>
          <div className="leading-tight text-right">
            <p className="text-sm font-semibold text-slate-800">
              {displayName}
            </p>
            <p className="text-xs text-slate-400">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
