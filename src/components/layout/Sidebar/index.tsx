import Image from "next/image";

import logo from "../../../../public/logo.png";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col bg-[#0b4f7a] text-white shadow-xl">
      {/* Brand block matching reference */}
      <div className="px-8 pt-10 text-center">
        <div className="mb-10 flex justify-center">
          <Image
            src={logo}
            alt="QT Global Software logo"
            width={220}
            height={80}
            className="h-16 w-auto"
            priority
          />
        </div>
        <p className="text-sm font-semibold tracking-wide">
          Event Management System
        </p>
        <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 space-y-1 px-3">
        {/* Users - single main item */}
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg bg-[#0f6ca6] px-3 py-2.5 text-sm font-medium shadow-sm transition hover:bg-[#0f73b0]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-base">
            {/* Simple user icon */}
            <span className="inline-block h-2 w-2 rounded-full bg-white" />
          </span>
          <span>Users</span>
        </button>
      </nav>

      {/* Footer hint */}
      <div className="border-t border-white/10 px-6 py-4 text-[11px] text-white/60">
        Users management panel
      </div>
    </aside>
  );
}
