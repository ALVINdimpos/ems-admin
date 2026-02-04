"use client";

import { Check, X, AlertTriangle, Info } from "lucide-react";
import { useEffect, useState } from "react";

import type { IToast, ToastType } from "@/context/ToastContext";

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <Check className="h-5 w-5" />,
  error: <X className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
};

const colorMap: Record<
  ToastType,
  { bg: string; border: string; text: string; icon: string }
> = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
    icon: "text-green-500",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    icon: "text-red-500",
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-800",
    icon: "text-yellow-500",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    icon: "text-blue-500",
  },
};

interface IToastItemProps {
  toast: IToast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: IToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const colors = colorMap[toast.type];

  useEffect(() => {
    // Trigger enter animation
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(showTimer);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 200);
  };

  return (
    <div
      className={`
        flex items-start gap-3 w-full max-w-sm p-4 rounded-lg border shadow-lg
        ${colors.bg} ${colors.border}
        transform transition-all duration-200 ease-out
        ${isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
      role="alert"
    >
      <div className={`flex-shrink-0 ${colors.icon}`}>
        {iconMap[toast.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${colors.text}`}>{toast.title}</p>
        {toast.message && (
          <p className={`mt-1 text-sm ${colors.text} opacity-80`}>
            {toast.message}
          </p>
        )}
      </div>
      <button
        onClick={handleRemove}
        className={`flex-shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors ${colors.text}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

interface IToastContainerProps {
  toasts: IToast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: IToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
