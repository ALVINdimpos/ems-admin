"use client";

import { X } from "lucide-react";
import React, { useEffect } from "react";

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  backdropClassName?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  backdropClassName,
}: IModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: "max-w-sm sm:max-w-md",
    md: "max-w-md sm:max-w-lg",
    lg: "max-w-lg sm:max-w-xl md:max-w-2xl",
    xl: "max-w-2xl sm:max-w-3xl md:max-w-4xl",
  };

  return (
    <aside
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 ${backdropClassName || "bg-black bg-opacity-50"}`}
      />
      {/* Modal Content */}
      <article
        className={`relative bg-white rounded-lg shadow-xl ${sizeStyles[size]} w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <header className="flex items-center justify-between p-3 sm:p-4 md:p-5 border-b border-gray-200 flex-shrink-0">
            {title && (
              <h2
                id="modal-title"
                className="text-base sm:text-lg md:text-xl font-semibold text-black"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            )}
          </header>
        )}

        {/* Body */}
        <section className="p-3 sm:p-4 md:p-6 overflow-y-auto flex-1">
          {children}
        </section>
      </article>
    </aside>
  );
}
