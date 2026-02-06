"use client";

import { useState } from "react";
import { DownloadIcon } from "lucide-react";

export function ExportMenu() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        className="inline-flex items-center gap-2 rounded-full bg-[#0b4f7a] px-5 py-2.5 text-sm font-medium text-white"
      >
        <DownloadIcon width={16} height={16} />
        <span>Export</span>
        <span className="text-xs">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-40 rounded-xl bg-white py-2 text-sm text-slate-700 shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
          <button
            className="block w-full px-4 py-1.5 text-left hover:bg-slate-50"
            onClick={close}
          >
            Excel
          </button>
          <button
            className="block w-full px-4 py-1.5 text-left hover:bg-slate-50"
            onClick={close}
          >
            PDF
          </button>
          <button
            className="block w-full px-4 py-1.5 text-left hover:bg-slate-50"
            onClick={close}
          >
            Print
          </button>
        </div>
      )}
    </div>
  );
}

