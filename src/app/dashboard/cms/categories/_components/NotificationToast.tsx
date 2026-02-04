"use client";

import { Check, X } from "lucide-react";

interface INotificationToastProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export function NotificationToast({
  type,
  message,
  onClose,
}: INotificationToastProps) {
  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
        type === "success"
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-red-100 text-red-800 border border-red-200"
      }`}
    >
      {type === "success" ? (
        <Check className="h-4 w-4" />
      ) : (
        <X className="h-4 w-4" />
      )}
      {message}
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
