"use client";
import { X } from "lucide-react";
import { CalendarPlus } from "lucide-react";
import { useEffect } from "react";

import RegistrationForm from "@/components/forms/RegisrationForm";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function RegisterModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 md:px-8">
      <div onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 w-full max-w-md sm:max-w-lg md:max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden mx-auto">
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4">
          <div className="flex items-center gap-2">
            <CalendarPlus className="text-blue-600" size={22} />
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-black">
              Register Event
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition"
          >
            <X size={22} />
          </button>
        </div>
        <div className="h-px bg-gray-200" />
        <div className="p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto">
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
}
